"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, LineChart, Mail, CreditCard, Users, Briefcase, BarChart } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import wiradoorIcon from "@/assets/wiradoor-icon.png";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePermission } from "@/hooks/use-permission";
import { useSidebar } from "@/hooks/use-sidebar";
import { useState } from "react";
import { SidebarNavItem } from "@/components/admin/sidebar/sidebar-nav-item";
import { SidebarUserMenu } from "@/components/admin/sidebar/sidebar-user-menu";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { x: -20, opacity: 0, filter: "blur(5px)" },
  show: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
    },
  },
};

export function Sidebar() {
  const pathname = usePathname();
  const { can } = usePermission();
  const { isCollapsed } = useSidebar();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: Home, permission: "dashboard:view" },
    { href: "/admin/products", label: "Produk", icon: Package, permission: "product:view" },
    { href: "/admin/orders", label: "Pesanan", icon: CreditCard, permission: "order:view" },
    { href: "/admin/reports", label: "Laporan", icon: BarChart, permission: "report:view" },
    { href: "/admin/portfolio", label: "Portofolio", icon: Briefcase, permission: "portfolio:view" },
    { href: "/admin/articles", label: "Artikel", icon: LineChart, permission: "article:view" },
    { href: "/admin/inquiries", label: "Pesan Masuk", icon: Mail, permission: "inquiry:view" },
  ];

  const adminNavItems = [{ href: "/admin/users", label: "Manajemen Pengguna", icon: Users, permission: "user:manage" }];

  const isActive = (href: string) => pathname.startsWith(href) && (href !== "/admin" || pathname === "/admin");

  return (
    <motion.aside
      aria-label="Admin sidebar"
      initial={false}
      animate={{ width: isCollapsed ? 64 : 256 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn("flex h-full flex-col border-r bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 max-md:!w-full")}
    >
      <div className={cn("flex h-14 items-center gap-3 border-b px-3 shrink-0", isCollapsed && "justify-center")}>
        <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
          <motion.div className="grid size-8 place-items-center rounded-xl bg-primary/10 text-primary-foreground shadow-lg shadow-primary/20 p-1.5" whileHover={{ scale: 1.05, rotate: 5 }} whileTap={{ scale: 0.95 }}>
            <Image src={wiradoorIcon} alt="Wiradoor" width={32} height={32} className="w-full h-full object-contain" />
          </motion.div>
          {!isCollapsed && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex items-baseline gap-2 whitespace-nowrap">
              <span className="font-bold text-lg tracking-tight">Wiradoor Admin</span>
            </motion.div>
          )}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 scrollbar-none">
        <motion.nav className={cn("grid items-start gap-1", isCollapsed ? "px-2" : "px-3")} variants={containerVariants} initial="hidden" animate="show">
          <TooltipProvider delayDuration={0}>
            {navItems.map(({ href, icon, label, permission }) => {
              if (!can(permission as any)) return null;
              return <SidebarNavItem key={href} href={href} label={label} icon={icon} isActive={isActive(href)} isCollapsed={isCollapsed} hoveredPath={hoveredPath} setHoveredPath={setHoveredPath} variants={itemVariants} />;
            })}
          </TooltipProvider>

          {can("user:manage") && (
            <>
              <Separator className="my-3 mx-2 w-auto bg-border/50" />
              <TooltipProvider delayDuration={0}>
                {adminNavItems.map(({ href, icon, label }) => (
                  <SidebarNavItem key={href} href={href} label={label} icon={icon} isActive={isActive(href)} isCollapsed={isCollapsed} hoveredPath={hoveredPath} setHoveredPath={setHoveredPath} variants={itemVariants} />
                ))}
              </TooltipProvider>
            </>
          )}
        </motion.nav>
      </div>

      <SidebarUserMenu isCollapsed={isCollapsed} />
    </motion.aside>
  );
}
