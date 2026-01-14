-- Create blog_categories table
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#1e40af',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Categories are viewable by everyone" 
ON public.blog_categories FOR SELECT USING (true);

-- Only admins can manage categories
CREATE POLICY "Admins can manage categories"
ON public.blog_categories FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() 
  AND role IN ('super_admin', 'admin')
));

-- Add category_id to blog_posts
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.blog_categories(id),
ADD COLUMN IF NOT EXISTS tagline TEXT,
ADD COLUMN IF NOT EXISTS hashtags TEXT[],
ADD COLUMN IF NOT EXISTS author TEXT DEFAULT 'Inocent KOFFI',
ADD COLUMN IF NOT EXISTS auto_save_data JSONB;

-- Create blog_media table for multi-file uploads
CREATE TABLE IF NOT EXISTS public.blog_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on blog_media
ALTER TABLE public.blog_media ENABLE ROW LEVEL SECURITY;

-- Public can view media
CREATE POLICY "Media are viewable by everyone"
ON public.blog_media FOR SELECT USING (true);

-- Admins can manage media
CREATE POLICY "Admins can manage media"
ON public.blog_media FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() 
  AND role IN ('super_admin', 'admin')
));

-- Create storage bucket for blog media
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('blog-media', 'blog-media', true, 524288000)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for blog media
CREATE POLICY "Blog media are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-media');

CREATE POLICY "Admins can upload blog media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'blog-media' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('super_admin', 'admin')
  )
);

CREATE POLICY "Admins can update blog media"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'blog-media' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('super_admin', 'admin')
  )
);

CREATE POLICY "Admins can delete blog media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'blog-media' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('super_admin', 'admin')
  )
);

-- Insert default categories
INSERT INTO public.blog_categories (name, slug, description, color) VALUES
('Vision & Agriculture', 'vision-agriculture', 'Articles sur la vision agricole et le développement durable', '#166534'),
('Économie & Développement', 'economie-developpement', 'Analyses économiques et stratégies de développement', '#0369a1'),
('Jeunesse & Entrepreneuriat', 'jeunesse-entrepreneuriat', 'Encourager les jeunes à entreprendre', '#7c3aed'),
('Afrique & Souveraineté', 'afrique-souverainete', 'Réflexions sur la souveraineté africaine', '#dc2626'),
('Réflexions du DG', 'reflexions-dg', 'Pensées et réflexions personnelles du Directeur Général', '#ca8a04'),
('AgriCapital & Impact', 'agricapital-impact', 'Impact d''AgriCapital sur les communautés', '#059669')
ON CONFLICT (slug) DO NOTHING;