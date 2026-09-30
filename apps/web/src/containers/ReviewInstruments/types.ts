export type InstrumentSubmission = {
  id: string;
  title: string;
  originalAuthor?: string | null;
  publicationYear?: number | null;
  hasRussianAdaptation: boolean | null;
  submitterName: string;
  submitterEmail: string;
  createdAt: string;
  adminNote?: string | null;
};

export type SubmissionStatus = "reviewing" | "approved" | "rejected";
