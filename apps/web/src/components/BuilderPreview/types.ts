export type PreviewQuestion = {
  id: string;
  text: string;
  type: "single" | "multiple" | "text" | "number";
  required: boolean;
  options: { value: string; label: string }[];
  validation?: { min?: number; max?: number } | null;
  sectionTitle: string;
};

export type PreviewMeta = {
  welcomeTitle: string;
  welcomeText: string;
  showAuthor?: boolean;
  resultPresentation: { title: string; text: string; showScores: boolean };
};

export type PreviewProps = {
  meta: PreviewMeta;
  questions: PreviewQuestion[];
  onClose: () => void;
};

export type PreviewValue = string | number | string[];
export type PreviewScreen = "welcome" | "questions" | "done";
