/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-img-element, react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type CmsItem = Record<string, string | number | boolean | null>;

type Analytics = {
  totalViews: number;
  viewsToday: number;
  uniqueVisitors: number;
  topPages: { path: string; views: number }[];
  recentDays: { day: string; views: number }[];
  counts: {
    pages: number;
    posts: number;
    products: number;
    leads: number;
    unreadLeads: number;
  };
};

type Section =
  | "dashboard"
  | "pages"
  | "posts"
  | "products"
  | "menus"
  | "forms"
  | "analytics"
  | "media"
  | "seo"
  | "settings";

const nav: { section: Section; label: string; icon: string }[] = [
  { section: "dashboard", label: "Dashboard", icon: "⌂" },
  { section: "pages", label: "Pages", icon: "▤" },
  { section: "posts", label: "Posts", icon: "✎" },
  { section: "products", label: "Products", icon: "◇" },
  { section: "menus", label: "Menus", icon: "☷" },
  { section: "forms", label: "Form entries", icon: "✉" },
  { section: "analytics", label: "Traffic", icon: "↗" },
  { section: "media", label: "Media", icon: "▧" },
  { section: "seo", label: "SEO", icon: "◎" },
  { section: "settings", label: "Settings", icon: "⚙" },
];

const initialAnalytics: Analytics = {
  totalViews: 0,
  viewsToday: 0,
  uniqueVisitors: 0,
  topPages: [],
  recentDays: [],
  counts: { pages: 0, posts: 0, products: 0, leads: 0, unreadLeads: 0 },
};

