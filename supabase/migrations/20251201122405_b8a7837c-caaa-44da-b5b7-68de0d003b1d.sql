-- Create testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  locality text NOT NULL,
  photo_url text,
  message text NOT NULL,
  is_approved boolean NOT NULL DEFAULT false,
  rating integer CHECK (rating >= 1 AND rating <= 5)
);

-- Enable Row Level Security
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit testimonials
CREATE POLICY "Anyone can submit testimonials"
ON public.testimonials
FOR INSERT
WITH CHECK (true);

-- Only approved testimonials are visible to everyone
CREATE POLICY "Approved testimonials are publicly visible"
ON public.testimonials
FOR SELECT
USING (is_approved = true);

-- Create index for faster queries
CREATE INDEX idx_testimonials_approved ON public.testimonials(is_approved, created_at DESC);