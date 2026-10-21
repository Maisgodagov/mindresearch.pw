import {
  BookOpen,
  ClipboardList,
  Handshake,
  Plus,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import type { SidebarLink } from "../../components/PlatformSidebar";

const methodsLink: SidebarLink = {
  to: "/methods",
  label: "Методики",
  icon: BookOpen,
};

const coreLinks: SidebarLink[] = [
  { to: "/app", end: true, label: "Мои опросы", icon: ClipboardList },
  { to: "/app/surveys/new", label: "Создать опрос", icon: Plus },
  methodsLink,
  { to: "/app/methodologies/suggest", label: "Запросить методику", icon: Send },
  { to: "/app/profile", label: "Профиль", icon: UserRound },
];

export function getSidebarLinks(
  role: string,
  authenticated = true,
): SidebarLink[] {
  if (!authenticated) return [methodsLink];
  if (!["owner", "admin"].includes(role)) return coreLinks;
  return [
    ...coreLinks.slice(0, -1),
    { to: "/app/community", label: "Найти респондентов", icon: Handshake },
    {
      to: "/app/admin/methodologies",
      label: "Конструктор методик",
      icon: ClipboardList,
    },
    {
      to: "/app/admin/public-methods",
      label: "Публичные методики",
      icon: ClipboardList,
    },
    { to: "/app/admin", label: "Админ-центр", icon: ShieldCheck },
    coreLinks[coreLinks.length - 1],
  ];
}

export const collapsedStorageKey = "mindresearch_sidebar_collapsed";
