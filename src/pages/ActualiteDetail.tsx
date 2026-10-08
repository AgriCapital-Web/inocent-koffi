import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import DOMPurify from "dompurify";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Copy, Eye, MessageCircle, Play, CalendarDays, Clock3 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFound from "@/pages/NotFound";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ArticleJsonLD, BreadcrumbJsonLd, SITE_URL } from "@/components/SeoJsonLd";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";

type NewsItem = {
  id: string; slug: string; title_fr: string; excerpt_fr?: string | null; content_fr?: string | null;
  category?: string | null; featured_image?: string | null; images?: unknown; videos?: unknown;
  author?: string | null; published_at?: string | null; created_at: string; updated_at?: string | null;
  views_count?: number | null; shares_count?: number | null; [key: string]: any;
};

const parseArray = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") :
  typeof v === "string" ? (() => { try { const p = JSON.parse(v); return Array.isArray(p) ? p.filter((x): x is string => typeof x === "string") : []; } catch { return []; } })() : [];

const strip = (v = "") => v.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const media = (v?: string | null) => {
  if (!v) return "";
  const value = v.trim();
  if (/^https?:\/\//i.test(value)) return value.replace(/^http:\/\//i, "https://");
  if (value.startsWith("images/")) return "/" + value;
  if (value.startsWith("/inauguration/") || value.startsWith("/formation/")) return "https://www.agricapital.ci" + value;
  return value.startsWith("/") ? value : "/" + value;
};

const image = (src: string | undefined, alt: string, cls: string) => (
  <img src={media(src) || "/placeholder.svg"} alt={alt} className={cls} loading="lazy" decoding="async"
    onError={(e) => { const i = e.currentTarget; if (i.src.endsWith("/placeholder.svg")) return; i.onerror = null; i.src = "/placeholder.svg"; }} />
);

const reading = (v = "") => Math.max(1, Math.ceil(strip(v).split(/\s+/).filter(Boolean).length / 220));

const normalizeContentHtml = (html: string) => {
  if (!html || typeof window === "undefined") return html;
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("img").forEach((img) => {
    const src = img.getAttribute("src");
    if (src) img.setAttribute("src", media(src));
    img.setAttribute("loading", "lazy");
    img.setAttribute("decoding", "async");
  });
  return doc.body.innerHTML;
};

export default function ActualiteDetail() {
  const { slug } = useParams<{ slug: string }>();
  const nav = useNavigate();
  const { language } = useLanguage();
  const [view, setView] = useState(0);
  const [shares, setShares] = useState(0);

  const { data: article, isLoading } = useQuery({
    queryKey: ["news-article", slug],
    enabled: !!slug,
    queryFn: async () => {
      const db = supabase as any;
      const { data, error } = await db.from("news").select("*").eq("slug", slug).eq("is_published", true).maybeSingle();
      if (data) return data as NewsItem;
      if (error) return null;
      const { data: redirect } = await db.from("news_slug_redirects").select("news_id").eq("old_slug", slug).maybeSingle();
      if (!redirect?.news_id) return null;
      const { data: fallback } = await db.from("news").select("*").eq("id", redirect.news_id).eq("is_published", true).maybeSingle();
      return fallback as NewsItem | null;
    },
    staleTime: 0,
  });

  useEffect(() => window.scrollTo(0, 0), [slug]);
  useEffect(() => {
    if (article && slug && article.slug !== slug) nav("/actualites/" + article.slug, { replace: true });
  }, [article, slug, nav]);

  useEffect(() => {
    if (!article) return;
    setView(article.views_count || 0);
    setShares(article.shares_count || 0);
    const key = "news-viewed:" + article.id;
    if (sessionStorage.getItem(key)) return;
    (async () => {
      try {
        sessionStorage.setItem(key, "1");
        const { data } = await (supabase as any).rpc("increment_news_view", { p_news_id: article.id });
        if (typeof data === "number") setView(data);
      } catch { sessionStorage.removeItem(key); }
    })();
  }, [article]);

  const arr = useMemo(() => {
    const a = parseArray(article?.images);
    return (a.length ? a : article?.featured_image ? [article.featured_image] : []).map(media);
  }, [article]);

  const vids = article ? parseArray(article.videos).map(media) : [];
  const loc = (key: "title" | "excerpt" | "content") => ((article as any)?.[key + "_" + language] || (article as any)?.[key + "_fr"] || "").trim();
  const title = loc("title");
  const excerpt = loc("excerpt") || strip(loc("content")).slice(0, 260);
  const content = loc("content");
  const url = SITE_URL + "/actualites/" + (article?.slug || slug);
  const safe = DOMPurify.sanitize(normalizeContentHtml(content), {
    ALLOWED_TAGS: ["p", "h2", "h3", "strong", "em", "br", "hr", "li", "ul", "ol", "a", "blockquote", "table", "thead", "tbody", "tr", "th", "td", "img", "figure", "figcaption"],
    ALLOWED_ATTR: ["class", "href", "src", "alt", "target", "rel", "loading", "width", "height"],
  });

  const share = async (kind: "facebook" | "linkedin" | "whatsapp" | "copy") => {
    try {
      const { data } = await (supabase as any).rpc("increment_news_share", { p_news_id: article?.id });
      if (typeof data === "number") setShares(data);
    } catch {}
    if (kind === "copy") {
      try { await navigator.clipboard.writeText(url); toast.success("Lien copié"); } catch { toast.error("Copie impossible"); }
    } else if (kind === "facebook") {
      window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url), "_blank", "width=600,height=500");
    } else if (kind === "linkedin") {
      window.open("https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(url), "_blank", "width=600,height=500");
    } else {
      window.open("https://wa.me/?text=" + encodeURIComponent(title + "\n\n" + url), "_blank");
    }
  };

  if (isLoading) return <div className="min-h-screen grid place-items-center bg-[#0b0d0c] text-white"><div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#c99a4a]" /></div>;
  if (!article) return <><Navbar /><NotFound /><Footer /></>;

  const published = new Date(article.published_at || article.created_at);
  const mainImage = arr[0];

  return (
    <>
      <Helmet><title>{title} | Actualités — Inocent KOFFI</title><meta name="description" content={excerpt.slice(0, 155)} /><link rel="canonical" href={url} />{mainImage && <meta property="og:image" content={mainImage} />}</Helmet>
      <ArticleJsonLD type="NewsArticle" headline={title} description={excerpt} image={mainImage} datePublished={article.published_at || article.created_at} dateModified={article.updated_at || article.published_at || article.created_at} path={"/actualites/" + article.slug} section={article.category || "Actualité"} />
      <BreadcrumbJsonLd items={[{ name: "Actualités", path: "/actualites" }, { name: title, path: "/actualites/" + article.slug }]} />

      <div className="min-h-screen bg-[#f4f1ea] text-[#151515]">
        <Navbar />
        <main className="pt-20">
          <section className="relative isolate min-h-[78vh] overflow-hidden bg-[#0b0d0c] text-white sm:min-h-[82vh]">
            {mainImage && <div className="absolute inset-0">{image(mainImage, title, "h-full w-full object-cover object-center scale-[1.03]")}</div>}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080908] via-[#080908]/65 to-[#080908]/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080908]/80 via-transparent to-transparent" />
            <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_80%_15%,rgba(201,154,74,.32),transparent_28%)]" />
            <div className="relative mx-auto flex min-h-[78vh] w-full max-w-[120rem] items-end px-4 pb-10 pt-24 sm:min-h-[82vh] sm:px-8 sm:pb-14 lg:px-14 lg:pb-20">
              <div className="max-w-6xl">
                <Link to="/actualites" className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 py-2 text-[11px] font-bold uppercase tracking-[.22em] text-white/70 backdrop-blur-md transition hover:bg-white/10 hover:text-white"><ArrowLeft className="h-3.5 w-3.5" /> Actualités</Link>
                <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
                  <Badge className="rounded-full border-[#c99a4a]/50 bg-[#c99a4a]/15 text-[#f0ca7a]">{article.category || "Actualité"}</Badge>
                  <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{published.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                  <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{reading(content)} min</span>
                  <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{view}</span>
                </div>
                <h1 className="mt-5 max-w-6xl font-serif text-[clamp(2.6rem,7vw,7.5rem)] font-semibold leading-[.9] tracking-[-.035em] text-balance">{title}</h1>
                <p className="mt-6 max-w-3xl text-sm leading-6 text-white/75 sm:text-lg sm:leading-8">{excerpt}</p>
                <p className="mt-5 text-xs uppercase tracking-[.18em] text-white/45">Par {article.author || "Inocent KOFFI"}</p>
              </div>
            </div>
            <div className="absolute bottom-5 right-5 hidden items-center gap-2 text-[10px] uppercase tracking-[.3em] text-white/45 lg:flex"><span className="h-px w-12 bg-white/30" /> Journal · reportage <span className="h-px w-12 bg-white/30" /></div>
          </section>

          <section className="site-container py-12 sm:py-16 lg:py-20">
            <div className="content-measure grid gap-10 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-14">
              <aside className="lg:sticky lg:top-28 lg:self-start">
                <div className="border-y border-black/10 py-4 text-xs text-black/50"><p className="font-semibold uppercase tracking-[.18em] text-black/35">Publication</p><p className="mt-2">{published.toLocaleDateString("fr-FR")}</p><p>{reading(content)} min de lecture</p><p>{shares} partage{shares > 1 ? "s" : ""}</p></div>
                <div className="mt-4 flex flex-wrap gap-2 lg:flex-col">
                  <Button size="sm" variant="outline" onClick={() => void share("facebook")}>Facebook</Button>
                  <Button size="sm" variant="outline" onClick={() => void share("linkedin")}>LinkedIn</Button>
                  <Button size="sm" variant="outline" onClick={() => void share("whatsapp")}><MessageCircle className="mr-1.5 h-3.5 w-3.5" /> WhatsApp</Button>
                  <Button size="sm" variant="outline" onClick={() => void share("copy")}><Copy className="mr-1.5 h-3.5 w-3.5" /> Copier</Button>
                </div>
              </aside>

              <article className="min-w-0">
                {vids.length > 0 && <div className="mb-10 grid gap-5 sm:grid-cols-2">{vids.map((v, i) => <figure key={v + i} className="overflow-hidden rounded-2xl bg-black shadow-xl"><video controls preload="metadata" poster={mainImage} className="aspect-video w-full"><source src={v} /></video><figcaption className="flex items-center gap-2 px-4 py-3 text-xs text-white/55"><Play className="h-3.5 w-3.5" /> Vidéo associée</figcaption></figure>)}</div>}
                <div className="prose prose-lg max-w-none break-words prose-headings:font-serif prose-headings:tracking-tight prose-p:text-black/75 prose-p:leading-8 prose-li:text-black/75 prose-strong:text-[#151515] prose-a:text-[#9b7132] prose-blockquote:border-[#c99a4a] prose-img:rounded-2xl prose-img:shadow-lg" dangerouslySetInnerHTML={{ __html: safe }} />

                {arr.length > 1 && (
                  <section className="mt-14" aria-label="Galerie de l'actualité">
                    <div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.25em] text-[#9b7132]">Sur le terrain</p><h2 className="mt-1 font-serif text-2xl sm:text-3xl">Les différentes étapes</h2></div><span className="text-xs text-black/40">{arr.length} images</span></div>
                    <div className="grid auto-rows-[11rem] grid-cols-2 gap-3 sm:auto-rows-[13rem] sm:grid-cols-4">
                      {arr.map((src, i) => <figure key={src + i} className={(i === 0 ? "col-span-2 row-span-2" : i === 1 ? "col-span-2 row-span-1" : "col-span-1 row-span-1") + " group relative overflow-hidden rounded-2xl bg-[#ded9ce]"}>{image(src, title + " — image " + (i + 1), "h-full w-full object-cover transition duration-700 group-hover:scale-105")}<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-70" /><figcaption className="absolute bottom-3 left-3 right-3 text-xs font-semibold text-white drop-shadow">{String(i + 1).padStart(2, "0")}</figcaption></figure>)}
                    </div>
                  </section>
                )}
              </article>
            </div>
          </section>

          <section className="border-t border-black/10 bg-white py-14 sm:py-16">
            <div className="site-container"><div className="content-measure"><div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-[#9b7132]">Continuer</p><h2 className="mt-2 font-serif text-3xl">À lire ensuite</h2></div><Link to="/actualites" className="text-xs font-bold uppercase tracking-widest">Toutes les publications <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></Link></div><Related currentId={article.id} /></div></div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}

function Related({ currentId }: { currentId: string }) {
  const { data = [], isLoading } = useQuery({
    queryKey: ["news-related", currentId],
    queryFn: async () => {
      const db = supabase as any;
      const { data, error } = await db.from("news_relations").select("relevance,relation_reason,related:news!news_relations_related_news_id_fkey(id,slug,title_fr,excerpt_fr,category,featured_image,images,published_at,is_published)").eq("news_id", currentId).order("relevance", { ascending: false }).limit(3);
      if (error) throw error;
      return (data || []).filter((r: any) => r.related?.is_published !== false).map((r: any) => r.related);
    },
    enabled: !!currentId,
  });
  if (isLoading) return <div className="safe-grid">{[1, 2, 3].map(i => <div key={i} className="aspect-[16/10] animate-pulse rounded-2xl bg-black/5" />)}</div>;
  if (!data.length) return <p className="rounded-2xl border bg-black/[.02] p-6 text-sm text-black/50">Aucun article associé.</p>;
  return <div className="grid gap-4 md:grid-cols-3">{data.map((i: any) => <Link key={i.id} to={"/actualites/" + i.slug} className="group relative min-h-[20rem] overflow-hidden rounded-2xl bg-[#171817]">{image(media(parseArray(i.images)[0] || i.featured_image), i.title_fr, "absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105")}<div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" /><div className="relative flex min-h-[20rem] flex-col justify-end p-5 text-white"><p className="text-[10px] font-bold uppercase tracking-widest text-[#e2b96d]">{i.category || "Actualité"}</p><h3 className="mt-2 font-serif text-2xl leading-tight">{i.title_fr}</h3>{i.relation_reason && <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/65">{i.relation_reason}</p>}</div></Link>)}</div>;
}
