
-- Site Settings table for persisting admin SEO/settings
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text NOT NULL UNIQUE,
  setting_value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site settings"
ON public.site_settings FOR SELECT
USING (true);

CREATE POLICY "Admins can manage site settings"
ON public.site_settings FOR ALL
USING (is_admin(auth.uid()));

-- Article views tracking table
CREATE TABLE public.article_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  session_id text,
  visitor_ip text,
  user_agent text,
  referrer text,
  country text,
  city text,
  reading_progress integer DEFAULT 0,
  time_spent_seconds integer DEFAULT 0,
  finished_reading boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.article_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert article views"
ON public.article_views FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view article stats"
ON public.article_views FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Anyone can update own view"
ON public.article_views FOR UPDATE
USING (true);

-- Index for fast lookups
CREATE INDEX idx_article_views_post_id ON public.article_views(post_id);
CREATE INDEX idx_article_views_created_at ON public.article_views(created_at);

-- Add view_count to blog_posts for quick access
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0;

-- Function to increment view count
CREATE OR REPLACE FUNCTION public.increment_view_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.blog_posts SET view_count = view_count + 1 WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_increment_view_count
AFTER INSERT ON public.article_views
FOR EACH ROW
EXECUTE FUNCTION public.increment_view_count();

-- Insert default site settings
INSERT INTO public.site_settings (setting_key, setting_value) VALUES
('seo', '{"site_title": "Inocent KOFFI - Leadership & Agriculture", "meta_description": "Site officiel d''Inocent KOFFI, Fondateur d''AGRICAPITAL", "keywords": "agriculture, leadership, Côte d''Ivoire, AGRICAPITAL", "og_image": "/og-image.png", "google_analytics_id": "", "google_search_console": ""}'::jsonb),
('general', '{"site_name": "Inocent KOFFI", "contact_email": "Inocent.koffi@agricapital.ci", "phone": "", "address": "Abidjan, Côte d''Ivoire", "social_facebook": "", "social_linkedin": "", "social_twitter": ""}'::jsonb),
('appearance', '{"primary_color": "#1a365d", "accent_color": "#d4a017", "font_family": "Inter", "show_newsletter": true, "show_testimonials": true}'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;
