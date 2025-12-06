export type Language = 'fr' | 'en' | 'es' | 'de' | 'zh' | 'ar';

export const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.about': 'À Propos',
    'nav.vision': 'Vision',
    'nav.agricapital': 'AGRICAPITAL',
    'nav.projects': 'Projets',
    'nav.partnership': 'Partenariat',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.gallery': 'Galerie',
    
    // Hero
    'hero.badge': 'Visionnaire • Fondateur • Entrepreneur',
    'hero.title': 'Inocent KOFFI',
    'hero.subtitle': 'Fondateur & DG d\'AGRICAPITAL SARL',
    'hero.description': 'Transformer l\'agriculture ivoirienne par un modèle intégré, inclusif et durable. 12 années d\'immersion auprès des communautés rurales.',
    'hero.cta.discover': 'Découvrir Ma Vision',
    'hero.cta.contact': 'Me Contacter',
    
    // About
    'about.badge': 'À Propos',
    'about.title': 'Un Parcours au Service de l\'Agriculture',
    'about.description': 'Depuis 2012, j\'ai parcouru plus de 360 localités dans 8 régions de Côte d\'Ivoire pour comprendre les réalités des producteurs agricoles.',
    'about.experience': '12+ Années d\'Expérience',
    'about.regions': '8 Régions Parcourues',
    'about.localities': '360+ Localités Visitées',
    'about.producers': '500+ Producteurs Accompagnés',
    
    // Vision
    'vision.badge': 'Vision',
    'vision.title': 'Transformer l\'Agriculture Africaine',
    'vision.description': 'Ma conviction : les agriculteurs doivent passer de la survie à la prospérité, devenant des modèles inspirants pour les jeunes générations.',
    
    // Services
    'services.badge': 'Services',
    'services.title': 'Expertise & Accompagnement',
    'services.impact.title': 'Impact',
    'services.impact.description': 'Transformation agricole avec focus économique, social, communautaire et environnemental.',
    'services.financing.title': 'Financement & Investissement',
    'services.financing.description': 'Mécanismes de financement innovants pour projets agricoles à fort impact.',
    'services.technical.title': 'Accompagnement Technique',
    'services.technical.description': '12 ans d\'immersion terrain convertis en solutions concrètes de développement.',
    
    // Gallery
    'gallery.badge': 'En Images',
    'gallery.title': 'Galerie Photo',
    'gallery.description': 'Découvrez les moments clés du lancement d\'AGRICAPITAL SARL, le 19 novembre 2025. Une journée marquant le début d\'une nouvelle ère pour l\'agriculture dans le Haut-Sassandra.',
    'gallery.filter.all': 'Toutes',
    'gallery.filter.launch': 'Lancement',
    'gallery.filter.community': 'Communauté',
    'gallery.filter.training': 'Formations',
    
    // Testimonials
    'testimonials.badge': 'Témoignages',
    'testimonials.title': 'Ce Qu\'ils Disent',
    'testimonials.description': 'Découvrez les témoignages de ceux qui ont travaillé avec Inocent KOFFI et AGRICAPITAL.',
    'testimonials.leave': 'Laisser un Témoignage',
    'testimonials.seeAll': 'Voir Tous les Témoignages',
    
    // Partnership
    'partnership.badge': 'Partenariat',
    'partnership.title': 'Devenez Notre Partenaire',
    'partnership.description': 'Rejoignez un projet qui transforme l\'agriculture ivoirienne.',
    'partnership.cta': 'Devenir Partenaire',
    
    // Contact
    'contact.badge': 'Contact',
    'contact.title': 'Discutons de Votre Projet',
    'contact.description': 'N\'hésitez pas à me contacter pour toute question ou opportunité de collaboration.',
    'contact.form.name': 'Nom complet',
    'contact.form.email': 'Email',
    'contact.form.phone': 'Téléphone',
    'contact.form.message': 'Message',
    'contact.form.submit': 'Envoyer le Message',
    'contact.form.sending': 'Envoi en cours...',
    'contact.success': 'Message envoyé avec succès !',
    
    // Newsletter
    'newsletter.badge': 'Newsletter',
    'newsletter.title': 'Restez Informé',
    'newsletter.description': 'Inscrivez-vous pour recevoir nos dernières actualités.',
    'newsletter.placeholder': 'Votre email',
    'newsletter.subscribe': 'S\'abonner',
    
    // Footer
    'footer.rights': 'Tous droits réservés',
    'footer.legal': 'Mentions Légales',
    'footer.privacy': 'Politique de Confidentialité',
    
    // Common
    'common.readMore': 'En savoir plus',
    'common.learnMore': 'En savoir plus',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.previous': 'Précédent',
    'common.share': 'Partager',
    
    // SEO
    'seo.home.title': 'Inocent KOFFI - Fondateur & DG AGRICAPITAL SARL | Transformation Agricole',
    'seo.home.description': 'Inocent KOFFI, Fondateur et Directeur Général d\'AGRICAPITAL SARL. 12 ans d\'expérience terrain auprès des producteurs agricoles en Côte d\'Ivoire.',
    'seo.about.title': 'À Propos - Inocent KOFFI | Parcours & Expertise Agricole',
    'seo.about.description': 'Découvrez le parcours d\'Inocent KOFFI, 12 années d\'immersion dans 8 régions de Côte d\'Ivoire auprès des communautés rurales.',
    'seo.vision.title': 'Vision - Inocent KOFFI | Transformer l\'Agriculture Africaine',
    'seo.vision.description': 'La vision d\'Inocent KOFFI pour transformer l\'agriculture africaine à travers un modèle intégré et durable.',
    'seo.contact.title': 'Contact - Inocent KOFFI | Collaboration & Partenariat',
    'seo.contact.description': 'Contactez Inocent KOFFI pour discuter de projets agricoles, partenariats ou opportunités de collaboration.',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.vision': 'Vision',
    'nav.agricapital': 'AGRICAPITAL',
    'nav.projects': 'Projects',
    'nav.partnership': 'Partnership',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.gallery': 'Gallery',
    
    // Hero
    'hero.badge': 'Visionary • Founder • Entrepreneur',
    'hero.title': 'Inocent KOFFI',
    'hero.subtitle': 'Founder & CEO of AGRICAPITAL SARL',
    'hero.description': 'Transforming Ivorian agriculture through an integrated, inclusive and sustainable model. 12 years of immersion with rural communities.',
    'hero.cta.discover': 'Discover My Vision',
    'hero.cta.contact': 'Contact Me',
    
    // About
    'about.badge': 'About',
    'about.title': 'A Journey in Service of Agriculture',
    'about.description': 'Since 2012, I have traveled through more than 360 localities in 8 regions of Côte d\'Ivoire to understand the realities of agricultural producers.',
    'about.experience': '12+ Years of Experience',
    'about.regions': '8 Regions Covered',
    'about.localities': '360+ Localities Visited',
    'about.producers': '500+ Producers Supported',
    
    // Vision
    'vision.badge': 'Vision',
    'vision.title': 'Transforming African Agriculture',
    'vision.description': 'My conviction: farmers must transition from survival to prosperity, becoming inspiring models for younger generations.',
    
    // Services
    'services.badge': 'Services',
    'services.title': 'Expertise & Support',
    'services.impact.title': 'Impact',
    'services.impact.description': 'Agricultural transformation with economic, social, community and environmental focus.',
    'services.financing.title': 'Financing & Investment',
    'services.financing.description': 'Innovative financing mechanisms for high-impact agricultural projects.',
    'services.technical.title': 'Technical Support',
    'services.technical.description': '12 years of field immersion converted into concrete development solutions.',
    
    // Gallery
    'gallery.badge': 'In Pictures',
    'gallery.title': 'Photo Gallery',
    'gallery.description': 'Discover the key moments from the launch of AGRICAPITAL SARL on November 19, 2025. A day marking the beginning of a new era for agriculture in Haut-Sassandra.',
    'gallery.filter.all': 'All',
    'gallery.filter.launch': 'Launch',
    'gallery.filter.community': 'Community',
    'gallery.filter.training': 'Training',
    
    // Testimonials
    'testimonials.badge': 'Testimonials',
    'testimonials.title': 'What They Say',
    'testimonials.description': 'Discover testimonials from those who have worked with Inocent KOFFI and AGRICAPITAL.',
    'testimonials.leave': 'Leave a Testimonial',
    'testimonials.seeAll': 'View All Testimonials',
    
    // Partnership
    'partnership.badge': 'Partnership',
    'partnership.title': 'Become Our Partner',
    'partnership.description': 'Join a project transforming Ivorian agriculture.',
    'partnership.cta': 'Become a Partner',
    
    // Contact
    'contact.badge': 'Contact',
    'contact.title': 'Let\'s Discuss Your Project',
    'contact.description': 'Feel free to contact me for any questions or collaboration opportunities.',
    'contact.form.name': 'Full name',
    'contact.form.email': 'Email',
    'contact.form.phone': 'Phone',
    'contact.form.message': 'Message',
    'contact.form.submit': 'Send Message',
    'contact.form.sending': 'Sending...',
    'contact.success': 'Message sent successfully!',
    
    // Newsletter
    'newsletter.badge': 'Newsletter',
    'newsletter.title': 'Stay Informed',
    'newsletter.description': 'Subscribe to receive our latest news.',
    'newsletter.placeholder': 'Your email',
    'newsletter.subscribe': 'Subscribe',
    
    // Footer
    'footer.rights': 'All rights reserved',
    'footer.legal': 'Legal Notice',
    'footer.privacy': 'Privacy Policy',
    
    // Common
    'common.readMore': 'Read more',
    'common.learnMore': 'Learn more',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.share': 'Share',
    
    // SEO
    'seo.home.title': 'Inocent KOFFI - Founder & CEO AGRICAPITAL SARL | Agricultural Transformation',
    'seo.home.description': 'Inocent KOFFI, Founder and CEO of AGRICAPITAL SARL. 12 years of field experience with agricultural producers in Côte d\'Ivoire.',
    'seo.about.title': 'About - Inocent KOFFI | Journey & Agricultural Expertise',
    'seo.about.description': 'Discover Inocent KOFFI\'s journey, 12 years of immersion in 8 regions of Côte d\'Ivoire with rural communities.',
    'seo.vision.title': 'Vision - Inocent KOFFI | Transforming African Agriculture',
    'seo.vision.description': 'Inocent KOFFI\'s vision to transform African agriculture through an integrated and sustainable model.',
    'seo.contact.title': 'Contact - Inocent KOFFI | Collaboration & Partnership',
    'seo.contact.description': 'Contact Inocent KOFFI to discuss agricultural projects, partnerships or collaboration opportunities.',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.about': 'Acerca de',
    'nav.vision': 'Visión',
    'nav.agricapital': 'AGRICAPITAL',
    'nav.projects': 'Proyectos',
    'nav.partnership': 'Asociación',
    'nav.blog': 'Blog',
    'nav.contact': 'Contacto',
    'nav.gallery': 'Galería',
    
    // Hero
    'hero.badge': 'Visionario • Fundador • Emprendedor',
    'hero.title': 'Inocent KOFFI',
    'hero.subtitle': 'Fundador y Director General de AGRICAPITAL SARL',
    'hero.description': 'Transformando la agricultura marfileña a través de un modelo integrado, inclusivo y sostenible. 12 años de inmersión con comunidades rurales.',
    'hero.cta.discover': 'Descubrir Mi Visión',
    'hero.cta.contact': 'Contáctame',
    
    // About
    'about.badge': 'Acerca de',
    'about.title': 'Un Recorrido al Servicio de la Agricultura',
    'about.description': 'Desde 2012, he recorrido más de 360 localidades en 8 regiones de Costa de Marfil para comprender las realidades de los productores agrícolas.',
    'about.experience': '12+ Años de Experiencia',
    'about.regions': '8 Regiones Recorridas',
    'about.localities': '360+ Localidades Visitadas',
    'about.producers': '500+ Productores Apoyados',
    
    // Vision
    'vision.badge': 'Visión',
    'vision.title': 'Transformando la Agricultura Africana',
    'vision.description': 'Mi convicción: los agricultores deben pasar de la supervivencia a la prosperidad, convirtiéndose en modelos inspiradores para las generaciones más jóvenes.',
    
    // Services
    'services.badge': 'Servicios',
    'services.title': 'Experiencia y Apoyo',
    'services.impact.title': 'Impacto',
    'services.impact.description': 'Transformación agrícola con enfoque económico, social, comunitario y ambiental.',
    'services.financing.title': 'Financiamiento e Inversión',
    'services.financing.description': 'Mecanismos de financiamiento innovadores para proyectos agrícolas de alto impacto.',
    'services.technical.title': 'Apoyo Técnico',
    'services.technical.description': '12 años de inmersión en el campo convertidos en soluciones concretas de desarrollo.',
    
    // Gallery
    'gallery.badge': 'En Imágenes',
    'gallery.title': 'Galería de Fotos',
    'gallery.description': 'Descubre los momentos clave del lanzamiento de AGRICAPITAL SARL el 19 de noviembre de 2025. Un día que marca el inicio de una nueva era para la agricultura en Haut-Sassandra.',
    'gallery.filter.all': 'Todas',
    'gallery.filter.launch': 'Lanzamiento',
    'gallery.filter.community': 'Comunidad',
    'gallery.filter.training': 'Formación',
    
    // Testimonials
    'testimonials.badge': 'Testimonios',
    'testimonials.title': 'Lo Que Dicen',
    'testimonials.description': 'Descubre los testimonios de quienes han trabajado con Inocent KOFFI y AGRICAPITAL.',
    'testimonials.leave': 'Dejar un Testimonio',
    'testimonials.seeAll': 'Ver Todos los Testimonios',
    
    // Partnership
    'partnership.badge': 'Asociación',
    'partnership.title': 'Conviértase en Nuestro Socio',
    'partnership.description': 'Únase a un proyecto que transforma la agricultura marfileña.',
    'partnership.cta': 'Convertirse en Socio',
    
    // Contact
    'contact.badge': 'Contacto',
    'contact.title': 'Hablemos de Su Proyecto',
    'contact.description': 'No dude en contactarme para cualquier pregunta u oportunidad de colaboración.',
    'contact.form.name': 'Nombre completo',
    'contact.form.email': 'Correo electrónico',
    'contact.form.phone': 'Teléfono',
    'contact.form.message': 'Mensaje',
    'contact.form.submit': 'Enviar Mensaje',
    'contact.form.sending': 'Enviando...',
    'contact.success': '¡Mensaje enviado con éxito!',
    
    // Newsletter
    'newsletter.badge': 'Boletín',
    'newsletter.title': 'Mantente Informado',
    'newsletter.description': 'Suscríbete para recibir nuestras últimas noticias.',
    'newsletter.placeholder': 'Tu correo',
    'newsletter.subscribe': 'Suscribirse',
    
    // Footer
    'footer.rights': 'Todos los derechos reservados',
    'footer.legal': 'Aviso Legal',
    'footer.privacy': 'Política de Privacidad',
    
    // Common
    'common.readMore': 'Leer más',
    'common.learnMore': 'Más información',
    'common.back': 'Volver',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
    'common.share': 'Compartir',
    
    // SEO
    'seo.home.title': 'Inocent KOFFI - Fundador y DG AGRICAPITAL SARL | Transformación Agrícola',
    'seo.home.description': 'Inocent KOFFI, Fundador y Director General de AGRICAPITAL SARL. 12 años de experiencia en el campo con productores agrícolas en Costa de Marfil.',
    'seo.about.title': 'Acerca de - Inocent KOFFI | Trayectoria y Experiencia Agrícola',
    'seo.about.description': 'Descubre la trayectoria de Inocent KOFFI, 12 años de inmersión en 8 regiones de Costa de Marfil con comunidades rurales.',
    'seo.vision.title': 'Visión - Inocent KOFFI | Transformando la Agricultura Africana',
    'seo.vision.description': 'La visión de Inocent KOFFI para transformar la agricultura africana a través de un modelo integrado y sostenible.',
    'seo.contact.title': 'Contacto - Inocent KOFFI | Colaboración y Asociación',
    'seo.contact.description': 'Contacta a Inocent KOFFI para discutir proyectos agrícolas, asociaciones u oportunidades de colaboración.',
  },
  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.about': 'Über uns',
    'nav.vision': 'Vision',
    'nav.agricapital': 'AGRICAPITAL',
    'nav.projects': 'Projekte',
    'nav.partnership': 'Partnerschaft',
    'nav.blog': 'Blog',
    'nav.contact': 'Kontakt',
    'nav.gallery': 'Galerie',
    
    // Hero
    'hero.badge': 'Visionär • Gründer • Unternehmer',
    'hero.title': 'Inocent KOFFI',
    'hero.subtitle': 'Gründer & Geschäftsführer von AGRICAPITAL SARL',
    'hero.description': 'Transformation der ivorischen Landwirtschaft durch ein integriertes, inklusives und nachhaltiges Modell. 12 Jahre Eintauchen in ländliche Gemeinschaften.',
    'hero.cta.discover': 'Meine Vision Entdecken',
    'hero.cta.contact': 'Kontaktieren Sie Mich',
    
    // About
    'about.badge': 'Über uns',
    'about.title': 'Ein Weg im Dienste der Landwirtschaft',
    'about.description': 'Seit 2012 habe ich mehr als 360 Ortschaften in 8 Regionen der Elfenbeinküste besucht, um die Realitäten der landwirtschaftlichen Produzenten zu verstehen.',
    'about.experience': '12+ Jahre Erfahrung',
    'about.regions': '8 Regionen Bereist',
    'about.localities': '360+ Ortschaften Besucht',
    'about.producers': '500+ Produzenten Unterstützt',
    
    // Vision
    'vision.badge': 'Vision',
    'vision.title': 'Die Afrikanische Landwirtschaft Transformieren',
    'vision.description': 'Meine Überzeugung: Landwirte müssen vom Überleben zum Wohlstand übergehen und inspirierende Vorbilder für jüngere Generationen werden.',
    
    // Services
    'services.badge': 'Dienstleistungen',
    'services.title': 'Expertise & Unterstützung',
    'services.impact.title': 'Wirkung',
    'services.impact.description': 'Agrartransformation mit wirtschaftlichem, sozialem, gemeinschaftlichem und ökologischem Fokus.',
    'services.financing.title': 'Finanzierung & Investition',
    'services.financing.description': 'Innovative Finanzierungsmechanismen für wirkungsvolle Agrarprojekte.',
    'services.technical.title': 'Technische Unterstützung',
    'services.technical.description': '12 Jahre Felderfahrung in konkrete Entwicklungslösungen umgewandelt.',
    
    // Gallery
    'gallery.badge': 'In Bildern',
    'gallery.title': 'Fotogalerie',
    'gallery.description': 'Entdecken Sie die wichtigsten Momente des Starts von AGRICAPITAL SARL am 19. November 2025. Ein Tag, der den Beginn einer neuen Ära für die Landwirtschaft in Haut-Sassandra markiert.',
    'gallery.filter.all': 'Alle',
    'gallery.filter.launch': 'Start',
    'gallery.filter.community': 'Gemeinschaft',
    'gallery.filter.training': 'Schulung',
    
    // Testimonials
    'testimonials.badge': 'Referenzen',
    'testimonials.title': 'Was Sie Sagen',
    'testimonials.description': 'Entdecken Sie Referenzen von denen, die mit Inocent KOFFI und AGRICAPITAL zusammengearbeitet haben.',
    'testimonials.leave': 'Referenz Hinterlassen',
    'testimonials.seeAll': 'Alle Referenzen Ansehen',
    
    // Partnership
    'partnership.badge': 'Partnerschaft',
    'partnership.title': 'Werden Sie Unser Partner',
    'partnership.description': 'Treten Sie einem Projekt bei, das die ivorische Landwirtschaft transformiert.',
    'partnership.cta': 'Partner Werden',
    
    // Contact
    'contact.badge': 'Kontakt',
    'contact.title': 'Lassen Sie Uns Ihr Projekt Besprechen',
    'contact.description': 'Kontaktieren Sie mich gerne bei Fragen oder Kooperationsmöglichkeiten.',
    'contact.form.name': 'Vollständiger Name',
    'contact.form.email': 'E-Mail',
    'contact.form.phone': 'Telefon',
    'contact.form.message': 'Nachricht',
    'contact.form.submit': 'Nachricht Senden',
    'contact.form.sending': 'Wird gesendet...',
    'contact.success': 'Nachricht erfolgreich gesendet!',
    
    // Newsletter
    'newsletter.badge': 'Newsletter',
    'newsletter.title': 'Bleiben Sie Informiert',
    'newsletter.description': 'Abonnieren Sie, um unsere neuesten Nachrichten zu erhalten.',
    'newsletter.placeholder': 'Ihre E-Mail',
    'newsletter.subscribe': 'Abonnieren',
    
    // Footer
    'footer.rights': 'Alle Rechte vorbehalten',
    'footer.legal': 'Impressum',
    'footer.privacy': 'Datenschutz',
    
    // Common
    'common.readMore': 'Mehr lesen',
    'common.learnMore': 'Mehr erfahren',
    'common.back': 'Zurück',
    'common.next': 'Weiter',
    'common.previous': 'Zurück',
    'common.share': 'Teilen',
    
    // SEO
    'seo.home.title': 'Inocent KOFFI - Gründer & GF AGRICAPITAL SARL | Agrartransformation',
    'seo.home.description': 'Inocent KOFFI, Gründer und Geschäftsführer von AGRICAPITAL SARL. 12 Jahre Felderfahrung mit landwirtschaftlichen Produzenten in der Elfenbeinküste.',
    'seo.about.title': 'Über uns - Inocent KOFFI | Werdegang & Agrarexpertise',
    'seo.about.description': 'Entdecken Sie den Werdegang von Inocent KOFFI, 12 Jahre Eintauchen in 8 Regionen der Elfenbeinküste mit ländlichen Gemeinschaften.',
    'seo.vision.title': 'Vision - Inocent KOFFI | Transformation der Afrikanischen Landwirtschaft',
    'seo.vision.description': 'Die Vision von Inocent KOFFI zur Transformation der afrikanischen Landwirtschaft durch ein integriertes und nachhaltiges Modell.',
    'seo.contact.title': 'Kontakt - Inocent KOFFI | Zusammenarbeit & Partnerschaft',
    'seo.contact.description': 'Kontaktieren Sie Inocent KOFFI, um Agrarprojekte, Partnerschaften oder Kooperationsmöglichkeiten zu besprechen.',
  },
  zh: {
    // Navigation
    'nav.home': '首页',
    'nav.about': '关于',
    'nav.vision': '愿景',
    'nav.agricapital': 'AGRICAPITAL',
    'nav.projects': '项目',
    'nav.partnership': '合作',
    'nav.blog': '博客',
    'nav.contact': '联系',
    'nav.gallery': '图库',
    
    // Hero
    'hero.badge': '远见者 • 创始人 • 企业家',
    'hero.title': 'Inocent KOFFI',
    'hero.subtitle': 'AGRICAPITAL SARL 创始人兼总经理',
    'hero.description': '通过综合、包容和可持续的模式转型科特迪瓦农业。12年深入农村社区。',
    'hero.cta.discover': '了解我的愿景',
    'hero.cta.contact': '联系我',
    
    // About
    'about.badge': '关于',
    'about.title': '服务农业的旅程',
    'about.description': '自2012年以来，我走访了科特迪瓦8个地区的360多个地方，了解农业生产者的现实情况。',
    'about.experience': '12年以上经验',
    'about.regions': '覆盖8个地区',
    'about.localities': '走访360多个地区',
    'about.producers': '支持500多名生产者',
    
    // Vision
    'vision.badge': '愿景',
    'vision.title': '转型非洲农业',
    'vision.description': '我的信念：农民必须从生存走向繁荣，成为年轻一代的榜样。',
    
    // Services
    'services.badge': '服务',
    'services.title': '专业知识与支持',
    'services.impact.title': '影响力',
    'services.impact.description': '注重经济、社会、社区和环境的农业转型。',
    'services.financing.title': '融资与投资',
    'services.financing.description': '为高影响力农业项目提供创新融资机制。',
    'services.technical.title': '技术支持',
    'services.technical.description': '12年实地经验转化为具体的发展解决方案。',
    
    // Gallery
    'gallery.badge': '图片',
    'gallery.title': '图片画廊',
    'gallery.description': '了解2025年11月19日AGRICAPITAL SARL启动的关键时刻。这一天标志着Haut-Sassandra农业新时代的开始。',
    'gallery.filter.all': '全部',
    'gallery.filter.launch': '启动',
    'gallery.filter.community': '社区',
    'gallery.filter.training': '培训',
    
    // Testimonials
    'testimonials.badge': '见证',
    'testimonials.title': '他们的评价',
    'testimonials.description': '了解与Inocent KOFFI和AGRICAPITAL合作过的人的见证。',
    'testimonials.leave': '留下见证',
    'testimonials.seeAll': '查看所有见证',
    
    // Partnership
    'partnership.badge': '合作',
    'partnership.title': '成为我们的合作伙伴',
    'partnership.description': '加入一个正在转变科特迪瓦农业的项目。',
    'partnership.cta': '成为合作伙伴',
    
    // Contact
    'contact.badge': '联系',
    'contact.title': '让我们讨论您的项目',
    'contact.description': '如有任何问题或合作机会，请随时与我联系。',
    'contact.form.name': '全名',
    'contact.form.email': '电子邮件',
    'contact.form.phone': '电话',
    'contact.form.message': '留言',
    'contact.form.submit': '发送消息',
    'contact.form.sending': '发送中...',
    'contact.success': '消息发送成功！',
    
    // Newsletter
    'newsletter.badge': '通讯',
    'newsletter.title': '保持了解',
    'newsletter.description': '订阅以接收我们的最新消息。',
    'newsletter.placeholder': '您的电子邮件',
    'newsletter.subscribe': '订阅',
    
    // Footer
    'footer.rights': '版权所有',
    'footer.legal': '法律声明',
    'footer.privacy': '隐私政策',
    
    // Common
    'common.readMore': '阅读更多',
    'common.learnMore': '了解更多',
    'common.back': '返回',
    'common.next': '下一个',
    'common.previous': '上一个',
    'common.share': '分享',
    
    // SEO
    'seo.home.title': 'Inocent KOFFI - AGRICAPITAL SARL 创始人兼总经理 | 农业转型',
    'seo.home.description': 'Inocent KOFFI，AGRICAPITAL SARL创始人兼总经理。在科特迪瓦与农业生产者共事12年的实地经验。',
    'seo.about.title': '关于 - Inocent KOFFI | 历程与农业专长',
    'seo.about.description': '了解Inocent KOFFI的历程，在科特迪瓦8个地区与农村社区共处12年。',
    'seo.vision.title': '愿景 - Inocent KOFFI | 转型非洲农业',
    'seo.vision.description': 'Inocent KOFFI通过综合可持续模式转型非洲农业的愿景。',
    'seo.contact.title': '联系 - Inocent KOFFI | 合作与伙伴关系',
    'seo.contact.description': '联系Inocent KOFFI讨论农业项目、合作伙伴关系或合作机会。',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.about': 'حول',
    'nav.vision': 'الرؤية',
    'nav.agricapital': 'أجريكابيتال',
    'nav.projects': 'المشاريع',
    'nav.partnership': 'الشراكة',
    'nav.blog': 'المدونة',
    'nav.contact': 'اتصل',
    'nav.gallery': 'المعرض',
    
    // Hero
    'hero.badge': 'رؤيوي • مؤسس • رائد أعمال',
    'hero.title': 'إينوسنت كوفي',
    'hero.subtitle': 'مؤسس ومدير عام أجريكابيتال',
    'hero.description': 'تحويل الزراعة الإيفوارية من خلال نموذج متكامل وشامل ومستدام. 12 عامًا من الانغماس في المجتمعات الريفية.',
    'hero.cta.discover': 'اكتشف رؤيتي',
    'hero.cta.contact': 'تواصل معي',
    
    // About
    'about.badge': 'حول',
    'about.title': 'رحلة في خدمة الزراعة',
    'about.description': 'منذ عام 2012، قمت بزيارة أكثر من 360 منطقة في 8 مناطق من ساحل العاج لفهم واقع المنتجين الزراعيين.',
    'about.experience': '+12 سنة خبرة',
    'about.regions': '8 مناطق مغطاة',
    'about.localities': '+360 منطقة تمت زيارتها',
    'about.producers': '+500 منتج تم دعمهم',
    
    // Vision
    'vision.badge': 'الرؤية',
    'vision.title': 'تحويل الزراعة الأفريقية',
    'vision.description': 'قناعتي: يجب على المزارعين الانتقال من البقاء إلى الازدهار، ليصبحوا نماذج ملهمة للأجيال الشابة.',
    
    // Services
    'services.badge': 'الخدمات',
    'services.title': 'الخبرة والدعم',
    'services.impact.title': 'التأثير',
    'services.impact.description': 'التحول الزراعي مع التركيز الاقتصادي والاجتماعي والمجتمعي والبيئي.',
    'services.financing.title': 'التمويل والاستثمار',
    'services.financing.description': 'آليات تمويل مبتكرة للمشاريع الزراعية عالية التأثير.',
    'services.technical.title': 'الدعم الفني',
    'services.technical.description': '12 عامًا من الخبرة الميدانية تحولت إلى حلول تنموية ملموسة.',
    
    // Gallery
    'gallery.badge': 'بالصور',
    'gallery.title': 'معرض الصور',
    'gallery.description': 'اكتشف اللحظات الرئيسية من إطلاق أجريكابيتال في 19 نوفمبر 2025. يوم يمثل بداية حقبة جديدة للزراعة في هوت-ساساندرا.',
    'gallery.filter.all': 'الكل',
    'gallery.filter.launch': 'الإطلاق',
    'gallery.filter.community': 'المجتمع',
    'gallery.filter.training': 'التدريب',
    
    // Testimonials
    'testimonials.badge': 'الشهادات',
    'testimonials.title': 'ماذا يقولون',
    'testimonials.description': 'اكتشف شهادات من عملوا مع إينوسنت كوفي وأجريكابيتال.',
    'testimonials.leave': 'اترك شهادة',
    'testimonials.seeAll': 'عرض جميع الشهادات',
    
    // Partnership
    'partnership.badge': 'الشراكة',
    'partnership.title': 'كن شريكنا',
    'partnership.description': 'انضم إلى مشروع يحول الزراعة الإيفوارية.',
    'partnership.cta': 'كن شريكًا',
    
    // Contact
    'contact.badge': 'اتصل',
    'contact.title': 'لنناقش مشروعك',
    'contact.description': 'لا تتردد في الاتصال بي لأي أسئلة أو فرص تعاون.',
    'contact.form.name': 'الاسم الكامل',
    'contact.form.email': 'البريد الإلكتروني',
    'contact.form.phone': 'الهاتف',
    'contact.form.message': 'الرسالة',
    'contact.form.submit': 'إرسال الرسالة',
    'contact.form.sending': 'جاري الإرسال...',
    'contact.success': 'تم إرسال الرسالة بنجاح!',
    
    // Newsletter
    'newsletter.badge': 'النشرة الإخبارية',
    'newsletter.title': 'ابق على اطلاع',
    'newsletter.description': 'اشترك لتلقي آخر أخبارنا.',
    'newsletter.placeholder': 'بريدك الإلكتروني',
    'newsletter.subscribe': 'اشترك',
    
    // Footer
    'footer.rights': 'جميع الحقوق محفوظة',
    'footer.legal': 'إشعار قانوني',
    'footer.privacy': 'سياسة الخصوصية',
    
    // Common
    'common.readMore': 'اقرأ المزيد',
    'common.learnMore': 'اعرف المزيد',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    'common.share': 'مشاركة',
    
    // SEO
    'seo.home.title': 'إينوسنت كوفي - مؤسس ومدير عام أجريكابيتال | التحول الزراعي',
    'seo.home.description': 'إينوسنت كوفي، مؤسس ومدير عام أجريكابيتال. 12 عامًا من الخبرة الميدانية مع المنتجين الزراعيين في ساحل العاج.',
    'seo.about.title': 'حول - إينوسنت كوفي | المسيرة والخبرة الزراعية',
    'seo.about.description': 'اكتشف مسيرة إينوسنت كوفي، 12 عامًا من الانغماس في 8 مناطق من ساحل العاج مع المجتمعات الريفية.',
    'seo.vision.title': 'الرؤية - إينوسنت كوفي | تحويل الزراعة الأفريقية',
    'seo.vision.description': 'رؤية إينوسنت كوفي لتحويل الزراعة الأفريقية من خلال نموذج متكامل ومستدام.',
    'seo.contact.title': 'اتصل - إينوسنت كوفي | التعاون والشراكة',
    'seo.contact.description': 'اتصل بإينوسنت كوفي لمناقشة المشاريع الزراعية أو الشراكات أو فرص التعاون.',
  },
};

export const getTranslation = (lang: Language, key: string): string => {
  return translations[lang]?.[key] || translations['fr'][key] || key;
};
