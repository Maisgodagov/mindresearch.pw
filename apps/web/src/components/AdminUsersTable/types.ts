import type { AdminUser } from "../../types/admin";
export type AdminUsersTableProps = {
  users: AdminUser[];
  canChangeRoles: boolean;
  onRoleChange: (userId: string, role: string) => void;
  onSaveRole: (user: AdminUser) => void;
};
