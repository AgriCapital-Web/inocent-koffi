import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DEFAULT_SITE_URL = "https://ikoffi.agricapital.ci";

interface AuditResult {
  slug: string;
  title: string;
  article_number: number | null;
  share_url: string;
  og_image: string;
  og_image_https: boolean;
  og_image_accessible: boolean;
  og_image_status: number | null;
  og_image_size_kb: number | null;
  og_image_size_warning: boolean;
  og_image_size_threshold_kb: number;
  fallback_checks: Array<{
    label: string;
    url: string;
    status: number | null;
    size_kb: number | null;
    accessible: boolean;
    over_threshold: boolean;
  }>;
  og_description: string;
  og_description_has_summary: boolean;
  status: "ok" | "warning" | "error";
  issues: string[];
  /** Human-readable URL of the OG endpoint actually queried for this audit */
  audited_url: string;
  /** HTTP status returned by the OG endpoint */
  audited_http_status: number | null;
}

// Size limits (kB). WhatsApp ~300kB, FB/LinkedIn comfortable up to ~1MB.
const WHATSAPP_LIMIT_KB = 300;
const SOCIAL_LIMIT_KB = 1024;

/**
 * Normalize an OG image URL: decode broken URL encoding, strip whitespace,
 * resolve protocol-relative URLs to https, and warn if it differs from the
 * raw value extracted from the HTML.
 */
function normalizeOgImage(raw: string): { normalized: string; differs: boolean; reason: string | null } {
  if (!raw) return { normalized: "", differs: false, reason: null };
  let v = raw.trim();
  let reason: string | null = null;

  // Resolve protocol-relative
  if (v.startsWith("//")) v = "https:" + v;

  // Try to decode if double/broken-encoded; fall back gracefully
  if (/%25[0-9a-f]{2}/i.test(v)) {
    try { v = decodeURIComponent(v); reason = "URL doublement encodée"; } catch {}
  }

  // Validate URL
  try {
    const u = new URL(v);
    // Re-encode the path segments cleanly to avoid stray spaces/encoded chars
    u.pathname = u.pathname.split("/").map((seg) => {
      try { return encodeURIComponent(decodeURIComponent(seg)); } catch { return seg; }
    }).join("/");
    const cleaned = u.toString();
    const differs = cleaned !== raw;
    if (differs && !reason) reason = "URL normalisée différente";
    return { normalized: cleaned, differs, reason };
  } catch {
    return { normalized: v, differs: v !== raw, reason: "URL invalide ou cassée" };
  }
}

