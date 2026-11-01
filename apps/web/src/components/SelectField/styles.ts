import styled, { css } from "styled-components";

export const Root = styled.div`
  position: relative;
  width: 100%;
  min-width: 0;
`;

export const Control = styled.button<{ $size: "small" | "middle" | "large"; $open: boolean }>`
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  height: ${({ $size }) => $size === "small" ? "36px" : $size === "middle" ? "44px" : "59.8px"};
  padding: 0 14px;
  border: 1px solid ${({ $open }) => $open ? "var(--color-brand)" : "var(--color-border-strong)"};
  border-radius: 12px;
  background: var(--color-surface);
  color: var(--color-text-26382f);
  font: inherit;
  font-size: 14px;
  text-align: left;
  cursor: ${({ disabled }) => disabled ? "not-allowed" : "pointer"};
  opacity: ${({ disabled }) => disabled ? 0.6 : 1};
  box-shadow: ${({ $open }) => $open ? "0 0 0 3px var(--color-brand-alpha-120)" : "none"};
  &:hover:not(:disabled) { border-color: var(--color-brand); }
  &:focus-visible { outline: 3px solid var(--color-brand-alpha-200); outline-offset: 1px; }
  ${({ $open }) => $open && css`border-color:var(--color-brand);`}
`;

export const Value = styled.span<{ $placeholder: boolean }>`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({ $placeholder }) => $placeholder ? "var(--color-palette-8b968e)" : "var(--color-ink)"};
`;

export const Arrow = styled.span<{ $open: boolean }>`
  flex: none;
  width: 8px;
  height: 8px;
  border-right: 1.5px solid var(--color-palette-718078);
  border-bottom: 1.5px solid var(--color-palette-718078);
  transform: ${({ $open }) => $open ? "rotate(225deg) translate(-1px,-1px)" : "rotate(45deg) translate(-1px,-1px)"};
  transition: transform 0.15s ease;
`;

export const Menu = styled.div<{ $maxHeight: number }>`
  box-sizing: border-box;
  overflow: auto;
  padding: 5px;
  border: 1px solid var(--color-brand-soft);
  border-radius: 12px;
  background: var(--color-surface);
  box-shadow: 0 12px 30px var(--color-brand-alpha-160);
  z-index: 2000;
  max-height: ${({ $maxHeight }) => `${$maxHeight}px`};
`;

export const SearchInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 38px;
  padding: 0 10px;
  border: 1px solid var(--color-brand-soft);
  border-radius: 8px;
  outline: none;
  color: var(--color-text-26382f);
  font: inherit;
  &:focus { border-color: var(--color-brand); }
  @media (max-width: 700px) { font-size: 16px; }
`;

export const Option = styled.button<{ $selected: boolean; $active: boolean }>`
  display: block;
  width: 100%;
  min-height: 40px;
  padding: 9px 11px;
  border: 0;
  border-radius: 8px;
  background: ${({ $active, $selected }) => $active ? "var(--color-brand-soft)" : $selected ? "var(--color-surface-muted)" : "transparent"};
  color: ${({ disabled }) => disabled ? "var(--color-palette-a4ada6)" : "var(--color-ink)"};
  font: inherit;
  font-size: 14px;
  text-align: left;
  white-space: normal;
  overflow-wrap: anywhere;
  line-height: 1.5;
  cursor: ${({ disabled }) => disabled ? "not-allowed" : "pointer"};
  &:hover:not(:disabled) { background: var(--color-brand-soft); }
`;

export const Empty = styled.div`
  padding: 12px 10px;
  color: var(--color-text-859188);
  font-size: 13px;
`;
