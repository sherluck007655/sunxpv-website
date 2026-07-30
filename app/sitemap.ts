import type { MetadataRoute } from "next";
import { getPublicContent } from "@/lib/cms-storage";

const base = "https://sunxpv.com";
const staticPaths = [
  "",
  "/about-us/",
  "/products/",
  "/sun-prime-series/",
  "/sun-pro-series/",
  "/sun-ultra-series/",
  "/sun-max-series/",
  "/sunx-dealers/",
  "/find-an-installer/",
  "/download-center/",
  "/sunx-product-warranty/",
  "/contact-us/",
  "/blogs/",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const updated = new Date();
  const staticEntries = staticPaths.map((path) => ({
    url: `${base}${path}`,
    lastModified: updated,
    changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "" ? 1 : 0.7,
  }));

  try {
    const content = await getPublicContent();
    return [
      ...staticEntries,
      ...content.pages.filter((item) => item.status === "published").map((item) => ({
        url: `${base}/${String(item.slug)}/`,
        lastModified: new Date(String(item.updated_at || updated)),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
      ...content.posts.map((item) => ({
        url: `${base}/blogs/${String(item.slug)}/`,
        lastModified: new Date(String(item.updated_at || updated)),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
      ...content.products.map((item) => ({
        url: `${base}/products/${String(item.slug)}/`,
        lastModified: new Date(String(item.updated_at || updated)),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
    ];
  } catch {
    return staticEntries;
  }
}
