import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: "partnership" | "testimonial" | "contact" | "newsletter";
  data: Record<string, unknown>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data }: NotificationRequest = await req.json();
    const adminEmail = "Inocent.koffi@agricapital.ci";
    
    let subject = "";
    let htmlContent = "";

    switch (type) {
      case "partnership":
        subject = `🤝 Nouvelle demande de partenariat - ${data.company_name}`;
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
        subject = `⭐ Nouveau témoignage de ${data.first_name} ${data.last_name}`;
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
        subject = `📧 Nouveau message de ${data.name}`;
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

    console.log(`Sending ${type} notification to ${adminEmail}`);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "AGRICAPITAL <onboarding@resend.dev>",
        to: [adminEmail],
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

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
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
