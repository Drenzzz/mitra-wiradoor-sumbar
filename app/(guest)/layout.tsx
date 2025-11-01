import { MainNav } from "@/components/guest/main-nav";
import { SiteFooter } from "@/components/guest/site-footer";
import { FloatingWhatsAppButton } from "@/components/guest/floating-whatsapp-button";
import { ForceLightTheme } from "@/components/guest/force-light-theme";
import { Toaster } from "@/components/ui/sonner";

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
      <Toaster position="top-center" />
    </div>
  );
}