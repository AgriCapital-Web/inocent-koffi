-- Managed digital shop: categories, services, orders and order history.
-- Applied to the Vitrine Supabase project as create_managed_digital_shop_v2,
-- then hardened in harden_shop_catalog_functions.

create table if not exists public.service_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  icon text,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.service_categories(id) on delete set null,
  slug text not null unique,
  title text not null,
  description text,
  price numeric(14,2),
  price_note text,
  bullets jsonb not null default '[]'::jsonb,
  image_url text,
  delivery_note text,
  is_orderable boolean not null default true,
  is_published boolean not null default true,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('CMD-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,10))),
  service_id uuid references public.services(id) on delete set null,
  service_slug text,
  service_title text not null,
  amount numeric(14,2) not null default 0,
  currency text not null default 'XOF',
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  customer_company text,
  message text,
  options jsonb not null default '{}'::jsonb,
  status text not null default 'nouvelle' check (status in ('nouvelle','en_discussion','validee','en_production','livree','annulee')),
  payment_status text not null default 'en_attente' check (payment_status in ('en_attente','acompte','paye','rembourse')),
  payment_provider text,
  payment_reference text,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.service_orders(id) on delete cascade,
  status text not null,
  note text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.service_categories enable row level security;
alter table public.services enable row level security;
alter table public.service_orders enable row level security;
alter table public.service_order_events enable row level security;

drop policy if exists "Public can view published service categories" on public.service_categories;
create policy "Public can view published service categories" on public.service_categories for select to anon, authenticated using (is_published = true);

drop policy if exists "Admins manage service categories" on public.service_categories;
create policy "Admins manage service categories" on public.service_categories for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public can view published services" on public.services;
create policy "Public can view published services" on public.services for select to anon, authenticated using (is_published = true and is_orderable = true);

drop policy if exists "Admins manage services" on public.services;
create policy "Admins manage services" on public.services for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Anyone can create service orders" on public.service_orders;
create policy "Anyone can create service orders" on public.service_orders for insert to anon, authenticated with check (customer_name <> '' and customer_email <> '' and service_title <> '');

drop policy if exists "Admins manage service orders" on public.service_orders;
create policy "Admins manage service orders" on public.service_orders for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins manage service order events" on public.service_order_events;
create policy "Admins manage service order events" on public.service_order_events for all to authenticated using (public.is_admin()) with check (public.is_admin());

create or replace function public.touch_service_catalog_updated_at()
returns trigger language plpgsql set search_path = public
as $fn$
begin
  new.updated_at = now();
  return new;
end;
$fn$;

create or replace function public.log_service_order_status()
returns trigger language plpgsql set search_path = public
as $fn$
begin
  if tg_op = 'INSERT' then
    insert into public.service_order_events(order_id,status,note,created_by)
    values (new.id,new.status,'Commande créée',auth.uid());
  elsif new.status is distinct from old.status then
    insert into public.service_order_events(order_id,status,note,created_by)
    values (new.id,new.status,'Statut mis à jour',auth.uid());
  end if;
  return new;
end;
$fn$;
insert into public.service_categories (slug,title,subtitle,icon,sort_order) values
('web','Web & solutions digitales','Sites, applications, plateformes, CRM, outils métier et intégrations API.','web',10),
('video','Vidéo & création IA','Publicités, vidéos avec voix off, synchronisation labiale et contenus IA.','video',20),
('audio','Audio & musique','Jingles, voix off, créations audio et chansons personnalisées assistées par IA.','audio',30),
('ia','Intelligence artificielle','Intégration IA sur mesure, adaptée à votre activité et à vos outils existants.','ia',40)
on conflict (slug) do update set title=excluded.title,subtitle=excluded.subtitle,icon=excluded.icon,sort_order=excluded.sort_order;

insert into public.services (category_id,slug,title,description,price,price_note,bullets,sort_order) values
((select id from public.service_categories where slug='web'),'site-essentiel','Site vitrine essentiel','Présence professionnelle rapide à mettre en ligne, responsive et optimisée SEO.',100000,null,'["Jusqu''à 5 sections","Formulaire de contact","Optimisation mobile & SEO de base"]'::jsonb,10),
((select id from public.service_categories where slug='web'),'site-moderne','Site vitrine moderne & évolutif','Design premium, animations maîtrisées, contenu administrable et évolutif.',550000,null,'["Design sur mesure","Espace d’administration","SEO avancé & performances"]'::jsonb,20),
((select id from public.service_categories where slug='web'),'app-web','Applications web & plateformes','Applications métier, espaces membres, tableaux de bord et back-offices.',350000,null,'["Authentification","Base de données","Tableaux de bord"]'::jsonb,30),
((select id from public.service_categories where slug='web'),'crm','CRM / outils métier','Pipeline commercial, gestion des dossiers, automatisations internes.',null,'Sur devis','[]'::jsonb,40),
((select id from public.service_categories where slug='web'),'leads','Plateformes commerciales / génération de leads','Tunnel d’acquisition, formulaires qualifiés, suivi et relances.',250000,null,'[]'::jsonb,50),
((select id from public.service_categories where slug='web'),'ecommerce','E-commerce avancé','Catalogue, panier, paiement Mobile Money et carte bancaire, logistique.',null,'Sur mesure','[]'::jsonb,60),
((select id from public.service_categories where slug='video'),'video-voixoff','Vidéo avec voix off','Maximum 60 secondes.',15000,null,'[]'::jsonb,10),
((select id from public.service_categories where slug='video'),'video-lipsync-2','Synchronisation labiale — 2 personnages principaux',null,20000,null,'[]'::jsonb,20),
((select id from public.service_categories where slug='video'),'video-lipsync-4','Synchronisation labiale — 4 personnages principaux',null,25000,null,'[]'::jsonb,30),
((select id from public.service_categories where slug='video'),'video-lipsync-multi','Synchronisation labiale — plusieurs personnages',null,null,'Sur devis','[]'::jsonb,40),
((select id from public.service_categories where slug='video'),'video-personnalisee','Vidéo personnalisée','Scénario, univers visuel et format définis avec vous.',null,'Sur devis','[]'::jsonb,50),
((select id from public.service_categories where slug='audio'),'jingle','Jingle audio personnalisé','Pour marques, produits, entreprises, événements, campagnes, émissions, etc.',15000,'À partir de','[]'::jsonb,10),
((select id from public.service_categories where slug='audio'),'chanson','Chanson personnalisée assistée par IA','Durée minimale : 2 min 30.',15000,'À partir de','[]'::jsonb,20),
((select id from public.service_categories where slug='audio'),'mini-clip','Mini-clip musical personnalisé','Durée minimale : 2 min 30.',45000,'À partir de','["Photos fournies","Univers visuel personnalisé","Musique & paroles","Scénario","Animation IA"]'::jsonb,30),
((select id from public.service_categories where slug='ia'),'ia-assistant','Assistant virtuel & chatbot',null,null,'Sur mesure','[]'::jsonb,10),
((select id from public.service_categories where slug='ia'),'ia-contenu','Génération de contenu & automatisation',null,null,'Sur mesure','[]'::jsonb,20),
((select id from public.service_categories where slug='ia'),'ia-analyse','Analyse & traitement documentaire',null,null,'Sur mesure','[]'::jsonb,30),
((select id from public.service_categories where slug='ia'),'ia-integration','Intégration d’IA dans une application existante',null,null,'Sur mesure','[]'::jsonb,40)
on conflict (slug) do update set category_id=excluded.category_id,title=excluded.title,description=excluded.description,price=excluded.price,price_note=excluded.price_note,bullets=excluded.bullets,sort_order=excluded.sort_order;
