import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, ExternalLink, ArrowRight } from "lucide-react";
import { actualites, AGRICAPITAL_URL } from "@/data/agricapitalUpdates";
import { BreadcrumbJsonLd, SITE_URL, WebPageJsonLd } from "@/components/SeoJsonLd";
import { trackCta } from "@/lib/analytics";

const Actualites = () => {
  const categories = useMemo(
    () => ["Toutes", ...Array.from(new Set(actualites.map((a) => a.category)))],
    [],
  );
  const [active, setActive] = useState("Toutes");
  const items = active === "Toutes" ? actualites : actualites.filter((a) => a.category === active);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Actualités AgriCapital — Inocent KOFFI",
    itemListElement: actualites.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/actualites/${a.slug}`,
      name: a.title,
    })),
  };

  return (
    <>
      <Helmet>
        <title>Actualités AgriCapital | Inocent KOFFI, Fondateur & CEO</title>
        <meta
          name="description"
          content="Actualités officielles d'AGRICAPITAL SARL suivies par Inocent KOFFI : bureau de Gonaté, pépinière, offres PalmInvest et TerraPalm, équipes et terrain."
        />
        <link rel="canonical" href={`${SITE_URL}/actualites`} />
        <meta property="og:title" content="Actualités AgriCapital | Inocent KOFFI" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/actualites`} />
        <meta
          property="og:description"
          content="Les actualités officielles d'AGRICAPITAL SARL, portées par Inocent KOFFI, Fondateur & CEO."
        />
        <script type="application/ld+json">{JSON.stringify(itemListJsonLd)}</script>
      </Helmet>
      <WebPageJsonLd
        path="/actualites"
        name="Actualités AgriCapital"
        description="Actualités officielles d'AGRICAPITAL SARL reprises sur le site personnel d'Inocent KOFFI."
      />
      <BreadcrumbJsonLd items={[{ name: "Actualités", path: "/actualites" }]} />

      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20">
          <section className="py-14 sm:py-20 bg-gradient-to-br from-background via-secondary/30 to-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
              <Badge variant="outline" className="mb-4">Actualités</Badge>
              <h1 className="font-display text-3xl sm:text-5xl font-bold text-foreground mb-5">
                Actualités <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">AgriCapital</span>
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                Les nouvelles officielles d'AGRICAPITAL SARL, l'entreprise que je dirige en tant que
                Fondateur &amp; CEO. Les textes sont repris intégralement depuis agricapital.ci ; seule
                la mise en page est adaptée à ce site.
              </p>
            </div>
          </section>

          <section className="py-10 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap gap-2 justify-center mb-10">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setActive(c)}
                    aria-pressed={active === c}
                    className={`px-3.5 py-1.5 rounded-full text-sm border transition-colors ${
                      active === c
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-muted-foreground border-border hover:border-primary/40"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {items.map((a, i) => (
                  <motion.article
                    key={a.slug}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-xl transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (i % 3) * 0.07 }}
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
                      <h2 className="font-display text-lg font-bold text-foreground leading-snug">
                        <Link to={`/actualites/${a.slug}`}>{a.title}</Link>
                      </h2>
                      <p className="text-sm text-muted-foreground mt-2 text-justify">{a.excerpt}</p>
                      <div className="mt-auto pt-4 flex items-center justify-between">
                        <Link to={`/actualites/${a.slug}`} className="text-sm font-medium text-primary hover:underline">
                          Lire l'actualité
                        </Link>
                        <a
                          href={a.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackCta("agricapital_source", "actualites_list")}
                          className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" aria-hidden="true" />
                          Source
                        </a>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              <div className="text-center mt-12">
                <Button asChild size="lg">
                  <a
                    href={AGRICAPITAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackCta("agricapital_site", "actualites_footer")}
                  >
                    Découvrir AgriCapital
                    <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                  </a>
                </Button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Actualites;
