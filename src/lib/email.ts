import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

async function getTransporter() {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_PORT === "465",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  } else {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
  }
  return transporter;
}

export async function sendEmail({ to, subject, html, text }: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}) {
  const t = await getTransporter();
  const info = await t.sendMail({
    from: process.env.EMAIL_FROM || "Bimbel Cermat <noreply@bimbelcermat.com>",
    to,
    subject,
    html,
    text,
  });

  if (process.env.NODE_ENV === "development" && info.messageId.includes("ethereal")) {
    console.log("?? Preview URL:", nodemailer.getTestMessageUrl(info));
  }
  return info;
}
