import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SunXSite from "../site-client";
import { findSitePost, sitePosts } from "@/content/posts";
import { pageSeo, staticPaths } from "@/content/seo";

const fallbackTitle = "SunX PV Technology | Solar Inverters & Lithium Batteries";
const fallbackDescription =
  "SunX PV Technology provides high-quality solar inverters and lithium batteries for homes, businesses, and industries across Pakistan.";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug = [] } = await params;
  const path = `/${slug.join("/")}`.replace(/\/$/, "") || "/";
  const post = path.startsWith("/blogs/")
    ? findSitePost(path.replace("/blogs/", ""))
    : undefined;
  const page = pageSeo[path];
  const title = post?.seoTitle || page?.title || fallbackTitle;
  const description =
    post?.seoDescription || page?.description || fallbackDescription;
  const image = post?.featuredImage || page?.image;

  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    alternates: { canonical: path === "/" ? "/" : `${path}/` },
    openGraph: {
      title,
      description,
      type: post ? "article" : "website",
      ...(post ? { publishedTime: post.publishedAt, modifiedTime: post.updatedAt } : {}),
      ...(image ? { images: [image] } : {}),
    },
  };
}

export function generateStaticParams() {
  return [
    { slug: [] },
    ...staticPaths
      .filter((path) => path !== "/")
      .map((path) => ({ slug: path.slice(1).split("/") })),
    ...sitePosts.map((post) => ({ slug: ["blogs", post.slug] })),
  ];
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  const path = `/${slug.join("/")}`.replace(/\/$/, "") || "/";
  const isPost = path.startsWith("/blogs/")
    ? Boolean(findSitePost(path.replace("/blogs/", "")))
    : false;
  if (!pageSeo[path] && !isPost) notFound();
  return <SunXSite path={path} />;
}
