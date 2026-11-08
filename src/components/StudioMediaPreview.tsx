import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, FileText, Film, Image as ImageIcon, Music2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type MediaKind = "image" | "video" | "audio" | "file";
type StudioMedia = { name: string; url: string; kind: MediaKind };

const BUCKET = "blog-media";
const FOLDER = "studio";

const getKind = (name: string, mimeType: string): MediaKind => {
  if (mimeType.startsWith("image/") || /\.(avif|gif|jpe?g|png|webp)$/i.test(name)) return "image";
  if (mimeType.startsWith("video/") || /\.(mp4|webm|mov|m4v)$/i.test(name)) return "video";
  if (mimeType.startsWith("audio/") || /\.(mp3|m4a|wav|ogg|aac)$/i.test(name)) return "audio";
  return "file";
};

const StudioMediaPreview = () => {
  const [items, setItems] = useState<StudioMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const { data, error } = await supabase.storage
          .from(BUCKET)
          .list(FOLDER, { limit: 24, sortBy: { column: "created_at", order: "desc" } });

        if (error) throw error;

        const published: StudioMedia[] = (data ?? [])
          .filter((file) => Boolean(file.id && file.name && !file.name.startsWith(".")))
          .map((file) => {
            const metadata = (file as unknown as { metadata?: { mimetype?: string } }).metadata;
            const mimeType = metadata?.mimetype ?? "";
            return {
              name: file.name,
              url: supabase.storage.from(BUCKET).getPublicUrl(FOLDER + "/" + file.name).data.publicUrl,
              kind: getKind(file.name, mimeType),
            };
          });

        if (active) setItems(published);
      } catch {
        if (active) setItems([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => { active = false; };
  }, []);

  if (loading || items.length === 0) return null;

  return (
    <section className="section-space bg-secondary/30" aria-labelledby="studio-publications-title">
      <div className="site-container">
        <div className="content-measure">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-accent">
                <Sparkles className="h-4 w-4" /> Studio média
              </span>
              <h2 id="studio-publications-title" className="mt-2 text-2xl font-bold sm:text-3xl">
                Créations & publications
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Une sélection de contenus vidéo, audio et visuels publiés par le Studio.
              </p>
            </div>
            <Link to="/studio" className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline">
              Découvrir le Studio <ExternalLink className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article key={item.name} className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card">
                {item.kind === "image" && (
                  <div className="aspect-[16/10] overflow-hidden bg-muted">
                    <img
                      src={item.url}
                      alt={"Création du Studio média : " + item.name.replace(/[-_]/g, " ")}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )}
                {item.kind === "video" && (
                  <video src={item.url} controls preload="metadata" className="aspect-video w-full bg-black" aria-label={"Vidéo du Studio : " + item.name} />
                )}
                {item.kind === "audio" && (
                  <div className="flex aspect-[16/10] flex-col items-center justify-center gap-4 bg-muted p-5">
                    <Music2 className="h-10 w-10 text-accent" />
                    <audio src={item.url} controls preload="none" className="w-full" />
                  </div>
                )}
                {item.kind === "file" && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex aspect-[16/10] flex-col items-center justify-center gap-3 bg-muted p-5 text-muted-foreground hover:text-foreground">
                    <FileText className="h-10 w-10" />
                    <span className="text-sm font-semibold">Ouvrir le document</span>
                  </a>
                )}
                <div className="flex items-center gap-2 px-4 py-3 text-sm font-medium">
                  {item.kind === "image" ? <ImageIcon className="h-4 w-4 shrink-0 text-accent" /> : <Film className="h-4 w-4 shrink-0 text-accent" />}
                  <span className="min-w-0 truncate">{item.name.replace(/[-_]/g, " ").replace(/\.[^.]+$/, "")}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudioMediaPreview;
