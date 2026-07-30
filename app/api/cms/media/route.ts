import { requireAdminApi } from "@/lib/admin-auth";
import {
  deleteMediaRecord,
  listMedia,
  mediaBucket,
  mediaRecord,
  saveMedia,
} from "@/lib/cms-storage";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;
  return Response.json({ items: await listMedia() });
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "Choose an image to upload" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return Response.json({ error: "Only image files are supported" }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return Response.json({ error: "Images must be smaller than 8 MB" }, { status: 400 });
  }

  const id = crypto.randomUUID();
  await (await mediaBucket()).put(id, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
  });
  const item = await saveMedia({
    id,
    name: file.name,
    contentType: file.type,
    size: file.size,
    altText: String(form.get("altText") ?? ""),
  });
  return Response.json({ item }, { status: 201 });
}

export async function DELETE(request: Request) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return Response.json({ error: "A media id is required" }, { status: 400 });
  const item = await mediaRecord(id);
  if (!item) return Response.json({ error: "Media not found" }, { status: 404 });
  await (await mediaBucket()).delete(id);
  await deleteMediaRecord(id);
  return Response.json({ ok: true });
}
