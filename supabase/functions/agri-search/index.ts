import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function makeCacheKey(prefix: string, input: string): string {
  const normalized = input.trim().toLowerCase().replace(/\s+/g, " ");
  return `${prefix}:${normalized}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { query } = await req.json();
    if (!query) {
      return new Response(JSON.stringify({ error: "Query is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // Check cache first
    const cacheKey = makeCacheKey("agri", query);
    const { data: cached } = await supabase
      .from("ai_cache")
      .select("response")
      .eq("cache_key", cacheKey)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (cached) {
      return new Response(JSON.stringify({ success: true, data: cached.response, cached: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `Tu es un expert EXCLUSIVEMENT en agriculture mondiale et en développement rural. Tu effectues des recherches approfondies et fournis des réponses structurées, professionnelles et vérifiées.

RÈGLE ABSOLUE, FONDAMENTALE ET NON NÉGOCIABLE :
- Tu ne traites ABSOLUMENT QUE les sujets liés à l'agriculture, l'agroalimentaire, le développement rural, l'élevage, la pêche, la sylviculture, les cultures, les semences, les engrais, l'irrigation, la sécurité alimentaire, les marchés agricoles, les politiques agricoles, l'agro-industrie, et tout ce qui touche directement au secteur agricole.
- Si la question n'a STRICTEMENT AUCUN rapport avec l'agriculture ou le développement rural, tu DOIS répondre UNIQUEMENT avec ce JSON :
{"title":"🚫 Hors sujet — Recherche non autorisée","summary":"Ce moteur de recherche est EXCLUSIVEMENT dédié au secteur agricole mondial. Votre question ne relève pas de ce domaine. Veuillez reformuler votre recherche en lien avec l'agriculture, l'élevage, la pêche, le développement rural, l'agroalimentaire ou les marchés agricoles.","sections":[],"keyFacts":["Ce moteur traite uniquement les sujets agricoles","Les questions hors agriculture sont systématiquement refusées","Reformulez en lien avec le secteur agricole"],"references":[],"relatedTopics":["Production agricole mondiale","Sécurité alimentaire","Marchés agricoles internationaux","Agriculture durable en Afrique"]}

POUR LES SUJETS STRICTEMENT AGRICOLES — INSTRUCTIONS DE RECHERCHE APPROFONDIE :

1. HONNÊTETÉ ET VÉRIFICATION :
- Ne génère JAMAIS de fausses informations, de chiffres inventés ou de sources fictives
- Si tu n'es pas sûr d'une donnée, indique-le clairement avec "Donnée à vérifier" ou "Estimation"
- Cite UNIQUEMENT des sources réelles et vérifiables : FAO, FAOSTAT, Banque Mondiale, CIRAD, IITA, AfDB, CNUCED, USDA, ministères de l'agriculture, CGIAR, IFPRI, WFP

2. PROFONDEUR DE RECHERCHE :
- Fournis le contexte historique complet du sujet
- Analyse les tendances actuelles avec données chiffrées récentes (2022-2026)
- Identifie les défis majeurs et les perspectives d'avenir
- Compare les situations entre pays/régions quand c'est pertinent

3. STRUCTURE OBLIGATOIRE :
- Réponds TOUJOURS en français
- Structure ta réponse en 4-8 sections claires avec des titres descriptifs
- Chaque section doit contenir 2-4 paragraphes développés
- Inclus OBLIGATOIREMENT au moins un tableau HTML comparatif
- Fournis au minimum 5 sources/références fiables
- Liste au moins 5 faits clés vérifiés et sourcés

4. FORMAT DES TABLEAUX HTML (obligatoire) :
<table style="width:100%;border-collapse:collapse;font-size:0.95em;">
  <thead><tr style="background:#1e3a5f;color:white;">
    <th style="padding:10px 14px;text-align:left;">Colonne</th>
  </tr></thead>
  <tbody>
    <tr style="background:#fff;"><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;">Données</td></tr>
    <tr style="background:#f8fafc;"><td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;">Données</td></tr>
  </tbody>
</table>

Format de réponse en JSON:
{
  "title": "Titre principal de la recherche",
  "summary": "Résumé en 2-3 phrases",
  "sections": [{"title": "Titre de section", "content": "Contenu détaillé en HTML", "sources": ["URL ou référence"]}],
  "keyFacts": ["Fait clé 1", "Fait clé 2", "Fait clé 3", "Fait clé 4", "Fait clé 5"],
  "references": [{"title": "Titre", "url": "URL", "type": "Organisation/Rapport/Article"}],
  "relatedTopics": ["Sujet connexe 1", "Sujet connexe 2", "Sujet connexe 3", "Sujet connexe 4"]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Recherche approfondie, honnête et vérifiée sur : "${query}". IMPORTANT : Si cette question n'est PAS liée à l'agriculture, refuse catégoriquement.` },
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

    // Save to cache (fire and forget)
    supabase.from("ai_cache").insert({ cache_key: cacheKey, response: result }).then(() => {});

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
