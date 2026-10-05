-- Créer la table pour les demandes de partenariat
CREATE TABLE IF NOT EXISTS public.partnership_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  partnership_type TEXT NOT NULL,
  message TEXT NOT NULL,
  website TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
);

-- Enable RLS
ALTER TABLE public.partnership_requests ENABLE ROW LEVEL SECURITY;

-- Politique: Permettre à tous d'insérer des demandes de partenariat
CREATE POLICY "Anyone can submit partnership requests"
ON public.partnership_requests
FOR INSERT
WITH CHECK (true);

-- Politique: Seuls les utilisateurs authentifiés peuvent voir les demandes
CREATE POLICY "Authenticated users can view partnership requests"
ON public.partnership_requests
FOR SELECT
USING (true);