import type { ReactNode } from "react";
import type { AnswerGroup, Respondent } from "../../types";
import type { Quality } from "../../quality";

export type ResultSection = {
  code: string;
  title: string;
  sectionKind: string;
};

export type RespondentResultsProps = {
  storageKey?: string;
  sortKey: string;
  sortDirection: 'asc' | 'desc';
  methodSortOptions: {value:string;label:string}[];
  onColumnSort: (key:string,direction:'asc'|'desc')=>void;
  readOnly?:boolean;
  showAge?:boolean;
  showGender?:boolean;
  onSortAge?:()=>void;
  ageSortDirection?: "asc" | "desc";
  respondents: Respondent[];
  totalCount: number;
  qualities: Record<string, Quality>;
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
  renderMethodHelp: (group: AnswerGroup) => ReactNode;
  renderMethodResult: (group?: AnswerGroup) => ReactNode;
  getRespondentGroups: (respondent: Respondent) => AnswerGroup[];
  renderRespondentDetails: (respondent: Respondent, groupCode?: string) => ReactNode;
};
