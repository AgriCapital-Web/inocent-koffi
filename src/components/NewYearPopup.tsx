import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Sparkles } from "lucide-react";
import profilePhoto from "@/assets/profile-photo.jpg";

const NewYearPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Popup expires on January 31, 2025 at 23:59:59
    const expirationDate = new Date('2025-01-31T23:59:59');
    const now = new Date();
    
    // Check if popup should be shown
    if (now > expirationDate) {
      return;
    }

    // Check if user has already dismissed the popup in this session
    const dismissed = sessionStorage.getItem('newYearPopupDismissed');
    if (!dismissed) {
      // Show popup after a small delay for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('newYearPopupDismissed', 'true');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-0 bg-transparent shadow-none">
        <div className="relative bg-gradient-to-br from-primary via-primary/95 to-accent rounded-3xl overflow-hidden shadow-2xl">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary-foreground/10 rounded-full blur-3xl animate-pulse"></div>
            <Sparkles className="absolute top-4 right-12 w-6 h-6 text-accent/60 animate-bounce" />
            <Sparkles className="absolute top-12 left-8 w-4 h-4 text-accent/40 animate-bounce" style={{ animationDelay: '0.5s' }} />
            <Sparkles className="absolute bottom-20 right-8 w-5 h-5 text-accent/50 animate-bounce" style={{ animationDelay: '0.3s' }} />
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5 text-primary-foreground" />
          </button>

          <div className="relative z-10 p-6 sm:p-8 text-center">
            {/* Year */}
            <div className="mb-4">
              <span className="text-7xl sm:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary-foreground to-accent">
                2025
              </span>
            </div>

            {/* Photo */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary-foreground rounded-full blur-lg opacity-50 animate-pulse"></div>
              <img
                src={profilePhoto}
                alt="Inocent KOFFI"
                className="relative w-full h-full rounded-full object-cover border-4 border-accent/50 shadow-xl"
              />
            </div>

            {/* Logo text */}
            <div className="mb-4">
              <span className="text-xs sm:text-sm font-semibold tracking-widest text-accent/80 uppercase">
                AGRICAPITAL SARL
              </span>
            </div>

            {/* Greeting */}
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-2">
              Bonne Année !
            </h2>

            {/* Message */}
            <p className="text-primary-foreground/90 text-sm sm:text-base leading-relaxed mb-6 max-w-sm mx-auto">
              Je vous souhaite une année 2025 remplie de succès, de santé et de prospérité. 
              Ensemble, continuons à transformer l'agriculture africaine !
            </p>

            {/* Signature */}
            <p className="text-accent font-semibold mb-6">
              — Inocent KOFFI
            </p>

            {/* CTA Button */}
            <Button
              onClick={handleClose}
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              Merci & Bonne Année !
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewYearPopup;