import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HomeExpertises from "@/components/HomeExpertises";
import { useLanguage } from "@/hooks/useLanguage";
import { WebPageJsonLd } from "@/components/SeoJsonLd";

const About = lazy(() => import("@/components/About"));
const Expertise = lazy(() => import("@/components/Expertise"));

const PortfolioPreview = lazy(() => import("@/components/PortfolioPreview"));

const TrustBlock = lazy(() => import("@/components/TrustBlock"));
const ContactCTA = lazy(() => import("@/components/ContactCTA"));
const Footer = lazy(() => import("@/components/Footer"));

const LoadingFallback = () => (
  <div className="flex min-h-[160px] items-center justify-center" aria-hidden="true">
    <div className="h-7 w-7 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

const Home = () => {
  const { language } = useLanguage();
  const metaByLanguage = {
    fr: {
      title: "Inocent KOFFI | Entrepreneur Agro & Digital · Développeur web · Praticien IA",
      description: "Site officiel d'Inocent KOFFI : entrepreneur Agro & Digital, développeur web, praticien IA et créateur de solutions.",
    },
    en: {
      title: "Inocent KOFFI | Agro & Digital Entrepreneur · Web Developer · AI Practitioner",
      description: "Official website of Inocent KOFFI: Agro & Digital entrepreneur, web developer, AI practitioner and solution creator.",
    },
  } as const;
  const meta = metaByLanguage[language === "en" ? "en" : "fr"];
  const baseUrl = "https://ikoffi.agricapital.ci";

  return (
    <>
      <Helmet>
        <html lang={language} dir={language === "ar" ? "rtl" : "ltr"} />
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={baseUrl} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:image" content={`${baseUrl}/og-image-profile.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={`${baseUrl}/og-image-profile.png`} />
        <link rel="canonical" href={language === "fr" ? baseUrl : `${baseUrl}/${language}`} />
        <link rel="alternate" hrefLang="fr" href={baseUrl} />
        <link rel="alternate" hrefLang="en" href={`${baseUrl}/en`} />
        <link rel="alternate" hrefLang="x-default" href={baseUrl} />
      </Helmet>

      <WebPageJsonLd
        path="/"
        name="Inocent KOFFI — Entrepreneur Agro & Digital & créateur de solutions"
        description={meta.description}
      />

      <div className="min-h-screen">
        <Navbar />
        <main>
          <Hero />
          <HomeExpertises />

          <Suspense fallback={<LoadingFallback />}>
            <About />
          </Suspense>

          <Suspense fallback={<LoadingFallback />}>
            <Expertise />
          </Suspense>

          <Suspense fallback={<LoadingFallback />}>
            <PortfolioPreview />
          </Suspense>

          <Suspense fallback={<LoadingFallback />}>
            <TrustBlock />
          </Suspense>

          <Suspense fallback={<LoadingFallback />}>
            <ContactCTA />
          </Suspense>
        </main>

        <Suspense fallback={<LoadingFallback />}>
          <Footer />
        </Suspense>
      </div>
    </>
  );
};

export default Home;
