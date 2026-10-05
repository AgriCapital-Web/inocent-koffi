
DROP POLICY IF EXISTS "Anyone can insert shares" ON public.article_shares;
CREATE POLICY "Anyone can insert shares" ON public.article_shares FOR INSERT TO public
WITH CHECK (length(platform) BETWEEN 1 AND 40 AND (session_id IS NULL OR length(session_id) <= 128)
  AND EXISTS (SELECT 1 FROM public.blog_posts p WHERE p.id = post_id AND p.is_published));

DROP POLICY IF EXISTS "Anyone can insert article views" ON public.article_views;
CREATE POLICY "Anyone can insert article views" ON public.article_views FOR INSERT TO public
WITH CHECK ((session_id IS NULL OR length(session_id) <= 128)
  AND COALESCE(reading_progress,0) BETWEEN 0 AND 100
  AND COALESCE(time_spent_seconds,0) >= 0
  AND EXISTS (SELECT 1 FROM public.blog_posts p WHERE p.id = post_id AND p.is_published));

DROP POLICY IF EXISTS "Anyone can submit comments" ON public.blog_comments;
CREATE POLICY "Anyone can submit comments" ON public.blog_comments FOR INSERT TO public
WITH CHECK (is_approved = false AND length(author_name) BETWEEN 1 AND 120
  AND length(author_email) BETWEEN 3 AND 255 AND length(content) BETWEEN 1 AND 5000
  AND EXISTS (SELECT 1 FROM public.blog_posts p WHERE p.id = post_id AND p.is_published));

DROP POLICY IF EXISTS "Anyone can add likes" ON public.blog_likes;
CREATE POLICY "Anyone can add likes" ON public.blog_likes FOR INSERT TO public
WITH CHECK (length(reaction_type) BETWEEN 1 AND 30
  AND (author_name IS NULL OR length(author_name) <= 120)
  AND (author_phone IS NULL OR length(author_phone) <= 40)
  AND (session_id IS NULL OR length(session_id) <= 128)
  AND EXISTS (SELECT 1 FROM public.blog_posts p WHERE p.id = post_id AND p.is_published));

DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;
CREATE POLICY "Anyone can submit contact messages" ON public.contact_messages FOR INSERT TO public
WITH CHECK (length(name) BETWEEN 1 AND 120 AND length(email) BETWEEN 3 AND 255
  AND (phone IS NULL OR length(phone) <= 40) AND length(message) BETWEEN 1 AND 5000);

DROP POLICY IF EXISTS "Anyone can create replies" ON public.forum_replies;
CREATE POLICY "Anyone can create replies" ON public.forum_replies FOR INSERT TO public
WITH CHECK (is_approved = false AND length(author_name) BETWEEN 1 AND 120
  AND length(content) BETWEEN 1 AND 5000
  AND (author_email IS NULL OR length(author_email) <= 255)
  AND EXISTS (SELECT 1 FROM public.forum_topics t WHERE t.id = topic_id AND NOT t.is_locked));

DROP POLICY IF EXISTS "Anyone can create forum topics" ON public.forum_topics;
CREATE POLICY "Anyone can create forum topics" ON public.forum_topics FOR INSERT TO public
WITH CHECK (is_pinned = false AND is_locked = false AND COALESCE(view_count,0) = 0 AND COALESCE(reply_count,0) = 0
  AND length(title) BETWEEN 1 AND 200 AND length(content) BETWEEN 1 AND 10000
  AND length(author_name) BETWEEN 1 AND 120 AND length(category) BETWEEN 1 AND 60
  AND (author_email IS NULL OR length(author_email) <= 255));

DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers FOR INSERT TO public
WITH CHECK (length(email) BETWEEN 3 AND 255 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND (first_name IS NULL OR length(first_name) <= 100) AND (last_name IS NULL OR length(last_name) <= 100));

DROP POLICY IF EXISTS "Anyone can submit partnership requests" ON public.partnership_requests;
CREATE POLICY "Anyone can submit partnership requests" ON public.partnership_requests FOR INSERT TO public
WITH CHECK (length(company_name) BETWEEN 1 AND 200 AND length(contact_name) BETWEEN 1 AND 120
  AND length(email) BETWEEN 3 AND 255 AND length(phone) BETWEEN 1 AND 40
  AND length(partnership_type) BETWEEN 1 AND 100 AND length(message) BETWEEN 1 AND 5000
  AND (website IS NULL OR length(website) <= 500));

DROP POLICY IF EXISTS "Anyone can create an order" ON public.service_orders;
CREATE POLICY "Anyone can create an order" ON public.service_orders FOR INSERT TO anon, authenticated
WITH CHECK ((user_id IS NULL OR user_id = auth.uid())
  AND payment_status = 'pending' AND internal_notes IS NULL
  AND amount >= 0 AND length(customer_name) BETWEEN 1 AND 120
  AND length(customer_email) BETWEEN 3 AND 255 AND length(service_title) BETWEEN 1 AND 200
  AND (message IS NULL OR length(message) <= 5000));

DROP POLICY IF EXISTS "Anyone can insert visitors" ON public.site_visitors;
CREATE POLICY "Anyone can insert visitors" ON public.site_visitors FOR INSERT TO public
WITH CHECK (length(session_id) BETWEEN 1 AND 128 AND (user_agent IS NULL OR length(user_agent) <= 512));

DROP POLICY IF EXISTS "Anyone can submit testimonials" ON public.testimonials;
CREATE POLICY "Anyone can submit testimonials" ON public.testimonials FOR INSERT TO public
WITH CHECK (is_approved = false AND length(first_name) BETWEEN 1 AND 100 AND length(last_name) BETWEEN 1 AND 100
  AND length(email) BETWEEN 3 AND 255 AND length(locality) BETWEEN 1 AND 120
  AND length(message) BETWEEN 1 AND 5000 AND (rating IS NULL OR rating BETWEEN 1 AND 5));

DROP POLICY IF EXISTS "Service role can insert cache" ON public.ai_cache;
DROP POLICY IF EXISTS "Service role can delete cache" ON public.ai_cache;
DROP POLICY IF EXISTS "Service role can insert audit history" ON public.og_audit_history;

DROP POLICY IF EXISTS "Public can upload testimonial images only" ON storage.objects;
CREATE POLICY "Public can upload testimonial images only" ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'testimonials'
  AND length(name) <= 200
  AND (name ~ '^[0-9]+-[a-z0-9]+\.[A-Za-z0-9]+$' OR name ~ '^comments/comment_[0-9]+_[a-z0-9]+\.[A-Za-z0-9]+$' OR (name LIKE 'blog/%' AND public.is_admin(auth.uid())))
  AND lower(storage.extension(name)) = ANY (ARRAY['jpg','jpeg','png','webp','gif','avif'])
  AND COALESCE((metadata->>'size')::bigint, 0) <= 5242880
  AND COALESCE(metadata->>'mimetype','image/jpeg') LIKE 'image/%');
