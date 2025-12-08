"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Home, Package, Folder, LineChart, Mail, Package2, LogOut, Moon, Sun, Settings, User, CreditCard, Users, Briefcase, BarChart } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { usePermission } from "@/hooks/use-permission";
import { useSidebar } from "@/hooks/use-sidebar";
import { useState } from "react";

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
  const { resolvedTheme, setTheme } = useTheme();
  const { data: session } = useSession();
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
          <motion.div className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20" whileHover={{ scale: 1.05, rotate: 5 }} whileTap={{ scale: 0.95 }}>
            <Package2 className="size-4" />
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
            {navItems.map(({ href, icon: Icon, label, permission }) => {
              if (!can(permission as any)) return null;

              const active = isActive(href);

              const navLink = (
                <Link
                  href={href}
                  className={cn(
                    "group relative flex items-center rounded-xl px-3 py-2.5 transition-all outline-none",
                    isCollapsed ? "justify-center" : "gap-3",
                    active ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                  )}
                  onMouseEnter={() => setHoveredPath(href)}
                  onMouseLeave={() => setHoveredPath(null)}
                >
                  {/* Hover Effect */}
                  {hoveredPath === href && !active && (
                    <motion.span layoutId="sidebar-hover-bg" className="absolute inset-0 rounded-xl bg-muted/50 z-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
                  )}

                  {/* Active Effect */}
                  {active && <motion.span layoutId="sidebar-active-bg" className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/20 shadow-sm z-0" transition={{ type: "spring", stiffness: 500, damping: 30 }} />}

                  <Icon className={cn("relative z-10 size-4 transition-transform duration-300 group-hover:scale-110", active && "text-primary")} />

                  {!isCollapsed && <span className="relative z-10 text-sm">{label}</span>}

                  {/* Active Indicator Bar */}
                  {active && (
                    <motion.span
                      layoutId="sidebar-active-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-primary"
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      transition={{ delay: 0.1 }}
                    />
                  )}
                </Link>
              );

              if (!isCollapsed) {
                return (
                  <motion.div key={href} variants={itemVariants}>
                    {navLink}
                  </motion.div>
                );
              }

              return (
                <motion.div key={href} variants={itemVariants}>
                  <Tooltip>
                    <TooltipTrigger asChild>{navLink}</TooltipTrigger>
                    <TooltipContent side="right" sideOffset={8}>
                      {label}
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              );
            })}
          </TooltipProvider>

          {can("user:manage") && (
            <>
              <Separator className="my-3 mx-2 w-auto bg-border/50" />
              <TooltipProvider delayDuration={0}>
                {adminNavItems.map(({ href, icon: Icon, label }) => {
                  const active = isActive(href);

                  const navLink = (
                    <Link
                      href={href}
                      className={cn(
                        "group relative flex items-center rounded-xl px-3 py-2.5 transition-all outline-none",
                        isCollapsed ? "justify-center" : "gap-3",
                        active ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                      )}
                      onMouseEnter={() => setHoveredPath(href)}
                      onMouseLeave={() => setHoveredPath(null)}
                    >
                      {hoveredPath === href && !active && (
                        <motion.span layoutId="sidebar-hover-bg" className="absolute inset-0 rounded-xl bg-muted/50 z-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
                      )}

                      {active && <motion.span layoutId="sidebar-active-bg" className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/20 shadow-sm z-0" transition={{ type: "spring", stiffness: 500, damping: 30 }} />}

                      <Icon className={cn("relative z-10 size-4 transition-transform duration-300 group-hover:scale-110", active && "text-primary")} />
                      {!isCollapsed && <span className="relative z-10 text-sm">{label}</span>}

                      {active && (
                        <motion.span
                          layoutId="sidebar-active-indicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-primary"
                          initial={{ opacity: 0, scaleY: 0 }}
                          animate={{ opacity: 1, scaleY: 1 }}
                          transition={{ delay: 0.1 }}
                        />
                      )}
                    </Link>
                  );

                  if (!isCollapsed) {
                    return (
                      <motion.div key={href} variants={itemVariants}>
                        {navLink}
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div key={href} variants={itemVariants}>
                      <Tooltip>
                        <TooltipTrigger asChild>{navLink}</TooltipTrigger>
                        <TooltipContent side="right" sideOffset={8}>
                          {label}
                        </TooltipContent>
                      </Tooltip>
                    </motion.div>
                  );
                })}
              </TooltipProvider>
            </>
          )}
        </motion.nav>
      </div>

      <motion.div className="mt-auto border-t p-3 shrink-0 bg-background/50 backdrop-blur-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className={cn("w-full h-auto py-2 gap-3 rounded-xl hover:bg-muted/50 transition-all", isCollapsed ? "justify-center px-0" : "justify-start")} aria-label="Buka menu profil">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary shrink-0 ring-2 ring-background shadow-sm">
                <User className="h-4 w-4" />
              </div>
              {!isCollapsed && (
                <div className="min-w-0 text-left">
                  <p className="text-sm font-semibold leading-none truncate">{session?.user?.name || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground truncate mt-1.5">{session?.user?.email || "user@example.com"}</p>
                </div>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent side="top" align={isCollapsed ? "center" : "start"} sideOffset={12} className="w-64 p-0 border bg-popover/95 backdrop-blur-xl supports-[backdrop-filter]:bg-popover/95 shadow-xl rounded-xl overflow-hidden">
            <div className="p-1">
              <div className="flex items-center gap-3 px-3 py-3 bg-muted/30">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                  <User className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{session?.user?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground truncate">{session?.user?.email || "user@example.com"}</p>
                </div>
              </div>

              <Separator className="my-1" />

              <div className="space-y-0.5 p-1">
                <Button variant="ghost" className="w-full justify-start h-9 px-2 font-normal rounded-lg" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
                  {resolvedTheme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                  <span className="text-sm">{resolvedTheme === "dark" ? "Mode Terang" : "Mode Gelap"}</span>
                </Button>

                <Button variant="ghost" className="w-full justify-start h-9 px-2 font-normal rounded-lg" asChild>
                  <Link href="/admin/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span className="text-sm">Pengaturan</span>
                  </Link>
                </Button>
              </div>

              <Separator className="my-1" />

              <div className="p-1">
                <Button variant="ghost" className="w-full justify-start h-9 px-2 font-normal text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg" onClick={() => signOut({ callbackUrl: "/login" })}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="text-sm">Logout</span>
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </motion.div>
    </motion.aside>
  );
}
