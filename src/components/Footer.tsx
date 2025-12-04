import { Link } from "react-router-dom";
import { Facebook, Linkedin, Mail, MapPin, Phone, ExternalLink } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { href: "/", label: "Accueil" },
    { href: "/a-propos", label: "À Propos" },
    { href: "/vision", label: "Vision" },
    { href: "/agricapital", label: "AGRICAPITAL" },
    { href: "/projets", label: "Projets" },
    { href: "/partenariat", label: "Partenariat" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      href: "https://www.facebook.com/share/174mN1Fopy/",
      label: "Facebook",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/comm/mynetwork/discovery-see-all?usecase=PEOPLE_FOLLOWS&followMember=inocent-k-4a08b7159",
      label: "LinkedIn",
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About Section */}
          <div className="space-y-4 lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4">Inocent KOFFI</h3>
            <p className="text-sm opacity-90 leading-relaxed">
              Fondateur et Directeur Général d'AGRICAPITAL SARL. Passionné par la transformation agricole en Afrique avec un impact économique, sociétal et environnemental durable.
            </p>
            <div className="flex gap-4 pt-2">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-all hover:scale-110"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Navigation</h3>
            <ul className="space-y-2">
              {footerLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-sm opacity-90 hover:opacity-100 hover:translate-x-1 inline-block transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* AGRICAPITAL */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">AGRICAPITAL SARL</h3>
            <p className="text-sm opacity-90 leading-relaxed mb-4">
              Le partenaire idéal des producteurs agricoles. Capital: 5 000 000 FCFA. RCCM: CI-01-DAL-2025-B12-13435
            </p>
            <a 
              href="https://www.agricapital.ci" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm opacity-90 hover:opacity-100 transition-opacity"
            >
              <ExternalLink className="w-4 h-4" />
              www.agricapital.ci
            </a>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <div className="space-y-3 text-sm opacity-90">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <a href="mailto:Inocent.koffi@agricapital.ci" className="hover:opacity-100 transition-opacity">
                  Inocent.koffi@agricapital.ci
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <a href="tel:+2250759566087" className="hover:opacity-100 transition-opacity">
                  +225 07 59 56 60 87
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Daloa, Haut-Sassandra<br />Côte d'Ivoire</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-80">
            <p>© {currentYear} Inocent KOFFI. Tous droits réservés.</p>
            <div className="flex items-center gap-4">
              <Link to="/mentions-legales" className="hover:opacity-100 transition-opacity">
                Mentions Légales
              </Link>
              <span className="hidden md:inline">·</span>
              <span className="text-center md:text-right">
                AGRICAPITAL SARL · Transformation Agricole
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
