import styled from "styled-components";

export const Bar = styled.div`
  position: sticky;
  top: 10px;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: nowrap;
  width: 100% !important;
  grid-column: 1 / -1;
  min-width: 0;
  justify-self: stretch;
  align-self: stretch;
  box-sizing: border-box;
  padding: 9px 12px;
  border: 1px solid #d1dfcf;
  border-left: 4px solid #6e9076;
  border-radius: 15px;
  background: #e3ecdf !important;
  box-shadow: 0 6px 18px rgba(43, 65, 48, 0.11), inset 0 0 0 1px rgba(255,255,255,.3);

  .toolbar-main,
  .toolbar-actions {
    display: flex;
    align-items: center;
    min-width: 0;
  }
  .toolbar-main { grid-area: main; gap: 10px; flex: 1 1 auto; }
  .toolbar-actions { grid-area: actions; gap: 9px; flex: 0 0 auto; }
  .toolbar-meta {
    grid-area: meta;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 22px;
    padding-top: 1px;
  }

  .save-status {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 0 0 auto;
    white-space: nowrap;
  }
  .status-dot {
    width: 8px;
    height: 8px;
    flex: 0 0 8px;
    border-radius: 50%;
    background: #6e9076;
    box-shadow: 0 0 0 3px rgba(110, 144, 118, 0.13);
  }
  .status-copy { color: #637569; font-size: 10px; font-weight: 650; }
  .saved-time { color: #829087; font-size: 10px; }

  .preview-group { display: flex; align-items: center; gap: 6px; }
  .preview-button,
  .save-button {
    && {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      height: 40px;
      min-height: 40px;
      padding: 0 13px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
      box-shadow: none;
    }
  }
  .preview-button {
    && { border: 1px solid #cfddcd; background: #f8faf6; color: #4f6a57; }
    &:hover:not(:disabled) { border-color: #a9bea8 !important; background: #fff !important; color: #3f5e48 !important; }
  }
  .publish-toggle {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    min-height: 22px;
    padding: 0 2px;
    color: #53675a;
    font-size: 10px;
    font-weight: 650;
    white-space: nowrap;
    input { width: 15px; height: 15px; margin: 0; accent-color: #55745e; }
  }
  .save-button {
    && { height: 42px; min-height: 42px; padding: 0 18px; border: 1px solid #456a50 !important; background: #52785d !important; color: #fff !important; box-shadow: 0 4px 11px rgba(48, 70, 54, 0.2); font-weight: 750; }
    &:hover:not(:disabled) { border-color: #3f6048 !important; background: #456b50 !important; color: #fff !important; }
    &:disabled { opacity: 0.7; }
  }
  .preview-error { max-width: 170px; overflow: hidden; color: #a05252; font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }

  @media (max-width: 1180px) {
    gap: 8px;
    padding-inline: 9px;
    .toolbar-main { gap: 8px; }
    .toolbar-actions { gap: 6px; }
    .toolbar-meta { min-height: 20px; padding-top: 3px; }
    .status-copy { font-size: 9px; }
    .saved-time { font-size: 9px; }
    .preview-button && { height: 38px; min-height: 38px; padding-inline: 9px; font-size: 11px; }
    .publish-toggle { gap: 5px; font-size: 10px; }
    .save-button && { height: 40px; min-height: 40px; padding-inline: 11px; font-size: 11px; }
  }
  @media (max-width: 760px) {
    .toolbar-main { flex-wrap: wrap; }
    .toolbar-actions { flex-wrap: wrap; justify-content: flex-end; }
  }
  @media (max-width: 560px) {
    align-items: stretch;
    gap: 7px;
    .toolbar-main { flex-direction: column; align-items: stretch; gap: 7px; }
    .save-status { border: 0; padding: 0; }
    .toolbar-actions { display: grid; grid-template-columns: 1fr auto; }
    .preview-group { grid-column: 1 / -1; }
    .preview-button && { width: 100%; }
    .publish-toggle { justify-self: start; }
    .save-button && { width: 100%; }
  }
`;

export const CatalogSlot = styled.div`
  min-width: 0;
  .catalog-content { display: flex; align-items: center; gap: 7px; }
  .create-custom,
  .choose-method {
    && { height: 38px; min-height: 38px; padding: 0 11px; border-radius: 9px; font-size: 11px; font-weight: 700; gap: 7px; }
  }
  .create-custom { && { border: 1px solid #cfddcd; background: #f8faf6; color: #4f6a57; } }
  .choose-method { && { padding-right: 43px; border: 1px solid #cfddcd; background: #f8faf6; color: #4f6a57; } }
  .available-count { right: 9px; font-size: 10px; }
  @media (max-width: 1180px) {
    .create-custom,
    .choose-method { && { height: 36px; min-height: 36px; padding-inline: 8px; font-size: 10px; } }
    .choose-method { && { padding-right: 36px; } }
    .available-count { right: 7px; font-size: 9px; }
  }
  @media (max-width: 560px) {
    .catalog-content { flex-wrap: wrap; }
    .create-custom,
    .choose-method { && { flex: 1; } }
  }
`;
