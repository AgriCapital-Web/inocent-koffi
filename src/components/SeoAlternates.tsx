import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Enforces a single indexable domain (CANONICAL_HOST) and emits coherent
 * canonical + hreflang tags for every localized route.
 *
 * - Any other host/alias (preview, lovable.app, netlify, vercel, www variants)
 *   gets `noindex, nofollow` so only ikoffi.agricapital.ci is indexed.
 * - Canonical always points to the current localized URL on the canonical host.
 * - hreflang alternates are generated for the 6 supported languages + x-default.
 *
 * DOM is patched directly (instead of Helmet) so existing per-page canonical
 * tags are *updated* rather than duplicated.
 */
const CANONICAL_HOST = "ikoffi.agricapital.ci";
const CANONICAL_ORIGIN = `https://${CANONICAL_HOST}`;
const LANGS = ["fr", "en", "es", "de", "zh", "ar", "bci", "dyu"] as const;
const NOINDEX_PREFIXES = ["/admin", "/login", "/og-report", "/recherche", "/new/"];

const upsertMeta = (name: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

/** Splits "/contact/en" into { base: "/contact", lang: "en" }. */
export const splitLocalizedPath = (pathname: string) => {
  const parts = pathname.split("/").filter(Boolean);
  const last = parts[parts.length - 1];
  const first = parts[0];
  if (last && (LANGS as readonly string[]).includes(last) && parts.length > 1) {
    return { base: `/${parts.slice(0, -1).join("/")}`, lang: last };
  }
  if (first && (LANGS as readonly string[]).includes(first) && parts.length === 1) {
    return { base: "/", lang: first };
  }
  return { base: pathname === "" ? "/" : pathname, lang: "fr" };
};

const localizedUrl = (base: string, lang: string) => {
  if (lang === "fr") return `${CANONICAL_ORIGIN}${base === "/" ? "/" : base}`;
  return base === "/" ? `${CANONICAL_ORIGIN}/${lang}` : `${CANONICAL_ORIGIN}${base}/${lang}`;
};

const SeoAlternates = () => {
  const location = useLocation();

  useEffect(() => {
    const apply = () => {
      const { base, lang } = splitLocalizedPath(location.pathname);
      const isPrivate = NOINDEX_PREFIXES.some((p) => base.startsWith(p));
      const isCanonicalHost =
        typeof window !== "undefined" && window.location.hostname === CANONICAL_HOST;

      // 1. Robots: only the canonical host and public routes may be indexed.
      const robots =
        isCanonicalHost && !isPrivate
          ? "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
          : "noindex, nofollow";
      upsertMeta("robots", robots);
      upsertMeta("googlebot", robots);
      upsertMeta("bingbot", robots);

      // 2. Canonical: always the canonical host + current localized path.
      const canonicalHref = localizedUrl(base, lang);
      const existing = document.head.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]');
      if (existing.length === 0) {
        const link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        link.setAttribute("href", canonicalHref);
        link.dataset.seoAlternates = "true";
        document.head.appendChild(link);
      } else {
        existing.forEach((el, i) => {
          if (i === 0) el.setAttribute("href", canonicalHref);
          else el.remove();
        });
      }

      // 3. hreflang alternates for the current page.
      document.head
        .querySelectorAll('link[rel="alternate"][data-seo-alternates="true"]')
        .forEach((el) => el.remove());
      document.head
        .querySelectorAll('link[rel="alternate"][hreflang]')
        .forEach((el) => el.remove());

      if (!isPrivate) {
        [...LANGS.map((l) => [l, localizedUrl(base, l)] as const), ["x-default", localizedUrl(base, "fr")] as const].forEach(
          ([hreflang, href]) => {
            const link = document.createElement("link");
            link.setAttribute("rel", "alternate");
            link.setAttribute("hreflang", hreflang);
            link.setAttribute("href", href);
            link.dataset.seoAlternates = "true";
            document.head.appendChild(link);
          },
        );
      }

      // 4. og:url must self-reference the localized canonical.
      const ogUrl = document.head.querySelector<HTMLMetaElement>('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute("content", canonicalHref);
    };

    apply();
    // Re-apply after react-helmet-async has flushed its own head mutations.
    const t1 = window.setTimeout(apply, 120);
    const t2 = window.setTimeout(apply, 600);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [location.pathname]);

  return null;
};

export default SeoAlternates;
