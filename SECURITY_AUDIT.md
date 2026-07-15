# Marco's Water Solutions Security Audit

## Audit Scope

Canonical production URL: `https://marcos-chi.vercel.app/`

Branch for this work: `security/strict-csp-hardening`

This audit was prepared before strict CSP enforcement changes, then updated after local verification. It focuses on the Next.js/Vercel website response headers, CSP requirements, inline script/style usage, external origins, cookies, and SRI suitability.

## Project Detection

| Item | Finding |
|---|---|
| Framework | Next.js `14.2.35` |
| Routing | App Router under `app/` |
| Package manager | npm with `package-lock.json` |
| Build command | `prisma generate && next build` via `npm run build` |
| Start command | `next start` via `npm run start` |
| Vercel config | No root `vercel.json`; local `.vercel/project.json` links to Vercel project `marcos` |
| Next config | `next.config.mjs` |
| Middleware | `middleware.ts` protects `/admin` and `/api/admin` |

## Original Security Header State

Before the strict-hardening branch, headers were configured in `next.config.mjs`:

- `Content-Security-Policy`
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`
- Vercel also provided `Strict-Transport-Security`

Original enforced CSP:

```text
default-src 'self'; base-uri 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https://api.web3forms.com https://api.resend.com; media-src 'self' blob: data:; frame-src 'self' https://www.google.com https://maps.google.com; frame-ancestors 'self'; form-action 'self'; object-src 'none'; worker-src 'self' blob:
```

## Inline Script Audit

Repository search found one application-owned inline script:

| File | Inline script | Purpose |
|---|---|---|
| `app/page.tsx` | `<script type="application/ld+json" dangerouslySetInnerHTML=...>` | LocalBusiness JSON-LD structured data |

No inline string event handlers such as `onclick=`, `onload=`, or `onerror=` were found in source. React event handlers such as `onClick` and `onSubmit` are framework-bound listeners, not HTML inline event attributes.

No `eval`, `new Function`, string timer callbacks, `javascript:` URLs, service workers, Web Workers, or dynamically constructed script tags were found in application source.

## Inline Style Audit

Repository search found no application-authored `<style>` blocks and no React `style={{ ... }}` props.

Rendered production HTML before strict hardening did include inline `style=""` attributes from:

- `next/image` output, such as `position:absolute;height:100%;width:100%;left:0;top:0;right:0;bottom:0;color:transparent`
- Framer Motion SSR output, such as `opacity` and `transform` animation state

The strict-hardening work therefore needed to avoid Framer Motion inline style output and remove generated image style attributes before enforcing `style-src-attr 'none'`.

## External Origin Audit

| Directive | Origin | Reason |
|---|---|---|
| `frame-src` | `https://www.google.com` | Google Maps location iframe |
| `frame-src` | `https://maps.google.com` | Google Maps compatibility origin |
| `img-src` | `https://res.cloudinary.com` | CMS/admin remote image allowlist from Next config |
| `img-src` | `https://images.unsplash.com` | CMS/admin remote image allowlist from Next config |

Normal navigation links to WhatsApp, email, telephone, downloaded PDFs, and external websites do not require CSP allowlisting unless the site loads or submits resources to those origins.

`https://api.web3forms.com` and `https://api.resend.com` are used by server-side code in `lib/email.ts`; they are not browser `connect-src` requirements and are not included in the final browser CSP.

No Google Fonts, Google Analytics, Google Tag Manager, Vercel Analytics, Speed Insights, YouTube, chatbot widgets, or external stylesheet/script CDNs were found.

## Forms and APIs

Application forms submit to same-origin endpoints:

- `/api/contact`
- `/api/booking`
- `/api/reviews`
- `/api/admin/*`
- `/api/auth/*`

Server-side email integrations use:

- `https://api.web3forms.com/submit`
- `https://api.resend.com/emails`

No browser form directly posts to a third-party origin.

## Cookie Investigation

Production `HEAD`/HTML requests to `https://marcos-chi.vercel.app/` did not return application `Set-Cookie` headers during this audit.

Reported cookies:

| Cookie | Classification | Notes |
|---|---|---|
| `_v-consent` | Vercel platform-controlled or scanner/browser context | Not created in application source |
| `visitor-id` | Vercel platform-controlled or scanner/browser context | Not created in application source |
| `_v-anonymous-id` | Vercel platform-controlled or scanner/browser context | Not created in application source |
| `_v-anonymous-id-renewed` | Vercel platform-controlled or scanner/browser context | Not created in application source |
| `_vercel_sso_nonce` | Vercel preview/authentication-only | Indicates a protected preview or Vercel authentication redirect, not the public production app |
| NextAuth cookies | Application-authentication-controlled when admin login is used | Configured as `Secure`, `HttpOnly`, and `SameSite=Lax` in production where applicable |

The application source does not use `document.cookie`. Admin authentication is handled by NextAuth.

## SRI Audit

No external `<script src="...">` or external stylesheet CDN URLs are loaded by the application. Scripts and styles are same-origin Next.js assets.

Next.js App Router has experimental SRI support for same-origin build assets, but no external immutable CDN script or stylesheet exists in this app. No SRI hashes were added because there was no suitable external subresource to pin. The final rendered homepage had `IntegrityCount: 0` and `Active external script/stylesheet subresources: 0`.

