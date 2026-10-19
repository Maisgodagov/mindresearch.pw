import styled from "styled-components";
import { Button } from "../../../../ui";

export const TableWrap = styled.div`
  container-type:inline-size;
  overflow: auto;
  width: calc(100% + 38px);
  max-width: none;
  overscroll-behavior-x: contain;
  -webkit-overflow-scrolling: touch;
  margin: 0 -19px -19px;
  padding: 0 0 19px 0;
  scrollbar-color: #a8b9a3 #f5f8f3;
  @media(max-width:700px) { width:calc(100% + 30px);margin:0 -15px -15px;padding-bottom:15px; }
  @media(max-width:560px) { width:calc(100% + 20px);margin:0 -10px -10px;padding-bottom:10px; }
`;
export const QualityToggleBar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
  button { white-space: normal; height: auto; min-height: 42px; text-align: left; }
`;
export const Table = styled.table<{ $qualityExpanded: boolean }>`
  width: 100%;
  min-width: ${(p) => p.$qualityExpanded ? '1090px' : '760px'};
  border-collapse: separate;
  border-spacing: 0;
  th, td { overflow-wrap:anywhere; }
  > thead { position:sticky; top:0; z-index:20; }
  > thead > tr > th { z-index:21 !important; background:#f5f8f3 !important; white-space:normal; padding-right:18px; vertical-align:middle; }
  > thead > tr > th[style*="sticky"] { z-index:22 !important; }
  tbody tr.is-selected { --table-cell-background:#f0f6ed; }
  tbody tr:hover { --table-cell-background:#f8faf7; }
  &[data-density="compact"] th, &[data-density="compact"] td { padding-top:6px; padding-bottom:6px; }
  .column-resizer { position:absolute; right:0; top:0; bottom:0; width:8px; cursor:col-resize; touch-action:none; border-right:1px solid #dce4d8; }
  .column-resizer:hover, .column-resizer:focus-visible { background:#c9d8c4; }
  .person small { display:block; font-weight:500; margin-top:3px; }
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
    font-size: 12px;
    font-weight: 750;
    letter-spacing: .025em;
    white-space: nowrap;
  }
  .select { position: sticky; left: 0; width: 42px; min-width: 42px; max-width: 42px; z-index: 3; background: #fff; }
  .select { vertical-align: middle; }
  > thead .select { z-index: 4; background: #f5f8f3; }
  .respondent-col { position: sticky; left: 42px; z-index: 2; width: 170px; min-width: 170px; background: #fff; }
  > thead .respondent-col { z-index: 3; background: #f5f8f3; }
  tbody tr { transition: background-color .12s ease; }
  tbody tr:hover td { background: #f8faf7; }
  tbody tr.is-selected td,
  tbody tr.is-selected .select,
  tbody tr.is-selected .respondent-col { background: #f0f6ed; }
  tbody tr.details-row td { padding: 0; background: #f8faf7; }
  .details-cell { min-width: 100%; }
  th[draggable="true"] { cursor:grab; }
  th[draggable="true"]:active { cursor:grabbing; }
  > thead th.column-drop-target { background:#dce9d7 !important; box-shadow:inset 2px 0 #52764b; }
  .sortable-heading { display:flex; align-items:center; gap:4px; }
  .column-sort { display:flex; align-items:center; gap:6px; width:100%; text-align:left; border:0; background:transparent; padding:4px 0; color:inherit; font:inherit; font-weight:inherit; cursor:pointer; }
  .column-sort svg { flex:none; }
  .column-sort:focus-visible { outline:2px solid #52764b; outline-offset:2px; }
  .column-sort:hover { color:#2d5131; }
  .sort-age { font: inherit; color: inherit; background: none; border: 0; padding: 0; min-height: 28px; cursor: pointer; }
  .sort-age:focus-visible { outline: 2px solid #52764b; outline-offset: 3px; }
  .age-col { min-width:70px; font-variant-numeric: tabular-nums; }
  .duration-col { white-space: nowrap; font-variant-numeric: tabular-nums; }
  .quality-col { min-width: 100px; max-width: 180px; font-variant-numeric: tabular-nums; }
  .details-row .details-cell > section { padding: 16px 18px; max-width: min(1100px, calc(100vw - 60px)); }
  .details-row .details-cell > div { max-width: min(1100px, calc(100vw - 60px)); box-sizing: border-box; }
  .method-details-row .details-cell > div { max-width:none; width:100%; }
  .empty-state { padding: 36px 18px; color: #6c7b70; text-align: center; }
  .ant-checkbox-wrapper { margin:0; line-height:1; vertical-align:middle; }
  .method-subrow td { background:#f8faf7; padding:0; }
  .method-subrow-content { display:flex; align-items:center; gap:20px; padding:10px 18px 10px 52px; max-width:min(1100px, calc(100vw - 60px)); box-sizing:border-box; min-height:48px; }
  .quality-subrow .method-subrow-toggle { flex:0 1 auto; }
  .quality-subrow .method-subrow-content { justify-content:flex-start; gap:14px; }
  .quality-summary { display:inline-flex; align-items:center; gap:7px; padding:4px 8px; border-radius:6px; background:#e9f1e5; color:#3e6041; font-size:11px; line-height:1.4; white-space:nowrap; }
  .quality-summary strong { font-size:12px; font-weight:750; font-variant-numeric:tabular-nums; }
  .quality-summary.review { background:#f5efdf; color:#76602b; }
  .quality-summary.high_concern { background:#f6e9e4; color:#8a4835; }
  .quality-summary.insufficient_data, .quality-summary.unavailable { background:#edf0eb; color:#586653; }
  @media(max-width:560px) { .quality-subrow .method-subrow-toggle { flex-basis:auto; } }
  .method-title-actions { display:flex; align-items:center; gap:12px; flex:1; min-width:0; flex-wrap:wrap; }
  .method-title-actions .method-subrow-toggle { flex:0 1 auto; }
  .method-help { display:inline-flex; align-items:center; gap:5px; min-height:28px; height:auto; padding:4px 8px; border:0; border-radius:6px; background:transparent; box-shadow:none; color:#52704d; font-size:11px; font-weight:600; white-space:nowrap; flex:none; }
  .method-help:hover:not(:disabled), .method-help:active { background:#edf3e9; border:0 !important; box-shadow:none !important; }
  .method-help:focus-visible { outline:2px solid #52764b; outline-offset:2px; }
  .method-subrow-toggle { display:flex; align-items:center; gap:10px; flex:1; min-width:0; border:0; background:transparent; color:#36523c; font:inherit; font-weight:650; text-align:left; cursor:pointer; padding:4px 0; }
  .method-subrow-toggle svg { flex:none; }
  .method-subrow-toggle:focus-visible { outline:2px solid #52764b; outline-offset:3px; }
  .method-subrow:not(.quality-subrow) .method-subrow-content { display:grid; grid-template-columns:minmax(0,1fr) 88px 200px; width:min(1100px, 100cqw); max-width:none; }
  .method-answer-count { color:#526557; white-space:nowrap; }
  .method-subrow-result { min-width:0; }
  @media(max-width:560px) { .method-subrow:not(.quality-subrow) .method-subrow-content { grid-template-columns:88px minmax(0,1fr); } .method-title-actions { grid-column:1 / -1; } .method-subrow-result { margin-left:0; } .method-subrow-content { flex-wrap:wrap; gap:8px; padding:10px 12px 10px 24px; } .method-subrow-toggle { flex-basis:100%; }  }
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
    margin: 0;
    padding: 0;
    .respondent-col { width: 150px; min-width: 150px; }
  }
  @media (max-width: 560px) {
    min-width: 920px;
    margin: 0;
    padding: 0;
    th, td { padding: 7px 6px; font-size: 10px; }
    th { font-size: 12px; }
    .select { width: 32px; min-width: 32px; max-width: 32px; }
    .respondent-col { left: 32px; width: 118px; min-width: 118px; }
    .person { gap: 5px; font-size: 10px; }
    .score small { font-size: 9px; }
  }

  > thead > tr > th { color:#526653; font-weight:650; letter-spacing:0; border-bottom-color:#dce5d7; }
  > tbody > .respondent-row > td { height:58px; padding:9px 12px; vertical-align:middle; line-height:1.4; background:var(--table-cell-background,#fff); border-bottom-color:#e5ebe1; font-size:12px; }
  > tbody > .respondent-row > td[data-column-id="select"] { padding-inline:10px; }
  > tbody > .respondent-row > td[data-column-id="age"], > tbody > .respondent-row > td[data-column-id="answers"] { font-variant-numeric:tabular-nums; color:#4b5d50; }
  > tbody > .respondent-row > td[data-column-id="duration"], > tbody > .respondent-row > td[data-column-id="started"] { white-space:nowrap; font-variant-numeric:tabular-nums; color:#526557; font-size:11px; }
  .respondent-row .person { gap:9px; font-size:12px; font-weight:650; }
  .respondent-row .expand { width:24px; height:24px; padding:0; }
  && .respondent-row .expand:hover { background:#edf3e9 !important; }
  && .respondent-row .expand:focus-visible { outline:2px solid #52764b !important; outline-offset:2px; }
  .respondent-row .pill { border-radius:4px; padding:3px 7px; font-size:10px; font-weight:550; }
  .respondent-row .table-quality { display:flex; align-items:center; gap:7px; font-variant-numeric:tabular-nums; }
  .respondent-row .table-quality b { color:#365b3c; font-size:12px; font-weight:650; min-width:35px; }
  .respondent-row .table-quality > span { display:flex; align-items:center; gap:5px; color:#526557; font-size:10px; }
  .respondent-row .table-quality > span::before { content:''; width:5px; height:5px; flex:none; border-radius:50%; background:#75956d; }
  .respondent-row .table-quality[data-status="review"] b { color:#86662e; }
  .respondent-row .table-quality[data-status="high_concern"] b { color:#974d37; }
  .respondent-row .table-quality[data-status="review"] > span::before { background:#ad8640; }
  .respondent-row .table-quality[data-status="high_concern"] > span::before { background:#b2644f; }
  .respondent-row .table-quality[data-status="insufficient_data"] > span::before { background:#8e9c89; }
  .respondent-row .score { color:#36563d; font-size:12px; font-weight:650; font-variant-numeric:tabular-nums; }
  .respondent-row .score small { margin-top:3px; color:#596c5c; font-size:10px; font-weight:400; line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
  .respondent-row .cell-missing { color:#8b9786; font-size:13px; font-weight:400; }
  @media(max-width:560px) { > tbody > .respondent-row > td { padding:8px; height:54px; } .respondent-row .person { gap:6px; } }
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

  @media (max-width: 650px) {
    .item {
      grid-template-columns: 25px 1fr;
    }
    .meta {
      display: none;
    }
  }
`;
