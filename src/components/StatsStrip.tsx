import { Code2, Brain, Video, Music2 } from "lucide-react";

const StatsStrip = () => (
  <section aria-label="Domaines d'intervention" className="relative z-10 -mt-8 sm:-mt-10">
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-border/60 bg-background/90 shadow-xl backdrop-blur-md sm:grid-cols-4">
        {[
          [Code2, "Web", "Sites & applications"],
          [Brain, "IA", "Pratique & intégration"],
          [Video, "Vidéo", "Création & contenus"],
          [Music2, "Audio", "Musique & production"]
        ].map(([Icon, title, subtitle]) => {
          const I = Icon as typeof Code2;
          return <div key={title as string} className="border-border/60 p-4 sm:p-6 sm:border-r last:border-r-0"><I className="h-5 w-5 text-accent" /><div className="mt-2 text-lg font-bold text-foreground">{title as string}</div><div className="text-xs text-muted-foreground">{subtitle as string}</div></div>;
        })}
      </div>
    </div>
  </section>
); export default StatsStrip;
