import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Check, Edit3, FolderPlus, Image as ImageIcon, Plus, RefreshCw, Save, Trash2 } from "lucide-react";

type Category = { id:string; slug:string; title:string; subtitle:string|null; icon:string|null; is_published:boolean; sort_order:number };
type Service = { id:string; category_id:string|null; slug:string; title:string; description:string|null; price:number|null; price_note:string|null; bullets:string[]; image_url:string|null; delivery_note:string|null; is_orderable:boolean; is_published:boolean; is_featured:boolean; sort_order:number };
const db = supabase as any;
const emptyService = { category_id:"", slug:"", title:"", description:"", price:"", price_note:"", bullets:"", image_url:"", delivery_note:"", is_orderable:true, is_published:true, is_featured:false, sort_order:0 };
const emptyCategory = { slug:"", title:"", subtitle:"", icon:"web", is_published:true, sort_order:0 };
const slugify = (v:string) => v.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");

export default function AdminBoutique() {
  const { toast } = useToast();
  const [categories,setCategories] = useState<Category[]>([]);
  const [services,setServices] = useState<Service[]>([]);
  const [loading,setLoading] = useState(true);
  const [serviceDialog,setServiceDialog] = useState(false);
  const [categoryDialog,setCategoryDialog] = useState(false);
  const [editingService,setEditingService] = useState<Service|null>(null);
  const [editingCategory,setEditingCategory] = useState<Category|null>(null);
  const [serviceForm,setServiceForm] = useState(emptyService);
  const [categoryForm,setCategoryForm] = useState(emptyCategory);
  const [filter,setFilter] = useState("all");
  const [search,setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    const [a,b] = await Promise.all([
      db.from("service_categories").select("*").order("sort_order",{ascending:true}),
      db.from("services").select("*").order("sort_order",{ascending:true})
    ]);
    if (a.error || b.error) toast({title:"Catalogue inaccessible",description:(a.error || b.error)?.message,variant:"destructive"});
    setCategories(a.data || []);
    setServices(b.data || []);
    setLoading(false);
  };
  useEffect(()=>{ void load(); },[]);

  const filtered = useMemo(() => {
    const q=search.trim().toLowerCase();
    return services.filter(s => (filter==="all" || s.category_id===filter) && (!q || (s.title+" "+s.slug+" "+(s.description||"")).toLowerCase().includes(q)));
  },[services,filter,search]);

  const openNewService=()=>{setEditingService(null);setServiceForm({...emptyService,category_id:categories[0]?.id||""});setServiceDialog(true);};
  const openEditService=(s:Service)=>{
    setEditingService(s);
    setServiceForm({
      category_id:s.category_id||"",slug:s.slug,title:s.title,description:s.description||"",
      price:s.price==null?"":String(s.price),price_note:s.price_note||"",bullets:(s.bullets||[]).join("\n"),
      image_url:s.image_url||"",delivery_note:s.delivery_note||"",is_orderable:s.is_orderable,
      is_published:s.is_published,is_featured:s.is_featured,sort_order:s.sort_order
    });
    setServiceDialog(true);
  };

  const saveService=async()=>{
    if(!serviceForm.title.trim() || !serviceForm.category_id){toast({title:"Titre et catégorie obligatoires",variant:"destructive"});return;}
    const payload={
      category_id:serviceForm.category_id,slug:serviceForm.slug.trim()||slugify(serviceForm.title),title:serviceForm.title.trim(),
      description:serviceForm.description.trim()||null,price:serviceForm.price===""?null:Number(serviceForm.price),
      price_note:serviceForm.price_note.trim()||null,bullets:serviceForm.bullets.split("\n").map((x:string)=>x.trim()).filter(Boolean),
      image_url:serviceForm.image_url.trim()||null,delivery_note:serviceForm.delivery_note.trim()||null,
      is_orderable:serviceForm.is_orderable,is_published:serviceForm.is_published,is_featured:serviceForm.is_featured,
      sort_order:Number(serviceForm.sort_order)||0
    };
    const q=editingService?db.from("services").update(payload).eq("id",editingService.id):db.from("services").insert(payload);
    const {error}=await q;
    if(error){toast({title:"Enregistrement impossible",description:error.message,variant:"destructive"});return;}
    toast({title:editingService?"Prestation mise à jour":"Prestation créée"});setServiceDialog(false);await load();
  };

  const deleteService=async(s:Service)=>{
    if(!window.confirm("Supprimer « "+s.title+" » ?"))return;
    const {error}=await db.from("services").delete().eq("id",s.id);
    if(error)toast({title:"Suppression impossible",description:error.message,variant:"destructive"});else{toast({title:"Prestation supprimée"});await load();}
  };

  const toggleService=async(s:Service,field:"is_published"|"is_orderable"|"is_featured")=>{
    const {error}=await db.from("services").update({[field]:!s[field]}).eq("id",s.id);
    if(error)toast({title:"Modification impossible",description:error.message,variant:"destructive"});else await load();
  };

  const openNewCategory=()=>{setEditingCategory(null);setCategoryForm(emptyCategory);setCategoryDialog(true);};
  const openEditCategory=(c:Category)=>{setEditingCategory(c);setCategoryForm({slug:c.slug,title:c.title,subtitle:c.subtitle||"",icon:c.icon||"web",is_published:c.is_published,sort_order:c.sort_order});setCategoryDialog(true);};
  const saveCategory=async()=>{
    if(!categoryForm.title.trim()){toast({title:"Nom de catégorie obligatoire",variant:"destructive"});return;}
    const payload={slug:categoryForm.slug.trim()||slugify(categoryForm.title),title:categoryForm.title.trim(),subtitle:categoryForm.subtitle.trim()||null,icon:categoryForm.icon||"web",is_published:categoryForm.is_published,sort_order:Number(categoryForm.sort_order)||0};
    const q=editingCategory?db.from("service_categories").update(payload).eq("id",editingCategory.id):db.from("service_categories").insert(payload);
    const {error}=await q;
    if(error){toast({title:"Enregistrement impossible",description:error.message,variant:"destructive"});return;}
    toast({title:editingCategory?"Catégorie mise à jour":"Catégorie créée"});setCategoryDialog(false);await load();
  };

  const deleteCategory=async(c:Category)=>{
    const count=services.filter(s=>s.category_id===c.id).length;
    if(count){toast({title:"Catégorie non vide",description:String(count)+" prestation(s) utilisent encore cette catégorie.",variant:"destructive"});return;}
    if(!window.confirm("Supprimer « "+c.title+" » ?"))return;
    const {error}=await db.from("service_categories").delete().eq("id",c.id);
    if(error)toast({title:"Suppression impossible",description:error.message,variant:"destructive"});else{toast({title:"Catégorie supprimée"});await load();}
  };

  const price=(v:number|null,n:string|null)=>v==null?(n||"Sur devis"):(n?n+" ":"")+new Intl.NumberFormat("fr-FR").format(v)+" FCFA";

  return <div className="space-y-6">
    <div className="rounded-2xl bg-gradient-to-br from-primary via-primary/95 to-accent/80 p-6 text-primary-foreground shadow-lg">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div><p className="text-xs font-semibold uppercase tracking-[0.22em] opacity-70">Commerce digital</p><h1 className="mt-2 text-2xl font-bold sm:text-3xl">Boutique & commandes</h1><p className="mt-2 max-w-2xl text-sm opacity-80">Gérez le catalogue public sans modifier le code : catégories, prestations, prix, visuels, publication et disponibilité.</p></div>
        <div className="flex flex-wrap gap-2"><Button variant="secondary" onClick={()=>void load()}><RefreshCw className="mr-2 h-4 w-4"/>Actualiser</Button><Button onClick={openNewCategory} className="bg-white text-primary hover:bg-white/90"><FolderPlus className="mr-2 h-4 w-4"/>Catégorie</Button><Button onClick={openNewService} className="bg-accent text-accent-foreground hover:bg-accent/90"><Plus className="mr-2 h-4 w-4"/>Prestation</Button></div>
      </div>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Catégories",categories.length],["Prestations",services.length],["Publiées",services.filter(s=>s.is_published).length],["Commandables",services.filter(s=>s.is_orderable&&s.is_published).length]].map(([l,v])=><Card key={String(l)}><CardContent className="p-5"><p className="text-sm text-muted-foreground">{l}</p><p className="mt-1 text-3xl font-bold">{v}</p></CardContent></Card>)}</div>

    <Card><CardHeader><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><CardTitle>Catalogue</CardTitle><CardDescription>Chaque modification est enregistrée dans le catalogue central de la boutique.</CardDescription></div><div className="flex flex-col gap-2 sm:flex-row"><Input className="sm:w-72" placeholder="Rechercher…" value={search} onChange={e=>setSearch(e.target.value)}/><Select value={filter} onValueChange={setFilter}><SelectTrigger className="sm:w-56"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="all">Toutes les catégories</SelectItem>{categories.map(c=><SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}</SelectContent></Select></div></div></CardHeader>
      <CardContent>{loading?<p className="py-12 text-center text-muted-foreground">Chargement du catalogue…</p>:<div className="grid gap-3">{filtered.map(s=>{const c=categories.find(x=>x.id===s.category_id);return <div key={s.id} className="flex flex-col gap-4 rounded-xl border p-4 md:flex-row md:items-center">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">{s.image_url?<img src={s.image_url} alt="" className="h-full w-full object-cover" onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src="/images/agricapital-poster.jpg";}}/>:<ImageIcon className="h-5 w-5 text-muted-foreground"/>}</div>
        <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{s.title}</h3>{s.is_featured&&<Badge>À la une</Badge>}{!s.is_published&&<Badge variant="secondary">Brouillon</Badge>}</div><p className="mt-1 text-xs text-muted-foreground">{c?.title||"Sans catégorie"} · {s.slug}</p><p className="mt-1 text-sm font-medium">{price(s.price,s.price_note)}</p></div>
        <div className="flex flex-wrap items-center gap-2"><Button size="sm" variant={s.is_published?"default":"outline"} onClick={()=>void toggleService(s,"is_published")}>{s.is_published&&<Check className="mr-1 h-4 w-4"/>}{s.is_published?"Publié":"Publier"}</Button><Button size="sm" variant="outline" onClick={()=>void toggleService(s,"is_orderable")}>{s.is_orderable?"Commandable":"Indisponible"}</Button><Button size="sm" variant="ghost" onClick={()=>openEditService(s)}><Edit3 className="h-4 w-4"/></Button><Button size="sm" variant="ghost" className="text-destructive" onClick={()=>void deleteService(s)}><Trash2 className="h-4 w-4"/></Button></div>
      </div>})}{!filtered.length&&<p className="py-12 text-center text-sm text-muted-foreground">Aucune prestation trouvée.</p>}</div>}</CardContent>
    </Card>

    <Card><CardHeader className="flex flex-row items-center justify-between"><div><CardTitle>Catégories</CardTitle><CardDescription>Organisation et visibilité des rubriques.</CardDescription></div><Button variant="outline" onClick={openNewCategory}><Plus className="mr-2 h-4 w-4"/>Ajouter</Button></CardHeader><CardContent><div className="grid gap-3 md:grid-cols-2">{categories.map(c=><div key={c.id} className="flex items-center gap-3 rounded-xl border p-4"><div className="flex-1"><p className="font-semibold">{c.title}</p><p className="text-xs text-muted-foreground">{c.slug} · ordre {c.sort_order}</p></div><Badge variant={c.is_published?"default":"secondary"}>{c.is_published?"Visible":"Masquée"}</Badge><Button size="sm" variant="ghost" onClick={()=>openEditCategory(c)}><Edit3 className="h-4 w-4"/></Button><Button size="sm" variant="ghost" className="text-destructive" onClick={()=>void deleteCategory(c)}><Trash2 className="h-4 w-4"/></Button></div>)}</div></CardContent></Card>

    <Dialog open={serviceDialog} onOpenChange={setServiceDialog}><DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto"><DialogHeader><DialogTitle>{editingService?"Modifier la prestation":"Nouvelle prestation"}</DialogTitle><DialogDescription>Tout ce qui est défini ici peut être affiché sur la boutique publique.</DialogDescription></DialogHeader>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2"><Label>Nom *</Label><Input value={serviceForm.title} onChange={e=>setServiceForm({...serviceForm,title:e.target.value})}/></div>
        <div><Label>Catégorie *</Label><Select value={serviceForm.category_id} onValueChange={v=>setServiceForm({...serviceForm,category_id:v})}><SelectTrigger><SelectValue placeholder="Choisir"/></SelectTrigger><SelectContent>{categories.map(c=><SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}</SelectContent></Select></div>
        <div><Label>Slug</Label><Input value={serviceForm.slug} onChange={e=>setServiceForm({...serviceForm,slug:e.target.value})} placeholder="auto-généré si vide"/></div>
        <div className="sm:col-span-2"><Label>Description</Label><Textarea rows={3} value={serviceForm.description} onChange={e=>setServiceForm({...serviceForm,description:e.target.value})}/></div>
        <div><Label>Prix (FCFA)</Label><Input type="number" min="0" value={serviceForm.price} onChange={e=>setServiceForm({...serviceForm,price:e.target.value})} placeholder="Vide = sur devis"/></div>
        <div><Label>Libellé prix</Label><Input value={serviceForm.price_note} onChange={e=>setServiceForm({...serviceForm,price_note:e.target.value})} placeholder="À partir de / Sur devis…"/></div>
        <div className="sm:col-span-2"><Label>Points clés</Label><Textarea rows={4} value={serviceForm.bullets} onChange={e=>setServiceForm({...serviceForm,bullets:e.target.value})} placeholder="Un point par ligne"/></div>
        <div className="sm:col-span-2"><Label>Image URL</Label><Input value={serviceForm.image_url} onChange={e=>setServiceForm({...serviceForm,image_url:e.target.value})} placeholder="/images/... ou URL publique"/></div>
        <div className="sm:col-span-2"><Label>Délai / précision</Label><Input value={serviceForm.delivery_note} onChange={e=>setServiceForm({...serviceForm,delivery_note:e.target.value})} placeholder="Ex. Livraison sous 7 jours"/></div>
        <div><Label>Ordre d'affichage</Label><Input type="number" value={serviceForm.sort_order} onChange={e=>setServiceForm({...serviceForm,sort_order:Number(e.target.value)})}/></div>
        <div className="sm:col-span-2 grid gap-3 rounded-xl border p-4 sm:grid-cols-3"><label className="flex items-center justify-between gap-3"><span className="text-sm font-medium">Publié</span><Switch checked={serviceForm.is_published} onCheckedChange={v=>setServiceForm({...serviceForm,is_published:v})}/></label><label className="flex items-center justify-between gap-3"><span className="text-sm font-medium">Commandable</span><Switch checked={serviceForm.is_orderable} onCheckedChange={v=>setServiceForm({...serviceForm,is_orderable:v})}/></label><label className="flex items-center justify-between gap-3"><span className="text-sm font-medium">À la une</span><Switch checked={serviceForm.is_featured} onCheckedChange={v=>setServiceForm({...serviceForm,is_featured:v})}/></label></div>
      </div>
      <DialogFooter><Button variant="outline" onClick={()=>setServiceDialog(false)}>Annuler</Button><Button onClick={()=>void saveService()}><Save className="mr-2 h-4 w-4"/>Enregistrer</Button></DialogFooter>
    </DialogContent></Dialog>

    <Dialog open={categoryDialog} onOpenChange={setCategoryDialog}><DialogContent><DialogHeader><DialogTitle>{editingCategory?"Modifier la catégorie":"Nouvelle catégorie"}</DialogTitle></DialogHeader><div className="grid gap-4"><div><Label>Nom *</Label><Input value={categoryForm.title} onChange={e=>setCategoryForm({...categoryForm,title:e.target.value})}/></div><div><Label>Slug</Label><Input value={categoryForm.slug} onChange={e=>setCategoryForm({...categoryForm,slug:e.target.value})} placeholder="auto-généré si vide"/></div><div><Label>Sous-titre</Label><Textarea rows={3} value={categoryForm.subtitle} onChange={e=>setCategoryForm({...categoryForm,subtitle:e.target.value})}/></div><div><Label>Icône</Label><Input value={categoryForm.icon} onChange={e=>setCategoryForm({...categoryForm,icon:e.target.value})}/></div><div><Label>Ordre</Label><Input type="number" value={categoryForm.sort_order} onChange={e=>setCategoryForm({...categoryForm,sort_order:Number(e.target.value)})}/></div><label className="flex items-center justify-between rounded-xl border p-4"><span className="text-sm font-medium">Visible dans la boutique</span><Switch checked={categoryForm.is_published} onCheckedChange={v=>setCategoryForm({...categoryForm,is_published:v})}/></label></div><DialogFooter><Button variant="outline" onClick={()=>setCategoryDialog(false)}>Annuler</Button><Button onClick={()=>void saveCategory()}><Save className="mr-2 h-4 w-4"/>Enregistrer</Button></DialogFooter></DialogContent></Dialog>
  </div>;
}
