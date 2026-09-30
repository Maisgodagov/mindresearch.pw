export type AnswerDistributionProps = {
  data: { answer: string; count: number }[];
  options: { value: string; label: string }[];
  selectedQuestion: string;
  onQuestionChange: (question: string) => void;
};
