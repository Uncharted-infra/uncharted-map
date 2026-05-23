# Auth Implementation Instructions

Use this when building auth for the landing site (uncharted.sh) and app (map.uncharted.sh).

**Database:** One Supabase project (`pbuwfdpakmggfsetaztq`) — auth, profiles, and future trip/booking tables. No separate site project.

---

## Part 1: Landing Site (uncharted.sh)

Signup/login UI on `/signup` and `/login`. After auth, redirect to **map.uncharted.sh**. Same Supabase project as the map app.

---

## Part 2: Supabase Setup (do first)

**Project** — `pbuwfdpakmggfsetaztq` (single project for auth + product data).

**Google SSO** — In Google Cloud Console: create OAuth client, set redirect URI to your Supabase auth callback URL, add uncharted.sh and map.uncharted.sh as authorized origins. Copy Client ID and Secret into Supabase Dashboard → Auth → Providers → Google.

**Redirect URLs** — In Supabase Auth → URL Configuration, add:

- `https://uncharted.sh/auth/callback`
- `https://map.uncharted.sh/auth/callback`
- localhost callbacks for dev

**Phone** — Auth → Providers → Phone + SMS provider.

See **[../../docs/auth-setup.md](../../docs/auth-setup.md)** for the full checklist.

---

## Part 3: Database (same Supabase project)

**profiles** — Table with id (auth.users), email, display_name, avatar_url, preferences (JSONB), onboarding_completed_at, onboarding_step. Enable RLS so users only access their own row.

**account_security** — Table with user_id, mfa_required, mfa_verified_at. RLS same. Trigger on auth.users insert: create profile row and account_security row for each new user.

**preferences** — Store travel fields, personality, notifications. Same shape as TRAVEL_FIELDS, PERSONALITY_OPTIONS, NOTIFICATION_ITEMS in src/data/settings.ts.

---

## Part 4: App Implementation

**uncharted-site** — Auth UI, OAuth callback, redirects to map.

**uncharted-map** — Middleware auth gate, shared session cookies, optional `/auth/callback`.

Both use identical `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---

## Flow Summary

Landing sign-up → session on `.uncharted.sh` → map.uncharted.sh (same Supabase user) → MFA (if required) → onboarding (if first time) → main app.
