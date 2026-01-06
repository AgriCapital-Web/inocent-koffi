import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X, Camera } from "lucide-react";

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
  { id: '4', src: '/images/gallery/launch-4.jpg', alt: 'Lancement AGRICAPITAL - Premiers producteurs', category: 'launch' },
  { id: '5', src: '/images/gallery/launch-5.jpg', alt: 'Lancement AGRICAPITAL - Site de pépinière', category: 'launch' },
  { id: '6', src: '/images/gallery/launch-6.jpg', alt: 'Lancement AGRICAPITAL - Sensibilisation', category: 'launch' },
  { id: '7', src: '/images/gallery/launch-7.jpg', alt: 'Lancement AGRICAPITAL - Opérations techniques', category: 'launch' },
  { id: '8', src: '/images/gallery/community-1.jpg', alt: 'Réunion communautaire - Village 1', category: 'community' },
  { id: '9', src: '/images/gallery/community-2.jpg', alt: 'Réunion communautaire - Producteurs', category: 'community' },
  { id: '10', src: '/images/gallery/community-3.png', alt: 'Réunion communautaire - Sensibilisation', category: 'community' },
  { id: '11', src: '/images/gallery/community-4.jpg', alt: 'Réunion communautaire - Engagement', category: 'community' },
  { id: '12', src: '/images/gallery/community-5.jpg', alt: 'Réunion communautaire - Partenariat local', category: 'community' },
  // Pépinière et évolution du projet
  { id: '13', src: '/images/nursery-palm.jpg', alt: 'Pépinière de palmiers à huile - 50 hectares', category: 'nursery' },
  { id: '14', src: '/images/palm-oil-production.jpg', alt: 'Production de palmiers - Évolution du projet', category: 'nursery' },
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

  const filteredImages = activeFilter === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeFilter);

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

  return (
    <section id="gallery" className="py-20 px-4 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 space-y-4">
          <Badge variant="outline" className="mb-4">
            <Camera className="w-3 h-3 mr-1" />
            En Images
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Galerie Photo
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Découvrez les moments clés du lancement d'AGRICAPITAL SARL, le 19 novembre 2025. 
            Une journée marquant le début d'une nouvelle ère pour l'agriculture dans le Haut-Sassandra.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {filters.map((filter) => (
            <Button
              key={filter.key}
              variant={activeFilter === filter.key ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter.key)}
              className="transition-all"
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="relative group aspect-square overflow-hidden rounded-xl cursor-pointer"
              onClick={() => openLightbox(image, index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-sm font-medium line-clamp-2">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
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
