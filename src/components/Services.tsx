import { Handshake, TrendingUp, Settings, Sprout } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    icon: Handshake,
    title: "Partenariats Stratégiques",
    description: "Développement de relations d'affaires durables et création de synergies pour une croissance mutuelle."
  },
  {
    icon: Sprout,
    title: "Développement d'Entreprise",
    description: "Accompagnement dans la croissance et l'expansion de votre activité avec des stratégies innovantes."
  },
  {
    icon: Settings,
    title: "Optimisation de Processus",
    description: "Amélioration de vos opérations et processus pour une efficacité et productivité maximales."
  },
  {
    icon: TrendingUp,
    title: "Stratégie de Croissance",
    description: "Élaboration de plans stratégiques sur mesure pour atteindre vos objectifs business ambitieux."
  }
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Mes <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Services</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Des solutions professionnelles adaptées à vos besoins pour propulser votre entreprise vers le succès
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-accent/50 bg-card"
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
