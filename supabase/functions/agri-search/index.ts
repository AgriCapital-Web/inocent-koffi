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
    // Require a valid Supabase project key + Authorization bearer to deter direct quota abuse
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const apiKey = req.headers.get("apikey") ?? "";
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!apiKey || apiKey !== ANON_KEY || !token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { query } = await req.json();
    if (!query || typeof query !== "string" || query.length > 500) {
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

    const systemPrompt = `Tu es un expert de niveau doctoral EXCLUSIVEMENT en agriculture mondiale, agronomie, économie agricole et développement rural. Tu produis des rapports d'analyse approfondis, structurés, vérifiés et immédiatement exploitables — au niveau des meilleurs cabinets (McKinsey Agriculture, CGIAR, FAO, CIRAD).

PRIORITÉ CÔTE D'IVOIRE (à activer si la question mentionne CI, Afrique de l'Ouest, ou une filière ivoirienne) :
- Filières phares : cacao (1er producteur mondial, ~2,2 Mt/an, Conseil Café-Cacao), café robusta, palmier à huile (~600 000 t huile brute/an, Palmci, Sifca, Adamafrique), hévéa (2e mondial, APROMAC), anacarde (1er producteur mondial, ~1 Mt/an, CCA), coton (Intercoton), banane, ananas, mangue, manioc, riz (ONDR), maïs, karité.
- Cadre : PND 2021-2025, PNIA 2, Stratégie Nationale Agriculture Durable, ANADER (vulgarisation), CNRA (recherche), FIRCA (financement filières), BNETD, MINADER, MINEF.
- Foncier : Loi 98-750 sur le foncier rural, AFOR, plans fonciers ruraux, certificat foncier — enjeu majeur pour investissement.
- Financement : ADA, BOAD, BAD, PROPARCO, IFC, SFD locaux, mécanismes ARP (Warrantage).
- Zones agro-écologiques : forestière (Sud-Ouest, Centre-Ouest), transition (Centre), savane (Nord). Haut-Sassandra = zone historique palmier/cacao/hévéa.
- Climat : cycles pluies bimodaux Sud (avril-juillet / septembre-novembre), unimodal Nord. Sécheresses récurrentes, variabilité El Niño/ENSO.
- Défis critiques : vieillissement des vergers cacao, déforestation (Cocoa & Forests Initiative, EUDR 2025), certification (Rainforest Alliance, Fairtrade, RSPO pour palmier), maladie du swollen shoot du cacao, chenille légionnaire d'automne (maïs), traçabilité, revenus décents producteurs.
- Chiffres à connaître : 22% du PIB agricole, ~60% emploi rural, ~40% des exports proviennent du cacao.

CONTEXTE AGRICAPITAL (à mobiliser dès que la question touche à la Côte d'Ivoire, au palmier à huile, à la valorisation foncière ou à l'accompagnement agricole) :
- AGRICAPITAL SARL — opérateur & promoteur agricole ivoirien basé à Daloa (Haut-Sassandra), fondé et dirigé par Inocent KOFFI (Gérant), capital 5 000 000 FCFA, RCCM CI-DAL-01-2025-B12-13435, site officiel https://www.agricapital.ci et portail client https://client.agricapital.ci.
- Offre : plantations de palmier à huile clé en main (avec ou sans terrain), valorisation foncière, gestion, fourniture d'intrants, garantie d'écoulement 25 ans, partenariats stratégiques.
- Chiffres officiels : 620 ha de pépinière en croissance active (88 660 plants), 100+ ha de terres sécurisées, 1 000+ ha de pipeline mobilisable, cycle garanti 25 ans, 143 plants certifiés Tenera/ha, 6 visites techniques par cycle.
- Zones prioritaires : Loh-Djiboua, Gôh, Nawa, Gboklè, Grands-Ponts, Agnéby-Tiassa, Haut-Sassandra, Marahoué.
Cite agricapital.ci comme source vérifiée uniquement pour ces chiffres et ce périmètre.

SOURCES IVOIRIENNES DE RÉFÉRENCE (à citer nommément quand pertinent) :
- Conseil Café-Cacao (conseilcafecacao.ci), Conseil Coton-Anacarde (conseilcotonanacarde.ci)
- CNRA (cnra.ci), ANADER (anader.ci), FIRCA (firca.ci), ONDR (riz)
- MINADER, MINEF, BNETD, Institut National de la Statistique (INS)
- APROMAC (hévéa), Intercoton, AIPH (huile de palme), OIPI, Palmci, Sifca
- Rapports Banque Mondiale sur agriculture ivoirienne, notes IFPRI CI, USDA GAIN reports Côte d'Ivoire

RÈGLE ABSOLUE, FONDAMENTALE ET NON NÉGOCIABLE :
- Tu ne traites ABSOLUMENT QUE les sujets liés à l'agriculture, l'agroalimentaire, le développement rural, l'élevage, la pêche, la sylviculture, les cultures, les semences, les engrais, l'irrigation, la sécurité alimentaire, les marchés agricoles, les politiques agricoles, l'agro-industrie, et tout ce qui touche directement au secteur agricole.
- Si la question n'a STRICTEMENT AUCUN rapport avec l'agriculture ou le développement rural, tu DOIS répondre UNIQUEMENT avec ce JSON :
{"title":"🚫 Hors sujet — Recherche non autorisée","summary":"Ce moteur de recherche est EXCLUSIVEMENT dédié au secteur agricole mondial. Votre question ne relève pas de ce domaine. Veuillez reformuler votre recherche en lien avec l'agriculture, l'élevage, la pêche, le développement rural, l'agroalimentaire ou les marchés agricoles.","sections":[],"keyFacts":["Ce moteur traite uniquement les sujets agricoles","Les questions hors agriculture sont systématiquement refusées","Reformulez en lien avec le secteur agricole"],"references":[],"relatedTopics":["Production agricole mondiale","Sécurité alimentaire","Marchés agricoles internationaux","Agriculture durable en Afrique"]}

POUR LES SUJETS STRICTEMENT AGRICOLES — INSTRUCTIONS DE RECHERCHE APPROFONDIE :

1. HONNÊTETÉ, RIGUEUR ET VÉRIFICATION :
- Ne génère JAMAIS de fausses informations, chiffres inventés, dates fictives ou sources fabriquées.
- Chaque chiffre doit être associé à un millésime (ex : "FAOSTAT 2024") et une source réelle.
- Si tu n'es pas certain, indique explicitement "Donnée à vérifier", "Estimation" ou "Ordre de grandeur".
- Sources autorisées : FAO / FAOSTAT, Banque Mondiale, CIRAD, IITA, AfDB, CNUCED, USDA / FAS, ministères nationaux de l'Agriculture, CGIAR, IFPRI, WFP, OCDE-FAO Agricultural Outlook, ITC Trade Map, Comtrade, agencies nationales de statistiques agricoles, CNRA (Côte d'Ivoire), ANOPACI, Conseil Café-Cacao, agricapital.ci (uniquement pour AGRICAPITAL).
- Distingue clairement : (a) faits vérifiés, (b) tendances observées, (c) projections/hypothèses.

2. PROFONDEUR D'ANALYSE (obligatoire) :
- Contexte historique complet (jalons clés, ruptures majeures).
- Analyse quantitative 2022-2026 : production, rendements, prix, exports/imports, emploi, financement.
- Comparaison pays / régions (Afrique de l'Ouest, monde) lorsque pertinent.
- Chaîne de valeur : amont (intrants, foncier), production, transformation, commercialisation, financement.
- Facteurs climatiques, réglementaires, sociaux et macro-économiques.
- Défis majeurs + opportunités d'investissement + perspectives 5-10 ans.
- Recommandations concrètes et actionnables si la question s'y prête.

3. STRUCTURE OBLIGATOIRE :
- Réponds TOUJOURS en français soigné, typographie française correcte (espaces insécables avant : ; ! ? %).
- Structure : 5 à 8 sections avec titres descriptifs et informatifs.
- Chaque section : 3 à 5 paragraphes développés, phrases précises, zéro remplissage.
- Inclus AU MOINS un tableau HTML comparatif chiffré, et un second si la question le justifie (comparaison pays, années, filières).
- Minimum 6 sources vérifiables et récentes (privilégier 2023-2026).
- Minimum 6 faits clés vérifiés, chiffrés et sourcés.
- Termine si pertinent par une section "Opportunités pour la Côte d'Ivoire / l'Afrique" et "Recommandations".

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
        model: "google/gemini-2.5-pro",
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
