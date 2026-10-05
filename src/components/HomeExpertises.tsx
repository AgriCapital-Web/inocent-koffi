import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Code2, Video, Music2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const blocks = [
  { icon: Code2, number: "01", title: "WEB & SOLUTIONS DIGITALES", text: "Sites vitrines, applications web, plateformes, CRM, outils métier et intégrations API." },
  { icon: Video, number: "02", title: "VIDÉO & CRÉATION IA", text: "Publicités, vidéos avec voix off, synchronisation labiale, vidéos personnalisées et contenus IA." },
  { icon: Music2, number: "03", title: "AUDIO & MUSIQUE", text: "Jingles, voix off, créations audio et chansons personnalisées assistées par IA." },
];

export default function HomeExpertises() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setActive((i) => (i + 1) % blocks.length), 5000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <section className="border-y border-border/60 bg-background py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Mes expertises</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Du digital à la création, trois domaines complémentaires.</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">Je transforme les idées en solutions digitales, créatives et concrètes, avec une approche adaptée au besoin réel.</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {blocks.map((block, i) => {
            const Icon = block.icon;
            return (
              <motion.article key={block.number} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} animate={{ y: active === i ? -5 : 0, opacity: active === i ? 1 : 0.82 }} transition={{ duration: 0.3 }} className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent"><Icon className="h-5 w-5 text-primary-foreground" /></div><span className="font-mono text-xs text-muted-foreground">{block.number}</span></div>
                <h3 className="mt-6 text-lg font-bold text-foreground">{block.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{block.text}</p>
              </motion.article>
            );
          })}
        </div>
        <div className="mt-5 flex items-center justify-between">
          <div className="flex gap-1.5">{blocks.map((b, i) => <button key={b.number} aria-label={`Afficher ${b.title}`} onClick={() => setActive(i)} className={`h-1.5 rounded-full transition-all ${active === i ? "w-8 bg-accent" : "w-2 bg-border"}`} />)}</div>
          <Link to="/expertises" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Toutes mes expertises <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  );
}
