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
4. Use Node.js 22 or a newer compatible LTS version.
5. Add the environment variables from `.env.example`.
6. Create a MySQL database and import `deploy/hostinger/mysql-schema.sql`.
7. Run the production deployment.
8. Test the temporary Hostinger URL before connecting `sunxpv.com`.
9. Connect the domain, enable SSL, and verify the sitemap and contact form.

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
