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

const PORTFOLIO_FIELDS =
  "id,title,slug,category,description,url,official_domain,image_url,fallback_image_url,last_live_preview_url,last_live_preview_at,live_preview_status,technologies";

export const usePortfolioProjects = () =>
  useQuery({
    queryKey: ["portfolio-projects-public"],
    queryFn: async (): Promise<PortfolioProject[]> => {
      const { data, error } = await (supabase as any)
        .from("portfolio_projects")
        .select(PORTFOLIO_FIELDS)
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []) as PortfolioProject[];
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
