const SITE = "https://ikoffi.agricapital.ci";

export function buildShortUrl(articleNumber?: number | null, publishedAt?: string | null): string | null {
  if (!articleNumber) return null;
  const year = (publishedAt ? new Date(publishedAt) : new Date()).getFullYear() % 1000;
  return `${SITE}/a/${articleNumber}-${year}`;
}
