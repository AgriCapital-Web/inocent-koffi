import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ServiceRow = {
  id: string;
  slug: string;
  category: string;
  title: string;
  description: string | null;
  price: number | null;
  price_note: string | null;
  bullets: string[];
  image_url?: string | null;
  delivery_note?: string | null;
  is_featured?: boolean;
  is_orderable: boolean;
  is_published: boolean;
  sort_order: number;
};

export type RealisationRow = {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string | null;
  thumbnail_url: string | null;
  media: unknown;
  tags: string[];
  external_url: string | null;
  is_published: boolean;
  sort_order: number;
};

export type ProjectRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  content: string | null;
  image_url: string | null;
  external_url: string | null;
  category: string | null;
  status: string;
  is_published: boolean;
  sort_order: number;
};

export type SiteRow = {
  id: string;
  name: string;
  description: string | null;
  url: string;
  logo_url: string | null;
  category: string | null;
  status: string;
  is_published: boolean;
  sort_order: number;
};

export const useServices = () =>
  useQuery({
    queryKey: ["services", "public"],
    queryFn: async (): Promise<ServiceRow[]> => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_published", true)
        .eq("is_orderable", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as ServiceRow[];
    },
    staleTime: 60_000,
  });


export type ShopCategory = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  icon: string | null;
  sort_order: number;
  services: ServiceRow[];
};

export const useShopCatalog = () =>
  useQuery({
    queryKey: ["shop-catalog", "public"],
    queryFn: async (): Promise<ShopCategory[]> => {
      const { data, error } = await supabase.from("services").select("*")
        .eq("is_published", true).eq("is_orderable", true).order("sort_order");
      if (error) throw error;
      const labels: Record<string, string> = { web: "Web & solutions digitales", video: "Vidéo & création digitale", audio: "Audio & musique", ia: "IA & automatisation", formation: "Formation & accompagnement" };
      const rows = (data ?? []) as ServiceRow[];
      return Array.from(new Set(rows.map(row => row.category))).map((key, index) => ({
        id: key, slug: key, title: labels[key] ?? key, subtitle: null, icon: key,
        sort_order: index, services: rows.filter(row => row.category === key),
      }));
    },
    staleTime: 60_000,
  });

export const useRealisations = () =>
  useQuery({
    queryKey: ["realisations", "public"],
    queryFn: async (): Promise<RealisationRow[]> => {
      const db = supabase as any;
      const { data, error } = await db.from("portfolio_projects")
        .select("id,title,slug,category,description,image_url,fallback_image_url,last_live_preview_url,url,technologies,is_published,sort_order")
        .eq("is_published", true).order("sort_order", { ascending: true });
      if (error) throw error;
      return ((data ?? []) as any[]).map((row) => ({
        id: row.id, title: row.title, slug: row.slug, category: row.category ?? "web",
        description: row.description,
        thumbnail_url: row.image_url || row.fallback_image_url || row.last_live_preview_url || null,
        media: [], tags: row.technologies ?? [], external_url: row.url,
        is_published: row.is_published, sort_order: row.sort_order ?? 0,
      }));
    },
    staleTime: 60_000,
  });\n\nexport const useOtherProjects = () =>
  useQuery({
    queryKey: ["other_projects", "public"],
    queryFn: async (): Promise<ProjectRow[]> => {
      const db = supabase as any;
      const { data, error } = await db.from("portfolio_projects")
        .select("id,title,slug,description,url,image_url,fallback_image_url,last_live_preview_url,category,is_published,sort_order")
        .eq("is_published", true).order("sort_order", { ascending: true });
      if (error) throw error;
      return ((data ?? []) as any[]).map((row) => ({
        id: row.id, name: row.title, slug: row.slug, description: row.description, content: null,
        image_url: row.image_url || row.fallback_image_url || row.last_live_preview_url || null,
        external_url: row.url, category: row.category, status: "published",
        is_published: row.is_published, sort_order: row.sort_order ?? 0,
      }));
    },
    staleTime: 60_000,
  });\n\nexport const useSites = () =>
  useQuery({
    queryKey: ["sites", "public"],
    queryFn: async (): Promise<SiteRow[]> => {
      const db = supabase as any;
      const { data, error } = await db.from("portfolio_projects")
        .select("id,title,description,url,image_url,fallback_image_url,last_live_preview_url,category,is_published,sort_order")
        .eq("is_published", true).order("sort_order", { ascending: true });
      if (error) throw error;
      return ((data ?? []) as any[]).map((row) => ({
        id: row.id, name: row.title, description: row.description, url: row.url,
        logo_url: row.image_url || row.fallback_image_url || row.last_live_preview_url || null,
        category: row.category, status: "published", is_published: row.is_published,
        sort_order: row.sort_order ?? 0,
      }));
    },
    staleTime: 60_000,
  });\n\nexport const formatFcfa = (value: number) =>
  `${new Intl.NumberFormat("fr-FR").format(value)} FCFA`;

export const servicePriceLabel = (s: Pick<ServiceRow, "price" | "price_note">) => {
  if (s.price == null) return s.price_note || "Sur devis";
  return s.price_note ? `${s.price_note} ${formatFcfa(s.price)}` : formatFcfa(s.price);
};
