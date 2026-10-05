-- Automatic editorial relations for public.news.
create table if not exists public.news_relations (
  news_id uuid not null references public.news(id) on delete cascade,
  related_news_id uuid not null references public.news(id) on delete cascade,
  relevance numeric(8,5) not null default 0,
  relation_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (news_id, related_news_id),
  constraint news_relations_distinct check (news_id <> related_news_id)
);
create index if not exists idx_news_relations_related_news_id on public.news_relations (related_news_id);
create index if not exists idx_news_relations_relevance on public.news_relations (news_id, relevance desc);
alter table public.news_relations enable row level security;
drop policy if exists "Public can read published news relations" on public.news_relations;
create policy "Public can read published news relations" on public.news_relations for select to anon, authenticated
using (
  exists (select 1 from public.news n where n.id = news_relations.news_id and n.is_published = true)
  and exists (select 1 from public.news n where n.id = news_relations.related_news_id and n.is_published = true)
);
create or replace function public.refresh_news_relations(p_news_id uuid)
returns void language plpgsql security definer
set search_path = public, extensions, pg_catalog
as $$
declare candidate record;
begin
  if p_news_id is null then return; end if;
  delete from public.news_relations where news_id = p_news_id or related_news_id = p_news_id;
  if not exists (select 1 from public.news where id = p_news_id and is_published = true) then return; end if;
  for candidate in
    select * from public.find_related_news(p_news_id, null, null, null, null, 4)
    where relevance >= 0.12 order by relevance desc, published_at desc nulls last limit 4
  loop
    insert into public.news_relations (news_id, related_news_id, relevance, relation_reason)
    values (p_news_id, candidate.id, candidate.relevance, candidate.relation_reason)
    on conflict (news_id, related_news_id) do update set relevance = excluded.relevance, relation_reason = excluded.relation_reason, updated_at = now();
    insert into public.news_relations (news_id, related_news_id, relevance, relation_reason)
    values (candidate.id, p_news_id, candidate.relevance, candidate.relation_reason)
    on conflict (news_id, related_news_id) do update set relevance = excluded.relevance, relation_reason = excluded.relation_reason, updated_at = now();
  end loop;
end;
$$;
revoke all on function public.refresh_news_relations(uuid) from public, anon, authenticated;
create or replace function public.handle_news_relations()
returns trigger language plpgsql security definer
set search_path = public, extensions, pg_catalog
as $$
begin perform public.refresh_news_relations(new.id); return new; end;
$$;
revoke all on function public.handle_news_relations() from public, anon, authenticated;
drop trigger if exists trg_news_relations_sync on public.news;
create trigger trg_news_relations_sync after insert or update of title_fr, excerpt_fr, content_fr, category, is_published on public.news for each row execute function public.handle_news_relations();
update public.news set category = case when lower(trim(category)) = 'actualites' then 'Projets' when lower(trim(category)) = 'entreprise' then 'Entrepreneuriat' when lower(trim(category)) = 'technique' then 'Agriculture' else category end where lower(trim(category)) in ('actualites','entreprise','technique');
do $$ declare r record; begin for r in select id from public.news loop perform public.refresh_news_relations(r.id); end loop; end $$;
do $$ begin if exists (select 1 from public.news where slug is null or slug = '' or slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$') then raise exception 'Existing news slugs are not all canonical'; end if; end $$;