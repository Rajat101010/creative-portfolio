# Creative Portfolio CMS

A Next.js App Router + TypeScript + Tailwind portfolio with Prisma/Neon persistence, Cloudinary uploads, protected admin pages, and a Web3Forms contact form.

## Requirements
- Node.js 20+
- Neon Postgres database
- Cloudinary account
- Web3Forms access key

## Local setup
1. Copy `.env.example` to `.env` and fill every value.
2. Install packages: `npm install`
3. Generate Prisma client: `npm run db:generate`
4. Create and apply the initial migration: `npx prisma migrate dev --name init`
5. Seed starter content: `npm run db:seed`
6. Run: `npm run dev`
7. Visit `http://localhost:3000`; admin: `http://localhost:3000/admin/login`.

## Service setup
### Neon
Create a project/database in https://neon.tech. Copy the pooled connection string into `DATABASE_URL`. Set `DIRECT_URL` to the direct connection string for schema migrations. Ensure `sslmode=require`.

### Cloudinary
From https://cloudinary.com/console copy cloud name, API key, and API secret into `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`. Uploads are sent server-side to the `portfolio` folder. Do not expose the API secret in a `NEXT_PUBLIC_*` variable.

### Web3Forms
Create an access key at https://web3forms.com/. The contact component submits to Web3Forms with required fields and a honeypot. Add `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` to `.env` using the same key (the public contact form necessarily exposes the access key). `WEB3FORMS_ACCESS_KEY` is included for integrations that may use server-side verification; the current form uses Web3Forms' browser endpoint.

### Admin credentials
Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and a long random `AUTH_SECRET`. The login endpoint compares environment credentials in constant time and issues a signed, HTTP-only, same-site cookie. Do not commit `.env`. Use a strong unique password and rotate credentials if exposed.

## Deploy to Vercel
1. Push the project to GitHub and import it into Vercel.
2. Add all production environment variables in Vercel Project Settings.
3. Use `npm run build` as the build command; the script generates Prisma Client before Next build.
4. Run `npx prisma migrate deploy` against the production database before/at deployment, then run `npm run db:seed` once if you want the sample content.
5. Configure `NEXT_PUBLIC_SITE_URL` to your production domain.
6. Verify `/`, `/portfolio`, `/blog`, `/contact`, and `/admin/login`.

## Content management
- Admin resource sections support add, edit, and delete for projects, skills, experience, education, certificates, services, blog posts, and social links.
- Site settings control title, tagline, logo/profile image URLs, SEO fields, theme colors, footer text, and contact details.
- Page content sections are JSON-backed so headings and copy can be changed without editing page components.
- Image fields support direct upload to Cloudinary in the admin editor.
- Blog post status should be `PUBLISHED` to show publicly; use an ISO date for `publishedAt` (for example `2026-10-15T10:00:00.000Z`). Set `pinned=true` to feature a post; the API unpins any previously pinned post.
- Project `tags` should be comma-separated in the admin editor.

## Database model
Prisma models: `SiteSettings`, `PageContent`, `Skill`, `Experience`, `Education`, `Project`, `Certificate`, `Service`, `BlogPost`, `SocialLink`, and `AdminUser`. The admin login uses environment-based credentials as requested; `AdminUser` is available if you later want database-managed users.

## Security and production notes
- Admin pages and `/api/admin/*` routes are protected by middleware. Mutations are server-side and database-backed.
- Upload endpoint accepts image files only and limits size to 8 MB.
- Contact form has client-side required validation, minimum message length, and a honeypot. For production spam mitigation, configure Web3Forms' captcha/turnstile option in the provider dashboard as well.
- This is a practical starter implementation, not a security audit. Before a high-traffic production launch, add rate limiting to login/upload APIs, stronger request schemas per resource, audit logging, and server-side CSRF/origin checks. Set a strong `AUTH_SECRET`.
- The UI includes scroll reveals, staggered card entrances, hover states, animated contact status, responsive layouts, and `prefers-reduced-motion` handling.
