import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import profilePhoto from "@/assets/profile-photo.webp";
import profilePhotoSm from "@/assets/profile-photo-sm.webp";
import SocialShare from "@/components/SocialShare";
import AgriSearch from "@/components/AgriSearch";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/hooks/useLanguage";

const Hero = () => {
  const { t } = useLanguage();
  return (
  <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[hsl(var(--background))]">
    <Helmet>
      <link rel="preload" as="image" href={profilePhotoSm} type="image/webp" fetchPriority="high" />
      <link rel="preload" as="image" href={profilePhoto} type="image/webp" fetchPriority="high" />
    </Helmet>
    <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(80% 60% at 80% 0%, hsl(var(--accent) / 0.18) 0%, transparent 60%), radial-gradient(70% 50% at 0% 100%, hsl(var(--primary) / 0.18) 0%, transparent 60%), linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--secondary)) 100%)" }} />
    <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

    <div className="container relative z-10 mx-auto px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 sm:gap-12 lg:grid-cols-[5fr_6fr] lg:gap-16">
        <motion.div className="order-2 flex justify-center lg:order-1" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-primary/30 via-transparent to-accent/30 blur-3xl opacity-60" />
            <div className="absolute -inset-2 rounded-[2rem] bg-gradient-to-br from-accent via-accent/40 to-primary opacity-90" />
            <motion.div className="relative overflow-hidden rounded-[1.75rem] bg-muted shadow-2xl ring-1 ring-foreground/5" whileHover={{ scale: 1.02 }}>
              <img src={profilePhoto} srcSet={`${profilePhotoSm} 320w, ${profilePhoto} 600w`} sizes="(max-width: 640px) 280px, (max-width: 1024px) 350px, 448px" alt="Inocent KOFFI" className="h-auto w-full max-w-[280px] object-cover sm:max-w-[350px] lg:max-w-md" loading="eager" fetchPriority="high" width="600" height="720" />
            </motion.div>
            <div className="absolute -bottom-5 -right-3 hidden items-center gap-3 rounded-2xl border border-border bg-background/95 px-4 py-3 shadow-xl backdrop-blur sm:flex lg:-right-6">
              <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-accent" />
              <div className="leading-tight"><div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("hero.location")}</div><div className="text-sm font-semibold text-foreground">{t("hero.creator")}</div></div>
            </div>
          </div>
        </motion.div>

        <div className="order-1 space-y-5 text-center lg:order-2 lg:text-left sm:space-y-7">
          <motion.div className="flex flex-wrap justify-center gap-2 lg:justify-start" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex rounded-full border border-accent/30 bg-accent/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-foreground sm:px-4 sm:py-2 sm:text-xs">{t("hero.badge1")}</span>
            <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary sm:px-4 sm:py-2 sm:text-xs">{t("hero.badge2")}</span>
          </motion.div>
          <motion.h1 className="font-display text-5xl font-extrabold leading-[1.02] tracking-tighter-2 text-foreground sm:text-6xl lg:text-[5.5rem]">Inocent<span className="mt-1 block bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent sm:mt-2">KOFFI</span></motion.h1>
          <motion.p className="max-w-xl border-l-2 border-accent pl-4 font-display text-xl italic leading-snug text-foreground/85 sm:text-2xl lg:text-[1.65rem]">{t("hero.value")}</motion.p>
          <motion.p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
            {t("hero.description")}
          </motion.p>
          <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row lg:justify-start sm:pt-4">
            <Button size="lg" asChild><Link to="/portfolio">{t("hero.portfolio")} <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            <Button size="lg" variant="outline" asChild><Link to="/expertises">{t("hero.expertise")}</Link></Button>
          </div>
          <div className="pt-2 sm:pt-4"><SocialShare className="justify-center lg:justify-start" /></div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl"><AgriSearch /></div>
    </div>
  </section>
  );
};

export default Hero;
