import { chatGPTSignOutPath, requireChatGPTUser } from "@/app/chatgpt-auth";
import AdminDashboard from "../admin-dashboard";
import "../admin.css";

const sections = new Set([
  "dashboard",
  "pages",
  "posts",
  "products",
  "menus",
  "forms",
  "analytics",
  "media",
  "seo",
  "settings",
]);

export default async function AdminPage({
  params,
}: {
  params: Promise<{ section?: string[] }>;
}) {
  const { section = [] } = await params;
  const active = sections.has(section[0] ?? "") ? section[0] : "dashboard";
  const user = await requireChatGPTUser(`/admin/${active}`);

  return (
    <AdminDashboard
      activeSection={active}
      user={{ name: user.displayName, email: user.email }}
      signOutPath={chatGPTSignOutPath("/")}
    />
  );
}
