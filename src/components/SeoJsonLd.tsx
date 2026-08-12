import { Helmet } from "react-helmet-async";

export const SITE_URL = "https://ikoffi.agricapital.ci";

type Crumb = { name: string; path: string };

/** BreadcrumbList JSON-LD — pass the trail without the "Accueil" root. */
export const BreadcrumbJsonLd = ({ items }: { items: Crumb[] }) => {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Accueil", path: "/" }, ...items].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path === "/" ? "" : c.path}`,
    })),
  };
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
};


/** WebPage JSON-LD for a specific route. */
export const WebPageJsonLd = ({
  path,
  name,
  description,
}: {
  path: string;
  name: string;
  description: string;
}) => {
  const url = `${SITE_URL}${path === "/" ? "/" : path}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    url,
    name,
    description,
    inLanguage: "fr-CI",
    isPartOf: { "@type": "WebSite", name: "Inocent KOFFI", url: SITE_URL },
    about: { "@type": "Person", name: "Inocent KOFFI", url: SITE_URL },
    publisher: { "@type": "Organization", name: "AGRICAPITAL SARL", url: "https://agricapital.ci" },
  };
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
};

/** Person JSON-LD — entité "Inocent KOFFI". */
export const PersonJsonLd = () => {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#inocent-koffi`,
    name: "Inocent KOFFI",
    givenName: "Inocent",
    familyName: "KOFFI",
    jobTitle: "Fondateur & CEO",
    description:
      "Inocent KOFFI est un agro-entrepreneur ivoirien, Fondateur & CEO d'AGRICAPITAL SARL. Il structure, crée et gère des actifs agricoles durables en Côte d'Ivoire : plantations de palmier à huile clé en main, pépinière, sécurisation foncière et accompagnement des investisseurs.",
    url: SITE_URL,
    mainEntityOfPage: `${SITE_URL}/`,
    image: {
      "@type": "ImageObject",
      url: `${SITE_URL}/images/founder-inocent-koffi.jpg`,
      caption: "Inocent KOFFI, Fondateur & CEO d'AGRICAPITAL SARL",
      width: 1200,
      height: 1200,
    },
    worksFor: {
      "@type": "Organization",
      name: "AGRICAPITAL SARL",
      url: "https://agricapital.ci",
    },
    knowsAbout: [
      "Entrepreneuriat agricole",
      "Développement agricole",
      "Palmier à huile",
      "Plantation clé en main",
      "Sécurisation foncière agricole",
      "Investissement agricole",
      "Développement rural en Côte d'Ivoire",
      "Innovation et numérique agricole",
    ],
    knowsLanguage: ["fr", "en"],
    nationality: { "@type": "Country", name: "Côte d'Ivoire" },
    workLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Daloa",
        addressRegion: "Haut-Sassandra",
        addressCountry: "CI",
      },
    },
    email: "mailto:inocent.koffi@agricapital.ci",
    telephone: "+225-07-59-56-60-87",
    sameAs: [
      "https://www.linkedin.com/in/inocent-k-4a08b7159/",
      "https://www.facebook.com/share/174mN1Fopy/",
      "https://agricapital.ci",
      "https://app.agricapital.ci",
      "https://client.agricapital.ci",
    ],
  };
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
};

/** FAQPage JSON-LD. */
export const FaqPageJsonLd = ({ items }: { items: { q: string; a: string }[] }) => {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
};

/** Organization + ProfessionalService JSON-LD for AGRICAPITAL SARL. */
export const OrganizationJsonLd = () => {
  const data = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    name: "AGRICAPITAL SARL",
    alternateName: "AgriCapital",
    slogan: "Investir la terre. Cultiver l'avenir.",
    url: "https://www.agricapital.ci",
    logo: `${SITE_URL}/favicon-photo.jpg`,
    image: `${SITE_URL}/og-image-profile.png`,
    description:
      "AGRICAPITAL SARL structure, crée et gère des actifs agricoles durables en Côte d'Ivoire : plantations clé en main, pépinière de palmier à huile, valorisation du foncier rural et accompagnement des investisseurs et de la diaspora.",
    founder: { "@type": "Person", name: "Inocent KOFFI" },
    employee: { "@type": "Person", name: "Inocent KOFFI", jobTitle: "Fondateur & CEO" },
    areaServed: { "@type": "Country", name: "Côte d'Ivoire" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Daloa",
      addressRegion: "Haut-Sassandra",
      addressCountry: "CI",
    },
    location: {
      "@type": "Place",
      name: "Bureau de Proximité AgriCapital — Gonaté",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Gonaté",
        addressRegion: "Haut-Sassandra",
        addressCountry: "CI",
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "08:00",
          closes: "18:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Saturday"],
          opens: "09:00",
          closes: "13:00",
        },
      ],
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+225-07-59-56-60-87",
        contactType: "sales",
        email: "inocent.koffi@agricapital.ci",
        availableLanguage: ["French", "English"],
      },
    ],
    sameAs: [
      "https://agricapital.ci",
      "https://app.agricapital.ci",
      "https://client.agricapital.ci",
      "https://www.facebook.com/share/174mN1Fopy/",
      "https://www.linkedin.com/in/inocent-k-4a08b7159/",
    ],
  };
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
};

export default OrganizationJsonLd;