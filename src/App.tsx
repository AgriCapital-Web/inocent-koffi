import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "@/hooks/useLanguage";
import Home from "./pages/Home";
import APropos from "./pages/APropos";
import Vision from "./pages/Vision";
import Agricapital from "./pages/Agricapital";
import Projets from "./pages/Projets";
import Partenariat from "./pages/Partenariat";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import MentionsLegales from "./pages/MentionsLegales";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// All routes with language support
const routes = [
  { path: "/", element: <Home /> },
  { path: "/a-propos", element: <APropos /> },
  { path: "/vision", element: <Vision /> },
  { path: "/agricapital", element: <Agricapital /> },
  { path: "/projets", element: <Projets /> },
  { path: "/partenariat", element: <Partenariat /> },
  { path: "/blog", element: <Blog /> },
  { path: "/contact", element: <Contact /> },
  { path: "/login", element: <Login /> },
  { path: "/admin", element: <Admin /> },
  { path: "/mentions-legales", element: <MentionsLegales /> },
];

const languageCodes = ["fr", "en", "es", "de", "zh", "ar"];

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <LanguageProvider>
            <Routes>
              {/* Base routes */}
              {routes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
              
              {/* Language prefix routes (e.g., /fr, /en, /es) */}
              {languageCodes.map((lang) => (
                <Route key={lang} path={`/${lang}`} element={<Home />} />
              ))}
              
              {/* Routes with language suffix (e.g., /a-propos/fr) */}
              {routes.slice(1, -2).map((route) => 
                languageCodes.map((lang) => (
                  <Route 
                    key={`${route.path}/${lang}`} 
                    path={`${route.path}/${lang}`} 
                    element={route.element} 
                  />
                ))
              )}
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </LanguageProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;