import styled from "styled-components";
import { Button } from "../../../../ui";

export const Details = styled.div`
  padding: 0;
  display: grid;
  gap: 0;
`;
export const Group = styled.div`
  border: 0;
  border-radius: 0;
  background: transparent;
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
  overflow:visible;
  margin:0;
  width:100%;
  scrollbar-color:#a8b9a3 #f5f8f3;
  &:focus-visible { outline:2px solid #52764b; outline-offset:-2px; }
  &&& table { width:100%; max-width:100%; min-width:0; border-collapse:separate; border-spacing:0; table-layout:fixed; }
  &&& thead { position:static; z-index:auto; }
  &&& table th, &&& table td { position:static; padding:12px 14px; text-align:left; vertical-align:top; border-bottom:1px solid #e0e7df; font-size:12px; line-height:1.5; color:#354b3c; background:#fff; overflow-wrap:anywhere; }
  &&& table th { background:#f0f5ed; font-weight:700; white-space:normal; padding-top:6px; padding-bottom:6px; border-top:1px solid #d4dfce; vertical-align:middle; line-height:1.35; }
  &&& table th.visits-heading { white-space:nowrap; overflow-wrap:normal; word-break:normal; }
  &&& table th:not(.answer-spacer):not(.number) { border-left:1px solid #dce6d6; }
  &&& table tbody tr:hover td { background:#f5f8f3; }
  &&& .answer-indent { width:64px; }
  &&& table .answer-spacer { padding:0; }
  &&& table .number { width:52px; white-space:nowrap; overflow-wrap:normal; word-break:normal; color:#526557; font-variant-numeric:tabular-nums; }
  &&& table .question {  }
  &&& table .answer { font-weight:600; }
  &&& table .timing { font-variant-numeric:tabular-nums; }
  &&& table .reference {  }
  @media(max-width:560px) { &&& .answer-indent { width:36px; } &&& table th, &&& table td { padding:10px 8px; } &&& table th { padding-top:6px; padding-bottom:6px; } }
  small { display:block; margin-top:4px; font-size:11px; color:#526557; }
`;
export const ResultBox = styled.div`
  margin: 0;
  padding: 12px 0;
  .result-content { margin-left:64px; padding:0 14px; width:min(1100px, calc(100cqw - 80px)); box-sizing:border-box; }
  @media(max-width:560px) { .result-content { margin-left:36px; padding:0 8px; width:calc(100cqw - 48px); } }
  border-radius: 0;
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
