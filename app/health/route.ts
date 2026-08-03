import { pingDatabase } from "@/lib/mysql";

export const runtime = "nodejs";

export async function GET() {
  try {
    await pingDatabase();
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
