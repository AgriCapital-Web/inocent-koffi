import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, Clock3, Eye, Search, Sparkles, Play, CalendarDays } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { SITE_URL, BreadcrumbJsonLd, WebPageJsonLd } from "@/components/SeoJsonLd";
import { useLanguage } from "@/hooks/useLanguage";

type NewsItem = { id: string; slug: string; title_fr: string; excerpt_fr?: string | null; content_fr?: string | null; category?: string | null; featured_image?: string | null; images?: unknown; videos?: unknown; is_featured?: boolean; published_at?: string | null; created_at: string; views_count?: number | null; };

const parseArray = (v: unknown): string[] => Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : typeof v === "string" ? (() => { try { const p = JSON.parse(v); return Array.isArray(p) ? p.filter((x): x is string => typeof x === "string") : []; } catch { return []; } })() : [];
const strip = (v = "") => v.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const media = (v?: string | null) => { if (!v) return ""; const value = v.trim(); if (/^https?:\/\//i.test(value)) return value.replace(/^http:\/\//i, "https://"); if (value.startsWith("images/")) return "/" + value; if (value.startsWith("/inauguration/") || value.startsWith("/formation/")) return "https://www.agricapital.ci" + value; return value.startsWith("/") ? value : "/" + value; };
const safeImage = (src: string | undefined, alt: string) => <img src={media(src) || "/placeholder.svg"} alt={alt} loading="lazy" decoding="async" className="h-full w-full object-cover" onError={(e) => { const i = e.currentTarget; if (i.src.endsWith("/placeholder.svg")) return; i.onerror = null; i.src = "/placeholder.svg"; }} />;
const minutes = (t = "") => Math.max(1, Math.ceil(strip(t).split(/\s+/).filter(Boolean).length / 220));

export default function Actualites() {
  const { language, t } = useLanguage();
  const [cat, setCat] = useState("Toutes");
  const [q, setQ] = useState("");
  const [cinema, setCinema] = useState(true);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["personal-news"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("news").select("*").eq("is_published", true).order("published_at", { ascending: false }).limit(100);
      if (error) throw error;
      return data as NewsItem[];
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const loc = (x: NewsItem, k: "title" | "excerpt" | "content") => ((x as any)[k + "_" + language] || x[k === "title" ? "title_fr" : k === "excerpt" ? "excerpt_fr" : "content_fr"] || "").trim();
  const categories = useMemo(() => ["Toutes", ...Array.from(new Set(items.map(i => i.category?.trim()).filter(Boolean) as string[]))], [items]);
  const filtered = useMemo(() => items.filter(i => (cat === "Toutes" || i.category === cat) && (!q || [loc(i, "title"), loc(i, "excerpt"), strip(loc(i, "content")), i.category].join(" ").toLowerCase().includes(q.toLowerCase()))), [items, cat, q, language]);
  const featured = filtered.find(i => i.is_featured) || filtered[0];
  const others = filtered.filter(i => i.id !== featured?.id);

  useEffect(() => setCinema(true), [featured?.id]);

  return (
    <>
      <Helmet><title>Actualités | Inocent KOFFI</title><meta name="description" content="Actualités, analyses, terrain, agriculture, numérique, IA et entrepreneuriat." /><link rel="canonical" href={SITE_URL + "/actualites"} /></Helmet>
      <WebPageJsonLd path="/actualites" name="Actualités — Inocent KOFFI" description="Actualités, analyses, terrain et idées." />
      <BreadcrumbJsonLd items={[{ name: "Actualités", path: "/actualites" }]} />

      <div className="min-h-screen bg-[#f4f1ea] text-[#151515]">
        <Navbar />
        <main className="pt-20">
          <section className="relative min-h-[82vh] overflow-hidden bg-[#0b0d0c] text-white">
            {featured && <div className={"absolute inset-0 " + (cinema ? "scale-[1.04] transition-transform duration-[1800ms]" : "")}>{safeImage(media(parseArray(featured.images)[0] || featured.featured_image), loc(featured, "title"))}</div>}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080908] via-[#080908]/65 to-[#080908]/15" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080908]/75 via-[#080908]/20 to-transparent" />
            <div className="absolute inset-0 [background-image:radial-gradient(circle_at_78%_18%,rgba(201,154,74,.3),transparent_30%)]" />

            <div className="relative mx-auto flex min-h-[82vh] w-full max-w-[120rem] items-end px-4 pb-10 pt-24 sm:px-8 sm:pb-16 lg:px-14 lg:pb-20">
              {featured ? (
                <div className="max-w-6xl">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
                    <Badge className="rounded-full border-[#c99a4a]/50 bg-[#c99a4a]/15 text-[#f0ca7a]">{featured.category || "Actualité"}</Badge>
                    <span>{new Date(featured.published_at || featured.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                    <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{minutes(loc(featured, "content"))} min</span>
                    <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{featured.views_count || 0}</span>
                  </div>
                  <h1 className="mt-5 max-w-6xl font-serif text-[clamp(2.8rem,7vw,8rem)] font-semibold leading-[.88] tracking-[-.035em] text-balance">{loc(featured, "title")}</h1>
                  <p className="mt-6 max-w-3xl text-sm leading-6 text-white/75 sm:text-lg sm:leading-8">{loc(featured, "excerpt") || strip(loc(featured, "content")).slice(0, 280)}</p>
                  <Link to={"/actualites/" + featured.slug} className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#c99a4a] px-5 py-3 text-sm font-bold text-[#151515] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#e1b96e]">Lire le reportage <ArrowRight className="h-4 w-4" /></Link>
                </div>
              ) : (
                <div><Sparkles className="h-8 w-8 text-[#c99a4a]" /><h1 className="mt-4 font-serif text-5xl sm:text-7xl">Journal</h1><p className="mt-4 text-white/60">Aucune publication pour le moment.</p></div>
              )}
            </div>
            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 text-[10px] uppercase tracking-[.3em] text-white/45"><span className="h-px w-10 bg-white/25" /><span>Inocent KOFFI · Journal</span><span className="h-px w-10 bg-white/25" /></div>
          </section>

          <section className="site-container py-12 sm:py-16 lg:py-20">
            <div className="content-measure">
              <div className="mb-8 flex flex-col gap-5 border-b border-black/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
                <div><p className="text-xs font-bold uppercase tracking-[.25em] text-[#9b7132]">Le journal</p><h2 className="mt-2 font-serif text-3xl sm:text-4xl">Dernières publications</h2></div>
                <div className="flex w-full flex-col gap-3 lg:w-auto lg:min-w-[28rem]">
                  <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" /><Input value={q} onChange={e => setQ(e.target.value)} placeholder={t("news.search")} className="h-11 rounded-full bg-white pl-10" /></div>
                  <div className="flex gap-2 overflow-x-auto pb-1">{categories.map(c => <button key={c} onClick={() => setCat(c)} className={"whitespace-nowrap rounded-full border px-3 py-2 text-xs font-semibold " + (cat === c ? "border-[#9b7132] bg-[#151515] text-white" : "border-black/10 bg-white text-black/55")}>{c}</button>)}</div>
                </div>
              </div>

              {isLoading ? (
                <div className="grid min-h-[30vh] place-items-center text-black/45">Chargement des publications…</div>
              ) : !filtered.length ? (
                <div className="rounded-3xl border border-black/10 bg-white/70 px-6 py-16 text-center text-black/45">Aucune publication pour ces critères.</div>
              ) : (
                <div className="grid auto-rows-[14rem] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {others.map((i, n) => (
                    <Link key={i.id} to={"/actualites/" + i.slug} className={"group relative min-h-0 overflow-hidden rounded-3xl bg-[#171817] shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-2xl " + (n === 0 ? "sm:col-span-2 sm:row-span-2" : n === 1 || n === 2 ? "sm:row-span-2" : "")}>
                      {safeImage(media(parseArray(i.images)[0] || i.featured_image), loc(i, "title"))}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 text-[10px] font-bold uppercase tracking-wider text-white/75">
                        <span className="rounded-full bg-black/45 px-2.5 py-1 backdrop-blur">{i.category || "Actualité"}</span>
                        {parseArray(i.videos).length > 0 && <span className="inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 backdrop-blur"><Play className="h-3 w-3" /> vidéo</span>}
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-white/55"><CalendarDays className="h-3 w-3" />{new Date(i.published_at || i.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}<span>·</span><Clock3 className="h-3 w-3" />{minutes(loc(i, "content"))} min</div>
                        <h3 className={"mt-2 font-serif leading-[.95] transition-colors group-hover:text-[#e2b96d] " + (n === 0 ? "text-3xl sm:text-5xl" : "text-2xl")}>{loc(i, "title")}</h3>
                        <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-6 text-white/70">{loc(i, "excerpt") || strip(loc(i, "content")).slice(0, 180)}</p>
                        <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#e2b96d]">Ouvrir <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
