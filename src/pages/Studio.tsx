import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Film, Music, Sparkles, Wand2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const BUCKET = "blog-media";
const FOLDER = "studio";

const PILLARS = [
  {
    icon: Film,
    title: "Vidéo & création IA",
    desc: "Vidéos courtes, voix off, synchronisation labiale et habillage graphique pour vos campagnes.",
  },
  {
    icon: Music,
    title: "Audio & musique",
    desc: "Jingles, chansons personnalisées et mini-clips produits et mixés en interne.",
  },
  {
    icon: Wand2,
    title: "Visuels prêts à publier",
    desc: "Affiches, vignettes et visuels réseaux sociaux livrés optimisés pour un affichage rapide.",
  },
];

const Studio = () => {
  const [gallery, setGallery] = useState<{ name: string; url: string }[]>([]);

  useEffect(() => {
    let active = true;
    supabase.storage
      .from(BUCKET)
      .list(FOLDER, { limit: 24, sortBy: { column: "created_at", order: "desc" } })
      .then(({ data }) => {
        if (!active) return;
        setGallery(
          (data ?? [])
            .filter((f) => f.name && !f.name.startsWith("."))
            .map((f) => ({
              name: f.name,
              url: supabase.storage.from(BUCKET).getPublicUrl(`${FOLDER}/${f.name}`).data.publicUrl,
            })),
        );
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Studio Média — Vidéo, audio et visuels | Inocent KOFFI</title>
        <meta
          name="description"
          content="Studio média d'Inocent KOFFI : vidéos, voix off, jingles, chansons, mini-clips et visuels prêts à publier pour entreprises et institutions en Côte d'Ivoire."
        />
        <meta property="og:title" content="Studio Média — Inocent KOFFI" />
        <meta
          property="og:description"
          content="Vidéo, audio, musique et visuels produits par le studio média d'Inocent KOFFI."
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://ikoffi.agricapital.ci/studio" />
      </Helmet>

      <div className="min-h-screen">
        <Navbar />

        <section
          className="relative pt-28 pb-16 text-white overflow-hidden"
          style={{ background: "var(--gradient-visionary)" }}
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_15%_20%,hsl(var(--gold))_0%,transparent_42%),radial-gradient(circle_at_85%_75%,hsl(var(--terracotta))_0%,transparent_45%)]"
          />
          <div className="relative container mx-auto w-full px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 ring-1 ring-white/20 text-xs sm:text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" /> Studio média
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 tracking-tight">
              Studio{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "var(--gradient-gold)" }}
              >
                Média
              </span>
            </h1>
            <p className="text-white/85 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Vidéos, visuels, jingles et musiques produits en interne, livrés prêts à publier sur
              tous vos canaux.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Button asChild size="lg">
                <Link to="/contact">Démarrer un projet</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <Link to="/services">Voir les tarifs</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-14 bg-background">
          <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-10">
              Ce que produit le <span className="text-accent">studio</span>
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {PILLARS.map(({ icon: Icon, title, desc }) => (
                <motion.article
                  key={title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-card border border-border rounded-2xl p-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {gallery.length > 0 && (
          <section className="py-14 bg-secondary/30">
            <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-8">
                Dernières <span className="text-accent">publications</span>
              </h2>
              <div className="grid gap-5 grid-cols-2 sm:grid-cols-3">
                {gallery.map((item) => (
                  <figure
                    key={item.name}
                    className="bg-card border border-border rounded-2xl overflow-hidden"
                  >
                    <img
                      src={item.url}
                      alt={`Publication du studio média d'Inocent KOFFI : ${item.name.replace(/[-_]/g, " ")}`}
                      className="w-full h-40 sm:h-48 object-cover"
                      loading="lazy"
                    />
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        <Footer />
      </div>
    </>
  );
};

export default Studio;
