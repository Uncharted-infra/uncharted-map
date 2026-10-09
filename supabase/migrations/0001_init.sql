-- Uncharted — owner platform schema (Phase 4).
-- Applied to project yomiiwhwkconblcxweyj via MCP; kept here as the source of truth.

create table public.shops (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  categories text[] not null default '{}',
  story text not null default '',
  phone text not null default '',
  address text not null default '',
  city text not null default '',
  state text not null default '',
  lat double precision not null default 0,
  lng double precision not null default 0,
  hours jsonb not null default '{}'::jsonb,
  photo text,
  status text not null default 'active' check (status in ('active', 'pending', 'paused')),
  created_at timestamptz not null default now()
);

create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  name text not null,
  description text not null default '',
  price_cents integer not null check (price_cents >= 0),
  category text not null check (category in ('cakes', 'cookies', 'ice_cream', 'pastry', 'candy')),
  flavor_tags text[] not null default '{}',
  photo text,
  available boolean not null default true,
  bestseller boolean not null default false,
  sort integer not null default 0
);
create index menu_items_shop_idx on public.menu_items(shop_id);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  customer_email text not null default '',
  customer_name text not null default '',
  status text not null default 'placed' check (status in ('placed', 'accepted', 'ready', 'completed', 'cancelled')),
  fulfillment text not null default 'pickup' check (fulfillment in ('pickup')),
  total_cents integer not null default 0,
  placed_at timestamptz not null default now()
);
create index orders_shop_placed_idx on public.orders(shop_id, placed_at desc);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  item_id uuid references public.menu_items(id) on delete set null,
  name text not null,
  qty integer not null check (qty > 0),
  unit_price_cents integer not null,
  options jsonb not null default '{}'::jsonb
);
create index order_items_order_idx on public.order_items(order_id);

create table public.sales_daily (
  shop_id uuid not null references public.shops(id) on delete cascade,
  date date not null,
  item_id uuid not null references public.menu_items(id) on delete cascade,
  units integer not null default 0,
  revenue_cents integer not null default 0,
  primary key (shop_id, date, item_id)
);
create index sales_daily_date_idx on public.sales_daily(date);

create table public.inventory (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  sku text not null,
  label text not null,
  unit text not null,
  qty numeric not null default 0,
  reorder_point numeric not null default 0,
  supplier text not null default '',
  unique (shop_id, sku)
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('consumer', 'owner')),
  name text,
  email text,
  created_at timestamptz not null default now()
);

create table public.shop_members (
  shop_id uuid not null references public.shops(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'staff')),
  created_at timestamptz not null default now(),
  primary key (shop_id, profile_id)
);
create index shop_members_profile_idx on public.shop_members(profile_id);

-- Auto-create a profile for every new auth user.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Membership check used by every owner-scoped policy. SECURITY DEFINER so it can
-- read shop_members without recursing into that table's own RLS policy.
create or replace function public.is_shop_member(p_shop_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.shop_members
    where shop_id = p_shop_id and profile_id = auth.uid()
  );
$$;

-- Onboarding: create a shop and make the caller its owner in one step.
create or replace function public.create_shop(p_name text, p_address text, p_phone text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_slug text;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  v_slug := regexp_replace(lower(trim(p_name)), '[^a-z0-9]+', '-', 'g');
  v_slug := trim(both '-' from v_slug) || '-' || substr(gen_random_uuid()::text, 1, 6);
  insert into public.shops (slug, name, address, phone, status)
  values (v_slug, trim(p_name), coalesce(p_address, ''), coalesce(p_phone, ''), 'pending')
  returning id into v_id;
  insert into public.shop_members (shop_id, profile_id, role) values (v_id, auth.uid(), 'owner');
  return v_id;
end;
$$;

-- Onboarding: claim a seeded shop that nobody owns yet.
create or replace function public.claim_shop(p_shop_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  if exists (select 1 from public.shop_members where shop_id = p_shop_id) then
    raise exception 'shop already claimed';
  end if;
  insert into public.shop_members (shop_id, profile_id, role) values (p_shop_id, auth.uid(), 'owner');
end;
$$;

-- Shops with no owner yet; what onboarding lists as claimable.
create or replace view public.unclaimed_shops
with (security_invoker = true) as
  select s.id, s.slug, s.name, s.categories, s.address, s.city, s.state
  from public.shops s
  where not exists (select 1 from public.shop_members m where m.shop_id = s.id);

-- RLS -----------------------------------------------------------------------

alter table public.shops enable row level security;
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.sales_daily enable row level security;
alter table public.inventory enable row level security;
alter table public.profiles enable row level security;
alter table public.shop_members enable row level security;

-- Public browse (marketplace is open); writes are member-only.
create policy "shops are publicly readable" on public.shops for select using (true);
create policy "members update their shop" on public.shops for update
  using (public.is_shop_member(id)) with check (public.is_shop_member(id));

create policy "menu items are publicly readable" on public.menu_items for select using (true);
create policy "members manage menu items" on public.menu_items for all
  using (public.is_shop_member(shop_id)) with check (public.is_shop_member(shop_id));

-- Orders: guest insert (Phase 5 checkout), member read/update.
create policy "anyone can place an order" on public.orders for insert with check (true);
create policy "members read their orders" on public.orders for select using (public.is_shop_member(shop_id));
create policy "members update their orders" on public.orders for update
  using (public.is_shop_member(shop_id)) with check (public.is_shop_member(shop_id));

create policy "anyone can add order items" on public.order_items for insert with check (true);
create policy "members read their order items" on public.order_items for select
  using (exists (select 1 from public.orders o where o.id = order_id and public.is_shop_member(o.shop_id)));

create policy "members read their sales" on public.sales_daily for select using (public.is_shop_member(shop_id));
create policy "members manage their sales" on public.sales_daily for all
  using (public.is_shop_member(shop_id)) with check (public.is_shop_member(shop_id));

create policy "members manage their inventory" on public.inventory for all
  using (public.is_shop_member(shop_id)) with check (public.is_shop_member(shop_id));

create policy "users read own profile" on public.profiles for select using (id = auth.uid());
create policy "users update own profile" on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid());

create policy "members see their memberships" on public.shop_members for select using (profile_id = auth.uid());

-- Function grants: RPCs for signed-in users only; trigger + helper never via REST.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.is_shop_member(uuid) from public, anon;
revoke execute on function public.create_shop(text, text, text) from public, anon;
revoke execute on function public.claim_shop(uuid) from public, anon;
grant execute on function public.is_shop_member(uuid) to authenticated;
grant execute on function public.create_shop(text, text, text) to authenticated;
grant execute on function public.claim_shop(uuid) to authenticated;
