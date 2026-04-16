import { Target, Users, Leaf, Shield } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Opérateur Agricole",
      description: "Création de plantations de palmier à huile clé en main, avec ou sans terrain."
    },
    {
      icon: Users,
      title: "Accompagnement Complet",
      description: "De la sécurisation foncière à la commercialisation, un suivi rigoureux et transparent."
    },
    {
      icon: Leaf,
      title: "Patrimoine Durable",
      description: "Un modèle sur 28 ans pour bâtir un patrimoine agricole tangible et générateur de revenus."
    },
    {
      icon: Shield,
      title: "Sécurité Contractuelle",
      description: "Contrats certifiés, cartographie GPS, cadre juridique solide et garantie d'achat sur 25 ans."
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
                Agro-entrepreneur et stratège en développement agricole
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                Inocent KOFFI cumule plus de 12 années d'immersion terrain en Côte d'Ivoire. Cette connaissance intime du territoire, des réalités agricoles et du potentiel foncier constitue un atout stratégique majeur pour AgriCapital.
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                AgriCapital est un opérateur et promoteur agricole qui conçoit et déploie des plantations de palmier à huile clé en main, permettant aux particuliers et professionnels d'accéder à une agriculture productive, tout en étant déchargés des contraintes techniques, foncières et organisationnelles.
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed hidden sm:block">
                De 2012 à 2024, il a parcouru plus de 360 localités à travers 8 régions de Côte d'Ivoire — en contact direct et permanent avec les communautés rurales, identifiant et validant les meilleures terres pour les clients d'AgriCapital.
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
