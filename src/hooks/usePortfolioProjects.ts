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

export const usePortfolioProjects = () =>
  useQuery({
    queryKey: ["portfolio-projects-public"],
    queryFn: async (): Promise<PortfolioProject[]> => {
      const { data, error } = await supabase
        .from("portfolio_projects")
        .select("id,title,slug,category,description,url,official_domain,image_url,fallback_image_url,last_live_preview_url,last_live_preview_at,live_preview_status,technologies")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });

      if (error) throw error;

      return (data ?? []).map(row => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        category: row.category,
        description: row.description,
        url: row.url,
        official_domain: row.official_domain,
        image_url: row.image_url,
        fallback_image_url: row.fallback_image_url,
        last_live_preview_url: row.last_live_preview_url,
        last_live_preview_at: row.last_live_preview_at,
        live_preview_status: row.live_preview_status,
        technologies: row.technologies ?? [],
      }));
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
