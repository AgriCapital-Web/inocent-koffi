import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import profilePhoto from "@/assets/profile-photo.webp";
import profilePhotoSm from "@/assets/profile-photo-sm.webp";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/hooks/useLanguage";
import { HERO, pickHomeLang } from "@/lib/i18n/homeContent";

const Hero = () => {
  const { language } = useLanguage();
  const c = HERO[pickHomeLang(language)];
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <Helmet>
        <link rel="preload" as="image" href={profilePhoto} type="image/webp" />
      </Helmet>
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(60% 70% at 85% 20%, hsl(var(--accent) / 0.22) 0%, transparent 60%)" }} />
      <div className="container relative mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pb-24 lg:pt-36">
        <div className="grid min-w-0 grid-cols-1 items-center gap-10 lg:grid-cols-[7fr_5fr] lg:gap-14">
          <div className="min-w-0">
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden /> <span className="min-w-0">{c.kicker}</span>
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-5 font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
              Inocent <span className="text-accent">KOFFI</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mt-5 text-sm font-medium leading-relaxed text-primary-foreground/75 sm:text-base">
              {c.roles}
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 max-w-2xl border-l-4 border-accent pl-5 font-display text-2xl font-semibold leading-snug sm:text-3xl">
              {c.tagline}
            </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6 max-w-2xl text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
              {c.bio}
            </motion.p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button size="lg" asChild className="bg-accent font-semibold text-accent-foreground hover:bg-accent/90">
                <Link to="/commande">{c.primary} <ArrowRight className="ml-2 h-4 w-4" aria-hidden /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <Link to="/realisations">{c.secondary}</Link>
              </Button>
              <Button size="lg" variant="ghost" asChild className="text-primary-foreground/85 hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <Link to="/services">{c.services}</Link>
              </Button>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="mx-auto w-full max-w-[320px] sm:max-w-[380px] lg:max-w-none">
            <div className="relative">
              <div aria-hidden className="absolute -right-3 -top-3 h-full w-full rounded-3xl border-2 border-accent/70" />
              <img
                src={profilePhoto}
                srcSet={`${profilePhotoSm} 320w, ${profilePhoto} 600w`}
                sizes="(max-width: 1024px) 380px, 440px"
                alt="Portrait d'Inocent KOFFI"
                className="relative aspect-[5/6] w-full rounded-3xl object-cover shadow-2xl"
                loading="eager"
                fetchPriority="high"
                width="600"
                height="720"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
