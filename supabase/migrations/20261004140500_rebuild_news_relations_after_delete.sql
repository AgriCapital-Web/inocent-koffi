create or replace function public.handle_news_relations()
returns trigger
language plpgsql
security definer
set search_path = public, extensions, pg_catalog
as $$
declare
  candidate record;
begin
  if tg_op = 'DELETE' then
    -- A deleted article can leave the remaining articles with fewer links.
    -- Rebuild the small editorial relation graph so every surviving article
    -- immediately receives the best available associations again.
    for candidate in
      select id from public.news where is_published = true
    loop
      perform public.refresh_news_relations(candidate.id);
    end loop;
    return old;
  end if;

  perform public.refresh_news_relations(new.id);
  return new;
end;
$$;

revoke all on function public.handle_news_relations() from public, anon, authenticated;

drop trigger if exists trg_news_relations_sync on public.news;
create trigger trg_news_relations_sync
after insert or update of title_fr, excerpt_fr, content_fr, category, is_published, published_at or delete
on public.news
for each row
execute function public.handle_news_relations();