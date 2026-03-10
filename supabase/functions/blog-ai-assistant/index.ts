import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const VISUAL_ANGLES = [
  "plan large documentaire",
  "portrait éditorial en contexte",
  "détail terrain en macro",
  "scène collaborative en réunion",
  "ambiance urbaine professionnelle",
  "site industriel/énergie en activité",
  "atelier numérique et innovation",
  "équipe locale en action",
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, action, categories, generateImage, generateVideo, generateGallery } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY non configuré");

    const catList = categories?.map((c: any) => c.name).join(", ") || "Économie, Agriculture, Innovation, Leadership, Stratégie";

    async function generateAIImage(topic: string, angleHint?: string): Promise<string | null> {
      try {
        const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
        const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

        const chosenAngle = angleHint || VISUAL_ANGLES[Math.floor(Math.random() * VISUAL_ANGLES.length)];
        const creativeSeed = crypto.randomUUID().slice(0, 8);

        const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3.1-flash-image-preview",
            messages: [{
              role: "user",
              content: `Image éditoriale réaliste, UNIQUE et différente des générations précédentes.
Sujet: "${topic}".
Angle visuel imposé: ${chosenAngle}.
Contexte possible multi-sectoriel: économie, agriculture, innovation, finance, énergie, gouvernance, éducation, entrepreneuriat.
Style: photojournalisme premium, lumière naturelle, crédible, sans effets artificiels.
Interdit: watermark, texte incrusté, logos visibles, duplication de composition.
Seed créative: ${creativeSeed}.`
            }],
            modalities: ["image", "text"],
          }),
        });

        if (!imageResponse.ok) {
          console.error("Image gen error:", imageResponse.status);
          return null;
        }

        const imageData = await imageResponse.json();
        const imageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        if (!imageUrl) return null;

        const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, "");
        const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        const fileName = `ai-generated/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.png`;

        const { error: uploadError } = await supabase.storage
          .from("blog-media")
          .upload(fileName, imageBytes, { contentType: "image/png", upsert: false });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          return null;
        }

        const { data: urlData } = supabase.storage.from("blog-media").getPublicUrl(fileName);
        return urlData.publicUrl;
      } catch (e) {
        console.error("generateAIImage error:", e);
        return null;
      }
    }

    const BRAND_CONTEXT = `
Tu écris des analyses et réflexions signées Inocent KOFFI (orthographe exacte), Fondateur & CEO d'AGRICAPITAL SARL.
IMPORTANT: la ligne éditoriale est PERSONNELLE et analytique; ne transforme jamais l'article en communication d'entreprise centrée sur AGRICAPITAL.
Positionnement: crédibilité, lucidité, impact terrain, ouverture partenariats, pédagogie professionnelle.
Domaines possibles: agriculture, économie, finance, innovation, énergie, numérique, gouvernance, entrepreneuriat, développement local.
`.trim();

    const HTML_RULES = `
RÈGLES HTML STRICTES:
- Utilise UNIQUEMENT du HTML valide. JAMAIS de Markdown.
- Structure lisible avec <h2>, <h3>, <p>, <ul>/<ol>, <blockquote>.
- Paragraphes courts avec transitions claires.
- Si données citées: ajoute une section "Sources vérifiables" avec liens explicites.
- N'invente jamais de chiffres: si incertitude, le dire clairement.
- Ton: professionnel, concret, honnête, non sensationnaliste.
`.trim();

    if (action === "generate_meta") {
      const systemPrompt = `${BRAND_CONTEXT}
Tu génères des métadonnées JSON pour des articles d'analyse.
Catégories disponibles: ${catList}
Retourne UNIQUEMENT ce JSON valide:
{
  "title": "TITRE IMPACTANT (max 80 car)",
  "tagline": "Accroche professionnelle (max 160 car)",
  "hashtags": ["hashtag1","hashtag2","hashtag3","hashtag4","hashtag5"],
  "excerpt": "Résumé clair en 2-3 phrases (max 220 car)",
  "suggested_category": "nom de la catégorie"
}`;

      const response = await callAI(LOVABLE_API_KEY, systemPrompt, `Analyse et génère les métadonnées pour:\n\n${content}`);
      const parsed = extractJSON(response);
      return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "structure_article") {
      const systemPrompt = `${BRAND_CONTEXT}
Tu restructures un texte brut en article HTML professionnel.
${HTML_RULES}
Retourne uniquement le HTML structuré, sans commentaire.`;

      const response = await callAI(LOVABLE_API_KEY, systemPrompt, `Restructure ce texte:\n\n${content}`);
      return new Response(JSON.stringify({ content: response }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "generate_full_article") {
      const systemPrompt = `${BRAND_CONTEXT}

Tu es un rédacteur en chef expert en analyses stratégiques.
Mission: produire un article publiable, crédible et utile au lecteur.

${HTML_RULES}

STRUCTURE ATTENDUE:
1. Introduction percutante (2-3 paragraphes)
2. 3 à 5 sections <h2>
3. Sous-sections <h3> si pertinent
4. Encadrés/listes/tableaux si utiles à la compréhension
5. Conclusion orientée action et réflexion

RÈGLES FORTES:
- Éviter le ton "promotion AGRICAPITAL".
- Garder un regard personnel d'analyste (Inocent KOFFI), pluridisciplinaire.
- Éviter le jargon vide.
- Donner des éléments concrets et nuancés.
- Si sources citées: lisibles et vérifiables.

Catégories disponibles: ${catList}

Retourne UNIQUEMENT ce JSON valide:
{
  "title": "TITRE PROFESSIONNEL",
  "tagline": "Phrase d'accroche",
  "content": "<h2>...</h2><p>...</p>",
  "excerpt": "Résumé en 2 phrases",
  "hashtags": ["tag1","tag2","tag3","tag4","tag5"],
  "suggested_category": "nom catégorie"
}`;

      const userPrompt = content.trim().split(/\s+/).length < 20
        ? `Développe un article complet d'analyse et réflexion sur ce sujet: "${content.trim()}".`
        : `Transforme ce brouillon en article d'analyse structuré et publiable:\n\n${content}`;

      const articlePromise = callAI(LOVABLE_API_KEY, systemPrompt, userPrompt);
      const imagePromise = generateImage ? generateAIImage(content.slice(0, 240)) : Promise.resolve(null);

      const galleryPromise = generateGallery
        ? Promise.all([
            generateAIImage(content.slice(0, 180), "plan large documentaire"),
            generateAIImage(content.slice(0, 180), "portrait éditorial en contexte"),
            generateAIImage(content.slice(0, 180), "détail terrain en macro"),
          ])
        : Promise.resolve(null);

      const [articleResponse, imageUrl, galleryResults] = await Promise.all([articlePromise, imagePromise, galleryPromise]);
      const parsed = extractJSON(articleResponse);

      if (imageUrl) parsed.imageUrl = imageUrl;
      if (galleryResults) parsed.galleryUrls = galleryResults.filter(Boolean);

      if (generateVideo) {
        console.log("Video generation requested but not yet available via AI gateway");
      }

      return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Action non reconnue" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("blog-ai-assistant error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erreur inconnue" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function callAI(apiKey: string, systemPrompt: string, userPrompt: string): Promise<string> {
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("AI gateway error:", response.status, errorText);
    if (response.status === 429) throw new Error("Limite de requêtes atteinte. Réessayez dans quelques instants.");
    if (response.status === 402) throw new Error("Crédits insuffisants. Veuillez recharger votre compte.");
    throw new Error(`Erreur IA: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

function extractJSON(text: string): any {
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch {
      // fallback below
    }
  }
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      // fallback below
    }
  }
  throw new Error("Format de réponse IA invalide");
}
