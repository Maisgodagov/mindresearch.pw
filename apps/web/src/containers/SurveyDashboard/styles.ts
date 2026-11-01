import styled from "styled-components";
import { Button, Card } from "../../ui";

export const Wrap = styled.div<{ $embedded: boolean }>`
  display: grid;
  align-content: start;
  gap: 14px;
  width: ${(p) => (p.$embedded ? "100%" : "min(100% - 32px, 1440px)")};
  min-width: 0;
  margin: auto;
  padding-bottom: 60px;
@media (max-width: 560px) {
    width: ${(p) => (p.$embedded ? "100%" : "calc(100% - 24px)")};
    gap: 10px;
    padding-bottom: 76px;
  }
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 54px;
  padding: 10px 0 4px;
  .brand {
    display: flex;
    gap: 9px;
    align-items: center;
    font-weight: 750;
    color: var(--color-text-496452);
  }
  button {
    min-width: 38px;
    min-height: 38px;
    border: 0;
    background: transparent;
    color: var(--color-text-68776d);
  }
`;

export const SurveyTitleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  min-height: 50px;
  h1 {
    min-width: 0;
    margin: 0;
    color: var(--color-text-23372a);
    font-size: 28px;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.035em;
    overflow-wrap: anywhere;
  }
  .title-actions { display: flex; align-items: center; justify-content: flex-end; flex-wrap: wrap; gap: 10px; max-width: 100%; min-width: 0; }
  .participant-share { display: flex; align-items: center; gap: 10px; padding: 5px 6px 5px 12px; border: 0; height: 44px; box-sizing: border-box; border-radius: 9px; background: var(--color-surface); max-width: 100%; min-width: 0; }
  .participant-address { min-width: 0; display: grid; gap: 2px; }
  .share-label { color: var(--color-text-617266); font-size: 10px; line-height: 1.4; }
  .participant-url { display: block; max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--color-text-405c46); font-size: 12px; line-height: 1.5; user-select: all; }
  .copy-participant-link { width: 32px; min-width: 32px; height: 32px; min-height: 32px; padding: 0; flex: none; border: 0; border-radius: 6px; color: var(--color-text-44634b); background: var(--color-brand-soft); display: inline-flex; align-items: center; justify-content: center; }
  .copy-participant-link svg { flex: none; }
  .copy-participant-link:focus-visible { outline: 2px solid var(--color-brand); outline-offset: 2px; }
  .edit-survey {
    height: 44px;
    min-height: 44px;
    flex: none;
    padding-inline: 13px;
    border-radius: 9px;
    border: 0 !important;
    color: var(--color-text-405c46);
    font-size: 12px;
  }
  .edit-survey:hover:not(:disabled) {
    background: var(--color-brand-soft);
    color: var(--color-text-365532);
  }
  @media (max-width: 560px) {
    align-items: flex-start;
    min-height: 0;
    h1 { font-size: 23px; }
    .title-actions { width: 100%; flex-wrap: wrap; justify-content: flex-start; gap: 8px; }
    .title-actions > button { flex: 1 1 auto; }
    .participant-share { flex: 1 1 100%; }
    .participant-url { max-width: 100%; font-size: 11px; }
    .edit-survey { min-height: 44px; padding-inline: 10px; font-size: 11px; }
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 11px;
  min-width: 0;
  @media (max-width: 560px) { gap: 6px; }
`;

export const Stat = styled(Card)`
  min-width: 0;
  overflow: hidden;
  border-radius: 12px;
  .ant-card-body {
    min-height: 76px;
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 13px 15px;
  }
  .ant-card-body > svg {
    width: 34px;
    height: 34px;
    flex: none;
    padding: 8px;
    border-radius: 9px;
    background: var(--color-brand-soft);
    color: var(--color-text-52764b);
  }
  .ant-card-body > div { min-width: 0; }
  b {
    display: block;
    color: var(--color-text-2e4935);
    font-size: 23px;
    font-weight: 750;
    line-height: 1.15;
    font-variant-numeric: tabular-nums;
  }
  span {
    display: block;
    margin-top: 3px;
    color: var(--color-text-6c7b70);
    font-size: 11px;
    line-height: 1.25;
  }
  @media (max-width: 560px) {
    .ant-card-body {
      min-height: 0;
      align-items: center;
      flex-direction: row;
      gap: 6px;
      padding: 8px 7px;
    }
    .ant-card-body > svg { width: 22px; height: 22px; padding: 4px; border-radius: 6px; }
    b { font-size: 17px; }
    span { margin-top: 1px; font-size: 9px; }
  }
`;

export const Panel = styled(Card)`
  .distribution-selection { display:grid;gap:12px;margin:16px 0;font-size:13px;color:var(--color-muted); }
  .distribution-selection p { margin:0; line-height:1.6; }
  .distribution-conditions { display:flex; flex-wrap:wrap; gap:7px; }
  .distribution-conditions button { display:inline-flex; align-items:center; gap:8px; max-width:100%; padding:7px 9px; border:0; border-radius:6px; background:var(--color-brand-soft); color:var(--color-text-365332); font:inherit; font-size:12px; text-align:left; overflow-wrap:anywhere; cursor:pointer; }
  .distribution-conditions button svg { flex:none; }
  .distribution-conditions button:hover { background:var(--color-brand-soft); }
  .distribution-conditions button:focus-visible { outline:2px solid var(--color-brand); outline-offset:3px; }
  .distribution-multiple { display:flex;align-items:center;gap:8px;width:fit-content;cursor:pointer;color:var(--color-ink); }
  .distribution-multiple input { accent-color:var(--color-brand); }
  .distribution-range,.distribution-selection-actions { display:flex;align-items:center;gap:10px;flex-wrap:wrap; }
  .distribution-range input { width:100px!important; }
  .distribution-values { margin-top:20px;font-size:13px; }
  .distribution-values summary { cursor:pointer;color:var(--color-brand-ink); }
  .distribution-values > div { display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;max-height:220px;overflow:auto; }
  .distribution-values button { border:1px solid var(--color-border);border-radius:7px;background:var(--color-surface);padding:8px 10px;cursor:pointer;font:inherit;color:var(--color-ink); }
  .distribution-values button[aria-pressed="true"] { background:var(--color-brand-soft);border-color:var(--color-brand); }
  .distribution-values button:focus-visible { outline:2px solid var(--color-brand);outline-offset:2px; }

  min-width: 0;
  padding: 19px;
  margin: 0;
  overflow: hidden;
  border-radius: 14px;
  background: var(--color-surface);
  h2 {
    margin: 0;
    color: var(--color-text-26392d);
    font-family: var(--font-body);
    font-size: 18px;
    font-weight: 700;
    line-height: 1.3;
    letter-spacing: -0.02em;
  }
  .respondent-toolbar,
  .distribution-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-width: 0;
    margin-bottom: 13px;
  }
  .respondent-selected-count { min-height:18px; line-height:18px; margin-top:5px; font-size:12px; color:var(--color-text-526557); font-variant-numeric:tabular-nums; }
  .respondent-title { display: flex; align-items: baseline; flex-wrap: wrap; gap: 5px 10px; min-width: 0; }
  .respondent-count { color: var(--color-text-77857a); font-size: 11px; font-variant-numeric: tabular-nums; }
  .toolbar-actions { display: flex; align-items: center; flex: 0 1 auto; justify-content: flex-end; flex-wrap: wrap; gap: 7px; }
  .toolbar-actions button {
    min-height: 36px;
    padding: 6px 10px;
    border-radius: 8px;
    font-size: 11px;
  }
  && .toolbar-actions button { border:0 !important; box-shadow:none !important; background:transparent; color:var(--color-text-496044); gap:7px; min-height:34px; border-radius:6px; font-weight:550; }
  && .toolbar-actions button:hover:not(:disabled) { border:0 !important; background:var(--color-brand-soft); color:var(--color-text-365531); }
  && .toolbar-actions button:active:not(:disabled) { background:var(--color-brand-soft); border:0 !important; }
  && .toolbar-actions button:focus-visible { outline:2px solid var(--color-brand); outline-offset:2px; }
  && .toolbar-actions .delete-action:not(:disabled) { color:var(--color-text-965644); }
  && .toolbar-actions .delete-action:hover:not(:disabled) { color:var(--color-text-884430); background:var(--color-palette-f8ede8); }
  && .toolbar-actions button:disabled { color:var(--color-text-9aa398); background:transparent; cursor:not-allowed; }
  .distribution-toolbar h2 { display: flex; align-items: center; gap: 8px; }
  .distribution-toolbar h2 svg { color: var(--color-text-52764b); }
  @media (max-width: 700px) {
    padding: 15px;
    .respondent-toolbar,
    .distribution-toolbar { align-items: flex-start; flex-direction: column; gap: 9px; }
    .toolbar-actions { width: 100%; }
    .toolbar-actions button { flex: 0 1 auto; justify-content: center; }
  }
  @media (max-width: 560px) {
    padding: 10px;
    border-radius: 12px;
    h2 { font-size: 15px; }
    .respondent-toolbar,
    .distribution-toolbar { gap: 6px; margin-bottom: 8px; }
    .toolbar-actions button { min-height: 30px; padding: 4px 6px; font-size: 9px; }
  }
