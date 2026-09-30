export type ReportIssueModalProps = {
  open: boolean;
  sent: boolean;
  category: string;
  description: string;
  sending: boolean;
  error: string;
  onCategoryChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};
