import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");

  if (!slug) {
    return new Response("Missing slug", { status: 400, headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("title, excerpt, tagline, featured_image, published_at, author, slug")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !post) {
    // Redirect to blog page if article not found
    return Response.redirect("https://ikoffi.agricapital.ci/blog", 302);
  }

  const articleUrl = `https://ikoffi.agricapital.ci/blog/${post.slug}`;
  const description = post.excerpt || post.tagline || post.title;
  const author = post.author || "Inocent KOFFI";
  
  // Ensure image URL is absolute
  let imageUrl = post.featured_image || "https://ikoffi.agricapital.ci/og-image-profile.png";
  if (imageUrl && !imageUrl.startsWith("http")) {
    imageUrl = `https://ikoffi.agricapital.ci${imageUrl}`;
  }

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(post.title)} - ${escapeHtml(author)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  
  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(post.title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${escapeHtml(imageUrl)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="${escapeHtml(articleUrl)}">
  <meta property="og:site_name" content="Inocent KOFFI - AGRICAPITAL">
  <meta property="article:published_time" content="${post.published_at || ''}">
  <meta property="article:author" content="${escapeHtml(author)}">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(post.title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${escapeHtml(imageUrl)}">
  
  <!-- Redirect real users to the actual article page -->
  <meta http-equiv="refresh" content="0;url=${escapeHtml(articleUrl)}">
  <link rel="canonical" href="${escapeHtml(articleUrl)}">
</head>
<body>
  <p>Redirection vers l'article...</p>
  <script>window.location.replace("${articleUrl}");</script>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      ...corsHeaders,
    },
  });
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
