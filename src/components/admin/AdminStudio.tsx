import { useEffect, useRef, useState } from "react";
import { Download, ImageIcon, Loader2, Mic, ShieldCheck, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

const WATERMARK_DEFAULT = "© Inocent KOFFI — ikoffi.agricapital.ci";
const BUCKET = "blog-media";
const FOLDER = "studio";

type Processed = {
  url: string;
  blob: Blob;
  name: string;
  sizeBefore: number;
  sizeAfter: number;
};

type Published = { name: string; url: string };

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} Mo`;
};

const AdminStudio = () => {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [watermark, setWatermark] = useState(WATERMARK_DEFAULT);
  const [quality, setQuality] = useState(72);
  const [maxWidth, setMaxWidth] = useState(1600);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [results, setResults] = useState<Processed[]>([]);
  const [published, setPublished] = useState<Published[]>([]);

  const loadPublished = async () => {
    const { data } = await supabase.storage.from(BUCKET).list(FOLDER, {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    });
    setPublished(
      (data ?? [])
        .filter((f) => f.name && !f.name.startsWith("."))
        .map((f) => ({
          name: f.name,
          url: supabase.storage.from(BUCKET).getPublicUrl(`${FOLDER}/${f.name}`).data.publicUrl,
        })),
    );
  };

  useEffect(() => {
    loadPublished();
  }, []);

  const process = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    const out: Processed[] = [];

    for (const file of Array.from(files).slice(0, 8)) {
      if (!file.type.startsWith("image/")) continue;
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, maxWidth / bitmap.width);
      const width = Math.round(bitmap.width * scale);
      const height = Math.round(bitmap.height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) continue;
      ctx.drawImage(bitmap, 0, 0, width, height);

      const fontSize = Math.max(14, Math.round(width / 42));
      ctx.font = `600 ${fontSize}px Poppins, system-ui, sans-serif`;
      ctx.textBaseline = "middle";

      ctx.save();
      ctx.globalAlpha = 0.16;
      ctx.fillStyle = "#ffffff";
      ctx.translate(width / 2, height / 2);
      ctx.rotate(-Math.PI / 8);
      for (let y = -height; y < height; y += fontSize * 5) {
        for (let x = -width; x < width; x += ctx.measureText(watermark).width + fontSize * 3) {
          ctx.fillText(watermark, x, y);
        }
      }
      ctx.restore();

      const barH = fontSize * 2.4;
      ctx.fillStyle = "rgba(13, 27, 42, 0.72)";
      ctx.fillRect(0, height - barH, width, barH);
      ctx.fillStyle = "#D4AF37";
      ctx.fillText(watermark, fontSize, height - barH / 2);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/webp", quality / 100),
      );
      if (!blob) continue;

      out.push({
        url: URL.createObjectURL(blob),
        blob,
        name: file.name.replace(/\.[^.]+$/, "").replace(/[^a-z0-9-_]/gi, "-") + "-studio.webp",
        sizeBefore: file.size,
        sizeAfter: blob.size,
      });
    }

    setResults((prev) => [...out, ...prev]);
    setBusy(false);
  };

  const publish = async (item: Processed) => {
    setUploading(item.name);
    const path = `${FOLDER}/${Date.now()}-${item.name}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, item.blob, {
      contentType: "image/webp",
      upsert: false,
    });
    setUploading(null);
    if (error) {
      toast({ title: "Publication impossible", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Visuel publié sur la page Studio" });
    setResults((prev) => prev.filter((r) => r.url !== item.url));
    loadPublished();
  };

  const removePublished = async (name: string) => {
    const { error } = await supabase.storage.from(BUCKET).remove([`${FOLDER}/${name}`]);
    if (error) {
      toast({ title: "Suppression impossible", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Visuel retiré" });
    loadPublished();
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: ShieldCheck, title: "Filigrane", desc: "Diagonale + bandeau de signature." },
          { icon: ImageIcon, title: "Compression", desc: "Redimensionnement et WebP." },
          { icon: Mic, title: "Signature vocale", desc: "Jingles et voix off signés à l'export." },
        ].map(({ icon: Icon, title, desc }) => (
          <Card key={title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" /> {title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{desc}</CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Traitement des visuels</CardTitle>
          <CardDescription>
            Traitement local dans le navigateur, puis publication sur la page Studio.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="wm">Texte du filigrane</Label>
            <Input id="wm" value={watermark} maxLength={80} onChange={(e) => setWatermark(e.target.value)} />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <Label>Qualité : {quality}%</Label>
              <Slider value={[quality]} min={40} max={95} step={1} onValueChange={([v]) => setQuality(v)} />
            </div>
            <div className="space-y-3">
              <Label>Largeur max : {maxWidth} px</Label>
              <Slider value={[maxWidth]} min={600} max={2200} step={100} onValueChange={([v]) => setMaxWidth(v)} />
            </div>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => process(e.target.files)}
          />
          <Button onClick={() => inputRef.current?.click()} disabled={busy} className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            {busy ? "Traitement en cours…" : "Choisir des visuels à protéger"}
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2">
          {results.map((r) => (
            <figure key={r.url} className="bg-card border rounded-xl overflow-hidden">
              <img src={r.url} alt={`Visuel filigrané ${r.name}`} className="w-full" />
              <figcaption className="p-4 text-sm space-y-3">
                <p className="font-medium truncate">{r.name}</p>
                <p className="text-muted-foreground">
                  {formatBytes(r.sizeBefore)} → {formatBytes(r.sizeAfter)}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => publish(r)} disabled={uploading === r.name}>
                    {uploading === r.name ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Publier
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href={r.url} download={r.name}>
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </a>
                  </Button>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Publications en ligne ({published.length})</CardTitle>
          <CardDescription>Visuels visibles sur la page publique /studio.</CardDescription>
        </CardHeader>
        <CardContent>
          {published.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune publication pour le moment.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              {published.map((p) => (
                <figure key={p.name} className="border rounded-xl overflow-hidden">
                  <img src={p.url} alt={p.name} className="w-full h-32 object-cover" loading="lazy" />
                  <figcaption className="p-3 flex items-center justify-between gap-2">
                    <span className="text-xs truncate">{p.name}</span>
                    <Button size="icon" variant="ghost" onClick={() => removePublished(p.name)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Retirer</span>
                    </Button>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStudio;
