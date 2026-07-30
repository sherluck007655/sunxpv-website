import { getPublicContent } from "@/lib/cms-storage";

export async function GET() {
  try {
    return Response.json(await getPublicContent(), {
      headers: { "cache-control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (error) {
    return Response.json(
      {
        pages: [],
        posts: [],
        products: [],
        menus: [],
        settings: {},
        unavailable:
          error instanceof Error ? error.message : "CMS content is unavailable",
      },
      { status: 200 },
    );
  }
}
