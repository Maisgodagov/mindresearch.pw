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
  .edit-survey {
    min-height: 38px;
    flex: none;
    padding-inline: 13px;
    border-radius: 9px;
    border-color: #d6e1d4;
    color: #405c46;
    font-size: 12px;
  }
  .edit-survey:hover:not(:disabled) {
    border-color: #c7d8c3;
    background: #edf4ea;
    color: #365532;
  }
  @media (max-width: 560px) {
    align-items: flex-start;
    min-height: 0;
    h1 { font-size: 23px; }
    .edit-survey { min-height: 36px; padding-inline: 10px; font-size: 11px; }
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
  .share-heading { margin-bottom: 10px; }
  .share-content {
    display: flex;
    align-items: center;
    gap: 9px;
    min-width: 0;
  }
  .link {
    min-width: 0;
    flex: 1;
    overflow: hidden;
    padding: 10px 12px;
    border: 1px solid #e4ebe1;
    border-radius: 9px;
    background: #f7f9f6;
    color: #506957;
    font-size: 12px;
    line-height: 1.3;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .copy-link {
    min-height: 38px;
    flex: none;
    padding: 7px 12px;
    border: 1px solid #d8e2d6;
    border-radius: 9px;
    background: #fff;
    color: #405a46;
    font-size: 12px;
  }
  .copy-link:hover:not(:disabled) {
    border-color: #c6d6c2;
    background: #f1f6ef;
    color: #365532;
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
  .toolbar-actions { display: flex; align-items: center; flex: none; gap: 7px; }
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
    .toolbar-actions button { flex: 1; justify-content: center; }
  }
  @media (max-width: 560px) {
    padding: 10px;
    border-radius: 12px;
    h2 { font-size: 15px; }
    .share-heading { margin-bottom: 6px; }
    .share-content { gap: 5px; }
    .link { padding: 7px 7px; font-size: 9px; }
    .copy-link { min-height: 32px; padding: 5px 7px; font-size: 9px; }
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
