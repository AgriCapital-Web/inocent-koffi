import { describe, expect, it } from "bun:test";
import {
  buildWhatsAppMessage,
  buildWhatsAppShareUrl,
  DEFAULT_SIGNATURE,
  detectLanguage,
} from "../whatsappShare";

describe("WhatsApp share formatting", () => {
  const cases = [
    { title: "Investir dans le palmier à huile", desc: "Guide complet 2026" },
    { title: "Café & cacao : prix records !", desc: "Analyse des marges." },
    { title: "L’avenir de l’agro-industrie en Côte d’Ivoire", desc: "Vision 2030" },
    { title: 'Étude "PALMISTES 2026" — résultats <chocs>', desc: "Données vérifiées" },
    { title: "100% bio : pourquoi ça marche ?", desc: "Étude terrain" },
    { title: "🌴 Hévéa : opportunités cachées", desc: "Notre analyse" },
  ];

  for (const { title, desc } of cases) {
    // The helper normalizes typographic apostrophes/quotes for cross-language safety
    const normalizedTitle = title
      .replace(/[’‘‚‛]/g, "'")
      .replace(/[“”«»„]/g, '"');
    it(`wraps title in *bold* and signature in _italic_ — "${title}"`, () => {
      const msg = buildWhatsAppMessage({
        title,
        description: desc,
        url: "https://ikoffi.agricapital.ci/new/art004-026",
      });
      expect(msg.startsWith(`*${normalizedTitle}*`)).toBe(true);
      expect(msg).toContain(`_${DEFAULT_SIGNATURE}_`);
      expect(msg).toContain("https://ikoffi.agricapital.ci/new/art004-026");
    });

    it(`URL-encodes payload safely — "${title}"`, () => {
      const url = buildWhatsAppShareUrl({
        title,
        description: desc,
        url: "https://ikoffi.agricapital.ci/new/art004-026",
      });
      expect(url.startsWith("https://wa.me/?text=")).toBe(true);
      const decoded = decodeURIComponent(url.replace("https://wa.me/?text=", ""));
      expect(decoded).toContain(`*${normalizedTitle}*`);
      expect(decoded).toContain(`_${DEFAULT_SIGNATURE}_`);
    });
  }

  it("truncates very long descriptions but keeps formatting", () => {
    const long = "x".repeat(500);
    const msg = buildWhatsAppMessage({
      title: "Titre",
      description: long,
      url: "https://example.com",
    });
    expect(msg).toMatch(/^\*Titre\*/);
    expect(msg).toContain("…");
    expect(msg).toContain(`_${DEFAULT_SIGNATURE}_`);
  });

  it("falls back to title when description is empty", () => {
    const msg = buildWhatsAppMessage({
      title: "Mon titre seul",
      url: "https://example.com",
    });
    expect(msg).toContain("*Mon titre seul*");
    expect(msg.split("\n\n")[1]).toBe("Mon titre seul");
  });

  describe("auto language detection", () => {
    it("detects Arabic and adds RTL marker", () => {
      const msg = buildWhatsAppMessage({
        title: "الزراعة المستدامة في كوت ديفوار",
        description: "تحليل شامل للقطاع الزراعي",
        url: "https://example.com",
      });
      expect(msg).toContain("\u200F");
      expect(detectLanguage("الزراعة المستدامة")).toBe("ar");
    });

    it("detects Chinese (CJK)", () => {
      expect(detectLanguage("可持续农业的未来")).toBe("zh");
      const msg = buildWhatsAppMessage({
        title: "可持续农业的未来",
        url: "https://example.com",
      });
      // Bold marker must remain at the very start
      expect(msg.startsWith("*")).toBe(true);
    });

    it("detects Japanese (Hiragana)", () => {
      expect(detectLanguage("持続可能な農業のあり方")).toBe("ja");
    });

    it("detects Hebrew", () => {
      expect(detectLanguage("חקלאות בת קיימא")).toBe("he");
    });

    it("returns empty for Latin text (default mode)", () => {
      expect(detectLanguage("Investir dans le palmier à huile")).toBe("");
      expect(detectLanguage("Sustainable agriculture in Africa")).toBe("");
    });

    it("explicit locale overrides auto-detection", () => {
      const msg = buildWhatsAppMessage({
        title: "Investir",
        url: "https://example.com",
        locale: "ar",
      });
      expect(msg).toContain("\u200F");
    });
  });
});