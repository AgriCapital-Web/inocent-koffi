import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Landmark, Palmtree, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Slide = {
  kind: "image" | "video";
  src: string;
  poster?: string;
  title: string;
  caption: string;
  href: string;
  eyebrow: string;
};

// Live media pulled from agricapital.ci (trésors) — images cached via thum.io,
// vidéo native intégrée depuis le domaine officiel.
const cover = (url: string) =>
  `https://image.thum.io/get/width/1600/crop/1000/noanimate/refresh/86400/${url}`;

const SLIDES: Slide[] = [
  {
    kind: "image",
    src: cover("https://www.agricapital.ci/tresor-palmier"),
    title: "Le trésor caché du palmier à huile",
    caption:
      "Un arbre stratégique, productif pendant plus de 25 ans, adapté au climat et au potentiel foncier ivoirien.",
    href: "https://www.agricapital.ci/tresor-palmier",
    eyebrow: "Bref investisseur",
  },
  {
    kind: "image",
    src: cover("https://www.agricapital.ci/tresor-foncier"),
    title: "Le trésor caché du foncier agricole",
    caption:
      "Les terres africaines inexploitées peuvent devenir un patrimoine productif, transmissible et à fort effet de levier.",
    href: "https://www.agricapital.ci/tresor-foncier",
    eyebrow: "Bref investisseur",
  },
  {
    kind: "image",
    src: cover("https://www.agricapital.ci/"),
    title: "AgriCapital — Investir la terre. Cultiver l'avenir.",
    caption:
      "Opérateur & promoteur agricole intégré : sécurisation foncière, plantation clé en main, gestion & garantie d'écoulement.",
    href: "https://www.agricapital.ci/",
    eyebrow: "Site officiel",
  },
];

const AgriCapitalTreasures = () => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [paused, setPaused] = useState(false);

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
    }, 6000);
    return () => window.clearInterval(id);
  }, [api, paused]);

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-8">
            <Badge variant="outline" className="mb-3 border-accent text-accent">
              <Landmark className="w-3.5 h-3.5 mr-1.5" />
              Trésors AgriCapital
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
              Les <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">trésors cachés</span> du foncier & du palmier
            </h2>
            <p className="text-muted-foreground leading-relaxed text-justify">
              Deux ressources stratégiques encore largement sous-exploitées en Afrique. Découvrez les briefs investisseurs, images et vidéo publiés sur agricapital.ci — synchronisés en direct.
            </p>
          </div>

          <div
            className="relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <Carousel setApi={setApi} opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent className="-ml-3 sm:-ml-4">
                {SLIDES.map((s, i) => (
                  <CarouselItem
                    key={s.title}
                    className="pl-3 sm:pl-4 basis-full md:basis-1/2 lg:basis-1/2"
                  >
                    <motion.article
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className="group h-full bg-card rounded-2xl overflow-hidden border border-border/60 shadow-sm hover:shadow-xl transition-all flex flex-col"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                        {s.kind === "video" ? (
                          <video
                            className="w-full h-full object-cover"
                            src={s.src}
                            poster={s.poster}
                            controls
                            preload="metadata"
                            playsInline
                          />
                        ) : (
                          <img
                            src={s.src}
                            alt={s.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                          />
                        )}
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-background/90 backdrop-blur text-foreground border border-border/60">
                          {s.eyebrow}
                        </span>
                        <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/90 text-white shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          Live agricapital.ci
                        </span>
                      </div>
                      <div className="p-5 sm:p-6 flex flex-col flex-1 gap-3">
                        <div className="flex items-center gap-2 text-primary">
                          {i === 0 ? <Palmtree className="w-4 h-4" /> : <Landmark className="w-4 h-4" />}
                          <span className="text-[11px] uppercase tracking-widest font-semibold">
                            AgriCapital
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-foreground leading-snug">
                          {s.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed text-justify flex-1">
                          {s.caption}
                        </p>
                        <Button asChild size="sm" className="mt-2 w-fit">
                          <a href={s.href} target="_blank" rel="noopener noreferrer">
                            Lire le brief
                            <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                          </a>
                        </Button>
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
                    aria-label={`Slide ${i + 1}`}
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
      </div>
    </section>
  );
};

export default AgriCapitalTreasures;