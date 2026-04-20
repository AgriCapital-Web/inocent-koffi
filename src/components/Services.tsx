import { Leaf, BarChart3, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";

const services = [
  {
    icon: Leaf,
    title: "Plantation Clé en Main",
    description: "Plants certifiés, défrichage, piquetage, plantation, intrants et fertilisation — remise opérationnelle à 36 mois."
  },
  {
    icon: BarChart3,
    title: "Suivi Technique",
    description: "Visites techniques, conseils agronomiques et accompagnement continu pendant toute la durée du contrat."
  },
  {
    icon: Shield,
    title: "Garantie d'Achat",
    description: "Débouchés sécurisés et revenus stables sur 25 ans via nos partenaires industriels."
  }
];

const Services = () => {
  const { language } = useLanguage();
  const copy = {
    fr: { title: "Ce que nous offrons", accent: "offrons", desc: "Un accompagnement structuré pour votre patrimoine agricole", items: ["Plantation Clé en Main", "Plants certifiés, défrichage, piquetage, plantation, intrants et fertilisation — remise opérationnelle à 36 mois." , "Suivi Technique", "Visites techniques, conseils agronomiques et accompagnement continu pendant toute la durée du contrat.", "Garantie d'Achat", "Débouchés sécurisés et revenus stables sur 25 ans via nos partenaires industriels."] },
    en: { title: "What we offer", accent: "offer", desc: "Structured support for your agricultural heritage", items: ["Turnkey Plantation", "Certified seedlings, land clearing, staking, planting, inputs and fertilization — operational delivery within 36 months.", "Technical Monitoring", "Technical visits, agronomic advice and continuous support throughout the contract.", "Purchase Guarantee", "Secure outlets and stable income over 25 years through our industrial partners."] },
    es: { title: "Lo que ofrecemos", accent: "ofrecemos", desc: "Un acompañamiento estructurado para su patrimonio agrícola", items: ["Plantación Llave en Mano", "Plántulas certificadas, desbroce, marcaje, plantación, insumos y fertilización con entrega operativa en 36 meses.", "Seguimiento Técnico", "Visitas técnicas, asesoría agronómica y acompañamiento continuo durante todo el contrato.", "Garantía de Compra", "Canales de venta seguros e ingresos estables durante 25 años mediante socios industriales."] },
    de: { title: "Was wir anbieten", accent: "anbieten", desc: "Strukturierte Begleitung für Ihr landwirtschaftliches Vermögen", items: ["Schlüsselfertige Plantage", "Zertifizierte Setzlinge, Rodung, Markierung, Pflanzung, Betriebsmittel und Düngung — betriebsbereit nach 36 Monaten.", "Technische Begleitung", "Technische Besuche, agronomische Beratung und kontinuierliche Betreuung während der gesamten Vertragsdauer.", "Abnahmegarantie", "Gesicherte Absatzwege und stabile Einnahmen über 25 Jahre durch Industriepartner."] },
    zh: { title: "我们的服务", accent: "服务", desc: "为您的农业资产提供结构化支持", items: ["交钥匙种植园", "涵盖认证苗木、清地、放线、种植、投入品和施肥，36 个月内交付运营。", "技术跟踪", "技术巡查、农艺建议以及合同全周期持续 сопровождение。", "回购保障", "通过工业合作伙伴提供 25 年稳定销路与收入保障。"] },
    ar: { title: "ما الذي نقدمه", accent: "نقدمه", desc: "مرافقة منظمة لبناء أصلك الزراعي", items: ["مزرعة متكاملة", "شتلات معتمدة وتجهيز الأرض والغرس والمدخلات والتسميد مع تسليم تشغيلي خلال 36 شهراً.", "متابعة فنية", "زيارات فنية وإرشاد زراعي ومرافقة مستمرة طوال مدة العقد.", "ضمان الشراء", "منافذ بيع مضمونة ودخل مستقر لمدة 25 سنة عبر شركائنا الصناعيين."] }
  }[language];
  const localizedServices = [
    { ...services[0], title: copy.items[0], description: copy.items[1] },
    { ...services[1], title: copy.items[2], description: copy.items[3] },
    { ...services[2], title: copy.items[4], description: copy.items[5] },
  ];
  return (
    <section id="services" className="py-12 sm:py-16 lg:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 text-foreground">
            {copy.title.replace(copy.accent, "")}<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{copy.accent}</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground px-4">
            {copy.desc}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {localizedServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <Card 
                  className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-accent/50 bg-card h-full"
                >
                  <CardHeader className="pb-3 sm:pb-4">
                    <motion.div 
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-3 sm:mb-4"
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </motion.div>
                    <CardTitle className="text-lg sm:text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm sm:text-base">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
