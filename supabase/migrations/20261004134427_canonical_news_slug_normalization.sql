-- Keep every news slug canonical and unique for /new/:slug.
create or replace function public.normalize_news_slug()
returns trigger language plpgsql
set search_path = public, extensions, pg_catalog
as $$
declare base_slug text; candidate text; suffix integer := 2;
begin
  base_slug := lower(trim(coalesce(nullif(new.slug, ''), new.title_fr)));
  base_slug := extensions.unaccent(base_slug);
  base_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');
  base_slug := regexp_replace(base_slug, '(^-|-$)', '', 'g');
  if base_slug = '' then raise exception 'Le slug de publication ne peut pas être vide'; end if;
  candidate := base_slug;
  while exists (select 1 from public.news n where n.slug = candidate and n.id <> coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid)) loop
    candidate := base_slug || '-' || suffix; suffix := suffix + 1;
  end loop;
  new.slug := candidate; return new;
end;
$$;
drop trigger if exists trg_news_slug_normalization on public.news;
create trigger trg_news_slug_normalization before insert or update of slug, title_fr on public.news for each row execute function public.normalize_news_slug();
revoke all on function public.normalize_news_slug() from public, anon, authenticated;