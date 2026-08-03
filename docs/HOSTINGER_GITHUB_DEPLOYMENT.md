# Hostinger GitHub deployment

## Recommended Hostinger setup

Use a Hostinger managed Node.js Web App connected to the GitHub repository. A
VPS is not required for this website.

Use these build settings:

- Framework: Next.js
- Branch: `main`
- Root directory: `./`
- Node version: `22.x`
- Install command: `npm ci`
- Build command: `npm run build`
- Output directory: `dist/standalone`
- Entry file: `server.js`

The build replaces the old Vinext file at `dist/standalone/server.js` with a
standard CommonJS Next.js server. This keeps the existing Hostinger output and
entry settings compatible while removing the ESM top-level-await failure.

## Database setup

1. Create a MySQL database in hPanel.
2. Create a database user and grant it access to that database.
3. Open phpMyAdmin and select the new database.
4. Import `deploy/hostinger/mysql-schema.sql`.
5. Add the `MYSQL_` variables from `.env.example` to the Web App environment.

## Email notification setup

Create or select the mailbox that will send notifications. Add the `SMTP_`
variables and `ENQUIRY_NOTIFICATION_EMAIL` from `.env.example` to Hostinger.
The recipient can be the same mailbox or a separate sales mailbox.

The form workflow is:

1. Validate the enquiry.
2. Save it in MySQL.
3. Send the email notification.
4. Mark the database row as notified.

An SMTP problem does not delete or reject an enquiry that was already stored.

## First deployment checklist

- Confirm the Hostinger build log says the Next.js build completed.
- Confirm `dist/standalone/server.js` is the selected entry.
- Open the temporary Hostinger domain and test the home page.
- Open `/health`; it should report a connected database.
- Submit a contact form test.
- Confirm the test exists in `contact_enquiries` in phpMyAdmin.
- Confirm the notification email arrived.
- Test the email, telephone and WhatsApp links.
- Connect the production domain and enable SSL.
- Verify `/robots.txt` and `/sitemap.xml`.

## GitHub release flow

The `main` branch is production. For each approved content or design update:

1. ChatGPT changes the source files.
2. The standard Next.js build is tested.
3. The change is committed and pushed to GitHub.
4. Hostinger automatically builds and deploys `main`.
5. The public URL is checked after deployment.

If a release fails, redeploy the previous successful Git commit in Hostinger.
The MySQL enquiry data remains separate from code deployments.
