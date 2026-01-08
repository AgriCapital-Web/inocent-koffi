import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import NewYearPopup from "@/components/NewYearPopup";
import { useLanguage } from "@/hooks/useLanguage";

// Lazy load components for better performance
const About = lazy(() => import("@/components/About"));
const Services = lazy(() => import("@/components/Services"));
const PhotoGallery = lazy(() => import("@/components/PhotoGallery"));
const BlogPreview = lazy(() => import("@/components/BlogPreview"));
const TestimonialsDisplay = lazy(() => import("@/components/TestimonialsDisplay"));
const FAQ = lazy(() => import("@/components/FAQ"));
const Newsletter = lazy(() => import("@/components/Newsletter"));
const Footer = lazy(() => import("@/components/Footer"));

const LoadingFallback = () => (
  <div className="min-h-[200px] flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const Home = () => {
  const { language } = useLanguage();
  
  const getMetaContent = () => {
    const meta = {
      fr: {
        title: "Inocent KOFFI - Fondateur & DG AGRICAPITAL SARL | Transformation Agricole",
        description: "Inocent KOFFI, Fondateur et Directeur Général d'AGRICAPITAL SARL. 12 ans d'expérience terrain auprès des producteurs agricoles en Côte d'Ivoire.",
        keywords: "Inocent KOFFI, AGRICAPITAL, agriculture, Côte d'Ivoire, palmier à huile, transformation agricole, développement rural"
      },
      en: {
        title: "Inocent KOFFI - Founder & CEO AGRICAPITAL SARL | Agricultural Transformation",
        description: "Inocent KOFFI, Founder and CEO of AGRICAPITAL SARL. 12 years of field experience with agricultural producers in Côte d'Ivoire.",
        keywords: "Inocent KOFFI, AGRICAPITAL, agriculture, Ivory Coast, palm oil, agricultural transformation, rural development"
      },
      es: {
        title: "Inocent KOFFI - Fundador y CEO AGRICAPITAL SARL | Transformación Agrícola",
        description: "Inocent KOFFI, Fundador y Director General de AGRICAPITAL SARL. 12 años de experiencia de campo con productores agrícolas en Costa de Marfil.",
        keywords: "Inocent KOFFI, AGRICAPITAL, agricultura, Costa de Marfil, aceite de palma, transformación agrícola"
      },
      de: {
        title: "Inocent KOFFI - Gründer & CEO AGRICAPITAL SARL | Landwirtschaftliche Transformation",
        description: "Inocent KOFFI, Gründer und Geschäftsführer von AGRICAPITAL SARL. 12 Jahre Felderfahrung mit Landwirten in der Elfenbeinküste.",
        keywords: "Inocent KOFFI, AGRICAPITAL, Landwirtschaft, Elfenbeinküste, Palmöl, landwirtschaftliche Transformation"
      },
      zh: {
        title: "Inocent KOFFI - AGRICAPITAL SARL 创始人兼首席执行官 | 农业转型",
        description: "Inocent KOFFI，AGRICAPITAL SARL 创始人兼首席执行官。在科特迪瓦拥有12年农业生产者实地经验。",
        keywords: "Inocent KOFFI, AGRICAPITAL, 农业, 科特迪瓦, 棕榈油, 农业转型"
      },
      ar: {
        title: "إنوسنت كوفي - مؤسس ومدير عام AGRICAPITAL SARL | التحول الزراعي",
        description: "إنوسنت كوفي، مؤسس ومدير عام AGRICAPITAL SARL. 12 عامًا من الخبرة الميدانية مع المنتجين الزراعيين في كوت ديفوار.",
        keywords: "إنوسنت كوفي، AGRICAPITAL، الزراعة، كوت ديفوار، زيت النخيل، التحول الزراعي"
      }
    };
    return meta[language] || meta.fr;
  };

  const meta = getMetaContent();
  const baseUrl = "https://www.ikoffi.agricapital.ci";

  return (
    <>
      <Helmet>
        <html lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} />
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <link rel="canonical" href={`${baseUrl}/${language === 'fr' ? '' : language}`} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${baseUrl}/${language === 'fr' ? '' : language}`} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:image" content={`${baseUrl}/og-image-profile.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={language === 'fr' ? 'fr_FR' : language === 'en' ? 'en_US' : language} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={`${baseUrl}/og-image-profile.png`} />
        
        {/* Alternate languages */}
        <link rel="alternate" hrefLang="fr" href={baseUrl} />
        <link rel="alternate" hrefLang="en" href={`${baseUrl}/en`} />
        <link rel="alternate" hrefLang="es" href={`${baseUrl}/es`} />
        <link rel="alternate" hrefLang="de" href={`${baseUrl}/de`} />
        <link rel="alternate" hrefLang="zh" href={`${baseUrl}/zh`} />
        <link rel="alternate" hrefLang="ar" href={`${baseUrl}/ar`} />
        <link rel="alternate" hrefLang="x-default" href={baseUrl} />
      </Helmet>
      
      {/* New Year Popup */}
      <NewYearPopup />
      
      <div className="min-h-screen">
        <Navbar />
        <Hero />
        <Suspense fallback={<LoadingFallback />}>
          <About />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <Services />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <PhotoGallery />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <TestimonialsDisplay />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <BlogPreview />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <FAQ />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <Newsletter />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <Footer />
        </Suspense>
      </div>
    </>
  );
};

export default Home;