## Report-Only Rollout Policy

Initial report-only target considered for local validation:

```text
default-src 'none'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'nonce-{nonce}'; script-src-attr 'none'; style-src 'self' 'nonce-{nonce}'; style-src-attr 'none'; img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com; font-src 'self'; connect-src 'self'; media-src 'self' blob:; worker-src 'self' blob:; manifest-src 'self'; frame-src https://www.google.com https://maps.google.com; upgrade-insecure-requests
```

## Final Enforced CSP

The strict policy is generated per request in `middleware.ts` with a unique nonce.

```text
default-src 'none'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'nonce-{per-request-nonce}'; script-src-attr 'none'; style-src 'self' 'nonce-{per-request-nonce}'; style-src-attr 'none'; img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com; font-src 'self'; connect-src 'self'; media-src 'self' blob:; worker-src 'self' blob:; manifest-src 'self'; frame-src https://www.google.com https://maps.google.com; upgrade-insecure-requests
```

Development-only exception:

```text
script-src includes 'unsafe-eval' only when NODE_ENV !== 'production'
```

Production does not include `'unsafe-inline'` or `'unsafe-eval'`.

## Changes Made

- Moved all security headers from `next.config.mjs` into `middleware.ts` so one source owns headers and can generate a fresh nonce per request.
- Preserved existing admin authentication middleware behavior.
- Added per-request CSP nonce and passed it through `x-nonce` plus the request CSP header for Next.js nonce extraction.
- Added the nonce to the JSON-LD structured data script in `app/page.tsx`.
- Marked the root layout dynamic so all app pages render with request-specific nonce support.
- Replaced Framer Motion animation wrappers with CSS animation classes.
- Removed `framer-motion` from `package.json`.
- Replaced `next/image` usage with `components/ui/SiteImage.tsx` to remove framework-generated inline `style` attributes.
- Replaced modal body overflow inline style mutation with a `body.modal-open` class.
- Explicitly configured NextAuth production cookie names/options for secure admin cookies.
- Kept `poweredByHeader: false` in `next.config.mjs`.

## Files Modified

- `middleware.ts`
- `next.config.mjs`
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `lib/auth.ts`
- `package.json`
- `package-lock.json`
- `components/ui/SiteImage.tsx`
- `components/ui/Reveal.tsx`
- `components/ui/BookingModal.tsx`
- `components/ui/BlogCard.tsx`
- `components/ui/ProductCard.tsx`
- `components/layout/Header.tsx`
- `components/layout/Footer.tsx`
- `components/admin/AdminShell.tsx`
- `components/sections/HeroSection.tsx`
- `components/sections/AboutSection.tsx`
- `components/sections/GallerySection.tsx`
- `components/sections/FAQSection.tsx`
- `app/admin/login/page.tsx`
- `app/admin/blogs/[id]/preview/page.tsx`
- `app/blog/[slug]/page.tsx`
- `SECURITY_AUDIT.md`

## Test Results

Local checks run:

```text
npm run lint
npm run build
```

Results:

- Lint: passed with no ESLint warnings or errors.
- Production build: passed.
- Local `next start`: started successfully.
- Local response headers verified on `/`, `/blog`, `/blog/industrial-ro-plants-clean-water-businesses`, `/admin/login`, `/marcos/hero.png`, and invalid `/api/contact` POST.
- Required headers present locally: `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`.
- `X-Powered-By` absent locally.
- Rendered homepage checks:
  - `default-src 'none'`: yes
  - `script-src-attr 'none'`: yes
  - `style-src-attr 'none'`: yes
  - `frame-ancestors 'none'`: yes
  - `'unsafe-inline'`: no
  - `'unsafe-eval'`: no in production
  - Broad `script-src https:` or `*`: no
  - Nonce changed across requests: yes
  - Rendered inline script tags: 20, all nonce-backed
  - Inline scripts without nonce: 0
  - Rendered `style=""` attributes: 0
  - Rendered `<style>` blocks: 0
  - Active external script/stylesheet subresources: 0
- Contact form API smoke test: passed, created `CONTACT` lead, then test lead was deleted.
- Booking/quote API smoke test: passed, created `BOOKING` lead, then test lead was deleted.

Browser DevTools console testing was not completed in this environment because the in-app browser control tool was unavailable. Local HTTP and rendered HTML validation were completed.

## Scanner Results

| Scanner | Before | After |
|---|---|---|
| Mozilla HTTP Observatory | B, 70/100 from provided request | Not run after strict hardening because this branch was not pushed/deployed per instruction |
| securityheaders.com | Previously D before initial header pass | Not run after strict hardening because this branch was not pushed/deployed per instruction |

## Risks and Compatibility Notes

- Per-request nonces require dynamic rendering for pages receiving the CSP nonce.
- Strict `style-src-attr 'none'` required removing Framer Motion inline style output and replacing `next/image` output with CSS-class-based images.
- Vercel preview/authentication cookies cannot be corrected from application code; scans must target the public production URL, not a protected preview URL or Vercel dashboard redirect.
- Replacing `next/image` trades Next image optimization for strict inline-style CSP compatibility. Images are still same-origin static assets or documented CMS remote origins.
- Development mode may require `script-src 'unsafe-eval'` for React/Next debugging. Production CSP does not include it.
