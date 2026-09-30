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
  border: 1px solid ${({ $open }) => $open ? "#78947e" : "#d2ddd2"};
  border-radius: 12px;
  background: #fff;
  color: #26382f;
  font: inherit;
  font-size: 14px;
  text-align: left;
  cursor: ${({ disabled }) => disabled ? "not-allowed" : "pointer"};
  opacity: ${({ disabled }) => disabled ? 0.6 : 1};
  box-shadow: ${({ $open }) => $open ? "0 0 0 3px rgba(95,128,104,.12)" : "none"};
  &:hover:not(:disabled) { border-color: #9aaf9b; }
  &:focus-visible { outline: 3px solid rgba(95,128,104,.2); outline-offset: 1px; }
  ${({ $open }) => $open && css`border-color:#78947e;`}
`;

export const Value = styled.span<{ $placeholder: boolean }>`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({ $placeholder }) => $placeholder ? "#8b968e" : "#26382f"};
`;

export const Arrow = styled.span<{ $open: boolean }>`
  flex: none;
  width: 8px;
  height: 8px;
  border-right: 1.5px solid #718078;
  border-bottom: 1.5px solid #718078;
  transform: ${({ $open }) => $open ? "rotate(225deg) translate(-1px,-1px)" : "rotate(45deg) translate(-1px,-1px)"};
  transition: transform 0.15s ease;
`;

export const Menu = styled.div<{ $maxHeight: number }>`
  box-sizing: border-box;
  overflow: auto;
  padding: 5px;
  border: 1px solid #e0e7de;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 12px 30px rgba(37,55,42,.16);
  z-index: 2000;
  max-height: ${({ $maxHeight }) => `${$maxHeight}px`};
`;

export const SearchInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  height: 38px;
  padding: 0 10px;
  border: 1px solid #dce5d9;
  border-radius: 8px;
  outline: none;
  color: #26382f;
  font: inherit;
  &:focus { border-color: #78947e; }
`;

export const Option = styled.button<{ $selected: boolean; $active: boolean }>`
  display: block;
  width: 100%;
  min-height: 40px;
  padding: 9px 11px;
  border: 0;
  border-radius: 8px;
  background: ${({ $active, $selected }) => $active ? "#e8f0e5" : $selected ? "#f2f6f0" : "transparent"};
  color: ${({ disabled }) => disabled ? "#a4ada6" : "#34483a"};
  font: inherit;
  font-size: 14px;
  text-align: left;
  cursor: ${({ disabled }) => disabled ? "not-allowed" : "pointer"};
  &:hover:not(:disabled) { background: #e8f0e5; }
`;

export const Empty = styled.div`
  padding: 12px 10px;
  color: #859188;
  font-size: 13px;
`;
