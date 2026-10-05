-- Create contact messages table
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert contact messages (public form)
CREATE POLICY "Anyone can submit contact messages" 
ON public.contact_messages 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Only authenticated users can view messages (for future admin panel)
CREATE POLICY "Authenticated users can view contact messages" 
ON public.contact_messages 
FOR SELECT 
TO authenticated
USING (true);