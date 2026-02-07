import { useState, useRef, useEffect } from "react";
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
  Plus, Edit, Trash2, Eye, EyeOff, Save, X, 
  Upload, Calendar, FileText, Search, Sparkles, 
  Wand2, Hash, Loader2, FolderOpen
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
  const [aiLoading, setAiLoading] = useState(false);
  const [structureLoading, setStructureLoading] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [topicInput, setTopicInput] = useState("");
  
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

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as BlogCategory[];
    }
  });

  // Fetch posts
  const { data: posts, isLoading } = useQuery({
    queryKey: ['admin-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    }
  });

  // Auto-save effect
  useEffect(() => {
    if (showEditor) {
      const autoSaveData = {
        title, slug, content, excerpt, featuredImage, 
        categoryId, tagline, hashtags, author,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(autoSaveData));
    }
  }, [title, slug, content, excerpt, featuredImage, categoryId, tagline, hashtags, author, showEditor]);

  // Restore auto-save on mount
  useEffect(() => {
    if (showEditor && !editingPost) {
      const saved = localStorage.getItem(AUTO_SAVE_KEY);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          const savedTime = new Date(data.savedAt);
          const now = new Date();
          const hoursDiff = (now.getTime() - savedTime.getTime()) / (1000 * 60 * 60);
          
          if (hoursDiff < 24 && data.content) {
            setTitle(data.title || "");
            setSlug(data.slug || "");
            setContent(data.content || "");
            setExcerpt(data.excerpt || "");
            setFeaturedImage(data.featuredImage || "");
            setCategoryId(data.categoryId || "");
            setTagline(data.tagline || "");
            setHashtags(data.hashtags || []);
            setAuthor(data.author || "Inocent KOFFI");
            toast({ title: "Brouillon restauré", description: "Votre travail précédent a été récupéré." });
          }
        } catch (e) {
          console.error("Error restoring auto-save:", e);
        }
      }
    }
  }, [showEditor, editingPost]);

  const saveMutation = useMutation({
    mutationFn: async (postData: any) => {
      if (editingPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editingPost.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ title: editingPost ? "Article mis à jour" : "Article créé" });
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
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          is_published: publish, 
          published_at: publish ? new Date().toISOString() : null 
        })
        .eq('id', id);
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

  const findCategoryByName = (name: string) => {
    if (!name || !categories) return null;
    const lower = name.toLowerCase();
    return categories.find(c => c.name.toLowerCase().includes(lower) || lower.includes(c.name.toLowerCase()));
  };

  // AI: Generate title, tagline, hashtags
  const handleGenerateMeta = async () => {
    if (!content.trim()) {
      toast({ title: "Erreur", description: "Rédigez d'abord le contenu de l'article", variant: "destructive" });
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
      
      // Auto-select category
      if (data.suggested_category && !categoryId) {
        const match = findCategoryByName(data.suggested_category);
        if (match) setCategoryId(match.id);
      }
      
      toast({ title: "Métadonnées générées", description: "Titre, accroche, catégorie et hashtags créés par l'IA" });
    } catch (error: any) {
      toast({ title: "Erreur IA", description: error.message, variant: "destructive" });
    } finally {
      setAiLoading(false);
    }
  };

  // AI: Structure article professionally
  const handleStructureArticle = async () => {
    if (!content.trim()) {
      toast({ title: "Erreur", description: "Rédigez d'abord le contenu de l'article", variant: "destructive" });
      return;
    }
    
    setStructureLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('blog-ai-assistant', {
        body: { content, action: 'structure_article' }
      });
      
      if (error) throw error;
      
      if (data.content) {
        setContent(data.content);
        toast({ title: "Article structuré", description: "L'article a été reformaté professionnellement" });
      }
    } catch (error: any) {
      toast({ title: "Erreur IA", description: error.message, variant: "destructive" });
    } finally {
      setStructureLoading(false);
    }
  };

  // AI: Generate complete article from topic/idea  
  const handleGenerateFullArticle = async () => {
    if (!content.trim() && !topicInput.trim()) {
      toast({ title: "Erreur", description: "Entrez un sujet ou des idées pour générer l'article", variant: "destructive" });
      return;
    }
    
    setGenerateLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('blog-ai-assistant', {
        body: { 
          content: content.trim() || "", 
          topic: topicInput.trim() || "",
          action: 'generate_full_article',
          categories: categories?.map(c => ({ id: c.id, name: c.name }))
        }
      });
      
      if (error) throw error;
      
      if (data.title) setTitle(data.title);
      if (data.tagline) setTagline(data.tagline);
      if (data.content) setContent(data.content);
      if (data.excerpt) setExcerpt(data.excerpt);
      if (data.hashtags) setHashtags(data.hashtags);
      if (!slug && data.title) setSlug(generateSlug(data.title));
      
      // Auto-select category
      if (data.suggested_category) {
        const match = findCategoryByName(data.suggested_category);
        if (match) setCategoryId(match.id);
      }
      
      toast({ title: "Article généré !", description: "L'article complet a été créé par l'IA avec catégorie auto-sélectionnée" });
    } catch (error: any) {
      toast({ title: "Erreur IA", description: error.message, variant: "destructive" });
    } finally {
      setGenerateLoading(false);
    }
  };

  const handleMediaUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const maxSize = 500 * 1024 * 1024; // 500 MB
    
    if (file.size > maxSize) {
      toast({ title: "Erreur", description: "Le fichier ne doit pas dépasser 500 Mo", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `posts/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('blog-media').getPublicUrl(filePath);
      setFeaturedImage(data.publicUrl);
      toast({ title: "Fichier téléchargé" });
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!editingPost && !slug) {
      setSlug(generateSlug(value));
    }
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      toast({ title: "Erreur", description: "Le titre et le contenu sont requis", variant: "destructive" });
      return;
    }
    if (!categoryId) {
      toast({ title: "Erreur", description: "La catégorie est obligatoire", variant: "destructive" });
      return;
    }

    saveMutation.mutate({
      title: title.trim(),
      slug: slug.trim() || generateSlug(title),
      content,
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
      setTitle(post.title);
      setSlug(post.slug);
      setContent(post.content);
      setExcerpt(post.excerpt || "");
      setFeaturedImage(post.featured_image || "");
      setCategoryId(post.category_id || "");
      setTagline(post.tagline || "");
      setHashtags(post.hashtags || []);
      setAuthor(post.author || "Inocent KOFFI");
    }
    setShowEditor(true);
  };

  const resetForm = () => {
    setShowEditor(false);
    setEditingPost(null);
    setTitle("");
    setSlug("");
    setContent("");
    setExcerpt("");
    setFeaturedImage("");
    setCategoryId("");
    setTagline("");
    setHashtags([]);
    setAuthor("Inocent KOFFI");
  };

  const filteredPosts = posts?.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getCategoryById = (id: string | null) => {
    return categories?.find(c => c.id === id);
  };

  if (showEditor) {
    return (
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {editingPost ? "Modifier l'article" : "Nouvel article"}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Sauvegarde auto activée
            </Badge>
            <Button variant="ghost" size="icon" onClick={resetForm}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* AI Generation Section */}
          <div className="p-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-xl border-2 border-dashed border-primary/30">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Assistant IA Éditorial</h3>
            </div>
            
            {/* Quick topic input for full generation */}
            <div className="space-y-3 mb-4">
              <Label className="text-sm font-medium">Sujet ou idée (pour génération complète)</Label>
              <div className="flex gap-2">
                <Input
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="Ex: L'importance de la souveraineté alimentaire en Afrique..."
                  className="flex-1"
                />
                <Button 
                  onClick={handleGenerateFullArticle}
                  disabled={generateLoading || (!content.trim() && !topicInput.trim())}
                  className="gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
                >
                  {generateLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Générer l'article complet
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                💡 Entrez un sujet ou des idées brèves, l'IA génèrera un article complet avec titre, structure et hashtags.
              </p>
            </div>

            {/* Other AI actions */}
            <div className="flex flex-wrap gap-2 pt-3 border-t border-primary/20">
              <Button 
                variant="outline" 
                onClick={handleGenerateMeta}
                disabled={aiLoading || !content.trim()}
                className="gap-2"
                size="sm"
              >
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Hash className="w-4 h-4" />}
                Générer titre & hashtags
              </Button>
              <Button 
                variant="outline" 
                onClick={handleStructureArticle}
                disabled={structureLoading || !content.trim()}
                className="gap-2"
                size="sm"
              >
                {structureLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                Structurer le texte
              </Button>
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie *</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: cat.color }}
                      />
                      {cat.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title & Tagline */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Titre de l'article"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Phrase d'accroche</Label>
              <Input
                id="tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Phrase d'accroche impactante"
              />
            </div>
          </div>

          {/* Slug & Author */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="url-de-larticle"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Auteur</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Inocent KOFFI"
              />
            </div>
          </div>

          {/* Hashtags */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Hashtags
            </Label>
            <Input
              value={hashtags.join(", ")}
              onChange={(e) => setHashtags(e.target.value.split(",").map(h => h.trim()).filter(Boolean))}
              placeholder="#Agriculture, #Leadership, #Afrique"
            />
            {hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {hashtags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    #{tag.replace('#', '')}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Résumé / Extrait</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Résumé court de l'article (affiché dans les listes)"
              rows={2}
            />
          </div>

          {/* Featured Image */}
          <div className="space-y-2">
            <Label>Image à la une</Label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleMediaUpload}
                accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx"
                className="hidden"
              />
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                {uploading ? "Téléchargement..." : "Télécharger (max 500 Mo)"}
              </Button>
            </div>
            {featuredImage && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden mt-2 border">
                <img src={featuredImage} alt="Preview" className="w-full h-full object-cover" />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => setFeaturedImage("")}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label>Contenu *</Label>
            <p className="text-xs text-muted-foreground">
              Rédigez librement votre texte, puis utilisez l'IA pour structurer et générer les métadonnées.
            </p>
            <div className="border rounded-lg">
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Rédigez votre article ici... L'IA structurera et générera le titre automatiquement."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-end gap-4 pt-4 border-t">
            <Button variant="outline" onClick={resetForm}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={saveMutation.isPending} className="gap-2">
              <Save className="w-4 h-4" />
              {saveMutation.isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

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
            <div className="text-center py-8">Chargement...</div>
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
                            {post.featured_image && (
                              <img 
                                src={post.featured_image} 
                                alt={post.title}
                                className="w-12 h-12 rounded object-cover hidden sm:block"
                              />
                            )}
                            <div className="min-w-0">
                              <p className="font-medium truncate">{post.title}</p>
                              <p className="text-sm text-muted-foreground truncate">/{post.slug}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {category && (
                            <Badge 
                              variant="outline"
                              style={{ borderColor: category.color, color: category.color }}
                            >
                              {category.name}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {post.is_published ? (
                            <Badge variant="default" className="bg-green-600">Publié</Badge>
                          ) : (
                            <Badge variant="secondary">Brouillon</Badge>
                          )}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {formatDate(post.published_at || post.created_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1 sm:gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => publishMutation.mutate({ id: post.id, publish: !post.is_published })}
                              title={post.is_published ? "Dépublier" : "Publier"}
                            >
                              {post.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditor(post)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => { setPostToDelete(post.id); setDeleteDialogOpen(true); }}
                            >
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
                <Plus className="w-4 h-4" />
                Créer le premier article
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l'article ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'article sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => postToDelete && deleteMutation.mutate(postToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminBlogEnhanced;
