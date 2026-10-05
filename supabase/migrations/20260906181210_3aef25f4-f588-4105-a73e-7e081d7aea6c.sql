-- SERVICES
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  category text NOT NULL,
  title text NOT NULL,
  description text,
  price numeric,
  price_note text,
  bullets text[] NOT NULL DEFAULT '{}',
  is_orderable boolean NOT NULL DEFAULT true,
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published services" ON public.services FOR SELECT TO anon, authenticated USING (is_published = true OR public.is_admin(auth.uid()));
CREATE POLICY "Admins manage services" ON public.services FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- REALISATIONS
CREATE TABLE public.realisations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL,
  description text,
  thumbnail_url text,
  media jsonb NOT NULL DEFAULT '[]'::jsonb,
  tags text[] NOT NULL DEFAULT '{}',
  external_url text,
  allow_download boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.realisations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.realisations TO authenticated;
GRANT ALL ON public.realisations TO service_role;
ALTER TABLE public.realisations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published realisations" ON public.realisations FOR SELECT TO anon, authenticated USING (is_published = true OR public.is_admin(auth.uid()));
CREATE POLICY "Admins manage realisations" ON public.realisations FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER realisations_updated_at BEFORE UPDATE ON public.realisations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- OTHER PROJECTS
CREATE TABLE public.other_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  content text,
  image_url text,
  external_url text,
  category text,
  status text NOT NULL DEFAULT 'actif',
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.other_projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.other_projects TO authenticated;
GRANT ALL ON public.other_projects TO service_role;
ALTER TABLE public.other_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published projects" ON public.other_projects FOR SELECT TO anon, authenticated USING (is_published = true OR public.is_admin(auth.uid()));
CREATE POLICY "Admins manage projects" ON public.other_projects FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER other_projects_updated_at BEFORE UPDATE ON public.other_projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- SITES
CREATE TABLE public.sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  url text NOT NULL,
  logo_url text,
  category text,
  status text NOT NULL DEFAULT 'en ligne',
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.sites TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sites TO authenticated;
GRANT ALL ON public.sites TO service_role;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published sites" ON public.sites FOR SELECT TO anon, authenticated USING (is_published = true OR public.is_admin(auth.uid()));
CREATE POLICY "Admins manage sites" ON public.sites FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER sites_updated_at BEFORE UPDATE ON public.sites FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ORDERS
CREATE SEQUENCE public.service_orders_number_seq START 1001;
CREATE TABLE public.service_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text,
  user_id uuid,
  service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  service_slug text,
  service_title text NOT NULL,
  options jsonb NOT NULL DEFAULT '{}'::jsonb,
  amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'XOF',
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  message text,
  status text NOT NULL DEFAULT 'nouvelle',
  payment_status text NOT NULL DEFAULT 'en_attente',
  payment_provider text,
  internal_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.service_orders TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_orders TO authenticated;
GRANT ALL ON public.service_orders TO service_role;
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create an order" ON public.service_orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Owners and admins can view orders" ON public.service_orders FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "Admins can update orders" ON public.service_orders FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete orders" ON public.service_orders FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));
CREATE TRIGGER service_orders_updated_at BEFORE UPDATE ON public.service_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.assign_order_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := 'IK-' || to_char(now(), 'YYYY') || '-' || nextval('public.service_orders_number_seq');
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_assign_order_number BEFORE INSERT ON public.service_orders FOR EACH ROW EXECUTE FUNCTION public.assign_order_number();

-- PAYMENTS
CREATE TABLE public.order_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.service_orders(id) ON DELETE CASCADE,
  provider text NOT NULL,
  provider_ref text,
  amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'XOF',
  status text NOT NULL DEFAULT 'en_attente',
  raw jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.order_payments TO authenticated;