function titleCase(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function itemId(item: CmsItem) {
  return String(item.id ?? item.key ?? "");
}

function asText(value: unknown) {
  return value === null || value === undefined ? "" : String(value);
}

async function cmsRequest(
  resource: string,
  options?: RequestInit,
): Promise<Record<string, unknown>> {
  const response = await fetch(`/api/cms/${resource}`, {
    ...options,
    headers:
      options?.body instanceof FormData
        ? options.headers
        : { "content-type": "application/json", ...options?.headers },
  });
  const data = (await response.json()) as Record<string, unknown>;
  if (!response.ok) throw new Error(String(data.error ?? "Dashboard request failed"));
  return data;
}

function Status({ value }: { value: unknown }) {
  const label = asText(value || "draft");
  return <span className={`admin-status status-${slugify(label)}`}>{label}</span>;
}

function EmptyState({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="admin-empty">
      <span>＋</span>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}

function StatCard({
  label,
  value,
  note,
}: {
  label: string;
  value: number | string;
  note: string;
}) {
  return (
    <article className="admin-stat">
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{note}</span>
    </article>
  );
}

function DashboardHome({ analytics }: { analytics: Analytics }) {
  const maxViews = Math.max(1, ...analytics.recentDays.map((day) => day.views));
  return (
    <>
      <div className="admin-welcome">
        <div>
          <span className="admin-kicker">SunX control center</span>
          <h1>Everything needed to manage the website</h1>
          <p>
            Publish content, update products, review customer inquiries, and
            understand website traffic from one place.
          </p>
        </div>
        <a className="admin-button primary" href="/" target="_blank">
          View website ↗
        </a>
      </div>
      <div className="admin-stats">
        <StatCard
          label="Total views"
          value={analytics.totalViews}
          note={`${analytics.viewsToday} in the last 24 hours`}
        />
        <StatCard
          label="Visitors"
          value={analytics.uniqueVisitors}
          note="Anonymous unique sessions"
        />
        <StatCard
          label="Content"
          value={
            analytics.counts.pages +
            analytics.counts.posts +
            analytics.counts.products
          }
          note={`${analytics.counts.products} products`}
        />
        <StatCard
          label="Form entries"
          value={analytics.counts.leads}
          note={`${analytics.counts.unreadLeads} new inquiries`}
        />
      </div>
      <div className="admin-dashboard-grid">
        <section className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <span className="admin-kicker">Last 14 days</span>
              <h2>Traffic overview</h2>
            </div>
            <a href="/admin/analytics">Full report</a>
          </div>
          {analytics.recentDays.length ? (
            <div className="mini-chart" aria-label="Traffic chart">
              {analytics.recentDays.map((day) => (
                <div key={day.day}>
                  <span
                    style={{ height: `${Math.max(7, (day.views / maxViews) * 100)}%` }}
                    title={`${day.day}: ${day.views} views`}
                  />
                  <small>{day.day.slice(5)}</small>
                </div>
              ))}
            </div>
          ) : (
            <p className="admin-muted">Traffic will appear after website visits.</p>
          )}
        </section>
        <section className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <span className="admin-kicker">Shortcuts</span>
              <h2>Quick actions</h2>
            </div>
          </div>
          <div className="quick-actions">
            <a href="/admin/pages">＋ Add a page</a>
            <a href="/admin/products">＋ Add a product</a>
            <a href="/admin/posts">＋ Write a post</a>
            <a href="/admin/menus">☷ Edit navigation</a>
            <a href="/admin/forms">✉ Read inquiries</a>
            <a href="/admin/seo">◎ Improve SEO</a>
          </div>
        </section>
      </div>
    </>
  );
}

type Field = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "select" | "number" | "url" | "image";
  options?: string[];
  placeholder?: string;
  help?: string;
};

const editorConfig: Record<
  "pages" | "posts" | "products" | "menus",
  { singular: string; titleKey: string; fields: Field[]; defaults: CmsItem }
> = {
  pages: {
    singular: "page",
    titleKey: "title",
    defaults: {
      title: "New page",
      slug: "new-page",
      status: "draft",
      content: "",
      template: "standard",
      parent_id: null,
      menu_order: 0,
      seo_title: "",
      seo_description: "",
    },
    fields: [
      { key: "title", label: "Page title" },
      { key: "slug", label: "URL slug", help: "Example: solar-solutions" },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: ["draft", "published"],
      },
      {
        key: "template",
        label: "Layout",
        type: "select",
        options: ["standard", "landing", "full-width"],
      },
      { key: "content", label: "Page content", type: "textarea" },
      { key: "parent_id", label: "Parent page id", placeholder: "Optional" },
      { key: "menu_order", label: "Order", type: "number" },
      { key: "seo_title", label: "SEO title" },
      { key: "seo_description", label: "SEO description", type: "textarea" },
    ],
  },
  posts: {
    singular: "post",
    titleKey: "title",
    defaults: {
      title: "New post",
      slug: "new-post",
      status: "draft",
      excerpt: "",
      content: "",
      featured_image: "",
      category: "News",
      published_at: "",
      seo_title: "",
      seo_description: "",
    },
    fields: [
      { key: "title", label: "Post title" },
      { key: "slug", label: "URL slug" },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: ["draft", "published"],
      },
      { key: "category", label: "Category" },
      { key: "excerpt", label: "Short summary", type: "textarea" },
      { key: "content", label: "Article content", type: "textarea" },
      { key: "featured_image", label: "Featured image URL", type: "url" },
      { key: "published_at", label: "Publish date" },
      { key: "seo_title", label: "SEO title" },
      { key: "seo_description", label: "SEO description", type: "textarea" },
    ],
  },
  products: {
    singular: "product",
    titleKey: "name",
    defaults: {
      name: "New product",
      slug: "new-product",
      family: "Solar Inverters",
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
    fields: [
      { key: "name", label: "Product name" },
      { key: "slug", label: "URL slug" },
      {
        key: "family",
        label: "Product family",
        type: "select",
        options: [
          "Solar Inverters",
          "Lithium Batteries",
          "All-In-One ESS",
          "Accessories",
        ],
      },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: ["draft", "active", "archived"],
      },
      { key: "tag", label: "Product label", placeholder: "Example: Best seller" },
      { key: "summary", label: "Short summary", type: "textarea" },
      { key: "description", label: "Full description", type: "textarea" },
      { key: "image", label: "Product image URL", type: "url" },
      {
        key: "specifications",
        label: "Specifications",
        type: "textarea",
        help: "Use JSON, for example: [{\"label\":\"Power\",\"value\":\"6 kW\"}]",
      },
      { key: "menu_order", label: "Display order", type: "number" },
      { key: "seo_title", label: "SEO title" },
      { key: "seo_description", label: "SEO description", type: "textarea" },
    ],
  },
  menus: {
    singular: "menu item",
    titleKey: "label",
    defaults: {
      label: "New menu item",
      url: "/",
      location: "header",
      parent_id: null,
      sort_order: 0,
      open_new_tab: 0,
      is_active: 1,
    },
    fields: [
      { key: "label", label: "Navigation label" },
      { key: "url", label: "Link URL" },
      {
        key: "location",
        label: "Menu location",
        type: "select",
        options: ["header", "footer-company", "footer-products", "footer-support"],
      },
      {
        key: "parent_id",
        label: "Parent item id",
        help: "Paste a parent item id here to create a submenu.",
      },
      { key: "sort_order", label: "Order", type: "number" },
      {
        key: "open_new_tab",
        label: "Open in new tab",
        type: "select",
        options: ["0", "1"],
      },
      {
        key: "is_active",
        label: "Visible",
        type: "select",
        options: ["1", "0"],
      },
    ],
  },
};

