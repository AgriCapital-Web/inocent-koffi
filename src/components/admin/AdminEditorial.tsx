import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { CalendarDays, Eye, FileText, Pencil, Plus, RefreshCw, Save, Sparkles, Trash2 } from "lucide-react";

type News = {
  id: string; slug: string; title_fr: string; content_fr: string; excerpt_fr: string | null;
  category: string | null; featured_image: string | null; images: unknown; videos: unknown;
  is_published: boolean; is_featured: boolean; published_at: string | null; author: string | null;
  views_count?: number | null;
};

type RelatedItem = {
  id: string;
  slug: string;
  title_fr: string;
  excerpt_fr?: string | null;
  category?: string | null;
  relevance?: number | string | null;
  relation_reason?: string | null;
};

const db = supabase as any;
const slugify = (v: string) => v.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const asLines = (v: unknown) => Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").join("\n") : "";
const stripHtml = (v = "") => v.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
const readingTime = (v = "") => Math.max(1, Math.ceil(stripHtml(v).split(/\s+/).filter(Boolean).length / 220));

const CATEGORY_PRESETS = ["Terrain", "Agriculture", "Numérique & IA", "Entrepreneuriat", "Projets", "Décryptage", "Parcours", "AgriCapital"];
const FORMAT_PRESETS = ["Analyse", "Carnet de terrain", "Actualité projet", "Opinion", "Décryptage", "Annonce"];

const emptyForm = {
  title: "", slug: "", category: "Décryptage", format: "Analyse", angle: "", source: "", brief: "",
  excerpt: "", content: "", featured_image: "", images: "", videos: "",
  author: "Inocent KOFFI", is_published: false, is_featured: false,
};

