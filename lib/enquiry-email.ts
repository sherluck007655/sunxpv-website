import nodemailer from "nodemailer";

export type EnquiryEmail = {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  subject: string;
  message: string;
  sourcePath: string;
};

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`);
  }
  return value;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendEnquiryNotification(enquiry: EnquiryEmail) {
  const port = Number(process.env.SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({
    host: required("SMTP_HOST"),
    port,
    secure: process.env.SMTP_SECURE
      ? process.env.SMTP_SECURE === "true"
      : port === 465,
    auth: {
      user: required("SMTP_USER"),
      pass: required("SMTP_PASSWORD"),
    },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

  const safe = Object.fromEntries(
    Object.entries(enquiry).map(([key, value]) => [key, escapeHtml(String(value))]),
  );
  const whatsappNumber = enquiry.phone.replace(/\D/g, "");
  const whatsappLink = whatsappNumber
    ? `<a href="https://wa.me/${whatsappNumber}">Reply on WhatsApp</a>`
    : "Not supplied";

  await transporter.sendMail({
    from: required("SMTP_FROM"),
    to: required("ENQUIRY_NOTIFICATION_EMAIL"),
    replyTo: enquiry.email,
    subject: `SunX website enquiry #${enquiry.id}: ${enquiry.subject || "General enquiry"}`,
    text: [
      `Enquiry ID: ${enquiry.id}`,
      `Name: ${enquiry.name}`,
      `Email: ${enquiry.email}`,
      `Phone: ${enquiry.phone || "Not supplied"}`,
      `City: ${enquiry.city || "Not supplied"}`,
      `Subject: ${enquiry.subject || "General enquiry"}`,
      `Source: ${enquiry.sourcePath}`,
      "",
      enquiry.message,
    ].join("\n"),
    html: `
      <h2>New SunX website enquiry</h2>
      <p><strong>Enquiry ID:</strong> ${safe.id}</p>
      <p><strong>Name:</strong> ${safe.name}</p>
      <p><strong>Email:</strong> <a href="mailto:${safe.email}">${safe.email}</a></p>
      <p><strong>Phone:</strong> ${safe.phone || "Not supplied"}</p>
      <p><strong>WhatsApp:</strong> ${whatsappLink}</p>
      <p><strong>City:</strong> ${safe.city || "Not supplied"}</p>
      <p><strong>Subject:</strong> ${safe.subject || "General enquiry"}</p>
      <p><strong>Source:</strong> ${safe.sourcePath}</p>
      <hr />
      <p style="white-space:pre-wrap">${safe.message}</p>
    `,
  });
}
