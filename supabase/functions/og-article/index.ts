import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const DEFAULT_SITE_URL = "https://ikoffi.agricapital.ci";

// User agents of social crawlers / link previewers — these get HTML with OG meta
const CRAWLER_REGEX = /facebookexternalhit|facebot|twitterbot|linkedinbot|whatsapp|slackbot|telegrambot|discordbot|pinterest|skypeuripreview|googlebot|bingbot|embedly|outbrain|vkshare|w3c_validator|redditbot|applebot|yahoo|duckduckbot|baiduspider|tumblr|flipboardproxy|nuzzel|bitlybot|qwantify/i;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const requestUrl = new URL(req.url);
  const userAgent = req.headers.get("user-agent") || "";
  const isCrawler = CRAWLER_REGEX.test(userAgent);

  // Accept either ?code=art004-026 or ?slug=...
  let code = requestUrl.searchParams.get("code");
  let slug = requestUrl.searchParams.get("slug");

  // Also support path style like /og-article/art004-026
  if (!code && !slug) {
    const last = requestUrl.pathname.split("/").filter(Boolean).pop();
    if (last && last !== "og-article") {
      if (/^art\d+-\d+$/i.test(last)) code = last;
      else slug = last;
    }
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const siteUrl = (Deno.env.get("SITE_URL") || DEFAULT_SITE_URL).replace(/\/$/, "");

  let post: any = null;

  if (code) {
    const match = code.match(/^art(\d+)-(\d+)$/i);
    if (match) {
      const num = parseInt(match[1], 10);
      const yearShort = parseInt(match[2], 10);
      const { data } = await supabase
        .from("blog_posts")
        .select("title, excerpt, tagline, content, featured_image, published_at, author, slug, article_number")
        .eq("article_number", num)
        .eq("is_published", true)
        .maybeSingle();

      if (data) {
        const yearOk = data.published_at
          ? (new Date(data.published_at).getFullYear() % 1000) === yearShort
          : true;
        if (yearOk) post = data;
      }
    }
  }

  if (!post && slug) {
    const { data } = await supabase
      .from("blog_posts")
      .select("title, excerpt, tagline, content, featured_image, published_at, author, slug, article_number")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (data) post = data;
  }

  if (!post) {
    if (isCrawler) {
      return Response.redirect(`${siteUrl}/blog`, 302);
    }
    return Response.redirect(`${siteUrl}/blog`, 302);
  }

  const articleUrl = `${siteUrl}/blog/${post.slug}`;
  const shortUrl = code ? `${siteUrl}/new/${code}` : slug ? `${siteUrl}/new/${slug}` : articleUrl;

  // ── Humans: redirect immediately to the real article page (clean SPA route) ──
  if (!isCrawler) {
    return Response.redirect(articleUrl, 302);
  }

  // ── Crawlers: serve full HTML with OG meta ──
  const author = post.author || "Inocent KOFFI";
  const contentText = stripHtml(post.content || "");
  const summary = truncate(post.excerpt || post.tagline || contentText || post.title, 220);
  const signature = "Inocent KOFFI | Fondateur AGRICAPITAL SARL";
  const ogDescription = `${summary} — ${signature}`;

  // CRITICAL: Use the article's featured image ONLY. Never fall back to logo or founder photo.
  let imageUrl = "";
  if (post.featured_image) {
    imageUrl = post.featured_image;
    if (!imageUrl.startsWith("http")) {
      imageUrl = `${siteUrl}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
    }
  }

  // Optimize image for social crawlers (WhatsApp <300KB, FB/LinkedIn 1200x630 JPEG).
  // Route through wsrv.nl which converts PNG→JPEG and resizes — keeps file <200KB.
  const optimizedImageUrl = imageUrl
    ? `https://wsrv.nl/?url=${encodeURIComponent(imageUrl.replace(/^https?:\/\//, ""))}&w=1200&h=630&fit=cover&output=jpg&q=82`
    : "";

  // If no featured image, don't set an OG image at all rather than using a default
  const imageMetaTags = optimizedImageUrl ? `
  <meta property="og:image" content="${escapeHtml(optimizedImageUrl)}">
  <meta property="og:image:secure_url" content="${escapeHtml(optimizedImageUrl)}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${escapeHtml(post.title)}">
  <meta name="twitter:image" content="${escapeHtml(optimizedImageUrl)}">` : "";

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(post.title)} - ${escapeHtml(author)}</title>
  <meta name="description" content="${escapeHtml(ogDescription)}">

  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(post.title)}">
  <meta property="og:description" content="${escapeHtml(ogDescription)}">
  ${imageMetaTags}
  <meta property="og:url" content="${escapeHtml(shortUrl)}">
  <meta property="og:site_name" content="Inocent KOFFI - AGRICAPITAL">
  <meta property="article:published_time" content="${post.published_at || ""}">
  <meta property="article:author" content="${escapeHtml(author)}">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(post.title)}">
  <meta name="twitter:description" content="${escapeHtml(ogDescription)}">

  <link rel="canonical" href="${escapeHtml(shortUrl)}">
</head>
<body>
  <h1>${escapeHtml(post.title)}</h1>
  <p>${escapeHtml(ogDescription)}</p>
  <p><a href="${escapeHtml(articleUrl)}">Lire l'article complet</a></p>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=600",
      ...corsHeaders,
    },
  });
});

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 1).trim()}…` : value;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
