/**
 * Build short URL: art004-026 = article #4 published in 2026
 * Site path: /new/art004-026
 */
export const SITE_URL =
  (typeof window !== "undefined" ? window.location.origin : "https://ikoffi.agricapital.ci");

export function buildShortCode(articleNumber: number | null | undefined, publishedAt?: string | null): string | null {
  if (!articleNumber) return null;
  const year = publishedAt ? new Date(publishedAt).getFullYear() : new Date().getFullYear();
  const yearShort = String(year % 1000).padStart(3, "0");
  const numStr = String(articleNumber).padStart(3, "0");
  return `art${numStr}-${yearShort}`;
}

export function buildShortUrl(articleNumber: number | null | undefined, publishedAt?: string | null, baseUrl?: string): string | null {
  const code = buildShortCode(articleNumber, publishedAt);
  if (!code) return null;
  const base = (baseUrl || SITE_URL).replace(/\/$/, "");
  return `${base}/new/${code}`;
}

export function parseShortCode(code: string): { num: number; yearShort: number } | null {
  const m = code.match(/^art(\d+)-(\d+)$/i);
  if (!m) return null;
  return { num: parseInt(m[1], 10), yearShort: parseInt(m[2], 10) };
}
