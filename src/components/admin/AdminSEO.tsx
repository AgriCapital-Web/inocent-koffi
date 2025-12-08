import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Save, Globe, Search, Share2, CheckCircle2, AlertCircle } from "lucide-react";

const AdminSEO = () => {
  const { toast } = useToast();
  const [seoData, setSeoData] = useState({
    title: "Inocent KOFFI - Fondateur & CEO AGRICAPITAL | Consultant Agricole",
    description: "Inocent KOFFI, 12 ans d'expertise terrain en agriculture. Fondateur d'AGRICAPITAL SARL, spécialisé dans le conseil agricole et le développement durable en Côte d'Ivoire.",
    keywords: "Inocent KOFFI, AGRICAPITAL, agriculture Côte d'Ivoire, consultant agricole, palmier à huile, développement rural, Daloa",
    ogImage: "https://ikoffi.agricapital.ci/og-image-profile.png",
    canonicalUrl: "https://ikoffi.agricapital.ci/",
    twitterHandle: "@inocentkoffi",
  });

  const seoChecklist = [
    { label: "Titre optimisé (< 60 caractères)", check: seoData.title.length <= 60 && seoData.title.length > 0 },
    { label: "Meta description (< 160 caractères)", check: seoData.description.length <= 160 && seoData.description.length > 0 },
    { label: "Mots-clés définis", check: seoData.keywords.length > 0 },
    { label: "Image OG configurée", check: seoData.ogImage.startsWith("http") },
    { label: "URL canonique définie", check: seoData.canonicalUrl.startsWith("http") },
    { label: "Handle Twitter configuré", check: seoData.twitterHandle.startsWith("@") },
  ];

  const seoScore = Math.round((seoChecklist.filter(item => item.check).length / seoChecklist.length) * 100);

  const handleSave = () => {
    toast({
      title: "Configuration SEO sauvegardée",
      description: "Les métadonnées ont été mises à jour.",
    });
  };

  return (
    <div className="space-y-6">
      {/* SEO Score Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Score SEO
          </CardTitle>
          <CardDescription>Évaluation de l'optimisation pour les moteurs de recherche</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${seoScore * 2.51} 251`}
                  className={seoScore >= 80 ? "text-green-500" : seoScore >= 50 ? "text-yellow-500" : "text-red-500"}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{seoScore}%</span>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
              {seoChecklist.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  {item.check ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  )}
                  <span className={`text-sm ${item.check ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meta Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Métadonnées Principales
          </CardTitle>
          <CardDescription>Configuration des balises meta pour le référencement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="title">Titre de la Page</Label>
              <Badge variant={seoData.title.length <= 60 ? "default" : "destructive"}>
                {seoData.title.length}/60
              </Badge>
            </div>
            <Input
              id="title"
              value={seoData.title}
              onChange={(e) => setSeoData({ ...seoData, title: e.target.value })}
              placeholder="Titre optimisé pour le SEO"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Meta Description</Label>
              <Badge variant={seoData.description.length <= 160 ? "default" : "destructive"}>
                {seoData.description.length}/160
              </Badge>
            </div>
            <Textarea
              id="description"
              value={seoData.description}
              onChange={(e) => setSeoData({ ...seoData, description: e.target.value })}
              placeholder="Description concise et engageante"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Mots-clés</Label>
            <Textarea
              id="keywords"
              value={seoData.keywords}
              onChange={(e) => setSeoData({ ...seoData, keywords: e.target.value })}
              placeholder="mot-clé1, mot-clé2, mot-clé3"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="canonical">URL Canonique</Label>
            <Input
              id="canonical"
              value={seoData.canonicalUrl}
              onChange={(e) => setSeoData({ ...seoData, canonicalUrl: e.target.value })}
              placeholder="https://ikoffi.agricapital.ci/"
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Réseaux Sociaux
          </CardTitle>
          <CardDescription>Configuration pour le partage sur les réseaux sociaux</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ogImage">Image Open Graph (1200x630 recommandé)</Label>
            <Input
              id="ogImage"
              value={seoData.ogImage}
              onChange={(e) => setSeoData({ ...seoData, ogImage: e.target.value })}
              placeholder="https://exemple.com/og-image.png"
            />
            {seoData.ogImage && (
              <div className="mt-2 border rounded-lg overflow-hidden max-w-md">
                <img 
                  src={seoData.ogImage} 
                  alt="Aperçu OG" 
                  className="w-full h-auto"
                  onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter">Handle Twitter</Label>
            <Input
              id="twitter"
              value={seoData.twitterHandle}
              onChange={(e) => setSeoData({ ...seoData, twitterHandle: e.target.value })}
              placeholder="@utilisateur"
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Aperçu Google</CardTitle>
          <CardDescription>Voici comment votre site apparaîtra dans les résultats de recherche</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted rounded-lg space-y-1">
            <p className="text-blue-600 text-lg font-medium truncate">{seoData.title || "Titre de la page"}</p>
            <p className="text-green-700 text-sm">{seoData.canonicalUrl}</p>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {seoData.description || "Description de la page..."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder la Configuration SEO
        </Button>
      </div>
    </div>
  );
};

export default AdminSEO;
