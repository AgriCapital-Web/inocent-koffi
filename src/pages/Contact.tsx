import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/Contact";
import { Helmet } from "react-helmet-async";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Globe, Clock } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "Inocent.koffi@agricapital.ci",
      href: "mailto:Inocent.koffi@agricapital.ci"
    },
    {
      icon: Phone,
      label: "Téléphone",
      value: "07 59 56 60 87",
      href: "tel:+2250759566087"
    },
    {
      icon: MapPin,
      label: "Adresse",
      value: "Daloa, Haut-Sassandra, Côte d'Ivoire",
      href: null
    },
    {
      icon: Globe,
      label: "Site Web",
      value: "www.agricapital.ci",
      href: "https://www.agricapital.ci"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Contact - Inocent KOFFI | AGRICAPITAL SARL</title>
        <meta name="description" content="Contactez Inocent KOFFI, fondateur d'AGRICAPITAL SARL. Daloa, Côte d'Ivoire. Email, téléphone et formulaire de contact." />
        <link rel="canonical" href="https://www.ikoffi.agricapital.ci/contact" />
      </Helmet>
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-br from-background via-secondary/30 to-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <Badge variant="outline" className="mb-4">Contact</Badge>
                <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-foreground">
                  Prenons <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Contact</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Une question, une idée de collaboration ou simplement envie d'échanger ? N'hésitez pas à me contacter.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Info Cards */}
          <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon;
                    const content = (
                      <div className="p-6 rounded-xl bg-card border border-border/50 hover:border-accent/50 hover:shadow-lg transition-all text-center h-full">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{info.label}</p>
                        <p className="font-medium text-foreground">{info.value}</p>
                      </div>
                    );

                    return info.href ? (
                      <a key={index} href={info.href} target={info.href.startsWith('http') ? '_blank' : undefined} rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}>
                        {content}
                      </a>
                    ) : (
                      <div key={index}>{content}</div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Contact Form */}
          <ContactForm />

          {/* Availability */}
          <section className="py-12 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-accent" />
                  <span className="text-muted-foreground">Disponibilité</span>
                </div>
                <p className="text-foreground">
                  Je m'efforce de répondre à tous les messages dans un délai de <strong>24 à 48 heures</strong>.
                </p>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Contact;
