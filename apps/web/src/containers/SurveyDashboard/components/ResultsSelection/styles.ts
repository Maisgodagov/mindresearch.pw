import styled from 'styled-components';
export const SelectionSurface=styled.section`
  color:#26392d; font-size:13px; border-bottom:1px solid #e4ebe1; padding-bottom:18px; margin-bottom:18px; min-width:0;
  .selection-heading,.selection-title,.selection-actions { display:flex; align-items:center; flex-wrap:wrap; gap:10px; }
  .selection-heading { justify-content:space-between; gap:12px; }
  .selection-title > svg { color:#52764b; flex:none; }
  .selection-title h2 { font-size:16px; }
  .selection-title > span { font-size:12px; color:#526557; font-variant-numeric:tabular-nums; }
  .selection-title strong { color:#304d3a; }
  .selection-actions .ant-btn { min-height:36px; height:auto; padding:6px 11px; font-size:12px; border-radius:7px; }
  .selection-hint { font-size:12px; color:#526557; line-height:1.6; margin:10px 0 0; }
  .text-action { display:inline-flex; align-items:center; justify-content:center; min-height:36px; gap:5px; padding:6px 8px; border:0; border-radius:6px; background:transparent; color:#44634b; font:inherit; font-size:12px; cursor:pointer; }
  .text-action:hover { background:#edf4e9; }
  button:focus-visible { outline:2px solid #52764b; outline-offset:3px; }
  .sample-chips { display:flex; align-items:center; flex-wrap:wrap; gap:8px; margin-top:16px; }
  .condition-item { display:flex; align-items:center; gap:8px; min-width:0; max-width:100%; }
  .condition-and { color:#526557; font-size:12px; }
  .sample-chip { display:flex; align-items:center; background:#eaf2e5; border-radius:7px; min-width:0; max-width:100%; }
  .sample-chip button { display:flex; align-items:center; flex-wrap:wrap; gap:4px 8px; text-align:left; padding:8px 10px; min-height:36px; border:0; border-radius:6px; font:inherit; font-size:12px; color:#365332; background:transparent; cursor:pointer; min-width:0; overflow-wrap:anywhere; }
  .sample-chip strong { font-weight:650; }
  .sample-chip button:hover { background:#dcebd4; }
  .sample-chip .remove-condition { flex:none; padding:8px; }
  .sample-editor { margin-top:12px; background:#f5f8f2; border-radius:8px; padding:12px; }
  .editor-heading,.editor-actions { display:flex; align-items:center; justify-content:space-between; gap:12px; }
  .editor-heading .text-action { min-height:28px; padding:4px; }
  .editor-heading h3 { margin:0; font-size:13px; font-weight:650; }
  .editor-fields { display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); align-items:start; gap:12px; margin-top:6px; }
  .sample-field { display:grid; gap:5px; min-width:0; }
  .sample-field > span { font-size:12px; font-weight:600; color:#405b46; }
  .sample-field button[role=combobox] { height:40px; min-height:40px; font-size:13px; border-radius:8px; }
  .sample-answer-select { width:100%; height:40px; min-height:40px; border-radius:8px; }
  .sample-answer-select .ant-select-placeholder { color:#526557; }
  .range-fields { display:flex; align-items:center; gap:9px; min-width:0; }
  .range-fields input { width:100%; min-width:0; height:36px; min-height:36px; font-size:13px; }
  .value-mode { display:flex; gap:5px; }
  .value-mode button { border:0; border-radius:5px; padding:5px 8px; font:inherit; font-size:12px; cursor:pointer; color:#405b46; background:transparent; }
  .value-mode button[aria-pressed=true] { background:#e1ecd9; font-weight:650; }
  .editor-actions { margin-top:10px; flex-wrap:wrap; gap:8px; }
  .editor-actions > span { font-size:11px; color:#526557; }
  .editor-actions .ant-btn { min-height:34px; height:auto; padding:6px 11px; font-size:12px; }
  .sample-error { color:#943f37; font-size:12px; line-height:1.5; }
  .sample-empty { padding:12px; background:#f7f1e8; color:#6b542d; border-radius:7px; font-size:12px; }
  .sample-sort { display:flex; align-items:center; gap:9px; flex-wrap:wrap; border-top:1px solid #e4ebe1; padding-top:14px; margin-top:16px; color:#526557; font-size:12px; }
  .completed-toggle { display:inline-flex; align-items:center; gap:8px; min-height:36px; margin-left:10px; color:#405b46; cursor:pointer; white-space:nowrap; }
  .sample-sort > div { width:290px; max-width:100%; }
  .sample-sort [role=combobox] { min-height:36px; height:36px; font-size:12px; }
  @media(max-width:650px) {
    .selection-heading { align-items:flex-start; }
    .selection-actions { width:100%; justify-content:space-between; }
    .editor-fields { grid-template-columns:1fr; }
    .sample-field button[role=combobox], .sample-answer-select, .range-fields input { min-height:40px; height:40px; }
    .editor-actions .ant-btn { width:100%; }
    .completed-toggle { display:inline-flex; align-items:center; gap:8px; min-height:36px; margin-left:10px; color:#405b46; cursor:pointer; white-space:nowrap; }
  .sample-sort > div { flex:1 1 200px; width:auto; }
  }
`;
