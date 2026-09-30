import type { QueueKind } from "./types";

export const queueActions: Record<QueueKind, Array<{ status: string; label: string }>> = {
  method: [
    { status: "reviewing", label: "В работу" },
    { status: "approved", label: "Принять" },
    { status: "rejected", label: "Отклонить" },
  ],
  report: [
    { status: "in_progress", label: "В работу" },
    { status: "resolved", label: "Решено" },
    { status: "dismissed", label: "Отклонить" },
  ],
};
