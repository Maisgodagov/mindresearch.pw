import type { ReactNode } from "react";

export type SortableBlockProps = {
  id: string;
  disabled?: boolean;
  children: (handle: ReactNode, dragging: boolean) => ReactNode;
};
