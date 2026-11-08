import { Link } from "react-router-dom";
import { Facebook, Linkedin, Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { NAV, HERO, pickHomeLang } from "@/lib/i18n/homeContent";
import { useLanguage } from "@/hooks/useLanguage";

const Footer = () => {
  const { t, language } = useLanguage();
  const n = NAV[pickHomeLang(language)];
  const currentYear = new Date().getFullYear();
  const footerLinks = [
    { href: "/", label: n.home }, { href: "/a-propos", label: n.about },
    { href: "/services", label: n.services }, { href: "/realisations", label: n.work },
    { href: "/autres-projets", label: n.other }, { href: "/actualites", label: n.news },
    { href: "/contact", label: n.contact },
  ];
  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/share/174mN1Fopy/", label: "Facebook" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/inocent-k-4a08b7159/", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 pt-12 text-primary-foreground sm:pt-16">
      <div className="container mx-auto px-4 pb-6 sm:px-6 lg:px-8 sm:pb-8">
        <div className="mb-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <motion.div className="space-y-3 sm:col-span-2 lg:col-span-1" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-2xl font-bold">Inocent KOFFI</h2>
            <p className="text-sm leading-relaxed opacity-90">{HERO[pickHomeLang(language)].roles}</p>
            <div className="flex gap-3 pt-2">
              {socialLinks.map(({ icon: Icon, href, label }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20"><Icon className="h-5 w-5" /></a>)}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }}>
            <h2 className="mb-4 font-display text-lg font-bold">{t("footer.navigation")}</h2>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-1">{footerLinks.map((link) => <li key={link.href}><Link to={link.href} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="inline-block text-sm opacity-90 transition-opacity hover:opacity-100">{link.label}</Link></li>)}</ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <h2 className="mb-4 font-display text-lg font-bold">AgriCapital</h2>
            <p className="text-sm leading-relaxed opacity-90">Mon initiative pour rendre l’agriculture productive plus accessible. Fondateur et gérant d’AgriCapital SARL.</p>
            <a href="https://www.agricapital.ci" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold opacity-95 hover:opacity-100"><ExternalLink className="h-4 w-4" /> Site officiel AgriCapital</a>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
            <h2 className="mb-4 font-display text-lg font-bold">{t("footer.contact")}</h2>
            <div className="space-y-3 text-sm opacity-90">
              <a href="mailto:inocent.koffi@agricapital.ci" className="flex items-start gap-3 hover:opacity-100"><Mail className="mt-0.5 h-5 w-5 shrink-0" /><span className="break-all">inocent.koffi@agricapital.ci</span></a>
              <a href="tel:+2250759566087" className="flex items-start gap-3 hover:opacity-100"><Phone className="mt-0.5 h-5 w-5 shrink-0" /><span>+225 07 59 56 60 87</span></a>
              <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0" /><span>Daloa, Côte d'Ivoire</span></div>
            </div>
          </motion.div>
        </div>
        <div className="border-t border-primary-foreground/20 pt-6">
          <div className="flex flex-col items-center justify-between gap-3 text-xs opacity-80 sm:flex-row sm:text-sm"><p>© {currentYear} Inocent KOFFI. {t("footer.rights")}.</p><Link to="/mentions-legales" className="hover:opacity-100">{t("footer.legal")}</Link></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
