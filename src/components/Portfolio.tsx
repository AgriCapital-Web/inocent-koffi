import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, MapPin, Target } from "lucide-react";

const Portfolio = () => {
  const achievements = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "360+ Localités Visitées",
      description: "12 années d'immersion terrain à travers 8 régions de Côte d'Ivoire",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "30+ Villages Engagés",
      description: "Communautés rurales mobilisées pour un développement durable",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "500+ Hectares Identifiés",
      description: "Terres qualifiées pour la culture du palmier à huile",
      color: "from-orange-500 to-amber-500",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Objectif 2025-2030",
      description: "250-500 producteurs accompagnés sur 500 hectares",
      color: "from-purple-500 to-pink-500",
    },
  ];

  const projects = [
    {
      image: "/images/palm-oil-production.jpg",
      title: "Plantation de Palmiers à Huile",
      description: "Accompagnement technique de la plantation à la commercialisation avec garantie sur 20 ans",
      tags: ["Palmier à huile", "Accompagnement", "Commercial"],
    },
    {
      image: "/images/nursery-palm.jpg",
      title: "Pépinières & Formation",
      description: "Mise en place de pépinières certifiées et formation continue des producteurs",
      tags: ["Formation", "Plants certifiés", "Technique"],
    },
    {
      image: "/images/agricapital-poster.jpg",
      title: "Modèle Inclusif",
      description: "Solution innovante permettant aux propriétaires terriens d'accéder à l'agriculture moderne",
      tags: ["Innovation", "Inclusion", "Durabilité"],
    },
  ];

  return (
    <section id="portfolio" className="py-20 px-4 bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <Badge variant="outline" className="mb-4">Portfolio & Réalisations</Badge>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Notre Impact sur le Terrain
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Des résultats concrets qui démontrent l'adhésion des communautés rurales et notre engagement pour un développement agricole durable
          </p>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {achievements.map((achievement, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50 bg-card/50 backdrop-blur-sm"
            >
              <CardContent className="p-6 space-y-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${achievement.color} flex items-center justify-center text-white shadow-lg`}>
                  {achievement.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground">{achievement.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {achievement.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Projects Gallery */}
        <div className="space-y-4 mb-8">
          <h3 className="text-2xl md:text-3xl font-bold text-center">Nos Projets Phares</h3>
          <p className="text-center text-muted-foreground">
            Découvrez nos réalisations concrètes en faveur de l'agriculture ivoirienne
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card 
              key={index} 
              className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  width="400"
                  height="224"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <CardContent className="p-6 space-y-3">
                <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {project.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 p-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Rejoignez-nous dans cette Aventure</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Ensemble, transformons l'agriculture ivoirienne et construisons un avenir prospère pour les communautés rurales.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
