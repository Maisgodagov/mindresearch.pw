export type SurveyConfirmModalProps = {
  open: boolean;
  title: string;
  description: string;
  warning: string;
  confirmLabel: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};
