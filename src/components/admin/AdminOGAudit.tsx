import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, RefreshCw, CheckCircle2, AlertTriangle, XCircle, ExternalLink, Image as ImageIcon } from "lucide-react";

interface AuditResult {
  slug: string;
  title: string;
  article_number: number | null;
  share_url: string;
  og_image: string;
  og_image_https: boolean;
  og_image_accessible: boolean;
  og_image_status: number | null;
  og_image_size_kb: number | null;
  og_description: string;
  og_description_has_summary: boolean;
  status: "ok" | "warning" | "error";
  issues: string[];
}

interface AuditSummary {
  total: number;
  ok: number;
  warning: number;
  error: number;
  checked_at: string;
}

const statusConfig = {
  ok: { color: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30", icon: CheckCircle2, label: "OK" },
  warning: { color: "bg-amber-500/10 text-amber-700 border-amber-500/30", icon: AlertTriangle, label: "Avertissement" },
  error: { color: "bg-red-500/10 text-red-700 border-red-500/30", icon: XCircle, label: "Erreur" },
};

export default function AdminOGAudit() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AuditResult[]>([]);
  const [summary, setSummary] = useState<AuditSummary | null>(null);

  const runAudit = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("og-audit", { method: "GET" });
      if (error) throw error;
      setResults(data.results || []);
      setSummary(data.summary || null);
      toast({ title: "Audit terminé", description: `${data.summary?.total || 0} articles vérifiés` });
    } catch (err) {
      toast({
        title: "Erreur audit",
        description: err instanceof Error ? err.message : "Erreur inconnue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Audit Open Graph (Partages)</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Vérifie pour chaque article publié que <code>og:image</code> est en HTTPS et accessible, et que <code>og:description</code> contient un résumé.
            </p>
          </div>
          <Button onClick={runAudit} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Lancer l'audit
          </Button>
        </CardHeader>
        {summary && (
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-lg border p-3">
                <div className="text-2xl font-bold">{summary.total}</div>
                <div className="text-xs text-muted-foreground">Articles</div>
              </div>
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                <div className="text-2xl font-bold text-emerald-700">{summary.ok}</div>
                <div className="text-xs text-muted-foreground">OK</div>
              </div>
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                <div className="text-2xl font-bold text-amber-700">{summary.warning}</div>
                <div className="text-xs text-muted-foreground">Avertissements</div>
              </div>
              <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3">
                <div className="text-2xl font-bold text-red-700">{summary.error}</div>
                <div className="text-xs text-muted-foreground">Erreurs</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Dernier contrôle: {new Date(summary.checked_at).toLocaleString("fr-FR")}
            </p>
          </CardContent>
        )}
      </Card>

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((r) => {
            const cfg = statusConfig[r.status];
            const Icon = cfg.icon;
            return (
              <Card key={r.slug} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row gap-4 p-4">
                  {r.og_image && (
                    <div className="w-full sm:w-32 h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                      {r.og_image_accessible ? (
                        <img src={r.og_image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <h4 className="font-semibold truncate">{r.title}</h4>
                        <a
                          href={r.share_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1"
                        >
                          /{r.slug} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <Badge className={`${cfg.color} border flex-shrink-0`}>
                        <Icon className="w-3 h-3 mr-1" />
                        {cfg.label}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="font-medium text-muted-foreground mb-0.5">og:image</div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={r.og_image_https ? "secondary" : "destructive"}>
                            {r.og_image_https ? "HTTPS" : "Non HTTPS"}
                          </Badge>
                          <Badge variant={r.og_image_accessible ? "secondary" : "destructive"}>
                            {r.og_image_accessible ? "Accessible" : "Inaccessible"}
                          </Badge>
                          {r.og_image_size_kb !== null && (
                            <Badge variant="outline">{r.og_image_size_kb} KB</Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground mb-0.5">og:description</div>
                        <div className="line-clamp-2 text-foreground">
                          {r.og_description || <span className="italic text-red-600">vide</span>}
                        </div>
                      </div>
                    </div>

                    {r.issues.length > 0 && (
                      <div className="mt-2 text-xs text-red-700 space-y-0.5">
                        {r.issues.map((iss, i) => (
                          <div key={i}>• {iss}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}