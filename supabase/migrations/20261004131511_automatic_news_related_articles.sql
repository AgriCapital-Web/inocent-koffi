create extension if not exists pg_trgm with schema extensions;

create index if not exists news_title_fr_trgm_idx
  on public.news using gin (title_fr extensions.gin_trgm_ops);

create or replace function public.find_related_news(
  p_news_id uuid default null,
  p_title text default null,
  p_excerpt text default null,
  p_content text default null,
  p_category text default null,
  p_limit integer default 4
)
returns table (
  id uuid,
  slug text,
  title_fr text,
  excerpt_fr text,
  category text,
  featured_image text,
  images jsonb,
  published_at timestamptz,
  relevance numeric,
  relation_reason text
)
language sql
stable
security invoker
set search_path = public, extensions, pg_catalog
as $$
  with source as (
    select
      coalesce(nullif(trim(p_title), ''), n.title_fr) as title,
      coalesce(nullif(trim(p_excerpt), ''), n.excerpt_fr, '') as excerpt,
      coalesce(nullif(trim(p_content), ''), n.content_fr, '') as content,
      coalesce(nullif(trim(p_category), ''), n.category, '') as category
    from public.news n
    where p_news_id is not null
      and n.id = p_news_id
    union all
    select
      coalesce(trim(p_title), ''),
      coalesce(trim(p_excerpt), ''),
      coalesce(trim(p_content), ''),
      coalesce(trim(p_category), '')
    where p_news_id is null
  ),
  normalized as (
    select
      title,
      excerpt,
      regexp_replace(content, '<[^>]+>', ' ', 'g') as content,
      category,
      websearch_to_tsquery(
        'french',
        left(trim(title || ' ' || excerpt || ' ' || regexp_replace(content, '<[^>]+>', ' ', 'g')), 1800)
      ) as query
    from source
    limit 1
  ),
  scored as (
    select
      n.id,
      n.slug,
      n.title_fr,
      n.excerpt_fr,
      n.category,
      n.featured_image,
      n.images,
      n.published_at,
      greatest(
        0,
        least(
          1,
          (case
            when nullif(lower(s.category), '') is not null
             and lower(n.category) = lower(s.category)
            then 0.28 else 0
           end)
          +
          least(
            0.42,
            ts_rank_cd(
              setweight(to_tsvector('french', coalesce(n.title_fr, '')), 'A') ||
              setweight(to_tsvector('french', coalesce(n.excerpt_fr, '')), 'B') ||
              setweight(to_tsvector('french', left(regexp_replace(coalesce(n.content_fr, ''), '<[^>]+>', ' ', 'g'), 8000)), 'C'),
              s.query,
              32
            ) * 0.42
          )
          +
          greatest(
            extensions.similarity(lower(coalesce(n.title_fr, '')), lower(coalesce(s.title, ''))) * 0.20,
            extensions.word_similarity(lower(coalesce(s.title, '')), lower(coalesce(n.title_fr, ''))) * 0.20
          )
          +
          greatest(
            extensions.word_similarity(lower(coalesce(s.title || ' ' || s.excerpt, '')), lower(coalesce(n.title_fr || ' ' || n.excerpt_fr, ''))) * 0.10,
            0
          )
        )
      )::numeric(8,5) as relevance
    from public.news n
    cross join normalized s
    where n.is_published = true
      and (p_news_id is null or n.id <> p_news_id)
  )
  select
    id, slug, title_fr, excerpt_fr, category, featured_image, images, published_at,
    relevance,
    case
      when lower(category) = lower((select category from normalized))
       and relevance >= 0.45 then 'Même rubrique et proximité éditoriale'
      when relevance >= 0.45 then 'Forte proximité éditoriale'
      when lower(category) = lower((select category from normalized)) then 'Même rubrique'
      else 'Proximité de sujet'
    end as relation_reason
  from scored
  where relevance >= 0.08
  order by relevance desc, published_at desc nulls last
  limit greatest(1, least(coalesce(p_limit, 4), 8));
$$;

revoke all on function public.find_related_news(uuid,text,text,text,text,integer) from public;
grant execute on function public.find_related_news(uuid,text,text,text,text,integer) to anon, authenticated;
