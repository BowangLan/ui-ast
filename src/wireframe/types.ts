import type { ComponentType, ReactNode } from "react";

export type PrimitiveCategory =
  | "structure"
  | "layout"
  | "display"
  | "action"
  | "input"
  | "query"
  | "navigation"
  | "collection"
  | "overlay"
  | "complex"
  | "state"
  | "form";

export type IntrinsicInline = "fill" | "content" | "compact";
export type IntrinsicBlock =
  "content" | "line" | "control" | "media" | "region";

export interface IntrinsicSize {
  profile: string;
  inline: IntrinsicInline;
  block: IntrinsicBlock;
  minInline?: number;
  minBlock?: number;
  compactMinInline?: number;
  compactMinBlock?: number;
  aspectRatio?: string;
}

export interface PrimitiveProps {
  children?: ReactNode;
  [key: string]: unknown;
}

export interface PrimitiveDefinition {
  name: string;
  category: PrimitiveCategory;
  size: IntrinsicSize;
  Component: ComponentType<PrimitiveProps>;
}

export interface ViewerPreferences {
  showAnatomy: boolean;
  showStateVariants: boolean;
}
