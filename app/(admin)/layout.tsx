import { AdminShell } from "@/components/admin/admin-shell";

export const metadata = {
  title: "Admin Dashboard - Wiradoor Sumbar",
  description: "Panel administrasi untuk pengelolaan data Wiradoor.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
