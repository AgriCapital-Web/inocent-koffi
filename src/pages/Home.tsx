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
      title: "Inocent KOFFI | Fondateur d’AgriCapital · Investissement agricole & solutions digitales",
      description: "Inocent KOFFI est entrepreneur ivoirien, fondateur et gérant d’AgriCapital SARL. Il développe des projets d’investissement agricole, de patrimoine agricole et de plantation de palmier à huile en Côte d’Ivoire, ainsi que des solutions numériques et d’intelligence artificielle.",
    },
    en: {
      title: "Inocent KOFFI | Agro & Digital Entrepreneur · Web Developer · AI Practitioner",
      description: "Official website of Inocent KOFFI: Agro & Digital entrepreneur, web developer, AI practitioner and solution creator.",
    },
  } as const;
  const meta = metaByLanguage.fr; // même titre SEO pour toutes les langues
  const baseUrl = "https://www.ikoffi.agricapital.ci";

  return (
    <>
      <Helmet>
        <html lang={language} dir={language === "ar" ? "rtl" : "ltr"} />
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content="Inocent KOFFI, fondateur AgriCapital, AgriCapital SARL, entrepreneur ivoirien, investissement agricole, patrimoine agricole, actif agricole, actifs réels, foncier agricole, plantation clé en main, palmier à huile, plantation de palmier à huile, agriculture Côte d’Ivoire, développement agricole, valorisation du foncier, création de plantation, Daloa, Gonaté, Haut-Sassandra, Côte d’Ivoire, entrepreneur digital, développeur web, développement web, intelligence artificielle, automatisation, applications web, solutions digitales, transformation numérique, création de solutions, gestion de projets, entrepreneuriat, ikoffi.agricapital.ci" />
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
        name="Inocent KOFFI — Fondateur d’AgriCapital, entrepreneur Agro & Digital"
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
