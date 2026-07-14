# Repository Cleanup Report

Created on 2026-07-14 from branch `chore/repository-cleanup`.

## Current Project Architecture

- Framework: Next.js 14.2.35 with React 18.3.1 and the App Router.
- Package manager: npm (`package-lock.json` is present; no yarn, pnpm, or bun lockfile found).
- Styling: Tailwind CSS 3.4.5 plus global CSS in `app/globals.css`.
- Routing: Next.js App Router under `app/`, including public pages, admin pages, API routes, and dynamic blog routes.
- State management: local React state, React Hook Form, server components/actions through Next.js routes, and Prisma-backed data helpers.
- Build tool: Next.js build pipeline via `npm run build` (`prisma generate && next build`).
- Deployment/config: `next.config.mjs`, `prisma.config.ts`, `.env.example`, `middleware.ts`, and public static assets.

## Existing Folder Structure

- `app/`: Next.js routes, layout, global CSS, API endpoints, admin pages, and blog pages.
- `components/`: admin, layout, sections, and UI components.
- `data/`: static site, product, service, gallery, FAQ, blog, navigation, and local review data.
- `hooks/`: one custom hook file.
- `lib/`: Prisma, auth, CMS, validation, email, review, and utility helpers.
- `prisma/`: schema and migrations.
- `public/`: static images, videos, PDF, favicon, and robots file.
- `scripts/`: admin password hash and CMS seed scripts.
- `marcos/`: staging/source media files copied into `public/`.
- Local/generated folders: `.next/`, `node_modules/`, `artifacts/`, `.agents/`, `.codex/`, `src/`.

## Size and File Counts Before Cleanup

- Local checkout size including dependencies and generated output: about 1.03 GB.
- Largest local folders:
  - `node_modules/`: 644.17 MB
  - `.next/`: 308.20 MB
  - `public/`: 26.66 MB
  - `.git/`: 26.48 MB
  - `marcos/`: 17.32 MB
  - `artifacts/`: 6.87 MB
- Workspace size excluding `.git`, `node_modules`, and `.next`: 51.54 MB.
- Git-tracked files before cleanup: 150.
- Non-generated workspace files found by `rg --files` excluding `.git`, `.next`, and `node_modules`: 147.

## Problems Found

### Generated, Temporary, and Local Files

- `.next/` exists locally and is correctly ignored. It contains build/cache output and should not be committed.
- `node_modules/` exists locally and is correctly ignored.
- `artifacts/runlogs/` and `artifacts/screenshots/` contain local run logs/screenshots and are ignored.
- `tsconfig.tsbuildinfo` exists locally and is ignored.
- Empty local folders found: `.agents/`, `.codex/`, `src/`, and `artifacts/playwright/`.
- `.env.local` exists locally, is ignored, and is not tracked. It must not be deleted or printed.

### Duplicate Assets Found by SHA-256 Hash

Exact duplicates across `marcos/` and `public/`:

- `marcos/animated_vid1.mp4` duplicates `public/animated-workflow.mp4`.
- `marcos/product_workflow.mp4` duplicates `public/product-workflow.mp4`.
- `marcos/about_image.png` duplicates `public/images/about-image.png`.
- `marcos/industry.png` duplicates `public/images/industry.png`.
- `marcos/installation support.png` duplicates `public/images/installation-support.png`.
- `marcos/marcos_water_solutions_logo.png` duplicates `public/images/marcos-water-solutions-logo.png`.
- `marcos/RoPLant.png` duplicates `public/images/ro-plant-product.png`.
- `marcos/spare.png` duplicates `public/images/spare.png`.
- `marcos/Water Softener.png` duplicates `public/images/water-softener.png`.

Exact duplicates inside `public/images/`:

- `public/images/blog-industrial-ro.jpg` duplicates `public/images/ro-industrial-new-C0FiWPxu.jpeg`.
- `public/images/blog-stp-etp.jpg` duplicates `public/images/stp-etp-plant-DKM8anl_.jpg`.
- `public/images/blog-water-softener.jpg` duplicates `public/images/water-softner-CTOMiZvD.jpg`.

### Unused Source Files Found

Verified by `rg` searches across `app`, `components`, `data`, `hooks`, `lib`, and `scripts`:

- `hooks/useScrollProgress.ts`: no imports or runtime references found.
- `components/ui/Hotspot.tsx`: no imports or runtime references found.
- `data/testimonials.ts`: no imports or runtime references found after the live review section replaced the old testimonial placeholder.

### Unused or Questionable Public Files

Zero direct code references found:

- `public/favicon.ico`: zero-byte file; metadata uses `public/favicon.svg`.
- `public/images/aajtak-CJIRSkH7.png`
- `public/images/aboutus2-BLWgXE3k.jpg`
- `public/images/etp-Dli3yauh.jpg`
- `public/images/industrial-ZQHxHW5f.jpg`
- `public/images/jaypee-BtjhZ28L.png`
- `public/images/logo-Bo6gkKPH.jpeg`
- `public/images/marcos-water-solutions-logo.png`
- `public/images/ro-industrial-new-C0FiWPxu.jpeg`
- `public/images/sewage-treatment-plant-KOUgECnJ.jpg`

Because public assets can be accessed by URL outside source imports, only files with stronger evidence are proposed for deletion in this cleanup.

### Duplicate Configuration and Static Files

- `public/robots.txt` and root `robots.txt` have identical content.
- For Next.js, `public/robots.txt` is served statically. The root `robots.txt` is not part of the Next public output.

### Dependencies

No dependency is proposed for removal in this cleanup. All major dependencies are used by source, scripts, or configuration:

