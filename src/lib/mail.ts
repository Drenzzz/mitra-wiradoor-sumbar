import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password/${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset Password Akun Admin Wiradoor Sumbar",
    html: `
      <h1>Reset Password Anda</h1>
      <p>Anda menerima email ini karena Anda (atau orang lain) meminta untuk mereset password akun Anda.</p>
      <p>Klik link di bawah ini untuk menyelesaikan proses:</p>
      <a href="${resetLink}" target="_blank">${resetLink}</a>
      <p>Jika Anda tidak meminta ini, silakan abaikan email ini.</p>
    `,
  });
};

export const sendPasswordChangeEmail = async (email: string, token: string) => {
  const changeLink = `${process.env.NEXTAUTH_URL}/change-password/${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Konfirmasi Perubahan Password Akun Wiradoor Sumbar",
    html: `
      <h1>Konfirmasi Perubahan Password</h1>
      <p>Kami menerima permintaan untuk mengubah password akun Anda.</p>
      <p>Klik link di bawah ini untuk melanjutkan ke halaman penggantian password:</p>
      <a href="${changeLink}" target="_blank">${changeLink}</a>
      <p>Link ini hanya valid selama 1 jam. Jika Anda tidak merasa meminta ini, abaikan email ini.</p>
    `,
  });
};
