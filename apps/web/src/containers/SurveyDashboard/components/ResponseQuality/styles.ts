import styled from 'styled-components';

export const Surface = styled.section`
  min-width: 0;
  color: #26392d;
  white-space: normal;
  font-size: 13px;
  line-height: 1.55;
  h2 { margin: 0; font-size: 18px; font-weight: 700; letter-spacing: -.02em; }
  h3 { margin: 0 0 6px; font-size: 14px; font-weight: 700; }
  p { margin: 6px 0 0; max-width: 75ch; color: #526557; }
  small, .hint { color: #526557; font-size: 12px; line-height: 1.55; }
  .heading { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
  .heading-title { display: flex; align-items: center; gap: 9px; min-width: 0; }
  .heading-title > svg { flex: none; color: #52764b; }
  .version-tag { padding: 2px 7px; border-radius: 6px; background: #edf4ea; color: #44663e; font-size: 11px; font-weight: 700; }
  .overview { display: flex; flex-wrap: wrap; gap: 12px 26px; margin: 18px 0; padding: 14px 0; border-block: 1px solid #e4ebe1; }
  .overview > div { display: grid; gap: 2px; }
  .overview b { font-size: 20px; line-height: 1.3; font-variant-numeric: tabular-nums; }
  .overview span { color: #526557; font-size: 12px; }
  .help { margin-top: 14px; }
  summary { cursor: pointer; font-weight: 650; color: #405b46; }
  .disclosure > summary { display: flex; align-items: center; gap: 8px; list-style: none; }
  .disclosure > summary::-webkit-details-marker { display: none; }
  .disclosure > summary > .chevron { margin-left: auto; transition: transform .16s ease; flex: none; }
  .disclosure[open] > summary > .chevron { transform: rotate(180deg); }
  summary:focus-visible { outline: 2px solid #52764b; outline-offset: 4px; border-radius: 6px; }
  .help-copy { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 20px; margin-top: 14px; }
  .help-copy p { font-size: 12px; }
  .admin { margin-top: 18px; border-top: 1px solid #e4ebe1; padding-top: 16px; }
  .admin > summary { align-items: flex-start; }
  .admin > summary .hint { display: block; font-weight: 400; margin-top: 2px; }
  .admin > summary > svg:first-child { margin-top: 2px; flex: none; }
  .tabs { display: flex; gap: 4px; flex-wrap: wrap; margin: 16px 0 20px; padding: 4px; background: #f1f5ee; border-radius: 10px; width: fit-content; max-width: 100%; }
  .tabs button { padding: 8px 12px; border: 0; border-radius: 7px; background: transparent; font: inherit; color: #526557; cursor: pointer; }
  .tabs button[aria-pressed='true'] { background: #fff; color: #2e4935; font-weight: 700; box-shadow: 0 1px 3px rgba(32,53,38,.08); }
  .tabs button:hover { color: #2e4935; background: #e5eddf; }
  .tabs button[aria-pressed='true']:hover { background: #fff; }
  .section-body { display: grid; gap: 16px; }
  .fields { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 14px; align-items: start; }
  .fields.two { grid-template-columns: repeat(2,minmax(0,1fr)); max-width: 760px; }
  .field { display: grid; gap: 6px; min-width: 0; }
  .field-label { display: block; font-size: 12px; font-weight: 650; color: #344d3b; }
  .field .hint { font-weight: 400; }
  .field input:not([type='checkbox']) { min-height: 44px; border-radius: 12px; font-size: 13px; }
  .field [role='combobox'] { height: 44px; font-size: 13px; font-weight: 500; }
  .actions { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
  .actions .hint { flex: 1 1 240px; }
  button.ant-btn { min-height: 40px; padding-inline: 13px; font-size: 12px; white-space: normal; height: auto; }
  button.ant-btn > span { white-space: normal; }
  .notice { display: flex; gap: 9px; align-items: flex-start; padding: 12px 14px; border-radius: 10px; background: #f1f6ee; color: #405b46; }
  .notice > svg { margin-top: 2px; flex: none; }
  .notice p { margin: 0; color: inherit; font-size: 12px; }
  .subsection { padding-top: 16px; border-top: 1px solid #e4ebe1; }
  .subsection > .section-body { padding-top: 14px; }
  .baseline-info { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; color: #526557; font-size: 12px; }
  .baseline-info strong { color: #344d3b; font-weight: 650; }
  .version-picker { max-width: 760px; }
  .baseline-code { overflow-wrap: anywhere; font-size: 11px; }
  fieldset { min-width: 0; border: 0; padding: 0; margin: 0; display: grid; gap: 16px; }
  .checks { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 14px; }
  .check { display: flex; gap: 9px; align-items: flex-start; }
  .check .ant-checkbox-wrapper { margin-top: 2px; flex: none; }
  .check strong { display: block; font-size: 12px; }
  .check .hint { display: block; margin-top: 3px; }
  .selection-info { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
  .selection-info b { color: #405b46; }
  .text-action { min-height: 32px !important; }
  .job-list { list-style: none; margin: 0; padding: 0; }
  .job { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; padding: 12px 0; border-bottom: 1px solid #e4ebe1; }
  .job-title { display: flex; align-items: center; gap: 8px; }
  .job .hint { display: block; margin-top: 3px; }
  .job-status { display: flex; align-items: center; gap: 7px; font-size: 12px; color: #405b46; }
  .job-status.failed, .error { color: #943f37; }
  progress { width: 100%; max-width: 200px; height: 5px; accent-color: #52764b; display: block; margin-top: 7px; }
  .error { margin: 12px 0; padding: 10px 12px; border: 1px solid #e9d2cd; border-radius: 9px; background: #fcf5f3; max-width: none; }
  .success { margin-top: 12px; color: #405b46; font-size: 12px; }
  .filter-top { padding-bottom: 16px; border-bottom: 1px solid #e4ebe1; margin-bottom: 16px; }
  .filter-top p { font-size: 12px; }
  .sort-row { display: grid; grid-template-columns: minmax(200px,1.3fr) minmax(160px,1fr) minmax(180px,1fr); gap: 14px; }
  .sort-direction { display: flex; gap: 5px; margin-top: 7px; }
  .sort-direction button { min-height: 30px !important; padding: 4px 8px; border: 1px solid #d2ddd2; border-radius: 7px; font: inherit; font-size: 11px; color: #405b46; background: #fff; cursor: pointer; }
  .sort-direction button[aria-pressed='true'] { background: #edf4ea; border-color: #9bb294; font-weight: 650; }
  .presets { display: flex; gap: 7px; flex-wrap: wrap; margin: 16px 0; }
  .presets button { min-height: 34px !important; border-radius: 8px; }
  .filter-extra { border-top: 1px solid #e4ebe1; padding-top: 14px; }
  .filter-extra .fields { margin-top: 14px; grid-template-columns: repeat(4,minmax(0,1fr)); }
  .rules { margin-top: 16px; }
  .rules p { font-size: 12px; }
  .rule { display: grid; grid-template-columns: minmax(170px,1.5fr) minmax(145px,1fr) minmax(120px,.8fr) 40px; gap: 10px; align-items: end; padding: 12px 0; }
  .rule .remove-rule { width: 40px; padding: 0; }
  .rule-note { margin: -4px 0 12px !important; }
  .filter-bottom { display: flex; justify-content: space-between; gap: 12px; align-items: center; flex-wrap: wrap; padding: 14px 0 18px; margin-bottom: 16px; border-bottom: 1px solid #e4ebe1; }
  .filter-result { display: grid; gap: 2px; }
  .empty-filter { margin-bottom: 16px; }
  .indices { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 12px; margin: 12px 0; }
  .index { border: 1px solid #d6e1d6; border-radius: 10px; padding: 12px; }
  .index b { font-size: 24px; display: block; }
  .index small { display: block; margin-top: 5px; }
  .metrics { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 12px; }
  dt { font-size: 11px; color: #526557; } dd { margin: 4px 0 0; font-size: 13px; font-weight: 650; }
  .scroll { overflow: auto; max-height: 420px; margin: 14px 0; }
  table { border-collapse: collapse; font-size: 12px; width: 100%; }
  th, td { text-align: left; padding: 9px; border-bottom: 1px solid #e3ebe2; white-space: nowrap; }
  th { background: #f5f8f3; color: #405b46; }
  .flags { padding-left: 18px; }
  .report > details { margin: 14px 0; }
  input { caret-color: #52764b; }
  ::selection { background: #dbe9d5; color: #26392d; }
  * { scrollbar-width: thin; scrollbar-color: #a0b499 #f1f5ee; }
  @media (max-width: 1000px) { .filter-extra .fields { grid-template-columns: repeat(2,minmax(0,1fr)); } }
  @media (max-width: 700px) {
    .help-copy, .fields, .fields.two, .sort-row { grid-template-columns: 1fr; }
    .checks { grid-template-columns: 1fr; }
    .indices { grid-template-columns: 1fr; }
    .metrics { grid-template-columns: repeat(2,minmax(0,1fr)); }
    .rule { grid-template-columns: minmax(0,1fr) 40px; }
    .rule > .field:first-child { grid-column: 1 / -1; }
    .rule > .field:nth-child(3) { grid-column: 1; }
    .rule > .remove-rule { grid-column: 2; grid-row: 3; }
    .rule.missing > .remove-rule { grid-row: 2; }
    .tabs { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); width: 100%; }
    .tabs button { padding-inline: 6px; font-size: 12px; }
  }
  @media (max-width: 560px) {
    h2 { font-size: 16px; }
    .filter-extra .fields { grid-template-columns: 1fr; }
    .overview { gap: 12px 20px; }
    .overview b { font-size: 18px; }
    .actions > button { flex: 1 1 150px; }
    .filter-top .heading > button { width: 100%; }
  }
  @media (prefers-reduced-motion: reduce) { .chevron { transition: none !important; } }
`;
