import styled from "styled-components";
import { Card } from "../../components/Card";

export const Head = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
  margin-bottom: 28px;
  h1 {
    font:
      500 clamp(32px, 5vw, 46px) var(--font-heading),
      serif;
    margin: 7px 0;
    color: #304a38;
    letter-spacing: -0.025em;
  }
  .hello {
    color: #758178;
  }
  a {
    text-decoration: none;
  }
  @media (max-width: 560px) {
    align-items: center;
    flex-direction: row;
    gap: 12px;
    margin-bottom: 16px;
    h1 { font-size: 25px; margin: 3px 0; white-space: nowrap; }
    .hello { display: none; }
    a {
      flex: 0 0 auto;
      margin-left: auto;
    }
    button {
      padding: 0 12px;
      white-space: nowrap;
    }
  }
`;
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 500px), 1fr));
  gap: 16px;
  @media (max-width: 520px) { gap: 12px; }
`;
export const EmptyState = styled.section`
  grid-column: 1 / -1;
  display: grid;
  justify-items: center;
  gap: 12px;
  max-width: 620px;
  margin: clamp(36px, 9vh, 92px) auto;
  padding: clamp(28px, 5vw, 48px);
  border: 1px solid #dce6d9;
  border-radius: 20px;
  background: rgba(255, 255, 255, .82);
  text-align: center;
  .icon {
    display: grid;
    width: 52px;
    height: 52px;
    place-items: center;
    border-radius: 16px;
    background: #e9f1e5;
    color: #52764b;
  }
  h2 { margin: 4px 0 0; color: #304a38; font: 600 22px var(--font-heading), serif; }
  p { max-width: 440px; margin: 0; color: #758178; line-height: 1.65; }
`;
export const SectionTitle = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-top: 8px;
  padding: 0 3px;
  h2 {
    margin: 0;
    color: #3a5441;
    font:
      600 24px var(--font-heading),
      serif;
  }
  span {
    display: grid;
    min-width: 28px;
    height: 28px;
    padding: 0 8px;
    place-items: center;
    border: 1px solid #dce6d9;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.58);
    color: #708075;
    font-size: 11px;
    font-weight: 700;
  }
  &.drafts {
    margin-top: 20px;
    padding-top: 24px;
    border-top: 1px solid #dce5da;
  }
