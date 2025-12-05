import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Quote, Upload, Star, CheckCircle2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const testimonialSchema = z.object({
  firstName: z.string().trim().min(2, "Le prénom doit contenir au moins 2 caractères").max(50),
  lastName: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères").max(50),
  email: z.string().trim().email("Email invalide").max(255),
  phone: z.string().trim().optional(),
  locality: z.string().trim().min(2, "La localité est requise").max(100),
  message: z.string().trim().min(20, "Le message doit contenir au moins 20 caractères").max(1000),
  rating: z.number().min(1).max(5).default(5),
  photo: z
    .any()
    .optional()
    .refine((files) => !files || files.length === 0 || files[0]?.size <= MAX_FILE_SIZE, "La taille maximale est 5MB")
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files[0]?.type),
      "Formats acceptés: .jpg, .jpeg, .png, .webp"
    ),
});

type TestimonialFormData = z.infer<typeof testimonialSchema>;

const Testimonials = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      locality: "",
      message: "",
      rating: 5,
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: TestimonialFormData) => {
    setIsSubmitting(true);

    try {
      let photoUrl = null;

      const insertData = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone || null,
        locality: data.locality,
        message: data.message,
        rating: data.rating,
        photo_url: photoUrl,
      };

      const { error } = await supabase.from("testimonials").insert(insertData);

      if (error) throw error;

      // Send email notification
      try {
        await supabase.functions.invoke("send-notification", {
          body: { type: "testimonial", data: insertData },
        });
      } catch (emailError) {
        console.error("Email notification failed:", emailError);
      }

      toast({
        title: "Témoignage envoyé avec succès ! ✅",
        description: "Votre témoignage sera publié après validation. Merci pour votre confiance !",
      });

      form.reset();
      setPhotoPreview(null);
      setSelectedRating(5);
      setCurrentStep(1);
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalSteps = 3;

  return (
    <section id="testimonials" className="py-20 px-4 bg-gradient-to-b from-muted/30 via-background to-muted/30">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16 space-y-4">
          <Badge variant="outline" className="mb-4">Témoignages</Badge>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Partagez Votre Expérience
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Votre témoignage est précieux et contribue à notre mission de transformer l'agriculture ivoirienne
          </p>
        </div>

        <Card className="border-2 shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardContent className="p-8 md:p-12">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                        currentStep >= step
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {currentStep > step ? <CheckCircle2 className="w-5 h-5" /> : step}
                    </div>
                    {step < 3 && (
                      <div
                        className={`flex-1 h-1 mx-2 transition-all ${
                          currentStep > step ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Informations</span>
                <span>Localisation</span>
                <span>Témoignage</span>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Personal Info */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <Quote className="w-6 h-6 text-primary" />
                      <h3 className="text-xl font-bold">Vos Informations</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prénom *</FormLabel>
                            <FormControl>
                              <Input placeholder="Jean" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom *</FormLabel>
                            <FormControl>
                              <Input placeholder="Kouassi" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="jean.kouassi@example.com" {...field} />
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
                            <Input type="tel" placeholder="+225 07 XX XX XX XX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 2: Location & Photo */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <Quote className="w-6 h-6 text-primary" />
                      <h3 className="text-xl font-bold">Localisation & Photo</h3>
                    </div>

                    <FormField
                      control={form.control}
                      name="locality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Localité / Village *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Daloa, Yamoussoukro..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="photo"
                      render={({ field: { onChange, value, ...field } }) => (
                        <FormItem>
                          <FormLabel>Photo (optionnel)</FormLabel>
                          <FormControl>
                            <div className="space-y-4">
                              <div className="flex items-center gap-4">
                                <Input
                                  type="file"
                                  accept={ACCEPTED_IMAGE_TYPES.join(",")}
                                  onChange={(e) => {
                                    onChange(e.target.files);
                                    handlePhotoChange(e);
                                  }}
                                  {...field}
                                  className="cursor-pointer"
                                />
                                <Upload className="w-5 h-5 text-muted-foreground" />
                              </div>
                              {photoPreview && (
                                <div className="relative w-40 h-40 rounded-xl overflow-hidden border-4 border-primary shadow-lg">
                                  <img
                                    src={photoPreview}
                                    alt="Prévisualisation de votre photo"
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                                    <span className="text-white text-xs font-semibold">Votre photo</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 3: Message & Rating */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <Quote className="w-6 h-6 text-primary" />
                      <h3 className="text-xl font-bold">Votre Témoignage</h3>
                    </div>

                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Évaluation *</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => {
                                    setSelectedRating(star);
                                    field.onChange(star);
                                  }}
                                  className="transition-transform hover:scale-110"
                                >
                                  <Star
                                    className={`w-8 h-8 ${
                                      star <= selectedRating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Votre Message *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Partagez votre expérience avec AgriCapital..."
                              className="min-h-[150px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(currentStep - 1)}
                    >
                      Précédent
                    </Button>
                  )}
                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className="ml-auto"
                    >
                      Suivant
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="ml-auto bg-gradient-to-r from-primary to-primary/90"
                    >
                      {isSubmitting ? "Envoi en cours..." : "Envoyer mon témoignage"}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Info Box */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            ℹ️ Votre témoignage sera publié après validation par notre équipe. Merci de votre confiance !
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
