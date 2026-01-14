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
    const { content, action } = await req.json();
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
  "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"]
}`;

      userPrompt = `Analyse ce contenu et génère un titre, une phrase d'accroche et 5 hashtags pertinents:

${content}`;
    } else if (action === "structure_article") {
      systemPrompt = `Tu es un rédacteur en chef professionnel. Tu restructures les articles de manière professionnelle.

RÈGLES DE FORMATAGE:
- Créer des paragraphes lisibles et bien espacés
- Ajouter des sous-titres (## en markdown) quand pertinent
- Mettre en **gras** les idées fortes
- Utiliser *l'italique* pour les citations ou nuances
- Améliorer la lisibilité sans dénaturer la pensée de l'auteur
- Conserver le message et les idées originales
- Structurer de manière logique avec introduction, développement, conclusion

IMPORTANT: Le fondateur s'appelle Inocent KOFFI (pas "Innocent")`;

      userPrompt = `Restructure cet article de manière professionnelle:

${content}`;
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

    if (action === "generate_meta") {
      // Parse JSON response
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return new Response(JSON.stringify(parsed), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("Invalid AI response format");
    } else {
      // Return structured content
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
