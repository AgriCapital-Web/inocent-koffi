import { Award, Target, Users, Code, Brain } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Impact Agricole",
      description: "Transformation agricole à fort impact économique, sociétal et environnemental"
    },
    {
      icon: Users,
      title: "Innovation & Solidarité",
      description: "Modèles agricoles intégrés et durables pour l'Afrique"
    },
    {
      icon: Code,
      title: "Développement Tech",
      description: "Applications web, e-commerce, CRM et solutions IA sur mesure"
    },
    {
      icon: Brain,
      title: "Intelligence Artificielle",
      description: "Intégration IA, automatisation et outils intelligents pour entreprises"
    }
  ];

  return (
    <section id="about" className="py-12 sm:py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 text-foreground">
              À <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Propos</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-start">
            <div className="space-y-4 sm:space-y-6">
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Fondateur et Directeur Général d'AGRICAPITAL SARL</strong> et 
                <strong className="text-foreground"> Développeur Full Stack Freelance</strong>, je combine expertise terrain agricole et compétences technologiques avancées. 
                Basé à Daloa (Haut-Sassandra), je conçois des applications web, CRM, e-commerce et solutions IA 
                tout en dirigeant une entreprise d'accompagnement agricole au capital de 5 000 000 FCFA.
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                Passionné par la transformation agricole à fort impact économique, sociétal et environnemental, 
                je considère l'agriculture comme le socle de toute économie durable.
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                Mon engagement repose sur une conviction forte : les agriculteurs ne doivent plus lutter seuls 
                pour survivre, mais devenir des modèles de réussite et de prospérité — des acteurs respectés 
                et inspirants pour la jeunesse, les familles, les communautés et toute l'Afrique.
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed hidden sm:block">
                De 2012 à 2024, j'ai parcouru plus de 360 localités à travers 8 régions de Côte d'Ivoire — 
                Loh-Djiboua, Gôh, Nawa, Gboklè, Grands-Ponts, Agnéby-Tiassa, Haut-Sassandra et Marahoué — 
                me mettant en contact direct et permanent avec les communautés rurales.
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed hidden lg:block">
                Soit 12 années d'immersion totale au cœur du monde paysan : à écouter, observer, apprendre et construire.
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed hidden lg:block">
                De cette expérience est née une vision claire et structurée : bâtir un écosystème agricole intégré, 
                où chaque jeune Africain peut se développer durablement depuis son lieu d'origine grâce à l'agriculture.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div 
                    key={index}
                    className="flex gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-secondary/50 hover:bg-secondary/70 transition-colors border border-border/50"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-foreground">{value.title}</h3>
                      <p className="text-sm sm:text-base text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
