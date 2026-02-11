import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save, Globe, Search, Share2, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const AdminSEO = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [seoData, setSeoData] = useState({
    site_title: "Inocent KOFFI - Fondateur & CEO AGRICAPITAL | Consultant Agricole",
    meta_description: "Inocent KOFFI, 12 ans d'expertise terrain en agriculture. Fondateur d'AGRICAPITAL SARL.",
    keywords: "Inocent KOFFI, AGRICAPITAL, agriculture Côte d'Ivoire",
    og_image: "https://ikoffi.agricapital.ci/og-image-profile.png",
    canonical_url: "https://ikoffi.agricapital.ci/",
    twitter_handle: "@inocentkoffi",
    google_analytics_id: "",
    google_search_console: "",
  });

  useEffect(() => {
    loadSEO();
  }, []);

  const loadSEO = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('setting_key', 'seo')
        .single();
      
      if (!error && data && typeof data.setting_value === 'object' && data.setting_value !== null) {
        setSeoData(prev => ({ ...prev, ...(data.setting_value as Record<string, any>) }));
      }
    } catch (e) {
      console.error("Error loading SEO:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ 
          setting_key: 'seo', 
          setting_value: seoData,
          updated_at: new Date().toISOString()
        }, { onConflict: 'setting_key' });

      if (error) throw error;
      toast({ title: "Configuration SEO sauvegardée", description: "Les métadonnées sont appliquées automatiquement sur tout le site." });
    } catch (error: any) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const seoChecklist = [
    { label: "Titre optimisé (< 60 caractères)", check: seoData.site_title.length <= 60 && seoData.site_title.length > 0 },
    { label: "Meta description (< 160 caractères)", check: seoData.meta_description.length <= 160 && seoData.meta_description.length > 0 },
    { label: "Mots-clés définis", check: seoData.keywords.length > 0 },
    { label: "Image OG configurée", check: seoData.og_image.startsWith("http") },
    { label: "URL canonique définie", check: seoData.canonical_url.startsWith("http") },
    { label: "Handle Twitter configuré", check: seoData.twitter_handle.startsWith("@") },
  ];

  const seoScore = Math.round((seoChecklist.filter(item => item.check).length / seoChecklist.length) * 100);

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
      {/* SEO Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Search className="h-5 w-5" />Score SEO</CardTitle>
          <CardDescription>Évaluation de l'optimisation — les données sont persistées en base</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted" />
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none"
                  strokeDasharray={`${seoScore * 2.51} 251`}
                  className={seoScore >= 80 ? "text-green-500" : seoScore >= 50 ? "text-yellow-500" : "text-red-500"}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{seoScore}%</span>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
              {seoChecklist.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  {item.check ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4 text-yellow-500" />}
                  <span className={`text-sm ${item.check ? 'text-muted-foreground' : 'text-foreground'}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meta Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" />Métadonnées Principales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Titre de la Page</Label>
              <Badge variant={seoData.site_title.length <= 60 ? "default" : "destructive"}>{seoData.site_title.length}/60</Badge>
            </div>
            <Input value={seoData.site_title} onChange={(e) => setSeoData({ ...seoData, site_title: e.target.value })} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Meta Description</Label>
              <Badge variant={seoData.meta_description.length <= 160 ? "default" : "destructive"}>{seoData.meta_description.length}/160</Badge>
            </div>
            <Textarea value={seoData.meta_description} onChange={(e) => setSeoData({ ...seoData, meta_description: e.target.value })} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Mots-clés</Label>
            <Textarea value={seoData.keywords} onChange={(e) => setSeoData({ ...seoData, keywords: e.target.value })} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>URL Canonique</Label>
            <Input value={seoData.canonical_url} onChange={(e) => setSeoData({ ...seoData, canonical_url: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Google Analytics ID</Label>
              <Input value={seoData.google_analytics_id} onChange={(e) => setSeoData({ ...seoData, google_analytics_id: e.target.value })} placeholder="G-XXXXXXXXXX" />
            </div>
            <div className="space-y-2">
              <Label>Google Search Console</Label>
              <Input value={seoData.google_search_console} onChange={(e) => setSeoData({ ...seoData, google_search_console: e.target.value })} placeholder="Code de vérification" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Share2 className="h-5 w-5" />Réseaux Sociaux</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Image Open Graph</Label>
            <Input value={seoData.og_image} onChange={(e) => setSeoData({ ...seoData, og_image: e.target.value })} />
            {seoData.og_image && (
              <div className="mt-2 border rounded-lg overflow-hidden max-w-md">
                <img src={seoData.og_image} alt="Aperçu OG" className="w-full h-auto" onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>Handle Twitter</Label>
            <Input value={seoData.twitter_handle} onChange={(e) => setSeoData({ ...seoData, twitter_handle: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader><CardTitle>Aperçu Google</CardTitle></CardHeader>
        <CardContent>
          <div className="p-4 bg-muted rounded-lg space-y-1">
            <p className="text-blue-600 text-lg font-medium truncate">{seoData.site_title || "Titre"}</p>
            <p className="text-green-700 text-sm">{seoData.canonical_url}</p>
            <p className="text-sm text-muted-foreground line-clamp-2">{seoData.meta_description || "Description..."}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Sauvegarder la Configuration SEO
        </Button>
      </div>
    </div>
  );
};

export default AdminSEO;
