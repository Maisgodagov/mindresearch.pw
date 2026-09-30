export type Adaptation = "" | "yes" | "no";

export type InstrumentSubmission = {
  id: string;
  title: string;
  originalAuthor?: string;
  publicationYear?: number | null;
  status: string;
  createdAt: string;
};

export type SuggestionForm = {
  title: string;
  originalAuthor: string;
  publicationYear: string;
  adaptation: Adaptation;
};
