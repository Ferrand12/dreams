# Claude Operating Manual

Before performing any task:

1. Read `/ai/BRAND.md` — **brand manual (law)**. All design, copy, and implementation decisions must comply.
2. Read `/ai/SYSTEM.md` — coding standards, role definition, principles
3. Read `/ai/WORKFLOW.md` — shipping discipline, multi-session continuity, definition of done

Then pick your role:

- **Building features?** Follow `/ai/BUILDER.md` — analyze, plan, implement, validate, minimal diffs
- **Debugging errors?** Follow `/ai/DEBUGGER.md` — reproduce, isolate, root-cause, smallest fix
- **Touching UI?** Also follow `/ai/UI_UX.md` — spacing, typography, motion, responsive, accessibility

This repo is **Next.js App Router + TypeScript + Tailwind CSS**. Bilingual (EN/ES) via `next-intl`. Deployed on Vercel.

All generated code must comply with this system.

---

# CLAUDE.md - Dreeeams

## Project Overview

Next.js 15 marketing & sales site for **Dreeeams** (modular technical partner / product studio).
Bilingual (EN/ES) via `next-intl`. Deployed on Vercel. Assets served from Supabase CDN.

**Tech stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, next-intl, Cal.com embed, Upstash Redis, Resend, Twenty CRM.

---

## Current Branch: `feat/ui-preview-edits`

Premium sales flow: **Fit Check -> Inline Cal.com Booking -> Thank-You Page**

### What's been built (not yet merged)

- Cal.com config centralized in `lib/constants.ts` (`CAL_EVENT_LINK`)
- `calendar-embed.tsx` upgraded: `successRedirectUrl`, `name`/`email` prefill
- `/[locale]/start` route: 3-step fit-check + inline booking
- `/[locale]/thank-you` page: post-booking confirmation
- `/[locale]/contact-form` now redirects to `/start`
- All site CTAs route to `/start`
- `.env.local` created for local development
- `NEXT_PUBLIC_CDN_URL` fixed to prevent `next/image` crash
- `next.config.ts`: Supabase hostname added as static `remotePatterns` entry (dynamic env parsing fails because Next.js loads `.env.local` after config evaluation)
- `next.config.ts`: `images.qualities` configured `[75, 80, 85]` for Next.js 16 compliance
- CDN image URLs centralized via `cdnAssetUrl()` helper in `lib/constants.ts`
- Defensive fallbacks in `hero-section.tsx`, `services-section.tsx`, `project-card.tsx`

---

## Booking System Architecture

### Cal.com Embed (`components/contact/calendar-embed.tsx`)

- Loads Cal.com embed script via `IntersectionObserver` (lazy, 100px rootMargin)
- Uses namespaced Cal instance (`Cal.ns.booking`)
- Config sourced from `CAL_EVENT_LINK` constant (env-overridable)
- Supports: `successRedirectUrl`, `name`, `email` prefill via props
- Theme: light `#1E1E1E`, dark `#DEE5ED`
- Container: `#my-cal-inline`, cleared on re-init

### Constants (`lib/constants.ts`)

```
CAL_EVENT_LINK = process.env.NEXT_PUBLIC_CAL_EVENT_LINK || 'luis-fernandez-ezzzmp/30min'
cdnAssetUrl(path) → full Supabase CDN URL or '' if env not set
```

---

## Sales Flow Architecture

### Route: `/[locale]/start`

**Page:** `app/[locale]/start/page.tsx` (server component, SEO metadata)
**Flow:** `app/[locale]/start/start-flow.tsx` (client component)

#### Steps

| Step | Component State | Purpose |
|------|----------------|---------|
| 1. Service | `service` | What they need (web, backend, ai, branding, other) |
| 2. Budget | `budget` | Budget range filter |
| 3. Timeline | `timeline` | Launch timing (asap, soon, planned, flexible) |
| 4. Booking | `booking` | Inline Cal.com embed (fit leads only) |
| N/A | `not-fit` | Polite exit + email capture (budget too low) |

#### Budget Qualification Logic

- **Disqualified:** `under` option only (< $2,000 USD / < $2,500,000 COP)
- **Qualified:** `low`, `mid`, `high`, `premium` -> proceed to timeline then booking
- On disqualification: shows `not-fit` screen with email capture form

#### Localized Budget Thresholds

- **EN:** Under $2,000 USD | $2K-$5K | $5K-$15K | $15K-$30K | $30K+
- **ES:** Menos de $2.500.000 COP | $2.5M-$5M | $5M-$15M | $15M-$30M | $30M+

