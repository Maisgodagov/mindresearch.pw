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
    color: #496452;
  }
  button {
    min-width: 38px;
    min-height: 38px;
    border: 0;
    background: transparent;
    color: #68776d;
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
    color: #23372a;
    font-size: 28px;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.035em;
    overflow-wrap: anywhere;
  }
  .title-actions { display: flex; align-items: center; justify-content: flex-end; flex-wrap: wrap; gap: 10px; max-width: 100%; min-width: 0; }
  .participant-share { display: flex; align-items: center; gap: 10px; padding: 5px 6px 5px 12px; border: 0; height: 44px; box-sizing: border-box; border-radius: 9px; background: #fff; max-width: 100%; min-width: 0; }
  .participant-address { min-width: 0; display: grid; gap: 2px; }
  .share-label { color: #617266; font-size: 10px; line-height: 1.4; }
  .participant-url { display: block; max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #405c46; font-size: 12px; line-height: 1.5; user-select: all; }
  .copy-participant-link { width: 32px; min-width: 32px; height: 32px; min-height: 32px; padding: 0; flex: none; border: 0; border-radius: 6px; color: #44634b; background: #edf3e8; display: inline-flex; align-items: center; justify-content: center; }
  .copy-participant-link svg { flex: none; }
  .copy-participant-link:focus-visible { outline: 2px solid #64845c; outline-offset: 2px; }
  .edit-survey {
    height: 44px;
    min-height: 44px;
    flex: none;
    padding-inline: 13px;
    border-radius: 9px;
    border: 0 !important;
    color: #405c46;
    font-size: 12px;
  }
  .edit-survey:hover:not(:disabled) {
    background: #edf4ea;
    color: #365532;
  }
  @media (max-width: 560px) {
    align-items: flex-start;
    min-height: 0;
    h1 { font-size: 23px; }
    .title-actions { width: 100%; flex-wrap: nowrap; justify-content: flex-start; gap: 8px; }
    .participant-share { flex: 1; }
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
    background: #edf4ea;
    color: #52764b;
  }
  .ant-card-body > div { min-width: 0; }
  b {
    display: block;
    color: #2e4935;
    font-size: 23px;
    font-weight: 750;
    line-height: 1.15;
    font-variant-numeric: tabular-nums;
  }
  span {
    display: block;
    margin-top: 3px;
    color: #6c7b70;
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
  min-width: 0;
  padding: 19px;
  margin: 0;
  overflow: hidden;
  border-radius: 14px;
  background: #fff;
  h2 {
    margin: 0;
    color: #26392d;
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
  .respondent-title { display: flex; align-items: baseline; flex-wrap: wrap; gap: 5px 10px; min-width: 0; }
  .respondent-count { color: #77857a; font-size: 11px; font-variant-numeric: tabular-nums; }
  .toolbar-actions { display: flex; align-items: center; flex: 0 1 auto; justify-content: flex-end; flex-wrap: wrap; gap: 7px; }
  .toolbar-actions button {
    min-height: 36px;
    padding: 6px 10px;
    border-radius: 8px;
    font-size: 11px;
  }
  .distribution-toolbar h2 { display: flex; align-items: center; gap: 8px; }
  .distribution-toolbar h2 svg { color: #52764b; }
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
  background: rgba(28, 40, 31, 0.48);
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
    background: #edf2eb;
    color: #53665a;
  }
  h2 {
    font:
      600 25px var(--font-heading),
      serif;
    color: #344d3b;
    margin: 0 42px 11px 0;
  }
  p {
    color: #69776e;
    line-height: 1.6;
    font-size: 14px;
  }
  .warning {
    padding: 12px 13px;
    border-radius: 12px;
    background: #f7f1e8;
    color: #716548;
    font-size: 12px;
  }
  .buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 22px;
  }
  .cancel {
    border: 1px solid #cfdbce;
    background: #fff;
    color: #52675a;
    border-radius: 12px;
    padding: 11px 15px;
    font-weight: 700;
  }
  .confirm {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 0;
    background: #9a5752;
    color: #fff;
    border-radius: 12px;
    padding: 11px 15px;
    font-weight: 750;
  }
  .confirm:hover {
    background: #874844;
  }
  .confirm:disabled {
    opacity: 0.6;
  }
`;
