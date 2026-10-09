-- Aggregated flavor-tag units across every shop for the last 14 days.
-- SECURITY DEFINER on purpose: owners only see their own sales_daily rows under RLS,
-- but the "flavor lab" needs the network-wide aggregate (never per-shop rows).
create or replace function public.network_flavor_trends()
returns table (tag text, units_last_week bigint, units_prev_week bigint)
language sql
stable
security definer
set search_path = public
as $$
  select
    t.tag,
    coalesce(sum(s.units) filter (where s.date >= current_date - 6), 0) as units_last_week,
    coalesce(sum(s.units) filter (where s.date between current_date - 13 and current_date - 7), 0) as units_prev_week
  from public.sales_daily s
  join public.menu_items m on m.id = s.item_id
  cross join lateral unnest(m.flavor_tags) as t(tag)
  where s.date >= current_date - 13
  group by t.tag;
$$;

revoke execute on function public.network_flavor_trends() from public, anon;
grant execute on function public.network_flavor_trends() to authenticated;
