import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X, Camera } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: 'launch' | 'community' | 'training' | 'nursery';
}

const galleryImages: GalleryImage[] = [
  { id: '1', src: '/images/gallery/launch-1.jpg', alt: 'Lancement AGRICAPITAL - Installation pépinière', category: 'launch' },
  { id: '2', src: '/images/gallery/launch-2.jpg', alt: 'Lancement AGRICAPITAL - Équipe terrain', category: 'launch' },
  { id: '3', src: '/images/gallery/launch-3.jpg', alt: 'Lancement AGRICAPITAL - Partenaires locaux', category: 'launch' },
  { id: '4', src: '/images/gallery/launch-4.webp', alt: 'Lancement AGRICAPITAL - Premiers producteurs', category: 'launch' },
  { id: '5', src: '/images/gallery/launch-5.webp', alt: 'Lancement AGRICAPITAL - Site de pépinière', category: 'launch' },
  { id: '6', src: '/images/gallery/launch-6.webp', alt: 'Lancement AGRICAPITAL - Sensibilisation', category: 'launch' },
  { id: '7', src: '/images/gallery/launch-7.webp', alt: 'Lancement AGRICAPITAL - Opérations techniques', category: 'launch' },
  { id: '8', src: '/images/gallery/jalon-1.webp', alt: 'Jalon du projet - Évolution pépinière Nov 2025', category: 'launch' },
  { id: '9', src: '/images/gallery/jalon-2.webp', alt: 'Jalon du projet - Installation système irrigation', category: 'launch' },
  { id: '10', src: '/images/gallery/jalon-3.webp', alt: 'Jalon du projet - Équipe technique sur le terrain', category: 'launch' },
  { id: '11', src: '/images/gallery/jalon-4.webp', alt: 'Jalon du projet - Plants Tenera certifiés', category: 'launch' },
  { id: '12', src: '/images/gallery/community-1.webp', alt: 'Réunion communautaire - Village 1', category: 'community' },
  { id: '13', src: '/images/gallery/community-2.webp', alt: 'Réunion communautaire - Producteurs', category: 'community' },
  { id: '14', src: '/images/gallery/community-3.webp', alt: 'Réunion communautaire - Sensibilisation', category: 'community' },
  { id: '15', src: '/images/gallery/community-4.webp', alt: 'Réunion communautaire - Engagement', category: 'community' },
  { id: '16', src: '/images/gallery/community-5.webp', alt: 'Réunion communautaire - Partenariat local', category: 'community' },
  { id: '17', src: '/images/gallery/community-meeting-1.webp', alt: 'Rassemblement communautaire - Haut-Sassandra', category: 'community' },
  { id: '18', src: '/images/gallery/community-meeting-2.webp', alt: 'Rassemblement communautaire - Producteurs locaux', category: 'community' },
  { id: '19', src: '/images/gallery/community-meeting-3.webp', alt: 'Rassemblement communautaire - Sensibilisation rurale', category: 'community' },
  { id: '20', src: '/images/gallery/community-meeting-4.webp', alt: 'Rassemblement communautaire - Engagement des villages', category: 'community' },
  { id: '21', src: '/images/gallery/community-meeting-5.webp', alt: 'Rassemblement communautaire - Partenariat terrain', category: 'community' },
  { id: '22', src: '/images/gallery/nursery-1.webp', alt: 'Pépinière de palmiers à huile - 100+ hectares', category: 'nursery' },
  { id: '23', src: '/images/gallery/nursery-2.webp', alt: 'Pépinière AgriCapital - Décembre 2025', category: 'nursery' },
  { id: '24', src: '/images/nursery-palm.jpg', alt: 'Plants de palmiers - Modèle inclusif', category: 'nursery' },
  { id: '25', src: '/images/palm-oil-production.jpg', alt: 'Production de palmiers - Évolution du projet', category: 'nursery' },
];

