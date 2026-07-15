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

The strict-hardening work therefore needs to avoid Framer Motion inline style output and either remove or explicitly account for generated image style attributes before using `style-src-attr 'none'`.

## External Origin Audit

| Directive | Origin | Reason |
|---|---|---|
| `frame-src` | `https://www.google.com` | Google Maps location iframe |
| `frame-src` | `https://maps.google.com` | Google Maps compatibility origin |
| `connect-src` | `https://api.web3forms.com` | Server-side contact email provider fallback |
| `connect-src` | `https://api.resend.com` | Server-side email provider |
| `img-src` | `https://res.cloudinary.com` | CMS/admin remote image allowlist from Next config |
| `img-src` | `https://images.unsplash.com` | CMS/admin remote image allowlist from Next config |

Normal navigation links to WhatsApp, email, telephone, downloaded PDFs, and external websites do not require CSP allowlisting unless the site loads or submits resources to those origins.

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
| NextAuth cookies | Application-authentication-controlled when admin login is used | Should be `Secure`, `HttpOnly`, and `SameSite=Lax` in production |

The application source does not use `document.cookie`. Admin authentication is handled by NextAuth.

## SRI Audit

No external `<script src="...">` or external stylesheet CDN URLs are loaded by the application. Scripts and styles are same-origin Next.js assets.

Next.js App Router has experimental SRI support for same-origin build assets. SRI is optional for same-origin assets but can be enabled if it does not break the production build.

## Report-Only Rollout Policy

Initial report-only target for local validation:

```text
default-src 'none'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'nonce-{nonce}'; script-src-attr 'none'; style-src 'self' 'nonce-{nonce}'; style-src-attr 'none'; img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com; font-src 'self'; connect-src 'self' https://api.web3forms.com https://api.resend.com; media-src 'self' blob:; worker-src 'self' blob:; manifest-src 'self'; frame-src https://www.google.com https://maps.google.com; upgrade-insecure-requests
```

## Final CSP

Pending final local validation.

## Changes Made

Pending final local validation.

## Test Results

Pending final local validation.

## Scanner Results

| Scanner | Before | After |
|---|---|---|
| Mozilla HTTP Observatory | B, 70/100 from provided request | Pending final deployed scan |
| securityheaders.com | Previously D before initial header pass | Pending final deployed scan |

## Risks and Compatibility Notes

- Per-request nonces require dynamic rendering for pages receiving the CSP nonce.
- Strict `style-src-attr 'none'` can break generated inline style attributes. This must be verified against rendered production HTML before enforcement.
- Vercel preview/authentication cookies cannot be corrected from application code; scans must target the public production URL, not a protected preview URL or Vercel dashboard redirect.
