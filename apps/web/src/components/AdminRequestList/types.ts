import type { AdminQueueItem } from "../../types/admin";

export type QueueKind = "method" | "report";
export type AdminRequestListProps = {
  kind: QueueKind;
  items: AdminQueueItem[];
  emptyText: string;
  onNoteChange: (id: string, note: string) => void;
  onStatusChange: (item: AdminQueueItem, status: string) => void;
};
