import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import profilePhoto from "@/assets/profile-photo.jpg";
import SocialShare from "@/components/SocialShare";
import AgriSearch from "@/components/AgriSearch";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-secondary to-background">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center max-w-6xl mx-auto">
          {/* Image Section */}
          <motion.div 
            className="order-2 lg:order-1 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <motion.div 
                className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-4 border-accent/20"
                whileHover={{ scale: 1.03, rotate: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img 
                  src={profilePhoto} 
                  alt="Inocent KOFFI - Fondateur & CEO AGRICAPITAL SARL" 
                  className="w-full h-auto max-w-[280px] sm:max-w-[350px] lg:max-w-md object-cover"
                  loading="eager"
                  width="500"
                  height="600"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Text Section */}
          <div className="order-1 lg:order-2 text-center lg:text-left space-y-4 sm:space-y-6">
            <motion.div 
              className="flex flex-wrap gap-2 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-accent/10 text-accent rounded-full text-xs sm:text-sm font-semibold">
                Fondateur & CEO — AGRICAPITAL SARL
              </span>
              <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-semibold">
                Agro-Entrepreneur & Stratège Agricole
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Inocent
              <motion.span 
                className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mt-1 sm:mt-2"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                KOFFI
              </motion.span>
            </motion.h1>

            <motion.p 
              className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Agro-entrepreneur et stratège en développement agricole. Fondateur & CEO d'AGRICAPITAL SARL — opérateur et promoteur agricole spécialisé dans la création de plantations de palmier à huile clé en main en Côte d'Ivoire. 12+ années d'immersion terrain au service de l'agriculture et de l'innovation.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2 sm:pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
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
                <Link to="/agricapital">Découvrir AGRICAPITAL</Link>
              </Button>
            </motion.div>

            {/* Social Share Buttons */}
            <motion.div 
              className="pt-2 sm:pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <SocialShare className="justify-center lg:justify-start" />
            </motion.div>

            {/* Quick Contact Info */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-1 sm:pt-2 text-xs sm:text-sm text-muted-foreground justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
                <span>Daloa, Côte d'Ivoire</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-10 max-w-6xl mx-auto">
          <AgriSearch />
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-48 sm:w-72 h-48 sm:h-72 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-64 sm:w-96 h-64 sm:h-96 bg-primary/10 rounded-full blur-3xl"></div>
    </section>
  );
};

export default Hero;
