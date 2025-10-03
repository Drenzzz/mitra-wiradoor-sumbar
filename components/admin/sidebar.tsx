"use client"

import { TooltipTrigger } from "@/components/ui/tooltip"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { Home, Package, Folder, LineChart, Mail, Package2, LogOut, Moon, Sun, Settings, User, CreditCard, Bell } from "lucide-react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"

interface SidebarProps {
  isCollapsed: boolean
}

export function Sidebar({ isCollapsed }: SidebarProps) {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const { data: session } = useSession()

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/products", label: "Produk", icon: Package },
    { href: "/admin/categories", label: "Kategori", icon: Folder },
    { href: "/admin/articles", label: "Artikel", icon: LineChart },
    { href: "/admin/inquiries", label: "Pesan Masuk", icon: Mail },
  ]

  const isActive = (href: string) => pathname.startsWith(href) && (href !== "/admin" || pathname === "/admin")

  return (
    <motion.aside
      aria-label="Admin sidebar"
      initial={false}
      animate={{ width: isCollapsed ? 64 : 256 }}
      transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
      className={cn(
        "flex h-screen max-h-screen flex-col border-r bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      )}
    >
      {/* Header: Logo + Title */}
      <div className={cn("flex h-14 items-center gap-3 border-b px-3", isCollapsed && "justify-center")}>
        <Link href="/admin" className="flex items-center gap-3">
          <div className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground shadow">
            <Package2 className="size-4" />
          </div>
          {!isCollapsed && (
            <div className="flex items-baseline gap-2">
              <span className="font-semibold leading-none">Wiradoor Admin</span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2">
        <nav className={cn("grid items-start gap-1", isCollapsed ? "px-2" : "px-3")}>
          <TooltipProvider delayDuration={0}>
            {navItems.map(({ href, icon: Icon, label }) => {
              const active = isActive(href)

              const navLink = (
                <Link
                  href={href}
                  className={cn(
                    "group relative flex items-center rounded-xl px-2 py-2 transition-colors outline-none",
                    isCollapsed ? "justify-center" : "gap-3",
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="sidebar-active-bg"
                      className="absolute inset-0 rounded-xl border border-primary/30 bg-primary/10"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                      aria-hidden="true"
                    />
                  )}

                  <Icon className="relative z-10 size-4" />
                  {!isCollapsed && <span className="relative z-10 text-sm font-medium">{label}</span>}

                  {/* Active left rail */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute left-0 h-6 w-[3px] rounded-full bg-primary transition-opacity",
                      active ? "opacity-100" : "opacity-0 group-hover:opacity-40",
                    )}
                  />
                </Link>
              )

              if (!isCollapsed) {
                return <div key={href}>{navLink}</div>
              }

              return (
                <Tooltip key={href}>
                  <TooltipTrigger asChild>{navLink}</TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>{label}</TooltipContent>
                </Tooltip>
              )
            })}
          </TooltipProvider>
        </nav>
      </div>

      <div className="mt-auto border-t p-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full h-auto py-2 gap-2 rounded-lg hover:bg-muted/50",
                isCollapsed ? "justify-center px-0" : "justify-start"
              )}
              aria-label="Buka menu profil"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                <User className="h-4 w-4" />
              </div>
              {!isCollapsed && (
                <div className="min-w-0 text-left">
                  <p className="text-sm font-medium leading-none truncate">{session?.user?.name || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground truncate mt-1">
                    {session?.user?.email || "user@example.com"}
                  </p>
                </div>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent
            side="top"
            align={isCollapsed ? "center" : "start"}
            sideOffset={8}
            className="w-64 p-0 border bg-popover/95 backdrop-blur supports-[backdrop-filter]:bg-popover/95"
          >
            <div className="p-3 space-y-1">
              <div className="flex items-center gap-3 px-2 py-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                  <User className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{session?.user?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {session?.user?.email || "user@example.com"}
                  </p>
                </div>
              </div>

              <Separator className="my-1" />

              <div className="space-y-0.5">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-9 px-2 font-normal"
                  onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                >
                  {resolvedTheme === "dark" ? (
                    <Sun className="mr-2 h-4 w-4" />
                  ) : (
                    <Moon className="mr-2 h-4 w-4" />
                  )}
                  <span className="text-sm">
                    {resolvedTheme === "dark" ? "Mode Terang" : "Mode Gelap"}
                  </span>
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start h-9 px-2 font-normal"
                  asChild
                >
                  <Link href="/admin/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span className="text-sm">Pengaturan</span>
                  </Link>
                </Button>
              </div>

              <Separator className="my-1" />

              <Button
                variant="ghost"
                className="w-full justify-start h-9 px-2 font-normal text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span className="text-sm">Logout</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </motion.aside>
  )
}
