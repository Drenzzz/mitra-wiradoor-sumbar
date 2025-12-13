"use client";

import { useSession } from "next-auth/react";
import { hasPermission, Permission } from "@/lib/config/permissions";
import type { Role } from "@/db/schema";

export function usePermission() {
  const { data: session } = useSession();
  const role = session?.user?.role as Role | undefined;

  const can = (permission: Permission) => {
    return hasPermission(role, permission);
  };

  return { can, role };
}
