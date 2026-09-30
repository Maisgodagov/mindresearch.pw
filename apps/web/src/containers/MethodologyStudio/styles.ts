import styled from 'styled-components';

export const Panel = styled.div`
  display: grid;
  grid-template-columns: minmax(300px, 360px) minmax(0, 1fr);
  gap: 16px;
  align-items: start;
  .editor {
    padding: 18px;
    border-radius: 18px;
  }
  .section-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }
  .section h2 {
    margin: 0;
    color: #395540;
    font-size: 18px;
  }
  .editor {
    display: grid;
    gap: 14px;
  }
  .intro {
    color: #758279;
    font-size: 13px;
    line-height: 1.5;
    margin: 0;
  }
  .section {
    padding: 16px;
    border: 1px solid #e0e8dc;
    border-radius: 14px;
    background: #fff;
    display: grid;
    gap: 12px;
  }
  .section-head p {
    margin: 3px 0 0;
    color: #829087;
    font-size: 12px;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
  .field {
    display: grid;
    gap: 5px;
    color: #53685a;
    font-size: 12px;
    font-weight: 650;
  }
  .field.full {
    grid-column: 1/-1;
  }
  input,
  textarea,
  select {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #d6e1d3;
    border-radius: 10px;
    background: #fff;
    padding: 10px 12px;
    color: #263a2d;
    font: inherit;
    font-size: 14px;
    outline: none;
  }
  input:focus,
  textarea:focus {
    border-color: #779580;
    box-shadow: 0 0 0 3px #edf4ec;
  }
  textarea {
    min-height: 82px;
    resize: vertical;
  }
  .small-input {
    max-width: 100px;
  }
  .rows {
    display: grid;
    gap: 8px;
  }
  .row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 8px;
    align-items: center;
  }
  .row.question {
    grid-template-columns: 34px minmax(0, 1fr) auto;
  }
  .row.option {
    grid-template-columns: 95px minmax(0, 1fr) auto;
  }
  .row.source {
    grid-template-columns: minmax(150px, 0.8fr) minmax(180px, 1.2fr) auto;
  }
  .number {
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #edf3e9;
    color: #52715a;
    font-size: 12px;
    font-weight: 750;
  }
  .icon-button {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border: 1px solid #d6e1d3;
    border-radius: 10px;
    background: #f7faf6;
    color: #62796a;
    cursor: pointer;
  }
  .add {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    min-height: 38px;
    padding: 0 13px;
    border: 1px solid #bfd0bd;
    border-radius: 10px;
    background: #e8f1e5;
    color: #42614a;
    font-weight: 700;
    cursor: pointer;
  }
  .add:hover {
    background: #dcebd8;
  }
  .pill {
    display: inline-flex;
    padding: 5px 8px;
    border-radius: 999px;
    background: #eef4eb;
    color: #56745d;
    font-size: 11px;
    align-items: center;
    gap: 5px;
  }
  .muted {
    font-size: 12px;
    line-height: 1.5;
    color: #7f8d83;
    margin: 0;
  }
  .bulk-import {
    display: grid;
    gap: 8px;
    padding: 12px;
    border: 1px dashed #cbd9c8;
    border-radius: 12px;
    background: #f8faf6;
  }
  .bulk-import textarea {
    min-height: 96px;
    resize: vertical;
  }
  .coverage-warning {
    margin: 10px 0 0;
    padding: 10px 12px;
    border-radius: 10px;
    background: #f6f2e7;
    color: #786842;
    font-size: 12px;
    line-height: 1.5;
  }
  .scale {
    display: grid;
    gap: 9px;
    padding: 13px;
    border: 1px solid #e0e8dc;
    border-radius: 12px;
    background: #fbfcfa;
  }
  .scale-top {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 140px auto;
    gap: 8px;
    align-items: center;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .chip {
    display: inline-flex;
    gap: 5px;
    align-items: center;
    padding: 5px 8px;
    border: 1px solid #dce5d9;
    border-radius: 8px;
    background: white;
    color: #52665a;
    font-size: 11px;
  }
  .chip input {
    width: auto;
    margin: 0;
    accent-color: #557660;
  }
  .case {
    padding: 12px;
    border: 1px solid #e1e9de;
    border-radius: 12px;
    display: grid;
    gap: 9px;
  }
  .case-head {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    align-items: center;
  }
  .case textarea {
    font:
      12px/1.5 ui-monospace,
      Consolas,
      monospace;
    min-height: 74px;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
    align-items: center;
  }
  .feedback {
    padding: 12px;
    border-radius: 11px;
    background: #f0f5ed;
    color: #45644c;
    font-size: 12px;
  }
  .feedback.error {
    background: #fff1ef;
    color: #a03e35;
  }
  .guard {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    padding: 12px;
    border-radius: 11px;
    background: #f6f2e7;
    color: #786842;
    font-size: 12px;
    line-height: 1.5;
  }
  .head-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .validation-case {
    margin-top: 9px;
    padding-top: 8px;
    border-top: 1px solid rgba(80, 110, 85, 0.15);
  }
  .validation-scale {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 12px;
    margin-top: 5px;
    font-size: 11px;
  }
  .validation-scale .ok {
    color: #3d7048;
  }
  .validation-scale .bad {
    color: #a03e35;
  }
  @media (max-width: 850px) {
    grid-template-columns: 1fr;
    .list { max-width: none; }
    .drafts {
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      max-height: 260px;
    }
    .grid {
      grid-template-columns: 1fr;
    }
    .field.full {
      grid-column: auto;
    }
    .row.source,
    .scale-top {
      grid-template-columns: 1fr;
    }
    .row.option {
      grid-template-columns: 80px minmax(0, 1fr) auto;
    }
  }
`;
