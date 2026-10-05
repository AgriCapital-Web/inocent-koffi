
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS share_version TEXT;

CREATE OR REPLACE FUNCTION public.bump_share_version()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' OR NEW.title IS DISTINCT FROM OLD.title
     OR NEW.content IS DISTINCT FROM OLD.content
     OR NEW.excerpt IS DISTINCT FROM OLD.excerpt
     OR NEW.featured_image IS DISTINCT FROM OLD.featured_image THEN
    NEW.share_version := to_char(now() AT TIME ZONE 'UTC', 'YYYYMMDDHH24MISS');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_bump_share_version ON public.blog_posts;
CREATE TRIGGER trg_bump_share_version
BEFORE INSERT OR UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.bump_share_version();

UPDATE public.blog_posts SET share_version = to_char(COALESCE(updated_at, created_at) AT TIME ZONE 'UTC', 'YYYYMMDDHH24MISS') WHERE share_version IS NULL;
