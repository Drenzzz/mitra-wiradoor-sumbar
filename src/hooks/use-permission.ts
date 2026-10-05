"use client";

import { authClient } from "@/lib/auth-client";
import { hasPermission, Permission } from "@/lib/config/permissions";
import type { Role } from "@/db/schema";

export function usePermission() {
  const { data: session } = authClient.useSession();
  const role = session?.user?.role as Role | undefined;

  const can = (permission: Permission) => {
    return hasPermission(role, permission);
  };

  return { can, role };
}
