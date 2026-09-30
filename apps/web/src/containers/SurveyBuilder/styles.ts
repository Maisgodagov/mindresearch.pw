import styled from 'styled-components';
import { Button, Card } from '../../ui';

export const Header = styled.div`
  margin-bottom: 10px;
  h1 {
    font:
      500 clamp(30px, 4vw, 40px) var(--font-heading),
      serif;
    color: #304a38;
    margin: 0 0 4px;
  }
  p {
    color: #738077;
    margin: 0;
    font-size: 13px;
    line-height: 1.45;
  }
`;
export const Flow = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 10px;
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
    border-radius: 50%;
    background: #e4eee1;
    color: #45614d;
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
  min-width: 0;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  grid-template-columns: minmax(0, 1.5fr) minmax(300px, 0.72fr);
  grid-template-areas:
    "meta meta"
    "structure library";
  gap: 18px;
  align-items: start;
  > div {
    display: contents;
  }
  .meta-panel {
    grid-area: meta;
  }
  .library-panel {
    grid-area: library;
    width: 100%;
    min-width: 0;
    max-width: 100%;
    box-sizing: border-box;
    margin-top: 0 !important;
    position: sticky;
    top: 18px;
  }
  .library-panel > .ant-card-body { width: 100%; min-width: 0; max-width: 100%; box-sizing: border-box; }
  .structure-panel {
    grid-area: structure;
    min-width: 0;
  }
  @media (max-width: 1280px) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      "meta"
      "structure"
      "library";
    .library-panel {
      position: static;
    }
  }
  @container platform-main (max-width: 1080px) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      "meta"
      "structure"
      "library";
    > div,
    .meta-panel,
    .library-panel,
    .structure-panel {
      min-width: 0;
      width: 100%;
    }
    .library-panel {
      position: static;
    }
  }
