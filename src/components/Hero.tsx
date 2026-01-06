import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import profilePhoto from "@/assets/profile-photo.jpg";
import SocialShare from "@/components/SocialShare";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-secondary to-background">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Image Section */}
          <div className="order-2 lg:order-1 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-accent/20">
                <img 
                  src={profilePhoto} 
                  alt="Inocent KOFFI - Fondateur et Directeur Général AGRICAPITAL SARL" 
                  className="w-full h-auto max-w-md object-cover"
                  loading="eager"
                  width="500"
                  height="600"
                />
              </div>
            </div>
          </div>

          {/* Text Section */}
          <div className="order-1 lg:order-2 text-center lg:text-left space-y-6">
            <div className="inline-block">
              <span className="px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-semibold">
                Fondateur & DG AGRICAPITAL SARL
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-foreground">
              Inocent
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mt-2">
                KOFFI
              </span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              12 années d'immersion au cœur des communautés rurales ivoiriennes pour bâtir une agriculture africaine prospère et durable.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button 
                variant="default" 
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all"
                asChild
              >
                <Link to="/contact">
                  Me Contacter
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 hover:bg-accent/10"
                asChild
              >
                <Link to="/a-propos">En Savoir Plus</Link>
              </Button>
            </div>

            {/* Social Share Buttons */}
            <div className="pt-4">
              <SocialShare className="justify-center lg:justify-start" />
            </div>

            {/* Quick Contact Info */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2 text-sm text-muted-foreground justify-center lg:justify-start">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                <span>Daloa, Côte d'Ivoire</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
    </section>
  );
};

export default Hero;