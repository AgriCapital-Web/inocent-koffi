-- Final coherence pass for the personal news system.
-- Canonical public section: /actualites. Legacy /new remains a redirect only.
-- Existing publications are preserved; only taxonomy, author defaults and one incoherent slug are normalized.

drop trigger if exists news_refresh_relations on public.news;
drop function if exists public.trg_refresh_news_relations();

alter table public.news
  alter column author set default 'Inocent KOFFI',
  alter column category set default 'Décryptage';

update public.news
set author = 'Inocent KOFFI',
    updated_at = now()
where author is null
   or trim(author) = ''
   or lower(trim(author)) = 'agricapital';

update public.news
set category = case
  when lower(trim(category)) = 'actualites' then 'Projets'
  when lower(trim(category)) = 'entreprise' then 'Entrepreneuriat'
  when lower(trim(category)) = 'technique' then 'Agriculture'
  when lower(trim(category)) = 'general' or category is null or trim(category) = '' then 'Décryptage'
  else category
end,
updated_at = now()
where lower(trim(coalesce(category, ''))) in ('actualites','entreprise','technique','general')
   or category is null
   or trim(category) = '';

create table if not exists public.news_slug_redirects (
  old_slug text primary key,
  news_id uuid not null references public.news(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.news_slug_redirects enable row level security;

drop policy if exists "Public can read news slug redirects" on public.news_slug_redirects;
create policy "Public can read news slug redirects"
on public.news_slug_redirects
for select to anon, authenticated
using (true);

update public.news
set slug = 'agricapital-ouvre-bureau-proximite-gonate',
    updated_at = now()
where slug = 'inauguration-bureau-proximite-gonate-dalora';

insert into public.news_slug_redirects(old_slug, news_id)
select 'inauguration-bureau-proximite-gonate-dalora', id
from public.news
where slug = 'agricapital-ouvre-bureau-proximite-gonate'
on conflict (old_slug) do update set news_id = excluded.news_id;

delete from public.news_relations;

do $$
declare r record;
begin
  for r in select id from public.news where is_published = true loop
    perform public.refresh_news_relations(r.id);
  end loop;
end $$;
