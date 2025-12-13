import { Body, Button, Container, Head, Heading, Hr, Html, Img, Link, Preview, Section, Text } from "@react-email/components";

interface PasswordResetEmailProps {
  resetLink: string;
  userName?: string;
}

export function PasswordResetEmail({ resetLink, userName = "Pengguna" }: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset password akun Wiradoor Sumbar Anda</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Heading style={logoText}>WIRADOOR</Heading>
            <Text style={logoTagline}>Sumbar</Text>
          </Section>

          <Section style={contentSection}>
            <Heading style={heading}>Reset Password Anda</Heading>

            <Text style={paragraph}>Halo {userName},</Text>

            <Text style={paragraph}>Kami menerima permintaan untuk mereset password akun Wiradoor Sumbar Anda. Klik tombol di bawah ini untuk melanjutkan proses reset password.</Text>

            <Section style={buttonContainer}>
              <Button style={button} href={resetLink}>
                Reset Password
              </Button>
            </Section>

            <Text style={smallText}>Atau salin link berikut ke browser Anda:</Text>
            <Link href={resetLink} style={link}>
              {resetLink}
            </Link>

            <Hr style={hr} />

            <Text style={warningText}>⚠️ Link ini hanya valid selama 1 jam. Jika Anda tidak meminta reset password ini, abaikan email ini.</Text>
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

const heading = {
  color: "#0f172a",
  fontSize: "24px",
  fontWeight: "600" as const,
  margin: "0 0 24px",
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
  backgroundColor: "#ea580c",
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

export default PasswordResetEmail;
