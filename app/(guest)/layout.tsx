import { MainNav } from "@/components/guest/main-nav";
import { SiteFooter } from "@/components/guest/site-footer";
import { FloatingWhatsAppButton } from "@/components/guest/floating-whatsapp-button";
import { ForceLightTheme } from "@/components/guest/force-light-theme";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <ForceLightTheme /> 
      <MainNav />
      <main className="flex-grow">{children}</main>
      <SiteFooter />
      <FloatingWhatsAppButton />
    </div>
  );
}