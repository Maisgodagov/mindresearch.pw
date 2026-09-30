import type { ReactNode } from "react";
import type { AnswerGroup, Respondent } from "../../types";

export type ResultSection = {
  code: string;
  title: string;
  sectionKind: string;
};

export type RespondentResultsProps = {
  respondents: Respondent[];
  deletedRespondents: Respondent[];
  sections: ResultSection[];
  selected: Record<string, boolean>;
  deletedSelected: Record<string, boolean>;
  expanded: Record<string, boolean>;
  allSelected: boolean;
  selectedCount: number;
  trashOpen: boolean;
  exporting: boolean;
  updatingTrash: boolean;
  adminView: boolean;
  onSelectAll: (checked: boolean) => void;
  onSelectRespondent: (id: string, checked: boolean) => void;
  onSelectDeleted: (id: string, checked: boolean) => void;
  onToggleExpanded: (id: string) => void;
  onToggleTrash: () => void;
  onDeleteSelected: () => void;
  onExport: () => void;
  onRestore: () => void;
  renderMethodResult: (group?: AnswerGroup) => ReactNode;
  renderRespondentDetails: (respondent: Respondent) => ReactNode;
};
