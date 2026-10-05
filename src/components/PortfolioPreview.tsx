import { useEffect, useMemo, useState } from "react";
import { Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { usePortfolioProjects } from "@/hooks/usePortfolioProjects";
import PortfolioProjectCard from "@/components/PortfolioProjectCard";

export default function PortfolioPreview(){
 const {data:projects=[],isLoading,isError}=usePortfolioProjects();
 const [previewTick,setPreviewTick]=useState(Date.now());
 useEffect(()=>{const id=window.setInterval(()=>setPreviewTick(Date.now()),30000);return()=>window.clearInterval(id)},[]);
 const featured=useMemo(()=>projects.slice(0,6),[projects]);
 return <section className="section-space bg-secondary/30">
  <div className="site-container">
   <div className="content-measure">
    <motion.div className="mb-10 text-center" initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
     <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent"><Code className="h-4 w-4"/> Réalisations</span>
     <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">Mes <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">réalisations</span></h2>
     <p className="mx-auto mt-4 text-measure text-base text-muted-foreground sm:text-lg">Les mêmes publications que la page Réalisations, alimentées directement par la même base de données.</p>
    </motion.div>
    {isLoading&&<div className="py-12 text-center text-muted-foreground">Chargement…</div>}
    {isError&&<div className="py-12 text-center text-muted-foreground">Impossible de charger les réalisations.</div>}
    {!isLoading&&!isError&&<div className="safe-grid">{featured.map(p=><PortfolioProjectCard key={p.id} project={p} previewTick={previewTick}/>)}</div>}
    <div className="mt-9 text-center"><Button asChild><Link to="/portfolio">Voir toutes les réalisations</Link></Button></div>
   </div>
  </div>
 </section>
}