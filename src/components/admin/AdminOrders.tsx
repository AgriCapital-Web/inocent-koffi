import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { formatFcfa } from "@/hooks/useSiteContent";
import { Trash2, RefreshCw, Plus } from "lucide-react";

type Order = {
  id: string;
  order_number: string | null;
  service_title: string;
  service_slug: string | null;
  amount: number;
  currency: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  message: string | null;
  options: Record<string, unknown> | null;
  status: string;
  payment_status: string;
  payment_provider: string | null;
  internal_notes: string | null;
  created_at: string;
};

type Payment = {
  id: string;
  order_id: string;
  provider: string;
  provider_ref: string | null;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
};

export const ORDER_STATUS = [
  { value: "nouvelle", label: "Nouvelle" },
  { value: "en_discussion", label: "En discussion" },
  { value: "validee", label: "Validée" },
  { value: "en_production", label: "En production" },
  { value: "livree", label: "Livrée" },
  { value: "annulee", label: "Annulée" },
];

export const PAYMENT_STATUS = [
  { value: "en_attente", label: "En attente" },
  { value: "acompte", label: "Acompte reçu" },
  { value: "paye", label: "Payé" },
  { value: "rembourse", label: "Remboursé" },
];

const statusVariant = (s: string) =>
  s === "livree" || s === "paye" ? "default" : s === "annulee" ? "destructive" : "secondary";

const db = supabase as unknown as {
  from: (t: string) => any;
};

const fr = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

