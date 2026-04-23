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

type InputMode = "structured_draft" | "raw_text" | "instruction_prompt";

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

    const cleanContent = typeof content === "string" ? content.trim() : "";
    if (!cleanContent) {
      return new Response(JSON.stringify({ error: "Contenu vide" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const catList = categories?.map((c: any) => c.name).join(", ") || "Économie, Agriculture, Innovation, Leadership, Stratégie";

    if (action === "generate_meta" || action === "structure_article" || action === "generate_full_article") {
      const cacheKey = makeCacheKey(`blog:${action}`, cleanContent.slice(0, 300));
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
- Quand tu produis un tableau, enveloppe-le dans <div class="table-wrap">...</div>.

TABLEAUX — QUAND PERTINENT UNIQUEMENT:
- Si le sujet s'y prête (comparaisons, analyses, synthèses, données structurées), génère un tableau HTML moderne et bien présenté.
- Utilise <table> avec <caption> si utile, <thead> et <tbody>.
- Garde des en-têtes courts, des colonnes équilibrées, un contenu synthétique et lisible.
- Évite les tableaux trop larges; privilégie 3 à 5 colonnes maximum.
- NE PAS forcer un tableau si le sujet ne le nécessite pas.

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
      } catch {
      }
    }

    const inputMode = detectInputMode(cleanContent);
    const adaptationGuide = buildAdaptationGuide(inputMode, cleanContent);

    if (action === "generate_meta") {
      const systemPrompt = `${BRAND_CONTEXT}
${adaptationGuide}
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

      const response = await callAI(LOVABLE_API_KEY, systemPrompt, `Analyse l'entrée ci-dessous puis génère les métadonnées adaptées :\n\n${cleanContent}`);
      const parsed = extractJSON(response);
      const cacheKey = makeCacheKey("blog:generate_meta", cleanContent.slice(0, 300));
      await saveCache(cacheKey, parsed);
      return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "structure_article") {
      const systemPrompt = `${BRAND_CONTEXT}
${HTML_RULES}
${adaptationGuide}
Tu restructures l'entrée pour produire un article HTML professionnel.
Si le texte est déjà structuré, préserve le fond et améliore uniquement l'organisation, les intertitres et la fluidité.
Si c'est un prompt ou une consigne, exécute fidèlement les instructions avant de structurer.
Retourne uniquement le HTML structuré, sans commentaire.`;

      const response = await callAI(LOVABLE_API_KEY, systemPrompt, `Travaille cette entrée selon sa nature et rends-la publiable :\n\n${cleanContent}`);
      const result = { content: response, detected_mode: inputMode };
      const cacheKey = makeCacheKey("blog:structure_article", cleanContent.slice(0, 300));
      await saveCache(cacheKey, result);
      return new Response(JSON.stringify(result), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "generate_full_article") {
      const systemPrompt = `${BRAND_CONTEXT}

Tu es un rédacteur en chef expert en analyses stratégiques.
Mission: produire un article publiable, crédible et utile au lecteur.

${HTML_RULES}
${adaptationGuide}

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
- Si l'entrée est déjà bien structurée, consolide et enrichis sans la dénaturer.
- Si l'entrée est brute, développe l'analyse complètement.
- Si l'entrée est un prompt, suis les consignes explicites et implicites qu'il contient.
- Sources en fin d'article: OBLIGATOIRES, réelles, avec liens cliquables et date de consultation.
- Si le sujet s'y prête, inclure un TABLEAU comparatif ou de synthèse moderne, lisible, avec en-têtes nets.

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

      const userPrompt = buildGenerationPrompt(inputMode, cleanContent);
      const articlePromise = callAI(LOVABLE_API_KEY, systemPrompt, userPrompt);
      const imagePromise = generateImage ? generateAIImage(cleanContent.slice(0, 240)) : Promise.resolve(null);
      const galleryPromise = generateGallery
        ? Promise.all([
            generateAIImage(cleanContent.slice(0, 180), "plan large documentaire"),
            generateAIImage(cleanContent.slice(0, 180), "portrait éditorial en contexte"),
            generateAIImage(cleanContent.slice(0, 180), "détail terrain en macro"),
          ])
        : Promise.resolve(null);

      const [articleResponse, imageUrl, galleryResults] = await Promise.all([articlePromise, imagePromise, galleryPromise]);
      const parsed = extractJSON(articleResponse);

      if (imageUrl) parsed.imageUrl = imageUrl;
      if (galleryResults) {
        parsed.galleryUrls = galleryResults.filter(Boolean) as string[];
      }
      parsed.detected_mode = inputMode;

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

function detectInputMode(content: string): InputMode {
  const trimmed = content.trim();
  const lower = trimmed.toLowerCase();
  const lineCount = trimmed.split(/\n+/).filter(Boolean).length;
  const hasHtml = /<h\d|<p>|<ul>|<ol>|<table|<blockquote/i.test(trimmed);
  const hasStructuredMarkers = /(^|\n)\s*(titre|title|introduction|conclusion|plan|section|partie|chapitre)\s*[:\-]/i.test(trimmed);
  const hasPromptLanguage = /(rédige|écris|write|generate|développe|transforme|fais|analyse|create|compose|produis|please|merci de|tu es|agis comme)/i.test(lower);

  if (hasHtml || (lineCount >= 5 && hasStructuredMarkers)) return "structured_draft";
  if (hasPromptLanguage && !hasHtml) return "instruction_prompt";
  return "raw_text";
}

function buildAdaptationGuide(mode: InputMode, content: string): string {
  if (mode === "structured_draft") {
    return `MODE D'ENTRÉE: BROUILLON DÉJÀ STRUCTURÉ.
- Analyse la structure existante avant d'écrire.
- Réorganise avec sobriété.
- Conserve les idées, le ton et les éléments solides.
- Corrige les redondances, affine les titres et améliore la progression logique.`;
  }

  if (mode === "instruction_prompt") {
    return `MODE D'ENTRÉE: PROMPT / CONSIGNES.
- Identifie les instructions explicites et implicites contenues dans l'entrée.
- Exécute ces consignes fidèlement avant de produire l'article.
- Si certaines consignes sont incompatibles avec la ligne éditoriale ou les faits, adapte avec discernement et honnêteté.
- Ne perds jamais l'intention du prompt.`;
  }

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  return `MODE D'ENTRÉE: TEXTE BRUT.
- Analyse le fond, les idées-clés et les angles possibles.
- Structure entièrement le contenu pour le rendre publiable.
- Développe l'analyse de façon complète et cohérente.
- ${wordCount < 80 ? "Le texte est court: enrichis davantage avec contexte, explications et mise en perspective." : "Respecte les informations fournies tout en renforçant la clarté et la profondeur."}`;
}

function buildGenerationPrompt(mode: InputMode, content: string): string {
  if (mode === "structured_draft") {
    return `Voici un brouillon déjà partiellement structuré. Analyse sa qualité, conserve ses points forts, puis transforme-le en article publiable sans casser sa logique quand elle est bonne :\n\n${content}`;
  }

  if (mode === "instruction_prompt") {
    return `Voici un prompt ou un ensemble d'instructions. Analyse précisément la demande, suis les indications, puis livre l'article final en respectant les contraintes implicites et explicites :\n\n${content}`;
  }

  return content.trim().split(/\s+/).length < 20
    ? `Développe un article complet d'analyse et réflexion à partir de ce sujet ou texte brut : "${content.trim()}".`
    : `Transforme ce texte brut en article d'analyse structuré, complet et publiable :\n\n${content}`;
}

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
    try { return JSON.parse(codeBlockMatch[1].trim()); } catch { }
  }
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try { return JSON.parse(jsonMatch[0]); } catch { }
  }
  throw new Error("Format de réponse IA invalide");
}
