# AGENTS.md — uncharted-map (owner dashboard + auth)

**map.uncharted.sh** — the shop-owner app for Uncharted. Auth, onboarding, and the insights dashboard that is the product's v1 wedge: **turn a shop's sales data into comprehension** — best sellers, slow days, reorder needs, and what flavors to invent next.

Stack: Next.js 16 (App Router) + React 19 + Tailwind v4 + TypeScript strict + Supabase (`@supabase/ssr`). pnpm. Dev on **:3001**.

## Product intent

The owner should feel like they gained a business brain, not another admin panel:

- `/login` `/signup` — Supabase auth (magic link recommended; Google OAuth optional).
- `/onboarding` — claim or create a shop.
- `/dashboard` — today snapshot: sales, top item, orders, week sparkline.
- `/dashboard/orders` — order queue with status transitions.
- `/dashboard/menu` — menu items, availability toggles.
- `/dashboard/inventory` — stock levels, low-stock flags, reorder suggestions from sales velocity.
- `/dashboard/insights` — **the wedge**: best sellers, daypart heatmap, flavor-trend scores, "flavor lab" suggestions.
- `/dashboard/settings` — shop profile, hours, payout (Phase 6).

**This app owns all secrets.** Supabase keys, auth cookie domain (`.uncharted.sh`), Stripe keys later. Nothing sensitive belongs on the site app.

## Data layer

Same contract as the site: `src/lib/data/` provider interface. `MockProvider` serves seeded Alpharetta data (90 days of `sales_daily` etc.); `SupabaseProvider` swaps in Phase 4 behind an env flag. Dashboard pages must work fully on mock data.

## Design rules

- Design source of truth: [`../docs/design-system.md`](../docs/design-system.md). Tokens duplicated in `src/app/globals.css` — keep in sync with the site app's copy.
- The dashboard is data-dense but stays playful: neobrutalist — white cards with 2px black borders and hard 4px shadows on a sand canvas, red main + blue accent for series/status, mono font for numbers/labels, no generic SaaS gray.
- Charts: Recharts. Keep charts flat and legible — no gradients-as-decoration. Flat fills only; black outlines on bars.

## Engineering rules

- Simplicity first; minimal diff; root causes, not patches.
- TypeScript strict, zod at data boundaries.
- `pnpm lint` + `pnpm build` must pass before calling work done.
- Run `pnpm dev` on :3001 and verify in the browser.
- RLS: owner rows scoped via `shop_members`; never query with the service key from the client.
- No commits/pushes unless the user asks (see root `../AGENTS.md`).
