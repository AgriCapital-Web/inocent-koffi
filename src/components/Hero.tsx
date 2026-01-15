import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import profilePhoto from "@/assets/profile-photo.jpg";
import SocialShare from "@/components/SocialShare";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-secondary to-background">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center max-w-6xl mx-auto">
          {/* Image Section */}
          <div className="order-2 lg:order-1 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-4 border-accent/20">
                <img 
                  src={profilePhoto} 
                  alt="Inocent KOFFI - Fondateur et Directeur Général AGRICAPITAL SARL" 
                  className="w-full h-auto max-w-[280px] sm:max-w-[350px] lg:max-w-md object-cover"
                  loading="eager"
                  width="500"
                  height="600"
                />
              </div>
            </div>
          </div>

          {/* Text Section */}
          <div className="order-1 lg:order-2 text-center lg:text-left space-y-4 sm:space-y-6">
            <div className="inline-block">
              <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-accent/10 text-accent rounded-full text-xs sm:text-sm font-semibold">
                Fondateur & DG AGRICAPITAL SARL
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground">
              Inocent
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mt-1 sm:mt-2">
                KOFFI
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
              12 années d'immersion au cœur des communautés rurales ivoiriennes pour bâtir une agriculture africaine prospère et durable.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2 sm:pt-4">
              <Button 
                variant="default" 
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg transition-all w-full sm:w-auto text-sm sm:text-base"
                asChild
              >
                <Link to="/contact">
                  Me Contacter
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 hover:bg-accent/10 w-full sm:w-auto text-sm sm:text-base"
                asChild
              >
                <Link to="/a-propos">En Savoir Plus</Link>
              </Button>
            </div>

            {/* Social Share Buttons */}
            <div className="pt-2 sm:pt-4">
              <SocialShare className="justify-center lg:justify-start" />
            </div>

            {/* Quick Contact Info */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-1 sm:pt-2 text-xs sm:text-sm text-muted-foreground justify-center lg:justify-start">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
                <span>Daloa, Côte d'Ivoire</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-48 sm:w-72 h-48 sm:h-72 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-64 sm:w-96 h-64 sm:h-96 bg-primary/10 rounded-full blur-3xl"></div>
    </section>
  );
};

export default Hero;