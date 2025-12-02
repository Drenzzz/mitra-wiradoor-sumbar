import { Role } from "@prisma/client";

export type Permission =
  | "dashboard:view"
  | "product:view"
  | "product:create"
  | "product:edit"
  | "product:delete"
  | "category:view"
  | "category:create"
  | "category:edit"
  | "category:delete"
  | "order:view"
  | "order:process"
  | "order:edit_price"
  | "order:cancel"
  | "order:delete"
  | "inquiry:view"
  | "inquiry:reply"
  | "inquiry:delete"
  | "article:view"
  | "article:create"
  | "article:edit"
  | "article:publish"
  | "article:delete"
  | "portfolio:view"
  | "portfolio:create"
  | "portfolio:edit"
  | "portfolio:delete"
  | "user:manage"
  | "report:view"
  | "all";

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  ADMIN: ["all"],
  STAF: [
    "dashboard:view",
    "product:view",
    "product:create",
    "product:edit",
    "category:view",
    "category:create",
    "category:edit",
    "order:view",
    "order:process",
    "order:cancel",
    "inquiry:view",
    "inquiry:reply",
    "article:view",
    "article:create",
    "article:edit",
    "portfolio:view",
    "portfolio:create",
    "portfolio:edit",
  ],
};

export function hasPermission(role: Role | undefined, permission: Permission): boolean {
  if (!role) return false;

  const permissions = ROLE_PERMISSIONS[role] || [];

  if (permissions.includes("all")) return true;

  return permissions.includes(permission);
}
