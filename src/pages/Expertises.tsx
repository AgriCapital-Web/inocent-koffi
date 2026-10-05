import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Expertise from "@/components/Expertise";
import { useLanguage } from "@/hooks/useLanguage";
import { getExpertiseContent } from "@/lib/i18n/expertiseContent";
import { WebPageJsonLd } from "@/components/SeoJsonLd";

const Footer = lazy(() => import("@/components/Footer"));
const ContactCTA = lazy(() => import("@/components/ContactCTA"));

const Expertises = () => {
  const { language } = useLanguage();
  const c = getExpertiseContent(language);
  const baseUrl = "https://ikoffi.agricapital.ci";
  const path = `/expertises${language === "fr" ? "" : `/${language}`}`;

  return (
    <>
      <Helmet>
        <title>{c.seo.title}</title>
        <meta name="description" content={c.seo.description} />
        <link rel="canonical" href={`${baseUrl}${path}`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={c.seo.title} />
        <meta property="og:description" content={c.seo.description} />
        <meta property="og:url" content={`${baseUrl}${path}`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <WebPageJsonLd path="/expertises" name={c.seo.title} description={c.seo.description} />

      <div className="min-h-screen">
        <Navbar />
        <div className="pt-14 sm:pt-16">
          <Expertise full />
        </div>
        <Suspense fallback={null}>
          <ContactCTA />
        </Suspense>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </>
  );
};

export default Expertises;
