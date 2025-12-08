import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Quote, Star, ChevronLeft, ChevronRight, MessageSquarePlus, User } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import Testimonials from "./Testimonials";

interface Testimonial {
  id: string;
  first_name: string;
  last_name: string;
  locality: string;
  message: string;
  rating: number | null;
  photo_url: string | null;
  created_at: string;
  is_approved: boolean;
}

const TestimonialsDisplay = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  // Auto-slide every 6 seconds
  useEffect(() => {
    if (testimonials.length > 1) {
      const interval = setInterval(nextSlide, 6000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  const renderStars = (rating: number | null) => {
    const stars = rating || 5;
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 transition-all ${
              star <= stars 
                ? "fill-accent text-accent drop-shadow-sm" 
                : "text-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-muted/20 via-background to-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16 space-y-4">
          <Badge variant="outline" className="mb-4 border-accent text-accent">
            Témoignages
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
            Ce Qu'ils Disent de Nous
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez les témoignages de nos partenaires et producteurs agricoles
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : testimonials.length > 0 ? (
          <div className="relative">
            {/* Carousel */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                    {/* Modern Testimonial Card with asymmetric borders */}
                    <div className="relative group">
                      {/* Decorative corner accents */}
                      <div className="absolute -top-1 -right-1 w-24 h-24 border-t-4 border-r-4 border-primary rounded-tr-3xl opacity-60 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute -bottom-1 -left-1 w-24 h-24 border-b-4 border-l-4 border-accent rounded-bl-3xl opacity-60 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="bg-card/90 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl hover:shadow-2xl transition-all duration-300 border border-border/50">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                          {/* Photo Section with modern frame */}
                          <div className="flex-shrink-0 mx-auto md:mx-0">
                            <div className="relative">
                              {/* Gradient ring around photo */}
                              <div className="absolute -inset-1 bg-gradient-to-br from-primary via-primary/50 to-accent rounded-full blur-sm opacity-70" />
                              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden ring-4 ring-background shadow-lg">
                                {testimonial.photo_url ? (
                                  <img 
                                    src={testimonial.photo_url} 
                                    alt={`${testimonial.first_name} ${testimonial.last_name}`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                    <span className="text-2xl md:text-3xl font-bold text-primary-foreground">
                                      {testimonial.first_name[0]}{testimonial.last_name[0]}
                                    </span>
                                  </div>
                                )}
                              </div>
                              {/* Small accent dot */}
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent rounded-full border-4 border-background shadow-md" />
                            </div>
                          </div>

                          {/* Content Section */}
                          <div className="flex-1 text-center md:text-left">
                            <Quote className="w-10 h-10 text-primary/20 mb-4 mx-auto md:mx-0" />
                            <p className="text-lg md:text-xl text-foreground leading-relaxed mb-6 italic">
                              "{testimonial.message}"
                            </p>
                            
                            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
                              <div>
                                <p className="font-bold text-lg text-foreground">
                                  {testimonial.first_name} {testimonial.last_name}
                                </p>
                                <p className="text-sm text-muted-foreground flex items-center gap-1 justify-center md:justify-start">
                                  <span className="inline-block w-1.5 h-1.5 bg-accent rounded-full" />
                                  {testimonial.locality}
                                </p>
                              </div>
                              <div className="flex flex-col items-center md:items-end gap-1">
                                {renderStars(testimonial.rating)}
                                <span className="text-xs text-muted-foreground">
                                  {new Date(testimonial.created_at).toLocaleDateString('fr-FR', { 
                                    month: 'short', 
                                    year: 'numeric' 
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            {testimonials.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 w-12 h-12 rounded-full bg-card border-2 border-primary/20 shadow-lg flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 z-10"
                  aria-label="Témoignage précédent"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 w-12 h-12 rounded-full bg-card border-2 border-primary/20 shadow-lg flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 z-10"
                  aria-label="Témoignage suivant"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Dots Indicator */}
            {testimonials.length > 1 && (
              <div className="flex justify-center gap-3 mt-10">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? "bg-gradient-to-r from-primary to-accent w-10" 
                        : "bg-muted-foreground/20 hover:bg-muted-foreground/40 w-2"
                    }`}
                    aria-label={`Aller au témoignage ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="relative inline-block">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-xl" />
              <Quote className="relative w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            </div>
            <p className="text-muted-foreground mb-6">
              Soyez le premier à partager votre expérience avec AgriCapital !
            </p>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-14">
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary/90 shadow-lg hover:shadow-xl transition-shadow">
                <MessageSquarePlus className="w-5 h-5 mr-2" />
                Laisser un Témoignage
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <Testimonials />
            </DialogContent>
          </Dialog>

          {testimonials.length > 0 && (
            <Button variant="outline" size="lg" asChild className="border-2 hover:bg-accent/10 hover:border-accent transition-colors">
              <Link to="/projets">
                Voir Tous les Témoignages
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsDisplay;
