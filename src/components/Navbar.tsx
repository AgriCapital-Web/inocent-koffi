import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LanguageSelector from "@/components/LanguageSelector";
import VisitorCounter from "@/components/VisitorCounter";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { motion, AnimatePresence } from "framer-motion";
import logoAgricapital from "@/assets/logo-agricapital.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navGroups = [
    { href: "/", label: t("nav.home") },
    {
      label: "Profil",
      children: [
        { href: "/a-propos", label: t("nav.about") },
        { href: "/vision", label: t("nav.vision") },
        { href: "/portfolio", label: "Portfolio" },
      ],
    },
    {
      label: "Projets",
      children: [
        { href: "/agricapital", label: "AGRICAPITAL" },
        { href: "/agricapital#equipe", label: "Équipe AgriCapital" },
        { href: "/projets", label: t("nav.projects") },
        { href: "/partenariat", label: t("nav.partnership") },
      ],
    },
    {
      label: "Communauté",
      children: [
        { href: "/blog", label: t("nav.blog") },
        { href: "/forum", label: "Forum" },
      ],
    },
    { href: "/contact", label: t("nav.contact") },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const isGroupActive = (group: any) => {
    if (group.href) return isActive(group.href);
    return group.children?.some((c: any) => isActive(c.href));
  };

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    setOpenSubmenu(null);
    const [path, hash] = href.split('#');
    navigate(href);
    if (hash) {
      // Wait for navigation, then scroll to anchor
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <img src={logoAgricapital} alt="AgriCapital" className="h-8 sm:h-9" />
            <span className="text-sm sm:text-base font-bold text-foreground hidden sm:inline">Inocent KOFFI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-1 2xl:gap-2">
            {navGroups.map((group, i) => {
              if (group.href) {
                return (
                  <motion.button
                    key={group.href}
                    onClick={() => handleNavClick(group.href!)}
                    className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg whitespace-nowrap ${
                      isActive(group.href!)
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-primary hover:bg-muted"
                    }`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.04 }}
                  >
                    {group.label}
                  </motion.button>
                );
              }
              return (
                <div
                  key={group.label}
                  className="relative group"
                  onMouseEnter={() => setOpenSubmenu(group.label)}
                  onMouseLeave={() => setOpenSubmenu(null)}
                >
                  <button
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors rounded-lg whitespace-nowrap ${
                      isGroupActive(group)
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-primary hover:bg-muted"
                    }`}
                  >
                    {group.label}
                    <ChevronDown className={`w-3 h-3 transition-transform ${openSubmenu === group.label ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openSubmenu === group.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 py-2 bg-background border border-border rounded-xl shadow-xl min-w-[180px] z-50"
                      >
                        {group.children!.map((child) => (
                          <button
                            key={child.href}
                            onClick={() => handleNavClick(child.href)}
                            className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${
                              isActive(child.href)
                                ? "text-primary bg-primary/10 font-medium"
                                : "text-muted-foreground hover:text-primary hover:bg-muted"
                            }`}
                          >
                            {child.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
            <VisitorCounter />
            <LanguageSelector />
          </div>

          {/* Mobile Menu Button */}
          <div className="xl:hidden flex items-center gap-2">
            <VisitorCounter />
            <LanguageSelector />
            <button
              className="text-foreground p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="xl:hidden overflow-hidden border-t border-border/50 bg-background/95 backdrop-blur-md absolute left-0 right-0 top-full px-4 sm:px-6 shadow-lg max-h-[80vh] overflow-y-auto"
            >
              <div className="py-4 space-y-1">
                {navGroups.map((group, i) => {
                  if (group.href) {
                    return (
                      <motion.button
                        key={group.href}
                        onClick={() => handleNavClick(group.href!)}
                        className={`block w-full text-left py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                          isActive(group.href!)
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground hover:text-primary hover:bg-muted"
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        {group.label}
                      </motion.button>
                    );
                  }
                  return (
                    <div key={group.label}>
                      <button
                        onClick={() => setOpenSubmenu(openSubmenu === group.label ? null : group.label)}
                        className={`flex items-center justify-between w-full py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                          isGroupActive(group)
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground hover:text-primary hover:bg-muted"
                        }`}
                      >
                        {group.label}
                        <ChevronDown className={`w-4 h-4 transition-transform ${openSubmenu === group.label ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {openSubmenu === group.label && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="ml-4 border-l-2 border-primary/20 pl-2 space-y-1 overflow-hidden"
                          >
                            {group.children!.map((child) => (
                              <button
                                key={child.href}
                                onClick={() => handleNavClick(child.href)}
                                className={`block w-full text-left py-2.5 px-4 rounded-lg text-sm transition-colors ${
                                  isActive(child.href)
                                    ? "text-primary bg-primary/10 font-medium"
                                    : "text-muted-foreground hover:text-primary hover:bg-muted"
                                }`}
                              >
                                {child.label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