// Exported helpers (test-only) — re-exported below for unit testing.
export { normalizeOgImage as _normalizeOgImage, probeImage as _probeImage, textSimilarity as _textSimilarity };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const siteUrl = (Deno.env.get("SITE_URL") || DEFAULT_SITE_URL).replace(/\/$/, "");
    const ogEndpoint = `${Deno.env.get("SUPABASE_URL")}/functions/v1/og-article`;

    const { data: posts, error } = await supabase
      .from("blog_posts")
      .select("slug, title, excerpt, tagline, article_number, published_at, created_at, updated_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    const results: AuditResult[] = [];

    for (const post of posts || []) {
      const summaryHint = (post.excerpt || post.tagline || "").trim();
      const auditedUrl = `${ogEndpoint}?slug=${encodeURIComponent(post.slug)}`;
      const result: AuditResult = {
        slug: post.slug,
        title: post.title,
        article_number: post.article_number,
        share_url: `${siteUrl}/blog/${post.slug}`,
        og_image: "",
        og_image_https: false,
        og_image_accessible: false,
        og_image_status: null,
        og_image_size_kb: null,
        og_image_size_warning: false,
        og_image_size_threshold_kb: WHATSAPP_LIMIT_KB,
        fallback_checks: [],
        og_description: "",
        og_description_has_summary: false,
        status: "ok",
        issues: [],
        audited_url: auditedUrl,
        audited_http_status: null,
      };

      try {
        const ogResponse = await fetch(auditedUrl, {
          headers: { "User-Agent": "facebookexternalhit/1.1 (audit)" },
          redirect: "follow",
        });
        result.audited_http_status = ogResponse.status;
        const html = await ogResponse.text();

        result.og_image = extractMeta(html, "og:image") || "";
        result.og_description = extractMeta(html, "og:description") || extractName(html, "description") || "";

        // Normalize and compare og:image (catches broken percent-encoding)
        const norm = normalizeOgImage(result.og_image);
        if (norm.differs) {
          result.issues.push(`og:image normalisée diffère de la version extraite (${norm.reason ?? "écart"})`);
        }
        const ogImageUrlForProbe = norm.normalized || result.og_image;

        // HTTPS check
        result.og_image_https = ogImageUrlForProbe.startsWith("https://");
        if (!result.og_image_https) result.issues.push("og:image n'est pas en HTTPS");

        // Accessibility + size check
        if (ogImageUrlForProbe) {
          const probe = await probeImage(ogImageUrlForProbe);
          result.og_image_status = probe.status;
          result.og_image_size_kb = probe.sizeKb;
          result.og_image_accessible = probe.accessible;
          if (!probe.accessible) result.issues.push(`og:image inaccessible (status ${probe.status ?? "n/a"})`);
          if (probe.sizeKb !== null && probe.sizeKb > WHATSAPP_LIMIT_KB) {
            result.og_image_size_warning = true;
            result.issues.push(`og:image trop lourde pour WhatsApp (${probe.sizeKb} kB > ${WHATSAPP_LIMIT_KB} kB)`);
          }
        } else {
          result.issues.push("og:image absent");
        }

        // Probe fallback images so we know the chain is healthy
        const fallbacks = [
          { label: "fallback: launch-1.jpg", url: `${siteUrl}/images/gallery/launch-1.jpg` },
          { label: "fallback: placeholder.svg", url: `${siteUrl}/placeholder.svg` },
        ];
        for (const fb of fallbacks) {
          const p = await probeImage(fb.url);
          const overThreshold = p.sizeKb !== null && p.sizeKb > SOCIAL_LIMIT_KB;
          result.fallback_checks.push({
            label: fb.label,
            url: fb.url,
            status: p.status,
            size_kb: p.sizeKb,
            accessible: p.accessible,
            over_threshold: overThreshold,
          });
          if (!p.accessible) result.issues.push(`${fb.label} inaccessible`);
          if (overThreshold) result.issues.push(`${fb.label} trop lourd (${p.sizeKb} kB)`);
        }

        // Description / summary check
        if (!result.og_description.trim()) {
          result.issues.push("og:description vide");
        } else if (summaryHint) {
          // Tolerance: substring OR token-overlap similarity (handles truncation/punctuation)
          const sim = textSimilarity(summaryHint, result.og_description);
          const desc = result.og_description.toLowerCase();
          const hint = summaryHint.toLowerCase();
          const includesHead = desc.includes(hint.slice(0, 30));
          const includesTail = hint.length > 60 && desc.includes(hint.slice(0, 60).split(" ").slice(0, 6).join(" "));
          result.og_description_has_summary = includesHead || includesTail || sim >= 0.55;
        } else {
          // No hint to compare — non-empty description is acceptable
          result.og_description_has_summary = true;
        }
      } catch (e) {
        result.issues.push(`Erreur audit: ${e instanceof Error ? e.message : "inconnue"}`);
      }

      if (result.issues.length === 0) result.status = "ok";
      else if (result.og_image_accessible && result.og_description) result.status = "warning";
      else result.status = "error";

      results.push(result);
    }

    const summary = {
      total: results.length,
      ok: results.filter((r) => r.status === "ok").length,
      warning: results.filter((r) => r.status === "warning").length,
      error: results.filter((r) => r.status === "error").length,
      checked_at: new Date().toISOString(),
    };

    return new Response(JSON.stringify({ summary, results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Erreur inconnue" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function probeImage(url: string): Promise<{ status: number | null; sizeKb: number | null; accessible: boolean }> {
  try {
    const res = await fetch(url, { method: "GET", redirect: "follow" });
    const ct = res.headers.get("content-type") || "";
    const cl = res.headers.get("content-length");
    let sizeKb: number | null = null;
    if (cl) sizeKb = Math.round(parseInt(cl, 10) / 102.4) / 10;
    else {
      try {
        const buf = await res.arrayBuffer();
        sizeKb = Math.round(buf.byteLength / 102.4) / 10;
      } catch {}
    }
    const accessible = res.ok && (ct.startsWith("image/") || ct === "application/octet-stream" || ct.startsWith("application/svg") || ct.includes("svg"));
    return { status: res.status, sizeKb, accessible };
  } catch {
    return { status: null, sizeKb: null, accessible: false };
  }
}

function extractMeta(html: string, property: string): string | null {
  const re = new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']*)["']`, "i");
  const m = html.match(re);
  return m ? m[1] : null;
}

function extractName(html: string, name: string): string | null {
  const re = new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']*)["']`, "i");
  const m = html.match(re);
  return m ? m[1] : null;
}

// Token-overlap similarity (Jaccard-like) — tolerant to truncation, punctuation, accents.
function textSimilarity(a: string, b: string): number {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 3);
  const A = new Set(norm(a));
  const B = new Set(norm(b));
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  for (const w of A) if (B.has(w)) inter++;
  // Recall on the hint (A) — how much of the source summary appears in the og description
  return inter / A.size;
}