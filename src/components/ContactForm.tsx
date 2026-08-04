import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Send, CheckCircle2, ShieldCheck, MessageCircle } from "lucide-react";
import { trackCta, trackEvent, trackLead } from "@/lib/analytics";
import { useLanguage } from "@/hooks/useLanguage";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères")
    .regex(/^[\p{L}\p{M}\s'’.-]+$/u, "Le nom contient des caractères non autorisés"),
  email: z
    .string()
    .trim()
    .email("Adresse email invalide")
    .max(255, "L'email ne peut pas dépasser 255 caractères"),
  phone: z
    .string()
    .trim()
    .max(25, "Numéro trop long")
    .regex(/^[+0-9\s().-]*$/, "Numéro de téléphone invalide")
    .optional()
    .or(z.literal("")),
  subject: z.enum(["partenariat", "investissement", "plantation", "presse", "autre"], {
    errorMap: () => ({ message: "Veuillez choisir un objet" }),
  }),
  message: z
    .string()
    .trim()
    .min(20, "Le message doit contenir au moins 20 caractères")
    .max(2000, "Le message ne peut pas dépasser 2000 caractères")
    .refine((v) => !/(https?:\/\/|www\.)\S+/i.test(v), {
      message: "Les liens ne sont pas autorisés dans le message",
    }),
  // Anti-spam honeypot — must stay empty
  company_url: z.string().max(0, "Champ invalide").optional().or(z.literal("")),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { language } = useLanguage();
  const mountedAt = useRef<number>(Date.now());
  const lastSubmitAt = useRef<number>(0);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "partenariat",
      message: "",
      company_url: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    // Anti-spam: honeypot filled → silently drop
    if (data.company_url) {
      trackEvent("form_spam_blocked", { form_name: "contact", reason: "honeypot" });
      setIsSubmitted(true);
      form.reset();
      return;
    }

    // Anti-spam: submitted too fast (bots) or repeated within 30s
    if (Date.now() - mountedAt.current < 3000) {
      trackEvent("form_spam_blocked", { form_name: "contact", reason: "time_trap" });
      toast({
        title: "Un instant…",
        description: "Merci de prendre quelques secondes pour compléter le formulaire.",
        variant: "destructive",
      });
      return;
    }
    if (Date.now() - lastSubmitAt.current < 30000) {
      toast({
        title: "Message déjà envoyé",
        description: "Merci de patienter avant d'envoyer un nouveau message.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const subjectLabels: Record<ContactFormData["subject"], string> = {
        partenariat: "Partenariat stratégique",
        investissement: "Investissement agricole",
        plantation: "Plantation clé en main",
        presse: "Presse / Média",
        autre: "Autre demande",
      };

      const insertData = {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        message: `[${subjectLabels[data.subject]}]\n\n${data.message}`,
      };

      const { error } = await supabase.from("contact_messages").insert(insertData);

      if (error) throw error;

      // Send email notification
      try {
        await supabase.functions.invoke("send-notification", {
          body: {
            type: "contact",
            lang: language === "en" ? "en" : "fr",
            data: { ...insertData, subject: subjectLabels[data.subject] },
          },
        });
      } catch (emailError) {
        console.error("Email notification failed:", emailError);
      }

      lastSubmitAt.current = Date.now();
      trackLead("contact", { subject: data.subject });

      toast({
        title: "Message envoyé avec succès ! ✅",
        description: "Vous recevrez une réponse sous 24 à 48 heures ouvrées.",
      });

      setIsSubmitted(true);
      form.reset();
    } catch (error) {
      console.error("Error submitting contact:", error);
      trackEvent("form_error", { form_name: "contact" });
      toast({
        title: "Erreur",
        description:
          "L'envoi a échoué. Réessayez ou écrivez directement à inocent.koffi@agricapital.ci.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="border-2 shadow-xl bg-card/80 backdrop-blur-sm">
        <CardContent className="p-8 md:p-12 text-center">
          <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Demande reçue, merci !
          </h3>
          <p className="text-muted-foreground mb-2">
            Votre message a bien été transmis à Inocent KOFFI, Gérant d'AGRICAPITAL SARL.
          </p>
          <p className="text-muted-foreground mb-8">
            Réponse garantie sous <strong>24 à 48 heures ouvrées</strong>. Pour une demande urgente,
            écrivez-nous sur WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-[#25D366] hover:bg-[#20bf5a] text-white">
              <a
                href="https://wa.me/2250759566087"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCta("whatsapp", "contact_form_success")}
              >
                <MessageCircle className="w-4 h-4 mr-2" aria-hidden="true" />
                Discuter sur WhatsApp
              </a>
            </Button>
            <Button onClick={() => setIsSubmitted(false)} variant="outline">
              Envoyer un autre message
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 shadow-xl bg-card/80 backdrop-blur-sm">
      <CardContent className="p-8 md:p-12">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Envoyez-moi un Message
        </h3>
        <p className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" aria-hidden="true" />
          Vos informations restent confidentielles — aucune revente, aucun spam.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom Complet *</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre nom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="votre@email.com" {...field} />
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
                  <FormLabel>Téléphone (optionnel)</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+225 XX XX XX XX XX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objet de votre demande *</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="partenariat">Partenariat stratégique</option>
                      <option value="investissement">Investissement agricole</option>
                      <option value="plantation">Plantation clé en main</option>
                      <option value="presse">Presse / Média</option>
                      <option value="autre">Autre demande</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Anti-spam honeypot — hidden from humans */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="company_url">Company URL</label>
              <input
                id="company_url"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...form.register("company_url")}
              />
            </div>

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Votre message..."
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
              className="w-full bg-gradient-to-r from-primary to-primary/90"
              size="lg"
            >
              {isSubmitting ? (
                "Envoi en cours..."
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Envoyer le Message
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
