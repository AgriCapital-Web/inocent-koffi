
-- Drop all existing RESTRICTIVE policies and recreate as PERMISSIVE

-- blog_posts: drop and recreate
DROP POLICY IF EXISTS "Admins can manage all posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can manage posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Published posts are publicly visible" ON public.blog_posts;

CREATE POLICY "Published posts are publicly visible" ON public.blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Authenticated users can manage own posts" ON public.blog_posts FOR ALL TO authenticated USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Admins can manage all posts" ON public.blog_posts FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- blog_categories: drop and recreate
DROP POLICY IF EXISTS "Admins can manage categories" ON public.blog_categories;
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.blog_categories;

CREATE POLICY "Categories are viewable by everyone" ON public.blog_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.blog_categories FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- blog_comments: drop and recreate  
DROP POLICY IF EXISTS "Admins can manage all comments" ON public.blog_comments;
DROP POLICY IF EXISTS "Admins can view all comments" ON public.blog_comments;
DROP POLICY IF EXISTS "Anyone can submit comments" ON public.blog_comments;
DROP POLICY IF EXISTS "Anyone can view approved comments" ON public.blog_comments;

CREATE POLICY "Anyone can view approved comments" ON public.blog_comments FOR SELECT USING (is_approved = true);
CREATE POLICY "Admins can view all comments" ON public.blog_comments FOR SELECT TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Anyone can submit comments" ON public.blog_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage all comments" ON public.blog_comments FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- blog_likes: drop and recreate
DROP POLICY IF EXISTS "Admins can delete likes" ON public.blog_likes;
DROP POLICY IF EXISTS "Anyone can add likes" ON public.blog_likes;
DROP POLICY IF EXISTS "Anyone can view likes" ON public.blog_likes;

CREATE POLICY "Anyone can view likes" ON public.blog_likes FOR SELECT USING (true);
CREATE POLICY "Anyone can add likes" ON public.blog_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can delete likes" ON public.blog_likes FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- blog_media: drop and recreate
DROP POLICY IF EXISTS "Admins can manage media" ON public.blog_media;
DROP POLICY IF EXISTS "Media are viewable by everyone" ON public.blog_media;

CREATE POLICY "Media are viewable by everyone" ON public.blog_media FOR SELECT USING (true);
CREATE POLICY "Admins can manage media" ON public.blog_media FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- article_views: drop and recreate
DROP POLICY IF EXISTS "Admins can view article stats" ON public.article_views;
DROP POLICY IF EXISTS "Anyone can insert article views" ON public.article_views;
DROP POLICY IF EXISTS "Anyone can update own view" ON public.article_views;

CREATE POLICY "Anyone can view article stats" ON public.article_views FOR SELECT USING (true);
CREATE POLICY "Anyone can insert article views" ON public.article_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update own view" ON public.article_views FOR UPDATE USING (true);

-- article_shares: drop and recreate
DROP POLICY IF EXISTS "Anyone can insert shares" ON public.article_shares;
DROP POLICY IF EXISTS "Anyone can view shares" ON public.article_shares;

CREATE POLICY "Anyone can view shares" ON public.article_shares FOR SELECT USING (true);
CREATE POLICY "Anyone can insert shares" ON public.article_shares FOR INSERT WITH CHECK (true);

-- testimonials: drop and recreate
DROP POLICY IF EXISTS "Admins can delete testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can update testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "All testimonials are publicly visible" ON public.testimonials;
DROP POLICY IF EXISTS "Anyone can submit testimonials" ON public.testimonials;

CREATE POLICY "All testimonials are publicly visible" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Anyone can submit testimonials" ON public.testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update testimonials" ON public.testimonials FOR UPDATE TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete testimonials" ON public.testimonials FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- contact_messages: drop and recreate
DROP POLICY IF EXISTS "Admins can delete contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can update contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Authenticated users can view contact messages" ON public.contact_messages;

CREATE POLICY "Anyone can submit contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can view contact messages" ON public.contact_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can update contact messages" ON public.contact_messages FOR UPDATE TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete contact messages" ON public.contact_messages FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- newsletter_subscribers: drop and recreate
DROP POLICY IF EXISTS "Admins can delete newsletter subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can update newsletter subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can view newsletter subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;

CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view newsletter subscribers" ON public.newsletter_subscribers FOR SELECT TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can update newsletter subscribers" ON public.newsletter_subscribers FOR UPDATE TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete newsletter subscribers" ON public.newsletter_subscribers FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- partnership_requests: drop and recreate
DROP POLICY IF EXISTS "Admins can delete partnership requests" ON public.partnership_requests;
DROP POLICY IF EXISTS "Admins can update partnership requests" ON public.partnership_requests;
DROP POLICY IF EXISTS "Anyone can submit partnership requests" ON public.partnership_requests;
DROP POLICY IF EXISTS "Authenticated users can view partnership requests" ON public.partnership_requests;

CREATE POLICY "Anyone can submit partnership requests" ON public.partnership_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can view partnership requests" ON public.partnership_requests FOR SELECT USING (true);
CREATE POLICY "Admins can update partnership requests" ON public.partnership_requests FOR UPDATE TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete partnership requests" ON public.partnership_requests FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- forum_topics: drop and recreate
DROP POLICY IF EXISTS "Admins can delete forum topics" ON public.forum_topics;
DROP POLICY IF EXISTS "Anyone can create forum topics" ON public.forum_topics;
DROP POLICY IF EXISTS "Anyone can update view count" ON public.forum_topics;
DROP POLICY IF EXISTS "Anyone can view forum topics" ON public.forum_topics;

CREATE POLICY "Anyone can view forum topics" ON public.forum_topics FOR SELECT USING (true);
CREATE POLICY "Anyone can create forum topics" ON public.forum_topics FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update view count" ON public.forum_topics FOR UPDATE USING (true);
CREATE POLICY "Admins can delete forum topics" ON public.forum_topics FOR DELETE TO authenticated USING (is_admin(auth.uid()));

-- forum_replies: drop and recreate
DROP POLICY IF EXISTS "Admins can manage replies" ON public.forum_replies;
DROP POLICY IF EXISTS "Admins can view all replies" ON public.forum_replies;
DROP POLICY IF EXISTS "Anyone can create replies" ON public.forum_replies;
DROP POLICY IF EXISTS "Anyone can view approved replies" ON public.forum_replies;

CREATE POLICY "Anyone can view approved replies" ON public.forum_replies FOR SELECT USING (is_approved = true);
CREATE POLICY "Admins can view all replies" ON public.forum_replies FOR SELECT TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Anyone can create replies" ON public.forum_replies FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage replies" ON public.forum_replies FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- user_roles: drop and recreate
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- site_settings: drop and recreate
DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Anyone can read site settings" ON public.site_settings;

CREATE POLICY "Anyone can read site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage site settings" ON public.site_settings FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- database_backups: drop and recreate
DROP POLICY IF EXISTS "Admins can create backups" ON public.database_backups;
DROP POLICY IF EXISTS "Admins can delete backups" ON public.database_backups;
DROP POLICY IF EXISTS "Admins can view backups" ON public.database_backups;

CREATE POLICY "Admins can view backups" ON public.database_backups FOR SELECT TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can create backups" ON public.database_backups FOR INSERT TO authenticated WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Admins can delete backups" ON public.database_backups FOR DELETE TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Admins can update backups" ON public.database_backups FOR UPDATE TO authenticated USING (is_admin(auth.uid()));

-- profiles: drop and recreate
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id OR is_admin(auth.uid()));
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Create site_visitors table for tracking
CREATE TABLE IF NOT EXISTS public.site_visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  visited_at timestamp with time zone NOT NULL DEFAULT now(),
  is_online boolean DEFAULT true,
  last_active timestamp with time zone DEFAULT now(),
  user_agent text,
  UNIQUE(session_id)
);

ALTER TABLE public.site_visitors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert visitors" ON public.site_visitors FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view visitors" ON public.site_visitors FOR SELECT USING (true);
CREATE POLICY "Anyone can update visitors" ON public.site_visitors FOR UPDATE USING (true);

-- Enable realtime for site_visitors
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_visitors;
