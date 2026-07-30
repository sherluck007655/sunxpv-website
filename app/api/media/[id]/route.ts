import { mediaBucket, mediaRecord } from "@/lib/cms-storage";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const record = await mediaRecord(id);
  if (!record) return new Response("Not found", { status: 404 });
  const object = await mediaBucket().get(id);
  if (!object) return new Response("Not found", { status: 404 });

  return new Response(object.body, {
    headers: {
      "content-type": String(record.content_type ?? "application/octet-stream"),
      "cache-control": "public, max-age=31536000, immutable",
      ...(object.httpEtag ? { etag: object.httpEtag } : {}),
    },
  });
}
