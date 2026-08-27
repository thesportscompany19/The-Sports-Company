import type { PaymentEmailDetails } from "@/lib/payment-email";

const GRAPH_API_VERSION = "v22.0";

function normalizePhone(phone: string) {
  return phone.replace(/[^\d]/g, "");
}

function messageParameters(details: PaymentEmailDetails) {
  const extraDetails = Object.entries(details.details)
    .map(([key, value]) => `${key}: ${value}`)
    .join(" | ");

  return [
    details.customerName,
    details.serviceName,
    `${details.currency} ${details.amount.toLocaleString("en-IN")}`,
    details.paymentId,
    details.orderId,
    extraDetails || "Payment confirmed",
  ];
}

async function sendTemplateMessage(to: string, details: PaymentEmailDetails) {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME;
  const language = process.env.WHATSAPP_TEMPLATE_LANGUAGE || "en_US";

  if (!accessToken || !phoneNumberId || !templateName) {
    throw new Error("WhatsApp Cloud API is not configured");
  }

  const response = await fetch(`https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: normalizePhone(to),
      type: "template",
      template: {
        name: templateName,
        language: { code: language },
        components: [{ type: "body", parameters: messageParameters(details).map((text) => ({ type: "text", text })) }],
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`WhatsApp API request failed with status ${response.status}`);
  }
}

export async function sendPaymentWhatsApp(details: PaymentEmailDetails) {
  const recipients = [details.customerPhone, process.env.COMPANY_WHATSAPP_PHONE]
    .filter((phone): phone is string => Boolean(phone && normalizePhone(phone).length >= 10));

  if (!recipients.length) return;

  await Promise.all([...new Set(recipients)].map((phone) => sendTemplateMessage(phone, details)));
}