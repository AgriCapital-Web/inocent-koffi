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
      const [realisations, sites] = await Promise.all([
        supabase.from("realisations").select("*").eq("is_published", true).order("sort_order"),
        supabase.from("sites").select("*").eq("is_published", true).order("sort_order"),
      ]);
      if (realisations.error) throw realisations.error;
      if (sites.error) throw sites.error;
      const rows: PortfolioProject[] = (realisations.data ?? []).map(row => ({
        id: row.id, title: row.title, slug: row.slug, category: row.category,
        description: row.description, url: row.external_url, official_domain: null,
        image_url: row.thumbnail_url, fallback_image_url: null, last_live_preview_url: null,
        last_live_preview_at: null, live_preview_status: null, technologies: row.tags ?? [],
      }));
      const known = new Set(rows.map(row => row.url?.replace(/\/$/, "")));
      for (const site of sites.data ?? []) {
        if (known.has(site.url.replace(/\/$/, ""))) continue;
        rows.push({ id: site.id, title: site.name, slug: site.name.toLowerCase().replace(/\s+/g, "-"),
          category: site.url.includes("app.agricapital") ? "crm" : site.url.includes("client.agricapital") ? "applications" : "web",
          description: site.description, url: site.url, official_domain: null, image_url: site.logo_url,
          fallback_image_url: null, last_live_preview_url: null, last_live_preview_at: null,
          live_preview_status: null, technologies: [], });
      }
      return rows.filter(row => !/nanan/i.test(row.title + " " + row.slug));
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
