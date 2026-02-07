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
    const { content, action, topic, categories } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (action === "generate_meta") {
      systemPrompt = `Tu es un rédacteur en chef professionnel pour un blog de leadership et agriculture africaine. 
Tu génères des métadonnées pour les articles de blog.

IMPORTANT: 
- Le fondateur s'appelle Inocent KOFFI (pas "Innocent")
- Le ton doit être professionnel, inspirant et visionnaire
- Les hashtags doivent être pertinents pour LinkedIn et Twitter

Tu dois TOUJOURS répondre en JSON valide avec cette structure exacte:
{
  "title": "Titre professionnel et impactant (max 80 caractères)",
  "tagline": "Phrase d'accroche éditoriale et inspirante (max 160 caractères)",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"],
  "excerpt": "Résumé professionnel en 2-3 phrases (max 200 caractères)",
  "suggested_category": "nom de la catégorie la plus pertinente"
}`;

      const catList = categories?.map((c: any) => c.name).join(', ') || '';
      userPrompt = `Analyse ce contenu et génère un titre, une phrase d'accroche, un résumé, la catégorie la plus pertinente et 5 hashtags pertinents.

Catégories disponibles: ${catList}

Contenu:
${content}`;
    } else if (action === "structure_article") {
      systemPrompt = `Tu es un rédacteur en chef professionnel. Tu restructures les articles de manière professionnelle.

RÈGLES DE FORMATAGE:
- Créer des paragraphes lisibles et bien espacés
- Ajouter des sous-titres (utilise <h2> ou <h3> en HTML) quand pertinent
- Mettre en <strong>gras</strong> les idées fortes
- Utiliser <em>l'italique</em> pour les citations ou nuances
- Utiliser <blockquote> pour les citations importantes
- Utiliser <ul> et <li> pour les listes
- Améliorer la lisibilité sans dénaturer la pensée de l'auteur
- Conserver le message et les idées originales
- Structurer de manière logique avec introduction, développement, conclusion
- Retourne du HTML valide, pas du Markdown

IMPORTANT: Le fondateur s'appelle Inocent KOFFI (pas "Innocent")`;

      userPrompt = `Restructure cet article de manière professionnelle en HTML:

${content}`;
    } else if (action === "generate_full_article") {
      const catList = categories?.map((c: any) => c.name).join(', ') || '';
      
      systemPrompt = `Tu es un rédacteur en chef professionnel travaillant pour Inocent KOFFI, Fondateur et Directeur Général d'AGRICAPITAL SARL, une entreprise spécialisée dans la transformation agricole en Côte d'Ivoire.

Tu génères des articles de blog complets, structurés et professionnels à partir d'une idée ou d'un sujet, ou même d'un texte brut non structuré.

STYLE ET TON:
- Professionnel, inspirant et visionnaire
- Leadership et vision stratégique
- Focus sur l'agriculture, l'entrepreneuriat africain, la souveraineté alimentaire
- Citations pertinentes (notamment de Félix Houphouët-Boigny si approprié)
- Émojis subtils pour les points clés (📌, 👉, 🌱, 💡)

STRUCTURE HTML:
- <h2> pour les titres de sections
- <h3> pour les sous-sections
- <p> pour les paragraphes (bien séparés et aérés)
- <strong> pour les idées fortes
- <em> pour l'italique
- <blockquote> pour les citations
- <ul><li> pour les listes à puces
- <ol><li> pour les listes numérotées
- <table><thead><tbody><tr><th><td> pour les tableaux si le contexte l'exige

IMPORTANT: 
- Le fondateur s'appelle Inocent KOFFI (pas "Innocent")
- Longueur: 800-1500 mots
- Le contenu doit être immédiatement publiable
- Termine par une signature ou une pensée conclusive

Catégories disponibles: ${catList}

Réponds en JSON valide avec cette structure:
{
  "title": "Titre professionnel et impactant",
  "tagline": "Phrase d'accroche",
  "content": "<h2>Introduction</h2><p>...</p>...",
  "excerpt": "Résumé en 2 phrases",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"],
  "suggested_category": "nom de la catégorie la plus pertinente"
}`;

      userPrompt = topic 
        ? `Génère un article complet sur ce sujet: ${topic}\n\nIdées additionnelles: ${content || 'Aucune'}`
        : `Analyse ce texte brut et génère un article complet, professionnel et structuré. L'IA doit comprendre le contexte, structurer l'information, et remplir TOUS les champs automatiquement:\n\n${content}`;
    } else {
      throw new Error("Action non reconnue");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
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
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requêtes atteinte. Réessayez dans quelques instants." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crédits insuffisants. Veuillez recharger votre compte." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiContent = data.choices?.[0]?.message?.content;

    if (action === "generate_meta" || action === "generate_full_article") {
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return new Response(JSON.stringify(parsed), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("Invalid AI response format");
    } else {
      return new Response(JSON.stringify({ content: aiContent }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("blog-ai-assistant error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
