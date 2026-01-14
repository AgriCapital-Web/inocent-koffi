import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Calendar, Check, Clock, MapPin, Sprout, Target, TrendingUp, Users, Palmtree, X, ChevronLeft, ChevronRight, Filter } from "lucide-react";

interface Milestone {
  date: string;
  year: number;
  phase: string;
  title: string;
  description: string;
  status: "completed" | "in_progress" | "upcoming";
  images: string[];
}

const EvolutionEnhanced = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentMilestoneImages, setCurrentMilestoneImages] = useState<string[]>([]);
  const [visibleMilestones, setVisibleMilestones] = useState<Set<number>>(new Set());
  const timelineRef = useRef<HTMLDivElement>(null);

  const milestones: Milestone[] = [
    {
      date: "19 Novembre 2025",
      year: 2025,
      phase: "Lancement",
      title: "Lancement Officiel des Activités Terrain",
      description:
        "Démarrage effectif des opérations d'AGRICAPITAL sur le terrain. Cette journée a réuni les premiers souscripteurs, partenaires locaux et membres de l'équipe autour d'un objectif commun : transformer durablement l'agriculture dans la région du Haut-Sassandra.",
      status: "completed",
      images: [
        "/images/gallery/launch-1.jpg",
        "/images/gallery/launch-2.jpg",
        "/images/gallery/launch-3.jpg",
        "/images/gallery/launch-4.jpg",
        "/images/gallery/launch-5.jpg",
        "/images/gallery/launch-6.jpg",
        "/images/gallery/launch-7.jpg",
      ],
    },
    {
      date: "19 Nov - 24 Déc 2025",
      year: 2025,
      phase: "Installation",
      title: "Installation de la Pépinière 100+ Hectares",
      description:
        "Installation complète de notre site de pépinière de plus de 100 hectares avec système d'irrigation moderne et semences certifiées Tenera.",
      status: "completed",
      images: [
        "/images/gallery/nursery-dec-2025-1.jpg",
        "/images/gallery/nursery-palm-real.jpg",
        "/images/gallery/nursery-1.jpg",
        "/images/gallery/nursery-2.jpg",
      ],
    },
    {
      date: "Janvier - Mars 2026",
      year: 2026,
      phase: "Germination",
      title: "Phase de Germination et Suivi",
      description:
        "Suivi intensif des germinations et préparation des substrats. Formation continue des équipes techniques.",
      status: "in_progress",
      images: [
        "/images/gallery/jalon-1.jpg",
        "/images/gallery/jalon-2.jpg",
        "/images/gallery/jalon-3.jpg",
      ],
    },
    {
      date: "Avril - Juin 2026",
      year: 2026,
      phase: "Croissance",
      title: "Croissance Pré-Pépinière",
      description:
        "Développement des plants en pré-pépinière avec irrigation contrôlée et suivi phytosanitaire rigoureux.",
      status: "upcoming",
      images: [
        "/images/gallery/jalon-4.jpg",
        "/images/gallery/jalon-5.jpg",
      ],
    },
    {
      date: "Juillet - Décembre 2026",
      year: 2026,
      phase: "Distribution",
      title: "Maturation et Distribution",
      description:
        "Plants prêts pour la mise en terre avec 12-14 feuilles développées. Distribution aux producteurs partenaires.",
      status: "upcoming",
      images: [
        "/images/gallery/jalon-6.jpg",
        "/images/gallery/jalon-7.jpg",
      ],
    },
  ];

  const years = [...new Set(milestones.map(m => m.year))];
  const phases = [...new Set(milestones.map(m => m.phase))];

  const filteredMilestones = milestones.filter(m => {
    if (selectedFilter === "all") return true;
    if (years.includes(Number(selectedFilter))) return m.year === Number(selectedFilter);
    return m.phase === selectedFilter;
  });

  const stats = [
    { icon: Sprout, value: "10,000+", label: "Plants en Production" },
    { icon: Target, value: "100+ ha", label: "Site de Pépinière" },
    { icon: Users, value: "250+", label: "Producteurs Accompagnés" },
    { icon: MapPin, value: "30+", label: "Villages Engagés" }
  ];

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setVisibleMilestones((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -100px 0px" }
    );

    const elements = document.querySelectorAll("[data-milestone]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [filteredMilestones]);

  const openLightbox = (images: string[], index: number) => {
    setCurrentMilestoneImages(images);
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const navigateLightbox = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentImageIndex((prev) => 
        prev === 0 ? currentMilestoneImages.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev === currentMilestoneImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-accent text-accent-foreground"><Check className="w-3 h-3 mr-1" /> Complété</Badge>;
      case "in_progress":
        return <Badge className="bg-primary text-primary-foreground animate-pulse"><Clock className="w-3 h-3 mr-1" /> En cours</Badge>;
      default:
        return <Badge variant="secondary"><Calendar className="w-3 h-3 mr-1" /> À venir</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Évolution du Projet | AGRICAPITAL - Pépinière de Palmiers à Huile</title>
        <meta name="description" content="Suivez l'évolution du projet AGRICAPITAL : pépinière de palmiers à huile, jalons, photos de progression et impact sur les communautés rurales ivoiriennes." />
        <link rel="canonical" href="https://ikoffi.agricapital.ci/evolution" />
        <link rel="alternate" hrefLang="fr" href="https://ikoffi.agricapital.ci/evolution" />
        <link rel="alternate" hrefLang="en" href="https://ikoffi.agricapital.ci/evolution/en" />
        <link rel="alternate" hrefLang="es" href="https://ikoffi.agricapital.ci/evolution/es" />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-20 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-accent/10 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4 sm:mb-6 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 border-accent text-accent">
                <Palmtree className="w-3 h-3 sm:w-4 sm:h-4 mr-2 inline" />
                Timeline Interactive
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 text-foreground">
                Évolution du{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  Projet
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
                Suivez en temps réel l'avancement de notre pépinière de palmiers à huile et notre impact sur les communautés rurales du Haut-Sassandra.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="py-8 sm:py-12 bg-card border-y">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center p-4 sm:p-6 rounded-xl bg-background hover:shadow-lg transition-shadow">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 sm:py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Button
                variant={selectedFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("all")}
              >
                Tous
              </Button>
              {years.map((year) => (
                <Button
                  key={year}
                  variant={selectedFilter === String(year) ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(String(year))}
                >
                  {year}
                </Button>
              ))}
              {phases.map((phase) => (
                <Button
                  key={phase}
                  variant={selectedFilter === phase ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(phase)}
                >
                  {phase}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-12 sm:py-20" ref={timelineRef}>
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-12 sm:mb-16 text-foreground">
                Jalons du Projet
              </h2>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 sm:left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary via-accent to-primary/30"></div>

                <div className="space-y-8 sm:space-y-12">
                  {filteredMilestones.map((milestone, index) => (
                    <div
                      key={index}
                      data-milestone
                      data-index={index}
                      className={`relative flex flex-col md:flex-row gap-4 sm:gap-8 transition-all duration-700 ${
                        visibleMilestones.has(index)
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-10"
                      } ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                    >
                      {/* Content */}
                      <div className={`flex-1 ml-10 sm:ml-12 md:ml-0 ${index % 2 === 0 ? "md:pr-8 lg:pr-12 md:text-right" : "md:pl-8 lg:pl-12 md:text-left"}`}>
                        <div className={`p-4 sm:p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl ${
                          milestone.status === "completed"
                            ? "bg-accent/5 border-accent/30"
                            : milestone.status === "in_progress"
                            ? "bg-primary/5 border-primary/30"
                            : "bg-card border-border"
                        }`}>
                          <div className={`flex items-center gap-2 sm:gap-3 mb-3 flex-wrap ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                            <span className="text-xs sm:text-sm font-semibold text-accent flex items-center gap-1">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                              {milestone.date}
                            </span>
                            {getStatusBadge(milestone.status)}
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3">{milestone.title}</h3>
                          <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed">{milestone.description}</p>

                          {/* Image Gallery */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mt-4">
                            {milestone.images.map((img, imgIndex) => (
                              <button
                                key={imgIndex}
                                onClick={() => openLightbox(milestone.images, imgIndex)}
                                className="relative rounded-lg sm:rounded-xl overflow-hidden aspect-video group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                              >
                                <img
                                  src={img}
                                  alt={`${milestone.title} - Image ${imgIndex + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs sm:text-sm font-medium">
                                    Agrandir
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Timeline dot */}
                      <div className="absolute left-4 sm:left-0 md:left-1/2 transform -translate-x-1/2 z-10">
                        <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-4 transition-all duration-500 ${
                          visibleMilestones.has(index) ? "scale-100" : "scale-0"
                        } ${
                          milestone.status === "completed"
                            ? "bg-accent border-accent"
                            : milestone.status === "in_progress"
                            ? "bg-primary border-primary animate-pulse"
                            : "bg-background border-muted-foreground/30"
                        }`}></div>
                      </div>

                      {/* Spacer for alternating layout */}
                      <div className="flex-1 hidden md:block"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-20 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-foreground">
              Rejoignez l'Aventure AGRICAPITAL
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
              Participez à la transformation de l'agriculture ivoirienne et africaine.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <a href="/partenariat" className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm sm:text-base">
                Devenir Partenaire
              </a>
              <a href="/contact" className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-accent text-accent rounded-lg font-semibold hover:bg-accent/10 transition-colors text-sm sm:text-base">
                Nous Contacter
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Lightbox Dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl lg:max-w-6xl p-0 bg-black/95 border-none">
          <div className="relative w-full aspect-video sm:aspect-[16/10]">
            <img
              src={currentMilestoneImages[currentImageIndex]}
              alt={`Image ${currentImageIndex + 1}`}
              className="w-full h-full object-contain"
            />
            
            {/* Navigation */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
              onClick={() => navigateLightbox("prev")}
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
              onClick={() => navigateLightbox("next")}
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </Button>
            
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/50 hover:bg-black/70 text-white"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
            
            {/* Counter */}
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-white text-xs sm:text-sm">
              {currentImageIndex + 1} / {currentMilestoneImages.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EvolutionEnhanced;
