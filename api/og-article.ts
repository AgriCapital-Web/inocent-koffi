const SITE_URL = "https://ikoffi.agricapital.ci";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function firstImage(value: unknown, fallback: string | null): string | null {
  if (Array.isArray(value)) {
    const first = value.find((item): item is string => typeof item === "string" && item.trim());
    return first || fallback;
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        const first = parsed.find((item): item is string => typeof item === "string" && item.trim());
        return first || fallback;
      }
    } catch {
      return fallback;
    }
  }
  return fallback;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = (url.searchParams.get("slug") || "").trim().toLowerCase();

  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return new Response("Article introuvable", { status: 404 });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const publishableKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    return new Response("Configuration éditoriale indisponible", { status: 500 });
  }

  const endpoint = new URL(supabaseUrl + "/rest/v1/news");
  endpoint.searchParams.set("select", "slug,title_fr,excerpt_fr,content_fr,featured_image,images,category,published_at,is_published");
  endpoint.searchParams.set("slug", "eq." + slug);
  endpoint.searchParams.set("is_published", "eq.true");
  endpoint.searchParams.set("limit", "1");

  const response = await fetch(endpoint, {
    headers: {
      apikey: publishableKey,
      Authorization: "Bearer " + publishableKey,
    },
  });

  if (!response.ok) {
    return new Response("Impossible de charger la publication", { status: 502 });
  }

  const rows = await response.json();
  const article = rows?.[0];

  if (!article) {
    return new Response("Article introuvable", { status: 404 });
  }

  const title = String(article.title_fr || "Actualités — Inocent KOFFI");
  const description = String(
    article.excerpt_fr ||
    stripHtml(String(article.content_fr || "")).slice(0, 180) ||
    "Actualités, analyses et publications d'Inocent KOFFI."
  );
  const image = firstImage(article.images, article.featured_image);
  const canonical = SITE_URL + "/new/" + encodeURIComponent(article.slug);
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description.slice(0, 300));
  const safeCanonical = escapeHtml(canonical);
  const safeImage = image ? escapeHtml(String(image)) : "";

  const html = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>${safeTitle} | Actualités — Inocent KOFFI</title>
  <meta name="description" content="${safeDescription}">
  <link rel="canonical" href="${safeCanonical}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Inocent KOFFI">
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeDescription}">
  <meta property="og:url" content="${safeCanonical}">
  ${safeImage ? `<meta property="og:image" content="${safeImage}">` : ""}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${safeTitle}">
  <meta name="twitter:description" content="${safeDescription}">
  ${safeImage ? `<meta name="twitter:image" content="${safeImage}">` : ""}
</head>
<body>
  <p><a href="${safeCanonical}">${safeTitle}</a></p>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}
