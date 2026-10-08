import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "@/hooks/useLanguage";
import React, { useEffect } from "react";
import ScrollToTop from "@/components/ScrollToTop";
import { trackPageView } from "@/lib/analytics";
import { OrganizationJsonLd, PersonJsonLd } from "@/components/SeoJsonLd";
import SeoAlternates from "@/components/SeoAlternates";
import { resolveLegacyRedirect } from "@/lib/legacyRedirects";

import Home from "./pages/Home";
import APropos from "./pages/APropos";
import Vision from "./pages/Vision";
import Expertises from "./pages/Expertises";

import Boutique from "./pages/Boutique";
import Agricapital from "./pages/Agricapital";
import Projets from "./pages/Projets";
import Partenariat from "./pages/Partenariat";
import Actualites from "./pages/Actualites";
import ActualiteDetail from "./pages/ActualiteDetail";
import Contact from "./pages/Contact";
import Commande from "./pages/Commande";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import MentionsLegales from "./pages/MentionsLegales";
import Evolution from "./pages/EvolutionEnhanced";
import Portfolio from "./pages/Portfolio";
import Forum from "./pages/Forum";
import SearchResults from "./pages/SearchResults";
import ShortRedirect from "./pages/ShortRedirect";
import NotFound from "./pages/NotFound";
import FAQPage from "./pages/FAQ";
import ClientPortal from "./pages/ClientPortal";

const LegacyArticleRedirect = () => { const location = useLocation(); const slug = location.pathname.split("/").filter(Boolean).pop(); return <Navigate to={slug ? "/actualites/" + slug : "/actualites"} replace />; };

const queryClient = new QueryClient();

const routes = [
  { path: "/", element: <Home /> },
  { path: "/a-propos", element: <APropos /> },
  { path: "/vision", element: <Vision /> },
  { path: "/expertises", element: <Expertises /> },
  { path: "/services", element: <Boutique /> },
  { path: "/boutique", element: <Boutique /> },
  { path: "/agricapital", element: <Agricapital /> },
  { path: "/autres-projets", element: <Projets /> },
  { path: "/projets", element: <Navigate to="/autres-projets" replace /> },
  { path: "/partenariat", element: <Partenariat /> },
  { path: "/evolution", element: <Evolution /> },
  { path: "/realisations", element: <Portfolio /> },
  { path: "/portfolio", element: <Navigate to="/realisations" replace /> },
  { path: "/actualites", element: <Actualites /> },
  { path: "/actualites/:slug", element: <ActualiteDetail /> },
  { path: "/new", element: <Navigate to="/actualites" replace /> },
  { path: "/new/:slug", element: <LegacyArticleRedirect /> },
  { path: "/blog", element: <Navigate to="/actualites" replace /> },
  { path: "/blog/:slug", element: <LegacyArticleRedirect /> },
  { path: "/forum", element: <Forum /> },
  { path: "/recherche", element: <SearchResults /> },
  { path: "/contact", element: <Contact /> },
  { path: "/commande", element: <Commande /> },
  { path: "/login", element: <Login /> },
  { path: "/client", element: <ClientPortal /> },
  { path: "/admin", element: <Admin /> },
  { path: "/studio", element: <Navigate to="/realisations" replace /> },
  { path: "/mentions-legales", element: <MentionsLegales /> },
  { path: "/faq", element: <FAQPage /> },
  { path: "/n/:code", element: <ShortRedirect /> },
];

const languageCodes = ["fr", "en", "es", "de", "zh", "ar", "bci", "dyu"];

const AppRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const raw = location.pathname;
    const normalized = raw
      .replace(/\/{2,}/g, "/")
      .replace(/\/$/, "")
      .toLowerCase();

    if (raw !== normalized) {
      navigate(normalized || "/", { replace: true });
      return;
    }

    const legacy = resolveLegacyRedirect(normalized || "/");
    if (legacy && legacy !== (normalized || "/")) {
      navigate(legacy + location.search, { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

  return (
    <Routes>
      {routes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}

      {languageCodes.filter((lang) => lang !== "fr").map((lang) => (
        <Route key={lang} path={`/${lang}`} element={<Home />} />
      ))}

      {routes
        .filter((route) => !["/login", "/admin", "/n/:code"].includes(route.path))
        .map((route) =>
          languageCodes.filter((lang) => lang !== "fr").map((lang) => (
            <Route
              key={`${lang}${route.path}`}
              path={route.path === "/" ? `/${lang}` : `/${lang}${route.path}`}
              element={route.element}
            />
          )),
        )}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};


class AppErrorBoundary extends React.Component<React.PropsWithChildren, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error) { console.error("Application render error:", error); }
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-screen bg-[#0b0d0c] text-white grid place-items-center px-6">
        <div className="max-w-xl text-center">
          <p className="text-xs font-bold uppercase tracking-[.25em] text-[#d4aa5a]">Inocent KOFFI</p>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl">Un instant, la page se rétablit.</h1>
          <p className="mt-4 text-white/60">Une erreur d’affichage a été détectée. Rechargez la page pour reprendre la navigation.</p>
          <button onClick={() => window.location.reload()} className="mt-7 rounded-full bg-[#c99a4a] px-6 py-3 text-sm font-bold text-[#151515]">Recharger la page</button>
        </div>
      </div>
    );
  }
}

const App = () => (
  <AppErrorBoundary>
    <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <LanguageProvider>
            <OrganizationJsonLd />
            <PersonJsonLd />
            <SeoAlternates />
            <ScrollToTop />
            <AppRoutes />
          </LanguageProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
