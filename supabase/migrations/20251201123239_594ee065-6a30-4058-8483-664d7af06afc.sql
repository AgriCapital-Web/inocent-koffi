-- Modifier la politique RLS pour afficher tous les témoignages sans nécessité d'approbation
DROP POLICY IF EXISTS "Approved testimonials are publicly visible" ON testimonials;

-- Nouvelle politique : tous les témoignages sont visibles publiquement
CREATE POLICY "All testimonials are publicly visible"
ON testimonials
FOR SELECT
USING (true);