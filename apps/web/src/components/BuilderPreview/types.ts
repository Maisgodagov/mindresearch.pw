export type PreviewQuestion = {
  id: string;
  text: string;
  type: "single" | "multiple" | "text" | "number";
  required: boolean;
  options: { value: string; label: string }[];
  sectionTitle: string;
};

export type PreviewMeta = {
  welcomeTitle: string;
  welcomeText: string;
  resultPresentation: { title: string; text: string; showScores: boolean };
};

export type PreviewProps = {
  meta: PreviewMeta;
  questions: PreviewQuestion[];
  onClose: () => void;
};

export type PreviewValue = string | number | string[];
export type PreviewScreen = "welcome" | "questions" | "done";
