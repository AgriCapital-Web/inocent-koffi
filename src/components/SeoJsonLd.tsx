import { Helmet } from "react-helmet-async";

export const SITE_URL = "https://ikoffi.agricapital.ci";

type Crumb = { name: string; path: string };

export const BreadcrumbJsonLd = ({ items }: { items: Crumb[] }) => {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Accueil", path: "/" }, ...items].map((c, i) => ({
      "@type": "ListItem", position: i + 1, name: c.name,
      item: `${SITE_URL}${c.path === "/" ? "" : c.path}`,
    })),
  };
  return <Helmet><script type="application/ld+json">{JSON.stringify(data)}</script></Helmet>;
};

export const WebPageJsonLd = ({ path, name, description }: { path: string; name: string; description: string }) => {
  const url = `${SITE_URL}${path === "/" ? "/" : path}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    url, name, description,
    inLanguage: "fr-CI",
    isPartOf: { "@type": "WebSite", name: "Inocent KOFFI", url: SITE_URL },
    about: { "@type": "Person", name: "Inocent KOFFI", url: SITE_URL },
    publisher: { "@type": "Person", name: "Inocent KOFFI", url: SITE_URL },
  };
  return <Helmet><script type="application/ld+json">{JSON.stringify(data)}</script></Helmet>;
};

export const PersonJsonLd = () => {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#inocent-koffi`,
    name: "Inocent KOFFI",
    givenName: "Inocent",
    familyName: "KOFFI",
    jobTitle: "Entrepreneur Agro & Digital · Développeur web · Praticien IA · Créateur de solutions",
    description: "Inocent KOFFI transforme des idées, besoins métier et opportunités en solutions digitales et concrètes : sites, applications, plateformes, outils métier, intelligence artificielle, vidéo et audio.",
    url: SITE_URL,
    mainEntityOfPage: `${SITE_URL}/`,
    image: { "@type": "ImageObject", url: `${SITE_URL}/og-image-profile.png`, caption: "Inocent KOFFI", width: 1200, height: 1200 },
    knowsAbout: [
      "Développement web", "Solutions digitales", "Applications web", "CRM",
      "Intelligence artificielle", "Automatisation", "Vidéo", "Création audiovisuelle",
      "Audio", "Musique", "Entrepreneuriat", "Gestion de projets",
    ],
    knowsLanguage: ["fr", "en"],
    nationality: { "@type": "Country", name: "Côte d'Ivoire" },
    workLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: "Côte d'Ivoire", addressCountry: "CI" } },
    email: "mailto:inocent.koffi@agricapital.ci",
    telephone: "+225-07-59-56-60-87",
    sameAs: [
      "https://www.linkedin.com/in/inocent-k-4a08b7159/",
      "https://www.facebook.com/share/174mN1Fopy/",
      "https://www.agricapital.ci",
      "https://www.ivoireprojet.com",
      "https://www.scoly.ci",
      "https://ltgroup-ci.com",
      "https://iapourtous.ivoireprojet.com",
    ],
  };
  return <Helmet><script type="application/ld+json">{JSON.stringify(data)}</script></Helmet>;
};

export const FaqPageJsonLd = ({ items }: { items: { q: string; a: string }[] }) => {
  const data = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return <Helmet><script type="application/ld+json">{JSON.stringify(data)}</script></Helmet>;
};

export const OrganizationJsonLd = () => {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: "Inocent KOFFI",
    url: SITE_URL,
    jobTitle: "Entrepreneur Agro & Digital · Développeur web · Praticien IA · Créateur de solutions",
    description: "Entrepreneur Agro & Digital, développeur web, praticien IA et créateur de solutions.",
    sameAs: [
      "https://www.linkedin.com/in/inocent-k-4a08b7159/",
      "https://www.facebook.com/share/174mN1Fopy/",
      "https://www.agricapital.ci",
      "https://www.ivoireprojet.com",
      "https://www.scoly.ci",
      "https://ltgroup-ci.com",
      "https://iapourtous.ivoireprojet.com",
    ],
  };
  return <Helmet><script type="application/ld+json">{JSON.stringify(data)}</script></Helmet>;
};

export default OrganizationJsonLd;


export const ArticleJsonLD = ({
  type = "Article",
  headline,
  description,
  image,
  datePublished,
  dateModified,
  path,
  section,
}: {
  type?: "Article" | "NewsArticle" | "BlogPosting";
  headline: string;
  description?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  path: string;
  section?: string;
}) => {
  const url = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const data = {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#article`,
    url,
    headline,
    ...(description ? { description } : {}),
    ...(image ? { image: [image] } : {}),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    ...(section ? { articleSection: section } : {}),
    inLanguage: "fr-CI",
    author: { "@type": "Person", name: "Inocent KOFFI", url: SITE_URL },
    publisher: { "@type": "Person", name: "Inocent KOFFI", url: SITE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
  return <Helmet><script type="application/ld+json">{JSON.stringify(data)}</script></Helmet>;
};
