import styled from "styled-components";
import { Button } from "../../../../ui";

export const TableWrap = styled.div`
  overflow: auto;
  width: calc(100% + 38px);
  max-width: none;
  overscroll-behavior-x: contain;
  -webkit-overflow-scrolling: touch;
  margin: 0 -19px -19px;
  padding: 0 0 19px 0;
  scrollbar-color: #a8b9a3 #f5f8f3;
`;
export const Table = styled.table`
  width: 100%;
  min-width: 1090px;
  border-collapse: separate;
  border-spacing: 0;
  margin: 0;
  th,
  td {
    text-align: left;
    padding: 11px 10px;
    border-bottom: 1px solid #e9eee7;
    font-size: 12px;
    vertical-align: top;
  }
  th {
    position: sticky;
    top: 0;
    z-index: 2;
    background: #f5f8f3;
    color: #647469;
    font-size: 10px;
    font-weight: 750;
    letter-spacing: .025em;
    white-space: nowrap;
  }
  .select { position: sticky; left: 0; width: 42px; min-width: 42px; max-width: 42px; z-index: 3; background: #fff; }
  .select { vertical-align: middle; }
  thead .select { z-index: 4; background: #f5f8f3; }
  .respondent-col { position: sticky; left: 42px; z-index: 2; width: 170px; min-width: 170px; background: #fff; }
  thead .respondent-col { z-index: 3; background: #f5f8f3; }
  tbody tr { transition: background-color .12s ease; }
  tbody tr:hover td { background: #f8faf7; }
  tbody tr.is-selected td,
  tbody tr.is-selected .select,
  tbody tr.is-selected .respondent-col { background: #f0f6ed; }
  tbody tr.details-row td { padding: 0; background: #f8faf7; }
  .details-cell { min-width: 100%; }
  .duration-col { white-space: nowrap; font-variant-numeric: tabular-nums; }
  .empty-state { padding: 36px 18px; color: #6c7b70; text-align: center; }
  .select input {
    width: 14px;
    height: 14px;
    margin: 0;
    display: block;
    accent-color: #5f8269;
    cursor: pointer;
  }
  .person {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    font-size: 12px;
    color: #2d4133;
  }
  .expand {
    border: 0;
    outline: 0;
    background: transparent;
    color: #52764b;
    width: 22px;
    height: 22px;
    border-radius: 5px;
    display: grid;
    place-items: center;
    flex: none;
    box-shadow: none;
  }
  .expand:hover:not(:disabled),
  .expand:focus,
  .expand:focus-visible,
  .expand:active {
    border: 0 !important;
    outline: 0 !important;
    box-shadow: none !important;
    background: transparent !important;
    color: #385942 !important;
  }
  .pill {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 10px;
    font-weight: 650;
    white-space: nowrap;
  }
  .pill.completed { background: #edf4ea; color: #47664d; }
  .pill.in-progress { background: #f6f2e7; color: #807046; }
  .pending {
    display: block;
    color: #879188;
    font-size: 12px;
    max-width: 120px;
  }
  .score {
    font-weight: 700;
    color: #3e6049;
  }
  .score small { display: block; margin-top: 4px; color: #718074; font-size: 10px; font-weight: 550; line-height: 1.4; }
  @media (max-width: 700px) {
    margin: 0 -15px -15px;
    padding: 0 0 15px 0;
    .respondent-col { width: 150px; min-width: 150px; }
  }
  @media (max-width: 560px) {
    min-width: 920px;
    margin: 0 -10px -10px;
    padding: 0 0 10px 0;
    th, td { padding: 7px 6px; font-size: 10px; }
    .select { width: 32px; min-width: 32px; max-width: 32px; }
    .respondent-col { left: 32px; width: 118px; min-width: 118px; }
    .person { gap: 5px; font-size: 10px; }
    .score small { font-size: 9px; }
  }
`;
export const TrashToggle = styled(Button)`
  margin: 12px 0 0 auto;
  border: 0;
  background: transparent;
  color: #89938c;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px;
  cursor: pointer;
  &:hover {
    color: #526f5b;
    border-color: transparent;
    background: transparent;
  }
`;
export const TrashBox = styled.div`
  margin-top: 10px;
  border: 1px dashed #d8ded8;
  border-radius: 13px;
  padding: 14px;
  background: #fafbf9;
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;
  }
  .title {
    font-weight: 700;
    color: #657269;
  }
  .items {
    display: grid;
    gap: 2px;
  }
  .item {
    display: grid;
    grid-template-columns: 25px minmax(150px, 1fr) 130px 120px;
    gap: 10px;
    align-items: center;
    padding: 9px 4px;
    border-top: 1px solid #edf0eb;
    font-size: 12px;
    color: #748078;
  }
  .item b {
    color: #45584b;
  }
  .item input {
    width: 16px;
    height: 16px;
    accent-color: #5f8269;
  }
  @media (max-width: 650px) {
    .item {
      grid-template-columns: 25px 1fr;
    }
    .meta {
      display: none;
    }
  }
`;
