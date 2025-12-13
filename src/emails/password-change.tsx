import { Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text } from "@react-email/components";

interface PasswordChangeEmailProps {
  changeLink: string;
  userName?: string;
}

export function PasswordChangeEmail({ changeLink, userName = "Pengguna" }: PasswordChangeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Konfirmasi perubahan password akun Wiradoor Sumbar</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Heading style={logoText}>WIRADOOR</Heading>
            <Text style={logoTagline}>Sumbar</Text>
          </Section>

          <Section style={contentSection}>
            <Section style={iconContainer}>
              <Text style={iconText}>🔐</Text>
            </Section>

            <Heading style={heading}>Konfirmasi Perubahan Password</Heading>

            <Text style={paragraph}>Halo {userName},</Text>

            <Text style={paragraph}>Kami menerima permintaan untuk mengubah password akun Wiradoor Sumbar Anda. Klik tombol di bawah ini untuk melanjutkan ke halaman penggantian password.</Text>

            <Section style={buttonContainer}>
              <Button style={button} href={changeLink}>
                Ubah Password
              </Button>
            </Section>

            <Text style={smallText}>Atau salin link berikut ke browser Anda:</Text>
            <Link href={changeLink} style={link}>
              {changeLink}
            </Link>

            <Hr style={hr} />

            <Section style={infoBox}>
              <Text style={infoTitle}>🔒 Tips Keamanan:</Text>
              <Text style={infoItem}>• Gunakan kombinasi huruf, angka, dan simbol</Text>
              <Text style={infoItem}>• Minimal 8 karakter</Text>
              <Text style={infoItem}>• Jangan gunakan password yang sama dengan akun lain</Text>
            </Section>

            <Text style={warningText}>⏰ Link ini hanya valid selama 1 jam. Jika Anda tidak meminta perubahan ini, segera abaikan email ini dan hubungi administrator.</Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>© {new Date().getFullYear()} Wiradoor Sumbar. All rights reserved.</Text>
            <Text style={footerSubText}>Email ini dikirim secara otomatis. Mohon tidak membalas email ini.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  maxWidth: "600px",
  borderRadius: "16px",
  overflow: "hidden" as const,
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
};

const logoSection = {
  backgroundColor: "#0f172a",
  padding: "32px 40px",
  textAlign: "center" as const,
};

const logoText = {
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: "700" as const,
  letterSpacing: "4px",
  margin: "0",
};

const logoTagline = {
  color: "#94a3b8",
  fontSize: "12px",
  letterSpacing: "2px",
  margin: "8px 0 0",
  textTransform: "uppercase" as const,
};

const contentSection = {
  padding: "40px",
};

const iconContainer = {
  textAlign: "center" as const,
  marginBottom: "16px",
};

const iconText = {
  fontSize: "48px",
  margin: "0",
};

const heading = {
  color: "#0f172a",
  fontSize: "24px",
  fontWeight: "600" as const,
  margin: "0 0 24px",
  textAlign: "center" as const,
};

const paragraph = {
  color: "#475569",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 16px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#0f172a",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600" as const,
  padding: "14px 32px",
  textDecoration: "none",
  display: "inline-block",
};

const smallText = {
  color: "#94a3b8",
  fontSize: "13px",
  margin: "0 0 8px",
};

const link = {
  color: "#ea580c",
  fontSize: "13px",
  wordBreak: "break-all" as const,
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "32px 0",
};

const infoBox = {
  backgroundColor: "#f0fdf4",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "16px",
};

const infoTitle = {
  color: "#166534",
  fontSize: "14px",
  fontWeight: "600" as const,
  margin: "0 0 8px",
};

const infoItem = {
  color: "#166534",
  fontSize: "13px",
  margin: "0 0 4px",
  lineHeight: "20px",
};

const warningText = {
  backgroundColor: "#fef3c7",
  borderRadius: "8px",
  color: "#92400e",
  fontSize: "14px",
  lineHeight: "22px",
  padding: "16px",
  margin: "0",
};

const footer = {
  backgroundColor: "#f8fafc",
  padding: "24px 40px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#64748b",
  fontSize: "13px",
  margin: "0 0 4px",
};

const footerSubText = {
  color: "#94a3b8",
  fontSize: "12px",
  margin: "0",
};

export default PasswordChangeEmail;
