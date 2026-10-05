import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Users } from "lucide-react";
import { formatFcfa } from "@/hooks/useSiteContent";

type Order={user_id:string|null;customer_name:string;customer_email:string;customer_phone:string|null;amount:number;status:string;payment_status:string;created_at:string};
type Client={key:string;name:string;email:string;phone:string|null;orders:number;paid:number;last:string};
export default function AdminClients(){
 const [orders,setOrders]=useState<Order[]>([]);const [loading,setLoading]=useState(true);
 const load=async()=>{setLoading(true);const {data,error}=await (supabase as any).from("service_orders").select("user_id,customer_name,customer_email,customer_phone,amount,status,payment_status,created_at").order("created_at",{ascending:false});if(!error)setOrders((data||[]) as Order[]);setLoading(false)};useEffect(()=>{void load()},[]);
 const clients=useMemo(()=>{const map=new Map<string,Client>();for(const o of orders){const key=o.user_id||o.customer_email.toLowerCase();const cur=map.get(key)||{key,name:o.customer_name,email:o.customer_email,phone:o.customer_phone,orders:0,paid:0,last:o.created_at};cur.orders++;cur.paid+=["acompte","paye"].includes(o.payment_status)?Number(o.amount||0):0;if(new Date(o.created_at)>new Date(cur.last))cur.last=o.created_at;map.set(key,cur)}return [...map.values()]},[orders]);
 return <Card><CardHeader className="flex flex-row items-center justify-between"><div><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5"/>Clients</CardTitle><p className="mt-1 text-sm text-muted-foreground">Clients déduits des commandes réelles, sans dupliquer les contacts.</p></div><Button variant="outline" onClick={()=>void load()}><RefreshCw className="mr-2 h-4 w-4"/>Actualiser</Button></CardHeader><CardContent>{loading?<p className="py-8 text-center text-muted-foreground">Chargement…</p>:!clients.length?<p className="py-8 text-center text-muted-foreground">Aucun client pour le moment.</p>:<div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-left"><th className="p-3">Client</th><th className="p-3">Commandes</th><th className="p-3">Montant payé</th><th className="p-3">Dernière activité</th></tr></thead><tbody>{clients.map(c=><tr key={c.key} className="border-b"><td className="p-3"><p className="font-medium">{c.name}</p><p className="text-xs text-muted-foreground">{c.email}{c.phone?" · "+c.phone:""}</p></td><td className="p-3"><Badge variant="secondary">{c.orders}</Badge></td><td className="p-3">{formatFcfa(c.paid)}</td><td className="p-3 text-muted-foreground">{new Date(c.last).toLocaleDateString("fr-FR")}</td></tr>)}</tbody></table></div>}</CardContent></Card>;
}