import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, action, categories, generateImage } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY non configuré");

    const catList = categories?.map((c: any) => c.name).join(', ') || 'Agriculture, Leadership, Actualités';

    // ── IMAGE GENERATION ─────────────────────────────────────────────────────
    async function generateAIImage(topic: string): Promise<string | null> {
      try {
        const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
        const supabase = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image",
            messages: [{
              role: "user",
              content: `Photographie professionnelle et réaliste pour un article sur : "${topic}". 
              Contexte africain, agriculture ivoirienne, ambiance naturelle. 
              Style : photojournalisme, lumière naturelle, sobre et élégant. 
              Aucun texte, aucun watermark, aucun effet artificiel. Ratio 16:9.`
            }],
            modalities: ["image", "text"]
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
        const fileName = `ai-generated/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`;

        const { error: uploadError } = await supabase.storage
          .from("blog-media")
          .upload(fileName, imageBytes, { contentType: "image/png", upsert: false });

        if (uploadError) { console.error("Upload error:", uploadError); return null; }

        const { data: urlData } = supabase.storage.from("blog-media").getPublicUrl(fileName);
        return urlData.publicUrl;
      } catch (e) {
        console.error("generateAIImage error:", e);
        return null;
      }
    }

    // ── SYSTEM PROMPTS ────────────────────────────────────────────────────────
    const BRAND_CONTEXT = `
Tu travailles pour Inocent KOFFI (jamais "Innocent"), Fondateur et Directeur Général d'AGRICAPITAL SARL, entreprise spécialisée dans la transformation agricole en Côte d'Ivoire.
Contexte: agriculture africaine, palmier à huile, pépinière, souveraineté alimentaire, entrepreneuriat.
    `.trim();

    const HTML_RULES = `
RÈGLES HTML STRICTES:
- Utilise UNIQUEMENT du HTML valide. JAMAIS de Markdown (pas d'astérisques **, pas de ###, pas de backticks).
- <h2 style="font-size:1.5em;font-weight:bold;margin:1.5em 0 0.8em;color:#1e3a5f;"> pour sections
- <h3 style="font-size:1.2em;font-weight:600;margin:1.2em 0 0.6em;color:#1e3a5f;"> pour sous-sections
- <p style="margin:0 0 1.2em;line-height:1.8;"> pour paragraphes
- <strong> pour les idées clés
- <em> pour citations ou nuances
- <blockquote style="border-left:4px solid #d4a72c;padding:1em 1.5em;margin:1.5em 0;background:#fffbf0;border-radius:0 8px 8px 0;font-style:italic;"> pour citations
- <ul style="margin:0 0 1.2em;padding-left:1.5em;"> <li style="margin-bottom:0.5em;"> pour listes
- <ol style="margin:0 0 1.2em;padding-left:1.5em;"> <li style="margin-bottom:0.5em;"> pour listes numérotées

TABLEAUX AVANCÉS (utiliser quand pertinent pour comparaisons, données chiffrées, fiches techniques):
<div style="overflow-x:auto;margin:1.5em 0;">
<table style="width:100%;border-collapse:collapse;font-size:0.95em;box-shadow:0 2px 8px rgba(0,0,0,0.08);border-radius:8px;overflow:hidden;">
  <thead>
    <tr style="background:#1e3a5f;color:white;">
      <th style="padding:12px 16px;text-align:left;font-weight:600;">Colonne 1</th>
      <th style="padding:12px 16px;text-align:left;font-weight:600;">Colonne 2</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background:#ffffff;">
      <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;">Donnée</td>
      <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;">Valeur</td>
    </tr>
    <tr style="background:#f8fafc;">
      <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;">Donnée</td>
      <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;">Valeur</td>
    </tr>
  </tbody>
</table>
</div>

TIMELINE (pour événements):
<div style="position:relative;padding-left:2em;margin:1.5em 0;">
  <div style="position:absolute;left:0;top:0;bottom:0;width:2px;background:linear-gradient(#1e3a5f,#d4a72c);"></div>
  <div style="position:relative;margin-bottom:1.5em;">
    <div style="position:absolute;left:-2.5em;top:4px;width:12px;height:12px;border-radius:50%;background:#1e3a5f;border:2px solid white;box-shadow:0 0 0 2px #1e3a5f;"></div>
    <strong>2024</strong> — Événement important
  </div>
</div>

SÉPARATEUR DE SECTION:
<div style="border:none;height:2px;background:linear-gradient(to right,#1e3a5f,#d4a72c,transparent);margin:2em 0;"></div>

BOÎTE MISE EN VALEUR:
<div style="background:linear-gradient(135deg,#f0f4ff,#fefce8);border:1px solid #d4a72c;border-radius:12px;padding:1.5em;margin:1.5em 0;">
  <p style="margin:0;font-weight:600;">💡 Point clé</p>
  <p style="margin:0.5em 0 0;">Contenu important ici</p>
</div>

QUALITÉ:
- Paragraphes TOUJOURS séparés, jamais de blocs compacts
- Emojis subtils : 📌 👉 🌱 💡 📊 🎯 ✅
- Hiérarchie visuelle claire, articles de 800-1500 mots
- Immédiatement publiable, sans retouche
    `.trim();

    // ── ACTION: GENERATE META ─────────────────────────────────────────────
    if (action === "generate_meta") {
      const systemPrompt = `${BRAND_CONTEXT}
Tu génères des métadonnées JSON pour des articles de blog.
Catégories disponibles: ${catList}
Retourne UNIQUEMENT ce JSON valide:
{
  "title": "TITRE EN MAJUSCULES, IMPACTANT (max 80 car)",
  "tagline": "Phrase d'accroche en italique, claire et engageante (max 160 car)",
  "hashtags": ["hashtag1","hashtag2","hashtag3","hashtag4","hashtag5"],
  "excerpt": "Résumé 2-3 phrases professionnelles (max 200 car)",
  "suggested_category": "nom de la catégorie la plus pertinente"
}`;

      const response = await callAI(LOVABLE_API_KEY, systemPrompt, `Analyse et génère les métadonnées pour:\n\n${content}`);
      const parsed = extractJSON(response);
      return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ── ACTION: STRUCTURE ARTICLE ─────────────────────────────────────────
    if (action === "structure_article") {
      const systemPrompt = `${BRAND_CONTEXT}
Tu restructures un texte brut en HTML professionnel.
${HTML_RULES}
Retourne uniquement le HTML structuré, sans commentaire.`;

      const response = await callAI(LOVABLE_API_KEY, systemPrompt, `Restructure ce texte:\n\n${content}`);
      return new Response(JSON.stringify({ content: response }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ── ACTION: GENERATE FULL ARTICLE ─────────────────────────────────────
    if (action === "generate_full_article") {
      const systemPrompt = `${BRAND_CONTEXT}

Tu es un rédacteur en chef d'élite. À partir de N'IMPORTE QUEL texte — même un seul mot — tu génères un article complet, professionnel, immédiatement publiable.

${HTML_RULES}

STRUCTURE DE L'ARTICLE:
1. Introduction percutante (2-3 paragraphes)
2. 3-5 sections avec <h2>
3. Sous-sections avec <h3> si pertinent
4. Utilise un tableau si le sujet s'y prête (comparaisons, données, fiche technique)
5. Liste(s) à puces pour les points clés
6. Citation inspirante en <blockquote>
7. Conclusion avec appel à l'action

Catégories disponibles: ${catList}

Retourne UNIQUEMENT ce JSON valide (PAS de markdown dans le JSON, le content doit être du HTML):
{
  "title": "TITRE EN MAJUSCULES PROFESSIONNEL",
  "tagline": "Phrase d'accroche en italique",
  "content": "<h2>...</h2><p>...</p>...",
  "excerpt": "Résumé en 2 phrases",
  "hashtags": ["tag1","tag2","tag3","tag4","tag5"],
  "suggested_category": "nom catégorie"
}`;

      const userPrompt = content.trim().split(/\s+/).length < 20
        ? `Développe un article complet sur ce sujet : "${content.trim()}". Contexte: AGRICAPITAL, agriculture ivoirienne.`
        : `Transforme ce texte brut en article complet et professionnel:\n\n${content}`;

      // Generate article and image in parallel
      const articlePromise = callAI(LOVABLE_API_KEY, systemPrompt, userPrompt);
      const imagePromise = generateImage ? generateAIImage(content.slice(0, 200)) : Promise.resolve(null);

      const [articleResponse, imageUrl] = await Promise.all([articlePromise, imagePromise]);
      const parsed = extractJSON(articleResponse);

      if (imageUrl) parsed.imageUrl = imageUrl;

      return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Action non reconnue" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (error) {
    console.error("blog-ai-assistant error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erreur inconnue" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// ── Helpers ───────────────────────────────────────────────────────────────────
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
  // Try to extract JSON from markdown code blocks or raw text
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    try { return JSON.parse(codeBlockMatch[1].trim()); } catch {}
  }
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try { return JSON.parse(jsonMatch[0]); } catch {}
  }
  throw new Error("Format de réponse IA invalide");
}
