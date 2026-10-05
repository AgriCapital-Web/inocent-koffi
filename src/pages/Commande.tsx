import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CreditCard, Smartphone, MessageCircle, Printer } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useServices, servicePriceLabel, formatFcfa } from "@/hooks/useSiteContent";

const WHATSAPP = "2250759566087";

type Provider = "kkiapay" | "stripe" | "virement";

const providers: { id: Provider; label: string; hint: string; icon: typeof Smartphone }[] = [
  { id: "kkiapay", label: "Mobile Money (Côte d'Ivoire)", hint: "Orange, MTN, Moov, Wave via KKiaPay", icon: Smartphone },
  { id: "stripe", label: "Carte bancaire (international)", hint: "Visa, Mastercard via Stripe", icon: CreditCard },
  { id: "virement", label: "Virement ou paiement à la validation", hint: "Je vous envoie les coordonnées après échange", icon: ArrowRight },
];

const Commande = () => {
  const [params] = useSearchParams();
  const { toast } = useToast();
  const { data: services = [], isLoading } = useServices();
  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState<string>("");
  const [provider, setProvider] = useState<Provider>("kkiapay");
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", deadline: "", budget: "", message: "" });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const slug = params.get("service");

  useEffect(() => {
    if (!serviceId && services.length) {
      const match = slug ? services.find((s) => s.slug === slug) : null;
      setServiceId((match ?? services[0]).id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [services, slug]);

  const service = useMemo(() => services.find((s) => s.id === serviceId) ?? null, [services, serviceId]);

  const submit = async () => {
    if (!service) return;
    if (!form.name.trim() || !form.email.trim()) {
      toast({ title: "Nom et e-mail obligatoires", variant: "destructive" });
      return;
    }
    setSending(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("service_orders").insert({
      service_id: service.id,
      service_slug: service.slug,
      service_title: service.title,
      amount: service.price ?? 0,
      customer_name: form.name.trim(),
      customer_email: form.email.trim(),
      customer_phone: form.phone.trim() || null,
      user_id: user?.id ?? null,
      message: form.message.trim() || null,
      payment_provider: provider,
      options: {
        entreprise: form.company || null,
        echeance: form.deadline || null,
        budget: form.budget || null,
      },
    });
    setSending(false);
    if (error) {
      toast({ title: "Envoi impossible", description: error.message, variant: "destructive" });
      return;
    }
    setDone(true);
    setStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const title = "Démarrer un projet — Commande de service | Inocent KOFFI";
  const description =
    "Commandez un site web, une application, une vidéo IA, un jingle ou un accompagnement IA : options, récapitulatif, paiement Mobile Money ou carte bancaire.";

  const waMessage = encodeURIComponent(
    `Bonjour Inocent, je viens de commander : ${service?.title ?? "un service"}. Nom : ${form.name}.`,
  );

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://ikoffi.agricapital.ci/commande" />
      </Helmet>

      <div className="min-h-screen">
        <Navbar />

        <section className="pt-28 sm:pt-32 pb-16 bg-secondary/30">
          <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground text-center">
              Démarrer un projet
            </h1>
            <p className="mt-3 text-center text-muted-foreground">
              Quatre étapes : le service, vos informations, le récapitulatif, le paiement.
            </p>

            <ol className="mt-8 flex items-center justify-center gap-2 sm:gap-4" aria-label="Étapes de la commande">
              {["Service", "Informations", "Récapitulatif", "Confirmation"].map((label, i) => (
                <li key={label} className="flex items-center gap-2">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                      step > i ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > i + 1 || done ? <Check className="h-4 w-4" /> : i + 1}
                  </span>
                  <span className="hidden text-xs font-medium text-muted-foreground sm:inline">{label}</span>
                  {i < 3 && <span aria-hidden className="h-px w-4 bg-border sm:w-8" />}
                </li>
              ))}
            </ol>

            <motion.div
              key={step}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8"
            >
              {/* Étape 1 — choix du service */}
              {step === 1 && (
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground">Choisissez votre service</h2>
                  {isLoading ? (
                    <p className="mt-6 text-sm text-muted-foreground">Chargement des prestations…</p>
                  ) : (
                    <div className="mt-5 space-y-3">
                      {services.map((s) => (
                        <label
                          key={s.id}
                          className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                            serviceId === s.id ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="service"
                            className="mt-1 accent-current"
                            checked={serviceId === s.id}
                            onChange={() => setServiceId(s.id)}
                          />
                          <span className="flex-1">
                            <span className="block font-semibold text-foreground">{s.title}</span>
                            {s.description && (
                              <span className="mt-1 block text-sm text-muted-foreground">{s.description}</span>
                            )}
                            <Badge variant="secondary" className="mt-2">{servicePriceLabel(s)}</Badge>
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                  <div className="mt-6 flex justify-end">
                    <Button onClick={() => setStep(2)} disabled={!service}>
                      Continuer <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Étape 2 — informations */}
              {step === 2 && (
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground">Vos informations</h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail *</Label>
                      <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="phone">Téléphone / WhatsApp</Label>
                      <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="company">Entreprise / organisation</Label>
                      <Input id="company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="deadline">Échéance souhaitée</Label>
                      <Input id="deadline" placeholder="Ex. dans 3 semaines" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="budget">Budget indicatif</Label>
                      <Input id="budget" placeholder="Ex. 300 000 FCFA" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="message">Décrivez votre projet</Label>
                      <Textarea id="message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      <ArrowLeft className="mr-1.5 h-4 w-4" /> Retour
                    </Button>
                    <Button onClick={() => setStep(3)}>
                      Voir le récapitulatif <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Étape 3 — récapitulatif + paiement */}
              {step === 3 && service && (
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground">Récapitulatif</h2>
                  <dl className="mt-5 divide-y divide-border rounded-xl border border-border">
                    {[
                      ["Service", service.title],
                      ["Montant", service.price == null ? "Sur devis" : formatFcfa(service.price)],
                      ["Nom", form.name || "—"],
                      ["E-mail", form.email || "—"],
                      ["Téléphone", form.phone || "—"],
                      ["Échéance", form.deadline || "—"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4 p-3 text-sm">
                        <dt className="text-muted-foreground">{k}</dt>
                        <dd className="text-right font-medium text-foreground">{v}</dd>
                      </div>
                    ))}
                  </dl>

                  <h3 className="mt-6 font-display text-lg font-bold text-foreground">Moyen de paiement</h3>
                  <div className="mt-3 space-y-3">
                    {providers.map((p) => {
                      const Icon = p.icon;
                      return (
                        <label
                          key={p.id}
                          className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${
                            provider === p.id ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
                          }`}
                        >
                          <input type="radio" name="provider" checked={provider === p.id} onChange={() => setProvider(p.id)} className="mt-1" />
                          <Icon className="mt-0.5 h-5 w-5 text-accent" aria-hidden />
                          <span>
                            <span className="block font-semibold text-foreground">{p.label}</span>
                            <span className="block text-sm text-muted-foreground">{p.hint}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Le paiement en ligne est encaissé après validation du devis : vous recevez un lien de paiement
                    sécurisé Mobile Money ou carte bancaire. Aucune somme n'est prélevée à cette étape.
                  </p>

                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      <ArrowLeft className="mr-1.5 h-4 w-4" /> Retour
                    </Button>
                    <Button onClick={() => void submit()} disabled={sending}>
                      {sending ? "Envoi…" : "Confirmer ma commande"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Étape 4 — confirmation / reçu */}
              {step === 4 && (
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/15">
                    <Check className="h-7 w-7 text-accent" />
                  </div>
                  <h2 className="mt-4 font-display text-2xl font-bold text-foreground">Commande enregistrée</h2>
                  <p className="mt-3 text-muted-foreground">
                    Merci {form.name}. Votre demande pour <strong>{service?.title}</strong> est enregistrée. Je vous
                    réponds sous 24 h ouvrées avec le devis détaillé et votre lien de paiement.
                  </p>
                  <div className="mt-6 rounded-xl border border-border bg-secondary/30 p-4 text-left text-sm">
                    <p className="font-semibold text-foreground">Reçu de commande</p>
                    <p className="mt-2 text-muted-foreground">Service : {service?.title}</p>
                    <p className="text-muted-foreground">
                      Montant : {service?.price == null ? "Sur devis" : formatFcfa(service.price)}
                    </p>
                    <p className="text-muted-foreground">Paiement choisi : {providers.find((p) => p.id === provider)?.label}</p>
                    <p className="text-muted-foreground">Contact : {form.email} {form.phone && `· ${form.phone}`}</p>
                  </div>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Button variant="outline" onClick={() => window.print()}>
                      <Printer className="mr-1.5 h-4 w-4" /> Imprimer le reçu
                    </Button>
                    <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                      <a href={`https://wa.me/${WHATSAPP}?text=${waMessage}`} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="mr-1.5 h-4 w-4" /> Confirmer sur WhatsApp
                      </a>
                    </Button>
                    <Button asChild variant="ghost">
                      <Link to="/boutique">Voir la boutique</Link>
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Commande;
