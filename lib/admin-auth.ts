import { env } from "cloudflare:workers";
import { getChatGPTUser } from "@/app/chatgpt-auth";

export async function requireAdminApi() {
  const user = await getChatGPTUser();
  if (!user) {
    return {
      error: Response.json({ error: "Sign in is required" }, { status: 401 }),
      user: null,
    };
  }

  const configured = String(
    (env as unknown as Record<string, unknown>).SUNX_ADMIN_EMAILS ?? "",
  )
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (configured.length && !configured.includes(user.email.toLowerCase())) {
    return {
      error: Response.json(
        { error: "This account does not have dashboard access" },
        { status: 403 },
      ),
      user: null,
    };
  }

  return { error: null, user };
}
