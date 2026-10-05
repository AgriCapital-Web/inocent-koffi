CREATE OR REPLACE FUNCTION public.get_post_reaction_counts(_post_id uuid)
RETURNS TABLE(reaction_type text, count bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT bl.reaction_type, count(*)::bigint
  FROM public.blog_likes bl
  WHERE bl.post_id = _post_id
  GROUP BY bl.reaction_type;
$$;

GRANT EXECUTE ON FUNCTION public.get_post_reaction_counts(uuid) TO anon, authenticated;

DROP POLICY IF EXISTS "Public can view like counts" ON public.blog_likes;
REVOKE SELECT ON public.blog_likes FROM anon, authenticated;