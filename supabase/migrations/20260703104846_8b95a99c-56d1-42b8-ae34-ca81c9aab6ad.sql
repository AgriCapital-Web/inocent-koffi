UPDATE public.site_settings
SET setting_value = REPLACE(REPLACE(setting_value::text, 'Fondateur', 'Gérant'), 'fondateur', 'Gérant')::jsonb
WHERE setting_value::text ILIKE '%fondateur%';