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
    employee: { "@type": "Person", name: "Inocent KOFFI", jobTitle: "Gérant" },
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
      "https://www.agricapital.ci",
      "https://client.agricapital.ci",
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