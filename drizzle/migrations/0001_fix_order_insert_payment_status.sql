DROP POLICY IF EXISTS "Anyone can create an order" ON public.service_orders;
CREATE POLICY "Anyone can create an order" ON public.service_orders FOR INSERT TO anon, authenticated
WITH CHECK ((user_id IS NULL OR user_id = auth.uid())
  AND payment_status = 'en_attente' AND status = 'nouvelle' AND internal_notes IS NULL
  AND amount >= 0 AND length(customer_name) BETWEEN 1 AND 120
  AND length(customer_email) BETWEEN 3 AND 255 AND length(service_title) BETWEEN 1 AND 200
  AND (message IS NULL OR length(message) <= 5000));