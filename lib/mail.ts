import nodemailer from 'nodemailer';

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
    subject: 'Reset Password Akun Admin Wiradoor Sumbar',
    html: `
      <h1>Reset Password Anda</h1>
      <p>Anda menerima email ini karena Anda (atau orang lain) meminta untuk mereset password akun Anda.</p>
      <p>Klik link di bawah ini, atau salin dan tempel ke browser Anda untuk menyelesaikan proses:</p>
      <a href="${resetLink}" target="_blank">${resetLink}</a>
      <p>Jika Anda tidak meminta ini, silakan abaikan email ini dan password Anda akan tetap tidak berubah.</p>
    `,
  });
};
