import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const DEFAULT_SITE_URL = "https://ikoffi.agricapital.ci";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const requestUrl = new URL(req.url);
  const slugFromPath = requestUrl.pathname.split("/").filter(Boolean).pop();
  const slug = requestUrl.searchParams.get("slug") || (slugFromPath && slugFromPath !== "og-article" ? slugFromPath : null);

  if (!slug) {
    return new Response("Missing slug", { status: 400, headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("title, excerpt, tagline, content, featured_image, published_at, author, slug")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  const siteUrl = (Deno.env.get("SITE_URL") || DEFAULT_SITE_URL).replace(/\/$/, "");

  if (error || !post) {
    return Response.redirect(`${siteUrl}/blog`, 302);
  }

  const articleUrl = `${siteUrl}/blog/${post.slug}`;
  const author = post.author || "Inocent KOFFI";
  const contentText = stripHtml(post.content || "");
  const summary = truncate(post.excerpt || post.tagline || contentText || post.title, 220);
  const signature = "Inocent KOFFI | Fondateur & CEO AGRICAPITAL SARL";
  const ogDescription = `${summary} — ${signature}. Cliquez pour lire l'article complet.`;

  let imageUrl = post.featured_image || `${siteUrl}/og-image.png`;
  if (imageUrl && !imageUrl.startsWith("http")) {
    imageUrl = `${siteUrl}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
  }

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(post.title)} - ${escapeHtml(author)}</title>
  <meta name="description" content="${escapeHtml(ogDescription)}">

  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(post.title)}">
  <meta property="og:description" content="${escapeHtml(ogDescription)}">
  <meta property="og:image" content="${escapeHtml(imageUrl)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="${escapeHtml(articleUrl)}">
  <meta property="og:site_name" content="Inocent KOFFI">
  <meta property="article:published_time" content="${post.published_at || ""}">
  <meta property="article:author" content="${escapeHtml(author)}">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(post.title)}">
  <meta name="twitter:description" content="${escapeHtml(ogDescription)}">
  <meta name="twitter:image" content="${escapeHtml(imageUrl)}">

  <meta http-equiv="refresh" content="0;url=${escapeHtml(articleUrl)}">
  <link rel="canonical" href="${escapeHtml(articleUrl)}">
</head>
<body>
  <p>Redirection vers l'article...</p>
  <script>window.location.replace(${JSON.stringify(articleUrl)});</script>
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
