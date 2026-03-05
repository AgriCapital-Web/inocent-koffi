import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer, ExternalLink, BookOpen, ChevronRight, Search, BarChart3, Table2 } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from "recharts";

interface SearchResult {
  title: string;
  summary: string;
  sections: { title: string; content: string; sources?: string[] }[];
  keyFacts: string[];
  references?: { title: string; url?: string; type?: string }[];
  relatedTopics?: string[];
}

// Extract table data from HTML content for interactive charts
const extractTablesFromHTML = (html: string): Array<{ headers: string[]; rows: string[][] }> => {
  const tables: Array<{ headers: string[]; rows: string[][] }> = [];
  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  let match;
  while ((match = tableRegex.exec(html)) !== null) {
    const tableHTML = match[1];
    const headers: string[] = [];
    const rows: string[][] = [];
    const thRegex = /<th[^>]*>([\s\S]*?)<\/th>/gi;
    let thMatch;
    while ((thMatch = thRegex.exec(tableHTML)) !== null) {
      headers.push(thMatch[1].replace(/<[^>]*>/g, '').trim());
    }
    const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let trMatch;
    let isFirst = true;
    while ((trMatch = trRegex.exec(tableHTML)) !== null) {
      if (isFirst && headers.length > 0) { isFirst = false; continue; }
      isFirst = false;
      const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
      const row: string[] = [];
      let tdMatch;
      while ((tdMatch = tdRegex.exec(trMatch[1])) !== null) {
        row.push(tdMatch[1].replace(/<[^>]*>/g, '').trim());
      }
      if (row.length > 0) rows.push(row);
    }
    if (headers.length > 0 && rows.length > 0) tables.push({ headers, rows });
  }
  return tables;
};

// Convert table data to chart data
const tableToChartData = (table: { headers: string[]; rows: string[][] }) => {
  return table.rows.map(row => {
    const obj: Record<string, any> = { name: row[0] || '' };
    table.headers.slice(1).forEach((header, i) => {
      const val = row[i + 1] || '0';
      const num = parseFloat(val.replace(/[^0-9.,\-]/g, '').replace(',', '.'));
      obj[header] = isNaN(num) ? val : num;
    });
    return obj;
  });
};

const CHART_COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', '#10b981', '#f59e0b', '#6366f1', '#ec4899'];

