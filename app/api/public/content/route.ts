import { getPublicContent } from "@/lib/cms-storage";

export async function GET() {
  try {
    return Response.json(await getPublicContent(), {
      headers: { "cache-control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch {
    return Response.json(
      { pages: [], posts: [], products: [], menus: [], settings: {} },
      { status: 200 },
    );
  }
}
