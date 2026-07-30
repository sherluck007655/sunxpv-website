type D1Result<T> = {
  results?: T[];
  success?: boolean;
  meta?: Record<string, unknown>;
};

type D1Statement = {
  bind: (...values: unknown[]) => D1Statement;
  all: <T>() => Promise<D1Result<T>>;
  first: <T>() => Promise<T | null>;
  run: () => Promise<D1Result<unknown>>;
};

type D1DatabaseLike = {
  prepare: (query: string) => D1Statement;
};

type R2ObjectLike = {
  body: ReadableStream;
  httpEtag?: string;
  httpMetadata?: {
    contentType?: string;
  };
};

type R2BucketLike = {
  put: (
    key: string,
    value: ArrayBuffer,
    options?: { httpMetadata?: { contentType?: string } },
  ) => Promise<void>;
  get: (key: string) => Promise<R2ObjectLike | null>;
  delete: (key: string) => Promise<void>;
};

export type CmsResource =
  | "pages"
  | "posts"
  | "products"
  | "menus"
  | "forms"
  | "settings";

type ResourceConfig = {
  table: string;
  primaryKey: string;
  fields: string[];
  defaults: Record<string, unknown>;
  orderBy: string;
};

const resources: Record<CmsResource, ResourceConfig> = {
  pages: {
    table: "pages",
    primaryKey: "id",
    fields: [
      "title",
      "slug",
      "status",
      "content",
      "template",
      "parent_id",
      "menu_order",
      "seo_title",
      "seo_description",
    ],
    defaults: {
      title: "Untitled page",
      slug: "untitled-page",
      status: "draft",
      content: "",
      template: "standard",
      parent_id: null,
      menu_order: 0,
      seo_title: "",
      seo_description: "",
    },
    orderBy: "menu_order ASC, updated_at DESC",
  },
  posts: {
    table: "posts",
    primaryKey: "id",
    fields: [
      "title",
      "slug",
      "status",
      "excerpt",
      "content",
      "featured_image",
      "category",
      "published_at",
      "seo_title",
      "seo_description",
    ],
    defaults: {
      title: "Untitled post",
      slug: "untitled-post",
      status: "draft",
      excerpt: "",
      content: "",
      featured_image: "",
      category: "News",
      published_at: null,
      seo_title: "",
      seo_description: "",
    },
    orderBy: "updated_at DESC",
  },
  products: {
    table: "products",
    primaryKey: "id",
    fields: [
      "name",
      "slug",
      "family",
      "status",
      "summary",
      "description",
      "image",
      "tag",
      "specifications",
      "menu_order",
      "seo_title",
      "seo_description",
    ],
    defaults: {
      name: "New product",
      slug: "new-product",
      family: "Solar Products",
      status: "draft",
      summary: "",
      description: "",
      image: "",
      tag: "",
      specifications: "[]",
      menu_order: 0,
      seo_title: "",
      seo_description: "",
    },
    orderBy: "menu_order ASC, updated_at DESC",
  },
  menus: {
    table: "menu_items",
    primaryKey: "id",
    fields: [
      "label",
      "url",
      "location",
      "parent_id",
      "sort_order",
      "open_new_tab",
      "is_active",
    ],
    defaults: {
      label: "Menu item",
      url: "/",
      location: "header",
      parent_id: null,
      sort_order: 0,
      open_new_tab: 0,
      is_active: 1,
    },
    orderBy: "location ASC, sort_order ASC, updated_at DESC",
  },
  forms: {
    table: "form_submissions",
    primaryKey: "id",
    fields: [
      "form_type",
      "name",
      "email",
      "phone",
      "city",
      "subject",
      "message",
      "product",
      "status",
      "source_path",
    ],
    defaults: {
      form_type: "contact",
      name: "",
      email: "",
      phone: "",
      city: "",
      subject: "",
      message: "",
      product: "",
      status: "new",
      source_path: "/",
    },
    orderBy: "created_at DESC",
  },
  settings: {
    table: "settings",
    primaryKey: "key",
    fields: ["value"],
    defaults: { value: "" },
    orderBy: "key ASC",
  },
};

