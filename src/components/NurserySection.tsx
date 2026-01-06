import { Badge } from "@/components/ui/badge";
import { Sprout, Calendar, TrendingUp, Target, Check } from "lucide-react";

const NurserySection = () => {
  const milestones = [
    {
      date: "Janvier 2025",
      title: "Lancement de la Pépinière",
      description: "Démarrage de la production de plants certifiés de palmier à huile",
      status: "completed"
    },
    {
      date: "Février - Mars 2025",
      title: "Phase de Germination",
      description: "Suivi intensif des germinations et préparation des substrats",
      status: "in_progress"
    },
    {
      date: "Avril - Juin 2025",
      title: "Croissance Pré-Pépinière",
      description: "Développement des plants en pré-pépinière avec irrigation contrôlée",
      status: "upcoming"
    },
    {
      date: "Juillet - Décembre 2025",
      title: "Maturation en Pépinière",
      description: "Plants prêts pour la mise en terre avec 12-14 feuilles développées",
      status: "upcoming"
    }
  ];

  const stats = [
    { icon: Sprout, value: "10,000+", label: "Plants en Production" },
    { icon: Target, value: "500 ha", label: "Surface Cible" },
    { icon: TrendingUp, value: "250+", label: "Producteurs Accompagnés" }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-accent/5 via-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-sm px-4 py-2 border-accent text-accent">
              <Sprout className="w-4 h-4 mr-2 inline" />
              Jalons du Projet
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-foreground">
              Évolution de la{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Pépinière
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Suivez en temps réel l'évolution de notre pépinière de palmiers à huile, 
              pierre angulaire de notre projet d'accompagnement agricole.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className="relative group p-6 rounded-2xl bg-card border border-border/50 hover:border-accent/50 hover:shadow-xl transition-all duration-300 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-3xl lg:text-4xl font-bold text-foreground mb-2">{stat.value}</p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary via-accent to-primary/30 hidden md:block"></div>
            
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div 
                  key={index}
                  className={`relative flex flex-col md:flex-row gap-8 items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className={`p-6 rounded-2xl border transition-all duration-300 ${
                      milestone.status === 'completed' 
                        ? 'bg-accent/10 border-accent/50 shadow-lg' 
                        : milestone.status === 'in_progress'
                          ? 'bg-primary/10 border-primary/50 shadow-md animate-pulse'
                          : 'bg-card border-border/50 hover:border-accent/30'
                    }`}>
                      <div className={`flex items-center gap-2 mb-2 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                        <Calendar className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium text-accent">{milestone.date}</span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{milestone.title}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                      
                      {milestone.status === 'completed' && (
                        <div className={`flex items-center gap-2 mt-3 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                          <Check className="w-5 h-5 text-accent" />
                          <span className="text-sm font-semibold text-accent">Complété</span>
                        </div>
                      )}
                      {milestone.status === 'in_progress' && (
                        <Badge className="mt-3 bg-primary/20 text-primary border-primary/30">
                          En cours
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className={`w-6 h-6 rounded-full border-4 ${
                      milestone.status === 'completed' 
                        ? 'bg-accent border-accent' 
                        : milestone.status === 'in_progress'
                          ? 'bg-primary border-primary animate-pulse'
                          : 'bg-card border-border'
                    }`}></div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="flex-1 hidden md:block"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Gallery */}
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/3]">
              <img 
                src="/images/nursery-palm.jpg" 
                alt="Pépinière de palmiers à huile AGRICAPITAL" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                <div>
                  <p className="text-white font-semibold">Pépinière AGRICAPITAL</p>
                  <p className="text-white/70 text-sm">Plants de palmier à huile certifiés</p>
                </div>
              </div>
            </div>
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/3]">
              <img 
                src="/images/palm-oil-production.jpg" 
                alt="Production de palmier à huile" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                <div>
                  <p className="text-white font-semibold">Palmiers Adultes</p>
                  <p className="text-white/70 text-sm">Objectif de production 2025-2030</p>
                </div>
              </div>
            </div>
            <div className="group relative rounded-2xl overflow-hidden aspect-[4/3] md:col-span-2 lg:col-span-1">
              <img 
                src="/images/gallery/community-1.jpg" 
                alt="Communauté rurale accompagnée" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                <div>
                  <p className="text-white font-semibold">Communautés Rurales</p>
                  <p className="text-white/70 text-sm">Producteurs accompagnés dans le projet</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NurserySection;