- Prisma stack: `@prisma/client`, `@prisma/adapter-pg`, `prisma`, `pg`
- Auth/CMS/form stack: `next-auth`, `bcryptjs`, `react-hook-form`, `@hookform/resolvers`, `zod`
- Editor stack: Tiptap packages
- UI/runtime: `next`, `react`, `react-dom`, `framer-motion`, `lucide-react`
- Build/styling: `tailwindcss`, `postcss`, `autoprefixer`, `typescript`, `eslint`, `eslint-config-next`

### CSS

- Styling is centralized through Tailwind classes plus `app/globals.css`.
- No stylesheet is proposed for deletion.
- Logo glow and reduced-motion handling must be preserved.
- No aggressive CSS purge should be run because classes are constructed dynamically in a few components.

## Files Proposed for Deletion

### Safe

These files/folders have strong evidence of being generated, empty, exact duplicates, or unused:

- Local ignored/generated only:
  - `.next/`
  - `artifacts/runlogs/`
  - `artifacts/screenshots/`
  - `artifacts/playwright/`
  - `tsconfig.tsbuildinfo`
  - `.agents/`
  - `.codex/`
  - `src/`
- Tracked exact duplicate staging files:
  - `marcos/animated_vid1.mp4`
  - `marcos/product_workflow.mp4`
  - `marcos/about_image.png`
  - `marcos/industry.png`
  - `marcos/installation support.png`
  - `marcos/marcos_water_solutions_logo.png`
  - `marcos/RoPLant.png`
  - `marcos/spare.png`
  - `marcos/Water Softener.png`
- Tracked unused source files:
  - `hooks/useScrollProgress.ts`
  - `components/ui/Hotspot.tsx`
  - `data/testimonials.ts`
- Tracked duplicate/static files:
  - `robots.txt`
  - `public/favicon.ico`
  - `public/images/ro-industrial-new-C0FiWPxu.jpeg`

### Needs Verification

These appear unused, but are business media or legacy public URLs, so they should be retained for now:

- `marcos/softener_mini.jpeg`
- `public/images/aajtak-CJIRSkH7.png`
- `public/images/aboutus2-BLWgXE3k.jpg`
- `public/images/etp-Dli3yauh.jpg`
- `public/images/industrial-ZQHxHW5f.jpg`
- `public/images/jaypee-BtjhZ28L.png`
- `public/images/logo-Bo6gkKPH.jpeg`
- `public/images/marcos-water-solutions-logo.png`
- `public/images/sewage-treatment-plant-KOUgECnJ.jpg`
- Referenced exact duplicate public image pairs where both public paths may matter:
  - `public/images/blog-stp-etp.jpg` and `public/images/stp-etp-plant-DKM8anl_.jpg`
  - `public/images/blog-water-softener.jpg` and `public/images/water-softner-CTOMiZvD.jpg`

### Do Not Remove

- `.git/`
- `.env`, `.env.local`, `.env.*`
- `node_modules/` as part of Git cleanup; it is ignored and may be needed for local validation.
- `public/MWSProfile.pdf`
- Current referenced media in `public/`
- Prisma migrations
- Deployment/config files
- `package-lock.json`

## Files Proposed for Relocation

No source files are proposed for relocation in this pass. The project already has a clear Next.js App Router layout:

- `app/` for routes
- `components/` for UI
- `data/` for static content
- `lib/` for helpers and integrations
- `public/` for static media
- `prisma/` for database schema/migrations

Avoiding large folder moves lowers risk and preserves routes/imports.

## Proposed Folder Structure

Keep the current structure and remove only clutter:

```text
app/
components/
  admin/
  layout/
  sections/
  ui/
data/
hooks/
lib/
prisma/
public/
  images/
scripts/
```

Do not introduce `src/` because the project currently uses root-level Next.js folders and the empty `src/` folder adds confusion.

## Expected Size Reduction

- Removing local ignored `.next/`: about 308 MB local disk reduction.
- Removing local ignored `artifacts/`: about 6.87 MB local disk reduction.
- Removing tracked duplicate `marcos/` files except `softener_mini.jpeg`: about 17.25 MB repository content reduction.
- Removing verified unused source/static files: less than 0.2 MB.
- Expected workspace size excluding `.git`, `node_modules`, and `.next`: about 51.54 MB down to about 34 MB.

## Commands Planned

Non-destructive/reporting:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Cleanup:

```bash
git rm hooks/useScrollProgress.ts components/ui/Hotspot.tsx data/testimonials.ts
git rm robots.txt public/favicon.ico public/images/ro-industrial-new-C0FiWPxu.jpeg
git rm "marcos/animated_vid1.mp4" "marcos/product_workflow.mp4" "marcos/about_image.png"
git rm "marcos/industry.png" "marcos/installation support.png" "marcos/marcos_water_solutions_logo.png"
git rm "marcos/RoPLant.png" "marcos/spare.png" "marcos/Water Softener.png"
```

Local ignored cleanup will use PowerShell-safe `Remove-Item -LiteralPath` after path verification.

## Rollback Instructions

- Backup commit before cleanup: `e304f84 chore: backup before repository cleanup`
- To inspect changes:

```bash
git status
git diff --stat main...chore/repository-cleanup
```

- To restore a deleted file from the backup commit:

```bash
git restore --source e304f84 -- path/to/file
```

- To abandon cleanup branch changes:

```bash
git switch main
git branch -D chore/repository-cleanup
```

## Risk Summary

- Low risk: deleting exact duplicate staging media in `marcos/` that has identical retained files under `public/`.
- Low risk: deleting unused source files with no imports.
- Low risk: deleting root `robots.txt` because `public/robots.txt` is the served Next.js static file.
- Medium risk: deleting public assets with zero source references because old public URLs may exist externally. These are retained unless exact duplicates are otherwise covered.
- High risk: changing dependencies, package versions, app routes, public content, or form logic. No such changes are proposed.
