import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type PortfolioProject = {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string | null;
  url: string | null;
  official_domain: string | null;
  image_url: string | null;
  fallback_image_url: string | null;
  last_live_preview_url: string | null;
  last_live_preview_at: string | null;
  live_preview_status: string | null;
  technologies: string[];
};

type PortfolioRow = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  description: string | null;
  url: string | null;
  official_domain: string | null;
  image_url: string | null;
  fallback_image_url: string | null;
  last_live_preview_url: string | null;
  last_live_preview_at: string | null;
  live_preview_status: string | null;
  technologies: string[] | null;
  is_published: boolean;
  sort_order: number | null;
};

export const usePortfolioProjects = () =>
  useQuery({
    queryKey: ["portfolio-projects-public"],
    queryFn: async (): Promise<PortfolioProject[]> => {
      // The live Vitrine database uses portfolio_projects as the canonical
      // public source. Keep this query deliberately independent from legacy
      // realisations/sites tables that no longer exist in the live schema.
      const db = supabase as any;
      const { data, error } = await db
        .from("portfolio_projects")
        .select("id,title,slug,category,description,url,official_domain,image_url,fallback_image_url,last_live_preview_url,last_live_preview_at,live_preview_status,technologies,is_published,sort_order")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });

      if (error) throw error;

      return ((data ?? []) as PortfolioRow[])
        .map((row) => ({
          id: row.id,
          title: row.title,
          slug: row.slug,
          category: row.category || "web",
          description: row.description,
          url: row.url,
          official_domain: row.official_domain,
          image_url: row.image_url || row.last_live_preview_url || null,
          fallback_image_url: row.fallback_image_url || null,
          last_live_preview_url: row.last_live_preview_url,
          last_live_preview_at: row.last_live_preview_at,
          live_preview_status: row.live_preview_status,
          technologies: row.technologies ?? [],
        }))
        .filter((row) => !/nanan/i.test(row.title + " " + row.slug));
    },
    staleTime: 60_000,
    refetchInterval: 60_000,
  });

export const getPortfolioPreviewSource = (project: PortfolioProject) =>
  project.official_domain || project.url || "";

export const getPortfolioFallbackSource = (project: PortfolioProject) =>
  project.last_live_preview_url || project.fallback_image_url || project.image_url || "";

export const buildPortfolioLivePreview = (url: string, cacheKey?: string) =>
  `https://image.thum.io/get/width/1200/crop/700/noanimate/refresh/60/${url}${cacheKey ? `#v=${cacheKey}` : ""}`;
