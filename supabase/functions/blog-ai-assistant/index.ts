import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

function makeCacheKey(prefix: string, input: string): string {
  const normalized = input.trim().toLowerCase().replace(/\s+/g, " ");
  return `${prefix}:${normalized}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, action, categories, generateImage, generateVideo, generateGallery } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY non configuré");

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const catList = categories?.map((c: any) => c.name).join(", ") || "Économie, Agriculture, Innovation, Leadership, Stratégie";

    // Check cache for text-only actions
    if (action === "generate_meta" || action === "structure_article" || action === "generate_full_article") {
      const cacheKey = makeCacheKey(`blog:${action}`, content?.slice(0, 300) || "");
      const { data: cached } = await supabase
        .from("ai_cache")
        .select("response")
        .eq("cache_key", cacheKey)
        .gt("expires_at", new Date().toISOString())
        .maybeSingle();

      if (cached && action !== "generate_full_article") {
        return new Response(JSON.stringify(cached.response), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    async function generateAIImage(topic: string, angleHint?: string): Promise<string | null> {
      try {
        const chosenAngle = angleHint || VISUAL_ANGLES[Math.floor(Math.random() * VISUAL_ANGLES.length)];
        const creativeSeed = crypto.randomUUID().slice(0, 8);

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
Tu écris des analyses et réflexions signées Inocent KOFFI (orthographe exacte), Fondateur d'AGRICAPITAL SARL.
AgriCapital est un opérateur et promoteur agricole spécialisé dans la création de plantations de palmier à huile clé en main en Côte d'Ivoire.
IMPORTANT: la ligne éditoriale est PERSONNELLE et analytique; ne transforme jamais l'article en communication d'entreprise centrée sur AGRICAPITAL.
Positionnement: crédibilité, lucidité, impact terrain, ouverture partenariats, pédagogie professionnelle.
Domaines possibles: agriculture, économie, finance, innovation, énergie, numérique, gouvernance, entrepreneuriat, développement local.
`.trim();

    const HTML_RULES = `
RÈGLES HTML STRICTES:
- Utilise UNIQUEMENT du HTML valide. JAMAIS de Markdown.
- Structure lisible avec <h2>, <h3>, <p>, <ul>/<ol>, <blockquote>.
- Paragraphes courts avec transitions claires.
- N'invente jamais de chiffres: si incertitude, le dire clairement.
- Ton: professionnel, concret, honnête, non sensationnaliste.

TABLEAUX — QUAND PERTINENT UNIQUEMENT:
- Si le sujet s'y prête (comparaisons, analyses, synthèses, données structurées), génère un tableau HTML propre.
- Utilise <table> avec <thead> et <tbody>.
- Style: bordures fines, alternance de couleurs de lignes (zebra), texte lisible.
- Exemple de style inline: <table style="width:100%;border-collapse:collapse;margin:1.5em 0"><thead><tr style="background:#f0f0f0"><th style="padding:10px 14px;text-align:left;border-bottom:2px solid #ddd">...</th></tr></thead><tbody><tr style="background:#fafafa"><td style="padding:8px 14px;border-bottom:1px solid #eee">...</td></tr><tr><td style="padding:8px 14px;border-bottom:1px solid #eee">...</td></tr></tbody></table>
- NE PAS forcer un tableau si le sujet ne le nécessite pas.

IMAGES DANS L'ARTICLE (si plusieurs images fournies):
- Les images supplémentaires doivent être insérées DANS le contenu, réparties entre les sections.
- Chaque image doit être placée à un endroit logique et pertinent, pas toutes au même endroit.
- Format: <figure style="margin:1.5em 0;text-align:center"><img src="URL" alt="description" style="max-width:100%;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1)"><figcaption style="font-size:0.85em;color:#666;margin-top:0.5em">Légende</figcaption></figure>

SECTION SOURCES VÉRIFIÉES OBLIGATOIRE:
- TOUJOURS terminer l'article par une section <h2>📌 Sources vérifiées</h2>
- Lister les sources réelles utilisées ou consultables avec des liens <a href="..." target="_blank" rel="noopener noreferrer">
- Format: <ul><li><a href="URL">Nom de la source</a> — Description courte — Consulté en [mois année]</li></ul>
- Ne citer QUE des sources réelles et vérifiables (FAO, Banque Mondiale, rapports officiels, presse reconnue).
- Si aucune source fiable n'est disponible, écrire: "Cet article repose sur l'expérience terrain de l'auteur."
`.trim();

    async function saveCache(key: string, response: any) {
      try {
        await supabase.from("ai_cache").insert({ cache_key: key, response });
      } catch { /* ignore cache errors */ }
    }

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
      const cacheKey = makeCacheKey("blog:generate_meta", content?.slice(0, 300) || "");
      await saveCache(cacheKey, parsed);
      return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "structure_article") {
      const systemPrompt = `${BRAND_CONTEXT}
Tu restructures un texte brut en article HTML professionnel.
${HTML_RULES}
Retourne uniquement le HTML structuré, sans commentaire.`;

      const response = await callAI(LOVABLE_API_KEY, systemPrompt, `Restructure ce texte:\n\n${content}`);
      const result = { content: response };
      const cacheKey = makeCacheKey("blog:structure_article", content?.slice(0, 300) || "");
      await saveCache(cacheKey, result);
      return new Response(JSON.stringify(result), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
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
4. Encadrés/listes/tableaux SI PERTINENTS pour la compréhension
5. Conclusion orientée action et réflexion
6. Section "📌 Sources vérifiées" OBLIGATOIRE en dernier

RÈGLES FORTES:
- Éviter le ton "promotion AGRICAPITAL".
- Garder un regard personnel d'analyste (Inocent KOFFI), pluridisciplinaire.
- Éviter le jargon vide.
- Donner des éléments concrets et nuancés.
- Sources en fin d'article: OBLIGATOIRES, réelles, avec liens cliquables et date de consultation.
- Si le sujet s'y prête, inclure un TABLEAU comparatif ou de synthèse avec style zebra-striped.

Catégories disponibles: ${catList}

Retourne UNIQUEMENT ce JSON valide:
{
  "title": "TITRE PROFESSIONNEL",
  "tagline": "Phrase d'accroche",
  "content": "<h2>...</h2><p>...</p>...<h2>📌 Sources vérifiées</h2><ul><li><a href='...'>Source</a> — ...</li></ul>",
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
      if (galleryResults) {
        // Gallery images go to a separate carousel under the article — NOT inline
        parsed.galleryUrls = (galleryResults.filter(Boolean) as string[]);
      }

      return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Action non reconnue" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
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
      model: "google/gemini-2.5-flash-lite",
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
    try { return JSON.parse(codeBlockMatch[1].trim()); } catch { /* fallback */ }
  }
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try { return JSON.parse(jsonMatch[0]); } catch { /* fallback */ }
  }
  throw new Error("Format de réponse IA invalide");
}
