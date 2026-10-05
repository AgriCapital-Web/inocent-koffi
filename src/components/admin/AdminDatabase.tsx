import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Database, Download, Upload, RefreshCw, Clock, HardDrive, FileJson, FileSpreadsheet, 
  FileText, Trash2, Shield, Key, Users, Table2, Layers, GitBranch
} from "lucide-react";

interface BackupRecord {
  id: string;
  backup_name: string;
  backup_type: string;
  file_format: string;
  file_size: number | null;
  tables_included: string[] | null;
  created_at: string;
  status: string;
  notes: string | null;
}

interface TableInfo {
  name: string;
  rowCount: number;
  columns: string[];
}

const AdminDatabase = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState("json");
  const [backupName, setBackupName] = useState("");

  const availableTables = [
    "testimonials",
    "blog_posts",
    "blog_comments",
    "newsletter_subscribers",
    "partnership_requests",
    "contact_messages",
    "profiles",
    "user_roles",
    "database_backups"
  ];

  useEffect(() => {
    loadBackups();
    loadTableStats();
  }, []);

  const loadBackups = async () => {
    const { data, error } = await supabase
      .from("database_backups")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setBackups(data);
    if (error) console.error("Error loading backups:", error);
  };

  const loadTableStats = async () => {
    const tableStats: TableInfo[] = [];
    
    for (const tableName of availableTables) {
      try {
        const { count } = await supabase
          .from(tableName as any)
          .select("*", { count: "exact", head: true });
        
        tableStats.push({
          name: tableName,
          rowCount: count || 0,
          columns: []
        });
      } catch (err) {
        tableStats.push({ name: tableName, rowCount: 0, columns: [] });
      }
    }
    
    setTables(tableStats);
  };

  const handleExport = async () => {
    if (selectedTables.length === 0) {
      toast({ title: "Erreur", description: "Sélectionnez au moins une table", variant: "destructive" });
      return;
    }

    setLoading(true);
    const exportData: Record<string, any[]> = {};

    try {
      for (const tableName of selectedTables) {
        const { data, error } = await supabase
          .from(tableName as any)
          .select("*");
        
        if (error) throw error;
        exportData[tableName] = data || [];
      }

      let content: string;
      let filename: string;
      let mimeType: string;

      const timestamp = new Date().toISOString().split("T")[0];
      const name = backupName || `backup_${timestamp}`;

      switch (exportFormat) {
        case "csv":
          // Export each table as separate CSV
          for (const [table, rows] of Object.entries(exportData)) {
            if (rows.length === 0) continue;
            const headers = Object.keys(rows[0]).join(",");
            const csvRows = rows.map(row => 
              Object.values(row).map(val => 
                typeof val === "string" ? `"${val.replace(/"/g, '""')}"` : val
              ).join(",")
            );
            content = [headers, ...csvRows].join("\n");
            downloadFile(content, `${name}_${table}.csv`, "text/csv");
          }
          break;

        case "sql":
          content = "";
          for (const [table, rows] of Object.entries(exportData)) {
            if (rows.length === 0) continue;
            for (const row of rows) {
              const columns = Object.keys(row).join(", ");
              const values = Object.values(row).map(val => 
                val === null ? "NULL" : typeof val === "string" ? `'${val.replace(/'/g, "''")}'` : val
              ).join(", ");
              content += `INSERT INTO ${table} (${columns}) VALUES (${values});\n`;
            }
          }
          downloadFile(content, `${name}.sql`, "text/sql");
          break;

        default: // JSON
          content = JSON.stringify(exportData, null, 2);
          downloadFile(content, `${name}.json`, "application/json");
      }

      // Record backup
      const totalSize = new Blob([JSON.stringify(exportData)]).size;
      await supabase.from("database_backups").insert({
        backup_name: name,
        backup_type: "manual",
        file_format: exportFormat,
        file_size: totalSize,
        tables_included: selectedTables,
        status: "completed"
      });

      loadBackups();
      toast({ title: "Export réussi", description: `${selectedTables.length} table(s) exportée(s)` });
    } catch (error: any) {
      toast({ title: "Erreur d'export", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        for (const [tableName, rows] of Object.entries(data)) {
          if (!availableTables.includes(tableName)) continue;
          if (!Array.isArray(rows) || rows.length === 0) continue;

          // Clear and re-insert (with confirmation in real app)
          const { error } = await supabase
            .from(tableName as any)
            .upsert(rows as any[], { onConflict: "id" });

          if (error) throw error;
        }

        toast({ title: "Import réussi", description: "Données restaurées avec succès" });
        loadTableStats();
      } catch (error: any) {
        toast({ title: "Erreur d'import", description: error.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    reader.readAsText(file);
  };

  const handleDeleteBackup = async (id: string) => {
    const { error } = await supabase.from("database_backups").delete().eq("id", id);
    if (!error) {
      loadBackups();
      toast({ title: "Backup supprimé" });
    }
  };

  const formatBytes = (bytes: number | null) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">
            <Layers className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Vue d'ensemble</span>
            <span className="sm:hidden">Vue</span>
          </TabsTrigger>
          <TabsTrigger value="export" className="text-xs sm:text-sm">
            <Download className="w-4 h-4 mr-1 sm:mr-2" />
            Export
          </TabsTrigger>
          <TabsTrigger value="import" className="text-xs sm:text-sm">
            <Upload className="w-4 h-4 mr-1 sm:mr-2" />
            Import
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs sm:text-sm">
            <Clock className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Historique</span>
            <span className="sm:hidden">Hist.</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid gap-6">
            {/* Schema Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  Schéma de la Base de Données
                </CardTitle>
                <CardDescription>
                  Vue d'ensemble des tables et statistiques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tables.map((table) => (
                    <div
                      key={table.name}
                      className="p-4 rounded-xl border bg-card hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Table2 className="w-4 h-4 text-accent" />
                          <span className="font-semibold text-sm">{table.name}</span>
                        </div>
                        <Badge variant="secondary">{table.rowCount} lignes</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Table Supabase
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Security Info */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{tables.length}</p>
                      <p className="text-sm text-muted-foreground">Tables avec RLS</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <Key className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">4</p>
                      <p className="text-sm text-muted-foreground">Rôles définis</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                      <GitBranch className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{backups.length}</p>
                      <p className="text-sm text-muted-foreground">Sauvegardes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Export Tab */}
        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-primary" />
                Exporter les Données
              </CardTitle>
              <CardDescription>
                Sélectionnez les tables et le format d'export
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Nom de la sauvegarde (optionnel)</Label>
                <Input
                  value={backupName}
                  onChange={(e) => setBackupName(e.target.value)}
                  placeholder="backup_2026_01_12"
                />
              </div>

              <div className="space-y-2">
                <Label>Format d'export</Label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">
                      <span className="flex items-center gap-2">
                        <FileJson className="w-4 h-4" /> JSON
                      </span>
                    </SelectItem>
                    <SelectItem value="csv">
                      <span className="flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4" /> CSV
                      </span>
                    </SelectItem>
                    <SelectItem value="sql">
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4" /> SQL
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tables à exporter</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableTables.map((table) => (
                    <label
                      key={table}
                      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedTables.includes(table)
                          ? "bg-primary/10 border-primary"
                          : "hover:bg-muted"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTables.includes(table)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTables([...selectedTables, table]);
                          } else {
                            setSelectedTables(selectedTables.filter((t) => t !== table));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{table}</span>
                    </label>
                  ))}
                </div>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() =>
                    setSelectedTables(
                      selectedTables.length === availableTables.length ? [] : [...availableTables]
                    )
                  }
                >
                  {selectedTables.length === availableTables.length ? "Désélectionner tout" : "Sélectionner tout"}
                </Button>
              </div>

              <Button onClick={handleExport} disabled={loading || selectedTables.length === 0} className="w-full">
                {loading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Exporter {selectedTables.length} table(s)
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Import Tab */}
        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Importer / Restaurer
              </CardTitle>
              <CardDescription>
                Restaurez les données depuis un fichier JSON
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed rounded-xl p-8 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">Glissez un fichier JSON ici</p>
                <p className="text-sm text-muted-foreground mb-4">ou cliquez pour sélectionner</p>
                <Input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="max-w-xs mx-auto"
                  disabled={loading}
                />
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Attention :</strong> L'import va fusionner les données existantes. Les enregistrements avec le même ID seront mis à jour.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Historique des Sauvegardes
              </CardTitle>
              <CardDescription>
                Liste des exports et restaurations effectués
              </CardDescription>
            </CardHeader>
            <CardContent>
              {backups.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <HardDrive className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune sauvegarde enregistrée</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Taille</TableHead>
                      <TableHead>Tables</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {backups.map((backup) => (
                      <TableRow key={backup.id}>
                        <TableCell className="font-medium">{backup.backup_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{backup.file_format.toUpperCase()}</Badge>
                        </TableCell>
                        <TableCell>{formatBytes(backup.file_size)}</TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {backup.tables_included?.length || 0} tables
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(backup.created_at)}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteBackup(backup.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDatabase;
