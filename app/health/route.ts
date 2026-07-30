import { getPublicContent } from "@/lib/cms-storage";

export async function GET() {
  try {
    await getPublicContent();
    return Response.json(
      { status: "healthy", database: "connected" },
      { headers: { "cache-control": "no-store" } },
    );
  } catch {
    return Response.json(
      { status: "degraded", database: "unavailable" },
      { status: 503, headers: { "cache-control": "no-store" } },
    );
  }
}
