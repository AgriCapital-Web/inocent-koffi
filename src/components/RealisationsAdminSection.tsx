import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { useRealisations } from "@/hooks/useSiteContent";

const CATEGORIES = [
  { id: "all", label: "Toutes" },
  { id: "web", label: "Web & Digital" },
  { id: "ia", label: "IA" },
  { id: "video", label: "Vidéo" },
  { id: "audio", label: "Audio" },
  { id: "musique", label: "Musique" },
  { id: "contenu", label: "Contenu digital" },
];

/** Réalisations administrées + publications du studio média, fusionnées sur la page Réalisations. */
const RealisationsAdminSection = () => {
  const { data: items = [] } = useRealisations();
  const [filter, setFilter] = useState("all");
  const [studio, setStudio] = useState<{ name: string; url: string }[]>([]);

  useEffect(() => {
    void (async () => {
      const { data } = await supabase.storage.from("blog-media").list("studio", {
        limit: 24,
        sortBy: { column: "created_at", order: "desc" },
      });
      const files = (data ?? []).filter((f) => f.name && !f.name.startsWith("."));
      setStudio(
        files.map((f) => ({
          name: f.name,
          url: supabase.storage.from("blog-media").getPublicUrl(`studio/${f.name}`).data.publicUrl,
        })),
      );
    })();
  }, []);

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.category === filter)),
    [items, filter],
  );

  if (items.length === 0 && studio.length === 0) return null;

  return (
    <section id="studio" className="py-14 sm:py-20 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground text-center">
          Créations <span className="text-accent">studio</span> & réalisations récentes
        </h2>
        <p className="mt-3 text-center text-muted-foreground max-w-2xl mx-auto">
          Vidéos, visuels, contenus audio et projets digitaux publiés depuis mon studio — tous protégés par la
          signature « By Inocent KOFFI ».
        </p>

        {items.length > 0 && (
          <>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {CATEGORIES.filter((c) => c.id === "all" || items.some((i) => i.category === c.id)).map((c) => (
                <button
                  key={c.id}
                  onClick={() => setFilter(c.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    filter === c.id
                      ? "bg-accent text-accent-foreground"
                      : "bg-card text-muted-foreground hover:text-foreground border border-border"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((r) => (
                <motion.article
                  key={r.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
                >
                  {r.thumbnail_url && (
                    <img
                      src={r.thumbnail_url}
                      alt={`Réalisation ${r.title} par Inocent KOFFI`}
                      className="h-44 w-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-lg font-bold text-foreground">{r.title}</h3>
                    {r.description && (
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{r.description}</p>
                    )}
                    {r.tags?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {r.tags.map((t) => (
                          <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                        ))}
                      </div>
                    )}
                    {r.external_url && (
                      <a
                        href={r.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
                      >
                        Voir <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                      </a>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          </>
        )}

        {studio.length > 0 && (
          <div className="mt-12">
            <h3 className="font-display text-xl font-bold text-foreground text-center">Dernières publications</h3>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {studio.map((s) => (
                <figure key={s.name} className="overflow-hidden rounded-2xl border border-border bg-card">
                  <img
                    src={s.url}
                    alt={`Publication du studio d'Inocent KOFFI : ${s.name.replace(/[-_]/g, " ")}`}
                    className="h-40 w-full object-cover"
                    loading="lazy"
                  />
                </figure>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RealisationsAdminSection;