/** Onglet Commandes : suivi et mise à jour des demandes de services. */
export const AdminOrders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);
  const [notes, setNotes] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await db.from("service_orders").select("*").order("created_at", { ascending: false });
    if (error) toast({ title: "Chargement impossible", description: error.message, variant: "destructive" });
    setOrders((data ?? []) as Order[]);
    setLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = async (id: string, patch: Partial<Order>) => {
    const { error } = await db.from("service_orders").update(patch).eq("id", id);
    if (error) {
      toast({ title: "Mise à jour impossible", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Commande mise à jour" });
    void load();
  };

  const remove = async (id: string) => {
    if (!window.confirm("Supprimer cette commande ?")) return;
    const { error } = await db.from("service_orders").delete().eq("id", id);
    if (error) toast({ title: "Suppression impossible", description: error.message, variant: "destructive" });
    else void load();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Commandes</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Demandes de services reçues depuis le site, avec statut de traitement et de paiement.
          </p>
          <Badge variant="secondary" className="mt-2">{orders.length} commande(s)</Badge>
        </div>
        <Button variant="outline" onClick={() => void load()}>
          <RefreshCw className="h-4 w-4 mr-2" /> Rafraîchir
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Chargement…</p>
        ) : orders.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Aucune commande pour le moment.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N°</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Paiement</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs">{o.order_number ?? "—"}</TableCell>
                    <TableCell className="text-xs">{fr(o.created_at)}</TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{o.customer_name}</div>
                      <div className="text-xs text-muted-foreground">{o.customer_email}</div>
                    </TableCell>
                    <TableCell className="max-w-[220px] truncate text-sm">{o.service_title}</TableCell>
                    <TableCell className="text-sm">{o.amount ? formatFcfa(Number(o.amount)) : "Sur devis"}</TableCell>
                    <TableCell>
                      <Select value={o.status} onValueChange={(v) => void update(o.id, { status: v })}>
                        <SelectTrigger className="h-8 w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ORDER_STATUS.map((s) => (
                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select value={o.payment_status} onValueChange={(v) => void update(o.id, { payment_status: v })}>
                        <SelectTrigger className="h-8 w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PAYMENT_STATUS.map((s) => (
                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelected(o);
                          setNotes(o.internal_notes ?? "");
                        }}
                      >
                        Détail
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => void remove(o.id)}>
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

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Commande {selected?.order_number ?? ""}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <p><strong>Service :</strong> {selected.service_title}</p>
              <p><strong>Montant :</strong> {selected.amount ? formatFcfa(Number(selected.amount)) : "Sur devis"}</p>
              <p><strong>Client :</strong> {selected.customer_name} — {selected.customer_email}</p>
              {selected.customer_phone && <p><strong>Téléphone :</strong> {selected.customer_phone}</p>}
              {selected.payment_provider && <p><strong>Moyen de paiement choisi :</strong> {selected.payment_provider}</p>}
              {selected.message && (
                <div>
                  <strong>Brief du client :</strong>
                  <p className="mt-1 whitespace-pre-wrap text-muted-foreground">{selected.message}</p>
                </div>
              )}
              {selected.options && Object.keys(selected.options).length > 0 && (
                <div>
                  <strong>Options :</strong>
                  <ul className="mt-1 list-disc pl-5 text-muted-foreground">
                    {Object.entries(selected.options).map(([k, v]) => (
                      <li key={k}>{k} : {String(v)}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <Label htmlFor="notes">Notes internes</Label>
                <Textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={async () => {
                if (selected) await update(selected.id, { internal_notes: notes });
                setSelected(null);
              }}
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

/** Onglet Clients : synthèse des clients issus des commandes. */
export const AdminClients = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    void (async () => {
      const { data } = await db.from("service_orders").select("*").order("created_at", { ascending: false });
      setOrders((data ?? []) as Order[]);
      setLoading(false);
    })();
  }, []);

  const clients = useMemo(() => {
    const map = new Map<string, { name: string; email: string; phone: string | null; count: number; total: number; last: string }>();
    for (const o of orders) {
      const key = o.customer_email.toLowerCase();
      const prev = map.get(key);
      map.set(key, {
        name: o.customer_name,
        email: o.customer_email,
        phone: o.customer_phone ?? prev?.phone ?? null,
        count: (prev?.count ?? 0) + 1,
        total: (prev?.total ?? 0) + Number(o.amount || 0),
        last: prev?.last ?? o.created_at,
      });
    }
    const list = [...map.values()];
    const q = search.trim().toLowerCase();
    return q ? list.filter((c) => `${c.name} ${c.email} ${c.phone ?? ""}`.toLowerCase().includes(q)) : list;
  }, [orders, search]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clients</CardTitle>
        <p className="text-sm text-muted-foreground">Chaque personne ayant passé une commande, avec son historique.</p>
        <Input
          placeholder="Rechercher un client…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-3 max-w-sm"
        />
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Chargement…</p>
        ) : clients.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Aucun client pour le moment.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Commandes</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Dernière</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((c) => (
                  <TableRow key={c.email}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="text-sm">{c.email}</TableCell>
                    <TableCell className="text-sm">{c.phone ?? "—"}</TableCell>
                    <TableCell>{c.count}</TableCell>
                    <TableCell>{c.total ? formatFcfa(c.total) : "—"}</TableCell>
                    <TableCell className="text-xs">{fr(c.last)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/** Onglet Paiements : encaissements liés aux commandes. */
export const AdminPayments = () => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ order_id: "", provider: "kkiapay", provider_ref: "", amount: "", status: "paye" });

  const load = async () => {
    setLoading(true);
    const [{ data: p }, { data: o }] = await Promise.all([
      db.from("order_payments").select("*").order("created_at", { ascending: false }),
      db.from("service_orders").select("*").order("created_at", { ascending: false }),
    ]);
    setPayments((p ?? []) as Payment[]);
    setOrders((o ?? []) as Order[]);
    setLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const orderLabel = (id: string) => {
    const o = orders.find((x) => x.id === id);
    return o ? `${o.order_number ?? ""} — ${o.customer_name}` : id.slice(0, 8);
  };

  const save = async () => {
    if (!form.order_id) {
      toast({ title: "Choisissez une commande", variant: "destructive" });
      return;
    }
    const { error } = await db.from("order_payments").insert({
      order_id: form.order_id,
      provider: form.provider,
      provider_ref: form.provider_ref || null,
      amount: Number(form.amount || 0),
      status: form.status,
    });
    if (error) {
      toast({ title: "Enregistrement impossible", description: error.message, variant: "destructive" });
      return;
    }
    if (form.status === "paye") {
      await db.from("service_orders").update({ payment_status: "paye", payment_provider: form.provider }).eq("id", form.order_id);
    }
    toast({ title: "Paiement enregistré" });
    setOpen(false);
    setForm({ order_id: "", provider: "kkiapay", provider_ref: "", amount: "", status: "paye" });
    void load();
  };

  const remove = async (id: string) => {
    if (!window.confirm("Supprimer ce paiement ?")) return;
    const { error } = await db.from("order_payments").delete().eq("id", id);
    if (error) toast({ title: "Suppression impossible", description: error.message, variant: "destructive" });
    else void load();
  };

  const total = payments.filter((p) => p.status === "paye").reduce((s, p) => s + Number(p.amount || 0), 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Paiements</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Encaissements KKiaPay, Stripe, virement ou espèces, rattachés à une commande.
          </p>
          <Badge variant="secondary" className="mt-2">Encaissé : {formatFcfa(total)}</Badge>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Enregistrer un paiement
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Chargement…</p>
        ) : payments.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Aucun paiement enregistré.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Commande</TableHead>
                  <TableHead>Moyen</TableHead>
                  <TableHead>Référence</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="text-xs">{fr(p.created_at)}</TableCell>
                    <TableCell className="text-sm">{orderLabel(p.order_id)}</TableCell>
                    <TableCell className="text-sm capitalize">{p.provider}</TableCell>
                    <TableCell className="font-mono text-xs">{p.provider_ref ?? "—"}</TableCell>
                    <TableCell className="text-sm">{formatFcfa(Number(p.amount || 0))}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(p.status)}>{p.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" onClick={() => void remove(p.id)}>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enregistrer un paiement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Commande</Label>
              <Select value={form.order_id} onValueChange={(v) => setForm((f) => ({ ...f, order_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Choisir une commande" /></SelectTrigger>
                <SelectContent>
                  {orders.map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.order_number ?? o.id.slice(0, 8)} — {o.customer_name} — {o.service_title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Moyen de paiement</Label>
              <Select value={form.provider} onValueChange={(v) => setForm((f) => ({ ...f, provider: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="kkiapay">KKiaPay (Mobile Money)</SelectItem>
                  <SelectItem value="stripe">Stripe (carte, international)</SelectItem>
                  <SelectItem value="virement">Virement bancaire</SelectItem>
                  <SelectItem value="especes">Espèces</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="ref">Référence de transaction</Label>
              <Input id="ref" value={form.provider_ref} onChange={(e) => setForm((f) => ({ ...f, provider_ref: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="amount">Montant (FCFA)</Label>
              <Input id="amount" type="number" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} />
            </div>
            <div>
              <Label>Statut</Label>
              <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="paye">Payé</SelectItem>
                  <SelectItem value="en_attente">En attente</SelectItem>
                  <SelectItem value="echec">Échec</SelectItem>
                  <SelectItem value="rembourse">Remboursé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => void save()}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdminOrders;
