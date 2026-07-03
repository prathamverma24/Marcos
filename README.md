# Marcos Water Solutions

Premium public-facing website for Marcos Water Solutions, rebuilt with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, React Hook Form, and Zod.

## Project Overview

The site preserves content and assets from the current Marcos website at `https://final-marcos.vercel.app/` and presents them through a modern one-page business experience:

- Hero with real Marcos imagery and primary CTAs
- About/story content from the existing site
- Product and service showcase for RO, STP, ETP, PVA Gel, water softener, industrial RO, and spare parts
- Interactive product explainer
- Interactive treatment system visual
- Gallery/lightbox using preserved product images
- SEO blog listing and editable blog detail pages
- Product-specific booking modal with selected product auto-filled
- FAQ, trust section, floating contact actions, and contact form
- SEO metadata, Open Graph data, sitemap, robots, and LocalBusiness structured data

## Tech Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React icons
- React Hook Form
- Zod

## Installation

```bash
npm install
npx prisma generate
npm run dev
```

Open the printed local URL, usually `http://localhost:3000`.

## Production Commands

```bash
npx prisma generate
npx prisma migrate dev
npm run lint
npm run build
npm run start
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure the values you need.

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

DATABASE_URL=

ADMIN_EMAIL=
ADMIN_PASSWORD_HASH=

CONTACT_EMAIL_TO=
CONTACT_EMAIL_FROM=
RESEND_API_KEY=
WEB3FORMS_ACCESS_KEY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Blog CMS Setup

The admin Blog CMS uses NextAuth credentials login, Prisma 7, PostgreSQL, protected App Router pages, Zod validation, and Tiptap rich text JSON. Public visitors can only read published blogs.

1. Create a PostgreSQL database and set `DATABASE_URL`.
2. Generate an auth secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

3. Hash the admin password:

```bash
npm run admin:hash-password -- "your-secure-password"
```

4. Add `NEXTAUTH_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD_HASH` to `.env.local`.
5. Run Prisma:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

6. Start the site and open `http://localhost:3000/admin/login`.

### Local Prisma Dev Setup

For a local disposable PostgreSQL server using Prisma dev:

```bash
npx prisma dev --name marcos-water-cms --detach
```

Copy the printed `postgresql://...` TCP URL into `DATABASE_URL` in `.env.local`, then run:

```bash
npx prisma db push
npm run cms:seed
npm run build
npm run start -- -p 3000
```

This workspace is currently configured for local testing with:

```text
Admin email: admin@marcos.local
Admin password: MarcosAdmin@2026
```

Use a different password and hash before production deployment.

Admin routes:

- `/admin`: dashboard with total, published, draft, category, and recent blog stats
- `/admin/blogs`: blog management table with search/filter/actions
- `/admin/blogs/new`: create draft or publish a new blog
- `/admin/blogs/[id]/edit`: edit blog content and SEO fields
- `/admin/blogs/[id]/preview`: admin-only draft/published preview

Admin APIs are under `/api/admin/*` and check the admin session on the server. Public APIs under `/api/blogs` only return published blogs.

## CMS Authoring Flow

1. Log in at `/admin/login`.
2. Create a blog from `/admin/blogs/new`.
3. Add title, slug, excerpt, category, featured image, alt text, SEO title, meta description, keywords, and rich content.
4. Use `Save Draft` to keep it hidden from public users.
5. Use `Publish` to make it visible on `/blog`, `/blog/[slug]`, homepage latest blogs, and the dynamic sitemap.
6. Use `/admin/blogs` to edit, preview, unpublish, publish, archive, or delete posts.

Draft and archived blogs are never shown on public blog pages, public APIs, homepage latest blogs, or sitemap output.

## Image Upload Setup

The CMS includes an admin-only local upload fallback at `/api/admin/upload`. It saves validated images to `public/uploads/blogs` and returns the local URL.

For production, configure Cloudinary or another storage provider using:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Then replace the local storage section inside `app/api/admin/upload/route.ts` with the provider upload call. Keep the admin session check in place.

## Contact Form Setup

The contact form validates on the client and server, includes a honeypot field, and posts to `app/api/contact/route.ts`.

Email delivery supports either:

- `WEB3FORMS_ACCESS_KEY`
- `RESEND_API_KEY` plus `CONTACT_EMAIL_TO` and `CONTACT_EMAIL_FROM`

If no provider is configured, the form still validates and returns a clear setup state instead of exposing secrets in the browser.

## Product Booking Setup

Product cards in the Products section open `components/ui/BookingModal.tsx` with the clicked product already selected. The form validates on the client and server with `bookingSchema`, then posts to `app/api/booking/route.ts`.

Booking email delivery uses `RESEND_API_KEY`, `CONTACT_EMAIL_TO`, and `CONTACT_EMAIL_FROM`. If Resend is not configured, the API returns a development success response with setup instructions.

## Blog System

The blog listing is available at `/blog`, and each published article is generated at `/blog/[slug]`. When PostgreSQL is configured, blogs come from Prisma. When no database is configured yet, the site falls back to editable sample blogs from `data/blogs.ts` so the public site and build remain usable.

SEO fields supported by each CMS blog:

- SEO title
- Meta description
- Keywords
- Slug
- Featured image
- Image alt text
- Category
- Published date
- Author name

The dynamic sitemap at `/sitemap.xml` includes published blog URLs only.

## Editing Content

- `data/site.ts`: company, hero, about, contact, and why-choose content
- `data/services.ts`: services, products, detailed product sections, and explainer steps
- `data/products.ts`: booking-enabled product cards and booking form product IDs
- `data/blogs.ts`: blog listing and detail content
- `data/gallery.ts`: gallery images and labels
- `data/faqs.ts`: FAQ content
- `data/testimonials.ts`: real testimonials when verified
- `public/images`: preserved website images

## Adding Products or Services

Add a new object to `products` in `data/services.ts`. Include:

- `slug`
- `title`
- `category`
- `image`
- `summary`
- `details`
- `benefits`
- `useCases`
- `detailSections`

The detailed product pages, contact interest selector, footer, and structured data will pick it up automatically.

For product cards with booking buttons, add or edit objects in `data/products.ts`. Use `detailSlug` when a booking card should connect to a detailed product from `data/services.ts`.

## Deployment on Vercel

1. Push the project to your Git provider.
2. Import the repository in Vercel.
3. Add environment variables in Vercel Project Settings.
4. Deploy using the default Next.js settings.

## Testing Checklist

- Home page loads without hydration errors
- Navbar links scroll to the correct sections
- Mobile menu opens and closes
- Product filters and active product panel work
- Every product card opens the booking modal with the selected product auto-filled
- Booking validation catches missing fields, invalid email, and past dates
- Booking API returns a success/setup response when Resend is not configured
- `/blog` loads with search and category filters
- Blog detail pages load with metadata, featured images, content, and CTA
- Product explainer updates active steps
- Gallery lightbox opens and closes
- FAQ accordion works by keyboard and pointer
- Contact validation shows friendly errors
- Contact API responds with success, setup, or provider errors
- Phone, email, WhatsApp, and brochure links work
- Mobile layouts have no horizontal scroll
- `npm run lint` passes
- `npm run build` passes
- Admin routes redirect to `/admin/login` unless the session role is `ADMIN`
- Admin APIs reject non-admin requests
- Public blog APIs return only published blogs
- Admin login works with configured credentials
- Seeded database shows CMS blogs on `/blog`