`;
export const Panel = styled(Card)`
  padding: 23px;
  border-radius: 21px;
  h2 {
    font:
      600 20px var(--font-heading),
      serif;
    margin: 0 0 7px;
    color: #354e3c;
  }
  .hint {
    font-size: 12px;
    color: #7c8880;
    line-height: 1.5;
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
  input,
  textarea,
  select {
    width: 100%;
    padding: 12px;
    border: 1px solid #d7e0d5;
    border-radius: 11px;
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
    border-radius: 17px;
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
  grid-template-columns: 0.9fr 1.1fr;
  gap: 12px;
  margin-top: 15px;
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
  gap: 18px;
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
`;
export const SectionCard = styled.div<{ $dragging?: boolean }>`
  border: 1px solid #dce5da;
  border-radius: 15px;
  background: #fff;
  overflow: hidden;
  opacity: ${(p) => (p.$dragging ? 0.45 : 1)};
  transition:
    opacity 0.15s,
    border-color 0.15s;
  .section-head {
    padding: 13px;
    display: flex;
    align-items: center;
    gap: 9px;
  }
  .section-name {
    flex: 1;
  }
  .section-name b {
    display: block;
    color: #3b5242;
  }
  .section-name span {
    font-size: 11px;
    color: #819087;
  }
  .section-drag {
    display: grid;
    place-items: center;
    color: #839087;
    cursor: grab;
    padding: 6px 2px;
    border: 0;
    background: transparent;
    touch-action: none;
  }
  .icon {
    border: 0;
    background: transparent;
    color: #75847a;
    padding: 5px;
  }
  .body {
    padding: 0 14px 14px;
    border-top: 1px solid #edf1ec;
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
    flex: 0 0 40px;
    display: grid;
    place-items: center;
    padding: 0;
    border: 1px solid #d7e1d5;
    border-radius: 10px;
    background: #fff;
    color: #77867c;
    cursor: pointer;
  }
  .option .tiny:hover {
    border-color: #c9aaa5;
    background: #fbf1ef;
    color: #945f59;
  }
  .add-option {
    justify-self: start;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 13px;
    border: 1px solid #63816b;
    border-radius: 10px;
    background: #557660;
    color: #fff;
    font-size: 13px;
    font-weight: 750;
    cursor: pointer;
    box-shadow: 0 5px 14px rgba(68, 99, 77, 0.16);
  }
  .add-option:hover {
    background: #45644f;
  }
  .library-questions {
    padding: 14px;
    border-top: 1px solid #e4ebe2;
    background: #f5f8f3;
  }
  .library-note {
    display: flex;
    align-items: center;
    gap: 7px;
    margin: 0 0 12px;
    padding: 9px 11px;
    border: 1px solid #dce7d9;
    border-radius: 10px;
    background: #fff;
    color: #6d7d72;
    font-size: 12px;
    line-height: 1.45;
  }
  .readonly-question {
    display: grid;
    grid-template-columns: 30px minmax(0, 1fr);
    gap: 11px;
    padding: 13px;
    margin-top: 8px;
    border: 1px solid #dce6da;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 4px 14px rgba(52, 75, 57, 0.04);
  }
  .readonly-question .number {
    width: 30px;
    height: 30px;
    display: grid;
    place-items: center;
    border-radius: 9px;
    background: #e3eee0;
    color: #496652;
    font-size: 12px;
    font-weight: 800;
  }
  .readonly-question b {
    display: block;
    color: #344b3a;
    font-size: 13px;
    line-height: 1.5;
  }
  .question-meta {
    margin-top: 4px;
    color: #849087;
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
  padding: 13px;
  margin: 9px 0;
  border: 1px solid #e2e9e0;
  border-radius: 13px;
  background: #fcfdfb;
  opacity: ${(p) => (p.$dragging ? 0.45 : 1)};
  transition: 0.15s;
  .qhead {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 9px;
  }
  .qtitle {
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .drag {
    display: grid;
    place-items: center;
    color: #8b978e;
    cursor: grab;
    border: 0;
    background: transparent;
    padding: 4px 1px;
    touch-action: none;
  }
  .qactions {
    display: flex;
    gap: 2px;
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
    padding: 9px;
    width: auto;
    min-width: 0;
    flex: 1;
  }
  .tiny {
    border: 0;
    background: transparent;
    color: #687970;
    font-size: 12px;
    padding: 5px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .option .tiny {
    width: 38px;
    height: 38px;
    flex: 0 0 38px;
    justify-content: center;
    border: 1px solid #d7e1d5;
    border-radius: 10px;
    background: #fff;
    color: #77867c;
    cursor: pointer;
  }
  .option .tiny:hover {
    border-color: #c9aaa5;
    background: #fbf1ef;
    color: #945f59;
  }
  .add-option {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    justify-self: start;
    border: 0;
    border-radius: 10px;
    border: 1px solid #63816b;
    background: #557660;
    color: #fff;
    padding: 10px 15px;
    font-size: 13px;
    font-weight: 750;
    cursor: pointer;
    box-shadow: 0 5px 14px rgba(68, 99, 77, 0.16);
    transition: 0.16s ease;
  }
  .add-option:hover {
    background: #45644f;
    transform: translateY(-1px);
  }
  .required {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: #718078;
    margin-top: 8px;
  }
  .required input {
    width: auto;
  }
`;
export const AddQuestionButton = styled(Button)`
  width: 100%;
  min-height: 52px;
  margin-top: 12px;
  border: 1.5px dashed #a9bca9;
  border-radius: 13px;
  background: #f7faf5;
  color: #4d6b56;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  font-weight: 700;
  transition: 0.18s;
  .plus {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #e3eee0;
    display: grid;
    place-items: center;
  }
  &:hover {
    background: #edf4ea;
    border-color: #78947e;
    transform: translateY(-1px);
  }
`;
export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin: 22px -23px -23px;
  padding: 18px 23px;
  border-top: 1px solid #e3e9e1;
  background: #f6f8f4;
  > label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
    margin: 0;
  }
  > label input {
    width: 18px;
    height: 18px;
    margin: 0;
    flex: 0 0 18px;
    accent-color: #5b7a63;
  }
  .actions {
    display: flex;
    gap: 9px;
  }
  @media (max-width: 560px) {
    align-items: stretch;
    flex-direction: column;
    .actions,
    .actions button {
      width: 100%;
    }
  }
  .error {
    color: #a05252;
    font-size: 13px;
  }
`;
