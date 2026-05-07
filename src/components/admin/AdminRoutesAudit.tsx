import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, ExternalLink, ArrowUpDown, History, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RouteResult {
  path: string;
  url: string;
  http_status: number | null;
  og_image: string | null;
  og_image_https: boolean;
  og_description: string | null;
  og_locale: string | null;
  expected_locale: string | null;
  locale_ok: boolean;
  description_ok: boolean;
  image_ok: boolean;
  issues: string[];
}

interface Snapshot {
  id: string;
  created_at: string;
  summary: any;
  results: RouteResult[];
  total: number;
  with_issues: number;
  source: string;
}

type Filter = "all" | "errors" | "ok" | "pages" | "articles";

export default function AdminRoutesAudit() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RouteResult[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [sortByErrors, setSortByErrors] = useState(true);
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const loadHistory = async () => {
    const { data } = await supabase
      .from("og_audit_history" as any)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30);
    setHistory((data as any) || []);
  };

  const runAudit = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("og-routes-audit", {
        body: { source: "manual" },
      });
      if (error) throw error;
      setResults((data as any).results || []);
      setSummary((data as any).summary || null);
      toast({ title: "Audit terminé", description: `${(data as any).summary?.with_issues || 0} problème(s) détecté(s)` });
      loadHistory();
    } catch (e: any) {
      toast({ title: "Erreur", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadHistory(); }, []);

  const filtered = useMemo(() => {
    let arr = [...results];
    if (filter === "errors") arr = arr.filter(r => r.issues.length > 0);
    if (filter === "ok") arr = arr.filter(r => r.issues.length === 0);
    if (filter === "pages") arr = arr.filter(r => !r.path.startsWith("/blog/"));
    if (filter === "articles") arr = arr.filter(r => r.path.startsWith("/blog/"));
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(r => r.path.toLowerCase().includes(q) || (r.og_description || "").toLowerCase().includes(q));
    }
    arr.sort((a, b) => sortByErrors ? b.issues.length - a.issues.length : a.path.localeCompare(b.path));
    return arr;
  }, [results, filter, search, sortByErrors]);

  const exportCSV = () => {
    const rows = [
      ["path", "url", "http_status", "og_image", "og_description", "og_locale", "issues"].join(","),
      ...filtered.map(r => [
        r.path, r.url, r.http_status ?? "",
        (r.og_image || "").replace(/,/g, ";"),
        (r.og_description || "").replace(/,/g, ";").slice(0, 200),
        r.og_locale || "",
        r.issues.join(" | ").replace(/,/g, ";"),
      ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    const blob = new Blob([rows], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `og-routes-audit-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const loadSnapshot = (s: Snapshot) => {
    setResults(s.results || []);
    setSummary(s.summary || null);
    setShowHistory(false);
    toast({ title: "Instantané chargé", description: new Date(s.created_at).toLocaleString("fr-FR") });
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 sm:p-6 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Audit OG des routes publiques</h2>
            <p className="text-sm text-muted-foreground mt-1">Vérifie og:image, og:description et og:locale sur chaque page clé et chaque article publié.</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={runAudit} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Lancer l'audit
            </Button>
            <Button variant="outline" onClick={() => { setShowHistory(!showHistory); loadHistory(); }}>
              <History className="w-4 h-4 mr-2" />Historique
            </Button>
            <Button variant="outline" onClick={exportCSV} disabled={!results.length}>
              <Download className="w-4 h-4 mr-2" />CSV
            </Button>
          </div>
        </div>

        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5">
            <Stat label="Total" value={summary.total} />
            <Stat label="OK" value={summary.ok} tone="success" />
            <Stat label="Erreurs" value={summary.with_issues} tone={summary.with_issues ? "destructive" : "muted"} />
            <Stat label="Img KO" value={summary.missing_image} />
            <Stat label="Locale KO" value={summary.wrong_locale} />
          </div>
        )}
      </Card>

      {showHistory && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Historique récent ({history.length})</h3>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {history.map(s => (
              <button key={s.id} onClick={() => loadSnapshot(s)} className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-muted text-left text-sm">
                <span>{new Date(s.created_at).toLocaleString("fr-FR")} <Badge variant="outline" className="ml-2">{s.source}</Badge></span>
                <span className={s.with_issues ? "text-destructive font-semibold" : "text-green-600"}>{s.with_issues}/{s.total} pb</span>
              </button>
            ))}
            {!history.length && <p className="text-sm text-muted-foreground">Aucun historique pour l'instant.</p>}
          </div>
        </Card>
      )}

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <Input placeholder="Rechercher une route ou un mot-clé…" value={search} onChange={e => setSearch(e.target.value)} className="sm:max-w-sm" />
          <div className="flex gap-2 flex-wrap">
            {(["all", "errors", "ok", "pages", "articles"] as Filter[]).map(f => (
              <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}>{f}</Button>
            ))}
            <Button variant="ghost" size="sm" onClick={() => setSortByErrors(!sortByErrors)}>
              <ArrowUpDown className="w-4 h-4 mr-1" />{sortByErrors ? "Tri: erreurs" : "Tri: nom"}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {filtered.map(r => (
            <div key={r.path} className={`p-3 rounded border ${r.issues.length ? "border-destructive/40 bg-destructive/5" : "border-border"}`}>
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <code className="text-sm font-mono break-all">{r.path}</code>
                    {r.http_status && <Badge variant={r.http_status === 200 ? "secondary" : "destructive"}>HTTP {r.http_status}</Badge>}
                    {r.og_locale && <Badge variant="outline">{r.og_locale}</Badge>}
                  </div>
                  {r.og_description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.og_description}</p>}
                  {r.issues.length > 0 && (
                    <ul className="mt-2 text-xs text-destructive space-y-0.5">
                      {r.issues.map((i, k) => <li key={k}>• {i}</li>)}
                    </ul>
                  )}
                </div>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm flex items-center gap-1 flex-shrink-0">
                  <ExternalLink className="w-3 h-3" />Ouvrir
                </a>
              </div>
            </div>
          ))}
          {!filtered.length && !loading && <p className="text-sm text-muted-foreground text-center py-8">Aucun résultat. Lancez un audit pour commencer.</p>}
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: "success" | "destructive" | "muted" }) {
  const color = tone === "success" ? "text-green-600" : tone === "destructive" ? "text-destructive" : "text-foreground";
  return (
    <div className="bg-card border rounded-lg p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-2xl font-bold ${color}`}>{value ?? 0}</div>
    </div>
  );
}