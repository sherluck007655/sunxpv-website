import { recordFormSubmission } from "@/lib/cms-storage";

function clean(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as Record<string, unknown>;
    const name = clean(input.name, 120);
    const email = clean(input.email, 180);
    const message = clean(input.message, 5000);
    if (!name || !email || !message) {
      return Response.json(
        { error: "Name, email, and message are required" },
        { status: 400 },
      );
    }
    await recordFormSubmission({
      form_type: clean(input.formType, 40) || "contact",
      name,
      email,
      phone: clean(input.phone, 60),
      city: clean(input.city, 100),
      subject: clean(input.subject, 180),
      message,
      product: clean(input.product, 180),
      status: "new",
      source_path: clean(input.sourcePath, 300) || "/contact-us",
    });
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Your message could not be saved";
    return Response.json({ error: message }, { status: 400 });
  }
}
