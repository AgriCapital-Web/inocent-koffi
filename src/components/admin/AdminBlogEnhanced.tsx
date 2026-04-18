import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import RichTextEditor from "@/components/RichTextEditor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  Plus, Edit, Trash2, Eye, EyeOff, Save, X, 
  Upload, Calendar, FileText, Search, Sparkles, 
  Wand2, Hash, Loader2, Image as ImageIcon, ImageOff, CheckCircle2, Video
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  category_id: string | null;
  tagline: string | null;
  hashtags: string[] | null;
  author: string | null;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  color: string;
}

const AUTO_SAVE_KEY = "blog_editor_autosave";

// ─── Generate Popup ───────────────────────────────────────────────────────────
const GeneratePopup = ({
  open,
  onClose,
  onGenerate,
  isLoading,
}: {
  open: boolean;
  onClose: () => void;
  onGenerate: (option: string) => void;
  isLoading: boolean;
}) => {
  const options = [
    {
      id: "with_image",
      icon: <ImageIcon className="w-6 h-6 text-primary" />,
      title: "Avec image générée par IA",
      desc: "L'IA génère une image unique, ultra-réaliste, cohérente avec le sujet traité.",
      tags: ["Réaliste", "Professionnelle", "Sans watermark"],
      highlight: true,
    },
    {
      id: "with_video",
      icon: <Video className="w-6 h-6 text-indigo-500" />,
      title: "Avec vidéo IA",
      desc: "L'IA génère une vidéo courte, sobre et professionnelle, adaptée au contexte éditorial.",
      tags: ["Vidéo courte", "Sobre", "Professionnel"],
    },
    {
      id: "with_video_image",
      icon: <><ImageIcon className="w-5 h-5 text-primary" /><Video className="w-5 h-5 text-indigo-500" /></>,
      title: "Avec vidéo et image",
      desc: "Combinaison d'une image principale et d'une vidéo complémentaire.",
      tags: ["Image + Vidéo", "Complet"],
    },
    {
      id: "with_gallery",
      icon: <ImageIcon className="w-6 h-6 text-emerald-500" />,
      title: "Avec plusieurs images",
      desc: "L'IA génère une galerie d'images thématiques cohérentes, adaptées au sujet.",
      tags: ["Galerie", "Multiple", "Thématique"],
    },
    {
      id: "no_media",
      icon: <ImageOff className="w-6 h-6 text-muted-foreground" />,
      title: "Sans image",
      desc: "Génération textuelle pure. Vous pourrez ajouter des médias manuellement.",
      tags: [],
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-6 h-6 text-primary" />
            Générer avec l'IA
          </DialogTitle>
          <DialogDescription>
            L'IA va analyser votre texte et remplir automatiquement tous les champs : titre, accroche, catégorie, hashtags, contenu structuré, médias...
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          <p className="text-sm font-medium text-foreground">Choisissez le type de génération :</p>

          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onGenerate(opt.id)}
              disabled={isLoading}
              className={`group relative flex items-start gap-4 p-4 border-2 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left w-full disabled:opacity-50 ${opt.highlight ? 'border-primary/30 bg-primary/5' : 'border-border'}`}
            >
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center gap-1 group-hover:scale-105 transition-transform">
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-primary" /> : opt.icon}
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{opt.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                {opt.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {opt.tags.map(tag => (
                      <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </button>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
              <Loader2 className="w-5 h-5 animate-spin text-primary flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-primary">Génération en cours...</p>
                <p className="text-xs text-muted-foreground">L'IA analyse, structure et génère votre contenu. 15–45 secondes.</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ─── Media Item Component ─────────────────────────────────────────────────────
const MediaItem = ({
  url,
  name,
  type,
  onRemove,
  onSetFeatured,
  isFeatured,
}: {
  url: string;
  name: string;
  type: string;
  onRemove: () => void;
  onSetFeatured: () => void;
  isFeatured: boolean;
}) => {
  const isVideo = type.startsWith("video/");
  return (
    <div className={`relative rounded-lg overflow-hidden border-2 transition-all ${isFeatured ? "border-primary shadow-md" : "border-border"}`}>
      {isVideo ? (
        <video src={url} className="w-full h-32 object-cover" controls={false} muted />
      ) : (
        <img src={url} alt={name} className="w-full h-32 object-cover" loading="lazy" />
      )}
      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
        <button
          onClick={onSetFeatured}
          className="flex items-center gap-1 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full"
        >
          <CheckCircle2 className="w-3 h-3" />
          {isFeatured ? "Image principale" : "Définir principale"}
        </button>
        <button onClick={onRemove} className="flex items-center gap-1 text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded-full">
          <X className="w-3 h-3" />
          Supprimer
        </button>
      </div>
      {isFeatured && (
        <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Principale
        </div>
      )}
      {isVideo && (
        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
          <Video className="w-3 h-3" /> Vidéo
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminBlogEnhanced = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploading, setUploading] = useState(false);
  const [generatePopupOpen, setGeneratePopupOpen] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [structureLoading, setStructureLoading] = useState(false);

  // Media gallery state
  const [mediaFiles, setMediaFiles] = useState<Array<{ url: string; name: string; type: string }>>([]);
  
  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tagline, setTagline] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [author, setAuthor] = useState("Inocent KOFFI");

  const { data: categories } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('blog_categories').select('*').order('name');
      if (error) throw error;
      return data as BlogCategory[];
    }
  });

  const { data: posts, isLoading } = useQuery({
    queryKey: ['admin-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    }
  });

  // Auto-save
  useEffect(() => {
    if (!showEditor) return;
    const data = { title, slug, content, excerpt, featuredImage, categoryId, tagline, hashtags, author, mediaFiles, savedAt: new Date().toISOString() };
    localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(data));
  }, [title, slug, content, excerpt, featuredImage, categoryId, tagline, hashtags, author, mediaFiles, showEditor]);

  useEffect(() => {
    if (!showEditor || editingPost) return;
    const saved = localStorage.getItem(AUTO_SAVE_KEY);
    if (!saved) return;
    try {
      const data = JSON.parse(saved);
      const hoursDiff = (Date.now() - new Date(data.savedAt).getTime()) / 3600000;
      if (hoursDiff < 24 && data.content) {
        setTitle(data.title || ""); setSlug(data.slug || ""); setContent(data.content || "");
        setExcerpt(data.excerpt || ""); setFeaturedImage(data.featuredImage || "");
        setCategoryId(data.categoryId || ""); setTagline(data.tagline || "");
        setHashtags(data.hashtags || []); setAuthor(data.author || "Inocent KOFFI");
        setMediaFiles(data.mediaFiles || []);
        toast({ title: "Brouillon restauré", description: "Votre travail précédent a été récupéré." });
      }
    } catch {}
  }, [showEditor, editingPost]);

  const saveMutation = useMutation({
    mutationFn: async (postData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Vous devez être connecté pour enregistrer un article");

      let postId: string;
      if (editingPost) {
        const { error } = await supabase.from('blog_posts').update(postData).eq('id', editingPost.id);
        if (error) throw error;
        postId = editingPost.id;
      } else {
        const { data, error } = await supabase.from('blog_posts').insert([{ ...postData, author_id: user.id }]).select('id').single();
        if (error) throw error;
        postId = data.id;
      }

      // Sync gallery to blog_media (images other than the cover) — used for carousel display
      const galleryImages = mediaFiles.filter(m => m.type.startsWith("image/") && m.url !== postData.featured_image);
      if (postId) {
        await supabase.from('blog_media').delete().eq('post_id', postId);
        if (galleryImages.length > 0) {
          await supabase.from('blog_media').insert(
            galleryImages.map((m, i) => ({
              post_id: postId,
              file_url: m.url,
              file_name: m.name,
              file_type: m.type,
              sort_order: i,
            }))
          );
        }
      }
    },
    onSuccess: () => {
      toast({ title: editingPost ? "Article mis à jour ✓" : "Article créé ✓" });
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      localStorage.removeItem(AUTO_SAVE_KEY);
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  });

  const publishMutation = useMutation({
    mutationFn: async ({ id, publish }: { id: string; publish: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Vous devez être connecté");
      // Use RPC or direct update - ensure author_id is set
      const { error: updateAuthorError } = await supabase.from('blog_posts').update({ author_id: user.id }).eq('id', id).is('author_id', null);
      // Ignore error if author_id already set
      const { error } = await supabase.from('blog_posts').update({ is_published: publish, published_at: publish ? new Date().toISOString() : null }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_, { publish }) => {
      toast({ title: publish ? "Article publié" : "Article dépublié" });
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Article supprimé" });
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      setDeleteDialogOpen(false);
    }
  });

  const generateSlug = (text: string) =>
    text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

  const findCategoryByName = (name: string) => {
    if (!name || !categories) return null;
    const lower = name.toLowerCase();
    return categories.find(c => c.name.toLowerCase().includes(lower) || lower.includes(c.name.toLowerCase()));
  };

  const removeAutoGalleryBlock = (html: string) =>
    (html || '').replace(/<section\s+data-media-gallery="auto-generated"[\s\S]*?<\/section>/gi, '').trim();

  const buildAutoGalleryBlock = (imageUrls: string[]) => {
    if (!imageUrls.length) return '';
    const items = imageUrls
      .map((imageUrl, index) => `
        <figure style="margin:0;">
          <img src="${imageUrl}" alt="Illustration ${index + 1}" style="width:100%;height:auto;border-radius:12px;object-fit:cover;" loading="lazy" />
        </figure>
      `)
      .join('');

    return `
      <section data-media-gallery="auto-generated" style="margin:2em 0;padding:1.2em;border:1px solid hsl(var(--border));border-radius:14px;">
        <h3 style="margin:0 0 1em;font-size:1.1em;font-weight:700;">Galerie illustrée</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;">${items}</div>
      </section>
    `;
  };

  const mergeContentWithGallery = (baseHtml: string, imageUrls: string[]) => {
    const cleanedHtml = removeAutoGalleryBlock(baseHtml);
    const uniqueUrls = Array.from(new Set(imageUrls.filter(Boolean)));
    if (!uniqueUrls.length) return cleanedHtml;
    return `${cleanedHtml}\n\n${buildAutoGalleryBlock(uniqueUrls)}`;
  };

  // ── AI: Generate meta ──────────────────────────────────────────────────────
  const handleGenerateMeta = async () => {
    if (!content.trim()) {
      toast({ title: "Contenu requis", description: "Rédigez ou collez votre texte d'abord", variant: "destructive" });
      return;
    }
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('blog-ai-assistant', {
        body: { content, action: 'generate_meta', categories: categories?.map(c => ({ id: c.id, name: c.name })) }
      });
      if (error) throw error;
      if (data.title) setTitle(data.title);
      if (data.tagline) setTagline(data.tagline);
      if (data.hashtags) setHashtags(data.hashtags);
      if (data.excerpt) setExcerpt(data.excerpt);
      if (!slug && data.title) setSlug(generateSlug(data.title));
      if (data.suggested_category && !categoryId) {
        const match = findCategoryByName(data.suggested_category);
        if (match) setCategoryId(match.id);
      }
      toast({ title: "Métadonnées générées ✓" });
    } catch (e: any) {
      toast({ title: "Erreur IA", description: e.message, variant: "destructive" });
    } finally {
      setAiLoading(false);
    }
  };

  // ── AI: Structure article ─────────────────────────────────────────────────
  const handleStructureArticle = async () => {
    if (!content.trim()) {
      toast({ title: "Contenu requis", variant: "destructive" });
      return;
    }
    setStructureLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('blog-ai-assistant', {
        body: { content, action: 'structure_article' }
      });
      if (error) throw error;
      if (data.content) { setContent(data.content); toast({ title: "Article structuré ✓" }); }
    } catch (e: any) {
      toast({ title: "Erreur IA", description: e.message, variant: "destructive" });
    } finally {
      setStructureLoading(false);
    }
  };

  // ── AI: Generate full article (5 options) ──────────────────────────────────
  const handleGenerateFullArticle = async (option: string) => {
    if (!content.trim()) {
      toast({ title: "Texte requis", description: "Entrez au moins un mot dans le contenu", variant: "destructive" });
      return;
    }
    setGenerateLoading(true);
    try {
      const generateImage = option === "with_image" || option === "with_video_image" || option === "with_gallery";
      const generateVideo = option === "with_video" || option === "with_video_image";
      const generateGallery = option === "with_gallery";

      const { data, error } = await supabase.functions.invoke('blog-ai-assistant', {
        body: { 
          content: content.trim(),
          action: 'generate_full_article',
          generateImage,
          generateVideo,
          generateGallery,
          categories: categories?.map(c => ({ id: c.id, name: c.name }))
        }
      });
      if (error) throw error;
      
      if (data.title) setTitle(data.title);
      if (data.tagline) setTagline(data.tagline);
      if (data.excerpt) setExcerpt(data.excerpt);
      if (data.hashtags) setHashtags(data.hashtags);
      if (!slug && data.title) setSlug(generateSlug(data.title));
      if (data.suggested_category) {
        const match = findCategoryByName(data.suggested_category);
        if (match) setCategoryId(match.id);
      }

      const galleryUrls: string[] = Array.isArray(data.galleryUrls) ? data.galleryUrls.filter(Boolean) : [];
      const coverImage = data.imageUrl || galleryUrls[0] || "";

      // Clean content — no inline images. Cover stays at top, gallery is a carousel below.
      if (data.content) {
        setContent(removeAutoGalleryBlock(data.content));
      }

      // Handle generated media
      const newMedia: Array<{ url: string; name: string; type: string }> = [];
      if (coverImage) {
        setFeaturedImage(coverImage);
        newMedia.push({ url: coverImage, name: "ia-generated-cover.png", type: "image/png" });
      }

      galleryUrls.forEach((url: string, i: number) => {
        if (url !== coverImage) {
          newMedia.push({ url, name: `ia-gallery-${i + 1}.png`, type: "image/png" });
        }
      });

      if (newMedia.length > 0) {
        setMediaFiles(prev => {
          const existing = new Set(prev.map(m => m.url));
          const uniqueNew = newMedia.filter(m => !existing.has(m.url));
          return [...uniqueNew, ...prev];
        });
      }

      const parts = [];
      if (generateImage || generateGallery) parts.push("image(s)");
      if (generateVideo) parts.push("vidéo");
      parts.push("article");
      
      toast({ 
        title: `${parts.join(' + ')} généré(s) ✓`, 
        description: "L'IA a rempli tous les champs automatiquement" 
      });
      setGeneratePopupOpen(false);
    } catch (e: any) {
      toast({ title: "Erreur IA", description: e.message, variant: "destructive" });
    } finally {
      setGenerateLoading(false);
    }
  };

  // ── Media upload ──────────────────────────────────────────────────────────
  const handleMediaUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    const uploaded: Array<{ url: string; name: string; type: string }> = [];

    for (const file of Array.from(files)) {
      const isVideo = file.type.startsWith("video/");
      const maxSize = isVideo ? 500 * 1024 * 1024 : 20 * 1024 * 1024;
      if (file.size > maxSize) {
        toast({ title: "Fichier trop volumineux", description: `${file.name}: max ${isVideo ? "500 Mo" : "20 Mo"}`, variant: "destructive" });
        continue;
      }
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const filePath = `posts/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('blog-media').upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('blog-media').getPublicUrl(filePath);
        uploaded.push({ url: data.publicUrl, name: file.name, type: file.type });
      } catch (e: any) {
        toast({ title: "Erreur upload", description: e.message, variant: "destructive" });
      }
    }

    if (uploaded.length > 0) {
      setMediaFiles(prev => [...prev, ...uploaded]);
      if (!featuredImage && uploaded[0].type.startsWith("image/")) {
        setFeaturedImage(uploaded[0].url);
      }
      toast({ title: `${uploaded.length} fichier(s) téléchargé(s)` });
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveMedia = (url: string) => {
    setMediaFiles(prev => prev.filter(m => m.url !== url));
    if (featuredImage === url) {
      const remaining = mediaFiles.filter(m => m.url !== url && m.type.startsWith("image/"));
      setFeaturedImage(remaining.length > 0 ? remaining[0].url : "");
    }
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      toast({ title: "Titre et contenu requis", variant: "destructive" }); return;
    }
    if (!categoryId) {
      toast({ title: "Catégorie obligatoire", variant: "destructive" }); return;
    }

    // Clean content — gallery rendered separately as carousel via blog_media table
    const publishReadyContent = removeAutoGalleryBlock(content);

    saveMutation.mutate({
      title: title.trim(),
      slug: slug.trim() || generateSlug(title),
      content: publishReadyContent,
      excerpt: excerpt.trim() || null,
      featured_image: featuredImage || null,
      category_id: categoryId || null,
      tagline: tagline.trim() || null,
      hashtags: hashtags.length > 0 ? hashtags : null,
      author: author.trim() || "Inocent KOFFI",
    });
  };

  const openEditor = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setTitle(post.title); setSlug(post.slug); setContent(post.content);
      setExcerpt(post.excerpt || ""); setFeaturedImage(post.featured_image || "");
      setCategoryId(post.category_id || ""); setTagline(post.tagline || "");
      setHashtags(post.hashtags || []); setAuthor(post.author || "Inocent KOFFI");
      if (post.featured_image) setMediaFiles([{ url: post.featured_image, name: "image.jpg", type: "image/jpeg" }]);
    }
    setShowEditor(true);
  };

  const resetForm = () => {
    setShowEditor(false); setEditingPost(null); setTitle(""); setSlug(""); setContent("");
    setExcerpt(""); setFeaturedImage(""); setCategoryId(""); setTagline("");
    setHashtags([]); setAuthor("Inocent KOFFI"); setMediaFiles([]);
  };

  const filteredPosts = posts?.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

  const getCategoryById = (id: string | null) => categories?.find(c => c.id === id);

  // ── EDITOR VIEW ───────────────────────────────────────────────────────────
  if (showEditor) {
    return (
      <>
        <GeneratePopup
          open={generatePopupOpen}
          onClose={() => { if (!generateLoading) setGeneratePopupOpen(false); }}
          onGenerate={handleGenerateFullArticle}
          isLoading={generateLoading}
        />

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {editingPost ? "Modifier l'article" : "Nouvel article"}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Sauvegarde auto</Badge>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* ── AI SECTION ── */}
            <div className="p-5 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 rounded-xl border-2 border-dashed border-primary/30">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">🧠 Assistant IA Éditorial</h3>
                <Badge variant="outline" className="text-xs ml-auto">Moteur éditorial intelligent</Badge>
              </div>

              <div className="bg-background/80 rounded-lg p-3 mb-4 border border-primary/10">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">💡 Mode d'emploi :</strong> Écrivez librement votre idée — même un seul mot (ex: "finance rurale", "chaîne logistique", "énergie", "gouvernance locale"). L'IA produit une analyse structurée, crédible, et orientée réflexions/signaux de terrain.
                </p>
              </div>

              {/* MAIN GENERATE BUTTON */}
              <Button
                onClick={() => setGeneratePopupOpen(true)}
                disabled={!content.trim() || generateLoading}
                size="lg"
                className="w-full gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 shadow-lg font-bold text-base mb-4"
              >
                <Sparkles className="w-5 h-5" />
                ✨ Générer l'article complet
              </Button>

              <div className="flex flex-wrap gap-2 pt-3 border-t border-primary/20">
                <Button variant="outline" onClick={handleGenerateMeta} disabled={aiLoading || !content.trim()} size="sm" className="gap-2">
                  {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Hash className="w-4 h-4" />}
                  Générer titre & métadonnées
                </Button>
                <Button variant="outline" onClick={handleStructureArticle} disabled={structureLoading || !content.trim()} size="sm" className="gap-2">
                  {structureLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                  Structurer le texte
                </Button>
              </div>
            </div>

            {/* ── CONTENT (first so user writes here) ── */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">
                ✍️ Contenu <span className="text-destructive">*</span>
              </Label>
              <p className="text-xs text-muted-foreground">
                Écrivez librement — même un seul mot. L'IA s'occupe du reste lors de la génération.
              </p>
              <div className="border rounded-lg shadow-sm">
                <RichTextEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Écrivez ici... Ex: stratégie PME, finance climat, agriculture, numérique, éducation, leadership territorial... L'IA structurera et enrichira automatiquement."
                />
              </div>
            </div>

            {/* ── CATEGORY ── */}
            <div className="space-y-2">
              <Label>Catégorie <span className="text-destructive">*</span></Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                        {cat.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* ── TITLE & TAGLINE ── */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Titre <span className="text-destructive">*</span></Label>
                <Input value={title} onChange={(e) => { setTitle(e.target.value); if (!editingPost && !slug) setSlug(generateSlug(e.target.value)); }} placeholder="Titre (généré par l'IA)" className="font-semibold" />
              </div>
              <div className="space-y-2">
                <Label>Phrase d'accroche <span className="text-xs text-muted-foreground">(italique)</span></Label>
                <Input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Phrase d'accroche impactante..." className="italic" />
              </div>
            </div>

            {/* ── SLUG & AUTHOR ── */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Slug URL</Label>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="url-de-larticle" />
              </div>
              <div className="space-y-2">
                <Label>Auteur</Label>
                <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Inocent KOFFI" />
              </div>
            </div>

            {/* ── HASHTAGS ── */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Hash className="w-4 h-4" />Hashtags</Label>
              <Input
                value={hashtags.join(", ")}
                onChange={(e) => setHashtags(e.target.value.split(",").map(h => h.trim()).filter(Boolean))}
                placeholder="Agriculture, Leadership, Afrique..."
              />
              {hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {hashtags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">#{tag.replace('#', '')}</Badge>
                  ))}
                </div>
              )}
            </div>

            {/* ── EXCERPT ── */}
            <div className="space-y-2">
              <Label>Résumé / Extrait</Label>
              <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Résumé court affiché dans les listes d'articles..." rows={2} />
            </div>

            {/* ── MEDIA GALLERY ── */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">🖼️ Médias (images & vidéos)</Label>
              <p className="text-xs text-muted-foreground">Upload multiple autorisé • Images: 20 Mo max • Vidéos: 500 Mo max</p>

              <div className="flex items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleMediaUpload}
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="gap-2 flex-1"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? "Téléchargement..." : "Ajouter images & vidéos"}
                </Button>
              </div>

              {mediaFiles.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {mediaFiles.map((media, i) => (
                    <MediaItem
                      key={`${media.url}-${i}`}
                      url={media.url}
                      name={media.name}
                      type={media.type}
                      isFeatured={media.url === featuredImage}
                      onSetFeatured={() => media.type.startsWith("image/") && setFeaturedImage(media.url)}
                      onRemove={() => handleRemoveMedia(media.url)}
                    />
                  ))}
                </div>
              )}

              {featuredImage && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-primary" />
                  Image principale sélectionnée
                </p>
              )}
            </div>

            {/* ── ACTIONS ── */}
            <div className="flex flex-wrap justify-end gap-4 pt-4 border-t">
              <Button variant="outline" onClick={resetForm}>Annuler</Button>
              <Button onClick={handleSave} disabled={saveMutation.isPending} className="gap-2 min-w-[160px]">
                {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saveMutation.isPending ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  // ── LIST VIEW ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un article..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => openEditor()} className="gap-2">
          <Plus className="w-4 h-4" />
          Nouvel article
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Articles ({filteredPosts?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Chargement...</div>
          ) : filteredPosts && filteredPosts.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Article</TableHead>
                    <TableHead className="hidden md:table-cell">Catégorie</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => {
                    const category = getCategoryById(post.category_id);
                    return (
                      <TableRow key={post.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {post.featured_image ? (
                              <img
                                src={post.featured_image}
                                alt={post.title}
                                className="w-12 h-12 rounded object-cover hidden sm:block flex-shrink-0"
                                loading="lazy"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                            ) : (
                              <div className="w-12 h-12 rounded bg-gradient-to-br from-primary/20 to-accent/20 hidden sm:flex items-center justify-center flex-shrink-0">
                                <FileText className="w-5 h-5 text-primary/50" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-medium truncate max-w-[200px]">{post.title}</p>
                              <p className="text-xs text-muted-foreground truncate">/{post.slug}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {category && (
                            <Badge variant="outline" style={{ borderColor: category.color, color: category.color }}>
                              {category.name}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {post.is_published
                            ? <Badge variant="default" className="bg-primary">Publié</Badge>
                            : <Badge variant="secondary">Brouillon</Badge>
                          }
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {formatDate(post.published_at || post.created_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1 sm:gap-2">
                            <Button variant="ghost" size="icon" onClick={() => publishMutation.mutate({ id: post.id, publish: !post.is_published })} title={post.is_published ? "Dépublier" : "Publier"}>
                              {post.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openEditor(post)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { setPostToDelete(post.id); setDeleteDialogOpen(true); }}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucun article pour le moment</p>
              <Button className="mt-4 gap-2" onClick={() => openEditor()}>
                <Plus className="w-4 h-4" />Créer le premier article
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l'article ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => postToDelete && deleteMutation.mutate(postToDelete)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminBlogEnhanced;
