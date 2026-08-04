import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: "partnership" | "testimonial" | "contact" | "newsletter";
  data: Record<string, unknown>;
  /** Language of the visitor — drives the acknowledgement email (fr | en). */
  lang?: string;
}

type Lang = "fr" | "en";

const FROM = "AGRICAPITAL <onboarding@resend.dev>";
const SITE_URL = "https://ikoffi.agricapital.ci";
const REPLY_TO = "Inocent.koffi@agricapital.ci";

const shell = (title: string, subtitle: string, body: string) => `
  <div style="font-family: Inter, Arial, sans-serif; max-width: 620px; margin: 0 auto; border-radius: 14px; overflow: hidden; border: 1px solid #e6e6e6;">
    <div style="background: linear-gradient(135deg, #1a3a52, #2d5a3d); padding: 28px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: .5px;">AGRICAPITAL SARL</h1>
      <p style="color: #f5a623; margin: 8px 0 0; font-size: 14px;">${subtitle}</p>
    </div>
    <div style="padding: 28px; background: #fafafa; color: #1f2937;">
      <h2 style="color: #1a3a52; margin: 0 0 16px; font-size: 18px;">${title}</h2>
      ${body}
    </div>
    <div style="background: #1a3a52; color: #ffffff; padding: 18px; text-align: center; font-size: 12px;">
      <p style="margin: 0 0 6px;">Inocent KOFFI — Gérant AGRICAPITAL SARL · Daloa, Côte d'Ivoire</p>
      <p style="margin: 0;"><a href="${SITE_URL}" style="color:#f5a623; text-decoration:none;">ikoffi.agricapital.ci</a> · © ${new Date().getFullYear()}</p>
    </div>
  </div>
`;

const rows = (items: Array<[string, string]>) => `
  <table style="width: 100%; border-collapse: collapse; background: #ffffff; border-radius: 10px;">
    ${items
      .map(
        ([k, v]) =>
          `<tr><td style="padding: 10px 12px; border-bottom: 1px solid #eee; width: 40%;"><strong>${k}</strong></td><td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${v || "—"}</td></tr>`,
      )
      .join("")}
  </table>
`;

const block = (label: string, value: string) => `
  <div style="margin-top: 18px; padding: 16px; background: #ffffff; border-radius: 10px; border-left: 4px solid #f5a623;">
    <strong>${label}</strong>
    <p style="margin: 8px 0 0; white-space: pre-wrap;">${value}</p>
  </div>
`;

