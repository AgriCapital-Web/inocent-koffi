import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const DEFAULT_SITE_URL = "https://ikoffi.agricapital.ci";
const CRAWLER_REGEX = /facebookexternalhit|facebot|twitterbot|linkedinbot|whatsapp|slackbot|telegrambot|discordbot|pinterest|skypeuripreview|googlebot|bingbot|embedly|outbrain|vkshare|w3c_validator|redditbot|applebot|yahoo|duckduckbot|baiduspider|tumblr|flipboardproxy|nuzzel|bitlybot|qwantify/i;
const WHATSAPP_REGEX = /whatsapp/i;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const requestUrl = new URL(req.url);
  const userAgent = req.headers.get("user-agent") || "";
  const isCrawler = CRAWLER_REGEX.test(userAgent);
  const isWhatsApp = WHATSAPP_REGEX.test(userAgent);

  let code = requestUrl.searchParams.get("code");
  let slug = requestUrl.searchParams.get("slug");
  const requestedVersion = sanitizeVersion(requestUrl.searchParams.get("v"));

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
        .select("title, excerpt, tagline, content, featured_image, published_at, updated_at, created_at, author, slug, article_number")
        .eq("article_number", num)
        .eq("is_published", true)
        .maybeSingle();

      if (data) {
        const publishedDate = data.published_at || data.created_at;
        const yearOk = publishedDate
          ? (new Date(publishedDate).getFullYear() % 1000) === yearShort
          : true;
        if (yearOk) post = data;
      }
    }
  }

  if (!post && slug) {
    const { data } = await supabase
      .from("blog_posts")
      .select("title, excerpt, tagline, content, featured_image, published_at, updated_at, created_at, author, slug, article_number")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    if (data) post = data;
  }

  if (!post) {
    return Response.redirect(`${siteUrl}/blog`, 302);
  }

  const articleUrl = `${siteUrl}/blog/${post.slug}`;
  const shortCode = buildShortCode(post.article_number, post.published_at || post.created_at);
  const shareBaseUrl = shortCode ? `${siteUrl}/new/${shortCode}` : articleUrl;
  const cacheVersion = requestedVersion || buildCacheVersion(post.updated_at || post.published_at || post.created_at || post.slug);
  const shareUrl = appendQueryParam(shareBaseUrl, "v", cacheVersion);

  if (!isCrawler) {
    return Response.redirect(articleUrl, 302);
  }

  const author = post.author || "Inocent KOFFI";
  const contentText = stripHtml(post.content || "");
  const summary = truncate(post.excerpt || post.tagline || contentText || post.title, 180);
  const resolvedImage = await resolveSocialImage({
    rawImageUrl: post.featured_image,
    siteUrl,
    cacheVersion,
    isWhatsApp,
  });

  const imageMetaTags = resolvedImage ? `
  <meta property="og:image" content="${escapeHtml(resolvedImage)}">
  <meta property="og:image:url" content="${escapeHtml(resolvedImage)}">
  <meta property="og:image:secure_url" content="${escapeHtml(resolvedImage)}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="${isWhatsApp ? "720" : "1200"}">
  <meta property="og:image:height" content="${isWhatsApp ? "378" : "630"}">
  <meta property="og:image:alt" content="${escapeHtml(post.title)}">
  <meta name="twitter:image" content="${escapeHtml(resolvedImage)}">` : "";

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(post.title)} - ${escapeHtml(author)}</title>
  <meta name="description" content="${escapeHtml(summary)}">

  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(post.title)}">
  <meta property="og:description" content="${escapeHtml(summary)}">
  ${imageMetaTags}
  <meta property="og:url" content="${escapeHtml(shareUrl)}">
  <meta property="og:site_name" content="Inocent KOFFI - AGRICAPITAL">
  <meta property="og:locale" content="fr_FR">
  <meta property="article:published_time" content="${escapeHtml(post.published_at || post.created_at || "")}">
  <meta property="article:author" content="${escapeHtml(author)}">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(post.title)}">
  <meta name="twitter:description" content="${escapeHtml(summary)}">

  <link rel="canonical" href="${escapeHtml(articleUrl)}">
