"use client";

import { useSession } from "next-auth/react";
import { hasPermission, Permission } from "@/lib/config/permissions";
import { Role } from "@prisma/client";

export function usePermission() {
  const { data: session } = useSession();
  const role = session?.user?.role as Role | undefined;

  const can = (permission: Permission) => {
    return hasPermission(role, permission);
  };

  return { can, role };
}
