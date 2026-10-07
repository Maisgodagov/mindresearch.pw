import styled from 'styled-components';
import { Button, Card } from '../../ui';

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 16px;
  min-width: 0;
  .header-copy { min-width: 0; }
  h1 {
    font: 700 27px/1.2 var(--font-heading), sans-serif;
    color: #24332a;
    letter-spacing: -.035em;
    margin: 0 0 5px;
  }
  p {
    color: #647268;
    margin: 0;
    font-size: 13px;
    line-height: 1.45;
  }
  @media (max-width: 640px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 9px;
  }
`;
export const Flow = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 14px;
  .step {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #65746a;
  }
  .step:not(:last-child)::after {
    content: "›";
    margin-left: 7px;
    color: #a0aca4;
  }
  .number {
    width: 20px;
    height: 20px;
    flex: 0 0 20px;
    display: grid;
    place-items: center;
    border-radius: 6px;
    background: #e5efe0;
    color: #365532;
    font-size: 10px;
    font-weight: 800;
  }
  b {
    color: #53675a;
    font-size: 11px;
  }
  @media (max-width: 680px) {
    overflow-x: auto;
    padding-bottom: 2px;
    .step {
      flex: none;
    }
  }
`;
export const WorkspaceBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;
  padding: 9px 11px 9px 13px;
  border: 1px solid #d8e3d6;
  border-radius: 13px;
  background: #edf4ea;
  .save {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    color: #65756a;
    font-size: 11px;
  }
  .save-copy {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .dot {
    width: 7px;
    height: 7px;
    flex: none;
    border-radius: 50%;
    background: #6e9076;
    box-shadow: 0 0 0 4px rgba(110, 144, 118, 0.12);
  }
  .saved-at {
    color: #87938b;
    white-space: nowrap;
  }
  .tools {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: none;
  }
  .preview-note {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: #66766b;
    font-size: 11px;
  }
  .preview-note svg {
    color: #55745e;
  }
  b {
    color: #405b48;
  }
  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 36px;
    padding: 8px 12px;
    border: 0;
    border-radius: 10px;
    background: #55745e;
    color: #fff;
    font-size: 12px;
    font-weight: 750;
    white-space: nowrap;
  }
  button:disabled {
    opacity: 0.6;
    cursor: wait;
  }
  .error {
    color: #9a5a55;
    font-size: 12px;
  }
  @media (max-width: 700px) {
    align-items: stretch;
    flex-direction: column;
    .tools {
      justify-content: space-between;
    }
    .preview-note {
      display: none;
    }
    .saved-at {
      margin-left: auto;
    }
  }