GRANT ALL ON public.order_payments TO service_role;
ALTER TABLE public.order_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view payments" ON public.order_payments FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage payments" ON public.order_payments FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER order_payments_updated_at BEFORE UPDATE ON public.order_payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- SEED SERVICES
INSERT INTO public.services (slug, category, title, description, price, price_note, bullets, is_orderable, sort_order) VALUES
('site-essentiel','web','Site vitrine essentiel','Site vitrine professionnel prêt à convaincre.',100000,'À partir de','{"Jusqu''à 5 pages","Responsive mobile-first","Formulaire de contact"}',true,1),
('site-moderne','web','Site vitrine moderne & évolutif','Site premium, animé et évolutif.',550000,'À partir de','{"Design premium sur mesure","SEO avancé","Blog & actualités"}',true,2),
('app-web','web','Applications web & plateformes','Application métier ou plateforme sur mesure.',350000,'À partir de','{"Espace utilisateur","Tableau de bord","Base de données sécurisée"}',true,3),
('crm','web','CRM / outils métier','Outil métier adapté à votre organisation.',NULL,'Sur devis','{"Gestion clients","Suivi commercial","Rapports"}',true,4),
('leads','web','Plateformes commerciales / génération de leads','Plateforme orientée acquisition et conversion.',250000,'À partir de','{"Tunnel de conversion","Suivi des leads","Notifications"}',true,5),
('ecommerce','web','E-commerce avancé','Boutique en ligne complète.',NULL,'Sur mesure','{"Catalogue","Paiement en ligne","Livraison"}',true,6),
('video-voixoff','video','Vidéo avec voix off',NULL,15000,NULL,'{"Maximum 60 secondes","Voix off professionnelle","Montage inclus"}',true,10),
('video-lipsync-2','video','Vidéo avec synchronisation labiale — 2 personnages',NULL,20000,NULL,'{"2 personnages principaux"}',true,11),
('video-lipsync-4','video','Vidéo avec synchronisation labiale — 4 personnages',NULL,25000,NULL,'{"4 personnages principaux"}',true,12),
('video-lipsync-multi','video','Vidéo avec plusieurs personnages',NULL,NULL,'Sur devis','{"Scénario personnalisé"}',true,13),
('video-personnalisee','video','Vidéo personnalisée',NULL,NULL,'Sur devis','{"Univers visuel dédié"}',true,14),
('jingle','audio','Jingle audio personnalisé',NULL,15000,'À partir de','{"Identité sonore","Livraison rapide"}',true,20),
('chanson','audio','Chanson personnalisée assistée par IA',NULL,15000,'À partir de','{"Durée minimale 2 min 30","Paroles personnalisées"}',true,21),
('mini-clip','audio','Mini-clip musical personnalisé',NULL,45000,'À partir de','{"Durée minimale 2 min 30","Photos fournies intégrées","Animation IA"}',true,22),
('ia-assistant','ia','Assistant virtuel & chatbot',NULL,NULL,'Sur mesure','{"Assistant métier","Chatbot site & WhatsApp"}',true,30),
('ia-contenu','ia','Génération de contenu & automatisation',NULL,NULL,'Sur mesure','{"Contenus automatisés","Workflows"}',true,31),
('ia-analyse','ia','Analyse & traitement documentaire',NULL,NULL,'Sur mesure','{"Extraction de données","Résumés automatiques"}',true,32),
('ia-integration','ia','Intégration IA dans une application existante',NULL,NULL,'Sur mesure','{"Fonctionnalités intelligentes","API IA"}',true,33),
('formation','formation','Formation & accompagnement','Formations IA, digital et entrepreneuriat.',NULL,'Sur devis','{"Sessions individuelles ou groupe","Accompagnement projet"}',true,40);

-- fix numeric column mistakenly given text for one row
UPDATE public.services SET price = NULL, price_note = 'Sur devis' WHERE slug = 'video-lipsync-multi';

-- SEED SITES
INSERT INTO public.sites (name, description, url, category, sort_order) VALUES
('SMS Pro Mobile','Plateforme d''envoi de SMS professionnels.','https://smspromobile.com','Plateforme',1),
('Scoly','E-commerce scolaire & bureautique.','https://scoly.ci','E-commerce',2),
('AgriCapital','Site officiel d''AgriCapital SARL.','https://agricapital.ci','Entreprise',3),
('Client AgriCapital','Espace client sécurisé AgriCapital.','https://client.agricapital.ci','Espace client',4),
('Application AgriCapital','Application de gestion AgriCapital.','https://app.agricapital.ci','Application',5);

-- SEED OTHER PROJECTS
INSERT INTO public.other_projects (name, slug, description, content, external_url, category, sort_order) VALUES
('AgriCapital SARL','agricapital','Projet entrepreneurial agricole fondé et dirigé par Inocent KOFFI.','AgriCapital structure, crée et gère des actifs agricoles durables en Côte d''Ivoire : plantations clé en main, sécurisation foncière, suivi agronomique et garantie d''écoulement.','https://agricapital.ci','Entrepreneuriat agricole',1);