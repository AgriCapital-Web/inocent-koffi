CREATE TABLE public.ai_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key text NOT NULL UNIQUE,
  response jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days')
);

CREATE INDEX idx_ai_cache_key ON public.ai_cache(cache_key);
CREATE INDEX idx_ai_cache_expires ON public.ai_cache(expires_at);

ALTER TABLE public.ai_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cache" ON public.ai_cache FOR SELECT TO public USING (true);
CREATE POLICY "Edge functions can insert cache" ON public.ai_cache FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Edge functions can delete cache" ON public.ai_cache FOR DELETE TO public USING (true);