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
  const [expanded, setExpanded] = useState<Testimonial | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from("public_testimonials" as any)
        .select("id, first_name, locality, message, rating, photo_url, created_at, is_approved")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setTestimonials(((data as unknown) as Testimonial[]) || []);
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
    <section className="py-14 sm:py-20 px-4 bg-gradient-to-b from-muted/20 via-background to-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="text-center mb-10 space-y-3">
          <Badge variant="outline" className="mb-4 border-accent text-accent">
            Témoignages
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
            Ce Qu'ils Disent de Nous
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Découvrez les témoignages de nos partenaires et producteurs agricoles
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : testimonials.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((testimonial) => (
              <button
                key={testimonial.id}
                type="button"
                onClick={() => setExpanded(testimonial)}
                className="text-left bg-card border border-border/60 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-accent/50 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-background shadow-sm flex-shrink-0">
                    {testimonial.photo_url ? (
                      <img src={testimonial.photo_url} alt={testimonial.first_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
                        {testimonial.first_name?.[0] ?? "?"}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-foreground truncate">{testimonial.first_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{testimonial.locality}</p>
                  </div>
                  <div className="flex-shrink-0">{renderStars(testimonial.rating)}</div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3 italic">"{testimonial.message}"</p>
                <span className="inline-block mt-2 text-xs font-semibold text-accent">Lire plus →</span>
              </button>
            ))}
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