async function runtimeBindings(): Promise<Record<string, unknown>> {
  try {
    const runtime = (await import("cloudflare:workers")) as unknown as {
      env?: Record<string, unknown>;
    };
    if (runtime.env) return runtime.env;
  } catch {
    // The Worker entry also exposes bindings for artifact validation and
    // alternate runtimes where the Cloudflare module is not available.
  }
  return (
    globalThis as typeof globalThis & {
      __SUNX_RUNTIME_BINDINGS__?: Record<string, unknown>;
    }
  ).__SUNX_RUNTIME_BINDINGS__ ?? {};
}

async function database(): Promise<D1DatabaseLike> {
  const binding = (await runtimeBindings()).DB as D1DatabaseLike | undefined;
  if (!binding) throw new Error("CMS database binding is unavailable");
  return binding;
}

export async function mediaBucket(): Promise<R2BucketLike> {
  const binding = (await runtimeBindings()).BUCKET as R2BucketLike | undefined;
  if (!binding) throw new Error("Media storage binding is unavailable");
  return binding;
}

function normalizedValue(value: unknown): unknown {
  if (typeof value === "boolean") return value ? 1 : 0;
  if (value === undefined) return null;
  if (typeof value === "object" && value !== null) return JSON.stringify(value);
  return value;
}

function editableValues(
  config: ResourceConfig,
  input: Record<string, unknown>,
): Record<string, unknown> {
  return Object.fromEntries(
    config.fields
      .filter((field) => Object.hasOwn(input, field))
      .map((field) => [field, normalizedValue(input[field])]),
  );
}

export async function listResource<T extends Record<string, unknown>>(
  resource: CmsResource,
): Promise<T[]> {
  const config = resources[resource];
  const result = await (await database())
    .prepare(`SELECT * FROM ${config.table} ORDER BY ${config.orderBy} LIMIT 1000`)
    .all<T>();
  return result.results ?? [];
}

export async function createResource(
  resource: CmsResource,
  input: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const config = resources[resource];
  const now = new Date().toISOString();
  const values = {
    ...config.defaults,
    ...editableValues(config, input),
  };
  const primaryValue =
    resource === "settings"
      ? String(input.key ?? "")
      : String(input.id ?? crypto.randomUUID());
  if (!primaryValue) throw new Error("A setting key is required");

  const columns = [config.primaryKey, ...Object.keys(values), "created_at", "updated_at"];
  if (resource === "settings") {
    columns.splice(columns.indexOf("created_at"), 1);
  }
  const rowValues = [
    primaryValue,
    ...Object.values(values),
    ...(resource === "settings" ? [now] : [now, now]),
  ];
  const placeholders = columns.map(() => "?").join(", ");
  const updates = [...Object.keys(values), "updated_at"]
    .map((column) => `${column} = excluded.${column}`)
    .join(", ");
  const conflict =
    resource === "settings"
      ? ` ON CONFLICT (${config.primaryKey}) DO UPDATE SET ${updates}`
      : "";

  await (await database())
    .prepare(
      `INSERT INTO ${config.table} (${columns.join(", ")}) VALUES (${placeholders})${conflict}`,
    )
    .bind(...rowValues)
    .run();

  return {
    [config.primaryKey]: primaryValue,
    ...values,
    ...(resource === "settings"
      ? { updated_at: now }
      : { created_at: now, updated_at: now }),
  };
}

export async function updateResource(
  resource: CmsResource,
  id: string,
  input: Record<string, unknown>,
): Promise<void> {
  const config = resources[resource];
  const values = editableValues(config, input);
  const entries = Object.entries(values);
  if (!entries.length) return;
  const now = new Date().toISOString();
  const assignments = [...entries.map(([field]) => `${field} = ?`), "updated_at = ?"];

  await (await database())
    .prepare(
      `UPDATE ${config.table} SET ${assignments.join(", ")} WHERE ${config.primaryKey} = ?`,
    )
    .bind(...entries.map(([, value]) => value), now, id)
    .run();
}

