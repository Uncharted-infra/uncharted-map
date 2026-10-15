-- Baby steps: keep only auth.users -> public.profiles. Drop the owner-platform tables, view, and RPCs from 0001/0002.
drop view if exists public.unclaimed_shops;
drop function if exists public.network_flavor_trends();
drop function if exists public.claim_shop(uuid);
drop function if exists public.create_shop(text, text, text);
drop table if exists public.sales_daily cascade;
drop table if exists public.order_items cascade;
drop table if exists public.orders cascade;
drop table if exists public.inventory cascade;
drop table if exists public.menu_items cascade;
drop table if exists public.shop_members cascade;
drop table if exists public.shops cascade;
drop function if exists public.is_shop_member(uuid);
