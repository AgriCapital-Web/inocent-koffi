import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageCircle, Mail, Send, ArrowRight, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const WHATSAPP_NUMBER = "2250759566087";
const EMAIL_PRIMARY = "Inocent.koffi@agricapital.ci";
const EMAIL_SECONDARY = "innocentkoffi1@gmail.com";
const EMAIL_TO = `${EMAIL_PRIMARY},${EMAIL_SECONDARY}`;
const MAILTO = `mailto:${EMAIL_PRIMARY}?cc=${EMAIL_SECONDARY}&subject=${encodeURIComponent("Contact depuis ikoffi.agricapital.ci")}`;

const ContactCTA = () => {
  const { language } = useLanguage();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const t = {
    fr: {
      tag: "Parlons de votre projet",
      title: "Investisseurs, partenaires, producteurs — échangeons.",
      desc: "Réponse personnelle sous 24h ouvrées. WhatsApp pour un échange direct, ou message rapide ci-contre.",
      whatsapp: "Discuter sur WhatsApp",
      email: "Envoyer un email",
      formTitle: "Message rapide",
      name: "Votre nom",
      contact: "Email ou WhatsApp",
      message: "Décrivez brièvement votre projet…",
      send: "Envoyer",
      sent: "Message envoyé. Merci !",
      err: "Erreur, réessayez ou utilisez WhatsApp.",
      trust: "Données confidentielles · Aucun spam",
      wa: "Bonjour Inocent, je viens du site et je souhaite échanger avec vous.",
    },
    en: {
      tag: "Let's talk about your project",
      title: "Investors, partners, producers — let's connect.",
      desc: "Personal reply within 24 business hours. WhatsApp for a direct chat, or quick message on the right.",
      whatsapp: "Chat on WhatsApp",
      email: "Send an email",
      formTitle: "Quick message",
      name: "Your name",
      contact: "Email or WhatsApp",
      message: "Briefly describe your project…",
      send: "Send",
      sent: "Message sent. Thank you!",
      err: "Error, please retry or use WhatsApp.",
      trust: "Confidential · No spam",
      wa: "Hello Inocent, I'm coming from your website and would like to connect.",
    },
  }[language === "fr" ? "fr" : "en"];

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t.wa)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !message.trim()) return;
    setLoading(true);
    try {
      const isEmail = contact.includes("@");
      const { error } = await supabase.from("contact_messages").insert({
        name: name.trim(),
        email: isEmail ? contact.trim() : `${contact.trim().replace(/[^\d+]/g, "")}@whatsapp.local`,
        phone: isEmail ? null : contact.trim(),
        message: message.trim(),
      });
      if (error) throw error;
      toast({ title: t.sent });
      setName(""); setContact(""); setMessage("");
    } catch (err) {
      toast({ title: t.err, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact-cta"
      aria-labelledby="contact-cta-title"
      className="relative py-20 sm:py-28 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90" aria-hidden="true" />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, hsl(var(--accent)) 0%, transparent 40%), radial-gradient(circle at 80% 80%, hsl(var(--accent)) 0%, transparent 40%)",
        }}
        aria-hidden="true"
      />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[6fr_5fr] gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Left — pitch */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-primary-foreground"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-semibold uppercase tracking-[0.18em]">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              {t.tag}
            </span>
            <h2
              id="contact-cta-title"
              className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1]"
            >
              {t.title}
            </h2>
            <p className="mt-5 text-base sm:text-lg text-primary-foreground/80 max-w-xl leading-relaxed">
              {t.desc}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                size="lg"
                className="bg-[#25D366] hover:bg-[#20bf5a] text-white shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-primary focus-visible:ring-accent"
              >
                <a href={waUrl} target="_blank" rel="noopener noreferrer" aria-label={t.whatsapp}>
                  <MessageCircle className="w-5 h-5 mr-2" aria-hidden="true" />
                  {t.whatsapp}
                  <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <a href={MAILTO} aria-label={t.email}>
                  <Mail className="w-5 h-5 mr-2" aria-hidden="true" />
                  {t.email}
                </a>
              </Button>
            </div>

            <p className="mt-6 inline-flex items-center gap-2 text-xs text-primary-foreground/60">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              {t.trust}
            </p>
          </motion.div>

          {/* Right — quick form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="bg-background/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-2xl border border-border/50"
            aria-label={t.formTitle}
          >
            <h3 className="text-lg font-bold text-foreground mb-5">{t.formTitle}</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cta-name" className="text-sm">{t.name}</Label>
                <Input
                  id="cta-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1.5"
                  autoComplete="name"
                />
              </div>
              <div>
                <Label htmlFor="cta-contact" className="text-sm">{t.contact}</Label>
                <Input
                  id="cta-contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                  className="mt-1.5"
                  autoComplete="email"
                />
              </div>
              <div>
                <Label htmlFor="cta-message" className="text-sm">{t.message}</Label>
                <Textarea
                  id="cta-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  className="mt-1.5 resize-none"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                size="lg"
              >
                <Send className="w-4 h-4 mr-2" aria-hidden="true" />
                {loading ? "…" : t.send}
              </Button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;