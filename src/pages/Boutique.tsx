import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check, Code2, Film, Music2, Sparkles, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useShopCatalog, servicePriceLabel, type ShopCategory, type ServiceRow } from "@/hooks/useSiteContent";

const icons = { web: Code2, video: Film, audio: Music2, ia: Sparkles };

const Boutique = () => {
  const { data: categories = [], isLoading, isError } = useShopCatalog();
  const [category, setCategory] = useState("all");
  const visible = useMemo(() => category === "all" ? categories : categories.filter(c => c.id === category), [categories, category]);

  return <>
    <Helmet>
      <title>Boutique digitale | Services Web, IA, Vidéo & Audio — Inocent KOFFI</title>
      <meta name="description" content="Découvrez et commandez les prestations numériques d’Inocent KOFFI : web, applications, IA, vidéo, audio et automatisation." />
      <link rel="canonical" href="https://ikoffi.agricapital.ci/boutique" />
    </Helmet>
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <section className="relative overflow-hidden px-4 py-16 sm:py-24" style={{ background: "var(--gradient-visionary)" }}>
          <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_15%_15%,hsl(var(--gold))_0%,transparent_35%),radial-gradient(circle_at_85%_85%,hsl(var(--terracotta))_0%,transparent_38%)]" />
          <div className="relative mx-auto max-w-6xl text-primary-foreground">
            <Badge className="border-white/20 bg-white/10 text-white">Boutique digitale</Badge>
            <h1 className="mt-5 max-w-4xl font-display text-4xl font-extrabold tracking-tight sm:text-6xl">Une idée. Un produit. <span className="text-accent">En ligne.</span></h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">Des prestations configurables et actualisées depuis l’administration : web, IA, vidéo, audio et solutions sur mesure.</p>
            <div className="mt-7 flex flex-wrap gap-3"><Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90"><Link to="/commande">Démarrer une commande <ArrowRight className="ml-2 h-4 w-4"/></Link></Button><Button asChild variant="outline" className="border-white/25 bg-white/5 text-white hover:bg-white/10"><Link to="/realisations">Voir les réalisations</Link></Button></div>
          </div>
        </section>

        {isLoading && <section className="mx-auto max-w-6xl px-4 py-20 text-center text-muted-foreground">Chargement de la boutique…</section>}
        {isError && <section className="mx-auto max-w-6xl px-4 py-20 text-center"><h2 className="font-display text-xl font-bold">La boutique est momentanément indisponible.</h2><p className="mt-2 text-sm text-muted-foreground">Veuillez réessayer dans quelques instants.</p></section>}

        {!isLoading && !isError && <>
          <section className="sticky top-16 z-30 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl sm:top-20">
            <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto">
              {[{id:"all",title:"Tout"},...categories].map(c=><button key={c.id} type="button" onClick={()=>setCategory(c.id)} className={"whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all "+(category===c.id?"border-primary bg-primary text-primary-foreground":"border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground")}>{c.title}</button>)}
            </div>
          </section>
          <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
            {visible.map((cat,index)=><CategorySection key={cat.id} category={cat} index={index}/>)}
            {!categories.length && <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">Aucune prestation publiée pour le moment.</div>}
          </section>
        </>}

        <section className="border-t border-border bg-secondary/30 px-4 py-14">
          <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Sur mesure</p><h2 className="mt-2 font-display text-2xl font-bold">Vous ne trouvez pas exactement ce qu'il vous faut ?</h2><p className="mt-2 max-w-xl text-sm text-muted-foreground">Décrivez le résultat attendu. Le périmètre et le devis sont construits avec vous.</p></div>
            <Button asChild size="lg"><Link to="/contact">Parler du projet <ArrowRight className="ml-2 h-4 w-4"/></Link></Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  </>;
};

const CategorySection = ({category,index}:{category:ShopCategory;index:number}) => {
  const Icon = icons[category.icon as keyof typeof icons] || ShoppingBag;
  return <div className="mb-16 last:mb-0">
    <div className="mb-7 flex items-end justify-between gap-4"><div><span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">0{index+1}</span><h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">{category.title}</h2><p className="mt-1 max-w-2xl text-sm text-muted-foreground">{category.subtitle}</p></div><Icon className="hidden h-8 w-8 text-accent sm:block"/></div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{category.services.map((service,index)=><ServiceCard key={service.id} service={service} index={index}/>)}</div>
  </div>;
};

const ServiceCard = ({service,index}:{service:ServiceRow;index:number}) => <motion.article initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-50px"}} transition={{delay:Math.min(index*0.05,0.2)}} whileHover={{y:-5}} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-xl">
  {service.image_url && <div className="aspect-[16/9] overflow-hidden bg-muted"><img src={service.image_url} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src="/images/agricapital-poster.jpg";}}/></div>}
  <div className="flex flex-1 flex-col p-5">
    <div className="flex items-start justify-between gap-3"><h3 className="font-display text-lg font-bold leading-tight">{service.title}</h3><ShoppingBag className="h-5 w-5 shrink-0 text-accent opacity-70"/></div>
    {service.description && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.description}</p>}
    {service.bullets?.length ? <ul className="mt-4 space-y-2">{service.bullets.slice(0,4).map(b=><li key={b} className="flex gap-2 text-xs text-muted-foreground"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent"/>{b}</li>)}</ul>:null}
    {service.delivery_note && <p className="mt-3 text-xs font-medium text-accent">{service.delivery_note}</p>}
    <div className="mt-auto pt-6"><p className="font-display text-base font-bold">{servicePriceLabel(service)}</p><Button asChild className="mt-3 w-full" variant={service.price==null?"outline":"default"}><Link to={"/commande?service="+encodeURIComponent(service.slug)}>{service.price==null?"Demander un devis":"Commander"} <ArrowRight className="ml-2 h-4 w-4"/></Link></Button></div>
  </div>
</motion.article>;

export default Boutique;
