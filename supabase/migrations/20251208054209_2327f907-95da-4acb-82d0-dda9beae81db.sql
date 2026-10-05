-- Create storage bucket for testimonials photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'testimonials', 
  'testimonials', 
  true, 
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Storage policies for testimonials bucket
CREATE POLICY "Anyone can view testimonial photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'testimonials');

CREATE POLICY "Anyone can upload testimonial photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'testimonials');

-- Add UPDATE and DELETE policies for admins
CREATE POLICY "Admins can update testimonials"
ON public.testimonials FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete testimonials"
ON public.testimonials FOR DELETE
USING (public.is_admin(auth.uid()));

-- Add UPDATE and DELETE policies for partnership_requests
CREATE POLICY "Admins can update partnership requests"
ON public.partnership_requests FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete partnership requests"
ON public.partnership_requests FOR DELETE
USING (public.is_admin(auth.uid()));

-- Add UPDATE and DELETE policies for contact_messages
CREATE POLICY "Admins can update contact messages"
ON public.contact_messages FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete contact messages"
ON public.contact_messages FOR DELETE
USING (public.is_admin(auth.uid()));

-- Add SELECT policy for newsletter_subscribers for admins
CREATE POLICY "Admins can view newsletter subscribers"
ON public.newsletter_subscribers FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update newsletter subscribers"
ON public.newsletter_subscribers FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete newsletter subscribers"
ON public.newsletter_subscribers FOR DELETE
USING (public.is_admin(auth.uid()));