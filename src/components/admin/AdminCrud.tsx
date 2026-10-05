import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export type CrudField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "switch" | "select" | "tags";
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  help?: string;
};

type Row = Record<string, unknown>;

interface AdminCrudProps {
  table: string;
  heading: string;
  subtitle?: string;
  fields: CrudField[];
  listColumns: { key: string; label: string }[];
  defaults: Row;
  slugFrom?: string;
  orderBy?: string;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);

const AdminCrud = ({
  table,
  heading,
  subtitle,
  fields,
  listColumns,
  defaults,
  slugFrom,
  orderBy = "sort_order",
}: AdminCrudProps) => {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Row>(defaults);
  const [saving, setSaving] = useState(false);

  const client = supabase as unknown as {
    from: (t: string) => {
      select: (c: string) => { order: (c: string, o: { ascending: boolean }) => Promise<{ data: Row[] | null; error: { message: string } | null }> };
      insert: (v: Row) => Promise<{ error: { message: string } | null }>;
      update: (v: Row) => { eq: (c: string, v: string) => Promise<{ error: { message: string } | null }> };
      delete: () => { eq: (c: string, v: string) => Promise<{ error: { message: string } | null }> };
    };
  };

  const load = async () => {
    setLoading(true);
    const { data, error } = await client.from(table).select("*").order(orderBy, { ascending: true });
    if (error) toast({ title: "Chargement impossible", description: error.message, variant: "destructive" });
    setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  const startCreate = () => {
    setEditing(null);
    setForm(defaults);
    setOpen(true);
  };

  const startEdit = (row: Row) => {
    setEditing(row);
    setForm({ ...defaults, ...row });
    setOpen(true);
  };

  const setValue = (name: string, value: unknown) => setForm((f) => ({ ...f, [name]: value }));

  const save = async () => {
    setSaving(true);
    const payload: Row = {};
    for (const f of fields) {
      let v = form[f.name];
      if (f.type === "number") v = v === "" || v == null ? null : Number(v);
      if (f.type === "tags") {
        v = Array.isArray(v)
          ? v
          : String(v ?? "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
      }
      if (f.type === "text" || f.type === "textarea") v = v === "" ? null : v;
      payload[f.name] = v;
    }
    if (slugFrom && !editing) {
      payload.slug = slugify(String(form[slugFrom] ?? "")) || `item-${Date.now()}`;
    }
    const res = editing
      ? await client.from(table).update(payload).eq("id", String(editing.id))
      : await client.from(table).insert(payload);
    setSaving(false);
    if (res.error) {
      toast({ title: "Enregistrement impossible", description: res.error.message, variant: "destructive" });
      return;
    }
    toast({ title: editing ? "Modifié" : "Ajouté" });
    setOpen(false);
    void load();
  };

  const togglePublish = async (row: Row) => {
    const { error } = await client
      .from(table)
      .update({ is_published: !row.is_published })
      .eq("id", String(row.id));
    if (error) toast({ title: "Action impossible", description: error.message, variant: "destructive" });
    else void load();
  };

  const remove = async (row: Row) => {
    if (!window.confirm("Supprimer définitivement cet élément ?")) return;
    const { error } = await client.from(table).delete().eq("id", String(row.id));
    if (error) toast({ title: "Suppression impossible", description: error.message, variant: "destructive" });
    else void load();
  };

  const display = (row: Row, key: string) => {
    const v = row[key];
    if (Array.isArray(v)) return v.join(", ");
    if (typeof v === "boolean") return v ? "Oui" : "Non";
    if (v == null) return "—";
    if (typeof v === "object") return "—";
    return String(v);
  };

  const count = useMemo(() => rows.length, [rows]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>{heading}</CardTitle>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
          <Badge variant="secondary" className="mt-2">{count} élément(s)</Badge>
        </div>
        <Button onClick={startCreate}>
          <Plus className="h-4 w-4 mr-2" /> Ajouter
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Chargement…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Aucun élément pour le moment.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {listColumns.map((c) => (
                    <TableHead key={c.key}>{c.label}</TableHead>
                  ))}
                  <TableHead>Publié</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={String(row.id)}>
                    {listColumns.map((c) => (
                      <TableCell key={c.key} className="max-w-[240px] truncate">
                        {display(row, c.key)}
                      </TableCell>
                    ))}
                    <TableCell>
                      <Badge variant={row.is_published ? "default" : "secondary"}>
                        {row.is_published ? "En ligne" : "Brouillon"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <Button variant="ghost" size="icon" onClick={() => togglePublish(row)} title="Publier / dépublier">
                        {row.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => startEdit(row)} title="Modifier">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => remove(row)} title="Supprimer">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? `Modifier — ${heading}` : `Ajouter — ${heading}`}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {fields.map((f) => {
              const value = form[f.name];
              return (
                <div key={f.name} className="space-y-2">
                  <Label htmlFor={f.name}>{f.label}</Label>
                  {f.type === "textarea" && (
                    <Textarea
                      id={f.name}
                      rows={4}
                      value={String(value ?? "")}
                      placeholder={f.placeholder}
                      onChange={(e) => setValue(f.name, e.target.value)}
                    />
                  )}
                  {(f.type === "text" || f.type === "number") && (
                    <Input
                      id={f.name}
                      type={f.type === "number" ? "number" : "text"}
                      value={value == null ? "" : String(value)}
                      placeholder={f.placeholder}
                      onChange={(e) => setValue(f.name, e.target.value)}
                    />
                  )}
                  {f.type === "tags" && (
                    <Input
                      id={f.name}
                      value={Array.isArray(value) ? value.join(", ") : String(value ?? "")}
                      placeholder={f.placeholder ?? "séparés par des virgules"}
                      onChange={(e) => setValue(f.name, e.target.value)}
                    />
                  )}
                  {f.type === "switch" && (
                    <div className="flex items-center gap-3">
                      <Switch id={f.name} checked={Boolean(value)} onCheckedChange={(v) => setValue(f.name, v)} />
                      <span className="text-sm text-muted-foreground">{Boolean(value) ? "Oui" : "Non"}</span>
                    </div>
                  )}
                  {f.type === "select" && (
                    <Select value={String(value ?? "")} onValueChange={(v) => setValue(f.name, v)}>
                      <SelectTrigger id={f.name}>
                        <SelectValue placeholder="Choisir" />
                      </SelectTrigger>
                      <SelectContent>
                        {(f.options ?? []).map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {f.help && <p className="text-xs text-muted-foreground">{f.help}</p>}
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdminCrud;
