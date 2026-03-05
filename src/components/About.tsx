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
                <strong className="text-foreground">Fondateur & CEO — AGRICAPITAL SARL</strong>
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed italic">
                Entrepreneur Social | Développeur Web | Développeur de Stratégies | Créateur de Contenus Professionnels | Praticien IA & Formateur Pluridisciplinaire
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                Entrepreneur agricole, développeur web et praticien de l'intelligence artificielle, Inocent KOFFI cumule 
                plus de 12 années d'immersion terrain en Côte d'Ivoire — dans le service technico-commercial et le recouvrement 
                de créances, l'énergie renouvelable, l'agriculture et l'innovation numérique.
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                Fort de ce parcours pluridisciplinaire ancré dans les réalités du terrain, il place aujourd'hui la technologie 
                et l'agriculture au cœur d'une vision commune : faire de l'innovation un levier concret au service des communautés 
                et du développement local. Fondateur et CEO d'AGRICAPITAL SARL, il initie et porte des projets à fort impact social.
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed hidden sm:block">
                De 2012 à 2024, il a parcouru plus de 360 localités à travers 8 régions de Côte d'Ivoire — 
                Loh-Djiboua, Gôh, Nawa, Gboklè, Grands-Ponts, Agnéby-Tiassa, Haut-Sassandra et Marahoué — 
                en contact direct et permanent avec les communautés rurales.
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