export default function AdminEditorial() {
  const { toast } = useToast();
  const [items, setItems] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<News | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [aiLoading, setAiLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [relatedItems, setRelatedItems] = useState<RelatedItem[]>([]);
  const [generatedTranslations, setGeneratedTranslations] = useState<Record<string, { title: string; excerpt: string; content: string }>>({});
  const [generatedSeo, setGeneratedSeo] = useState({ meta_title: "", meta_description: "", focus_keyword: "", hashtags: [] as string[] });
  const [relatedLoading, setRelatedLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await db.from("news").select("*").order("created_at", { ascending: false });
    if (error) toast({ title: "Impossible de charger les actualités", description: error.message, variant: "destructive" });
    setItems((data || []) as News[]);
    setLoading(false);
  };
  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((x) => !q || [x.title_fr, x.excerpt_fr, x.category].filter(Boolean).join(" ").toLowerCase().includes(q));
  }, [items, search]);

  const reset = () => { setEditing(null); setForm(emptyForm); setRelatedItems([]); setGeneratedTranslations({});
    setGeneratedSeo({ meta_title: "", meta_description: "", focus_keyword: "", hashtags: [] }); };

  const loadRelated = async (source?: Partial<typeof form>, currentId?: string) => {
    const title = source?.title?.trim() || form.title.trim();
    const excerpt = source?.excerpt?.trim() || form.excerpt.trim();
    const content = source?.content?.trim() || form.content.trim();
    const category = source?.category?.trim() || form.category.trim();
    if (!title && !content && !category) { setRelatedItems([]); return; }

    setRelatedLoading(true);
    try {
      const db = supabase as any;

      if (currentId) {
        const { data, error } = await db
          .from("news_relations")
          .select(`
            relevance,
            relation_reason,
            related:news!news_relations_related_news_id_fkey(
              id, slug, title_fr, excerpt_fr, category
            )
          `)
          .eq("news_id", currentId)
          .order("relevance", { ascending: false })
          .limit(4);

        if (error) throw error;

        setRelatedItems(
          (data ?? [])
            .filter((row: any) => row.related)
            .map((row: any) => ({
              ...row.related,
              relevance: row.relevance,
              relation_reason: row.relation_reason,
            })) as RelatedItem[],
        );
      } else {
        const { data, error } = await supabase.rpc("find_related_news", {
          p_news_id: null,
          p_title: title || null,
          p_excerpt: excerpt || null,
          p_content: content || null,
          p_category: category || null,
          p_limit: 4,
        });
        if (error) throw error;
        setRelatedItems(
          ((data ?? []) as RelatedItem[]).filter((item) => Number(item.relevance || 0) >= 0.12),
        );
      }
    } catch (e: any) {
      setRelatedItems([]);
      toast({
        title: "Association automatique indisponible",
        description: e?.message || "Impossible d’analyser les publications existantes.",
        variant: "destructive",
      });
    } finally {
      setRelatedLoading(false);
    }
  };
  const openNew = () => { setEditing(null); setForm(emptyForm); setRelatedItems([]); };
  const openEdit = (n: News) => {
    setEditing(n);
    setForm({
      title: n.title_fr || "", slug: n.slug || "", category: n.category || "Décryptage", format: "Analyse", angle: "",
      source: "", brief: "", excerpt: n.excerpt_fr || "", content: n.content_fr || "", featured_image: n.featured_image || "",
      images: asLines(n.images), videos: asLines(n.videos), author: n.author || "Inocent KOFFI",
      is_published: !!n.is_published, is_featured: !!n.is_featured,
    });
    setRelatedItems([]);
    setGeneratedTranslations({});
    void loadRelated({
      title: n.title_fr || "",
      excerpt: n.excerpt_fr || "",
      content: n.content_fr || "",
      category: n.category || "Décryptage",
    }, n.id);
  };

  const update = (key: keyof typeof emptyForm, value: string | boolean) => setForm((v) => ({ ...v, [key]: value }));

  const generate = async () => {
    const raw = [form.brief, form.source && `Sources / liens à vérifier : ${form.source}`, `Format : ${form.format}`, `Rubrique : ${form.category}`, form.angle && `Angle éditorial : ${form.angle}`].filter(Boolean).join("\n\n");
    if (!raw.trim()) {
      toast({ title: "Matière éditoriale requise", description: "Ajoute quelques faits, notes, liens ou éléments de terrain.", variant: "destructive" });
      return;
    }
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("blog-ai-assistant", {
        body: {
          content: raw,
          action: "generate_full_article",
          generateImage: false,
          generateVideo: false,
          generateGallery: false,
          editorialBrief: {
            publication: "Actualités — Inocent KOFFI",
            identity: "Entrepreneur Agro & Digital, développeur web, praticien IA et créateur de solutions.",
            format: form.format,
            category: form.category,
            angle: form.angle,
            targetLength: "500 à 900 mots selon la matière disponible",
            structure: "titre fort, chapô, introduction, sections avec intertitres, développement, conclusion",
            style: "journalistique, précis, incarné, sobre, africain, sans sensationnalisme ni remplissage",
          },
        },
      });
      if (error) throw error;
      const nextTitle = data?.title || form.title;
      const generated = {
        title: nextTitle,
        slug: form.slug || data?.slug || slugify(nextTitle),
        excerpt: data?.excerpt || form.excerpt,
        content: data?.content || form.content,
        category: form.category,
      };
      setForm((v) => ({ ...v, ...generated }));
      setGeneratedTranslations(data?.translations && typeof data.translations === "object" ? data.translations : {});
      setGeneratedSeo({
        meta_title: data?.meta_title || "",
        meta_description: data?.meta_description || "",
        focus_keyword: data?.focus_keyword || "",
        hashtags: Array.isArray(data?.hashtags) ? data.hashtags.filter((x: unknown): x is string => typeof x === "string") : [],
      });
      await loadRelated(generated);
      toast({ title: "Publication générée", description: "Le contenu a été généré et les articles proches ont été analysés automatiquement." });
    } catch (e: any) {
      toast({ title: "Génération impossible", description: e?.message || "Le service éditorial IA n'a pas répondu.", variant: "destructive" });
    } finally {
      setAiLoading(false);
    }
  };

  const save = async (publishOverride?: boolean) => {
    if (!form.title.trim() || !form.content.trim()) {
      toast({ title: "Titre et article obligatoires", variant: "destructive" });
      return;
    }
    const published = publishOverride ?? form.is_published;
    const payload = {
      slug: slugify(form.slug.trim() || form.title.trim()),
      title_fr: form.title.trim(),
      content_fr: form.content.trim(),
      excerpt_fr: form.excerpt.trim() || null,
      category: form.category.trim() || "Décryptage",
      editorial_format: form.format.trim() || "Analyse",
      editorial_angle: form.angle.trim() || null,
      source_urls: form.source.split(/\s+/).map((x) => x.trim()).filter((x) => /^https?:\/\//i.test(x)),
      ...(generatedSeo.meta_title || generatedSeo.meta_description || generatedSeo.focus_keyword || generatedSeo.hashtags.length
        ? {
            hashtags: generatedSeo.hashtags,
            meta_title: generatedSeo.meta_title || null,
            meta_description: generatedSeo.meta_description || null,
            focus_keyword: generatedSeo.focus_keyword || null,
          }
        : {}),
      ...Object.fromEntries(Object.entries(generatedTranslations).flatMap(([lang, value]) => [
        [`title_${lang}`, value.title],
        [`excerpt_${lang}`, value.excerpt],
        [`content_${lang}`, value.content],
      ])),
      featured_image: form.featured_image.trim() || null,
      images: form.images.split("\n").map((x) => x.trim()).filter(Boolean),
      videos: form.videos.split("\n").map((x) => x.trim()).filter(Boolean),
      is_published: published,
      is_featured: form.is_featured,
      published_at: published ? (editing?.published_at || new Date().toISOString()) : null,
      author: form.author.trim() || "Inocent KOFFI",
    };
    const query = editing ? db.from("news").update(payload).eq("id", editing.id) : db.from("news").insert(payload);
    const { data: savedNews, error } = await query.select("id").single();
    if (error) {
      toast({ title: "Enregistrement impossible", description: error.message, variant: "destructive" });
      return;
    }
    if (savedNews?.id && published) {
      const { error: relationError } = await db.rpc("refresh_news_relations", { p_news_id: savedNews.id });
      if (relationError) {
        console.warn("Relation automatique non recalculée:", relationError);
      }
    }
    toast({ title: published ? "Publication en ligne" : "Brouillon enregistré" });
    reset();
    await load();
  };

  const remove = async (n: News) => {
    if (!window.confirm(`Supprimer « ${n.title_fr} » ?`)) return;
    const { error } = await db.from("news").delete().eq("id", n.id);
    if (error) toast({ title: "Suppression impossible", description: error.message, variant: "destructive" });
    else { toast({ title: "Publication supprimée" }); await load(); }
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl bg-[#151515] p-6 text-white sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c99a4a]">Actualités · Studio éditorial</p>
            <h1 className="mt-3 font-serif text-3xl sm:text-4xl">Créer une publication qui se lit comme une vraie publication.</h1>
            <p className="mt-3 text-sm leading-6 text-white/55">Le générateur produit le titre, le chapô et l'article dans le même format que les publications publiques. Tu gardes la main sur chaque mot avant publication.</p>
          </div>
          <Button onClick={openNew} className="bg-[#c99a4a] text-[#151515] hover:bg-[#d9ad61]"><Plus className="mr-2 h-4 w-4" /> Nouvelle publication</Button>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground">Publications</p><p className="mt-1 text-3xl font-bold">{items.length}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground">En ligne</p><p className="mt-1 text-3xl font-bold">{items.filter((x) => x.is_published).length}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground">Brouillons</p><p className="mt-1 text-3xl font-bold">{items.filter((x) => !x.is_published).length}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs text-muted-foreground">À la une</p><p className="mt-1 text-3xl font-bold">{items.filter((x) => x.is_featured).length}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div><CardTitle>Publications</CardTitle><p className="mt-1 text-sm text-muted-foreground">Cette liste est la même source que le site public.</p></div>
          <div className="flex gap-2"><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher…" className="w-full sm:w-56" /><Button variant="outline" size="icon" onClick={() => void load()}><RefreshCw className="h-4 w-4" /></Button></div>
        </CardHeader>
        <CardContent>
          {loading ? <p className="py-10 text-center text-muted-foreground">Chargement…</p> : (
            <div className="space-y-3">
              {filtered.map((n) => (
                <div key={n.id} className="flex flex-col gap-4 rounded-xl border p-4 md:flex-row md:items-center">
                  <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden bg-muted">
                    {n.featured_image ? <img src={n.featured_image} alt="" className="h-full w-full object-cover" onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }} /> : <FileText className="h-5 w-5 text-muted-foreground" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2"><Badge variant="outline">{n.category || "Décryptage"}</Badge>{n.is_featured && <Badge>À la une</Badge>}{!n.is_published && <Badge variant="secondary">Brouillon</Badge>}</div>
                    <h3 className="mt-1 font-semibold">{n.title_fr}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{n.excerpt_fr || stripHtml(n.content_fr)}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><Eye className="h-3.5 w-3.5" /> {n.views_count || 0}</div>
                  <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => openEdit(n)}><Pencil className="mr-1 h-4 w-4" /> Modifier</Button><Button size="sm" variant="ghost" className="text-destructive" onClick={() => void remove(n)}><Trash2 className="h-4 w-4" /></Button></div>
                </div>
              ))}
              {!filtered.length && <p className="py-10 text-center text-sm text-muted-foreground">Aucune publication.</p>}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-[#c99a4a]/30">
        <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-[#9b7132]" /> Générateur éditorial</CardTitle><p className="text-sm text-muted-foreground">Même source de données, même structure éditoriale et même destination canonique : <strong>/actualites</strong>.</p></CardHeader>
        <CardContent className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="space-y-5 rounded-xl bg-muted/40 p-4 sm:p-5">
            <div><Label>Matière brute / faits</Label><Textarea className="mt-2 min-h-40" value={form.brief} onChange={(e) => update("brief", e.target.value)} placeholder="Que s'est-il passé ? Qui ? Où ? Pourquoi est-ce important ? Ajoute tes notes de terrain." /></div>
            <div><Label>Sources ou liens</Label><Textarea className="mt-2 min-h-20" value={form.source} onChange={(e) => update("source", e.target.value)} placeholder="Liens, documents, références ou éléments à vérifier." /></div>
            <div><Label>Angle souhaité</Label><Input className="mt-2" value={form.angle} onChange={(e) => update("angle", e.target.value)} placeholder="Ex. Ce que cette évolution change pour les producteurs" /></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><Label>Rubrique</Label><select value={form.category} onChange={(e) => update("category", e.target.value)} className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm">{CATEGORY_PRESETS.map((x) => <option key={x}>{x}</option>)}</select></div>
              <div><Label>Format</Label><select value={form.format} onChange={(e) => update("format", e.target.value)} className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm">{FORMAT_PRESETS.map((x) => <option key={x}>{x}</option>)}</select></div>
            </div>
            <Button onClick={() => void generate()} disabled={aiLoading} className="w-full bg-[#151515] text-white hover:bg-black">{aiLoading ? <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Génération en cours…</> : <><Sparkles className="mr-2 h-4 w-4" /> Générer l’article</>}</Button>
            <p className="text-xs leading-5 text-muted-foreground">L'IA ne doit pas inventer les faits fournis. Les éléments non vérifiés doivent rester présentés comme tels ou être retirés à la relecture.</p>
          </div>

          <div className="space-y-5">
            <div><Label>Titre</Label><Input className="mt-2 text-lg font-semibold" value={form.title} onChange={(e) => update("title", e.target.value)} onBlur={() => !form.slug && update("slug", slugify(form.title))} placeholder="Titre éditorial" /></div>
            <div><Label>Slug / URL canonique</Label><Input className="mt-2" value={form.slug} onChange={(e) => update("slug", e.target.value)} placeholder="titre-de-la-publication" /></div>
            <div><Label>Chapô / résumé</Label><Textarea className="mt-2 min-h-24" value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} placeholder="Le paragraphe qui donne envie de lire." /></div>
            <div><Label>Article</Label><Textarea className="mt-2 min-h-[360px] font-mono text-sm" value={form.content} onChange={(e) => update("content", e.target.value)} placeholder="Le contenu complet généré ou rédigé. HTML simple accepté." /></div>
            <div className="flex items-center justify-between rounded-xl border p-4">
              <div><p className="text-sm font-semibold">Lecture estimée</p><p className="text-xs text-muted-foreground">{readingTime(form.content)} minute{readingTime(form.content) > 1 ? "s" : ""}</p></div>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="rounded-xl border border-[#c99a4a]/25 bg-[#c99a4a]/[0.04] p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold"><Sparkles className="h-4 w-4 text-[#9b7132]" /> Articles associés automatiquement</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">Le système analyse les publications déjà présentes en base selon la rubrique, le titre, le contenu et leur proximité éditoriale. Après enregistrement, les associations sont conservées automatiquement en base et réutilisées sur les pages publiques.</p>
                </div>
                <Button size="sm" variant="outline" disabled={relatedLoading || (!form.title.trim() && !form.content.trim())} onClick={() => void loadRelated()}>
                  <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${relatedLoading ? "animate-spin" : ""}`} /> Actualiser
                </Button>
              </div>
              <div className="mt-4">
                {relatedLoading ? <p className="text-xs text-muted-foreground">Analyse des publications existantes…</p> : relatedItems.length ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {relatedItems.map((item) => (
                      <a key={item.id} href={"/actualites/" + item.slug} target="_blank" rel="noreferrer" className="rounded-lg border bg-background p-3 transition hover:border-[#c99a4a]/50">
                        <div className="flex items-center justify-between gap-2">
                          <Badge variant="outline">{item.category || "Actualité"}</Badge>
                          <span className="text-[10px] text-muted-foreground">{item.relation_reason || "Proximité éditoriale"}</span>
                        </div>
                        <p className="mt-2 text-sm font-medium leading-5">{item.title_fr}</p>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Aucune publication suffisamment proche pour être proposée.</p>
                )}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label>Image principale</Label><Input className="mt-2" value={form.featured_image} onChange={(e) => update("featured_image", e.target.value)} placeholder="URL publique de l'image" /></div>
              <div><Label>Auteur</Label><Input className="mt-2" value={form.author} onChange={(e) => update("author", e.target.value)} /></div>
            </div>
            <div><Label>Galerie — une URL par ligne</Label><Textarea className="mt-2" rows={3} value={form.images} onChange={(e) => update("images", e.target.value)} /></div>
            <div><Label>Vidéos — une URL par ligne</Label><Textarea className="mt-2" rows={3} value={form.videos} onChange={(e) => update("videos", e.target.value)} /></div>
            <div className="flex flex-wrap items-center gap-5 rounded-xl border p-4">
              <label className="flex items-center gap-2 text-sm"><Switch checked={form.is_featured} onCheckedChange={(v) => update("is_featured", v)} /> À la une</label>
              <label className="flex items-center gap-2 text-sm"><Switch checked={form.is_published} onCheckedChange={(v) => update("is_published", v)} /> Publié</label>
            </div>
            <div className="flex flex-wrap justify-end gap-2 border-t pt-5">
              <Button variant="outline" onClick={reset}>Effacer</Button>
              <Button variant="secondary" onClick={() => void save(false)}><Save className="mr-2 h-4 w-4" /> Enregistrer brouillon</Button>
              <Button onClick={() => void save(true)} className="bg-[#151515] text-white hover:bg-black"><CalendarDays className="mr-2 h-4 w-4" /> Publier</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
