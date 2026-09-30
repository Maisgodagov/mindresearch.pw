import type { ReactNode } from "react";

export type SortableBlockProps = {
  id: string;
  children: (handle: ReactNode, dragging: boolean) => ReactNode;
};
