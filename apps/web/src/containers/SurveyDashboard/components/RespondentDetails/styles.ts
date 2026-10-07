import styled from "styled-components";
import { Button } from "../../../../ui";

export const Details = styled.div`
  padding: 18px 8px 8px;
  display: grid;
  gap: 10px;
`;
export const Group = styled.div`
  border: 1px solid #e0e7df;
  border-radius: 15px;
  overflow: hidden;
  background: #fbfcfa;
`;
export const GroupButton = styled(Button)`
  width: 100%;
  border: 0;
  outline: 0;
  box-shadow: none;
  background: transparent;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  color: #354b3c;
  font-weight: 700;
  .count {
    font-size: 12px;
    font-weight: 500;
    color: #819086;
    margin-left: auto;
    margin-right: 12px;
  }
  &:hover,
  &:focus,
  &:focus-visible,
  &:active {
    border: 0 !important;
    outline: 0 !important;
    box-shadow: none !important;
  }
  &:hover {
    background: #edf4ea !important;
    color: #304b36 !important;
  }
  &:focus,
  &:focus-visible,
  &:active {
    background: transparent !important;
    color: #354b3c !important;
  }
`;
export const Answers = styled.div`
  padding: 0 16px 12px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 24px;
  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;
export const AnswerRow = styled.div`
  .timing { margin-top: 6px; font-size: 11px; color: #526557; font-variant-numeric: tabular-nums; }
  padding: 11px 0;
  border-top: 1px solid #edf1ec;
  .q {
    color: #77847b;
    font-size: 12px;
    line-height: 1.35;
  }
  .a {
    color: #2f4235;
    font-size: 14px;
    margin-top: 4px;
  }
`;
export const ResultBox = styled.div`
  margin: 0 16px 12px;
  padding: 12px;
  border-radius: 12px;
  background: #edf3eb;
  color: #45604d;
  font-size: 13px;
`;
export const MethodButton = styled(Button)`
  margin-top: 12px;
  border: 1px solid #cbd9cc;
  background: #fff;
  color: #526f5b;
  border-radius: 10px;
  padding: 8px 11px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-weight: 650;
  font-size: 12px;
`;
