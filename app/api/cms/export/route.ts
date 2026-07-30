import { requireAdminApi } from "@/lib/admin-auth";
import {
  ensureCmsDefaults,
  getAnalytics,
  listMedia,
  listResource,
} from "@/lib/cms-storage";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;
  await ensureCmsDefaults();
  const [pages, posts, products, menus, forms, settings, media, analytics] =
    await Promise.all([
      listResource("pages"),
      listResource("posts"),
      listResource("products"),
      listResource("menus"),
      listResource("forms"),
      listResource("settings"),
      listMedia(),
      getAnalytics(),
    ]);
  const content = JSON.stringify(
    {
      format: "sunx-cms-backup-v1",
      exportedAt: new Date().toISOString(),
      pages,
      posts,
      products,
      menus,
      forms,
      settings,
      media,
      analytics,
    },
    null,
    2,
  );
  const date = new Date().toISOString().slice(0, 10);
  return new Response(content, {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename=sunx-cms-backup-${date}.json`,
      "cache-control": "no-store",
    },
  });
}
