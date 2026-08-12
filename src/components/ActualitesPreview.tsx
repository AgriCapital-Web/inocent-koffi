import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { actualites } from "@/data/agricapitalUpdates";
import { trackCta } from "@/lib/analytics";

const ActualitesPreview = () => {
  const items = actualites.slice(0, 3);

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <Badge variant="outline" className="mb-3">Actualités AgriCapital</Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Les dernières nouvelles du terrain
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Actualités officielles publiées par AGRICAPITAL SARL, reprises ici sans modification des textes.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/actualites">
              Toutes les actualités
              <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {items.map((a, i) => (
            <motion.article
              key={a.slug}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link to={`/actualites/${a.slug}`} className="block aspect-[16/10] overflow-hidden">
                <img
                  src={a.image}
                  alt={a.imageAlt}
                  width={800}
                  height={500}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
              <div className="flex flex-col flex-1 p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Badge variant="secondary" className="text-[11px]">{a.category}</Badge>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" aria-hidden="true" />
                    <time dateTime={a.date}>{a.dateLabel}</time>
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-foreground leading-snug">
                  <Link to={`/actualites/${a.slug}`}>{a.title}</Link>
                </h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-3 text-justify">{a.excerpt}</p>
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <Link
                    to={`/actualites/${a.slug}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Lire l'actualité
                  </Link>
                  <a
                    href={a.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackCta("agricapital_source", "actualites_preview")}
                    className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    AgriCapital
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActualitesPreview;
