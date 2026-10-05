-- Create blog_comments table for article comments with moderation
CREATE TABLE public.blog_comments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_email TEXT NOT NULL,
    content TEXT NOT NULL,
    is_approved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved comments
CREATE POLICY "Anyone can view approved comments"
ON public.blog_comments
FOR SELECT
USING (is_approved = true);

-- Anyone can submit comments
CREATE POLICY "Anyone can submit comments"
ON public.blog_comments
FOR INSERT
WITH CHECK (true);

-- Admins can manage all comments
CREATE POLICY "Admins can manage all comments"
ON public.blog_comments
FOR ALL
USING (is_admin(auth.uid()));

-- Admins can view all comments (including unapproved)
CREATE POLICY "Admins can view all comments"
ON public.blog_comments
FOR SELECT
USING (is_admin(auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER update_blog_comments_updated_at
BEFORE UPDATE ON public.blog_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create backups table for database backup history
CREATE TABLE public.database_backups (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    backup_name TEXT NOT NULL,
    backup_type TEXT NOT NULL DEFAULT 'manual',
    file_format TEXT NOT NULL DEFAULT 'json',
    file_size BIGINT,
    tables_included TEXT[],
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    status TEXT NOT NULL DEFAULT 'completed',
    notes TEXT
);

-- Enable RLS on backups
ALTER TABLE public.database_backups ENABLE ROW LEVEL SECURITY;

-- Only admins can view backups
CREATE POLICY "Admins can view backups"
ON public.database_backups
FOR SELECT
USING (is_admin(auth.uid()));

-- Only admins can create backups
CREATE POLICY "Admins can create backups"
ON public.database_backups
FOR INSERT
WITH CHECK (is_admin(auth.uid()));

-- Only admins can delete backups
CREATE POLICY "Admins can delete backups"
ON public.database_backups
FOR DELETE
USING (is_admin(auth.uid()));