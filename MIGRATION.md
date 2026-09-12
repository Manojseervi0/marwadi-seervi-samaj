# MIGRATION.md — Marwadi Seervi Samaj

## Original Stack
- Create React App (react-scripts 5) + React 19
- React Router v7
- Chakra UI v2 + Emotion
- react-i18next (English/Hindi)
- Express 4 + Mongoose 8 (MongoDB), JWT auth, bcryptjs, express-validator, express-rate-limit

## New Stack
- **Frontend:** Next.js 14.2.35 (App Router) + React 18 + Tailwind CSS 3
- **Backend:** unchanged — Express + MongoDB/Mongoose (already matched the target "Node.js-compatible server-side architecture"; migrating it would have been a rewrite for no functional gain, so per the brief's own priority order — preserve functionality first, achieve target stack second — it was left as-is)
- **i18n:** react-i18next, unchanged locale files, initialized client-side

## Why the backend wasn't touched
The brief's target stack requires "MongoDB + Mongoose" and a "Node.js-compatible server-side architecture." The existing Express/Mongoose backend already satisfies both. Rewriting it into Next.js Route Handlers would have meant re-implementing rate limiting, validation, JWT, and admin middleware for no behavioral change — directly against the brief's "minimal necessary change" and priority-order rules. It runs unchanged on Render (or wherever it's hosted); only its base URL is now read from `NEXT_PUBLIC_API_URL` instead of `REACT_APP_API_URL`.

## Route Mapping (react-router-dom → Next.js App Router)
| Old Route | New Route | Protected | Notes |
|---|---|---|---|
| `/login` | `/login` | No | |
| `/signup` | `/signup` | No | |
| `/forgot-password` | `/forgot-password` | No | |
| `/` | `/` | No | |
| `/dashboard` | `/dashboard` | Yes | `(protected)` route group |
| `/home` | `/home` | Yes | Same content component as `/` |
| `/matrimony` | `/matrimony` | Yes | |
| `/career-help` | `/career-help` | Yes | |
| `/women-empowerment` | `/women-empowerment` | Yes | |
| `/temples` | `/temples` | Yes | |
| `/community-forum` | `/community-forum` | Yes | |
| `*` (catch-all) | `app/not-found.jsx` | — | Next.js convention |

`(protected)` is a route group — parentheses are invisible in the URL, so paths are identical to the original. `app/(protected)/layout.jsx` replaces `ProtectedRoute.js`: it checks the same auth-context state and redirects to `/login` if absent.

## API (unchanged — Express, verified against `server/routes/*.js`)
| Method | Path | Auth |
|---|---|---|
| POST | `/api/auth/register` | — |
| POST | `/api/auth/login` | — |
| GET | `/api/auth/me` | token |
| POST | `/api/auth/forgot-password` | — |
| POST | `/api/auth/verify-otp` | — |
| POST | `/api/auth/reset-password` | — |
| GET/POST/PUT/DELETE | `/api/users`, `/api/users/:id` | token (+admin for list) |
| GET/POST/PUT/DELETE | `/api/matrimony`, `/api/matrimony/:id` | token for write |
| POST | `/api/matrimony/search` | — |
| GET/POST/PUT/DELETE | `/api/career`, `/api/career/:id` | token for write |
| GET | `/api/career/guidance/resources`, `/api/career/networking/events` | — |
| GET/POST/PUT/DELETE | `/api/temples`, `/api/temples/:id` | token+admin for write |
| GET | `/api/temples/:id/timings` | — |

## Dependency Decisions
| Dependency | Decision | Reason |
|---|---|---|
| Chakra UI, Emotion | Removed | Replaced by Tailwind per brief |
| React Router | Removed | Next.js App Router |
| React 19 → 18 | Downgraded | Next.js 14 stable targets React 18; Next 15 would be needed for React 19 — flagged as an assumption, not a redesign |
| next@14.2.15 → 14.2.35 | Pinned to patched version | 14.2.15 has a disclosed Dec 2025 RSC DoS vulnerability (CVE-2025-67779); 14.2.35 is the patched release in the same major |
| Chakra `useToast` | Replaced with a small custom toast (`lib/toast-context.js`) | Same call signature (`toast({title, description, status, duration})`) so every call site ported unchanged — keeps the notification UX instead of dropping it |
| i18next, react-i18next, language-detector, react-icons | Kept | Framework-agnostic, work identically under Next.js |
| tailwindcss | Kept at v3 (not v4, which was an unused devDependency in the original `client/package.json`) | v3's config/PostCSS setup is the more stable, better-documented path for Next.js 14 |

## Styling Migration
Tailwind's `orange` and `gray` palettes were overridden in `tailwind.config.js` to Chakra's exact default hex values, so every `colorScheme="orange"` / `color="orange.700"` etc. renders the same color as before. Chakra's spacing scale (`px={4}`, `py={2}`, ...) is numerically identical to Tailwind's, so those values carried over 1:1. Other colors (red/blue/green/purple/yellow, used sparingly for icons and badges) use Tailwind's stock palette — visually close but not a byte-for-byte match to Chakra's.

**Known visual approximation:** Chakra's `Heading size="xl"/"2xl"/"lg"/"md"` scale doesn't map 1:1 to Tailwind's `text-*` scale (different breakpoint-based sizing under the hood). Mapped to the closest Tailwind size (`text-3xl`/`text-4xl`/`text-2xl`/`text-xl`, all `font-bold` to match Chakra's default Heading weight). Recommend a visual side-by-side check against the live original.

**Chakra `Avatar` fallback-initials behavior** was reimplemented manually (a colored circle showing the first letter) since Tailwind has no component equivalent.

## Preserved Features
Login, signup, logout, forgot-password (3-step OTP flow), protected routing, matrimony search/create/connect/shortlist, career job board + mentors + post-job, temple directory + admin add-temple + events, community forum Q&A + replies + likes, women's empowerment Q&A + articles + achievements carousel, language toggle (EN/HI), all localStorage-based auth state.

## Environment Variables
| Old (CRA) | New (Next.js) |
|---|---|
| `REACT_APP_API_URL` | `NEXT_PUBLIC_API_URL` |

Backend env vars (`PORT`, `JWT_SECRET`, `MONGODB_URI`, `CORS_ORIGIN`) are unchanged — see `server/env.example`.

**⚠️ Security note (unrelated to the migration itself):** the uploaded zip's `server/.env` contains a live MongoDB Atlas connection string with credentials and a JWT secret in plaintext. Since this file was shared, rotate both the database user's password and the JWT secret before deploying — don't reuse the values from that file.

## Remaining Risks / Not Yet Done
- **No dev-server or browser visual QA performed** — `npm run build` (production build) succeeds cleanly and all 12 routes prerender as static content, but no one has loaded the pages in a browser to compare pixel-for-pixel against the live original.
- Chakra `Modal` was reimplemented as a plain fixed-overlay `div`, not a focus-trapped/accessible dialog — no focus trap, no Escape-to-close, no ARIA roles. Functionally equivalent, accessibility is reduced versus Chakra's Modal.
- Heading size scale is an approximation (see Styling Migration above).
- `useSearchParams` (matrimony's `?search=` deep link from the homepage) built and prerendered without a Suspense boundary warning on this Next.js version, but that's worth re-checking after any Next.js upgrade.

## Running Locally
```bash
# Backend (unchanged)
cd server
npm install
cp env.example .env   # fill in JWT_SECRET, MONGODB_URI, etc.
npm run dev

# Frontend
cd web
npm install
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL
npm run dev
```

## Vercel Deployment
- Deploy the `web/` folder as the Next.js project root on Vercel (Framework Preset: Next.js — auto-detected).
- Set `NEXT_PUBLIC_API_URL` as an environment variable in the Vercel project settings, pointing at wherever `server/` is hosted (e.g. Render, unchanged from the original setup).
- No server-side secrets live in `web/` — the only env var is the public API base URL, so nothing sensitive is exposed to the client bundle.
- `next.config.js` sets `images.unoptimized: true` so the existing `/public` logo files serve exactly as they did under CRA, with no image-optimization pipeline to configure.