function ContentManager({
  resource,
  notify,
}: {
  resource: "pages" | "posts" | "products" | "menus";
  notify: (message: string, type?: "success" | "error") => void;
}) {
  const config = editorConfig[resource];
  const [items, setItems] = useState<CmsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CmsItem | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await cmsRequest(resource);
      setItems((data.items as CmsItem[]) ?? []);
    } catch (error) {
      notify(error instanceof Error ? error.message : "Could not load content", "error");
    } finally {
      setLoading(false);
    }
  }, [resource, notify]);

  useEffect(() => {
    void load();
  }, [load]);

  function change(key: string, value: string) {
    setEditing((current) => {
      if (!current) return current;
      const next = { ...current, [key]: value };
      if (
        (key === "title" || key === "name") &&
        (!current.id || asText(current.slug).startsWith("new-"))
      ) {
        next.slug = slugify(value);
      }
      return next;
    });
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const id = itemId(editing);
      await cmsRequest(resource, {
        method: id ? "PATCH" : "POST",
        body: JSON.stringify(editing),
      });
      notify(`${titleCase(config.singular)} saved`);
      setEditing(null);
      await load();
    } catch (error) {
      notify(error instanceof Error ? error.message : "Could not save", "error");
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: CmsItem) {
    const id = itemId(item);
    if (!id || !window.confirm(`Delete this ${config.singular}?`)) return;
    try {
      await cmsRequest(`${resource}?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      notify(`${titleCase(config.singular)} deleted`);
      await load();
    } catch (error) {
      notify(error instanceof Error ? error.message : "Could not delete", "error");
    }
  }

  return (
    <div className="content-manager">
      <div className="admin-page-head">
        <div>
          <span className="admin-kicker">Content management</span>
          <h1>{titleCase(resource)}</h1>
          <p>
            Add, edit, publish, or remove {resource}. Published changes appear on
            the public website.
          </p>
        </div>
        <button
          className="admin-button primary"
          type="button"
          onClick={() => setEditing({ ...config.defaults })}
        >
          ＋ Add {config.singular}
        </button>
      </div>

      {editing ? (
        <form className="admin-editor" onSubmit={save}>
          <div className="admin-editor-head">
            <div>
              <span className="admin-kicker">
                {itemId(editing) ? "Edit content" : "Create content"}
              </span>
              <h2>{asText(editing[config.titleKey])}</h2>
            </div>
            <button
              className="admin-icon-button"
              type="button"
              onClick={() => setEditing(null)}
              aria-label="Close editor"
            >
              ×
            </button>
          </div>
          <div className="admin-form-grid">
            {config.fields.map((field) => (
              <label
                key={field.key}
                className={field.type === "textarea" ? "admin-field-wide" : ""}
              >
                <span>{field.label}</span>
                {field.type === "textarea" ? (
                  <textarea
                    rows={
                      field.key === "content" || field.key === "description" ? 9 : 4
                    }
                    value={asText(editing[field.key])}
                    onChange={(event) => change(field.key, event.target.value)}
                    placeholder={field.placeholder}
                  />
                ) : field.type === "select" ? (
                  <select
                    value={asText(editing[field.key])}
                    onChange={(event) => change(field.key, event.target.value)}
                  >
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option === "1"
                          ? "Yes"
                          : option === "0"
                            ? "No"
                            : titleCase(option)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type ?? "text"}
                    value={asText(editing[field.key])}
                    onChange={(event) => change(field.key, event.target.value)}
                    placeholder={field.placeholder}
                  />
                )}
                {field.help ? <small>{field.help}</small> : null}
              </label>
            ))}
          </div>
          <div className="admin-editor-actions">
            <button
              className="admin-button subtle"
              type="button"
              onClick={() => setEditing(null)}
            >
              Cancel
            </button>
            <button className="admin-button primary" type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      ) : null}

      <section className="admin-table-card">
        {loading ? (
          <div className="admin-loading">Loading {resource}…</div>
        ) : items.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{config.titleKey === "name" ? "Name" : "Title"}</th>
                  <th>{resource === "menus" ? "Location" : "Status"}</th>
                  <th>{resource === "menus" ? "URL" : "Slug"}</th>
                  <th>Updated</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={itemId(item)}>
                    <td>
                      <strong>{asText(item[config.titleKey])}</strong>
                      <small>{itemId(item)}</small>
                    </td>
                    <td>
                      {resource === "menus" ? (
                        titleCase(asText(item.location))
                      ) : (
                        <Status value={item.status} />
                      )}
                    </td>
                    <td>{asText(resource === "menus" ? item.url : item.slug)}</td>
                    <td>
                      {item.updated_at
                        ? new Date(asText(item.updated_at)).toLocaleDateString()
                        : "—"}
                    </td>
                    <td>
                      <div className="row-actions">
                        <button type="button" onClick={() => setEditing({ ...item })}>
                          Edit
                        </button>
                        <button type="button" onClick={() => void remove(item)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title={`No ${resource} yet`}
            text={`Create the first ${config.singular} to start managing this section.`}
            action={
              <button
                className="admin-button primary"
                type="button"
                onClick={() => setEditing({ ...config.defaults })}
              >
                Add {config.singular}
              </button>
            }
          />
        )}
      </section>
    </div>
  );
}

function FormsManager({
  notify,
}: {
  notify: (message: string, type?: "success" | "error") => void;
}) {
  const [items, setItems] = useState<CmsItem[]>([]);
  const [selected, setSelected] = useState<CmsItem | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await cmsRequest("forms");
      setItems((data.items as CmsItem[]) ?? []);
    } catch (error) {
      notify(error instanceof Error ? error.message : "Could not load entries", "error");
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    void load();
  }, [load]);

  async function mark(item: CmsItem, status: string) {
    await cmsRequest("forms", {
      method: "PATCH",
      body: JSON.stringify({ id: item.id, status }),
    });
    notify(`Entry marked as ${status}`);
    await load();
    setSelected((current) => (current ? { ...current, status } : null));
  }

  function exportCsv() {
    const columns = [
      "created_at",
      "name",
      "email",
      "phone",
      "city",
      "subject",
      "message",
      "status",
    ];
    const csv = [
      columns.join(","),
      ...items.map((item) =>
        columns
          .map((column) => `"${asText(item[column]).replaceAll('"', '""')}"`)
          .join(","),
      ),
    ].join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = `sunx-form-entries-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <span className="admin-kicker">Customer inquiries</span>
          <h1>Form entries</h1>
          <p>Every website inquiry is saved here and can be exported for follow-up.</p>
        </div>
        <button
          className="admin-button subtle"
          type="button"
          onClick={exportCsv}
          disabled={!items.length}
        >
          Export CSV
        </button>
      </div>
      <section className="admin-table-card">
        {loading ? (
          <div className="admin-loading">Loading form entries…</div>
        ) : items.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Contact</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Received</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={itemId(item)}>
                    <td>
                      <strong>{asText(item.name)}</strong>
                      <small>{asText(item.email)}</small>
                    </td>
                    <td>{asText(item.subject || item.form_type)}</td>
                    <td>
                      <Status value={item.status} />
                    </td>
                    <td>{new Date(asText(item.created_at)).toLocaleString()}</td>
                    <td>
                      <button
                        className="table-link"
                        type="button"
                        onClick={() => {
                          setSelected(item);
                          if (item.status === "new") void mark(item, "read");
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No inquiries yet"
            text="New contact form entries will automatically appear here."
          />
        )}
      </section>
      {selected ? (
        <div className="admin-modal" role="dialog" aria-modal="true">
          <div className="admin-modal-card">
            <button
              className="admin-icon-button"
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Close inquiry"
            >
              ×
            </button>
            <span className="admin-kicker">Website inquiry</span>
            <h2>{asText(selected.subject || "Contact request")}</h2>
            <dl className="lead-details">
              <div>
                <dt>Name</dt>
                <dd>{asText(selected.name)}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${asText(selected.email)}`}>
                    {asText(selected.email)}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{asText(selected.phone) || "—"}</dd>
              </div>
              <div>
                <dt>City</dt>
                <dd>{asText(selected.city) || "—"}</dd>
              </div>
            </dl>
            <div className="lead-message">{asText(selected.message)}</div>
            <div className="admin-editor-actions">
              <button
                className="admin-button subtle"
                type="button"
                onClick={() => void mark(selected, "archived")}
              >
                Archive
              </button>
              <a
                className="admin-button primary"
                href={`mailto:${asText(selected.email)}?subject=${encodeURIComponent(`Re: ${asText(selected.subject)}`)}`}
              >
                Reply by email
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function AnalyticsView({ analytics }: { analytics: Analytics }) {
  const maxViews = Math.max(1, ...analytics.topPages.map((page) => page.views));
  return (
    <>
      <div className="admin-page-head">
        <div>
          <span className="admin-kicker">First-party analytics</span>
          <h1>Website traffic</h1>
          <p>
            Privacy-friendly visitor data collected directly by the SunX website.
          </p>
        </div>
      </div>
      <div className="admin-stats">
        <StatCard label="All page views" value={analytics.totalViews} note="Since tracking started" />
        <StatCard label="Last 24 hours" value={analytics.viewsToday} note="Recent website activity" />
        <StatCard label="Unique visitors" value={analytics.uniqueVisitors} note="Anonymous sessions" />
        <StatCard label="New inquiries" value={analytics.counts.unreadLeads} note="Waiting for review" />
      </div>
      <section className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <span className="admin-kicker">Popular content</span>
            <h2>Top pages</h2>
          </div>
        </div>
        {analytics.topPages.length ? (
          <div className="traffic-list">
            {analytics.topPages.map((page) => (
              <div key={page.path}>
                <span>{page.path}</span>
                <div>
                  <i style={{ width: `${(page.views / maxViews) * 100}%` }} />
                </div>
                <strong>{page.views}</strong>
              </div>
            ))}
          </div>
        ) : (
          <p className="admin-muted">Visits will appear here after tracking begins.</p>
        )}
      </section>
    </>
  );
}

