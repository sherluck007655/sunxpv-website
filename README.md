# SunX PV Technology website

This is the production SunX website built with standard Next.js. It is designed
for Hostinger managed Node.js hosting and a GitHub-first publishing workflow.

## Architecture

- Next.js App Router with a standalone Node.js production server
- React public website with responsive orange, white and light-grey branding
- source-controlled products, pages and posts with no administration dashboard
- Hostinger MySQL storage for contact enquiries
- SMTP email notification for each saved enquiry
- static SEO metadata, canonical URLs, sitemap and robots rules

The website does not depend on Cloudflare Worker APIs, D1, R2, ChatGPT sign-in,
or a browser-based CMS. GitHub is the source of truth for code, text and images.

## Editing content

- Blog posts: `content/posts.ts`
- Page SEO titles and descriptions: `content/seo.ts`
- Product cards and detailed public page content: `app/site-client.tsx`
- Images and downloads: `public/`
- Contact database schema: `deploy/hostinger/mysql-schema.sql`

ChatGPT can update these files, test the site, and push the approved change to
GitHub. Hostinger then deploys the production branch.

## Local development

Copy `.env.example` to `.env.local` and enter local development credentials.
Never commit `.env.local` or production credentials.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Production commands

```bash
npm run build
npm run start
```

The full build keeps the ChatGPT Sites preview artifact and creates the standard
Next.js Hostinger server in both `.next/standalone/server.js` and
`dist/standalone/server.js`. Both Hostinger entry files are explicitly marked as
CommonJS so Passenger can load them without the Vinext ESM error.

`npm run build:hostinger` remains available when only the Hostinger output is
needed.

## Contact enquiries

1. Create a Hostinger MySQL database and user.
2. Import `deploy/hostinger/mysql-schema.sql` in phpMyAdmin.
3. Add the variables from `.env.example` to the Hostinger Web App environment.
4. Deploy and submit one test enquiry.
5. Confirm the row exists in `contact_enquiries` and the notification email was
   received.

The database insert happens before the email is sent. If SMTP is temporarily
unavailable, the enquiry remains safely stored with the email error recorded.

See `docs/HOSTINGER_GITHUB_DEPLOYMENT.md` for deployment and
`docs/PUBLISHING_AND_BACKUP.md` for the long-term publishing and backup plan.
