import nodemailer from "nodemailer";

export interface PaymentEmailDetails {
  category: "registration" | "coach" | "wellness";
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  providerName?: string;
  providerEmail?: string;
  serviceName: string;
  referenceId: string;
  orderId: string;
  paymentId: string;
  amount: number;
  currency: string;
  details: Record<string, string>;
}

const COMPANY_NAME = "The Sports Company";
const COMPANY_EMAIL = process.env.COMPANY_EMAIL || process.env.SMTP_USER || "";
const FROM_EMAIL = process.env.SMTP_FROM_EMAIL || COMPANY_EMAIL;

function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    throw new Error("SMTP_HOST, SMTP_USER and SMTP_PASSWORD are required to send payment emails");
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] || character);
}

function paymentRows(details: PaymentEmailDetails) {
  const rows = Object.entries(details.details)
    .map(([label, value]) => `<tr><td style="padding:8px 0;color:#667085">${escapeHtml(label)}</td><td style="padding:8px 0;text-align:right;font-weight:600;color:#0B1C2D">${escapeHtml(value)}</td></tr>`)
    .join("");
  return `${rows}<tr><td style="padding:8px 0;color:#667085">Order ID</td><td style="padding:8px 0;text-align:right;font-weight:600;color:#0B1C2D">${escapeHtml(details.orderId)}</td></tr><tr><td style="padding:8px 0;color:#667085">Payment ID</td><td style="padding:8px 0;text-align:right;font-weight:600;color:#0B1C2D">${escapeHtml(details.paymentId)}</td></tr><tr><td style="padding:8px 0;color:#667085">Amount paid</td><td style="padding:8px 0;text-align:right;font-weight:700;color:#C62828">${escapeHtml(`${details.currency} ${details.amount.toLocaleString("en-IN")}`)}</td></tr>`;
}

function renderEmail(details: PaymentEmailDetails, audience: "customer" | "provider" | "company") {
  const greeting = audience === "customer" ? `Hello ${details.customerName}` : audience === "provider" ? `Hello ${details.providerName || "Partner"}` : "Hello Team";
  const subject = audience === "customer" ? "Your payment and booking are confirmed" : audience === "provider" ? "New paid booking received" : "New payment received";
  return {
    subject: `${subject} | ${COMPANY_NAME}`,
    html: `<!doctype html><html><body style="margin:0;background:#F4F6F8;font-family:Arial,sans-serif;color:#0B1C2D"><div style="max-width:620px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden"><div style="background:#0B1C2D;padding:28px 32px;color:#fff"><div style="font-size:12px;letter-spacing:2px;color:#F3B562;text-transform:uppercase">${COMPANY_NAME}</div><h1 style="margin:10px 0 0;font-size:25px">${subject}</h1></div><div style="padding:30px 32px"><p style="font-size:16px">${greeting},</p><p style="color:#475467;line-height:1.6">${audience === "customer" ? "Thank you for choosing us. Your payment was verified successfully and your booking is confirmed." : `A paid ${details.category} booking has been confirmed for ${details.serviceName}.`}</p><div style="border:1px solid #EAECF0;border-radius:12px;padding:18px;margin:24px 0"><h2 style="font-size:16px;margin:0 0 12px">Payment details</h2><table style="width:100%;border-collapse:collapse"><tr><td style="padding:8px 0;color:#667085">Service</td><td style="padding:8px 0;text-align:right;font-weight:600">${escapeHtml(details.serviceName)}</td></tr>${paymentRows(details)}</table></div><p style="color:#667085;font-size:13px;line-height:1.6">Reference: ${escapeHtml(details.referenceId)}${details.customerPhone ? `<br>Customer phone: ${escapeHtml(details.customerPhone)}` : ""}</p><p style="margin-top:28px;color:#475467">Regards,<br><strong>${COMPANY_NAME}</strong></p></div><div style="padding:18px 32px;background:#FDF2F2;color:#667085;font-size:12px">This is an automated payment confirmation. Please keep it for your records.</div></div></body></html>`,
    text: `${subject}\n\n${greeting},\n\nPayment confirmed for ${details.serviceName}.\n\n${Object.entries(details.details).map(([key, value]) => `${key}: ${value}`).join("\n")}\nOrder ID: ${details.orderId}\nPayment ID: ${details.paymentId}\nAmount: ${details.currency} ${details.amount}\nReference: ${details.referenceId}`,
  };
}

export async function sendPaymentEmails(details: PaymentEmailDetails) {
  const recipients = [details.customerEmail, details.providerEmail, COMPANY_EMAIL].filter((email, index, all): email is string => Boolean(email) && all.indexOf(email) === index);
  if (!recipients.length) throw new Error("No payment email recipients configured");
  const transporter = getTransporter();
  await Promise.all(recipients.map(async (recipient) => {
    const audience = recipient === details.customerEmail ? "customer" : recipient === details.providerEmail ? "provider" : "company";
    const email = renderEmail(details, audience);
    await transporter.sendMail({ from: `"${COMPANY_NAME}" <${FROM_EMAIL}>`, to: recipient, subject: email.subject, text: email.text, html: email.html });
  }));
}