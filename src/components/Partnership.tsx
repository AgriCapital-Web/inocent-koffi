import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Handshake, CheckCircle2 } from "lucide-react";
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
  partnershipType: z.enum(["investment", "supply", "technical", "industrial", "cooperative", "ong", "other"], {
    required_error: "Veuillez sélectionner un type de partenariat",
  }),
  message: z.string().trim().min(20, "Le message doit contenir au moins 20 caractères").max(2000),
  website: z.string().trim().url("URL invalide").optional().or(z.literal("")),
});

type PartnershipFormData = z.infer<typeof partnershipSchema>;

const Partnership = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

      setIsSubmitted(true);
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
    { value: "investment", label: "Investissement" },
    { value: "supply", label: "Fourniture d'intrants" },
    { value: "technical", label: "Partenariat Technique" },
    { value: "industrial", label: "Industriels & Acheteurs" },
    { value: "cooperative", label: "Coopératives & Organisations Paysannes" },
    { value: "ong", label: "ONG & Institutions" },
    { value: "other", label: "Autre" },
  ];

  if (isSubmitted) {
    return (
      <div className="p-8 text-center">
        <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-foreground mb-4">
          Demande Envoyée !
        </h3>
        <p className="text-muted-foreground mb-6">
          Merci pour votre intérêt. Notre équipe examinera votre demande et vous contactera dans les plus brefs délais.
        </p>
        <Button onClick={() => setIsSubmitted(false)} variant="outline">
          Envoyer une autre demande
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center gap-3 mb-8">
        <Handshake className="w-7 h-7 text-primary" />
        <h3 className="text-2xl font-bold">Demande de Partenariat</h3>
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
                    className="min-h-[150px] resize-none"
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

      <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
        <p className="text-sm text-muted-foreground text-center">
          📋 Votre demande sera examinée par notre équipe dans les 48 heures.
        </p>
      </div>
    </div>
  );
};

export default Partnership;
