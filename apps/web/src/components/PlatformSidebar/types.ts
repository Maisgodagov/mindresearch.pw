import type { LucideIcon } from "lucide-react";
export type SidebarLink = { to: string; end?: boolean; label: string; icon: LucideIcon; mobileHidden?: boolean };
export type PlatformSidebarProps = {
  collapsed: boolean;
  links: SidebarLink[];
  onToggle: () => void;
  onReport: () => void;
  onLogout: () => void;
};
