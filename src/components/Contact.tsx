import { Mail, Phone, MapPin, Facebook, Linkedin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Contact = () => {
  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "innocentkoffi1@gmail.com",
      href: "mailto:innocentkoffi1@gmail.com"
    },
    {
      icon: Phone,
      label: "Téléphone",
      value: "+225 07 59 56 60 87",
      href: "tel:+2250759566087"
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "0759566087",
      href: "https://wa.me/2250759566087"
    },
    {
      icon: MapPin,
      label: "Localisation",
      value: "Daloa, Haut-Sassandra, Côte d'Ivoire",
      href: null
    }
  ];

  const socialLinks = [
    {
      icon: Facebook,
      label: "Facebook",
      href: "https://www.facebook.com/share/174mN1Fopy/",
      color: "hover:text-blue-600"
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://www.linkedin.com/comm/mynetwork/discovery-see-all?usecase=PEOPLE_FOLLOWS&followMember=inocent-k-4a08b7159",
      color: "hover:text-blue-700"
    }
  ];

  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-secondary/30 via-background to-secondary/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Travaillons <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Ensemble</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Prêt à démarrer votre projet ? Contactez-moi pour discuter de vos objectifs
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-2xl">
            <CardContent className="p-8 lg:p-12">
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{info.label}</p>
                        {info.href ? (
                          <a 
                            href={info.href}
                            className="text-foreground font-medium hover:text-accent transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-foreground font-medium">{info.value}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-border/50 pt-8">
                <p className="text-center text-muted-foreground mb-6">Suivez-moi sur les réseaux sociaux</p>
                <div className="flex justify-center gap-4">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        size="lg"
                        asChild
                        className={`border-2 ${social.color} transition-all hover:scale-110`}
                      >
                        <a href={social.href} target="_blank" rel="noopener noreferrer">
                          <Icon className="w-5 h-5 mr-2" />
                          {social.label}
                        </a>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
    </section>
  );
};

export default Contact;
