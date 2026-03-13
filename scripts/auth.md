# Auth Implementation Instructions

Use this when building auth for the landing site (uncharted.sh) and app (uncharted-map).

---

## Part 1: Landing Site (uncharted.sh)

**Sign-up button** — Link or redirect to app.uncharted.sh/auth/signin. No API calls, no POST. User leaves the landing page and lands on the app’s sign-in page.

---

## Part 2: Supabase Setup (do first)

**Project** — Create Supabase project if needed.

**Google SSO** — In Google Cloud Console: create OAuth client, set redirect URI to your Supabase auth callback URL, add uncharted.sh and app.uncharted.sh as authorized origins. Copy Client ID and Secret into Supabase Dashboard → Auth → Providers → Google.

**Azure SSO** — In Microsoft Entra ID: register app, set redirect URI to same Supabase callback. Copy Client ID and Secret into Supabase Dashboard → Auth → Providers → Azure.

**Redirect URLs** — In Supabase Auth → URL Configuration, add app.uncharted.sh/auth/callback and uncharted.sh/*.

**Email OTP template** — In Auth → Email Templates, ensure the OTP template includes the Token placeholder so users receive a 6-digit code.

---

## Part 3: Database (uncharted-map)

**profiles** — Table with id (auth.users), email, display_name, avatar_url, preferences (JSONB), onboarding_completed_at, onboarding_step. Enable RLS so users only access their own row.

**account_security** — Table with user_id, mfa_required, mfa_verified_at. RLS same. Trigger on auth.users insert: create profile row and account_security row for each new user.

**preferences** — Store travel fields, personality, notifications. Same shape as TRAVEL_FIELDS, PERSONALITY_OPTIONS, NOTIFICATION_ITEMS in src/data/settings.ts.

---

## Part 4: App Implementation (uncharted-map)

**1. Dependencies** — Add @supabase/supabase-js and @supabase/ssr.

**2. Env** — Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.

**3. Supabase client** — Browser client for client components. Server client with cookies for server routes and middleware.

**4. Auth callback route** — Handle OAuth redirect. Exchange code for session, set cookies, redirect to app or MFA.

**5. Sign-in page** — Buttons for Google and Microsoft. Call signInWithOAuth with redirectTo pointing at auth/callback.

**6. MFA page** — If account_security.mfa_required is true after sign-in, show modal. Send OTP to user email, user enters code, verify, then set mfa_required false and continue.

**7. Onboarding page** — Multi-step flow. Collect travel preferences, personality, etc. Write to profiles.preferences. Set onboarding_completed_at when done. Redirect to main app.

**8. Auth gate** — Middleware or layout: if no session, redirect to auth/signin.

**9. MFA gate** — After auth: if mfa_required, redirect to auth/mfa before showing app.

**10. Onboarding gate** — If onboarding_completed_at is null, redirect to onboarding before main app.

**11. Settings modal** — On open, load profile and preferences. On save, update profiles.preferences.

---

## Flow Summary

Landing sign-up → app sign-in (SSO) → callback → MFA (if required) → onboarding (if first time) → main app.
