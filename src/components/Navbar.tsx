import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LanguageSelector from "@/components/LanguageSelector";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/a-propos", label: t("nav.about") },
    { href: "/vision", label: t("nav.vision") },
    { href: "/agricapital", label: "AGRICAPITAL" },
    { href: "/projets", label: t("nav.projects") },
    { href: "/partenariat", label: t("nav.partnership") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/contact", label: t("nav.contact") },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    // Navigate first, then scroll to top
    navigate(href);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-lg sm:text-xl font-bold text-foreground hover:text-primary transition-colors truncate max-w-[150px] sm:max-w-none"
          >
            Inocent KOFFI
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-4 2xl:gap-6">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive(link.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {link.label}
              </button>
            ))}
            <LanguageSelector />
          </div>

          {/* Mobile Menu Button */}
          <div className="xl:hidden flex items-center gap-2">
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
        {isMobileMenuOpen && (
          <div className="xl:hidden py-4 space-y-2 border-t border-border/50 bg-background/95 backdrop-blur-md absolute left-0 right-0 top-full px-4 sm:px-6 shadow-lg">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`block w-full text-left py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-muted"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;