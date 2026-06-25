import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useLanguage } from "@/hooks/useLanguage";

type Site = {
  name: string;
  tag: string;
  description: string;
  url?: string; // omitted = no link (e.g. confidential / text-only)
  image: string; // fallback static screenshot
};

const SITES: Site[] = [
  {
    name: "AGRICAPITAL",
    tag: "Agriculture",
    description:
      "Opérateur agricole — plantations de palmier à huile clé en main en Côte d'Ivoire.",
    url: "https://agricapital.ci",
    image: "/images/showcase/agricapital.png",
  },
  {
    name: "App AGRICAPITAL",
    tag: "Plateforme",
    description:
      "Espace de gestion sécurisé des planteurs et plantations AGRICAPITAL.",
    url: "https://app.agricapital.ci",
    image: "/images/showcase/app-agricapital.png",
  },
  {
    name: "Legal Form",
    tag: "Juridique",
    description:
      "Création et gestion d'entreprises en Côte d'Ivoire et zone OHADA.",
    url: "https://legalform.ci",
    image: "/images/showcase/legalform.png",
  },
  {
    name: "Ivoireprojet (MIPROJET)",
    tag: "Incubation",
    description:
      "Plateforme panafricaine de structuration, financement et incubation de projets.",
    url: "https://ivoireprojet.com",
    image: "/images/showcase/ivoireprojet.png",
  },
  {
    name: "MIPROJET+",
    tag: "Incubation",
    description:
      "Plateforme premium d'accompagnement, structuration et suivi avancé de projets.",
    url: "https://miprojetplus.ivoireprojet.com",
    image: "/images/showcase/ivoireprojet.png",
  },
  {
    name: "ANZRBO",
    tag: "Plateforme",
    description:
      "Plateforme digitale — solution dédiée aux besoins métiers en Afrique.",
    url: "https://anzrbo.vercel.app",
    image: "/images/showcase/agricapital.png",
  },
  {
    name: "ASSOJEREB",
    tag: "Communauté",
    description:
      "Association des Jeunes Ressortissants de Brongouzé — solidarité et développement.",
    url: "https://assojereb.ivoireprojet.com",
    image: "/images/showcase/assojereb.png",
  },
  {
    name: "Scoly",
    tag: "Éducation",
    description:
      "Initiative dédiée à l'accompagnement et à l'équipement scolaire en Côte d'Ivoire.",
    image: "/images/showcase/scoly.png",
  },
];

// Map UI language to a browser Accept-Language header so the live screenshot
// reflects the visitor's language (fixes agricapital.ci rendering in English).
const ACCEPT_LANGUAGE: Record<string, string> = {
  fr: "fr-FR,fr;q=0.9",
  en: "en-US,en;q=0.9",
  es: "es-ES,es;q=0.9",
  de: "de-DE,de;q=0.9",
  zh: "zh-CN,zh;q=0.9",
  ar: "ar-SA,ar;q=0.9",
};

// Live screenshot via thum.io — refreshed daily, with Accept-Language header
// so the captured page uses the visitor's language.
const liveScreenshot = (url: string | undefined, language: string) => {
  if (!url) return null;
  const lang = ACCEPT_LANGUAGE[language] || ACCEPT_LANGUAGE.fr;
  const header = encodeURIComponent(`Accept-Language:${lang}`);
  return `https://image.thum.io/get/width/1200/crop/750/noanimate/refresh/86400/headers/${header}/${url}`;
};

const EcosystemShowcase = () => {
  const { language } = useLanguage();
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [paused, setPaused] = useState(false);

  const labels = {
    fr: {
      eyebrow: "Écosystème",
      title: "L'univers Inocent KOFFI",
      desc:
        "À l'intersection de l'entrepreneuriat, de l'agriculture et du numérique. J'accompagne la création et la structuration de projets à travers le développement de plateformes digitales, d'outils métiers et de solutions adaptées aux réalités africaines. Explorez une sélection de projets, plateformes et solutions conçus pour répondre à des besoins concrets d'entreprises, d'organisations et de porteurs de projets.",
      visit: "Visiter",
    },
    en: {
      eyebrow: "Ecosystem",
      title: "The Inocent KOFFI universe",
      desc:
        "At the intersection of entrepreneurship, agriculture and digital. I support the creation and structuring of projects through digital platforms, business tools and solutions tailored to African realities. Explore a selection of projects, platforms and solutions designed to meet concrete needs of companies, organisations and project leaders.",
      visit: "Visit",
    },
  }[language === "fr" ? "fr" : "en"];

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || paused) return;
    const id = window.setInterval(() => {
      if (api.canScrollNext()) api.scrollNext();
      else api.scrollTo(0);
    }, 5000);
    return () => window.clearInterval(id);
  }, [api, paused]);

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 bg-accent/15 text-foreground rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] border border-accent/30 mb-4">
            {labels.eyebrow}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            {labels.title}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground text-justify hyphens-auto">{labels.desc}</p>
        </div>

        <div
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <Carousel setApi={setApi} opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-3 sm:-ml-4">
              {SITES.map((site, i) => (
                <CarouselItem
                  key={site.name}
                  className="pl-3 sm:pl-4 basis-[88%] sm:basis-1/2 lg:basis-1/3"
                >
                  <motion.article
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="group h-full bg-card rounded-2xl overflow-hidden border border-border/60 shadow-sm hover:shadow-xl transition-all flex flex-col"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      <img
                        src={liveScreenshot(site.url, language) || site.image}
                        alt={`Aperçu ${site.name}`}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          const img = e.currentTarget;
                          if (img.src !== window.location.origin + site.image) {
                            img.src = site.image;
                          }
                        }}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-background/90 backdrop-blur text-foreground border border-border/60">
                        {site.tag}
                      </span>
                      {site.url && (
                        <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/90 text-white shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          Live
                        </span>
                      )}
                    </div>
                    <div className="p-4 sm:p-5 flex flex-col flex-1 gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-foreground">{site.name}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {site.description}
                      </p>
                      {site.url ? (
                        <a
                          href={site.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                        >
                          {labels.visit}
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span className="mt-auto inline-flex items-center gap-1.5 text-xs italic text-muted-foreground">
                          Initiative en cours
                        </span>
                      )}
                    </div>
                  </motion.article>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => api?.scrollPrev()}
              aria-label="Précédent"
              className="w-10 h-10 rounded-full bg-background border border-border shadow-sm hover:bg-muted hover:border-accent flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex gap-1.5">
              {Array.from({ length: count }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => api?.scrollTo(i)}
                  aria-label={`Aller à la diapositive ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === current ? "w-8 bg-accent" : "w-2 bg-border hover:bg-muted-foreground/40"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => api?.scrollNext()}
              aria-label="Suivant"
              className="w-10 h-10 rounded-full bg-background border border-border shadow-sm hover:bg-muted hover:border-accent flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcosystemShowcase;