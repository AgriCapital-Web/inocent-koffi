import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DEFAULT_SITE_URL = "https://ikoffi.agricapital.ci";
const KEY_PAGES: Array<{ path: string; expected: { locale?: string; titleHints?: string[] } }> = [
  { path: "/", expected: { locale: "fr_FR", titleHints: ["KOFFI", "AGRICAPITAL"] } },
  { path: "/a-propos", expected: { locale: "fr_FR" } },
  { path: "/agricapital", expected: { locale: "fr_FR", titleHints: ["AGRICAPITAL"] } },
  { path: "/vision", expected: { locale: "fr_FR" } },
  { path: "/projets", expected: { locale: "fr_FR" } },
  { path: "/blog", expected: { locale: "fr_FR" } },
  { path: "/contact", expected: { locale: "fr_FR" } },
  { path: "/portfolio", expected: { locale: "fr_FR" } },
  { path: "/evolution", expected: { locale: "fr_FR" } },
  { path: "/partenariat", expected: { locale: "fr_FR" } },
];

interface RouteResult {
  path: string;
  url: string;
  http_status: number | null;
  og_image: string | null;
  og_image_https: boolean;
  og_description: string | null;
  og_locale: string | null;
  expected_locale: string | null;
  locale_ok: boolean;
  description_ok: boolean;
  image_ok: boolean;
  issues: string[];
}

function extractMeta(html: string, property: string) {
  const re = new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']*)["']`, "i");
  return html.match(re)?.[1] ?? null;
}

async function auditPath(siteUrl: string, path: string, expected: { locale?: string; titleHints?: string[] }): Promise<RouteResult> {
  const url = `${siteUrl}${path}`;
  const result: RouteResult = {
    path,
    url,
    http_status: null,
    og_image: null,
    og_image_https: false,
    og_description: null,
    og_locale: null,
    expected_locale: expected.locale ?? null,
    locale_ok: false,
    description_ok: false,
    image_ok: false,
    issues: [],
  };

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "facebookexternalhit/1.1 (routes-audit)" },
      redirect: "follow",
    });
    result.http_status = res.status;
    const html = await res.text();

    result.og_image = extractMeta(html, "og:image");
    result.og_description = extractMeta(html, "og:description") || extractMeta(html, "description");
    result.og_locale = extractMeta(html, "og:locale");

    if (!result.og_image) result.issues.push("og:image manquant");
    else {
      result.og_image_https = result.og_image.startsWith("https://");
      if (!result.og_image_https) result.issues.push("og:image non HTTPS");
      result.image_ok = result.og_image_https;
    }

    if (!result.og_description) result.issues.push("og:description manquant");
    else if (result.og_description.length < 30) result.issues.push("og:description trop court");
    else result.description_ok = true;

    if (expected.locale) {
      result.locale_ok = result.og_locale === expected.locale;
      if (!result.locale_ok) result.issues.push(`og:locale attendu ${expected.locale}, reçu ${result.og_locale ?? "(absent)"}`);
    } else {
      result.locale_ok = true;
    }

    if (expected.titleHints?.length) {
      const titleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i);
      const ogTitle = titleMatch?.[1] ?? "";
      const missing = expected.titleHints.filter((h) => !ogTitle.toLowerCase().includes(h.toLowerCase()));
      if (missing.length) result.issues.push(`og:title devrait contenir ${missing.join(", ")}`);
    }
  } catch (e) {
    result.issues.push(`Erreur HTTP : ${e instanceof Error ? e.message : "inconnue"}`);
  }

  return result;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // --- AuthN/AuthZ: only admins may trigger this expensive crawl ---
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const authClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );
    const { data: userData, error: userErr } = await authClient.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .in("role", ["admin", "super_admin"])
      .maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const siteUrl = (Deno.env.get("SITE_URL") || DEFAULT_SITE_URL).replace(/\/$/, "");

    const ogEndpoint = `${Deno.env.get("SUPABASE_URL")}/functions/v1/og-article`;
    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(40);

    const pageResults = await Promise.all(
      KEY_PAGES.map((p) => auditPath(siteUrl, p.path, p.expected))
    );

    const articleResults: RouteResult[] = [];
    for (const p of posts || []) {
      const url = `${ogEndpoint}?slug=${encodeURIComponent(p.slug)}`;
      const r: RouteResult = {
        path: `/blog/${p.slug}`,
        url,
        http_status: null,
        og_image: null,
        og_image_https: false,
        og_description: null,
        og_locale: null,
        expected_locale: "fr_FR",
        locale_ok: false,
        description_ok: false,
        image_ok: false,
        issues: [],
      };
      try {
        const res = await fetch(url, {
          headers: { "User-Agent": "facebookexternalhit/1.1 (routes-audit)" },
          redirect: "follow",
        });
        r.http_status = res.status;
        const html = await res.text();
        r.og_image = extractMeta(html, "og:image");
        r.og_description = extractMeta(html, "og:description");
        r.og_locale = extractMeta(html, "og:locale");
        r.og_image_https = !!r.og_image?.startsWith("https://");
        r.image_ok = r.og_image_https;
        r.description_ok = !!r.og_description && r.og_description.length >= 30;
        r.locale_ok = r.og_locale === "fr_FR" || r.og_locale === "en_US";
        if (!r.og_image_https) r.issues.push("og:image non HTTPS");
        if (!r.description_ok) r.issues.push("og:description vide ou trop court");
        if (!r.locale_ok) r.issues.push(`og:locale invalide (${r.og_locale ?? "absent"})`);
      } catch (e) {
        r.issues.push(`Erreur: ${e instanceof Error ? e.message : "?"}`);
      }
      articleResults.push(r);
    }

    const all = [...pageResults, ...articleResults];
    const summary = {
      total: all.length,
      pages: pageResults.length,
      articles: articleResults.length,
      ok: all.filter((r) => r.issues.length === 0).length,
      with_issues: all.filter((r) => r.issues.length > 0).length,
      missing_image: all.filter((r) => !r.image_ok).length,
      missing_description: all.filter((r) => !r.description_ok).length,
      wrong_locale: all.filter((r) => !r.locale_ok).length,
      checked_at: new Date().toISOString(),
    };

    // Determine source (cron vs manual) — strict allowlist to prevent stored XSS
    const ALLOWED_SOURCES = new Set(["manual", "cron", "scheduled"]);
    let source = "manual";
    try {
      const body = req.method === "POST" ? await req.clone().json().catch(() => ({})) : {};
      const raw = body && (body as any).source ? String((body as any).source) : "manual";
      source = ALLOWED_SOURCES.has(raw) ? raw : "manual";
    } catch (_) { /* ignore */ }

    // Persist history snapshot (best-effort)
    try {
      await supabase.from("og_audit_history").insert({
        summary,
        results: all,
        total: summary.total,
        with_issues: summary.with_issues,
        source,
      });
    } catch (e) {
      console.error("og_audit_history insert failed", e);
    }

    return new Response(JSON.stringify({ summary, results: all }), {
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