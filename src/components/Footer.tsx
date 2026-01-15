import { Link } from "react-router-dom";
import { Facebook, Linkedin, Mail, MapPin, Phone, ExternalLink, Twitter } from "lucide-react";
import SocialShare from "@/components/SocialShare";

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
    <footer className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground pt-12 sm:pt-16 pb-6 sm:pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-12">
          {/* About Section */}
          <div className="space-y-3 sm:space-y-4 sm:col-span-2 lg:col-span-1">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Inocent KOFFI</h3>
            <p className="text-xs sm:text-sm opacity-90 leading-relaxed">
              Fondateur et Directeur Général d'AGRICAPITAL SARL. Passionné par la transformation agricole en Afrique avec un impact économique, sociétal et environnemental durable.
            </p>
            <div className="flex gap-3 sm:gap-4 pt-2">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-all hover:scale-110"
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Navigation</h3>
            <ul className="space-y-1.5 sm:space-y-2 grid grid-cols-2 sm:grid-cols-1 gap-x-4">
              {footerLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-xs sm:text-sm opacity-90 hover:opacity-100 hover:translate-x-1 inline-block transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* AGRICAPITAL */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">AGRICAPITAL SARL</h3>
            <p className="text-xs sm:text-sm opacity-90 leading-relaxed mb-3 sm:mb-4">
              Le partenaire idéal des producteurs agricoles. Capital: 5 000 000 FCFA.
            </p>
            <a 
              href="https://www.agricapital.ci" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs sm:text-sm opacity-90 hover:opacity-100 transition-opacity"
            >
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
              www.agricapital.ci
            </a>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Contact</h3>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm opacity-90">
              <div className="flex items-start gap-2 sm:gap-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                <a href="mailto:Inocent.koffi@agricapital.ci" className="hover:opacity-100 transition-opacity break-all">
                  Inocent.koffi@agricapital.ci
                </a>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                <a href="tel:+2250759566087" className="hover:opacity-100 transition-opacity">
                  +225 07 59 56 60 87
                </a>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                <span>Daloa, Haut-Sassandra<br />Côte d'Ivoire</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-xs sm:text-sm opacity-80">
            <p className="text-center sm:text-left">© {currentYear} Inocent KOFFI. Tous droits réservés.</p>
            <div className="flex items-center gap-4">
              <Link to="/mentions-legales" className="hover:opacity-100 transition-opacity">
                Mentions Légales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
