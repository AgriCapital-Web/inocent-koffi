import { TrendingUp, Target, Lightbulb } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    icon: Target,
    title: "Impact",
    description: "Transformation agricole à fort impact économique, social, communautaire et environnemental."
  },
  {
    icon: TrendingUp,
    title: "Financement & Investissement",
    description: "Structuration de mécanismes de financement innovants pour soutenir les projets agricoles à fort impact, au service des producteurs, du développement des communautés rurales, du renforcement de la sécurité alimentaire et de la croissance de l'économie nationale."
  },
  {
    icon: Lightbulb,
    title: "Accompagnement Terrain",
    description: "Plus de 12 années d'immersion au cœur des communautés rurales, transformant les réalités du terrain en solutions concrètes de développement agricole."
  }
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Mon <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Expertise</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Leadership visionnaire pour une agriculture africaine prospère et durable
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
