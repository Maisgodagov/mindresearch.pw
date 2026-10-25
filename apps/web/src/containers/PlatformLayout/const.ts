import {
  FlaskConical,
  ClipboardList,
  Handshake,
  Plus,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import type { SidebarLink } from "../../components/PlatformSidebar";

const researchersLink: SidebarLink = {
  to: "/for-researchers",
  label: "Для исследователей",
  icon: FlaskConical,
};

const coreLinks: SidebarLink[] = [
  { to: "/app", end: true, label: "Мои опросы", icon: ClipboardList },
  { to: "/app/surveys/new", label: "Создать опрос", icon: Plus },
  researchersLink,
  { to: "/app/methodologies/suggest", label: "Запросить методику", icon: Send },
  { to: "/app/profile", label: "Профиль", icon: UserRound },
];

export function getSidebarLinks(
  role: string,
  authenticated = true,
): SidebarLink[] {
  if (!authenticated) return [researchersLink];
  if (!["owner", "admin"].includes(role)) return coreLinks;
  return [
    ...coreLinks.slice(0, -1),
    { to: "/app/community", label: "Найти респондентов", icon: Handshake },
    {
      to: "/app/admin/methodologies",
      label: "Конструктор методик",
      icon: ClipboardList,
    },
    { to: "/app/admin", label: "Админ-центр", icon: ShieldCheck },
    coreLinks[coreLinks.length - 1],
  ];
}

export const collapsedStorageKey = "mindresearch_sidebar_collapsed";
