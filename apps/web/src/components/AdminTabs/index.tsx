import { Bug, ClipboardList, Users } from "lucide-react";
import { Button } from "../Button";
import { tabLabels } from "./const";
import { Tabs } from "./styles";
import type { AdminTabsProps, Tab } from "./types";

const icons = { methods: ClipboardList, reports: Bug, users: Users, studio: ClipboardList };
const tabs: Tab[] = ["methods", "reports", "users", "studio"];

export function AdminTabs({ activeTab, counts, onChange }: AdminTabsProps) {
  return <Tabs>{tabs.map((tab) => {
    const Icon = icons[tab];
    return <Button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => onChange(tab)}>
      <Icon size={16} /> {tabLabels[tab]} {tab !== "studio" && <span className="count">{counts[tab]}</span>}
    </Button>;
  })}</Tabs>;
}

export type { AdminTabsProps, AdminTabCounts } from "./types";
