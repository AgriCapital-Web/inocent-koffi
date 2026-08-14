// Synchronisation automatique des nouveautés d'agricapital.ci
// - N'écrase JAMAIS un contenu déjà importé (les textes restent intacts)
// - Ajoute uniquement les nouvelles actualités et images détectées
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SOURCES = [
  "https://agricapital.ci/",
  "https://agricapital.ci/actualites",
  "https://agricapital.ci/actualites/",
  "https://agricapital.ci/blog",
];

const decode = (s: string) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&[a-zA-Z]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const strip = (html: string) => decode(html.replace(/<[^>]+>/g, " "));

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 90);

type Item = {
  slug: string;
  title: string;
  excerpt: string | null;
  content: string[];
  image: string | null;
  image_alt: string | null;
  source_url: string;
  category: string;
};

function extractItems(html: string, sourceUrl: string): Item[] {
  const items: Item[] = [];

  // 1) JSON-LD (Article / NewsArticle / BlogPosting)
  const ldMatches = html.matchAll(
    /<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi,
  );
  for (const m of ldMatches) {
    try {
      const parsed = JSON.parse(m[1].trim());
      const nodes = Array.isArray(parsed) ? parsed : [parsed, ...(parsed["@graph"] ?? [])];
      for (const node of nodes) {
        const type = String(node?.["@type"] ?? "");
        if (!/Article|BlogPosting|NewsArticle/i.test(type)) continue;
        const title = decode(String(node.headline ?? node.name ?? ""));
        if (!title) continue;
        items.push({
          slug: slugify(title),
          title,
          excerpt: node.description ? decode(String(node.description)) : null,
          content: node.articleBody ? [decode(String(node.articleBody))] : [],
          image: typeof node.image === "string" ? node.image : node.image?.url ?? null,
          image_alt: title,
          source_url: node.url ?? sourceUrl,
          category: "Actualité",
        });
      }
    } catch (_) {
      // JSON-LD invalide — on ignore
    }
  }

  // 2) Fallback : blocs <article>
  if (items.length === 0) {
    const articles = html.matchAll(/<article[\s\S]{0,60}?>([\s\S]*?)<\/article>/gi);
    for (const a of articles) {
      const block = a[1];
      const heading = block.match(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/i);
      if (!heading) continue;
      const title = strip(heading[1]);
      if (title.length < 8) continue;
      const paragraphs = [...block.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
        .map((p) => strip(p[1]))
        .filter((t) => t.length > 40);
      const img = block.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
      items.push({
        slug: slugify(title),
        title,
        excerpt: paragraphs[0] ?? null,
        content: paragraphs,
        image: img?.[1] ?? null,
        image_alt: title,
        source_url: sourceUrl,
        category: "Actualité",
      });
    }
  }

  return items.filter((i) => i.slug.length > 5);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const collected = new Map<string, Item>();
    const visited: { url: string; status: number; found: number }[] = [];

    for (const url of SOURCES) {
      try {
        const res = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; ikoffi-sync/1.0)",
            "Accept-Language": "fr-FR,fr;q=0.9",
          },
        });
        const found = res.ok ? extractItems(await res.text(), url) : [];
        visited.push({ url, status: res.status, found: found.length });
        for (const item of found) if (!collected.has(item.slug)) collected.set(item.slug, item);
      } catch (e) {
        visited.push({ url, status: 0, found: 0 });
        console.error("fetch failed", url, String(e));
      }
    }

    const { data: existing } = await supabase.from("agricapital_news").select("slug");
    const known = new Set((existing ?? []).map((r: { slug: string }) => r.slug));
    const newItems = [...collected.values()].filter((i) => !known.has(i.slug));

    let inserted = 0;
    if (newItems.length > 0) {
      const { error } = await supabase.from("agricapital_news").insert(
        newItems.map((i) => ({
          ...i,
          date: new Date().toISOString().slice(0, 10),
          date_label: new Date().toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
        })),
      );
      if (error) throw new Error(error.message);
      inserted = newItems.length;
    }

    return new Response(
      JSON.stringify({ ok: true, scanned: collected.size, inserted, visited }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("sync-agricapital error", String(e));
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
