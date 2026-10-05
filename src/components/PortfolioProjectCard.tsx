import { useState } from "react";
import { ExternalLink, Globe, Brain, BarChart3, GraduationCap, Shield, Rocket, Store, Wallet, Building2, Smartphone, Sprout, Sparkles, Code, Users } from "lucide-react";
import { motion } from "framer-motion";
import { getPortfolioFallbackSource, getPortfolioPreviewSource, buildPortfolioLivePreview, type PortfolioProject } from "@/hooks/usePortfolioProjects";

const iconByTitle: Record<string, typeof Globe> = {
  "LegalForm CI": Shield, Scoly: GraduationCap, AGRICAPITAL: Sprout, "AGRICAPITAL App": BarChart3,
  "Portail Client AgriCapital": Smartphone, "MiPROJET+": Rocket, "MiProjet Go": Store, "MiPROJET Invest": Wallet,
  "IA Pour Tous": Brain, ASSOJEREB: Users, "LT Group": Building2, ANZRBO: Sparkles,
};
const iconByCategory: Record<string, typeof Globe> = { web: Globe, applications: Smartphone, crm: BarChart3, ia: Brain, projets: Rocket, video: Code, audio: Code, musique: Code };
const categoryLabel: Record<string,string> = {web:"Web",applications:"Application",crm:"CRM",ia:"IA",projets:"Projet",video:"Vidéo",audio:"Audio",musique:"Musique"};

export default function PortfolioProjectCard({project,previewTick}:{project:PortfolioProject;previewTick:number}) {
  const [liveFailed,setLiveFailed]=useState(false);
  const Icon=iconByTitle[project.title]??iconByCategory[project.category]??Globe;
  const source=getPortfolioPreviewSource(project);
  const fallback=getPortfolioFallbackSource(project);
  const preview=source&&!liveFailed?buildPortfolioLivePreview(source,String(previewTick)):"";
  return <motion.article whileHover={{y:-5}} className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-xl">
    <a href={project.url||undefined} target={project.url?"_blank":undefined} rel={project.url?"noopener noreferrer":undefined} className="block h-full">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        {fallback&&<img src={fallback} alt="" className="absolute inset-0 h-full w-full object-cover object-top" loading="eager" onError={e=>e.currentTarget.style.display="none"}/>}
        {preview&&<img key={preview} src={preview} alt={project.title+" — aperçu réel du domaine officiel"} className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]" loading="eager" decoding="async" onError={()=>setLiveFailed(true)}/>}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent"/>
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-bold text-accent backdrop-blur">{categoryLabel[project.category]??project.category}</span>
        {source&&<span className="absolute right-3 top-3 rounded-full bg-emerald-600/90 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white">DOMAINE OFFICIEL</span>}
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-5">
        <div className="mb-3 flex min-w-0 items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent"><Icon className="h-5 w-5 text-primary-foreground"/></div><h3 className="min-w-0 text-lg font-bold leading-tight text-foreground">{project.title}</h3></div>
        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{project.description||"Réalisation numérique conçue et publiée par Inocent KOFFI."}</p>
        <div className="mb-4 flex flex-wrap gap-1.5">{(project.technologies||[]).slice(0,6).map(t=><span key={t} className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{t}</span>)}</div>
        <div className="mt-auto flex items-center justify-between gap-3"><span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">{project.url?"Visiter le site":"Projet interne"} {project.url&&<ExternalLink className="h-3.5 w-3.5"/>}</span>{project.updated_at&&<span className="whitespace-nowrap text-[10px] text-muted-foreground">Mis à jour {new Date(project.updated_at).toLocaleDateString("fr-FR")}</span>}</div>
      </div>
    </a>
  </motion.article>;
}
