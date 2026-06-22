import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { Badge } from "@/components/ui/badge";
import { Sprout, MapPin, Calendar, TrendingUp } from "lucide-react";

const Projets = () => {
  const stats = [
    {
      icon: Sprout,
      value: "620 ha",
      label: "Pépinière en Croissance Active",
      description: "88 660 plants en production"
    },
    {
      icon: MapPin,
      value: "100+ ha",
      label: "Terres Sécurisées",
      description: "Déploiement immédiat"
    },
    {
      icon: TrendingUp,
      value: "1 000+ ha",
      label: "Pipeline Foncier Mobilisable",
      description: "Jusqu'à ~10 000 ha à terme"
    },
    {
      icon: Calendar,
      value: "25 ans",
      label: "Cycle Productif Garanti",
      description: "Prix bord champ garanti par l'État ivoirien"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Nos Actifs & Chiffres Clés — AgriCapital</title>
        <meta name="description" content="AgriCapital en chiffres : 620 ha de pépinière active, 100+ ha de terres sécurisées, pipeline foncier mobilisable jusqu'à ~10 000 ha et cycle productif garanti sur 25 ans." />
        <link rel="canonical" href="https://www.ikoffi.agricapital.ci/projets" />
      </Helmet>
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-br from-background via-secondary/30 to-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <Badge variant="outline" className="mb-4">Nos Actifs & Notre Force de Frappe</Badge>
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 text-foreground">
                  AgriCapital en <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Chiffres</span>
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed text-justify">
                  Une base opérationnelle tangible, un foncier mobilisable à grande échelle, un modèle conçu pour scaler.
                </p>
              </div>
            </div>
          </section>

          {/* Stats Grid */}
          <section className="py-20 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div 
                        key={index}
                        className="p-6 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20"
                      >
                        <Icon className="w-10 h-10 mb-4 text-accent" />
                        <p className="text-3xl sm:text-4xl font-bold mb-2">{stat.value}</p>
                        <p className="text-base sm:text-lg font-semibold mb-2">{stat.label}</p>
                        <p className="text-sm opacity-80">{stat.description}</p>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-8 text-sm sm:text-base opacity-90 max-w-3xl">
                  Pipeline foncier mobilisable : 1 000+ ha à court terme, jusqu'à ~10 000 ha à terme, grâce à notre force de mobilisation et à notre réseau territorial dans le Haut-Sassandra et au-delà.
                </p>
              </div>
            </div>
          </section>

          {/* Gallery */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-foreground">
                  En <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Images</span>
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="group relative rounded-2xl overflow-hidden aspect-[4/3] col-span-2 lg:col-span-1 lg:row-span-2">
                    <img 
                      src="/images/agricapital-poster.jpg" 
                      alt="AGRICAPITAL - Présentation" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                      <div>
                        <Badge className="mb-2 bg-accent text-accent-foreground">AgriCapital</Badge>
                        <p className="text-white text-lg font-medium">Opérateur agricole intégré — palmier à huile clé en main</p>
                      </div>
                    </div>
                  </div>

                  <div className="group relative rounded-2xl overflow-hidden aspect-[4/3]">
                    <img 
                      src="/images/palm-oil-production.jpg" 
                      alt="Production de palmier à huile" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                      <p className="text-white font-medium">Filière Palmier à Huile</p>
                    </div>
                  </div>

                  <div className="group relative rounded-2xl overflow-hidden aspect-[4/3]">
                    <img 
                      src="/images/nursery-palm.jpg" 
                      alt="Pépinière de palmiers" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                      <p className="text-white font-medium">Pépinières & Formation</p>
                    </div>
                  </div>
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

export default Projets;
