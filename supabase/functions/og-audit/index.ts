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
  og_description: string;
  og_description_has_summary: boolean;
  status: "ok" | "warning" | "error";
  issues: string[];
}

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
        og_description: "",
        og_description_has_summary: false,
        status: "ok",
        issues: [],
      };

      try {
        const ogResponse = await fetch(`${ogEndpoint}?slug=${encodeURIComponent(post.slug)}`, {
          headers: { "User-Agent": "facebookexternalhit/1.1 (audit)" },
          redirect: "follow",
        });
        const html = await ogResponse.text();

        result.og_image = extractMeta(html, "og:image") || "";
        result.og_description = extractMeta(html, "og:description") || extractName(html, "description") || "";

        // HTTPS check
        result.og_image_https = result.og_image.startsWith("https://");
        if (!result.og_image_https) result.issues.push("og:image n'est pas en HTTPS");

        // Accessibility + size check
        if (result.og_image) {
          try {
            const imgRes = await fetch(result.og_image, { method: "GET", redirect: "follow" });
            result.og_image_status = imgRes.status;
            const ct = imgRes.headers.get("content-type") || "";
            const cl = imgRes.headers.get("content-length");
            if (cl) result.og_image_size_kb = Math.round(parseInt(cl, 10) / 102.4) / 10;
            else {
              const buf = await imgRes.arrayBuffer();
              result.og_image_size_kb = Math.round(buf.byteLength / 102.4) / 10;
            }
            result.og_image_accessible = imgRes.ok && (ct.startsWith("image/") || ct === "application/octet-stream");
            if (!result.og_image_accessible) result.issues.push(`og:image inaccessible (status ${imgRes.status})`);
          } catch (e) {
            result.issues.push(`og:image fetch failed: ${e instanceof Error ? e.message : "unknown"}`);
          }
        } else {
          result.issues.push("og:image absent");
        }

        // Description / summary check
        if (!result.og_description.trim()) {
          result.issues.push("og:description vide");
        } else if (summaryHint && !result.og_description.toLowerCase().includes(summaryHint.slice(0, 30).toLowerCase())) {
          // Not a hard error — fallback content is acceptable
          result.og_description_has_summary = false;
        } else {
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