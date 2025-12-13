"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarNavItemProps {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  isCollapsed: boolean;
  hoveredPath: string | null;
  setHoveredPath: (path: string | null) => void;
  variants: Variants;
}

export function SidebarNavItem({ href, label, icon: Icon, isActive, isCollapsed, hoveredPath, setHoveredPath, variants }: SidebarNavItemProps) {
  const navLink = (
    <Link
      href={href}
      className={cn("group relative flex items-center rounded-xl px-3 py-2.5 transition-all outline-none", isCollapsed ? "justify-center" : "gap-3", isActive ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground")}
      onMouseEnter={() => setHoveredPath(href)}
      onMouseLeave={() => setHoveredPath(null)}
    >
      {hoveredPath === href && !isActive && (
        <motion.span layoutId="sidebar-hover-bg" className="absolute inset-0 rounded-xl bg-muted/50 z-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
      )}

      {isActive && <motion.span layoutId="sidebar-active-bg" className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/20 shadow-sm z-0" transition={{ type: "spring", stiffness: 500, damping: 30 }} />}

      <Icon className={cn("relative z-10 size-4 transition-transform duration-300 group-hover:scale-110", isActive && "text-primary")} />

      {!isCollapsed && <span className="relative z-10 text-sm">{label}</span>}

      {isActive && (
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
    return <motion.div variants={variants}>{navLink}</motion.div>;
  }

  return (
    <motion.div variants={variants}>
      <Tooltip>
        <TooltipTrigger asChild>{navLink}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {label}
        </TooltipContent>
      </Tooltip>
    </motion.div>
  );
}
