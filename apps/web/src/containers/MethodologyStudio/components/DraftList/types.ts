import type { Draft } from "../../types";

export type DraftListProps = {
  drafts: Draft[];
  selectedId: string;
  busy: boolean;
  onCreate: () => void;
  onSelect: (draft: Draft) => void;
};
