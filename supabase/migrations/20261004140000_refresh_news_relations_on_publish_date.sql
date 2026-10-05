drop trigger if exists trg_news_relations_sync on public.news;
create trigger trg_news_relations_sync
after insert or update of title_fr, excerpt_fr, content_fr, category, is_published, published_at
on public.news
for each row
execute function public.handle_news_relations();