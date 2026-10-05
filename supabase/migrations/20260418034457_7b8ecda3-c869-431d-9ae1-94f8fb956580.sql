-- Add article_number for short URLs (art004-026 format)
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS article_number INTEGER;

-- Create unique sequential numbers for existing published posts
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY COALESCE(published_at, created_at) ASC) AS rn
  FROM public.blog_posts
  WHERE article_number IS NULL
)
UPDATE public.blog_posts bp
SET article_number = n.rn
FROM numbered n
WHERE bp.id = n.id;

-- Sequence to give next article number safely
CREATE SEQUENCE IF NOT EXISTS public.blog_posts_article_number_seq;

-- Set sequence to current max
SELECT setval(
  'public.blog_posts_article_number_seq',
  COALESCE((SELECT MAX(article_number) FROM public.blog_posts), 0) + 1,
  false
);

-- Trigger to auto-assign article_number on insert
CREATE OR REPLACE FUNCTION public.assign_article_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.article_number IS NULL THEN
    NEW.article_number := nextval('public.blog_posts_article_number_seq');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_assign_article_number ON public.blog_posts;
CREATE TRIGGER trg_assign_article_number
BEFORE INSERT ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.assign_article_number();

-- Index for lookup
CREATE UNIQUE INDEX IF NOT EXISTS blog_posts_article_number_unique
  ON public.blog_posts(article_number)
  WHERE article_number IS NOT NULL;

-- Helper function: lookup post by short code components
CREATE OR REPLACE FUNCTION public.get_post_by_short_code(_num INTEGER, _year_short INTEGER)
RETURNS TABLE(slug TEXT, id UUID)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT bp.slug, bp.id
  FROM public.blog_posts bp
  WHERE bp.article_number = _num
    AND bp.is_published = true
    AND (EXTRACT(YEAR FROM COALESCE(bp.published_at, bp.created_at))::INTEGER % 1000) = _year_short
  LIMIT 1;
$$;