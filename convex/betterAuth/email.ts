import { Resend } from "resend";

let resend: Resend;

function getResend() {
  if (!resend) {
    resend = new Resend(
      process.env.RESEND_API_KEY,
    );
  }
  return resend;
}

const from =
  process.env.EMAIL_FROM ??
  "TripPulse <onboarding@resend.dev>";

export async function sendPasswordResetEmail({
  email,
  name,
  resetUrl,
}: {
  email: string;
  name?: string | null;
  resetUrl: string;
}) {
  const rawName = name?.trim().split(/\s+/)[0] || "Traveler";
  const firstName = rawName
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

 const { data, error } = await getResend().emails.send({
  from,
  to: [email],
  subject: "Reset your TripPulse password",
  html: `
    <h1>Reset your TripPulse password</h1>
    <p>Hi ${firstName},</p>
    <p>Click the button below to reset your password.</p>
    <p>
      <a href="${resetUrl}">
        Reset password
      </a>
    </p>
  `,
});

if (error) {
  throw new Error(
    `Failed to send password reset email: ${error.message}`,
  );
}

  return data;
}