export async function deleteResource(
  resource: CmsResource,
  id: string,
): Promise<void> {
  const config = resources[resource];
  if (resource === "pages") {
    await updateResource("pages", id, { status: "archived" });
    return;
  }
  await (await database())
    .prepare(`DELETE FROM ${config.table} WHERE ${config.primaryKey} = ?`)
    .bind(id)
    .run();
}

export async function getPublicContent() {
  const db = await database();
  const [pageRows, postRows, productRows, menuRows, settingRows] =
    await Promise.all([
      db
        .prepare(
          "SELECT * FROM pages ORDER BY menu_order ASC, updated_at DESC",
        )
        .all<Record<string, unknown>>(),
      db
        .prepare(
          "SELECT * FROM posts WHERE status = ? ORDER BY COALESCE(published_at, created_at) DESC",
        )
        .bind("published")
        .all<Record<string, unknown>>(),
      db
        .prepare(
          "SELECT * FROM products WHERE status = ? ORDER BY menu_order ASC, updated_at DESC",
        )
        .bind("active")
        .all<Record<string, unknown>>(),
      db
        .prepare(
          "SELECT * FROM menu_items WHERE is_active = 1 ORDER BY location ASC, sort_order ASC",
        )
        .all<Record<string, unknown>>(),
      db
        .prepare("SELECT * FROM settings ORDER BY key ASC")
        .all<Record<string, unknown>>(),
    ]);

  return {
    pages: pageRows.results ?? [],
    posts: postRows.results ?? [],
    products: productRows.results ?? [],
    menus: menuRows.results ?? [],
    settings: Object.fromEntries(
      (settingRows.results ?? []).map((row) => [String(row.key), row.value]),
    ),
  };
}

const defaultPages = [
  ["home", "Home", "", 0],
  ["about", "About Us", "about-us", 1],
  ["products", "Products", "products", 2],
  ["prime", "Sun-Prime Series", "sun-prime-series", 3],
  ["pro", "Sun-Pro Series", "sun-pro-series", 4],
  ["ultra", "Sun-Ultra Series", "sun-ultra-series", 5],
  ["max", "Sun-Max Series", "sun-max-series", 6],
  ["dealers", "SunX Dealers", "sunx-dealers", 7],
  ["installers", "Find an Installer", "find-an-installer", 8],
  ["downloads", "Download Center", "download-center", 9],
  ["warranty", "Product Warranty", "sunx-product-warranty", 10],
  ["contact", "Contact Us", "contact-us", 11],
  ["blogs", "News and Media", "blogs", 12],
];

const defaultProducts = [
  ["prime-4", "Sun-Prime 4kW", "Sun Prime Series", "/images/prime-product.png", "Hybrid inverter"],
  ["prime-62", "Sun-Prime 6.2kW", "Sun Prime Series", "/images/prime-product.png", "Dual output"],
  ["prime-8", "Sun-Prime 8kW", "Sun Prime Series", "/images/prime-product.png", "High capacity"],
  ["prime-11", "Sun-Prime 11kW", "Sun Prime Series", "/images/prime-product.png", "11kW output"],
  ["pro-4", "Sun-Pro 4kW", "Sun Pro Series", "/images/pro-product.png", "Smart monitoring"],
  ["pro-6", "Sun-Pro 6kW", "Sun Pro Series", "/images/pro-product.png", "Wi-Fi ready"],
  ["pro-8", "Sun-Pro 8kW", "Sun Pro Series", "/images/pro-product.png", "MPPT technology"],
  ["ultra-8", "Sun-Ultra 8kW", "Sun Ultra Series", "/images/ultra-8kw.png", "93% efficiency"],
  ["ultra-10", "Sun-Ultra 10kW", "Sun Ultra Series", "/images/ultra-11kw.png", "Parallel ready"],
  ["max-6", "Sun-Max 6kW", "Sun Max Series", "/images/sunmax-product.png", "IP65 design"],
  ["lixor-100", "Lixor Power 25.6V 100Ah", "Lithium Batteries", "/images/lixor-battery.jpeg", "LiFePO4"],
  ["wall-100", "Power Wall 51.2V 100Ah", "Lithium Batteries", "/images/powerwall-standard.png", "Smart BMS"],
  ["wall-200", "Power Wall 51.2V 200Ah", "Lithium Batteries", "/images/powerwall-max.png", "Long life"],
];

