"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Moon, Sun, Settings, User, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarUserMenuProps {
  isCollapsed: boolean;
}

export function SidebarUserMenu({ isCollapsed }: SidebarUserMenuProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const { data: session } = useSession();

  return (
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
  );
}