`;
export const Columns = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
  align-items: start;
  gap: 22px;
  min-width: 0;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  .editor-column {
    display: grid;
    align-content: start;
    gap: 15px;
    min-width: 0;
  }
  .structure-panel {
    min-width: 0;
    width: 100%;
    box-sizing: border-box;
  }
  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 15px;
  }
`;
export const HeaderSaveStatus = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex: none;
  color: #627166;
  font-size: 11px;
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #719077;
  }
  .status-copy { font-weight: 650; }
  .saved-time { color: #78867b; }
  @media (max-width: 640px) { align-self: flex-start; }
`;
export const SurveyTitleField = styled.div`
  width: min(100%, 820px);
  min-width: 0;
  label {
    display: block;
    margin: 0 0 7px 2px;
    color: #526553;
    font-size: 12px;
    font-weight: 700;
  }
  input {
    width: 100%;
    min-height: 48px;
    padding: 11px 15px;
    border: 1px solid #d5e0d2;
    border-radius: 11px;
    background: #fff;
    color: #293a2e;
    font-size: 16px;
    font-weight: 650;
    box-shadow: 0 1px 2px rgba(31, 48, 34, .035);
  }
  input:focus { border-color: #83a17e; outline: 3px solid rgba(112, 150, 108, .15); }
  input.invalid { border-color: #c96d67; background: #fff8f7; }
`;
export const SurveySettings = styled.details`
  width: 100%;
  border: 1px solid #dce4da;
  border-radius: 14px;
  background: rgba(255, 255, 255, .72);
  overflow: hidden;
  > summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    min-height: 54px;
    padding: 12px 17px;
    color: #344b39;
    cursor: pointer;
    font-size: 13px;
    font-weight: 700;
    list-style: none;
  }
  > summary::-webkit-details-marker { display: none; }
  > summary::after { content: "+"; color: #617b60; font-size: 20px; font-weight: 400; }
  &[open] > summary::after { content: "−"; }
  > summary:focus-visible { outline: 3px solid rgba(112, 150, 108, .25); outline-offset: -3px; }
  > .meta-panel { padding: 0 12px 12px; }
  .meta-panel > .ant-card { margin-top: 10px; }
`;
export const Panel = styled(Card)`
  padding: 21px;
  border-radius: 14px;
  border-color: #dce4da;
  box-shadow: 0 1px 2px rgba(31, 48, 34, .035);
  h2 {
    font: 700 19px/1.3 var(--font-heading), sans-serif;
    letter-spacing: -.02em;
    margin: 0 0 6px;
    color: #26362b;
  }
  .hint {
    font-size: 12px;
    color: #68756b;
    line-height: 1.5;
  }
  &.structure-panel {
    padding: 0;
    border-color: #d8e3d5;
    background: #edf3ea;
    box-shadow: none;
    h2 { color: #26382b; }
    > .hint { color: #5f7062; }
    .add-alias { background: #f9fbf8; }
  }
  .field {
    margin-top: 15px;
  }
  label {
    display: block;
    font-size: 12px;
    font-weight: 700;
    color: #65736a;
    margin-bottom: 6px;
  }
  input:not([type="checkbox"]),
  textarea,
  select {
    width: 100%;
    padding: 12px;
    border: 1px solid #d9e2d8;
    border-radius: 9px;
    background: #fff;
    outline: none;
  }
  textarea {
    min-height: 92px;
    resize: vertical;
  }
  input.invalid,
  textarea.invalid {
    border-color: #c96d67;
    background: #fff8f7;
    box-shadow: 0 0 0 3px rgba(190, 83, 76, 0.12);
  }
  &.invalid-panel {
    border-color: #c96d67;
    box-shadow:
      0 0 0 3px rgba(190, 83, 76, 0.1),
      0 20px 60px rgba(48, 70, 54, 0.08);
  }
  > .error {
    margin: 14px 0 0;
    padding: 11px 13px;
    border-radius: 11px;
    background: #fff0ee;
    color: #9b4e49;
    font-size: 13px;
  }
  @media (max-width: 560px) {
    padding: 17px;
    border-radius: 12px;
  }
  .add-alias {
    width: 100%;
    margin-top: 15px;
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 1px dashed #aabca9;
    border-radius: 12px;
    background: #f5f9f3;
    color: #526f5b;
    font-weight: 750;
    cursor: pointer;
  }
  .add-alias:hover {
    background: #eaf2e7;
  }
`;
export const SurveyBasics = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-top: 8px;
  .field {
    margin: 0;
  }
  #root & textarea {
    min-height: 53px;
    height: 53px;
    padding: 14px 14px;
    resize: vertical;
    overflow: auto;
  }
  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;
export const MetaStack = styled.div`
  display: grid !important;
  gap: 14px;
`;
export const SectionHeading = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  .copy {
    min-width: 0;
  }
  .audience {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 9px;
    border-radius: 999px;
    background: #edf3ea;
    color: #56705e;
    font-size: 11px;
    font-weight: 750;
  }
  .audience.private {
    background: #f3efe5;
    color: #766946;
  }
  @media (max-width: 620px) {
    flex-direction: column;
    gap: 8px;
  }
`;
export const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 16px;
  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;
export const PreviewCard = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  border: 1px solid #dce5da;
  border-radius: 18px;
  background: #fff;
  overflow: hidden;
  .preview-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 9px 13px;
    border-bottom: 1px solid #e8ede6;
    color: #728077;
    font-size: 11px;
    font-weight: 700;
  }
  .preview-label span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .editable-field {
    margin-top: 10px;
  }
  .editable-field:first-of-type {
    margin-top: 0;
  }
  .edit-label {
    display: flex;
    align-items: center;
    gap: 5px;
    margin: 0 0 6px;
    color: #718078;
    font-size: 10px;
    font-weight: 750;
  }
  .screen {
    flex: 1;
    padding: 18px;
    min-height: 255px;
  }
  .eyebrow,
  .done {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 12px;
    color: #55705e;
    font-size: 11px;
  }
  .done {
    padding: 5px 8px;
    border-radius: 999px;
    background: #e5efe2;
  }
  .preview-title,
  .preview-copy {
    display: block;
    width: 100%;
    padding: 9px 11px;
    border: 1px dashed #c5d2c3;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.72);
    color: #304a38;
    resize: none;
    overflow: hidden;
    field-sizing: content;
    transition:
      border-color 0.16s,
      background 0.16s,
      box-shadow 0.16s;
  }
  .preview-title {
    min-height: 62px;
    font:
      500 clamp(25px, 3vw, 36px)/1.08 var(--font-heading),
      serif;
  }
  .preview-copy {
    min-height: 66px;
    color: #67766c;
    font-size: 13px;
    line-height: 1.6;
  }
  .preview-title:hover,
  .preview-copy:hover {
    border-color: #8fa68f;
    background: #fff;
  }
  .preview-title:focus,
  .preview-copy:focus {
    outline: none;
    border-style: solid;
    border-color: #6f8d76;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(95, 128, 104, 0.12);
  }
  .preview-title.invalid,
  .preview-copy.invalid {
    background: #fff7f6;
    box-shadow: 0 0 0 5px #fff0ee;
    color: #7d3834;
  }
  .mock-meta {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 12px;
    color: #7e8a82;
    font-size: 10px;
  }
  .mock-button {
    display: inline-flex;
    margin-top: 17px;
    padding: 9px 14px;
    border-radius: 10px;
    background: #56755f;
    color: white;
    font-size: 11px;
    font-weight: 750;
  }
  .preview-settings {
    padding: 11px 13px;
    border-top: 1px solid #e8ede6;
    background: #f5f8f3;
  }
  .preview-settings label {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    margin: 0;
    line-height: 1.4;
  }
  .preview-settings input {
    width: 16px;
    height: 16px;
    flex: 0 0 16px;
    margin-top: 1px;
  }
  @media (max-width: 560px) {
    border-radius: 14px;
  }
`;
export const Stack = styled.div`
  display: grid;
  gap: 10px;
  margin-top: 15px;
  width: 100%;
  min-width: 0;
`;
export const SectionCard = styled.div<{ $dragging?: boolean }>`
  width: 100%;
  min-width: 0;
  border: 1px solid #dce4da;
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
  opacity: ${(p) => (p.$dragging ? 0.45 : 1)};
  transition:
    opacity 0.15s,
    border-color 0.15s;
  &.fixed-screen-card {
    margin-top: 12px;
    border-color: #cfddcb;
    border-left: 3px solid #91aa8d;
    background: #fff;
  }
  .screen-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 8px;
    border-radius: 999px;
    background: #f0f4ed;
    color: #687a69;
    font-size: 10px;
    font-weight: 600;
    white-space: nowrap;
  }
  .screen-fields {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  .screen-field {
    display: grid;
    align-content: start;
    gap: 6px;
    min-width: 0;
    margin: 0;
    color: #65736a;
    font-size: 11px;
    font-weight: 650;
  }
  .screen-field > span {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    line-height: 1.4;
  }
  .screen-field textarea {
    width: 100%;
    min-height: 60px;
    padding: 9px 10px;
    border: 1px solid #d9e2d8;
    border-radius: 8px;
    background: #fff;
    color: #33473a;
    font-size: 12px;
    line-height: 1.5;
    resize: vertical;
    box-sizing: border-box;
  }
  .screen-setting {
    display: flex;
    align-items: center;
    gap: 8px;
    width: fit-content;
    margin: 0;
    color: #617166;
    font-size: 11px;
    font-weight: 550;
    line-height: 20px;
    cursor: pointer;
  }
  .duration-setting {
    display: grid;
    gap: 8px;
    padding: 14px 0;
    border-top: 1px solid #dce5d9;
    border-bottom: 1px solid #dce5d9;
  }
  .duration-label { color: #33473a; font-size: 12px; font-weight: 650; }
  .duration-setting .hint { margin: 0; font-size: 11px; }
  .duration-setting .screen-setting { font-size: 12px; }
  .screen-setting input[type="checkbox"] {
    width: 16px;
    height: 16px;
    min-width: 16px;
    flex: 0 0 16px;
    margin: 0;
    padding: 0;
    accent-color: #52764b;
  }
  @media (max-width: 620px) {
    .screen-fields { grid-template-columns: minmax(0, 1fr); }
    .screen-badge { display: none; }
  }
  .section-head {
    padding: 12px 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 64px;
    box-sizing: border-box;
  }
  .section-name {
    flex: 1;
  }
  .section-name b {
    display: block;
    color: #2d3c31;
    font-size: 14px;
    line-height: 1.35;
  }
  .section-name span {
    font-size: 11px;
    color: #647268;
    line-height: 1.4;
  }
  .section-drag {
    display: grid;
    place-items: center;
    color: #839087;
    cursor: grab;
    width: 28px;
    height: 30px;
    min-height: 30px;
    flex: 0 0 28px;
    padding: 0;
    border: 1px solid transparent;
    border-radius: 7px;
    background: transparent;
    touch-action: none;
    box-sizing: border-box;
  }
  .icon {
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    min-height: 30px;
    min-width: 30px;
    flex: 0 0 30px;
    padding: 0;
    border: 1px solid transparent;
    border-radius: 7px;
    background: transparent;
    color: #75847a;
    box-sizing: border-box;
    transition: background-color .15s ease, color .15s ease;
  }
  .icon:hover {
    border-color: transparent !important;
    background: #f0f4ef;
    color: #405f48;
  }
  .icon:last-child:hover {
    border-color: transparent !important;
    background: #fee4e2 !important;
    color: #b42318 !important;
  }
  .body {
    display: grid;
    gap: 12px;
    padding: 14px 15px 15px;
    border-top: 1px solid #e7ece5;
  }
  .body .field { margin: 0; }
  .body .field > label {
    display: block;
    margin: 0 0 6px;
    color: #65736a;
    font-size: 12px;
    font-weight: 650;
    line-height: 1.35;
  }
  .body input:not([type="checkbox"]) {
    min-height: 40px;
    padding: 8px 11px;
    box-sizing: border-box;
  }
  .body .field.shared-options-field {
    padding: 10px 12px;
    border: 1px solid #e7ede5;
    border-radius: 9px;
    background: #f6f8f5;
  }
  .body .shared-options-toggle {
    display: flex;
    align-items: center;
    gap: 9px;
    min-height: 26px;
    margin: 0;
    color: #5e6d62;
    font-size: 12px;
    font-weight: 600;
    line-height: 1.4;
    cursor: pointer;
  }
  .body input[type="checkbox"] {
    appearance: auto;
    width: 16px;
    height: 16px;
    min-width: 16px;
    flex: 0 0 16px;
    margin: 0;
    padding: 0;
    accent-color: #52764b;
    vertical-align: middle;
    box-sizing: border-box;
  }
  .shared-answer-setting {
    display: grid;
    gap: 6px;
    margin-top: 11px;
  }
  .shared-answer-label {
    color: #68776c;
    font-size: 11px;
    font-weight: 650;
    line-height: 1.4;
  }
  .shared-answer-options {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    width: fit-content;
    max-width: 100%;
    padding: 3px;
    border: 1px solid #e0e8dd;
    border-radius: 9px;
    background: #edf2ea;
  }
  .shared-answer-options button {
    min-height: 30px;
    padding: 5px 10px;
    border: 1px solid transparent;
    border-radius: 6px;
    background: transparent;
    color: #657468;
    font-size: 11px;
    font-weight: 600;
    line-height: 1.2;
    cursor: pointer;
    transition: background-color .15s ease, color .15s ease, box-shadow .15s ease;
  }
  .shared-answer-options button:hover {
    background: #f7f9f6;
    color: #3e5f43;
  }
  .shared-answer-options button.selected {
    border-color: #d5e0d1;
    background: #fff;
    color: #365532;
    box-shadow: 0 1px 2px rgba(36, 63, 32, .08);
  }
  .options {
    display: grid;
    gap: 7px;
  }
  .option {
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .option input {
    min-width: 0;
    flex: 1;
  }
  .option .tiny {
    width: 40px;
    height: 40px;
    min-height: 40px;
    flex: 0 0 40px;
    display: grid;
    place-items: center;
    padding: 0;
    border: 1px solid #d9e2d8;
    border-radius: 8px;
    background: #fff;
    color: #77867c;
    cursor: pointer;
  }
  .option .tiny:hover {
    border-color: transparent !important;
    background: #fee4e2 !important;
    color: #b42318 !important;
  }
  .add-option {
    justify-self: start;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 36px;
    padding: 7px 10px;
    border: 1px solid #dce7d9;
    border-radius: 8px;
    background: #f5f8f3;
    color: #49684e;
    font-size: 12px;
    font-weight: 650;
    cursor: pointer;
    box-sizing: border-box;
    box-shadow: none;
    transition: background-color .15s ease, color .15s ease;
  }
  .add-option:hover {
    background: #eaf1e7;
    color: #365532;
  }
  .library-questions {
    padding: 14px;
    border-top: 1px solid #e4ebe2;
    background: #f7f9f6;
  }
  .library-note {
    display: flex;
    align-items: center;
    gap: 7px;
    margin: 0 0 12px;
    padding: 9px 11px;
    border: 1px solid #e0e8dc;
    border-radius: 8px;
    background: #fff;
    color: #5f6d62;
    font-size: 12px;
    line-height: 1.45;
  }
  .readonly-question {
    display: grid;
    grid-template-columns: 30px minmax(0, 1fr);
    gap: 11px;
    padding: 13px;
    margin-top: 8px;
    border: 1px solid #e0e7de;
    border-radius: 9px;
    background: #fff;
  }
  .readonly-question .number {
    width: 30px;
    height: 30px;
    display: grid;
    place-items: center;
    border-radius: 9px;
    border-radius: 7px;
    background: #e5efe0;
    color: #365532;
    font-size: 12px;
    font-weight: 800;
  }
  .readonly-question b {
    display: block;
    color: #29382e;
    font-size: 13px;
    line-height: 1.5;
  }
  .question-meta {
    margin-top: 4px;
    color: #69766c;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .readonly-options {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 9px;
  }
  .readonly-options span {
    padding: 5px 8px;
    border: 1px solid #dce5da;
    border-radius: 999px;
    background: #f5f8f3;
    color: #617268;
    font-size: 11px;
    line-height: 1.2;
  }
`;
export const QuestionBox = styled.div<{ $dragging?: boolean }>`
  padding: 12px;
  margin: 0;
  border: 1px solid #e0e7de;
  border-radius: 10px;
  background: #fff;
  opacity: ${(p) => (p.$dragging ? 0.45 : 1)};
  transition: 0.15s;
  .qhead {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 10px;
    min-height: 30px;
  }
  .qtitle {
    display: flex;
    align-items: center;
    gap: 7px;
    min-width: 0;
  }
  .qtitle b {
    color: #2d3c31;
    font-size: 14px;
    font-weight: 650;
    line-height: 1.35;
  }
  .drag {
    display: grid;
    place-items: center;
    color: #8b978e;
    cursor: grab;
    border: 0;
    background: transparent;
    width: 26px;
    height: 28px;
    flex: 0 0 26px;
    padding: 0;
    border: 1px solid transparent;
    border-radius: 7px;
    box-sizing: border-box;
    touch-action: none;
  }
  .qactions {
    display: flex;
    align-items: center;
    gap: 3px;
    flex: 0 0 auto;
  }
  .qactions .tiny {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 29px;
    height: 29px;
    min-height: 29px;
    min-width: 29px;
    flex: 0 0 29px;
    padding: 0;
    border: 1px solid transparent;
    border-radius: 7px;
    box-sizing: border-box;
    color: #718078;
    background: transparent;
    transition: background-color .15s ease, color .15s ease;
  }
  .qactions .tiny:hover {
    border-color: transparent !important;
    background: #f0f4ef;
    color: #405f48;
  }
  .qactions .tiny:nth-child(3) {
    width: auto;
    min-width: 0;
    flex: 0 0 auto;
    gap: 5px;
    padding: 0 7px;
    font-size: 11px;
  }
  .qactions .tiny:last-child:hover {
    border-color: transparent !important;
    background: #fee4e2 !important;
    color: #b42318 !important;
  }
  .qgrid {
    display: grid;
    grid-template-columns: 1fr 150px;
    gap: 8px;
  }
  @media (max-width: 560px) {
    .qgrid {
      grid-template-columns: 1fr;
    }
  }
  .options {
    display: grid;
    gap: 6px;
    margin-top: 8px;
  }
  .option {
    display: flex;
    gap: 6px;
    align-items: center;
  }
  .option input {
    min-height: 38px;
    padding: 8px 10px;
    width: auto;
    min-width: 0;
    flex: 1;
    box-sizing: border-box;
  }
  .tiny {
    border: 1px solid transparent;
    background: transparent;
    color: #687970;
    font-size: 12px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    box-sizing: border-box;
  }
  .option .tiny {
    width: 38px;
    height: 38px;
    min-height: 38px;
    flex: 0 0 38px;
    justify-content: center;
    border: 1px solid #d9e2d8;
    border-radius: 8px;
    background: #fff;
    color: #77867c;
    cursor: pointer;
  }
  .option .tiny:hover {
    border-color: transparent !important;
    background: #fee4e2 !important;
    color: #b42318 !important;
  }
  .add-option {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    justify-self: start;
    min-height: 36px;
    border: 1px solid #dce7d9;
    border-radius: 8px;
    background: #f5f8f3;
    color: #49684e;
    padding: 7px 10px;
    font-size: 12px;
    font-weight: 650;
    cursor: pointer;
    box-sizing: border-box;
    box-shadow: none;
    transition: background-color .15s ease, color .15s ease;
  }
  .add-option:hover {
    background: #eaf1e7;
    color: #365532;
  }
  .required {
    display: flex;
    align-items: center;
    width: fit-content;
    gap: 8px;
    font-size: 12px;
    color: #718078;
    margin: 10px 0 0;
    line-height: 20px;
    font-weight: 500;
    cursor: pointer;
  }
  .required input[type="checkbox"] {
    display: block;
    align-self: center;
  }
  .required input {
    width: 16px;
    height: 16px;
    min-width: 16px;
    flex: 0 0 16px;
    margin: 0;
    padding: 0;
    accent-color: #52764b;
  }
  @media (max-width: 560px) {
    padding: 10px;
    .qhead { align-items: flex-start; }
    .qactions { gap: 1px; }
    .qactions .tiny:nth-child(3) { font-size: 0; gap: 0; width: 29px; padding: 0; }
    .qactions .tiny:nth-child(3) svg { flex: 0 0 auto; }
  }
`;
export const AddQuestionButton = styled(Button)`
  width: 100%;
  min-height: 42px;
  margin-top: 2px;
  padding: 7px 12px;
  border: 1px dashed #bdcdb8;
  border-radius: 9px;
  background: #fbfcfa;
  color: #49684e;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  font-size: 12px;
  font-weight: 650;
  box-shadow: none;
  transition: background-color .15s ease, color .15s ease;
  .plus {
    width: 22px;
    height: 22px;
    border-radius: 6px;
    background: #e5efe0;
    display: grid;
    place-items: center;
  }
  &:hover {
    background: #edf4ea;
    color: #365532;
  }
`;
export const Toolbar = styled.div`
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 9px;
  width: 100%;
  min-height: 58px;
  box-sizing: border-box;
  min-width: 0;
  padding: 8px 10px;
  border: 1px solid #ccd9ca;
  border-radius: 13px;
  background: #e5ede2;
  box-shadow: 0 4px 12px rgba(48, 70, 54, 0.08);
  backdrop-filter: blur(12px);
  .toolbar-start,
  .toolbar-end {
    display: flex;
    align-items: center;
    gap: 7px;
    min-width: 0;
  }
  .toolbar-start { flex: 0 0 auto; }
  .toolbar-end { flex: 0 0 auto; }
  .save-status {
    display: flex;
    align-items: center;
    gap: 7px;
    min-width: 0;
    flex: 0 1 auto;
    padding: 0 7px 0 3px;
    border-right: 1px solid #cfdacc;
  }
  .save-status .dot {
    width: 8px;
    height: 8px;
    flex: 0 0 8px;
    border-radius: 50%;
    background: #6e9076;
    box-shadow: 0 0 0 3px rgba(110, 144, 118, 0.12);
  }
  .save-copy {
    color: #52675a;
    font-size: 11px;
    font-weight: 700;
    white-space: nowrap;
  }
  .saved-at {
    color: #849087;
    font-size: 10px;
    white-space: nowrap;
  }
  .catalog-actions { min-width: 0; flex: 0 1 auto; }
  .catalog-actions > * { gap: 6px; }
  .catalog-actions .create-custom,
  .catalog-actions .choose-method {
    min-height: 38px;
    padding-inline: 11px;
    border-radius: 9px;
    font-size: 12px;
    gap: 7px;
  }
  .catalog-actions .choose-method { padding-right: 43px; }
  .catalog-actions .available-count { right: 9px; }
  .preview-tools {
    display: flex;
    align-items: center;
    gap: 7px;
    flex: 0 0 auto;
  }
  .preview-action {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 38px;
    padding-inline: 11px;
    border: 1px solid #d5e1d3;
    border-radius: 9px;
    background: #fff;
    color: #4f6a57;
    font-size: 12px;
    font-weight: 700;
    white-space: nowrap;
  }
  .preview-action:hover:not(:disabled) {
    border-color: #abc0aa !important;
    background: #edf4ea !important;
    color: #405d49 !important;
  }
  .preview-error {
    max-width: 190px;
    overflow: hidden;
    color: #a05252;
    font-size: 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .publish-and-submit {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    padding-left: 2px;
    flex: 0 0 auto;
  }
  .publish-and-submit label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
    margin: 0;
    color: #53675a;
    font-size: 12px;
    font-weight: 650;
  }
  .publish-and-submit label input {
    width: 18px;
    height: 18px;
    margin: 0;
    flex: 0 0 18px;
    accent-color: #5b7a63;
  }
  .create-survey {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    min-height: 42px;
    padding-inline: 17px;
    border: 1px solid #496b54 !important;
    border-radius: 10px;
    background: #526f5b !important;
    color: #fff !important;
    box-shadow: 0 4px 12px rgba(48, 70, 54, 0.16);
    font-weight: 750;
    white-space: nowrap;
  }
  .create-survey:hover:not(:disabled) {
    border-color: #425d4b !important;
    background: #425d4b !important;
    color: #fff !important;
  }
  .create-survey:disabled { opacity: 0.68; }
  .create-custom,
  .choose-method { min-height: 40px; }
  @media (max-width: 1180px) {
    gap: 8px;
    padding-inline: 8px;
    .toolbar-start,
    .toolbar-end { gap: 7px; }
    .save-status { padding-right: 7px; }
    .save-copy { font-size: 10px; }
    .saved-at { display: none; }
    .catalog-actions .create-custom,
    .catalog-actions .choose-method { padding-inline: 8px; font-size: 11px; }
    .catalog-actions .choose-method { padding-right: 39px; }
    .preview-action { padding-inline: 8px; font-size: 11px; }
    .publish-and-submit { gap: 7px; }
    .publish-and-submit label { gap: 6px; font-size: 11px; }
    .create-survey { min-height: 40px; padding-inline: 11px; font-size: 12px; }
  }
  @media (max-width: 620px) {
    align-items: flex-start;
    flex-wrap: wrap;
    .toolbar-start { flex: 1 1 100%; }
    .toolbar-end { width: 100%; justify-content: flex-end; }
  }
  @media (max-width: 560px) {
    .toolbar-start { align-items: flex-start; flex-wrap: wrap; }
    .toolbar-end { align-items: stretch; flex-direction: column; }
    .catalog-actions,
    .preview-tools,
    .publish-and-submit { width: 100%; }
    .catalog-actions > * { width: 100%; }
    .catalog-actions .create-custom,
    .catalog-actions .choose-method { flex: 1; }
    .preview-action { width: 100%; justify-content: center; }
    .publish-and-submit { justify-content: space-between; }
    .create-survey { flex: 1; justify-content: center; }
  }
  @media (max-width: 420px) {
    .toolbar-start { gap: 6px; }
    .catalog-actions > * { flex-wrap: wrap; }
    .catalog-actions .create-custom,
    .catalog-actions .choose-method { flex-basis: 100%; }
    .available-count { display: none; }
  }
`;