const InteractiveChart = ({ table }: { table: { headers: string[]; rows: string[][] } }) => {
  const chartData = tableToChartData(table);
  const numericHeaders = table.headers.slice(1).filter((_, i) => 
    table.rows.some(row => !isNaN(parseFloat((row[i + 1] || '0').replace(/[^0-9.,\-]/g, '').replace(',', '.'))))
  );

  if (numericHeaders.length === 0) return null;

  const isPieData = numericHeaders.length === 1 && chartData.length <= 8;

  if (isPieData) {
    const pieData = chartData.map((d, i) => ({
      name: d.name,
      value: d[numericHeaders[0]] || 0,
      fill: CHART_COLORS[i % CHART_COLORS.length],
    }));

    return (
      <motion.div 
        className="my-6 p-6 bg-card border border-border rounded-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-accent" />
          <h4 className="font-semibold text-foreground">Visualisation graphique</h4>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
              {pieData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="my-6 p-6 bg-card border border-border rounded-xl"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-accent" />
        <h4 className="font-semibold text-foreground">Tableau comparatif interactif</h4>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
          <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
          <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
          <Legend />
          {numericHeaders.map((header, i) => (
            <Bar key={header} dataKey={header} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

// Enhanced HTML table rendering
const EnhancedTable = ({ table }: { table: { headers: string[]; rows: string[][] } }) => (
  <motion.div 
    className="my-6 overflow-x-auto"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
  >
    <div className="flex items-center gap-2 mb-3">
      <Table2 className="w-4 h-4 text-accent" />
      <span className="text-sm font-medium text-muted-foreground">Données comparatives</span>
    </div>
    <table className="w-full border-collapse text-sm rounded-xl overflow-hidden shadow-sm">
      <thead>
        <tr className="bg-primary text-primary-foreground">
          {table.headers.map((h, i) => (
            <th key={i} className="px-4 py-3 text-left font-semibold">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.rows.map((row, ri) => (
          <tr key={ri} className={ri % 2 === 0 ? 'bg-card' : 'bg-muted/30'}>
            {row.map((cell, ci) => (
              <td key={ci} className="px-4 py-3 border-b border-border/50">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </motion.div>
);

const SearchResults = () => {
  const [result, setResult] = useState<SearchResult | null>(null);
  const [query, setQuery] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem("agri-search-result");
    const storedQuery = sessionStorage.getItem("agri-search-query");
    if (stored) {
      setResult(JSON.parse(stored));
      setQuery(storedQuery || "");
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handlePrint = () => window.print();

  const handleDownload = () => {
    if (!contentRef.current || !result) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${result.title} - Inocent KOFFI</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1a1a2e; }
          .header { text-align: center; border-bottom: 3px solid #c8a951; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { font-size: 24px; color: #1a1a2e; margin-bottom: 8px; }
          .header p { color: #666; font-size: 14px; }
          .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); font-size: 60px; color: rgba(200, 169, 81, 0.06); pointer-events: none; white-space: nowrap; z-index: 0; }
          .signature { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #c8a951; color: #666; font-size: 12px; }
          .signature strong { color: #1a1a2e; }
          .signature a { color: #c8a951; }
          h2 { color: #1a1a2e; border-left: 4px solid #c8a951; padding-left: 12px; margin-top: 30px; }
          .summary { background: #f8f6f0; padding: 16px; border-left: 4px solid #c8a951; margin: 20px 0; border-radius: 0 8px 8px 0; }
          .key-fact { background: #f0f7f0; padding: 10px 14px; margin: 6px 0; border-radius: 6px; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin: 16px 0; }
          th { background: #1a1a2e; color: white; padding: 10px; text-align: left; }
          td { padding: 10px; border-bottom: 1px solid #e5e5e5; }
          tr:nth-child(even) td { background: #f8f8f8; }
          .ref { font-size: 12px; color: #666; margin: 4px 0; }
          @media print { .watermark { display: block; } .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="watermark">Inocent KOFFI — ikoffi.agricapital.ci</div>
        <div class="header">
          <p style="font-size:11px;color:#c8a951;letter-spacing:2px;">INOCENT KOFFI — INNOVATION & CONSULTATION</p>
          <h1>${result.title}</h1>
          <p>Recherche : "${query}" | ${new Date().toLocaleDateString('fr-FR')}</p>
          <p style="font-size:11px;">ikoffi.agricapital.ci</p>
        </div>
        <div class="summary">${result.summary}</div>
        ${result.keyFacts?.length ? `<h2>Points clés</h2>${result.keyFacts.map(f => `<div class="key-fact">✓ ${f}</div>`).join('')}` : ''}
        ${result.sections?.map(s => `
          <h2>${s.title}</h2>
          <div>${s.content}</div>
          ${s.sources?.length ? `<div class="ref">Sources : ${s.sources.join(', ')}</div>` : ''}
        `).join('') || ''}
        ${result.references?.length ? `
          <h2>Références</h2>
          ${result.references.map(r => `<div class="ref">• ${r.title}${r.url ? ` — <a href="${r.url}">${r.url}</a>` : ''}${r.type ? ` (${r.type})` : ''}</div>`).join('')}
        ` : ''}
        <div class="signature">
          <strong>Inocent KOFFI</strong> — Innovation & Consultation<br/>
          <a href="https://ikoffi.agricapital.ci">ikoffi.agricapital.ci</a><br/>
          <span>Fondateur & CEO AGRICAPITAL SARL | Développeur Web & Praticien IA</span>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (!result) return null;

  // Extract tables from all sections for charts
  const allTables = result.sections?.flatMap(s => extractTablesFromHTML(s.content)) || [];

  return (
    <>
      <Helmet>
        <title>{result.title} - Recherche Agricole | Inocent KOFFI</title>
      </Helmet>
      <div className="min-h-screen print:bg-white">
        <div className="print:hidden">
          <Navbar />
        </div>
        
        <main className="pt-20 print:pt-0">
          {/* Header */}
          <section className="py-8 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground print:bg-white print:text-foreground">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-xs tracking-widest opacity-70 uppercase mb-1 print:hidden">
                    Inocent KOFFI — Innovation & Consultation
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-bold">{result.title}</h1>
                  <p className="text-sm opacity-80 mt-1">Recherche : « {query} » | {new Date().toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="flex gap-2 print:hidden">
                  <Button variant="secondary" size="sm" onClick={() => navigate("/")} className="gap-1">
                    <ArrowLeft className="w-4 h-4" /> Retour
                  </Button>
                  <Button variant="secondary" size="sm" onClick={handlePrint} className="gap-1">
                    <Printer className="w-4 h-4" /> Imprimer
                  </Button>
                  <Button variant="secondary" size="sm" onClick={handleDownload} className="gap-1">
                    <Download className="w-4 h-4" /> PDF
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <div className="container mx-auto px-4 max-w-4xl py-8" ref={contentRef}>
            {/* Summary */}
            <motion.div 
              className="p-6 bg-accent/5 border-l-4 border-accent rounded-r-xl mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <p className="text-muted-foreground leading-relaxed text-lg">{result.summary}</p>
            </motion.div>

            {/* Key Facts */}
            {result.keyFacts?.length > 0 && (
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-accent" /> Points clés
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.keyFacts.map((fact, i) => (
                    <motion.div 
                      key={i} 
                      className="flex items-start gap-3 p-4 bg-card border border-border rounded-xl"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i }}
                    >
                      <ChevronRight className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{fact}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Interactive Charts from tables */}
            {allTables.length > 0 && (
              <motion.div
                className="mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {allTables.map((table, i) => (
                  <div key={i}>
                    <InteractiveChart table={table} />
                    <EnhancedTable table={table} />
                  </div>
                ))}
              </motion.div>
            )}

            {/* Sections */}
            {result.sections?.map((section, i) => (
              <motion.div 
                key={i} 
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <h2 className="text-xl font-bold text-foreground mb-3 border-l-4 border-accent pl-4">{section.title}</h2>
                <div 
                  className="article-content text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: section.content }} 
                />
                {section.sources && section.sources.length > 0 && (
                  <div className="mt-2 text-xs text-muted-foreground/60">
                    Sources : {section.sources.join(', ')}
                  </div>
                )}
              </motion.div>
            ))}

            {/* References */}
            {result.references && result.references.length > 0 && (
              <div className="mb-8 p-6 bg-card border border-border rounded-xl">
                <h2 className="text-lg font-bold text-foreground mb-4">Références & Sources</h2>
                <div className="space-y-2">
                  {result.references.map((ref, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-accent">•</span>
                      <div>
                        <span className="text-foreground font-medium">{ref.title}</span>
                        {ref.type && <span className="text-muted-foreground ml-2">({ref.type})</span>}
                        {ref.url && (
                          <a href={ref.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-primary hover:underline inline-flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Topics */}
            {result.relatedTopics && result.relatedTopics.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Sujets connexes</h3>
                <div className="flex flex-wrap gap-2">
                  {result.relatedTopics.map((topic, i) => (
                    <span key={i} className="px-3 py-1.5 bg-secondary text-foreground text-xs rounded-full border border-border">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Signature */}
            <div className="text-center py-8 border-t border-border mt-8">
              <p className="text-xs text-muted-foreground/40 uppercase tracking-widest mb-1">
                Inocent KOFFI — Innovation & Consultation
              </p>
              <a href="https://ikoffi.agricapital.ci" className="text-sm text-accent hover:underline font-medium">
                ikoffi.agricapital.ci
              </a>
              <p className="text-[10px] text-muted-foreground/30 mt-1">
                Fondateur & CEO AGRICAPITAL SARL | Développeur Web & Praticien IA
              </p>
            </div>
          </div>
        </main>

        <div className="print:hidden">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default SearchResults;
