import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { query } = await req.json();
    if (!query) {
      return new Response(JSON.stringify({ error: "Query is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `Tu es un expert en agriculture mondiale et en développement rural. Tu effectues des recherches approfondies et fournis des réponses structurées, professionnelles et vérifiées.

IMPORTANT:
- Réponds TOUJOURS en français
- Structure ta réponse en sections claires avec des titres
- Inclus des données chiffrées quand possible
- Mentionne les sources et références fiables
- Détecte et évite les fausses informations
- Si applicable, inclus des tableaux comparatifs en format HTML
- Fournis des liens vers des ressources fiables (FAO, Banque Mondiale, ministères, etc.)

Format de réponse en JSON:
{
  "title": "Titre principal de la recherche",
  "summary": "Résumé en 2-3 phrases",
  "sections": [
    {
      "title": "Titre de section",
      "content": "Contenu détaillé en HTML (utilise <p>, <ul>, <li>, <strong>, <table>, etc.)",
      "sources": ["URL ou référence"]
    }
  ],
  "keyFacts": ["Fait clé 1", "Fait clé 2", "Fait clé 3"],
  "references": [{"title": "Titre", "url": "URL", "type": "Organisation/Rapport/Article"}],
  "relatedTopics": ["Sujet connexe 1", "Sujet connexe 2"]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Recherche approfondie sur : "${query}". Fournis une analyse complète, structurée et vérifiée.` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "format_research",
              description: "Format the agricultural research results",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  summary: { type: "string" },
                  sections: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        content: { type: "string" },
                        sources: { type: "array", items: { type: "string" } },
                      },
                      required: ["title", "content"],
                    },
                  },
                  keyFacts: { type: "array", items: { type: "string" } },
                  references: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        url: { type: "string" },
                        type: { type: "string" },
                      },
                      required: ["title"],
                    },
                  },
                  relatedTopics: { type: "array", items: { type: "string" } },
                },
                required: ["title", "summary", "sections", "keyFacts"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "format_research" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Trop de requêtes, veuillez réessayer dans quelques instants." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporairement indisponible." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erreur du service de recherche" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    let result;
    if (toolCall?.function?.arguments) {
      result = typeof toolCall.function.arguments === 'string' 
        ? JSON.parse(toolCall.function.arguments) 
        : toolCall.function.arguments;
    } else {
      // Fallback: try to parse from content
      const content = data.choices?.[0]?.message?.content || "";
      try {
        result = JSON.parse(content);
      } catch {
        result = {
          title: "Résultats de recherche",
          summary: content.slice(0, 200),
          sections: [{ title: "Résultats", content: `<p>${content}</p>` }],
          keyFacts: [],
          references: [],
          relatedTopics: [],
        };
      }
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("agri-search error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erreur inconnue" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
