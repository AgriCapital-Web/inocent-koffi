-- Add likes table for blog posts
CREATE TABLE public.blog_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL DEFAULT 'like',
  author_name TEXT,
  author_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id TEXT
);

-- Enable RLS
ALTER TABLE public.blog_likes ENABLE ROW LEVEL SECURITY;

-- Anyone can see likes
CREATE POLICY "Anyone can view likes" ON public.blog_likes FOR SELECT USING (true);

-- Anyone can add likes
CREATE POLICY "Anyone can add likes" ON public.blog_likes FOR INSERT WITH CHECK (true);

-- Admins can delete likes
CREATE POLICY "Admins can delete likes" ON public.blog_likes FOR DELETE USING (is_admin(auth.uid()));

-- Add phone column to blog_comments if not exists
ALTER TABLE public.blog_comments ADD COLUMN IF NOT EXISTS author_phone TEXT;
ALTER TABLE public.blog_comments ADD COLUMN IF NOT EXISTS author_photo TEXT;