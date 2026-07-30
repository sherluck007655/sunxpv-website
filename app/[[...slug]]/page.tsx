import type { Metadata } from "next";
import SunXSite from "../site-client";
import { getPublicContent } from "@/lib/cms-storage";

const fallbackTitle = "SunX PV Technology | Solar Inverters & Lithium Batteries";
const fallbackDescription =
  "SunX PV Technology provides high-quality solar inverters and lithium batteries for homes, businesses, and industries across Pakistan.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug = [] } = await params;
  const path = slug.join("/");
  if (!path) return {};

  try {
    const content = await getPublicContent();
    const page = content.pages.find(
      (item) => item.slug === path && item.status === "published",
    );
    const post = path.startsWith("blogs/")
      ? content.posts.find((item) => item.slug === path.replace(/^blogs\//, ""))
      : undefined;
    const product = path.startsWith("products/")
      ? content.products.find(
          (item) => item.slug === path.replace(/^products\//, ""),
        )
      : undefined;
    const item = page || post || product;
    if (!item) return {};
    const title = String(
      item.seo_title || item.title || item.name || fallbackTitle,
    );
    const description = String(
      item.seo_description || item.excerpt || item.summary || fallbackDescription,
    );
    const image = String(item.featured_image || item.image || "");
    return {
      title,
      description,
      alternates: { canonical: `/${path}/` },
      openGraph: {
        title,
        description,
        type: post ? "article" : "website",
        ...(image ? { images: [image] } : {}),
      },
    };
  } catch {
    return {};
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  return <SunXSite path={`/${slug.join("/")}`} />;
}