/** Acknowledgement email sent to the person who submitted the form. */
const acknowledgement = (lang: Lang, type: string, data: Record<string, string>) => {
  const fr = lang === "fr";
  const name = data.name || data.contact_name || `${data.first_name || ""} ${data.last_name || ""}`.trim();
  const labels = fr
    ? { hello: "Bonjour", sub: "Accusé de réception", title: "Votre demande a bien été reçue", recap: "Récapitulatif de votre demande", name: "Nom", email: "Email", phone: "Téléphone", company: "Entreprise", message: "Message", delay: "Nous revenons vers vous sous 24 à 48 heures ouvrées.", sign: "Cordialement,<br/>Inocent KOFFI — Gérant, AGRICAPITAL SARL", urgent: "Pour une demande urgente : WhatsApp +225 07 59 56 60 87." }
    : { hello: "Hello", sub: "Acknowledgement of receipt", title: "We have received your request", recap: "Summary of your request", name: "Name", email: "Email", phone: "Phone", company: "Company", message: "Message", delay: "We will get back to you within 24 to 48 business hours.", sign: "Kind regards,<br/>Inocent KOFFI — Managing Director, AGRICAPITAL SARL", urgent: "For urgent matters: WhatsApp +225 07 59 56 60 87." };

  const recap: Array<[string, string]> = [
    [labels.name, name],
    [labels.email, data.email],
  ];
  if (data.phone) recap.push([labels.phone, data.phone]);
  if (data.company_name) recap.push([labels.company, data.company_name]);

  const body = `
    <p style="margin: 0 0 14px;">${labels.hello} ${name || ""},</p>
    <p style="margin: 0 0 18px;">${labels.delay}</p>
    ${rows(recap)}
    ${data.message ? block(labels.message, data.message) : ""}
    <p style="margin: 18px 0 0; font-size: 13px; color: #4b5563;">${labels.urgent}</p>
    <p style="margin: 18px 0 0;">${labels.sign}</p>
  `;

  return {
    subject: fr
      ? `Accusé de réception — AGRICAPITAL SARL`
      : `Acknowledgement of receipt — AGRICAPITAL SARL`,
    html: shell(labels.title + ` (${labels.recap.toLowerCase()})`, labels.sub, body),
  };
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- Anti-abuse: only accept requests coming from allowed origins.
    // This prevents anonymous callers from directly hitting the function
    // URL to flood admin inboxes with fake submissions. The public forms
    // in the app always send an Origin header via supabase.functions.invoke.
    const ALLOWED_ORIGINS = [
      "https://inocent-koffi.lovable.app",
      "https://ikoffi.agricapital.ci",
      "https://agricapital.ci",
      "https://www.agricapital.ci",
    ];
    const ALLOWED_ORIGIN_SUFFIXES = [".lovable.app", ".lovable.dev", ".agricapital.ci"];
    const origin = req.headers.get("origin") || "";
    const referer = req.headers.get("referer") || "";
    const source = origin || (() => { try { return new URL(referer).origin; } catch { return ""; } })();
    const isAllowed = source && (
      ALLOWED_ORIGINS.includes(source) ||
      ALLOWED_ORIGIN_SUFFIXES.some((s) => {
        try { return new URL(source).hostname.endsWith(s); } catch { return false; }
      })
    );
    if (!isAllowed) {
      console.warn("Rejected notification request from origin:", source || "<none>");
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { type, data: rawData, lang: rawLang }: NotificationRequest = await req.json();
    const lang: Lang = rawLang === "en" ? "en" : "fr";

    // --- Input hardening: HTML-escape and enforce length limits so a
    // public caller cannot inject HTML/script into admin inboxes or
    // spam unbounded payloads.
    const MAX = 2000;
    const esc = (v: unknown): string => {
      const s = String(v ?? "").slice(0, MAX);
      return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    };
    const ALLOWED_TYPES = new Set(["partnership", "testimonial", "contact", "newsletter"]);
    if (!ALLOWED_TYPES.has(String(type))) {
      return new Response(JSON.stringify({ error: "Invalid type" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
    const data: Record<string, string> = {};
    for (const [k, v] of Object.entries(rawData || {})) data[k] = esc(v);

    const adminEmails = ["Inocent.koffi@agricapital.ci", "innocentkoffi1@gmail.com"];
    
    let subject = "";
    let htmlContent = "";

    switch (type) {
      case "partnership":
        subject = `🤝 Nouvelle demande de partenariat - ${data.company_name}`.slice(0, 200);
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1a3a52, #2d5a3d); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">AGRICAPITAL</h1>
              <p style="color: #f5a623; margin: 10px 0 0;">Nouvelle Demande de Partenariat</p>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #1a3a52;">Informations du partenaire potentiel</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Entreprise:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.company_name}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Contact:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.contact_name}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.email}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Téléphone:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.phone}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Type:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.partnership_type}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Site web:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.website || 'Non renseigné'}</td></tr>
              </table>
              <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px;">
                <strong>Message:</strong>
                <p style="margin: 10px 0 0;">${data.message}</p>
              </div>
            </div>
            <div style="background: #1a3a52; color: white; padding: 20px; text-align: center;">
              <p style="margin: 0;">© ${new Date().getFullYear()} AGRICAPITAL SARL - Tous droits réservés</p>
            </div>
          </div>
        `;
        break;

      case "testimonial":
        subject = `⭐ Nouveau témoignage de ${data.first_name} ${data.last_name}`.slice(0, 200);
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1a3a52, #2d5a3d); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">AGRICAPITAL</h1>
              <p style="color: #f5a623; margin: 10px 0 0;">Nouveau Témoignage Reçu</p>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #1a3a52;">Détails du témoignage</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Nom:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.first_name} ${data.last_name}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.email}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Localité:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.locality}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Note:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${'⭐'.repeat(data.rating as number || 5)}</td></tr>
              </table>
              <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px;">
                <strong>Témoignage:</strong>
                <p style="margin: 10px 0 0; font-style: italic;">"${data.message}"</p>
              </div>
            </div>
            <div style="background: #1a3a52; color: white; padding: 20px; text-align: center;">
              <p style="margin: 0;">© ${new Date().getFullYear()} AGRICAPITAL SARL</p>
            </div>
          </div>
        `;
        break;

      case "contact":
        subject = `📧 Nouveau message de ${data.name}`.slice(0, 200);
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1a3a52, #2d5a3d); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">AGRICAPITAL</h1>
              <p style="color: #f5a623; margin: 10px 0 0;">Nouveau Message de Contact</p>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #1a3a52;">Informations de contact</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Nom:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.name}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.email}</td></tr>
                <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Téléphone:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.phone || 'Non renseigné'}</td></tr>
              </table>
              <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px;">
                <strong>Message:</strong>
                <p style="margin: 10px 0 0;">${data.message}</p>
              </div>
            </div>
            <div style="background: #1a3a52; color: white; padding: 20px; text-align: center;">
              <p style="margin: 0;">© ${new Date().getFullYear()} AGRICAPITAL SARL</p>
            </div>
          </div>
        `;
        break;

      case "newsletter":
        subject = `📰 Nouvel abonné à la newsletter`;
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1a3a52, #2d5a3d); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">AGRICAPITAL</h1>
              <p style="color: #f5a623; margin: 10px 0 0;">Nouvel Abonné Newsletter</p>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <p>Un nouvel utilisateur s'est inscrit à la newsletter:</p>
              <p style="font-size: 18px; color: #1a3a52;"><strong>${data.email}</strong></p>
            </div>
          </div>
        `;
        break;

      default:
        throw new Error("Type de notification non reconnu");
    }

    const recipientReplyTo = data.email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email) ? data.email : REPLY_TO;
    console.log(`Sending ${type} notification to ${adminEmails.join(", ")} (lang=${lang})`);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM,
        reply_to: recipientReplyTo,
        to: adminEmails,
        subject,
        html: htmlContent,
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("Resend API error:", errorData);
      throw new Error(`Resend API error: ${errorData}`);
    }

    const emailResponse = await res.json();
    console.log("Email sent successfully:", emailResponse);

    // --- Acknowledgement email to the submitter (FR / EN)
    let acknowledged = false;
    const recipient = data.email;
    if (recipient && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(recipient)) {
      try {
        const ack = acknowledgement(lang, type, data);
        const ackRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: FROM,
            to: [recipient],
            reply_to: REPLY_TO,
            subject: ack.subject,
            html: ack.html,
          }),
        });
        acknowledged = ackRes.ok;
        if (!ackRes.ok) console.error("Acknowledgement failed:", await ackRes.text());
      } catch (ackError) {
        console.error("Acknowledgement error:", ackError);
      }
    }

    return new Response(JSON.stringify({ success: true, acknowledged, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending notification:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
