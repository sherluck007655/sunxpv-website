import { requireAdminApi } from "@/lib/admin-auth";
import {
  createResource,
  deleteResource,
  ensureCmsDefaults,
  getAnalytics,
  listResource,
  type CmsResource,
  updateResource,
} from "@/lib/cms-storage";

const validResources = new Set<CmsResource>([
  "pages",
  "posts",
  "products",
  "menus",
  "forms",
  "settings",
]);

function resourceFrom(value: string): CmsResource | null {
  return validResources.has(value as CmsResource)
    ? (value as CmsResource)
    : null;
}

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "CMS request failed";
  return Response.json({ error: message }, { status: 400 });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;
  const { resource: value } = await params;
  try {
    await ensureCmsDefaults();
  } catch (error) {
    return errorResponse(error);
  }
  if (value === "analytics") {
    try {
      return Response.json(await getAnalytics());
    } catch (error) {
      return errorResponse(error);
    }
  }
  const resource = resourceFrom(value);
  if (!resource) return Response.json({ error: "Unknown resource" }, { status: 404 });
  try {
    return Response.json({ items: await listResource(resource) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;
  const { resource: value } = await params;
  const resource = resourceFrom(value);
  if (!resource) return Response.json({ error: "Unknown resource" }, { status: 404 });
  try {
    const input = (await request.json()) as Record<string, unknown>;
    return Response.json(
      { item: await createResource(resource, input) },
      { status: 201 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;
  const { resource: value } = await params;
  const resource = resourceFrom(value);
  if (!resource) return Response.json({ error: "Unknown resource" }, { status: 404 });
  try {
    const input = (await request.json()) as Record<string, unknown>;
    const id = String(input.id ?? input.key ?? "");
    if (!id) return Response.json({ error: "An item id is required" }, { status: 400 });
    await updateResource(resource, id, input);
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;
  const { resource: value } = await params;
  const resource = resourceFrom(value);
  if (!resource) return Response.json({ error: "Unknown resource" }, { status: 404 });
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return Response.json({ error: "An item id is required" }, { status: 400 });
    await deleteResource(resource, id);
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