const defaultMenus = [
  ["company", "Company", "/about-us/", null, 1],
  ["company-profile", "Profile", "/about-us/", "company", 1],
  ["company-story", "Our Story", "/about-us/#story", "company", 2],
  ["products", "Products", "/products/", null, 2],
  ["products-prime", "Sun-Prime Series", "/sun-prime-series/", "products", 1],
  ["products-pro", "Sun-Pro Series", "/sun-pro-series/", "products", 2],
  ["products-ultra", "Sun-Ultra Series", "/sun-ultra-series/", "products", 3],
  ["products-max", "Sun-Max Series", "/sun-max-series/", "products", 4],
  ["partner", "Partner", "/sunx-dealers/", null, 3],
  ["partner-dealers", "Find a Distributor", "/sunx-dealers/", "partner", 1],
  ["partner-installers", "Find an Installer", "/find-an-installer/", "partner", 2],
  ["support", "Support", "/download-center/", null, 4],
  ["support-downloads", "Downloads", "/download-center/", "support", 1],
  ["support-warranty", "Warranty", "/sunx-product-warranty/", "support", 2],
  ["support-contact", "Contact Us", "/contact-us/", "support", 3],
  ["news", "News and Media", "/blogs/", null, 5],
];

export async function ensureCmsDefaults() {
  const db = await database();
  const existing = await db
    .prepare("SELECT value FROM settings WHERE key = ?")
    .bind("cms_initialized")
    .first<{ value: string }>();
  if (existing?.value === "1") return;

  const now = new Date().toISOString();
  for (const [id, title, slug, order] of defaultPages) {
    await db
      .prepare(
        "INSERT OR IGNORE INTO pages (id, title, slug, status, content, template, parent_id, menu_order, seo_title, seo_description, created_at, updated_at) VALUES (?, ?, ?, 'published', '', 'legacy', NULL, ?, '', '', ?, ?)",
      )
      .bind(`page-${id}`, title, slug, order, now, now)
      .run();
  }
  for (const [id, name, family, image, tag] of defaultProducts) {
    await db
      .prepare(
        "INSERT OR IGNORE INTO products (id, name, slug, family, status, summary, description, image, tag, specifications, menu_order, seo_title, seo_description, created_at, updated_at) VALUES (?, ?, ?, ?, 'active', ?, '', ?, ?, '[]', ?, '', '', ?, ?)",
      )
      .bind(
        `product-${id}`,
        name,
        id,
        family,
        `${name} solar energy product from SunX PV Technology.`,
        image,
        tag,
        defaultProducts.findIndex((item) => item[0] === id),
        now,
        now,
      )
      .run();
  }
  for (const [id, label, url, parentId, order] of defaultMenus) {
    await db
      .prepare(
        "INSERT OR IGNORE INTO menu_items (id, label, url, location, parent_id, sort_order, open_new_tab, is_active, created_at, updated_at) VALUES (?, ?, ?, 'header', ?, ?, 0, 1, ?, ?)",
      )
      .bind(
        `menu-${id}`,
        label,
        url,
        parentId ? `menu-${parentId}` : null,
        order,
        now,
        now,
      )
      .run();
  }
  const initialSettings = [
    ["site_title", "SunX PV Technology"],
    [
      "site_description",
      "Solar inverters and lithium batteries for homes and businesses across Pakistan.",
    ],
    ["canonical_url", "https://sunxpv.com"],
    ["company_email", "info@sunxpv.com"],
    ["company_phone", "+92 342 947 0099"],
    ["cms_initialized", "1"],
  ];
  for (const [key, value] of initialSettings) {
    await db
      .prepare(
        "INSERT OR IGNORE INTO settings (key, value, updated_at) VALUES (?, ?, ?)",
      )
      .bind(key, value, now)
      .run();
  }
}

