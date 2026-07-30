# SunX GitHub and Hostinger workflow

## Recommended production setup

Use a private GitHub repository as the source of truth. Connect that repository
to a Hostinger Node.js Web App. Hostinger can automatically build and redeploy
the application after changes are pushed to the selected production branch.

The website has two independent management paths:

1. The SunX dashboard manages business content stored in the database.
2. GitHub manages code, layouts, components, integrations, and larger design
   changes.

Dashboard content is never stored in Git. A code deployment therefore does not
overwrite pages, products, inquiries, or analytics.

## Current and future data adapters

The current ChatGPT Sites deployment uses managed D1 for CMS records and managed
R2 for uploaded media. All browser screens talk to internal API routes, and only
`lib/cms-storage.ts` talks directly to those services.

For Hostinger, keep the API and dashboard unchanged and replace that single
storage module with a MySQL and persistent-file adapter. The matching MySQL
schema is in `deploy/hostinger/mysql-schema.sql`. Export a JSON backup from
Dashboard → Settings before migration.

Do not point the production domain to Hostinger until the MySQL adapter is
installed and a backup has been imported successfully.

## GitHub branch flow

- `main` is production.
- Each ChatGPT change uses a short feature branch.
- Review the preview.
- Merge the approved pull request into `main`.
- Hostinger automatically redeploys `main`.

This keeps every code change reversible and gives the team a clear history.

## Hostinger managed Node.js setup

1. In hPanel, add a Node.js Web App.
2. Choose Import Git Repository and authorize the private GitHub repository.
3. Select the production branch, normally `main`.
4. Open the advanced build settings and choose framework `Other`.
5. Use Node.js `22.x`.
6. Use install command `npm ci`.
7. Use build command `npm run build`.
8. Set output directory to `dist/standalone`.
9. Set entry file to `server.js`.
10. Set start command to `npm run start` when Hostinger shows that field.
11. Add environment variable `HOST=0.0.0.0`. Let Hostinger provide `PORT`.
12. Add the database and admin environment variables.
13. Create a MySQL database and import `deploy/hostinger/mysql-schema.sql`.
14. Run the production deployment.
15. Test the temporary Hostinger URL before connecting `sunxpv.com`.
16. Connect the domain, enable SSL, and verify the sitemap and contact form.

The build generates a self-contained Node.js server in `dist/standalone`. It
keeps the generated Vinext runtime as `vinext-server.mjs` and installs a
Hostinger-compatible `server.js` entry file. The Hostinger-only copy of the
server bundle receives a local empty runtime environment, so it does not import
the Cloudflare runtime package. The original Sites artifact remains unchanged.
The repository `start` command uses `server.js`, and every build verifies the
complete Hostinger output before deployment can pass.

The Hostinger entry is CommonJS because Passenger loads it with `require()`.
It immediately imports the ESM Vinext server without installing a custom Node
loader. This avoids Passenger resolving files beside `lsnode.js` and its
restriction on requiring an ESM graph with top-level await. A nested package
marker keeps the generated Vinext runtime ESM while the outer Hostinger entry
remains CommonJS.

Hostinger keeps backend application builds outside `public_html`, in its
managed `nodejs` deployment directory. The public directory normally contains
only a hidden `.htaccess` routing file. An apparently empty `public_html` folder
therefore does not mean the Node.js build files are missing.

Hostinger currently documents automatic redeployment after GitHub updates for
its managed Node.js Web App product. A VPS is also possible, but it requires
manual Node.js, PM2, NGINX, SSL, backups, and security maintenance.

## Safe release checklist

- Download a dashboard backup.
- Confirm the pull request contains only the intended code changes.
- Test the website and `/admin/dashboard` on the preview.
- Confirm forms create a dashboard entry.
- Confirm a published test page appears publicly.
- Confirm `robots.txt` blocks `/admin` and `/api`.
- Confirm `sitemap.xml` contains published content.
- Confirm `/health` reports a healthy database connection.
- Merge to `main`.
- Watch the Hostinger deployment log.
- Test desktop and mobile on the production domain.

## Rollback

If a code release fails, redeploy the previous successful Git commit in
Hostinger. Database content remains separate and is not rolled back with code.
If content is damaged, restore from the exported CMS backup or the Hostinger
database backup.
