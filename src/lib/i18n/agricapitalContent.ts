import type { Language } from "./translations";

export interface AgricapitalContent {
  whyChoose: { title: string; description: string }[];
  steps: { num: string; title: string; desc: string }[];
  capacity: { value: string; label: string }[];
  team: { name: string; role: string; desc: string }[];
  partners: { name: string; role: string }[];
  labels: {
    sectionWhy: string;
    sectionProcess: string;
    processIntro: string;
    sectionCapacity: string;
    sectionTeam: string;
    sectionPartners: string;
  };
}

export const agricapitalContent: Record<Language, AgricapitalContent> = {
  fr: {
    whyChoose: [
      { title: "Patrimoine Durable", description: "Constituez un actif agricole tangible qui prend de la valeur dans le temps. Une alternative concrète pour diversifier vos investissements." },
      { title: "Accompagnement Complet", description: "De la sécurisation foncière à la commercialisation : AgriCapital gère l'ensemble du processus avec rigueur et transparence." },
      { title: "Sécurité Contractuelle", description: "Contrats certifiés, documents cartographiques GPS, cadre juridique solide — chaque étape est sécurisée et transparente." },
    ],
    steps: [
      { num: "01", title: "Identification, Validation & Sécurisation Foncière", desc: "AgriCapital identifie et sécurise des terres adaptées, en partenariat avec les propriétaires terriens." },
      { num: "02", title: "Référencement & Cartographie", desc: "Polygonage GPS, cartographie détaillée et référencement complet de chaque parcelle." },
      { num: "03", title: "Engagement & Formalisation", desc: "Choisissez votre formule d'accompagnement. Remise de votre contrat sécurisé et plan cartographique personnalisé." },
      { num: "04", title: "Développement de la Plantation — 36 mois", desc: "143 plants certifiés par hectare, défrichage, piquetage, plantation, intrants et fertilisation. 6 visites techniques." },
      { num: "05", title: "Remise de la Plantation", desc: "Plantation productive livrée clé en main. Suivi agronomique inclus, fourniture d'intrants et garantie d'achat." },
    ],
    capacity: [
      { value: "120 ha", label: "de pépinière en croissance active" },
      { value: "50 ha", label: "disponibles pour plantation immédiate" },
      { value: "500+ ha", label: "de terres identifiées" },
      { value: "25 ans", label: "de garantie d'achat et suivi" },
    ],
    team: [
      { name: "Inocent KOFFI", role: "Directeur Général", desc: "Entrepreneur et stratège, vision globale et coordination du déploiement." },
      { name: "Koffi Pierre KOUAMÉ", role: "Conseiller Stratégique", desc: "10+ ans d'expérience en gouvernance organisationnelle et sécurisation foncière." },
      { name: "Éric Stéphane DIDO", role: "Responsable Développement Commercial", desc: "Stratégie commerciale, déploiement terrain et développement du portefeuille clients." },
    ],
    partners: [
      { name: "Dr Marcel KONAN — MiProjet", role: "Structuration de Projets & Stratégie" },
      { name: "Kouamé Mathieu ANGA", role: "Agronomie & Suivi de Plantation" },
      { name: "Cabinet Legal Form", role: "Expertise Juridique" },
      { name: "Cabinet GESMA SARL", role: "Expertise Comptable & Fiscale" },
      { name: "Les Palmistes", role: "Fournisseur de semences certifiées Iro Lamé" },
    ],
    labels: {
      sectionWhy: "Pourquoi choisir AgriCapital",
      sectionProcess: "Notre Processus",
      processIntro: "Un processus structuré en 5 étapes",
      sectionCapacity: "Notre Capacité",
      sectionTeam: "L'Équipe AgriCapital",
      sectionPartners: "Nos Partenaires Stratégiques",
    },
  },

  en: {
    whyChoose: [
      { title: "Lasting Assets", description: "Build a tangible agricultural asset that grows in value over time — a concrete way to diversify your investments." },
      { title: "Full Support", description: "From land security to commercialization: AgriCapital handles the entire process with rigor and transparency." },
      { title: "Contractual Security", description: "Certified contracts, GPS mapping documents, and a solid legal framework — every step is secured and transparent." },
    ],
    steps: [
      { num: "01", title: "Land Identification, Validation & Securing", desc: "AgriCapital identifies and secures suitable land, in partnership with landowners." },
      { num: "02", title: "Registration & Mapping", desc: "GPS polygon mapping, detailed cartography and full registration of each parcel." },
      { num: "03", title: "Commitment & Formalization", desc: "Choose your support package. Receive your secured contract and personalized cartographic plan." },
      { num: "04", title: "Plantation Development — 36 months", desc: "143 certified plants per hectare, clearing, staking, planting, inputs and fertilization. 6 technical visits." },
      { num: "05", title: "Plantation Handover", desc: "Productive plantation delivered turnkey. Agronomic follow-up, inputs supply and guaranteed buy-back included." },
    ],
    capacity: [
      { value: "120 ha", label: "of nursery in active growth" },
      { value: "50 ha", label: "available for immediate planting" },
      { value: "500+ ha", label: "of identified land" },
      { value: "25 years", label: "of buy-back guarantee and follow-up" },
    ],
    team: [
      { name: "Inocent KOFFI", role: "Managing Director", desc: "Entrepreneur and strategist, overall vision and coordination of the deployment." },
      { name: "Koffi Pierre KOUAMÉ", role: "Strategic Advisor", desc: "10+ years of experience in organizational governance and land security." },
      { name: "Éric Stéphane DIDO", role: "Head of Business Development", desc: "Commercial strategy, field deployment and client portfolio development." },
    ],
    partners: [
      { name: "Dr Marcel KONAN — MiProjet", role: "Project Structuring & Strategy" },
      { name: "Kouamé Mathieu ANGA", role: "Agronomy & Plantation Monitoring" },
      { name: "Cabinet Legal Form", role: "Legal Expertise" },
      { name: "Cabinet GESMA SARL", role: "Accounting & Tax Expertise" },
      { name: "Les Palmistes", role: "Supplier of certified Iro Lamé seeds" },
    ],
    labels: {
      sectionWhy: "Why choose AgriCapital",
      sectionProcess: "Our Process",
      processIntro: "A structured 5-step process",
      sectionCapacity: "Our Capacity",
      sectionTeam: "The AgriCapital Team",
      sectionPartners: "Our Strategic Partners",
    },
  },

  es: {
    whyChoose: [
      { title: "Patrimonio Duradero", description: "Constituya un activo agrícola tangible que se valoriza con el tiempo. Una alternativa concreta para diversificar sus inversiones." },
      { title: "Acompañamiento Integral", description: "Desde la seguridad de la tierra hasta la comercialización: AgriCapital gestiona todo el proceso con rigor y transparencia." },
      { title: "Seguridad Contractual", description: "Contratos certificados, mapas GPS y un marco legal sólido: cada etapa es segura y transparente." },
    ],
    steps: [
      { num: "01", title: "Identificación, Validación y Seguridad de la Tierra", desc: "AgriCapital identifica y asegura tierras adecuadas, en alianza con los propietarios." },
      { num: "02", title: "Registro y Cartografía", desc: "Poligonado GPS, cartografía detallada y registro completo de cada parcela." },
      { num: "03", title: "Compromiso y Formalización", desc: "Elija su paquete de acompañamiento. Reciba su contrato seguro y plan cartográfico personalizado." },
      { num: "04", title: "Desarrollo de la Plantación — 36 meses", desc: "143 plantas certificadas por hectárea, desmonte, balizado, siembra, insumos y fertilización. 6 visitas técnicas." },
      { num: "05", title: "Entrega de la Plantación", desc: "Plantación productiva entregada llave en mano. Seguimiento agronómico, suministro de insumos y garantía de compra incluidos." },
    ],
    capacity: [
      { value: "120 ha", label: "de vivero en crecimiento activo" },
      { value: "50 ha", label: "disponibles para siembra inmediata" },
      { value: "500+ ha", label: "de tierras identificadas" },
      { value: "25 años", label: "de garantía de compra y seguimiento" },
    ],
    team: [
      { name: "Inocent KOFFI", role: "Director General", desc: "Empresario y estratega, visión global y coordinación del despliegue." },
      { name: "Koffi Pierre KOUAMÉ", role: "Asesor Estratégico", desc: "Más de 10 años de experiencia en gobernanza organizacional y seguridad de la tierra." },
      { name: "Éric Stéphane DIDO", role: "Responsable de Desarrollo Comercial", desc: "Estrategia comercial, despliegue en campo y desarrollo de cartera de clientes." },
    ],
    partners: [
      { name: "Dr Marcel KONAN — MiProjet", role: "Estructuración de Proyectos y Estrategia" },
      { name: "Kouamé Mathieu ANGA", role: "Agronomía y Seguimiento de Plantación" },
      { name: "Cabinet Legal Form", role: "Asesoría Jurídica" },
      { name: "Cabinet GESMA SARL", role: "Asesoría Contable y Fiscal" },
      { name: "Les Palmistes", role: "Proveedor de semillas certificadas Iro Lamé" },
    ],
    labels: {
      sectionWhy: "Por qué elegir AgriCapital",
      sectionProcess: "Nuestro Proceso",
      processIntro: "Un proceso estructurado en 5 etapas",
      sectionCapacity: "Nuestra Capacidad",
      sectionTeam: "El Equipo AgriCapital",
      sectionPartners: "Nuestros Socios Estratégicos",
    },
  },

  de: {
    whyChoose: [
      { title: "Nachhaltiges Vermögen", description: "Bauen Sie ein greifbares landwirtschaftliches Vermögen auf, das im Laufe der Zeit an Wert gewinnt – eine konkrete Alternative zur Diversifizierung Ihrer Investitionen." },
      { title: "Umfassende Begleitung", description: "Von der Landsicherung bis zur Vermarktung: AgriCapital steuert den gesamten Prozess mit Sorgfalt und Transparenz." },
      { title: "Vertragliche Sicherheit", description: "Zertifizierte Verträge, GPS-Kartendokumente und ein solider Rechtsrahmen – jeder Schritt ist abgesichert und transparent." },
    ],
    steps: [
      { num: "01", title: "Identifizierung, Validierung & Sicherung des Landes", desc: "AgriCapital identifiziert und sichert geeignete Flächen in Partnerschaft mit den Landbesitzern." },
      { num: "02", title: "Registrierung & Kartierung", desc: "GPS-Polygonierung, detaillierte Kartografie und vollständige Erfassung jeder Parzelle." },
      { num: "03", title: "Engagement & Formalisierung", desc: "Wählen Sie Ihr Begleitpaket. Übergabe Ihres sicheren Vertrags und personalisierten Kartenplans." },
      { num: "04", title: "Entwicklung der Plantage — 36 Monate", desc: "143 zertifizierte Pflanzen pro Hektar, Rodung, Pflöcken, Anpflanzung, Betriebsmittel und Düngung. 6 technische Besuche." },
      { num: "05", title: "Übergabe der Plantage", desc: "Produktive Plantage schlüsselfertig übergeben. Agronomische Begleitung, Lieferung von Betriebsmitteln und Abnahmegarantie inklusive." },
    ],
    capacity: [
      { value: "120 ha", label: "Baumschule in aktivem Wachstum" },
      { value: "50 ha", label: "sofort bepflanzbar" },
      { value: "500+ ha", label: "identifiziertes Land" },
      { value: "25 Jahre", label: "Abnahmegarantie und Betreuung" },
    ],
    team: [
      { name: "Inocent KOFFI", role: "Geschäftsführer", desc: "Unternehmer und Stratege, Gesamtvision und Koordination des Rollouts." },
      { name: "Koffi Pierre KOUAMÉ", role: "Strategischer Berater", desc: "10+ Jahre Erfahrung in organisatorischer Governance und Landsicherung." },
      { name: "Éric Stéphane DIDO", role: "Leiter Geschäftsentwicklung", desc: "Vertriebsstrategie, Feldeinsatz und Entwicklung des Kundenportfolios." },
    ],
    partners: [
      { name: "Dr Marcel KONAN — MiProjet", role: "Projektstrukturierung & Strategie" },
      { name: "Kouamé Mathieu ANGA", role: "Agronomie & Plantagenüberwachung" },
      { name: "Cabinet Legal Form", role: "Rechtsexpertise" },
      { name: "Cabinet GESMA SARL", role: "Buchhaltungs- und Steuerexpertise" },
      { name: "Les Palmistes", role: "Lieferant zertifizierter Iro-Lamé-Samen" },
    ],
    labels: {
      sectionWhy: "Warum AgriCapital wählen",
      sectionProcess: "Unser Prozess",
      processIntro: "Ein strukturierter Prozess in 5 Schritten",
      sectionCapacity: "Unsere Kapazität",
      sectionTeam: "Das AgriCapital-Team",
      sectionPartners: "Unsere strategischen Partner",
    },
  },

  zh: {
    whyChoose: [
      { title: "可持续资产", description: "构建一项随时间增值的有形农业资产 —— 多元化投资的切实选择。" },
      { title: "全程陪伴", description: "从土地保障到商业化：AgriCapital 以严谨和透明管理整个流程。" },
      { title: "合同保障", description: "经过认证的合同、GPS 地图文件以及稳固的法律框架 —— 每个环节都安全透明。" },
    ],
    steps: [
      { num: "01", title: "土地识别、验证与保障", desc: "AgriCapital 与土地所有者合作,识别并确保合适的土地。" },
      { num: "02", title: "登记与制图", desc: "GPS 多边形测绘、详细制图,完成对每块地块的完整登记。" },
      { num: "03", title: "承诺与正式化", desc: "选择您的陪伴方案,接收您安全的合同与个性化地图计划。" },
      { num: "04", title: "种植园开发 — 36 个月", desc: "每公顷 143 株认证苗木,清地、定标、种植、投入物与施肥,6 次技术访问。" },
      { num: "05", title: "种植园交付", desc: "交钥匙式高产种植园,包含农艺跟踪、投入物供应及回购保证。" },
    ],
    capacity: [
      { value: "120 公顷", label: "活跃成长中的苗圃" },
      { value: "50 公顷", label: "可立即种植" },
      { value: "500+ 公顷", label: "已识别的土地" },
      { value: "25 年", label: "回购保证与跟进" },
    ],
    team: [
      { name: "Inocent KOFFI", role: "总经理", desc: "企业家与战略家,负责整体愿景和部署协调。" },
      { name: "Koffi Pierre KOUAMÉ", role: "战略顾问", desc: "拥有 10 多年组织治理和土地保障经验。" },
      { name: "Éric Stéphane DIDO", role: "商务发展负责人", desc: "商业战略、现场部署和客户组合开发。" },
    ],
    partners: [
      { name: "Dr Marcel KONAN — MiProjet", role: "项目结构与战略" },
      { name: "Kouamé Mathieu ANGA", role: "农艺与种植园监测" },
      { name: "Cabinet Legal Form", role: "法律专长" },
      { name: "Cabinet GESMA SARL", role: "会计与税务专长" },
      { name: "Les Palmistes", role: "认证 Iro Lamé 种子供应商" },
    ],
    labels: {
      sectionWhy: "为什么选择 AgriCapital",
      sectionProcess: "我们的流程",
      processIntro: "一个由 5 个步骤构成的结构化流程",
      sectionCapacity: "我们的产能",
      sectionTeam: "AgriCapital 团队",
      sectionPartners: "我们的战略合作伙伴",
    },
  },

  ar: {
    whyChoose: [
      { title: "ثروة مستدامة", description: "أنشئ أصلًا زراعيًا ملموسًا يكتسب قيمة مع مرور الوقت — بديل ملموس لتنويع استثماراتك." },
      { title: "مرافقة شاملة", description: "من تأمين الأرض إلى التسويق: تدير أجريكابيتال العملية بأكملها بصرامة وشفافية." },
      { title: "أمان تعاقدي", description: "عقود معتمدة، وثائق خرائط GPS، وإطار قانوني متين — كل خطوة آمنة وشفافة." },
    ],
    steps: [
      { num: "01", title: "تحديد الأرض والتحقق منها وتأمينها", desc: "تحدد أجريكابيتال الأراضي المناسبة وتؤمنها بالشراكة مع ملاك الأراضي." },
      { num: "02", title: "التسجيل ورسم الخرائط", desc: "رسم متعدد الأضلاع بنظام GPS، خرائط مفصلة وتسجيل شامل لكل قطعة." },
      { num: "03", title: "الالتزام والإضفاء الرسمي", desc: "اختر صيغة المرافقة الخاصة بك واستلم عقدك الآمن وخطتك الكارتوغرافية المخصصة." },
      { num: "04", title: "تطوير المزرعة — 36 شهرًا", desc: "143 شتلة معتمدة لكل هكتار، تنظيف، تخطيط، زراعة، مدخلات وتسميد، و6 زيارات فنية." },
      { num: "05", title: "تسليم المزرعة", desc: "مزرعة منتجة جاهزة للتشغيل تُسلّم بصيغة 'مفتاح في اليد'، مع متابعة زراعية، توفير المدخلات وضمان الشراء." },
    ],
    capacity: [
      { value: "120 هكتار", label: "من المشتل في نمو نشط" },
      { value: "50 هكتار", label: "متاحة للزراعة الفورية" },
      { value: "+500 هكتار", label: "من الأراضي المحددة" },
      { value: "25 سنة", label: "من ضمان الشراء والمتابعة" },
    ],
    team: [
      { name: "إينوسنت كوفي", role: "المدير العام", desc: "رائد أعمال واستراتيجي، رؤية شاملة وتنسيق الانتشار." },
      { name: "كوفي بيير كوامي", role: "مستشار استراتيجي", desc: "أكثر من 10 سنوات من الخبرة في الحوكمة التنظيمية وتأمين الأراضي." },
      { name: "إيريك ستيفان ديدو", role: "مسؤول تطوير الأعمال", desc: "الاستراتيجية التجارية، الانتشار الميداني وتطوير محفظة العملاء." },
    ],
    partners: [
      { name: "د. مارسيل كونان — MiProjet", role: "هيكلة المشاريع والاستراتيجية" },
      { name: "كوامي ماتيو أنغا", role: "الزراعة ومتابعة المزارع" },
      { name: "Cabinet Legal Form", role: "خبرة قانونية" },
      { name: "Cabinet GESMA SARL", role: "خبرة محاسبية وضريبية" },
      { name: "Les Palmistes", role: "مورد بذور Iro Lamé المعتمدة" },
    ],
    labels: {
      sectionWhy: "لماذا تختار أجريكابيتال",
      sectionProcess: "عمليتنا",
      processIntro: "عملية منظمة في 5 خطوات",
      sectionCapacity: "قدرتنا",
      sectionTeam: "فريق أجريكابيتال",
      sectionPartners: "شركاؤنا الاستراتيجيون",
    },
  },
};