`;

export const ConfirmOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 110;
  display: grid;
  place-items: center;
  padding: 18px;
  background: var(--color-brand-alpha-480);
  backdrop-filter: blur(4px);
`;

export const ConfirmModal = styled(Card)`
  width: min(100%, 470px);
  padding: 26px;
  border-radius: 22px;
  position: relative;
  .close {
    position: absolute;
    right: 16px;
    top: 16px;
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    border: 0;
    border-radius: 10px;
    background: var(--color-brand-soft);
    color: var(--color-text-53665a);
  }
  h2 {
    font:
      600 25px var(--font-heading),
      serif;
    color: var(--color-text-344d3b);
    margin: 0 42px 11px 0;
  }
  p {
    color: var(--color-text-69776e);
    line-height: 1.6;
    font-size: 14px;
  }
  .warning {
    padding: 12px 13px;
    border-radius: 12px;
    background: var(--color-palette-f7f1e8);
    color: var(--color-text-716548);
    font-size: 12px;
  }
  .buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 22px;
  }
  .cancel {
    border: 1px solid var(--color-border-strong);
    background: var(--color-surface);
    color: var(--color-text-52675a);
    border-radius: 12px;
    padding: 11px 15px;
    font-weight: 700;
  }
  .confirm {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 0;
    background: var(--color-palette-9a5752);
    color: var(--color-text-fff);
    border-radius: 12px;
    padding: 11px 15px;
    font-weight: 750;
  }
  .confirm:hover {
    background: var(--color-palette-874844);
  }
  .confirm:disabled {
    opacity: 0.6;
  }
`;
