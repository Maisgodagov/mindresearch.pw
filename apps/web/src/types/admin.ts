export type Tab = "methods" | "reports" | "users" | "studio" | "analytics";
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
  createdAt: string; lastSeenAt: string | null; surveyCount: number; activeSurveyCount: number;
  responseCount: number; completedCount: number;
};
export type AdminSurvey = { id: string; title: string; status: "draft" | "active" | "archived"; createdAt: string; updatedAt: string; responseCount: number; completedCount: number };
export type AdminSurveyDetail = { title: string; description?: string; welcomeTitle: string; welcomeText: string; status: string; resultPresentation?: {title:string;text:string;showScores:boolean}; sections: Array<{ title: string; description?: string; questions: Array<{ text: string; type: string; required: boolean; options?: Array<{ label: string; value: string }> }> }> };
export type AdminQueueItem = {
  id: string; submittedBy: string; submittedAt: string; title: string;
  status: string; details: Array<{ label: string; value: string }>;
  description?: string; pageUrl?: string | null; adminNote?: string | null;
};
