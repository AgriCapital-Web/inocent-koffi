import { TrendingUp, Target, Lightbulb } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const services = [
  {
    icon: Target,
    title: "Impact",
    description: "Transformation agricole à fort impact économique, social, communautaire et environnemental."
  },
  {
    icon: TrendingUp,
    title: "Financement & Investissement",
    description: "Structuration de mécanismes de financement innovants pour soutenir les projets agricoles à fort impact."
  },
  {
    icon: Lightbulb,
    title: "Accompagnement Terrain",
    description: "Plus de 12 années d'immersion au cœur des communautés rurales, transformant les réalités du terrain en solutions concrètes."
  }
];

const Services = () => {
  return (
    <section id="services" className="py-12 sm:py-16 lg:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 text-foreground">
            Mon <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Expertise</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground px-4">
            Leadership visionnaire pour une agriculture africaine prospère et durable
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <Card 
                  className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-accent/50 bg-card h-full"
                >
                  <CardHeader className="pb-3 sm:pb-4">
                    <motion.div 
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-3 sm:mb-4"
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </motion.div>
                    <CardTitle className="text-lg sm:text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm sm:text-base">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
