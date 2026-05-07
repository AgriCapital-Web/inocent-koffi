
CREATE TABLE IF NOT EXISTS public.og_audit_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  summary jsonb NOT NULL DEFAULT '{}'::jsonb,
  results jsonb NOT NULL DEFAULT '[]'::jsonb,
  total int NOT NULL DEFAULT 0,
  with_issues int NOT NULL DEFAULT 0,
  source text NOT NULL DEFAULT 'manual'
);

CREATE INDEX IF NOT EXISTS idx_og_audit_history_created_at
  ON public.og_audit_history (created_at DESC);

ALTER TABLE public.og_audit_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read audit history"
ON public.og_audit_history
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete audit history"
ON public.og_audit_history
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Service role can insert audit history"
ON public.og_audit_history
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
