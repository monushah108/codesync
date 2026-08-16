import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, url: string) {
  await resend.emails.send({
    from: "CodeSync <onboarding@resend.dev>",
    to: email,
    subject: "Verify your CodeSync email",
    html: `
      <div>
        <h2>Verify your CodeSync account</h2>

        <p>
          Thanks for creating a CodeSync account.
          Please verify your email address to continue.
        </p>

        <a
          href="${url}"
          style="
            display:inline-block;
            padding:12px 20px;
            background:#000;
            color:#fff;
            text-decoration:none;
            border-radius:8px;
          "
        >
          Verify Email
        </a>

        <p>This verification link expires in 1 hour.</p>
      </div>
    `,
  });
}