</head>
<body>
  <h1>${escapeHtml(post.title)}</h1>
  <p>${escapeHtml(summary)}</p>
  <p><a href="${escapeHtml(articleUrl)}">Lire l'article complet</a></p>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
      ...corsHeaders,
    },
  });
});

async function resolveSocialImage({
  rawImageUrl,
  siteUrl,
  cacheVersion,
  isWhatsApp,
}: {
  rawImageUrl: string | null;
  siteUrl: string;
  cacheVersion: string;
  isWhatsApp: boolean;
}): Promise<string> {
  const normalizedSourceUrl = normalizeHttpsUrl(rawImageUrl, siteUrl);
  if (!normalizedSourceUrl) return "";

  const sourceAccessible = await isAccessibleImage(normalizedSourceUrl);
  if (!sourceAccessible) return "";

  const optimizedUrl = buildOptimizedImageUrl(normalizedSourceUrl, cacheVersion, isWhatsApp);
  if (optimizedUrl) {
    const optimizedAccessible = await isAccessibleImage(optimizedUrl);
    if (optimizedAccessible) return optimizedUrl;
  }

  return appendQueryParam(normalizedSourceUrl, "v", cacheVersion);
}

function buildOptimizedImageUrl(sourceUrl: string, cacheVersion: string, isWhatsApp: boolean): string {
  const storageMatch = sourceUrl.match(/^https:\/\/[^/]+\/storage\/v1\/object\/public\/([^?]+)$/i);
  if (!storageMatch) {
    return appendQueryParam(sourceUrl, "v", cacheVersion);
  }

  const sourceOrigin = new URL(sourceUrl).origin;

  const width = isWhatsApp ? "480" : "1200";
  const height = isWhatsApp ? "252" : "630";
  const quality = isWhatsApp ? "40" : "80";
  const storagePath = storageMatch[1];

  return `${sourceOrigin}/storage/v1/render/image/public/${storagePath}?width=${width}&height=${height}&resize=cover&quality=${quality}&v=${encodeURIComponent(cacheVersion)}`;
}

async function isAccessibleImage(url: string): Promise<boolean> {
  try {
    const headResponse = await fetch(url, { method: "HEAD", redirect: "follow" });
    if (headResponse.ok) {
      const contentType = headResponse.headers.get("content-type") || "";
      return contentType.startsWith("image/") || contentType === "application/octet-stream";
    }
  } catch {
  }

  try {
    const getResponse = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: { Range: "bytes=0-0" },
    });
    if (!getResponse.ok) return false;
    const contentType = getResponse.headers.get("content-type") || "";
    return contentType.startsWith("image/") || contentType === "application/octet-stream";
  } catch {
    return false;
  }
}

function normalizeHttpsUrl(rawImageUrl: string | null, siteUrl: string): string {
  if (!rawImageUrl) return "";

  try {
    const trimmed = rawImageUrl.trim();
    const decoded = safelyDecode(trimmed);
    const url = decoded.startsWith("//")
      ? new URL(`https:${decoded}`)
      : new URL(decoded, siteUrl);

    url.protocol = "https:";
    return url.toString();
  } catch {
    return "";
  }
}

function safelyDecode(value: string): string {
  try {
    return decodeURI(value);
  } catch {
    return value;
  }
}

function buildShortCode(articleNumber: number | null, dateValue: string | null): string {
  if (!articleNumber || !dateValue) return "";
  const yearShort = (new Date(dateValue).getFullYear() % 1000).toString().padStart(3, "0");
  return `art${String(articleNumber).padStart(3, "0")}-${yearShort}`;
}

function buildCacheVersion(value: string): string {
  return value.replace(/[^0-9a-z]/gi, "").slice(0, 16) || Date.now().toString(36);
}

function sanitizeVersion(value: string | null): string {
  if (!value) return "";
  return value.replace(/[^0-9a-z_-]/gi, "").slice(0, 40);
}

function appendQueryParam(url: string, key: string, value: string): string {
  const parsed = new URL(url);
  parsed.searchParams.set(key, value);
  return parsed.toString();
}

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