export async function recordFormSubmission(input: Record<string, unknown>) {
  return createResource("forms", input);
}

export async function recordPageView(input: {
  path: string;
  referrer?: string;
  sessionId?: string;
  device?: string;
}) {
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  await (await database())
    .prepare(
      "INSERT INTO page_views (id, path, referrer, session_id, device, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    )
    .bind(
      id,
      input.path.slice(0, 300),
      (input.referrer ?? "").slice(0, 500),
      (input.sessionId ?? "").slice(0, 100),
      (input.device ?? "desktop").slice(0, 30),
      now,
    )
    .run();
}

export async function getAnalytics() {
  const db = await database();
  const [total, today, unique, topPages, recentDays, contentCounts, leadCounts] =
    await Promise.all([
      db.prepare("SELECT COUNT(*) AS count FROM page_views").first<{ count: number }>(),
      db
        .prepare(
          "SELECT COUNT(*) AS count FROM page_views WHERE created_at >= strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-1 day')",
        )
        .first<{ count: number }>(),
      db
        .prepare(
          "SELECT COUNT(DISTINCT session_id) AS count FROM page_views WHERE session_id != ''",
        )
        .first<{ count: number }>(),
      db
        .prepare(
          "SELECT path, COUNT(*) AS views FROM page_views GROUP BY path ORDER BY views DESC LIMIT 10",
        )
        .all<{ path: string; views: number }>(),
      db
        .prepare(
          "SELECT substr(created_at, 1, 10) AS day, COUNT(*) AS views FROM page_views WHERE created_at >= strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-14 days') GROUP BY day ORDER BY day ASC",
        )
        .all<{ day: string; views: number }>(),
      db
        .prepare(
          "SELECT (SELECT COUNT(*) FROM pages) AS pages, (SELECT COUNT(*) FROM posts) AS posts, (SELECT COUNT(*) FROM products) AS products",
        )
        .first<{ pages: number; posts: number; products: number }>(),
      db
        .prepare(
          "SELECT COUNT(*) AS total, SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) AS unread FROM form_submissions",
        )
        .first<{ total: number; unread: number }>(),
    ]);

  return {
    totalViews: Number(total?.count ?? 0),
    viewsToday: Number(today?.count ?? 0),
    uniqueVisitors: Number(unique?.count ?? 0),
    topPages: topPages.results ?? [],
    recentDays: recentDays.results ?? [],
    counts: {
      pages: Number(contentCounts?.pages ?? 0),
      posts: Number(contentCounts?.posts ?? 0),
      products: Number(contentCounts?.products ?? 0),
      leads: Number(leadCounts?.total ?? 0),
      unreadLeads: Number(leadCounts?.unread ?? 0),
    },
  };
}

export async function mediaRecord(id: string) {
  return (await database())
    .prepare("SELECT * FROM media WHERE id = ?")
    .bind(id)
    .first<Record<string, unknown>>();
}

export async function listMedia() {
  const result = await (await database())
    .prepare("SELECT * FROM media ORDER BY created_at DESC")
    .all<Record<string, unknown>>();
  return result.results ?? [];
}

export async function saveMedia(input: {
  id: string;
  name: string;
  contentType: string;
  size: number;
  altText: string;
}) {
  const now = new Date().toISOString();
  const url = `/api/media/${input.id}`;
  await (await database())
    .prepare(
      "INSERT INTO media (id, name, url, content_type, size, alt_text, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(
      input.id,
      input.name,
      url,
      input.contentType,
      input.size,
      input.altText,
      now,
      now,
    )
    .run();
  return { ...input, url, created_at: now, updated_at: now };
}

export async function deleteMediaRecord(id: string) {
  await (await database())
    .prepare("DELETE FROM media WHERE id = ?")
    .bind(id)
    .run();
}
