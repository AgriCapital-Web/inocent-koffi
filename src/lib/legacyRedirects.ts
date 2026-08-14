// Anciennes URL → nouvelles URL (équivalent 301 côté client + vercel.json côté serveur)
export const LEGACY_REDIRECTS: Record<string, string> = {
  "/about": "/a-propos",
  "/apropos": "/a-propos",
  "/a-propos-de-moi": "/a-propos",
  "/bio": "/a-propos",
  "/nos-actifs": "/projets",
  "/chiffres-cles": "/projets",
  "/projet": "/projets",
  "/projects": "/portfolio",
  "/realisations": "/portfolio",
  "/news": "/actualites",
  "/actualite": "/actualites",
  "/actualite-agricapital": "/actualites",
  "/articles": "/blog",
  "/blogs": "/blog",
  "/questions": "/faq",
  "/faqs": "/faq",
  "/agri-capital": "/agricapital",
  "/agricapital-sarl": "/agricapital",
  "/partenaires": "/partenariat",
  "/partnership": "/partenariat",
  "/partenariats": "/partenariat",
  "/galerie": "/evolution",
  "/timeline": "/evolution",
  "/pepiniere": "/evolution",
  "/contactez-nous": "/contact",
  "/contact-us": "/contact",
  "/legal": "/mentions-legales",
  "/mentions": "/mentions-legales",
  "/search": "/recherche",
  "/team": "/a-propos",
  "/equipe": "/a-propos",
  "/vision-agro-impact": "/vision",
};

/** Résout une redirection héritée en conservant un éventuel suffixe de langue (/fr, /en…). */
export const resolveLegacyRedirect = (pathname: string): string | null => {
  const clean = pathname.replace(/\/+$/, "").toLowerCase() || "/";
  const direct = LEGACY_REDIRECTS[clean];
  if (direct) return direct;

  const match = clean.match(/^(.*)\/(fr|en|es|de|zh|ar)$/);
  if (match) {
    const target = LEGACY_REDIRECTS[match[1] || "/"];
    if (target) return `${target}/${match[2]}`;
  }
  return null;
};
