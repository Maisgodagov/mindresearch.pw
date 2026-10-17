import type {SampleCondition} from '../../selection';
export type AnswerDistributionProps = {
  busy?: boolean;
  completedOnly?:boolean;
  conditions?:SampleCondition[];
  onRemoveCondition?:(question:string)=>void;
  sampleCount?:number;
  loading?:boolean;
  error?:string;
  onRetry?:()=>void;
  appliedLabels: string[];
  onApply: (labels:string[],range?:{min:string;max:string})=>void;
  numeric?:boolean;
  data: { answer: string; count: number }[];
  options: { value: string; label: string }[];
  selectedQuestion: string;
  onQuestionChange: (question: string) => void;
};
