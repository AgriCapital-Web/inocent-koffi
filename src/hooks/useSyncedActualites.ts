import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AGRICAPITAL_URL, type Actualite } from "@/data/agricapitalUpdates";

const FALLBACK_IMAGE = "/images/agricapital/plantation-1.webp";

/**
 * Actualités importées automatiquement depuis agricapital.ci (synchronisation
 * quotidienne). Les textes sont conservés à l'identique ; seule la mise en
 * page suit la structure de ce site.
 */
export const useSyncedActualites = () =>
  useQuery({
    queryKey: ["agricapital-news"],
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<Actualite[]> => {
      const { data, error } = await supabase
        .from("agricapital_news")
        .select("slug, category, date, date_label, title, excerpt, content, image, image_alt, source_url")
        .eq("is_published", true)
        .order("date", { ascending: false });

      if (error) throw error;

      return (data ?? []).map((row) => ({
        slug: row.slug,
        category: row.category ?? "Actualité",
        date: row.date ?? "",
        dateLabel: row.date_label ?? "",
        title: row.title,
        excerpt: row.excerpt ?? "",
        content: Array.isArray(row.content) ? (row.content as string[]) : [],
        image: row.image || FALLBACK_IMAGE,
        imageAlt: row.image_alt ?? row.title,
        sourceUrl: row.source_url ?? AGRICAPITAL_URL,
      }));
    },
  });
