import type { AdminQueueItem, BugReport, MethodSubmission } from "./types";

export const statusLabels: Record<string, string> = {
  submitted: "Новая", reviewing: "В работе", approved: "Принята", rejected: "Отклонена",
  new: "Новое", in_progress: "В работе", resolved: "Решено", dismissed: "Отклонено",
};
export const categoryLabels: Record<string, string> = {
  bug: "Ошибка на сайте", methodology: "Ошибка в методике", other: "Другое",
};
export const initialAdminTab = "methods" as const;

export function toMethodQueueItem(item: MethodSubmission): AdminQueueItem {
  return {
    id: item.id,
    submittedBy: `${item.submitterName} · ${item.submitterEmail}`,
    submittedAt: new Date(item.createdAt).toLocaleDateString("ru-RU"),
    title: item.title,
    status: statusLabels[item.status] ?? item.status,
    adminNote: item.adminNote,
    details: [
      { label: "Автор", value: item.originalAuthor || "не указан" },
      { label: "Год", value: item.publicationYear ? String(item.publicationYear) : "не указан" },
      { label: "Русскоязычная адаптация", value: item.hasRussianAdaptation === null ? "неизвестно" : item.hasRussianAdaptation ? "есть" : "нет или не найдена" },
    ],
  };
}

export function toReportQueueItem(item: BugReport): AdminQueueItem {
  return {
    id: item.id,
    submittedBy: `${item.submitterName} · ${item.submitterEmail}`,
    submittedAt: new Date(item.createdAt).toLocaleString("ru-RU"),
    title: categoryLabels[item.category] ?? item.category,
    status: statusLabels[item.status] ?? item.status,
    description: item.description,
    pageUrl: item.pageUrl,
    adminNote: item.adminNote,
    details: [],
  };
}