#### Post-Booking Redirect

```
successRedirectUrl = ${window.location.origin}/${locale}/thank-you
```

### Route: `/[locale]/thank-you`

Post-booking confirmation page. Shows success icon, message, "What's Next" steps, and back-to-home CTA. Translations via `thankYou` namespace.

### Route: `/[locale]/contact-form`

Redirects to `/[locale]/start` (server-side via `next/navigation` redirect).

### CTA Routing

All site CTAs now point to `/start`:
- `navigation.tsx` (desktop + mobile)
- `desktop-nav.tsx`
- `footer-section.tsx`
- `contact-section.tsx`
- `manifesto-section.tsx`

### i18n Messages

- `messages/pages/start/en.json` - English copy
- `messages/pages/start/es.json` - Spanish copy
- Translation namespace: `start`

---

## Environment Variables

### Required

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Base URL (prod: `https://dreeeams.com`) |
| `NEXT_PUBLIC_CDN_URL` | Supabase CDN for images. Used by `cdnAssetUrl()` at runtime. The hostname is statically allowlisted in `next.config.ts` `remotePatterns`. Without this env var, images gracefully degrade (empty fallback). |
| `NEXT_PUBLIC_CAL_EVENT_LINK` | Cal.com event slug (e.g. `luis-fernandez-ezzzmp/kickoff`) |
| `TWENTY_API_KEY` | Twenty CRM API key |
| `TWENTY_API_URL` | Twenty CRM endpoint |
| `RESEND_API_KEY` | Resend email service |
| `RESEND_FROM_EMAIL` | Sender email |
| `ADMIN_EMAIL` | Admin notification email |
| `UPSTASH_REDIS_REST_URL` | Rate limiting (prod only, in-memory fallback in dev) |
| `UPSTASH_REDIS_REST_TOKEN` | Rate limiting token |

### Optional

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | Google Ads conversion tracking |
| `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL` | Conversion label |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry error tracking |

---

## CDN Image Architecture

**`next.config.ts` — static hostname allowlist (not dynamic)**
Next.js evaluates `next.config.ts` BEFORE loading `.env.local`, so `process.env.NEXT_PUBLIC_CDN_URL` is always `undefined` at config time. The Supabase hostname is hardcoded in `remotePatterns` with a scoped `pathname: '/storage/v1/object/public/**'`. Do NOT replace this with dynamic env parsing — it will silently fail.

**`lib/constants.ts` — `cdnAssetUrl()` helper**
All CDN images route through `cdnAssetUrl(path)`:
- Returns `''` if `NEXT_PUBLIC_CDN_URL` is unset (graceful fallback, no crash)
- Builds the full Supabase storage path: `${CDN_URL}/storage/v1/object/public/content/${path}`
- Components guard with `{src && <Image src={src} />}` — never pass empty/undefined to `next/image`

---

## Guardrails - DO NOT TOUCH

- **`middleware.ts`** - Do not modify. Handles locale routing and security headers.
- **`next.config.ts` CSP** - Do not modify unless absolutely necessary.
- **`next.config.ts` `remotePatterns`** - Supabase hostname MUST be static. Do not replace with dynamic `process.env` extraction — it evaluates before `.env.local` is loaded.
- **API routes (`app/api/`)** - Do not touch. Contact form, health check, and CRM integration are stable.
- **CRM integration** - Twenty CRM wiring is production-stable.
- **Rate limiting** - Upstash Redis setup is production-stable.

---

## Current Priorities

1. **Improve conversion copy** - Sharpen headings, CTAs, and microcopy across the fit-check flow
2. **Optimize fit-check UX** - Animations, mobile experience, progress indicators
3. **Improve thank-you page** - Add social proof, next-step clarity, share CTAs
4. **Add analytics events** - Track fit-check step completions, booking conversions, not-fit exits, email captures

---

## Key File Paths

```
app/[locale]/start/page.tsx          # Start page (server)
app/[locale]/start/start-flow.tsx    # Fit-check flow (client)
app/[locale]/thank-you/page.tsx      # Thank-you page
app/[locale]/contact-form/page.tsx   # Redirect to /start
components/contact/calendar-embed.tsx # Cal.com inline embed
lib/constants.ts                     # Centralized constants
messages/pages/start/en.json         # EN copy
messages/pages/start/es.json         # ES copy
.env.example                         # Env var template
```
