import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Handshake, Building2, Users, TrendingUp } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const partnershipSchema = z.object({
  companyName: z.string().trim().min(2, "Le nom de l'entreprise est requis").max(100),
  contactName: z.string().trim().min(2, "Le nom du contact est requis").max(100),
  email: z.string().trim().email("Email invalide").max(255),
  phone: z.string().trim().min(8, "Le téléphone est requis").max(20),
  partnershipType: z.enum(["investment", "distribution", "supply", "technical", "other"], {
    required_error: "Veuillez sélectionner un type de partenariat",
  }),
  message: z.string().trim().min(20, "Le message doit contenir au moins 20 caractères").max(2000),
  website: z.string().trim().url("URL invalide").optional().or(z.literal("")),
});

type PartnershipFormData = z.infer<typeof partnershipSchema>;

const Partnership = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PartnershipFormData>({
    resolver: zodResolver(partnershipSchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      email: "",
      phone: "",
      partnershipType: undefined,
      message: "",
      website: "",
    },
  });

  const onSubmit = async (data: PartnershipFormData) => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("partnership_requests").insert({
        company_name: data.companyName,
        contact_name: data.contactName,
        email: data.email,
        phone: data.phone,
        partnership_type: data.partnershipType,
        message: data.message,
        website: data.website || null,
      });

      if (error) throw error;

      toast({
        title: "Demande de partenariat envoyée ! ✅",
        description: "Nous vous contacterons dans les plus brefs délais. Merci pour votre intérêt !",
      });

      form.reset();
    } catch (error) {
      console.error("Error submitting partnership request:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const partnershipTypes = [
    { value: "investment", label: "Investissement", icon: TrendingUp },
    { value: "distribution", label: "Distribution", icon: Building2 },
    { value: "supply", label: "Fourniture", icon: Building2 },
    { value: "technical", label: "Partenariat Technique", icon: Users },
    { value: "other", label: "Autre", icon: Handshake },
  ];

  return (
    <section id="partnership" className="py-20 px-4 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4">
            <Handshake className="w-5 h-5 text-accent" />
            <span className="text-sm font-semibold text-accent-foreground">Partenariat</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
            Devenez Notre Partenaire
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Rejoignez-nous dans notre mission de transformer l'agriculture africaine et de créer un impact durable
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: TrendingUp,
              title: "Investissement",
              description: "Participez à la croissance d'un secteur en pleine expansion",
            },
            {
              icon: Building2,
              title: "Distribution",
              description: "Élargissez votre réseau avec nos produits de qualité",
            },
            {
              icon: Users,
              title: "Collaboration",
              description: "Partageons nos expertises pour un impact maximal",
            },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} className="border-2 hover:border-accent/50 transition-all hover:shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-2 shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardContent className="p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <Handshake className="w-7 h-7 text-primary" />
              <h3 className="text-2xl font-bold">Formulaire de Demande de Partenariat</h3>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de l'Entreprise *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: ABC Industries" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du Contact *</FormLabel>
                        <FormControl>
                          <Input placeholder="Jean Kouassi" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Professionnel *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="contact@entreprise.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone *</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+225 XX XX XX XX XX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="partnershipType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de Partenariat *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {partnershipTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Web (optionnel)</FormLabel>
                        <FormControl>
                          <Input type="url" placeholder="https://www.entreprise.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Décrivez votre Proposition de Partenariat *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Expliquez votre proposition de partenariat, vos objectifs et comment nous pouvons collaborer ensemble..."
                          className="min-h-[200px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                >
                  {isSubmitting ? "Envoi en cours..." : "Envoyer la Demande de Partenariat"}
                </Button>
              </form>
            </Form>

            <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground text-center">
                📋 Votre demande sera examinée par notre équipe dans les 48 heures. Nous vous contacterons rapidement.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Partnership;
