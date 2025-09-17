// components/admin/sidebar.tsx
'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bell,
  Box,
  Folder,
  Home,
  LineChart,
  Mail,
  Package,
  Package2,
  Settings,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/products", label: "Produk", icon: Package },
    { href: "/admin/categories", label: "Kategori", icon: Folder },
    { href: "/admin/articles", label: "Artikel", icon: LineChart },
    { href: "/admin/inquiries", label: "Pesan Masuk", icon: Mail },
  ]

  const settingsItem = { href: "/admin/settings", label: "Settings", icon: Settings };

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">Wiradoor Admin</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  pathname === item.href && "bg-muted text-primary"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            <Link
              href={settingsItem.href}
              className={cn(
                "mt-4 flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                 pathname === settingsItem.href && "bg-muted text-primary"
              )}
            >
              <settingsItem.icon className="h-4 w-4" />
              {settingsItem.label}
            </Link>
          </nav>
        </div>
      </div>
    </div>
  )
}