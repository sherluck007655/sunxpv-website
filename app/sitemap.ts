import type { MetadataRoute } from "next";
import { sitePosts } from "@/content/posts";
import { staticPaths } from "@/content/seo";

const base = "https://sunxpv.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date();
  const staticEntries = staticPaths.map((path) => ({
    url: path === "/" ? base : `${base}${path}/`,
    lastModified: updated,
    changeFrequency: path === "/" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "/" ? 1 : 0.7,
  }));

  return [
    ...staticEntries,
    ...sitePosts.map((post) => ({
      url: `${base}/blogs/${post.slug}/`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
