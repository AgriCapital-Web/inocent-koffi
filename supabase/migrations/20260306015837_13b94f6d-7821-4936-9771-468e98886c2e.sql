-- Add RLS policy for admins to manage all blog posts (fix publishing issue)
CREATE POLICY "Admins can manage all posts"
ON public.blog_posts
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Add share tracking table
CREATE TABLE IF NOT EXISTS public.article_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  platform text NOT NULL DEFAULT 'unknown',
  session_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.article_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert shares"
ON public.article_shares FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view shares"
ON public.article_shares FOR SELECT
USING (true);