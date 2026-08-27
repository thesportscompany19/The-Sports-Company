This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Payment and Email Setup

Copy `.env.example` to `.env.local` and replace every placeholder. Do not commit `.env.local`.

1. Create a free Brevo account, verify the sender under **Senders & IP**, then create an SMTP key under **SMTP & API**. Use `smtp-relay.brevo.com`, port `587`, the Brevo account email as `SMTP_USER`, and the SMTP key as `SMTP_PASSWORD`.
2. Set `SMTP_FROM_EMAIL` to the verified sender and `COMPANY_EMAIL` to the organization inbox that should receive payment notifications.
3. Add the Razorpay key ID and secret, plus the MongoDB connection string. Use Razorpay test credentials locally and live credentials only in production.
4. In the admin Coaches and Wellness pages, save a valid email for every provider. Checkout blocks providers without an email because successful payments notify the customer, provider, and organization.

After Razorpay signature verification succeeds, the server marks the payment paid and sends a branded HTML/text confirmation containing the service, customer contact, booking details, Razorpay order ID, payment ID, and amount. SMTP errors are logged separately so a paid transaction is never shown as failed because an email provider is temporarily unavailable.

### WhatsApp Notifications

WhatsApp notifications use the official Meta WhatsApp Cloud API. Create and approve a utility template named `payment_confirmation` with six body variables in this order: customer name, service name, amount, payment ID, order ID, and booking details. Set the template name and language in `.env.local`, then add the Meta permanent access token, phone number ID, and the organization WhatsApp number in international format without `+` or spaces. The customer phone is collected during checkout. WhatsApp failures are logged separately and never change a successful Razorpay payment to failed.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
