import { Target, Users, Leaf, Shield } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const About = () => {
  const { language } = useLanguage();
  const content = {
    fr: {
      title: "À Propos",
      intro1: "Fondateur — AGRICAPITAL SARL",
      intro2: "Agro-entrepreneur et stratège en développement agricole",
      intro3: "Inocent KOFFI cumule plus de 12 années d'immersion terrain en Côte d'Ivoire. Cette connaissance intime du territoire, des réalités agricoles et du potentiel foncier constitue un atout stratégique majeur pour AgriCapital.",
      intro4: "AgriCapital est un opérateur et promoteur agricole qui conçoit et déploie des plantations de palmier à huile clé en main, permettant aux particuliers et professionnels d'accéder à une agriculture productive, tout en étant déchargés des contraintes techniques, foncières et organisationnelles.",
      intro5: "De 2012 à 2024, il a parcouru plus de 360 localités à travers 8 régions de Côte d'Ivoire — en contact direct et permanent avec les communautés rurales, identifiant et validant les meilleures terres pour les clients d'AgriCapital.",
      values: [
        ["Opérateur Agricole", "Création de plantations de palmier à huile clé en main, avec ou sans terrain."],
        ["Accompagnement Complet", "De la sécurisation foncière à la commercialisation, un suivi rigoureux et transparent."],
        ["Patrimoine Durable", "Un modèle sur 28 ans pour bâtir un patrimoine agricole tangible et générateur de revenus."],
        ["Sécurité Contractuelle", "Contrats certifiés, cartographie GPS, cadre juridique solide et garantie d'achat sur 25 ans."]
      ]
    },
    en: {
      title: "About",
      intro1: "Founder — AGRICAPITAL SARL",
      intro2: "Agro-entrepreneur and agricultural development strategist",
      intro3: "Inocent KOFFI has over 12 years of field immersion in Côte d'Ivoire. This deep knowledge of the territory, agricultural realities and land potential is a major strategic asset for AgriCapital.",
      intro4: "AgriCapital is an agricultural operator and promoter that designs and deploys turnkey oil palm plantations, enabling individuals and businesses to access productive agriculture while being relieved of technical, land and organizational constraints.",
      intro5: "From 2012 to 2024, he traveled through more than 360 localities across 8 regions of Côte d'Ivoire, maintaining direct contact with rural communities to identify and validate the best land for AgriCapital clients.",
      values: [["Agricultural Operator", "Turnkey oil palm plantations, with or without land."],["End-to-End Support", "From land security to commercialization, with rigorous and transparent monitoring."],["Sustainable Heritage", "A 28-year model to build tangible agricultural assets and recurring income."],["Contractual Security", "Certified contracts, GPS mapping, strong legal framework and 25-year purchase guarantee."]]
    },
    es: {
      title: "Acerca de",
      intro1: "Fundador — AGRICAPITAL SARL",
      intro2: "Agroemprendedor y estratega en desarrollo agrícola",
      intro3: "Inocent KOFFI acumula más de 12 años de inmersión de campo en Costa de Marfil. Este conocimiento profundo del territorio, de la realidad agrícola y del potencial de la tierra es una ventaja estratégica clave para AgriCapital.",
      intro4: "AgriCapital es un operador y promotor agrícola que diseña e implementa plantaciones de palma aceitera llave en mano, permitiendo a particulares y profesionales acceder a una agricultura productiva sin soportar las limitaciones técnicas, territoriales y organizativas.",
      intro5: "De 2012 a 2024 recorrió más de 360 localidades en 8 regiones de Costa de Marfil, en contacto directo y permanente con las comunidades rurales, identificando y validando las mejores tierras para los clientes de AgriCapital.",
      values: [["Operador Agrícola", "Creación de plantaciones de palma aceitera llave en mano, con o sin tierra."],["Acompañamiento Integral", "Desde la seguridad de la tierra hasta la comercialización, con seguimiento riguroso y transparente."],["Patrimonio Sostenible", "Un modelo de 28 años para construir un patrimonio agrícola tangible y generador de ingresos."],["Seguridad Contractual", "Contratos certificados, cartografía GPS, marco jurídico sólido y garantía de compra durante 25 años."]]
    },
    de: {
      title: "Über uns",
      intro1: "Gründer — AGRICAPITAL SARL",
      intro2: "Agro-Unternehmer und Stratege für landwirtschaftliche Entwicklung",
      intro3: "Inocent KOFFI verfügt über mehr als 12 Jahre Praxiserfahrung in Côte d'Ivoire. Dieses tiefe Wissen über Territorium, landwirtschaftliche Realitäten und Landpotenziale ist ein entscheidender strategischer Vorteil für AgriCapital.",
      intro4: "AgriCapital ist ein landwirtschaftlicher Betreiber und Projektentwickler, der schlüsselfertige Ölpalmenplantagen konzipiert und umsetzt. So erhalten Privatpersonen und Unternehmen Zugang zu produktiver Landwirtschaft, ohne technische, landbezogene und organisatorische Lasten zu tragen.",
      intro5: "Von 2012 bis 2024 bereiste er mehr als 360 Ortschaften in 8 Regionen der Côte d'Ivoire und stand in direktem Kontakt mit ländlichen Gemeinschaften, um die besten Flächen für AgriCapital-Kunden zu identifizieren und zu validieren.",
      values: [["Landwirtschaftlicher Betreiber", "Schlüsselfertige Ölpalmenplantagen, mit oder ohne eigenes Land."],["Ganzheitliche Begleitung", "Von der Landabsicherung bis zur Vermarktung mit rigoroser und transparenter Betreuung."],["Nachhaltiges Vermögen", "Ein 28-Jahres-Modell zum Aufbau greifbarer landwirtschaftlicher Vermögenswerte."],["Vertragliche Sicherheit", "Zertifizierte Verträge, GPS-Kartierung, solides Rechtsrahmenwerk und 25-jährige Abnahmegarantie."]]
    },
    zh: {
      title: "关于",
      intro1: "创始人 — AGRICAPITAL SARL",
      intro2: "农业创业者与农业发展战略家",
      intro3: "Inocent KOFFI 在科特迪瓦拥有 12 年以上的一线实践经验。对土地、农业现实与土地潜力的深刻理解，是 AgriCapital 的重要战略优势。",
      intro4: "AgriCapital 是一家农业运营与推广机构，设计并落地交钥匙油棕种植园，让个人和企业进入高产农业，同时摆脱技术、土地和组织层面的复杂约束。",
      intro5: "2012 至 2024 年间，他走访了科特迪瓦 8 个地区的 360 多个地方，与农村社区保持直接联系，为 AgriCapital 客户识别并验证优质土地。",
      values: [["农业运营方", "提供有地或无地的交钥匙油棕种植方案。"],["全程陪伴", "从土地安全到商业化，全流程严谨透明。"],["可持续资产", "基于 28 年周期构建可传承的农业资产与收入。"],["合同安全", "认证合同、GPS 测绘、稳固法务框架和 25 年回购保障。"]]
    },
    ar: {
      title: "نبذة",
      intro1: "المؤسس — AGRICAPITAL SARL",
      intro2: "رائد أعمال زراعي واستراتيجي في التنمية الزراعية",
      intro3: "يملك Inocent KOFFI أكثر من 12 سنة من الخبرة الميدانية في كوت ديفوار، وهو ما يمنح AgriCapital فهماً عميقاً للأرض والواقع الزراعي وإمكانات الاستثمار الزراعي.",
      intro4: "AgriCapital جهة تشغيل وتطوير زراعي تصمم وتنفذ مزارع نخيل زيت متكاملة، بما يتيح للأفراد والمهنيين دخول الزراعة الإنتاجية دون تعقيدات تقنية أو عقارية أو تنظيمية.",
      intro5: "من 2012 إلى 2024 زار أكثر من 360 منطقة عبر 8 أقاليم في كوت ديفوار، وبقي على تواصل مباشر مع المجتمعات الريفية لتحديد أفضل الأراضي والتحقق منها لصالح عملاء AgriCapital.",
      values: [["مشغّل زراعي", "إنشاء مزارع نخيل زيت متكاملة مع الأرض أو بدونها."],["مرافقة شاملة", "من تأمين الأرض إلى التسويق بمتابعة صارمة وشفافة."],["أصل مستدام", "نموذج على 28 سنة لبناء أصل زراعي ملموس ومدر للدخل."],["أمان تعاقدي", "عقود موثقة وخرائط GPS وإطار قانوني قوي وضمان شراء لمدة 25 سنة."]]
    }
  }[language];
  const values = [
    {
      icon: Target,
      title: content.values[0][0],
      description: content.values[0][1]
    },
    {
      icon: Users,
      title: content.values[1][0],
      description: content.values[1][1]
    },
    {
      icon: Leaf,
      title: content.values[2][0],
      description: content.values[2][1]
    },
    {
      icon: Shield,
      title: content.values[3][0],
      description: content.values[3][1]
    }
  ];

  return (
    <section id="about" className="py-12 sm:py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 text-foreground">
              {content.title.includes(' ') ? content.title.split(' ')[0] : content.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{content.title.includes(' ') ? content.title.split(' ').slice(1).join(' ') : ''}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-start">
            <div className="space-y-4 sm:space-y-6">
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                <strong className="text-foreground">{content.intro1}</strong>
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed italic">
                {content.intro2}
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                {content.intro3}
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                {content.intro4}
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed hidden sm:block">
                {content.intro5}
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div 
                    key={index}
                    className="flex gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-secondary/50 hover:bg-secondary/70 transition-colors border border-border/50"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-foreground">{value.title}</h3>
                      <p className="text-sm sm:text-base text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
