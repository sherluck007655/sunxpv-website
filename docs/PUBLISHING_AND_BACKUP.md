# Publishing and backup plan

## Source-controlled publishing

GitHub is the permanent source of truth for website code, text, posts, product
information, SEO fields, images and documents. Every change has a commit history
and can be restored without relying on the live server.

For a new blog post, add one record to `content/posts.ts`, add its image under
`public/images/`, test the build, and push the commit. The blog page, article
page, metadata and XML sitemap update from that record.

## Data that is not in GitHub

Contact enquiries and SMTP delivery status are stored in Hostinger MySQL. They
must be backed up separately because a Git commit does not contain customer
enquiries.

Recommended retention:

- keep Hostinger automatic backups enabled
- export the MySQL database weekly
- keep one encrypted copy outside Hostinger
- retain monthly copies for at least twelve months
- test a database restore at least once every three months

Before any schema change, export the database first. Never store database or
mailbox passwords in GitHub; keep them only in Hostinger environment variables
and an approved password manager.

## Recovery examples

- Broken design release: redeploy the previous GitHub commit.
- Deleted post or product text: restore the file from Git history.
- Lost server deployment: reconnect the repository and redeploy `main`.
- Lost enquiry table: restore the latest MySQL backup, then import any newer
  incremental export if available.

The safest model is two independent backups: GitHub for the website and an
external database backup for enquiries.
