import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
};

export const pages = sqliteTable(
  "pages",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    status: text("status").notNull().default("draft"),
    content: text("content").notNull().default(""),
    template: text("template").notNull().default("standard"),
    parentId: text("parent_id"),
    menuOrder: integer("menu_order").notNull().default(0),
    seoTitle: text("seo_title").notNull().default(""),
    seoDescription: text("seo_description").notNull().default(""),
    ...timestamps,
  },
  (table) => [
    index("pages_status_idx").on(table.status),
    index("pages_menu_order_idx").on(table.menuOrder),
  ],
);

export const posts = sqliteTable(
  "posts",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    status: text("status").notNull().default("draft"),
    excerpt: text("excerpt").notNull().default(""),
    content: text("content").notNull().default(""),
    featuredImage: text("featured_image").notNull().default(""),
    category: text("category").notNull().default("News"),
    publishedAt: text("published_at"),
    seoTitle: text("seo_title").notNull().default(""),
    seoDescription: text("seo_description").notNull().default(""),
    ...timestamps,
  },
  (table) => [
    index("posts_status_idx").on(table.status),
    index("posts_published_at_idx").on(table.publishedAt),
  ],
);

export const products = sqliteTable(
  "products",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    family: text("family").notNull().default("Solar Products"),
    status: text("status").notNull().default("active"),
    summary: text("summary").notNull().default(""),
    description: text("description").notNull().default(""),
    image: text("image").notNull().default(""),
    tag: text("tag").notNull().default(""),
    specifications: text("specifications").notNull().default("[]"),
    menuOrder: integer("menu_order").notNull().default(0),
    seoTitle: text("seo_title").notNull().default(""),
    seoDescription: text("seo_description").notNull().default(""),
    ...timestamps,
  },
  (table) => [
    index("products_status_idx").on(table.status),
    index("products_family_idx").on(table.family),
    index("products_menu_order_idx").on(table.menuOrder),
  ],
);

export const menuItems = sqliteTable(
  "menu_items",
  {
    id: text("id").primaryKey(),
    label: text("label").notNull(),
    url: text("url").notNull(),
    location: text("location").notNull().default("header"),
    parentId: text("parent_id"),
    sortOrder: integer("sort_order").notNull().default(0),
    openNewTab: integer("open_new_tab", { mode: "boolean" })
      .notNull()
      .default(false),
    isActive: integer("is_active", { mode: "boolean" })
      .notNull()
      .default(true),
    ...timestamps,
  },
  (table) => [
    index("menu_location_idx").on(table.location),
    index("menu_parent_idx").on(table.parentId),
    index("menu_sort_order_idx").on(table.sortOrder),
  ],
);

export const formSubmissions = sqliteTable(
  "form_submissions",
  {
    id: text("id").primaryKey(),
    formType: text("form_type").notNull().default("contact"),
    name: text("name").notNull().default(""),
    email: text("email").notNull().default(""),
    phone: text("phone").notNull().default(""),
    city: text("city").notNull().default(""),
    subject: text("subject").notNull().default(""),
    message: text("message").notNull().default(""),
    product: text("product").notNull().default(""),
    status: text("status").notNull().default("new"),
    sourcePath: text("source_path").notNull().default("/"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    index("form_status_idx").on(table.status),
    index("form_created_at_idx").on(table.createdAt),
  ],
);

export const pageViews = sqliteTable(
  "page_views",
  {
    id: text("id").primaryKey(),
    path: text("path").notNull(),
    referrer: text("referrer").notNull().default(""),
    sessionId: text("session_id").notNull().default(""),
    device: text("device").notNull().default("desktop"),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    index("page_views_path_idx").on(table.path),
    index("page_views_created_at_idx").on(table.createdAt),
    index("page_views_session_idx").on(table.sessionId),
  ],
);

export const media = sqliteTable(
  "media",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    url: text("url").notNull(),
    contentType: text("content_type").notNull().default("application/octet-stream"),
    size: integer("size").notNull().default(0),
    altText: text("alt_text").notNull().default(""),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [index("media_created_at_idx").on(table.createdAt)],
);

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
  updatedAt: text("updated_at").notNull(),
});
