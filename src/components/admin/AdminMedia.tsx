import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, Image, Copy, Search, FolderOpen } from "lucide-react";

interface MediaFile {
  name: string;
  url: string;
  created_at: string;
  size?: number;
}

const AdminMedia = () => {
  const { toast } = useToast();
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('testimonials')
        .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

      if (error) throw error;

      const filesWithUrls = (data || []).map(file => ({
        name: file.name,
        url: supabase.storage.from('testimonials').getPublicUrl(file.name).data.publicUrl,
        created_at: file.created_at || new Date().toISOString(),
        size: file.metadata?.size
      }));

      setFiles(filesWithUrls);
    } catch (error) {
      console.error("Error loading files:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error } = await supabase.storage
        .from('testimonials')
        .upload(fileName, file);

      if (error) throw error;

      toast({ title: "Fichier téléchargé avec succès" });
      loadFiles();
    } catch (error: any) {
      toast({ 
        title: "Erreur", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileName: string) => {
    try {
      const { error } = await supabase.storage
        .from('testimonials')
        .remove([fileName]);

      if (error) throw error;

      toast({ title: "Fichier supprimé" });
      loadFiles();
    } catch (error: any) {
      toast({ 
        title: "Erreur", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "URL copiée" });
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Gestionnaire de Médias
          </CardTitle>
          <CardDescription>
            Gérez les images et fichiers du site
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
                id="file-upload"
              />
              <Button asChild disabled={uploading}>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? "Téléchargement..." : "Télécharger"}
                </label>
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredFiles.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredFiles.map((file) => (
                <div 
                  key={file.name} 
                  className="group relative border rounded-lg overflow-hidden bg-muted/50 hover:border-primary transition-colors"
                >
                  <div className="aspect-square relative">
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => copyUrl(file.url)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(file.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-xs truncate text-muted-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Image className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun fichier trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMedia;
