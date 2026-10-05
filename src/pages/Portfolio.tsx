import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Code, Globe, BarChart3, GraduationCap, Brain, CreditCard, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { usePortfolioProjects } from "@/hooks/usePortfolioProjects";
import PortfolioProjectCard from "@/components/PortfolioProjectCard";
import { useMemo, useEffect, useState } from "react";

const GROUPS=[{id:"tous",label:"Tous"},{id:"web",label:"Web"},{id:"applications",label:"Applications"},{id:"crm",label:"CRM"},{id:"video",label:"Vidéo"},{id:"audio",label:"Audio"},{id:"musique",label:"Musique"},{id:"ia",label:"IA"},{id:"projets",label:"Projets"}] as const;
const services=[{icon:Globe,title:"Sites Web & E-commerce",desc:"Boutiques en ligne, vitrines, marketplaces — conception sur mesure"},{icon:Code,title:"Applications & CRM",desc:"Outils métier sur mesure, gestion interne, automatisation"},{icon:Brain,title:"Intégration IA",desc:"Chatbots, génération de contenu, automatisation intelligente"},{icon:BarChart3,title:"Dashboards & Analytics",desc:"Tableaux de bord, rapports, suivi en temps réel"},{icon:GraduationCap,title:"Formation & Accompagnement",desc:"Initiation et prise en main de vos plateformes"},{icon:CreditCard,title:"Portails clients & paiements",desc:"Espaces clients sécurisés, suivi financier et documents"},{icon:Layers,title:"Projets complexes",desc:"Architectures multi-tenant, RLS, rôles, workflows et API"}];
const techStack=["React","TypeScript","Vite","Tailwind CSS","Shadcn/ui","Supabase","PostgreSQL","Edge Functions","KkiaPay","Framer Motion","React Query","IA Gemini / GPT","Node.js","REST API","Vercel","PWA"];

export default function Portfolio(){
 const [active,setActive]=useState("tous"),[tick,setTick]=useState(Date.now()); const {data:projects=[],isLoading,isError}=usePortfolioProjects();
 useEffect(()=>{const id=window.setInterval(()=>setTick(Date.now()),30000);return()=>window.clearInterval(id)},[]);
 const visible=useMemo(()=>active==="tous"?projects:projects.filter(p=>p.category===active),[active,projects]);
 return <><Helmet><title>Réalisations | Inocent KOFFI</title><meta name="description" content="Réalisations web, IA, applications et projets conçus par Inocent KOFFI."/></Helmet><div className="min-h-screen"><Navbar/>
 <section className="overflow-hidden pt-28 pb-14 text-white" style={{background:"var(--gradient-visionary)"}}><div className="site-container"><div className="content-measure text-center"><span className="eyebrow text-white/65">Portfolio</span><h1 className="mt-3 text-4xl leading-tight sm:text-5xl lg:text-6xl">Mes <span className="text-transparent bg-clip-text" style={{backgroundImage:"var(--gradient-gold)"}}>réalisations</span></h1><p className="mx-auto mt-5 text-measure text-base text-white/75 sm:text-lg">Des plateformes, applications, sites et solutions numériques conçus pour des entreprises, organisations et projets africains.</p></div></div></section>
 <main className="section-space"><div className="site-container"><div className="content-measure">
 <div className="mb-8 flex flex-wrap gap-2 sm:mb-10">{GROUPS.map(g=><button key={g.id} onClick={()=>setActive(g.id)} className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${active===g.id?"border-primary bg-primary text-primary-foreground":"border-border bg-card text-muted-foreground hover:border-accent"}`}>{g.label}<span className="ml-1.5 opacity-60">{g.id==="tous"?projects.length:projects.filter(p=>p.category===g.id).length}</span></button>)}</div>
 {isLoading&&<p className="py-12 text-center text-muted-foreground">Chargement…</p>}{isError&&<p className="py-12 text-center text-muted-foreground">Les réalisations sont temporairement indisponibles.</p>}
 {!isLoading&&!isError&&<motion.div key={active} initial={{opacity:0}} animate={{opacity:1}} className="safe-grid">{visible.map(p=><PortfolioProjectCard key={p.id} project={p} previewTick={tick}/>)}</motion.div>}
 </div></div></main>
 <section className="section-space bg-secondary/30"><div className="site-container"><div className="content-measure"><h2 className="mb-8 text-center text-2xl sm:text-3xl">Services <span className="text-accent">proposés</span></h2><div className="safe-grid">{services.map(s=>{const I=s.icon;return <article key={s.title} className="rounded-2xl border bg-card p-6 text-center"><div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent"><I className="h-6 w-6 text-primary-foreground"/></div><h3 className="text-base sm:text-lg">{s.title}</h3><p className="mt-2 text-sm text-muted-foreground">{s.desc}</p></article>})}</div></div></div></section>
 <section className="section-space"><div className="site-container"><div className="content-measure text-center"><h2 className="text-2xl sm:text-3xl">Stack <span className="text-accent">technique</span></h2><div className="mt-6 flex flex-wrap justify-center gap-2">{techStack.map(t=><span key={t} className="rounded-full border bg-secondary px-3 py-1.5 text-xs font-medium sm:text-sm">{t}</span>)}</div></div></div></section>
 <section className="bg-gradient-to-r from-primary to-primary/80 py-14 text-center"><div className="site-container"><h2 className="text-2xl text-primary-foreground sm:text-3xl">Un projet en tête ?</h2><p className="mx-auto mt-3 max-w-2xl text-primary-foreground/75">Disponible pour vos projets locaux ou à distance.</p><Button className="mt-6" variant="secondary" asChild><Link to="/contact">Me contacter</Link></Button></div></section>
 <Footer/></div></>
}