const filters = [
  { key: 'all', label: 'Toutes' },
  { key: 'launch', label: 'Lancement' },
  { key: 'community', label: 'Communauté' },
  { key: 'nursery', label: 'Pépinière' },
  { key: 'training', label: 'Formations' },
];

const PhotoGallery = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [paused, setPaused] = useState(false);

  const filteredImages = activeFilter === 'all' 
    ? galleryImages.filter(img => !failedImages.has(img.src))
    : galleryImages.filter(img => img.category === activeFilter && !failedImages.has(img.src));

  const openLightbox = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setSelectedIndex(index);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' 
      ? (selectedIndex + 1) % filteredImages.length
      : (selectedIndex - 1 + filteredImages.length) % filteredImages.length;
    setSelectedIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  const handleImageLoad = (src: string) => {
    setLoadedImages(prev => new Set(prev).add(src));
  };

  const handleImageError = (src: string) => {
    setFailedImages(prev => new Set(prev).add(src));
  };

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => { api.off("select", onSelect); };
  }, [api, activeFilter]);

  useEffect(() => {
    if (!api || paused) return;
    const id = window.setInterval(() => {
      if (api.canScrollNext()) api.scrollNext();
      else api.scrollTo(0);
    }, 4000);
    return () => window.clearInterval(id);
  }, [api, paused, activeFilter]);

  return (
    <section id="gallery" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8 sm:mb-12 space-y-3 sm:space-y-4">
          <Badge variant="outline" className="mb-3 sm:mb-4">
            <Camera className="w-3 h-3 mr-1" />
            En Images
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Galerie Photo
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
            Découvrez les moments clés du lancement d'AGRICAPITAL SARL, le 19 novembre 2025.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {filters.map((filter) => (
            <Button
              key={filter.key}
              variant={activeFilter === filter.key ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter.key)}
              className="transition-all text-xs sm:text-sm"
            >
              {filter.label}
            </Button>
          ))}
        </div>

        <div
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <Carousel setApi={setApi} opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-3 sm:-ml-4">
              {filteredImages.map((image, index) => (
                <CarouselItem
                  key={image.id}
                  className="pl-3 sm:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                >
                  <div
                    className="relative group aspect-[4/3] overflow-hidden rounded-2xl cursor-pointer bg-muted shadow-md hover:shadow-xl transition-all"
                    onClick={() => openLightbox(image, index)}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.05] ${
                        loadedImages.has(image.src) ? 'opacity-100' : 'opacity-0'
                      }`}
                      loading="lazy"
                      decoding="async"
                      onLoad={() => handleImageLoad(image.src)}
                      onError={() => handleImageError(image.src)}
                    />
                    {!loadedImages.has(image.src) && !failedImages.has(image.src) && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
                      <p className="text-xs sm:text-sm font-medium line-clamp-2">{image.alt}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => api?.scrollPrev()}
              aria-label="Précédent"
              className="w-10 h-10 rounded-full bg-background border border-border shadow-sm hover:bg-muted hover:border-accent flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex gap-1.5 max-w-xs overflow-hidden">
              {Array.from({ length: Math.min(count, 12) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => api?.scrollTo(i)}
                  aria-label={`Aller à la diapositive ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === current ? "w-8 bg-accent" : "w-2 bg-border hover:bg-muted-foreground/40"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => api?.scrollNext()}
              aria-label="Suivant"
              className="w-10 h-10 rounded-full bg-background border border-border shadow-sm hover:bg-muted hover:border-accent flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-5xl p-0 bg-black/95 border-none">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-6 w-6" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                onClick={() => navigateImage('prev')}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                onClick={() => navigateImage('next')}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>

              {selectedImage && (
                <div className="flex flex-col items-center">
                  <img
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    className="max-h-[80vh] w-auto object-contain"
                    loading="eager"
                  />
                  <p className="text-white text-center py-4 px-6">{selectedImage.alt}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default PhotoGallery;
