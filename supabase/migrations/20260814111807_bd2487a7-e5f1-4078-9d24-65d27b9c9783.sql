CREATE TABLE IF NOT EXISTS public.agricapital_news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  category text NOT NULL DEFAULT 'Actualité',
  date date,
  date_label text,
  title text NOT NULL,
  excerpt text,
  content jsonb NOT NULL DEFAULT '[]'::jsonb,
  image text,
  image_alt text,
  source_url text,
  is_published boolean NOT NULL DEFAULT true,
  synced_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.agricapital_news TO anon;
GRANT SELECT ON public.agricapital_news TO authenticated;
GRANT ALL ON public.agricapital_news TO service_role;

ALTER TABLE public.agricapital_news ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published agricapital news are public" ON public.agricapital_news;
CREATE POLICY "Published agricapital news are public"
ON public.agricapital_news FOR SELECT
USING (is_published = true);

DROP POLICY IF EXISTS "Admins manage agricapital news" ON public.agricapital_news;
CREATE POLICY "Admins manage agricapital news"
ON public.agricapital_news FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS agricapital_news_date_idx ON public.agricapital_news (date DESC);