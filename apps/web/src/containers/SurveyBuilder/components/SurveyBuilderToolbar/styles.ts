import styled from "styled-components";

export const ControlPanel = styled.aside`
  container-name: survey-control-panel;
  container-type: inline-size;
  position: sticky;
  top: 18px;
  display: grid;
  gap: 16px;
  padding: 18px;
  border: 1px solid #dce5da;
  border-radius: 14px;
  background: #fff;
  color: #29392e;

  .control-heading {
    display: flex;
    align-items: center;
    gap: 10px;
    h2 { margin: 0; color: #28392d; font-size: 17px; font-weight: 750; line-height: 1.3; }
  }
  .control-icon {
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    flex: none;
    border-radius: 9px;
    background: #edf4ea;
    color: #4b6b4d;
  }
  .survey-details {
    display: grid;
    gap: 9px;
    padding-bottom: 13px;
    border-bottom: 1px solid #e7ece5;
  }
  .field-group { display: grid; gap: 4px; min-width: 0; }
  .field-group label { color: #596b5d; font-size: 10px; font-weight: 700; }
  .description-toggle { display: none; }
  .description-content { display: grid; gap: 4px; }
  .survey-details input,
  .survey-details textarea {
    width: 100%;
    min-width: 0;
    border: 1px solid #dce5da;
    border-radius: 8px;
    background: #fbfcfa;
    color: #29392e;
    font-size: 12px;
  }
  .survey-details input { min-height: 35px; padding: 7px 9px; }
  .survey-details textarea { min-height: 54px; padding: 7px 9px; resize: vertical; line-height: 1.4; }
  .survey-details input:focus,
  .survey-details textarea:focus { border-color: #87a087; background: #fff; outline: 2px solid rgba(112, 150, 108, .14); }
  .survey-details .invalid { border-color: #c96d67 !important; background: #fff8f7 !important; }
  .field-note { color: #7b887e; font-size: 10px; }
  .control-add {
    padding-top: 0;
    h3 { margin: 0; color: #344b38; font-size: 13px; font-weight: 750; }
    p { margin: 6px 0 11px; color: #67766a; font-size: 12px; line-height: 1.5; }
  }
  .control-actions {
    display: grid;
    gap: 5px;
    padding-top: 12px;
    border-top: 1px solid #e7ece5;
  }
  .action-buttons {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.12fr);
    gap: 7px;
  }
  .action-buttons .save-button,
  .action-buttons .preview-button {
    && {
      width: 100%;
      min-width: 0;
      min-height: 44px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      padding-inline: 10px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
    }
  }
  .save-button {
    && {
      border: 1px solid #385a40 !important;
      background: #385a40 !important;
      color: #fff !important;
      box-shadow: none;
    }
    &:hover:not(:disabled) { border-color: #2d4d35 !important; background: #2d4d35 !important; }
  }
  .publish-toggle {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    min-height: 32px;
    color: #5c6b5f;
    font-size: 11px;
    font-weight: 600;
    input { width: 16px; height: 16px; margin: 0; accent-color: #456b4c; flex: none; }
  }
  .preview-button {
    && {
      border: 1px solid #dce5da;
      background: #fff;
      color: #506454;
    }
    &:hover:not(:disabled) { background: #f1f5ef !important; color: #344c39 !important; }
  }
  .preview-error { margin: 0; color: #a05252; font-size: 11px; line-height: 1.45; }

  @media (max-width: 900px) {
    position: static;
    grid-row: 1;
    grid-template-columns: minmax(0, 1fr) minmax(210px, .8fr);
    align-items: start;
    gap: 16px;
    .control-heading { grid-column: 1 / -1; }
    .control-add { padding-top: 0; border-top: 0; }
    .control-actions { padding-top: 0; border-top: 0; }
  }
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 10px;
    border-radius: 11px;
    .control-heading { grid-column: auto; }
    .control-heading { gap: 8px; }
    .control-heading h2 { font-size: 16px; }
    .control-icon { width: 30px; height: 30px; border-radius: 8px; }
    .survey-details { gap: 6px; padding-bottom: 8px; }
    .survey-details input { min-height: 36px; padding: 5px 8px; }
    .survey-details textarea { min-height: 44px; padding: 5px 8px; }
    .control-add p { margin: 3px 0 4px; line-height: 1.35; }
    .control-actions { gap: 3px; padding-top: 6px; }
    .action-buttons { gap: 6px; }
    .action-buttons .save-button,
    .action-buttons .preview-button {
      && { min-height: 40px; padding-inline: 6px; font-size: 11px; }
    }
  }

  @media (max-width: 420px) {
    .description-label { display: none; }
    .description-toggle {
      width: 100%;
      min-height: 30px;
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 0;
      border: 0;
      background: transparent;
      color: #596b5d;
      font: inherit;
      font-size: 10px;
      font-weight: 700;
      text-align: left;
      cursor: pointer;
    }
    .description-state { margin-left: auto; color: #7b887e; font-size: 9px; font-weight: 500; }
    .description-toggle svg { flex: none; transition: transform 140ms ease; }
    .description-toggle[aria-expanded="true"] svg { transform: rotate(180deg); }
    .description-content { display: none; }
    .description-content.is-expanded { display: grid; }
    .control-add > p { display: none; }
  }

  @container survey-control-panel (max-width: 320px) {
    padding: 9px;
    gap: 7px;

    .action-buttons { grid-template-columns: minmax(0, 1fr); gap: 8px; }
    .action-buttons .save-button,
    .action-buttons .preview-button {
      && { min-height: 42px; font-size: 12px; }
    }
    .publish-toggle { min-height: 32px; }
  }

  @media (pointer: coarse) {
    .publish-toggle { min-height: 40px; }
    .action-buttons .save-button,
    .action-buttons .preview-button { && { min-height: 44px; } }
  }
`;

export const CatalogSlot = styled.div`
  min-width: 0;
`;
