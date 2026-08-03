import type { ResultSetHeader } from "mysql2";
import { sendEnquiryNotification } from "@/lib/enquiry-email";
import { getMysqlPool } from "@/lib/mysql";

export const runtime = "nodejs";

function clean(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as Record<string, unknown>;
    const name = clean(input.name, 120);
    const email = clean(input.email, 180);
    const website = clean(input.website, 300);
    const message = clean(input.message, 5000);
    if (website) {
      return Response.json({ ok: true }, { status: 201 });
    }
    if (!name || !email || !message) {
      return Response.json(
        { error: "Name, email, and message are required" },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { error: "Please enter a valid email address" },
        { status: 400 },
      );
    }

    const phone = clean(input.phone, 60);
    const city = clean(input.city, 100);
    const subject = clean(input.subject, 180) || "General enquiry";
    const sourcePath = clean(input.sourcePath, 300) || "/contact-us";
    const [result] = await getMysqlPool().execute<ResultSetHeader>(
      `INSERT INTO contact_enquiries
        (name, email, phone, city, subject, message, source_path)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, city, subject, message, sourcePath],
    );

    let notificationSent = true;
    try {
      await sendEnquiryNotification({
        id: result.insertId,
        name,
        email,
        phone,
        city,
        subject,
        message,
        sourcePath,
      });
      try {
        await getMysqlPool().execute(
          "UPDATE contact_enquiries SET email_notified = 1 WHERE id = ?",
          [result.insertId],
        );
      } catch (error) {
        console.error("Enquiry email status could not be updated", {
          enquiryId: result.insertId,
          error: error instanceof Error ? error.message : "Database update failed",
        });
      }
    } catch (error) {
      notificationSent = false;
      const reason =
        error instanceof Error ? error.message.slice(0, 500) : "Email failed";
      console.error("Enquiry notification failed", {
        enquiryId: result.insertId,
        error: reason,
      });
      try {
        await getMysqlPool().execute(
          "UPDATE contact_enquiries SET email_error = ? WHERE id = ?",
          [reason, result.insertId],
        );
      } catch (statusError) {
        console.error("Enquiry email error could not be recorded", {
          enquiryId: result.insertId,
          error:
            statusError instanceof Error
              ? statusError.message
              : "Database update failed",
        });
      }
    }

    return Response.json(
      { ok: true, enquiryId: result.insertId, notificationSent },
      { status: 201 },
    );
  } catch (error) {
    console.error("Contact enquiry could not be saved", error);
    return Response.json(
      { error: "Your enquiry could not be saved. Please contact SunX by email or WhatsApp." },
      { status: 500 },
    );
  }
}
