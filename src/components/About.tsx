import { Code2, Brain, Video, Music2 } from "lucide-react";

const About = () => (
  <section id="about" className="py-16 sm:py-20 lg:py-24 bg-background">
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Qui je suis</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Un profil transversal pour des projets concrets.</h2>
        </div>
        <div className="space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          <p>Je suis <strong className="text-foreground">Inocent KOFFI</strong>, entrepreneur Agro & Digital, développeur web, praticien IA et créateur de solutions.</p>
          <p>J'interviens de l'idée au déploiement : cadrage, conception, développement, automatisation, contenus et évolution des produits, avec un parcours qui relie aussi l'entrepreneuriat agricole au numérique.</p>
          <p>Mon parcours entrepreneurial comprend plusieurs projets et entreprises. <strong className="text-foreground">AgriCapital en fait partie, mais ne définit pas à lui seul mon identité professionnelle.</strong></p>
        </div>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [Code2, "Web & solutions digitales", "Sites, applications, plateformes, CRM et outils métier."],
          [Brain, "IA & automatisation", "Intégration de l'IA dans les produits, contenus et workflows."],
          [Video, "Vidéo & création IA", "Conception de contenus visuels et formats digitaux."],
          [Music2, "Audio & musique", "Création et production audio comme univers complémentaire."]
        ].map(([Icon, title, description]) => {
          const I = Icon as typeof Code2;
          return <article key={title as string} className="rounded-2xl border border-border/60 bg-card p-5 sm:p-6"><I className="h-7 w-7 text-accent" /><h3 className="mt-4 text-base font-bold text-foreground sm:text-lg">{title as string}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description as string}</p></article>;
        })}
      </div>
    </div>
  </section>
);

export default About;
