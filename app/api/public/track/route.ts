import { recordPageView } from "@/lib/cms-storage";

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as Record<string, unknown>;
    const path = String(input.path ?? "").trim();
    if (!path.startsWith("/") || path.length > 300) {
      return Response.json({ error: "Invalid page path" }, { status: 400 });
    }
    await recordPageView({
      path,
      referrer: String(input.referrer ?? ""),
      sessionId: String(input.sessionId ?? ""),
      device: String(input.device ?? "desktop"),
    });
    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ ok: false }, { status: 202 });
  }
}
