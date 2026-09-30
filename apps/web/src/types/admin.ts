export type Tab = "methods" | "reports" | "users" | "studio";
export type AdminRole = "owner" | "admin" | "researcher";
export type MethodSubmission = {
  id: string; submitterName: string; submitterEmail: string; createdAt: string;
  title: string; status: string; originalAuthor?: string | null;
  publicationYear?: number | null; hasRussianAdaptation: boolean | null;
  adminNote?: string | null;
};
export type BugReport = {
  id: string; submitterName: string; submitterEmail: string; createdAt: string;
  category: string; status: string; description: string; pageUrl?: string | null;
  adminNote?: string | null;
};
export type AdminUser = {
  id: string; name: string; email: string; role: AdminRole | string;
  createdAt: string; surveyCount: number; activeSurveyCount: number;
  responseCount: number; completedCount: number;
};
export type AdminQueueItem = {
  id: string; submittedBy: string; submittedAt: string; title: string;
  status: string; details: Array<{ label: string; value: string }>;
  description?: string; pageUrl?: string | null; adminNote?: string | null;
};
