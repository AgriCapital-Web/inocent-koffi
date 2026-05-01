import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, RefreshCw, CheckCircle2, AlertTriangle, XCircle, ExternalLink, Image as ImageIcon, Download, FileText } from "lucide-react";

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

function escapeHtml(value: string): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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

  const exportCSV = () => {
    if (!results.length) return;
    const headers = [
      "slug","title","article_number","status","og_image","og_image_https","og_image_accessible",
      "og_image_status","og_image_size_kb","og_description_has_summary","og_description","issues","share_url",
    ];
    const escape = (v: unknown) => {
      const s = v === null || v === undefined ? "" : String(v);
      return `"${s.replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
    };
    const rows = results.map((r) =>
      [
        r.slug, r.title, r.article_number ?? "", r.status, r.og_image, r.og_image_https,
        r.og_image_accessible, r.og_image_status ?? "", r.og_image_size_kb ?? "",
        r.og_description_has_summary, r.og_description, r.issues.join(" | "), r.share_url,
      ].map(escape).join(",")
    );
    const csv = "\uFEFF" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `og-audit-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "CSV exporté", description: `${results.length} lignes` });
  };

  const exportPDF = () => {
    if (!results.length) return;
    const css = `
      body{font-family:-apple-system,Segoe UI,sans-serif;color:#0f172a;padding:24px;font-size:12px}
      h1{font-size:18px;margin:0 0 4px}h2{font-size:13px;margin:18px 0 6px}
      .meta{color:#64748b;font-size:11px;margin-bottom:14px}
      .summary{display:flex;gap:8px;margin-bottom:18px}
      .chip{padding:6px 10px;border-radius:6px;border:1px solid #e2e8f0}
      .chip.ok{background:#ecfdf5;border-color:#a7f3d0;color:#047857}
      .chip.warn{background:#fffbeb;border-color:#fde68a;color:#b45309}
      .chip.err{background:#fef2f2;border-color:#fecaca;color:#b91c1c}
      table{width:100%;border-collapse:collapse;margin-top:8px}
      th,td{border:1px solid #e2e8f0;padding:6px 8px;text-align:left;vertical-align:top;font-size:11px}
      th{background:#f8fafc}
      tr.err td{background:#fef2f2}tr.warn td{background:#fffbeb}
      .issues{color:#b91c1c;font-size:10px;white-space:pre-line}
      a{color:#1d4ed8;text-decoration:none}
      @media print{body{padding:8px}}
    `;
    const rowsHtml = results
      .map(
        (r) => `<tr class="${r.status === "error" ? "err" : r.status === "warning" ? "warn" : ""}">
          <td><strong>${escapeHtml(r.title)}</strong><br><a href="${r.share_url}">/${escapeHtml(r.slug)}</a></td>
          <td>${r.status.toUpperCase()}</td>
          <td>${r.og_image_https ? "HTTPS ✓" : "✗"}<br>${r.og_image_accessible ? "Accessible ✓" : "Inaccessible ✗"}<br>${r.og_image_size_kb ?? "?"} KB</td>
          <td>${escapeHtml(r.og_description || "(vide)")}<br><em>${r.og_description_has_summary ? "Résumé OK" : "Résumé manquant"}</em></td>
          <td class="issues">${r.issues.map(escapeHtml).join("\n")}</td>
        </tr>`
      )
      .join("");
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Rapport OG Audit</title><style>${css}</style></head>
      <body>
        <h1>Rapport Audit Open Graph</h1>
        <div class="meta">Généré le ${new Date().toLocaleString("fr-FR")} — ${results.length} articles vérifiés</div>
        ${
          summary
            ? `<div class="summary">
              <div class="chip ok">OK : ${summary.ok}</div>
              <div class="chip warn">Avertissements : ${summary.warning}</div>
              <div class="chip err">Erreurs : ${summary.error}</div>
            </div>`
            : ""
        }
        <table>
          <thead><tr><th>Article</th><th>Statut</th><th>og:image</th><th>og:description</th><th>Problèmes</th></tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
        <script>window.onload=()=>setTimeout(()=>window.print(),300)</script>
      </body></html>`;
    const w = window.open("", "_blank");
    if (!w) {
      toast({ title: "Bloqué", description: "Autorisez les popups pour générer le PDF", variant: "destructive" });
      return;
    }
    w.document.write(html);
    w.document.close();
    toast({ title: "PDF prêt", description: "Utilisez la boîte d'impression pour enregistrer en PDF" });
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
          <div className="flex flex-wrap gap-2">
            <Button onClick={runAudit} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Lancer l'audit
            </Button>
            <Button onClick={exportCSV} disabled={!results.length} variant="outline" title="Exporter en CSV">
              <Download className="w-4 h-4 mr-2" /> CSV
            </Button>
            <Button onClick={exportPDF} disabled={!results.length} variant="outline" title="Exporter en PDF">
              <FileText className="w-4 h-4 mr-2" /> PDF
            </Button>
          </div>
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