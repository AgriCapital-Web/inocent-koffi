
-- Forum topics
CREATE TABLE public.forum_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT,
  author_photo TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  is_locked BOOLEAN NOT NULL DEFAULT false,
  view_count INTEGER NOT NULL DEFAULT 0,
  reply_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Forum replies
CREATE TABLE public.forum_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID NOT NULL REFERENCES public.forum_topics(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT,
  author_photo TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;

-- Forum topics policies
CREATE POLICY "Anyone can view forum topics" ON public.forum_topics FOR SELECT USING (true);
CREATE POLICY "Anyone can create forum topics" ON public.forum_topics FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update view count" ON public.forum_topics FOR UPDATE USING (true);
CREATE POLICY "Admins can delete forum topics" ON public.forum_topics FOR DELETE USING (is_admin(auth.uid()));

-- Forum replies policies
CREATE POLICY "Anyone can view approved replies" ON public.forum_replies FOR SELECT USING (is_approved = true);
CREATE POLICY "Admins can view all replies" ON public.forum_replies FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Anyone can create replies" ON public.forum_replies FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage replies" ON public.forum_replies FOR ALL USING (is_admin(auth.uid()));

-- Trigger to update reply count
CREATE OR REPLACE FUNCTION public.update_topic_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.forum_topics SET reply_count = reply_count + 1, updated_at = now() WHERE id = NEW.topic_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.forum_topics SET reply_count = reply_count - 1 WHERE id = OLD.topic_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_reply_count
AFTER INSERT OR DELETE ON public.forum_replies
FOR EACH ROW EXECUTE FUNCTION public.update_topic_reply_count();
