import { ClipboardList, Plus, Send, ShieldCheck, UserRound } from "lucide-react";
import type { SidebarLink } from "../../components/PlatformSidebar";

const coreLinks: SidebarLink[] = [
  { to: "/app", end: true, label: "Мои опросы", icon: ClipboardList },
  { to: "/app/surveys/new", label: "Создать", icon: Plus },
  { to: "/app/methodologies/suggest", label: "Запросить методику", icon: Send },
  { to: "/app/profile", label: "Профиль", icon: UserRound },
];

export function getSidebarLinks(role: string): SidebarLink[] {
  if (!["owner", "admin"].includes(role)) return coreLinks;
  return [
    ...coreLinks.slice(0, 3),
    { to: "/app/admin/methodologies", label: "Конструктор методик", icon: ClipboardList },
    { to: "/app/admin", label: "Админ-центр", icon: ShieldCheck },
    coreLinks[3],
  ];
}

export const collapsedStorageKey = "mindresearch_sidebar_collapsed";
