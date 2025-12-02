import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Target, Users, Sprout, TrendingUp, MapPin, Calendar, Building } from "lucide-react";

const Agricapital = () => {
  const missions = [
    {
      icon: Target,
      title: "Mission",
      description: "Ouvrir l'accès à la filière palmier à huile grâce à un modèle structuré, durable et sans barrière financière."
    },
    {
      icon: Users,
      title: "Accompagnement",
      description: "Financement adapté et encadrement professionnel pour les producteurs agricoles."
    },
    {
      icon: Sprout,
      title: "Durabilité",
      description: "Modèle agricole intégré respectueux de l'environnement et des communautés."
    },
    {
      icon: TrendingUp,
      title: "Croissance",
      description: "Création de valeur locale et d'emplois dans les territoires ruraux."
    }
  ];

  const actions = [
    "Identification et qualification de plus de 500 hectares de terres agricoles",
    "Mobilisation de plus de 30 villages et communautés rurales",
    "Prospection terrain dans 360+ localités à travers 8 régions",
    "Structuration d'un modèle de financement adapté aux producteurs",
    "Développement de partenariats stratégiques avec les acteurs de la filière"
  ];

  const objectives = [
    {
      title: "2025-2030",
      items: [
        "Accompagner 250 à 500 producteurs",
        "Développer 500 hectares de plantations de palmier à huile",
        "Créer des emplois locaux durables",
        "Structurer une chaîne de valeur intégrée"
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>AGRICAPITAL SARL - Le Partenaire Idéal des Producteurs Agricoles</title>
        <meta name="description" content="AGRICAPITAL SARL, entreprise spécialisée dans l'accompagnement agricole et services intégrés. Daloa, Côte d'Ivoire. Filière palmier à huile." />
        <link rel="canonical" href="https://www.ikoffi.agricapital.ci/agricapital" />
      </Helmet>
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <Badge variant="outline" className="mb-4 text-sm px-4 py-2">
                    Le Partenaire Idéal des Producteurs Agricoles
                  </Badge>
                  <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-foreground">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">AGRICAPITAL</span> SARL
                  </h1>
                </div>

                {/* Company Info Card */}
                <div className="bg-card rounded-3xl p-8 md:p-10 border border-border/50 shadow-xl mb-12">
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="flex items-center gap-3">
                      <Building className="w-6 h-6 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Capital Social</p>
                        <p className="font-bold text-foreground">5 000 000 FCFA</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-6 h-6 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Siège</p>
                        <p className="font-bold text-foreground">Daloa, Haut-Sassandra</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-6 h-6 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">RCCM</p>
                        <p className="font-bold text-foreground text-sm">CI-01-DAL-2025-B12-13435</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-lg text-muted-foreground leading-relaxed text-center">
                    Entreprise spécialisée dans <strong className="text-foreground">l'accompagnement agricole et les services intégrés</strong>, avec pour mission d'ouvrir l'accès à la filière palmier à huile grâce à un modèle structuré, durable et sans barrière financière.
                  </p>
                </div>

                {/* CTA Button */}
                <div className="text-center">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg"
                    asChild
                  >
                    <a href="https://www.agricapital.ci" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Visiter le Site Officiel
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Mission & Values */}
          <section className="py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-center text-foreground">
                  Notre <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Mission</span>
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {missions.map((mission, index) => {
                    const Icon = mission.icon;
                    return (
                      <div 
                        key={index}
                        className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-accent/50 hover:shadow-xl transition-all duration-300"
                      >
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-foreground">{mission.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{mission.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Actions Menées */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-center text-foreground">
                  Actions <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Menées</span>
                </h2>

                <div className="space-y-4">
                  {actions.map((action, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border/50 hover:border-accent/30 transition-colors"
                    >
                      <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold flex-shrink-0">
                        {index + 1}
                      </span>
                      <p className="text-foreground font-medium">{action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Objectifs */}
          <section className="py-20 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl lg:text-4xl font-bold mb-12">
                  Objectifs {objectives[0].title}
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {objectives[0].items.map((item, index) => (
                    <div 
                      key={index}
                      className="p-6 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20"
                    >
                      <p className="text-lg font-medium">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-12">
                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    asChild
                  >
                    <a href="/partenariat">
                      Devenir Partenaire
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Gallery Preview */}
          <section className="py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-center text-foreground">
                  En <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Images</span>
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="group relative rounded-2xl overflow-hidden aspect-[4/3]">
                    <img 
                      src="/images/agricapital-poster.jpg" 
                      alt="AGRICAPITAL - Présentation" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <p className="text-white font-medium">AGRICAPITAL SARL</p>
                    </div>
                  </div>
                  <div className="group relative rounded-2xl overflow-hidden aspect-[4/3]">
                    <img 
                      src="/images/palm-oil-production.jpg" 
                      alt="Production de palmier à huile" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <p className="text-white font-medium">Filière Palmier à Huile</p>
                    </div>
                  </div>
                  <div className="group relative rounded-2xl overflow-hidden aspect-[4/3]">
                    <img 
                      src="/images/nursery-palm.jpg" 
                      alt="Pépinière de palmiers" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <p className="text-white font-medium">Pépinières Certifiées</p>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-8">
                  <Button variant="outline" asChild>
                    <a href="/projets">Voir tous les projets</a>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Agricapital;
