import { useSortable } from "@dnd-kit/sortable";
import { GripVertical } from "lucide-react";
import { Button } from "../../../../components/Button";
import { QuestionBox, SectionCard } from "../../styles";
import { dragHandleLabels } from "./const";
import { sortableItemStyle } from "./styles";
import type { SortableBlockProps } from "./types";

export function SortableSection({ id, children }: SortableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const handle = <Button type="button" className="section-drag" aria-label={dragHandleLabels.section} {...attributes} {...listeners}><GripVertical size={17} /></Button>;
  return <SectionCard ref={setNodeRef} style={sortableItemStyle(transform, transition, isDragging)} $dragging={isDragging}>{children(handle, isDragging)}</SectionCard>;
}

export function SortableQuestion({ id, children }: SortableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const handle = <Button type="button" className="drag" aria-label={dragHandleLabels.question} {...attributes} {...listeners}><GripVertical size={16} /></Button>;
  return <QuestionBox ref={setNodeRef} style={sortableItemStyle(transform, transition, isDragging)} $dragging={isDragging}>{children(handle, isDragging)}</QuestionBox>;
}

export type { SortableBlockProps } from "./types";