`;
export const SurveyCard = styled(Card)`
  container-name: survey-card;
  container-type: inline-size;
  border-radius: 18px;
  border-color: #e1e8df;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
  & > .ant-card-body {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas:
      "head head"
      "info metrics"
      "actions actions";
    column-gap: 20px;
    padding: 18px 20px 16px;
  }
  &:hover {
    border-color: #d2ded0;
    box-shadow: 0 17px 44px rgba(48, 70, 54, 0.08);
  }
  .card-head {
    grid-area: head;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .card-tools {
    display: flex;
    align-items: center;
    gap: 3px;
  }
  .card-tools .tool-button,
  .card-tools .delete {
    display: grid;
    place-items: center;
    box-sizing: border-box;
    width: 36px;
    min-width: 36px;
    height: 36px;
    min-height: 36px;
    padding: 0;
    line-height: 1;
    border: 0;
    border-radius: 10px;
    background: transparent;
    color: #74837a;
    box-shadow: none;
    transition:
      background 0.15s ease,
      color 0.15s ease;
  }
  .card-tools .edit:hover {
    background: #edf3eb;
    color: #45624e;
  }
  &&&&& .card-tools .delete:hover {
    background: #f7e3e0 !important;
    color: #9c413a !important;
    border-color: transparent !important;
    filter: none !important;
  }
  h2 {
    font:
      600 21px var(--font-heading),
      serif;
    margin: 8px 0 5px;
    color: #344e3c;
    letter-spacing: -0.018em;
  }
  .description {
    min-height: 0;
  }
  .status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    color: #52705a;
    background: #e4eee1;
    padding: 5px 8px;
    border-radius: 20px;
  }
  .draft {
    background: #f0eee5;
    color: #7d7255;
  }
  .archived {
    background: #e9ece9;
    color: #69746d;
  }
  .description {
    color: #78847b;
    font-size: 13px;
    line-height: 1.5;
  }
  .card-info {
    grid-area: info;
    align-self: start;
    min-width: 0;
    padding: 2px 0 0;
  }
  .survey-date {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 12px;
    color: #87928b;
    font-size: 11px;
  }
  .survey-date svg {
    flex: none;
  }
  .metrics {
    grid-area: metrics;
    display: grid;
    align-content: center;
    justify-self: stretch;
    gap: 12px;
    margin: 0;
    padding: 3px 0 3px 18px;
    border-left: 1px solid #e6ece4;
    color: #77847b;
    font-size: 11px;
  }
  .metrics span {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    white-space: normal;
  }
  .metrics svg {
    color: #849287;
    width: 16px;
    height: 16px;
  }
  .metrics b {
    color: #42594a;
    font-size: 16px;
    font-weight: 750;
    font-variant-numeric: tabular-nums;
  }
  .metrics small {
    color: inherit;
    font-size: 12px;
  }
  .actions {
    grid-area: actions;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #e6ece4;
    margin-top: 17px;
    padding-top: 12px;
    gap: 10px;
  }
  .links {
    display: flex;
    gap: 7px;
    align-items: center;
    min-width: 0;
    flex-wrap: wrap;
  }
  .actions > a {
    flex: none;
    padding: 8px 2px;
    white-space: nowrap;
  }
  .actions .open-survey-link {
    justify-content: center;
    padding: 8px 10px;
    border-radius: 9px;
    white-space: nowrap;
    transition:
      background 0.15s ease,
      color 0.15s ease;
  }
  .actions .open-survey-link:hover {
    background: #edf3eb;
    color: #365642;
  }
  a,
  .copy,
  .publish,
  .continue,
  .archive-action {
    color: #45624e;
    text-decoration: none;
    font-weight: 700;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .copy,
  .publish,
  .continue,
  .archive-action {
    border: 0;
    background: #edf3eb;
    padding: 8px 10px;
    border-radius: 9px;
    cursor: pointer;
  }
  .copy-label-short { display: none; }
  && .copy,
  && .archive-action,
  && .copy:hover,
  && .archive-action:hover,
  && .copy:active,
  && .archive-action:active {
    border: 0 !important;
    outline: 0;
  }
  .publish {
    background: #557660;
    color: #fff;
  }
  .continue {
    background: #557660;
    color: #fff;
    padding: 8px 10px;
    border-radius: 9px;
  }
  .publish:hover {
    background: #45644f;
  }
  .publish:disabled,
  .archive-action:disabled {
    opacity: 0.55;
    cursor: wait;
  }
  .archive-action {
    background: #f0f2ed;
    color: #607066;
  }
  @media (max-width: 900px) {
    & > .ant-card-body {
      grid-template-columns: minmax(0, 1fr);
      grid-template-areas: "head" "info" "metrics" "actions";
      row-gap: 0;
    }
    .card-info {
      padding-bottom: 0;
    }
    .metrics {
      display: flex;
      justify-self: start;
      flex-wrap: wrap;
      gap: 8px 16px;
      margin: 14px 0 0;
      padding: 0;
      border: 0;
      border-left: 0;
    }
    .metrics span {
      white-space: normal;
    }
    .actions {
      margin-top: 14px;
    }
    .actions {
      align-items: center;
      flex-wrap: nowrap;
    }
    .links {
      align-items: center;
      flex-wrap: nowrap;
      flex: 1 1 auto;
      gap: 5px;
    }
    .actions > a {
      flex: 0 0 auto;
      margin-left: 0;
      white-space: nowrap;
    }
    .links:has(.continue) > .continue,
    .links:has(.continue) > .publish {
      box-sizing: border-box;
      flex: 1 1 0;
      min-width: 0;
      height: 40px;
      min-height: 40px;
      padding: 0 8px;
      align-items: center;
      justify-content: center;
    }
  }
  @media (max-width: 520px) {
    & > .ant-card-body { padding: 14px; }
    h2 { font-size: 19px; margin: 5px 0 3px; }
    .description { font-size: 12px; line-height: 1.4; }
    .survey-date { margin-top: 8px; }
    .metrics { margin-top: 9px; }
    .actions { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; margin-top: 8px; padding-top: 7px; }
    .links {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      width: auto;
      flex: 1 1 auto;
      gap: 3px;
    }
    .links > * { min-width: 0; justify-content: flex-start; white-space: nowrap; padding: 4px 5px; min-height: 29px; font-size: 10px; border-radius: 7px; }
    .links .copy { background: #edf3eb; }
    .links .copy-label-full { display: none; }
    .links .copy-label-short { display: inline; }
    .links .open-survey-link { min-height: 29px; }
    .links .archive-action { min-height: 29px; background: #f0f2ed; }
    .links:has(.continue) {
      width: 100%;
      flex: 1 1 100%;
      gap: 4px;
    }
    .links:has(.continue) > .continue,
    .links:has(.continue) > .publish {
      box-sizing: border-box;
      flex: 1 1 0;
      width: 50%;
      min-width: 0;
      height: 32px !important;
      min-height: 32px !important;
      max-height: 32px;
      padding: 0 8px !important;
      align-items: center;
      justify-content: center;
    }
    .actions > a {
      margin-left: auto;
      max-width: 100%;
      white-space: normal;
      text-align: right;
      font-size: 11px;
      padding: 4px 0;
    }
    .actions > .continue, .actions > .publish, .actions > .archive-action { justify-content: center; }
    .metrics { gap: 6px 12px; }
    .metrics span { gap: 5px; }
    .metrics small { font-size: 11px; }
  }
  @container survey-card (max-width: 480px) {
    & > .ant-card-body {
      grid-template-columns: minmax(0, 1fr);
      grid-template-areas: "head" "info" "metrics" "actions";
      row-gap: 0;
    }
    .metrics {
      display: flex;
      justify-self: start;
      flex-wrap: wrap;
      gap: 8px 16px;
      margin: 12px 0 0;
      padding: 0;
      border: 0;
    }
    .actions { align-items: center; flex-wrap: wrap; }
    .links {
      flex: 1 1 100%;
      flex-wrap: wrap;
    }
    .actions > a { margin-left: auto; }
  }
`;
export const TrashBar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 22px;
  .open-trash {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    border: 0;
    background: transparent;
    color: #7a877f;
    font-size: 12px;
    padding: 9px;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .open-trash:hover {
    color: #4e6956;
  }
`;
export const TrashPanel = styled(Card)`
  margin-top: 8px;
  padding: 20px;
  border-radius: 18px;
  h2 {
    font:
      600 20px var(--font-heading),
      serif;
    color: #3b5342;
    margin: 0 0 5px;
  }
  .hint {
    color: #7b887f;
    font-size: 12px;
    margin: 0 0 14px;
  }
  .items {
    display: grid;
    gap: 9px;
  }
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    padding: 13px 14px;
    border: 1px solid #e1e7df;
    border-radius: 13px;
    background: #fbfcfa;
  }
  .item b {
    display: block;
    color: #425848;
    overflow-wrap: anywhere;
  }
  .item span {
    font-size: 11px;
    color: #829087;
  }
  .restore {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    flex: 0 0 auto;
    border: 1px solid #cbd8ca;
    border-radius: 10px;
    background: #fff;
    color: #4c6954;
    padding: 9px 11px;
    font-weight: 750;
    font-size: 12px;
  }
  .restore:disabled {
    opacity: 0.55;
  }
  .empty {
    padding: 14px;
    text-align: center;
    color: #829087;
    font-size: 12px;
  }
  @media (max-width: 520px) {
    padding: 15px;
    .item {
      align-items: flex-start;
      flex-direction: column;
      gap: 10px;
      padding: 12px;
    }
    .restore {
      max-width: 100%;
    }
  }
`;