function MediaManager({
  notify,
}: {
  notify: (message: string, type?: "success" | "error") => void;
}) {
  const [items, setItems] = useState<CmsItem[]>([]);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await cmsRequest("media");
      setItems((data.items as CmsItem[]) ?? []);
    } catch (error) {
      notify(error instanceof Error ? error.message : "Could not load media", "error");
    }
  }, [notify]);

  useEffect(() => {
    void load();
  }, [load]);

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setUploading(true);
    try {
      await cmsRequest("media", { method: "POST", body: data });
      form.reset();
      notify("Image uploaded");
      await load();
    } catch (error) {
      notify(error instanceof Error ? error.message : "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this image?")) return;
    await cmsRequest(`media?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    notify("Image deleted");
    await load();
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <span className="admin-kicker">Asset library</span>
          <h1>Media</h1>
          <p>Upload product photos, news images, and page artwork.</p>
        </div>
      </div>
      <form className="media-uploader" onSubmit={upload}>
        <label>
          <span>Image</span>
          <input name="file" type="file" accept="image/*" required />
        </label>
        <label>
          <span>Alternative text</span>
          <input name="altText" placeholder="Describe the image for accessibility" />
        </label>
        <button className="admin-button primary" type="submit" disabled={uploading}>
          {uploading ? "Uploading…" : "Upload image"}
        </button>
      </form>
      {items.length ? (
        <div className="media-grid">
          {items.map((item) => (
            <article key={itemId(item)}>
              <img src={asText(item.url)} alt={asText(item.alt_text)} />
              <div>
                <strong>{asText(item.name)}</strong>
                <button type="button" onClick={() => void remove(itemId(item))}>
                  Delete
                </button>
              </div>
              <button
                className="copy-url"
                type="button"
                onClick={() => {
                  void navigator.clipboard.writeText(asText(item.url));
                  notify("Image URL copied");
                }}
              >
                Copy image URL
              </button>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="No media yet" text="Upload the first website image above." />
      )}
    </>
  );
}

function SettingsManager({
  mode,
  notify,
}: {
  mode: "seo" | "settings";
  notify: (message: string, type?: "success" | "error") => void;
}) {
  const fieldMap =
    mode === "seo"
      ? [
          ["site_title", "Website title", "SunX PV Technology"],
          [
            "site_description",
            "Default SEO description",
            "Solar inverters and lithium batteries across Pakistan",
          ],
          ["canonical_url", "Primary website URL", "https://sunxpv.com"],
          ["google_verification", "Google Search Console code", ""],
          ["google_analytics_id", "Google Analytics measurement id", ""],
          ["social_image", "Default social sharing image URL", ""],
        ]
      : [
          ["company_name", "Company name", "SunX PV Technology"],
          ["company_email", "Public email", "info@sunxpv.com"],
          ["company_phone", "Public phone", "+92 342 947 0099"],
          ["whatsapp", "WhatsApp number", "923429470099"],
          ["company_address", "Main office address", ""],
          ["facebook_url", "Facebook URL", ""],
          ["instagram_url", "Instagram URL", ""],
          ["youtube_url", "YouTube URL", ""],
        ];
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fieldMap.map(([key, , fallback]) => [key, fallback])),
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void cmsRequest("settings")
      .then((data) => {
        const next = { ...values };
        for (const item of (data.items as CmsItem[]) ?? []) {
          next[asText(item.key)] = asText(item.value);
        }
        setValues(next);
      })
      .catch((error) =>
        notify(error instanceof Error ? error.message : "Could not load settings", "error"),
      );
  }, []);

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      await Promise.all(
        fieldMap.map(([key]) =>
          cmsRequest("settings", {
            method: "POST",
            body: JSON.stringify({ key, value: values[key] ?? "" }),
          }),
        ),
      );
      notify(mode === "seo" ? "SEO settings saved" : "Website settings saved");
    } catch (error) {
      notify(error instanceof Error ? error.message : "Could not save settings", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="admin-page-head">
        <div>
          <span className="admin-kicker">
            {mode === "seo" ? "Search visibility" : "Website configuration"}
          </span>
          <h1>{mode === "seo" ? "SEO settings" : "General settings"}</h1>
          <p>
            {mode === "seo"
              ? "Control the default titles, descriptions, domain, and search verification."
              : "Keep company contact details and social links current across the website."}
          </p>
        </div>
      </div>
      <form className="settings-card" onSubmit={save}>
        {fieldMap.map(([key, label, placeholder]) => (
          <label key={key}>
            <span>{label}</span>
            {key.includes("description") || key.includes("address") ? (
              <textarea
                rows={4}
                value={values[key] ?? ""}
                placeholder={placeholder}
                onChange={(event) =>
                  setValues((current) => ({ ...current, [key]: event.target.value }))
                }
              />
            ) : (
              <input
                value={values[key] ?? ""}
                placeholder={placeholder}
                onChange={(event) =>
                  setValues((current) => ({ ...current, [key]: event.target.value }))
                }
              />
            )}
          </label>
        ))}
        {mode === "seo" ? (
          <div className="seo-preview">
            <span>Google preview</span>
            <h3>{values.site_title || "SunX PV Technology"}</h3>
            <a>{values.canonical_url || "https://sunxpv.com"}</a>
            <p>{values.site_description || "Add a clear website description."}</p>
          </div>
        ) : null}
        {mode === "settings" ? (
          <div className="backup-box">
            <div>
              <span>Portable backup</span>
              <p>
                Download pages, posts, products, menus, form entries, settings,
                and media records before a major deployment or hosting move.
              </p>
            </div>
            <a className="admin-button subtle" href="/api/cms/export">
              Download CMS backup
            </a>
          </div>
        ) : null}
        <button className="admin-button primary" type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save settings"}
        </button>
      </form>
    </>
  );
}

export default function AdminDashboard({
  activeSection,
  user,
  signOutPath,
}: {
  activeSection: string;
  user: { name: string; email: string };
  signOutPath: string;
}) {
  const active = activeSection as Section;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [analytics, setAnalytics] = useState<Analytics>(initialAnalytics);
  const [notice, setNotice] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const notify = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      setNotice({ message, type });
      window.setTimeout(() => setNotice(null), 3500);
    },
    [],
  );

  useEffect(() => {
    void cmsRequest("analytics")
      .then((data) => setAnalytics(data as unknown as Analytics))
      .catch((error) =>
        notify(error instanceof Error ? error.message : "Could not load analytics", "error"),
      );
  }, [notify]);

  const sectionTitle = useMemo(
    () => nav.find((item) => item.section === active)?.label ?? "Dashboard",
    [active],
  );

  return (
    <div className="admin-app">
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-brand">
          <a href="/">
            <img src="/images/sunx-logo.png" alt="SunX" />
          </a>
          <span>Website CMS</span>
        </div>
        <nav aria-label="Dashboard navigation">
          {nav.map((item) => (
            <a
              key={item.section}
              className={active === item.section ? "active" : ""}
              href={`/admin/${item.section}`}
            >
              <i>{item.icon}</i>
              <span>{item.label}</span>
              {item.section === "forms" && analytics.counts.unreadLeads ? (
                <b>{analytics.counts.unreadLeads}</b>
              ) : null}
            </a>
          ))}
        </nav>
        <div className="admin-sidebar-foot">
          <a href="/" target="_blank">
            ↗ Open public website
          </a>
          <a href={signOutPath}>Sign out</a>
        </div>
      </aside>
      {sidebarOpen ? (
        <button
          className="admin-sidebar-overlay"
          type="button"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation"
        />
      ) : null}
      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-menu-toggle"
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            ☰
          </button>
          <div>
            <span>SunX CMS</span>
            <strong>{sectionTitle}</strong>
          </div>
          <div className="admin-user">
            <span>{user.name.slice(0, 1).toUpperCase()}</span>
            <div>
              <strong>{user.name}</strong>
              <small>{user.email}</small>
            </div>
          </div>
        </header>
        <main className="admin-content">
          {active === "dashboard" ? <DashboardHome analytics={analytics} /> : null}
          {active === "pages" ? (
            <ContentManager resource="pages" notify={notify} />
          ) : null}
          {active === "posts" ? (
            <ContentManager resource="posts" notify={notify} />
          ) : null}
          {active === "products" ? (
            <ContentManager resource="products" notify={notify} />
          ) : null}
          {active === "menus" ? (
            <ContentManager resource="menus" notify={notify} />
          ) : null}
          {active === "forms" ? <FormsManager notify={notify} /> : null}
          {active === "analytics" ? <AnalyticsView analytics={analytics} /> : null}
          {active === "media" ? <MediaManager notify={notify} /> : null}
          {active === "seo" ? (
            <SettingsManager mode="seo" notify={notify} />
          ) : null}
          {active === "settings" ? (
            <SettingsManager mode="settings" notify={notify} />
          ) : null}
        </main>
      </div>
      {notice ? (
        <div className={`admin-toast ${notice.type}`} role="status">
          {notice.message}
        </div>
      ) : null}
    </div>
  );
}
