import type { CSSProperties } from "react";
import type { Transform } from "@dnd-kit/utilities";
import { dragLayerZIndex } from "./const";

export function sortableItemStyle(transform: Transform | null, transition: string | undefined, dragging: boolean): CSSProperties {
  return {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0) scaleX(${transform.scaleX}) scaleY(${transform.scaleY})` : undefined,
    transition,
    position: "relative",
    zIndex: dragging ? dragLayerZIndex.dragging : dragLayerZIndex.idle,
  };
}
