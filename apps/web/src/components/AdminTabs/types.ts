import type { Tab } from "../../types/admin";
export type { Tab } from "../../types/admin";

export type AdminTabCounts = { methods: number; reports: number; users: number };
export type AdminTabsProps = { activeTab: Tab; counts: AdminTabCounts; onChange: (tab: Tab) => void };
