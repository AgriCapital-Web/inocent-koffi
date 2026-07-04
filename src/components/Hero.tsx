import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import profilePhoto from "@/assets/profile-photo.webp";
import profilePhotoSm from "@/assets/profile-photo-sm.webp";
import { Helmet } from "react-helmet-async";

const LQIP = "data:image/webp;base64,UklGRtYAAABXRUJQVlA4IMoAAACQBQCdASoYAB4APxF8tFOsJ6SiqAqpgCIJZgC2yA6zaCeNZ4U40R24/OpqkXU0Yn/xyAT6wAD+jTe4LSXPHQtNsjVHCmoCVP5kclMk9MtWczDByWeIsnUkWtclirmj6KaR8cNklng2NHEjeQPyDCZ+7WMbhGR3pexaJEixd7A2uWuuVwAGOsfn7jK4fWA0SUydn/7a5K5pXysUyWbOMltgvti6Xq5jsT9fcPQr3eU4CwFTp9BzQ4/FakgfRuaFl+jFawYoyJXiVkAA";
import SocialShare from "@/components/SocialShare";
import AgriSearch from "@/components/AgriSearch";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";

const Hero = () => {
  const { language } = useLanguage();
  const copy = {
    fr: {
      founder: "Gérant — AgriCapital SARL",
      role: "Agro-entrepreneur & Stratège en Développement Agricole",
      tagline: "Bâtir un patrimoine agricole durable, terre par terre, génération après génération.",
      description: "Plus d'une décennie d'immersion terrain au service du développement commercial — un parcours qui s'est progressivement transformé en une observation approfondie du potentiel agricole ivoirien. Agro-entrepreneur et stratège en développement agricole, Gérant d'AgriCapital SARL — spécialisée dans la promotion agricole et la prestation de services intégrés, notamment la création de plantations de palmier à huile clé en main dans le Haut-Sassandra et en Côte d'Ivoire.",
      contact: "Me Contacter",
      discover: "Découvrir AGRICAPITAL"
    },
    en: {
      founder: "Managing Director — AGRICAPITAL SARL",
      role: "Agro-Entrepreneur & Agricultural Strategist",
      tagline: "Building lasting agricultural wealth — land by land, generation after generation.",
      description: "Agro-entrepreneur and agricultural development strategist. Managing Director of AGRICAPITAL SARL — an agricultural operator and promoter specialized in turnkey oil palm plantations in Côte d'Ivoire. 12+ years of field immersion serving agriculture and innovation.",
      contact: "Contact Me",
      discover: "Discover AGRICAPITAL"
    },
    es: {
      founder: "Gerente — AGRICAPITAL SARL",
      role: "Agroemprendedor y Estratega Agrícola",
      tagline: "Construir un patrimonio agrícola duradero, tierra a tierra, generación tras generación.",
      description: "Agroemprendedor y estratega en desarrollo agrícola. Gerente de AGRICAPITAL SARL, operador y promotor agrícola especializado en la creación de plantaciones de palma aceitera llave en mano en Costa de Marfil. Más de 12 años de inmersión sobre el terreno al servicio de la agricultura y la innovación.",
      contact: "Contactarme",
      discover: "Descubrir AGRICAPITAL"
    },
    de: {
      founder: "Geschäftsführer — AGRICAPITAL SARL",
      role: "Agro-Unternehmer & Agrarstratege",
      tagline: "Nachhaltiges landwirtschaftliches Vermögen aufbauen — Land für Land, Generation für Generation.",
      description: "Agro-Unternehmer und Stratege für landwirtschaftliche Entwicklung. Geschäftsführer von AGRICAPITAL SARL — landwirtschaftlicher Betreiber und Projektentwickler, spezialisiert auf schlüsselfertige Ölpalmenplantagen in Côte d'Ivoire. Mehr als 12 Jahre Praxiserfahrung im Dienst von Landwirtschaft und Innovation.",
      contact: "Kontaktieren",
      discover: "AGRICAPITAL entdecken"
    },
    zh: {
      founder: "总经理 — AGRICAPITAL SARL",
      role: "农业创业者与农业战略家",
      tagline: "一寸土地，一代传承，构筑可持续的非洲农业财富。",
      description: "农业创业者与农业发展战略家。AGRICAPITAL SARL 总经理，专注于在科特迪瓦打造交钥匙油棕种植园的农业运营与推广者。12年以上扎根一线，服务农业与创新。",
      contact: "联系我",
      discover: "了解 AGRICAPITAL"
    },
    ar: {
      founder: "المدير العام — AGRICAPITAL SARL",
      role: "رائد أعمال زراعي واستراتيجي زراعي",
      tagline: "بناء ثروة زراعية مستدامة، أرضًا بأرض، جيلاً بعد جيل.",
      description: "رائد أعمال زراعي واستراتيجي في التنمية الزراعية. المدير العام لشركة AGRICAPITAL SARL، وهي جهة تشغيل وتطوير زراعي متخصصة في إنشاء مزارع نخيل زيت متكاملة في كوت ديفوار. أكثر من 12 سنة من الخبرة الميدانية في خدمة الزراعة والابتكار.",
      contact: "تواصل معي",
      discover: "اكتشف AGRICAPITAL"
    }
  }[language];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[hsl(var(--background))]">
      {/* Preload hashed founder photo so it appears instantly on production builds */}
      <Helmet>
        <link rel="preload" as="image" href={profilePhotoSm} type="image/webp" fetchPriority="high" />
        <link rel="preload" as="image" href={profilePhoto} type="image/webp" fetchPriority="high" />
      </Helmet>
      {/* Premium African visionary backdrop */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 60% at 80% 0%, hsl(var(--accent) / 0.18) 0%, transparent 60%), radial-gradient(70% 50% at 0% 100%, hsl(var(--primary) / 0.18) 0%, transparent 60%), linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--secondary)) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_6fr] gap-10 sm:gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Image Section */}
          <motion.div 
            className="order-2 lg:order-1 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative">
              {/* Soft halo */}
              <div className="absolute -inset-6 bg-gradient-to-tr from-primary/30 via-transparent to-accent/30 rounded-[2rem] blur-3xl opacity-60"></div>
              {/* Gold ring accent */}
              <div className="absolute -inset-2 rounded-[2rem] bg-gradient-to-br from-accent via-accent/40 to-primary opacity-90"></div>
              <motion.div 
                className="relative rounded-[1.75rem] overflow-hidden shadow-2xl bg-muted ring-1 ring-foreground/5"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 260 }}
              >
                <img
                  src={profilePhoto}
                  srcSet={`${profilePhotoSm} 320w, ${profilePhoto} 600w`}
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 350px, 448px"
                  alt="Inocent KOFFI - Gérant AGRICAPITAL SARL"
                  className="w-full h-auto max-w-[280px] sm:max-w-[350px] lg:max-w-md object-cover"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  width="600"
                  height="720"
                  style={{
                    backgroundImage: `url("${LQIP}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </motion.div>
              {/* Floating credential badge */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="hidden sm:flex absolute -bottom-5 -right-3 lg:-right-6 items-center gap-3 bg-background/95 backdrop-blur border border-border rounded-2xl px-4 py-3 shadow-xl"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                <div className="text-left leading-tight">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Côte d'Ivoire</div>
                  <div className="text-sm font-semibold text-foreground">12+ ans terrain</div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Text Section */}
          <div className="order-1 lg:order-2 text-center lg:text-left space-y-5 sm:space-y-7">
            <motion.div 
              className="flex flex-wrap gap-2 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-accent/15 text-accent-foreground rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] border border-accent/30">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                {copy.founder}
              </span>
              <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 text-primary rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] border border-primary/20">
                {copy.role}
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-foreground tracking-tight leading-[1.05]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Inocent
              <motion.span 
                className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-accent mt-1 sm:mt-2"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                KOFFI
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl lg:text-2xl font-serif italic text-foreground/85 leading-snug max-w-xl mx-auto lg:mx-0 border-l-2 border-accent pl-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
            >
              {copy.tagline}
            </motion.p>

            <motion.p 
              className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {copy.description}
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2 sm:pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Button 
                variant="default" 
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all w-full sm:w-auto text-sm sm:text-base"
                asChild
              >
                <Link to="/contact">
                  {copy.contact}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 hover:bg-accent/10 w-full sm:w-auto text-sm sm:text-base"
                asChild
              >
                  <Link to="/agricapital">{copy.discover}</Link>
              </Button>
            </motion.div>

            {/* Social Share Buttons */}
            <motion.div 
              className="pt-2 sm:pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <SocialShare className="justify-center lg:justify-start" />
            </motion.div>

            {/* Quick Contact Info */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-1 sm:pt-2 text-xs sm:text-sm text-muted-foreground justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
                <span>Daloa, Côte d'Ivoire</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-10 max-w-6xl mx-auto">
          <AgriSearch />
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-48 sm:w-72 h-48 sm:h-72 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-64 sm:w-96 h-64 sm:h-96 bg-primary/10 rounded-full blur-3xl"></div>
    </section>
  );
};

export default Hero;
