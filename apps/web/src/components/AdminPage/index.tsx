import { AdminPageRoot } from "./styles";
import type { AdminPageProps } from "./types";

export function AdminPage({ children, ...props }: AdminPageProps) {
  return <AdminPageRoot {...props}>{children}</AdminPageRoot>;
}

export type { AdminPageProps } from "./types";
