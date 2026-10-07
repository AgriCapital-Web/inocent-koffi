import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import LanguageSelector from "@/components/LanguageSelector";
import { Button } from "@/components/ui/button";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { NAV, pickHomeLang } from "@/lib/i18n/homeContent";
import profilePhotoSm from "@/assets/profile-photo-sm.webp";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const n = NAV[pickHomeLang(language)];
  const navItems = [
    { href: "/", label: n.home },
    { href: "/a-propos", label: n.about },
    { href: "/services", label: n.services },
    { href: "/realisations", label: n.work },
    { href: "/autres-projets", label: n.other },
    { href: "/actualites", label: n.news },
    { href: "/contact", label: n.contact },
  ];

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-md transition-shadow duration-300 ${isScrolled ? "shadow-md" : "shadow-sm"}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between sm:h-20">
          <Link to="/" onClick={closeMenu} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img src={profilePhotoSm} alt="Inocent KOFFI" className="h-10 w-10 rounded-full object-cover ring-2 ring-accent sm:h-11 sm:w-11" />
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="font-display text-base font-bold tracking-tight-1 text-foreground sm:text-lg">Inocent KOFFI</span>
              <span className="text-xs text-muted-foreground">Entrepreneur digital · Praticien IA</span>
            </span>
          </Link>

          <div className="hidden items-center gap-0.5 lg:flex">
            {navItems.map((item, i) => (
              <motion.div key={item.href} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.03 }}>
                <Link
                  to={item.href}
                  onClick={closeMenu}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`relative inline-flex whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${isActive(item.href) ? "text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                >
                  {item.label}
                  {isActive(item.href) && <span aria-hidden className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full" style={{ background: "var(--gradient-gold)" }} />}
                </Link>
              </motion.div>
            ))}
            <LanguageSelector />
            <Button asChild size="sm" className="ml-2 bg-accent font-semibold text-accent-foreground hover:bg-accent/90">
              <Link to="/commande" onClick={closeMenu}>{n.cta} <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden /></Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSelector />
            <button className="rounded-lg p-2 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent" onClick={() => setIsMobileMenuOpen((open) => !open)} aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={isMobileMenuOpen} aria-controls="mobile-nav-panel">
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} id="mobile-nav-panel" className="absolute left-0 right-0 top-full z-50 max-h-[80vh] overflow-y-auto border-t border-border/50 bg-background px-4 shadow-2xl ring-1 ring-border/70 sm:px-6">
              <div className="space-y-1 py-4">
                {navItems.map((item) => (
                  <Link key={item.href} to={item.href} onClick={closeMenu} className={`block w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${isActive(item.href) ? "bg-accent/20 text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                    {item.label}
                  </Link>
                ))}
                <Button asChild className="mt-3 w-full bg-accent font-semibold text-accent-foreground hover:bg-accent/90">
                  <Link to="/commande" onClick={closeMenu}>{n.cta} <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden /></Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
