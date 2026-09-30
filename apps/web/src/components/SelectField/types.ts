import type { CSSProperties, ReactNode } from "react";

export type SelectOption = {
  value: string | number;
  label: ReactNode;
  disabled?: boolean;
};

export type Props = {
  value?: string | number;
  options: SelectOption[];
  onChange: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  size?: "small" | "middle" | "large";
  "aria-label"?: string;
  showSearch?: boolean;
  filterOption?: boolean | ((input: string, option: SelectOption) => boolean);
  notFoundContent?: ReactNode;
  listHeight?: number;
  getPopupContainer?: (trigger: HTMLElement) => HTMLElement;
};
