import nodemailer from "nodemailer";
import { render } from "@react-email/components";
import { PasswordResetEmail } from "@/emails/password-reset";
import { PasswordChangeEmail } from "@/emails/password-change";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export const sendPasswordResetEmail = async (email: string, token: string, userName?: string) => {
  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password/${token}`;

  const emailHtml = await render(PasswordResetEmail({ resetLink, userName }));

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset Password Akun Admin Wiradoor Sumbar",
    html: emailHtml,
  });
};

export const sendPasswordChangeEmail = async (email: string, token: string, userName?: string) => {
  const changeLink = `${process.env.NEXTAUTH_URL}/change-password/${token}`;

  const emailHtml = await render(PasswordChangeEmail({ changeLink, userName }));

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Konfirmasi Perubahan Password Akun Wiradoor Sumbar",
    html: emailHtml,
  });
};
