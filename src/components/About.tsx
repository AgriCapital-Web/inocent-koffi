import { Award, Target, Users } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Excellence",
      description: "Un engagement envers la qualité dans chaque projet"
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Ensemble vers la réussite de vos objectifs"
    },
    {
      icon: Award,
      title: "Intégrité",
      description: "Transparence et éthique professionnelle"
    }
  ];

  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">
              À <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Propos</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Professionnel passionné par le développement d'affaires et l'innovation stratégique, 
                je me consacre à accompagner les entreprises et entrepreneurs dans leur quête d'excellence.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Basé à Daloa, dans la région du Haut-Sassandra en Côte d'Ivoire, j'apporte mon expertise 
                pour transformer les défis en opportunités de croissance durable.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Mon approche combine vision stratégique, méthodologie éprouvée et engagement personnel 
                pour garantir des résultats concrets et mesurables.
              </p>
            </div>

            <div className="space-y-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div 
                    key={index}
                    className="flex gap-4 p-6 rounded-2xl bg-secondary/50 hover:bg-secondary/70 transition-colors border border-border/50"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-foreground">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
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
