import styled from "styled-components";

export const ControlPanel = styled.aside`
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
      min-height: 40px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      padding-inline: 7px;
      border-radius: 8px;
      font-size: 10px;
      font-weight: 700;
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
    min-height: 24px;
    color: #5c6b5f;
    font-size: 11px;
    font-weight: 600;
    input { width: 14px; height: 14px; margin: 0; accent-color: #456b4c; }
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
    gap: 13px;
    padding: 15px;
    .control-heading { grid-column: auto; }
    .action-buttons { grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); }
  }
`;

export const CatalogSlot = styled.div`
  min-width: 0;
`;
