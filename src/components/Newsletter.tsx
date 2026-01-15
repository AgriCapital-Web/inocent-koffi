import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().email("Veuillez entrer une adresse email valide");

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      toast({
        title: "Email invalide",
        description: validation.error.errors[0].message,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Déjà inscrit",
            description: "Cette adresse email est déjà inscrite à notre newsletter.",
          });
        } else {
          throw error;
        }
      } else {
        // Send email notification
        try {
          await supabase.functions.invoke("send-notification", {
            body: { type: "newsletter", data: { email } },
          });
        } catch (emailError) {
          console.error("Email notification failed:", emailError);
        }

        setIsSubscribed(true);
        setEmail("");
        toast({
          title: "Inscription réussie !",
          description: "Merci de vous être inscrit à notre newsletter.",
        });
      }
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <section className="py-12 sm:py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Merci pour votre inscription !</h3>
            <p className="text-sm sm:text-base opacity-90">
              Vous recevrez bientôt nos actualités et articles directement dans votre boîte mail.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Restez Informé</h2>
          <p className="text-sm sm:text-base lg:text-lg opacity-90 mb-6 sm:mb-8 px-4">
            Inscrivez-vous à notre newsletter pour recevoir nos actualités, articles et perspectives sur la transformation agricole en Afrique.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto px-4 sm:px-0">
            <Input
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:border-accent text-sm sm:text-base"
            />
            <Button 
              type="submit" 
              variant="secondary"
              className="bg-accent text-accent-foreground hover:bg-accent/90 whitespace-nowrap text-sm sm:text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Envoi...
                </>
              ) : (
                "S'inscrire"
              )}
            </Button>
          </form>
          <p className="text-xs sm:text-sm opacity-70 mt-3 sm:mt-4">
            Pas de spam. Désinscription possible à tout moment.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
