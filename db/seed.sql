-- Données d'exemple : services et tarifs, sites clients, AgriCapital
INSERT INTO public.services (slug, category, title, description, price, price_note, bullets, is_orderable, is_published, sort_order) VALUES
('site-essentiel','web','Site web essentiel','Site vitrine clair et rapide pour présenter votre activité.',100000,'À partir de',ARRAY['Design responsive','Formulaire de contact','Mise en ligne'],true,true,1),
('site-moderne','web','Site web moderne','Site complet, animé et administrable.',550000,'À partir de',ARRAY['Pages sur mesure','Administration','SEO de base'],true,true,2),
('application','web','Application web','Application métier adaptée à vos processus.',350000,'À partir de',ARRAY['Comptes utilisateurs','Tableau de bord'],true,true,3),
('crm','web','CRM sur mesure','Outil de gestion clients adapté à votre organisation.',NULL,'Sur devis',ARRAY['Suivi clients','Rapports'],true,true,4),
('plateforme-leads','web','Plateforme de génération de leads','Captez et suivez vos prospects.',250000,'À partir de',ARRAY['Formulaires','Suivi des demandes'],true,true,5),
('e-commerce','web','Boutique e-commerce','Boutique en ligne sur mesure.',NULL,'Sur mesure',ARRAY['Catalogue','Paiement en ligne'],true,true,6),
('video-voix-off','video','Vidéo avec voix off','Vidéo de 60 secondes maximum avec voix off.',15000,NULL,ARRAY['60 s maximum'],true,true,10),
('sync-labiale','video','Vidéo synchronisation labiale','Vidéo avec synchronisation labiale.',20000,'À partir de',ARRAY['Formule 20 000 ou 25 000 FCFA'],true,true,11),
('mini-clip','video','Mini-clip','Mini-clip de 2 min 30.',45000,NULL,ARRAY['2 min 30'],true,true,12),
('jingle','audio','Jingle','Jingle publicitaire personnalisé.',15000,NULL,ARRAY[]::text[],true,true,20),
('chanson','audio','Chanson personnalisée','Chanson de 2 min 30 minimum.',15000,NULL,ARRAY['2 min 30 minimum'],true,true,21),
('ia-sur-mesure','ia','Solution IA sur mesure','Assistants, automatisations et outils IA adaptés à votre besoin.',NULL,'Sur devis',ARRAY['Analyse du besoin','Intégration'],true,true,30),
('formation','formation','Formation & accompagnement','Formation au digital et à l''IA.',NULL,'Sur devis',ARRAY[]::text[],true,true,40);

INSERT INTO public.sites (name, description, url, category, status, is_published, sort_order) VALUES
('SMS Promo Mobile','Plateforme d''envoi de SMS promotionnels.','https://smspromobile.com','web','en_ligne',true,1),
('Scoly','Plateforme développée pour un client.','https://scoly.ci','web','en_ligne',true,2);

INSERT INTO public.other_projects (name, slug, description, external_url, category, status, is_published, sort_order) VALUES
('AgriCapital','agricapital','Mon initiative personnelle : rendre l''agriculture productive plus accessible.','https://www.agricapital.ci','agriculture','actif',true,1);
