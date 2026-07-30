import { getChatGPTUser } from "@/app/chatgpt-auth";

export async function requireAdminApi() {
  const user = await getChatGPTUser();
  if (!user) {
    return {
      error: Response.json({ error: "Sign in is required" }, { status: 401 }),
      user: null,
    };
  }

  let runtimeBindings =
    (
      globalThis as typeof globalThis & {
        __SUNX_RUNTIME_BINDINGS__?: Record<string, unknown>;
      }
    ).__SUNX_RUNTIME_BINDINGS__ ?? {};
  try {
    const runtime = (await import("cloudflare:workers")) as unknown as {
      env?: Record<string, unknown>;
    };
    runtimeBindings = runtime.env ?? runtimeBindings;
  } catch {
    // The explicit Worker binding remains the fallback outside Cloudflare.
  }
  const configured = String(runtimeBindings.SUNX_ADMIN_EMAILS ?? "")
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
