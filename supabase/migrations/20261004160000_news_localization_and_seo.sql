-- Multilingual editorial fields and SEO metadata for public.news.
alter table public.news
  add column if not exists title_bci text,
  add column if not exists title_dyu text,
  add column if not exists content_bci text,
  add column if not exists content_dyu text,
  add column if not exists excerpt_bci text,
  add column if not exists excerpt_dyu text,
  add column if not exists meta_title text,
  add column if not exists meta_description text,
  add column if not exists focus_keyword text,
  add column if not exists hashtags jsonb not null default '[]'::jsonb,
  add column if not exists editorial_format text,
  add column if not exists editorial_angle text,
  add column if not exists source_urls jsonb not null default '[]'::jsonb;
