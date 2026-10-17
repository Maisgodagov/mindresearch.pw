export type AnswerDistributionProps = {
  busy?: boolean;
  appliedLabels: string[];
  onApply: (labels:string[])=>void;
  numeric?:boolean;
  data: { answer: string; count: number }[];
  options: { value: string; label: string }[];
  selectedQuestion: string;
  onQuestionChange: (question: string) => void;
};
