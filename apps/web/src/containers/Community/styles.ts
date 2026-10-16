import styled from "styled-components";

export const CommunitySurface = styled.div`
  input::placeholder, textarea::placeholder {
    color: #647268 !important;
    opacity: 1;
  }
  .ant-select-placeholder, .ant-select-selection-placeholder {
    color: #647268 !important;
    opacity: 1;
  }
  .ant-select-input, .ant-select-selection-search-input {
    border: 0 !important;
    border-radius: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
    padding: 0 !important;
    height: auto !important;
    min-height: 0 !important;
  }
  color: var(--color-ink);
  max-width: 1120px;
  margin: 0 auto;
  h1 {
    font-size: clamp(26px, 3vw, 36px);
    line-height: 1.2;
    letter-spacing: -0.025em;
    margin: 0 0 12px;
  }
  h2 {
    font-size: 22px;
    line-height: 1.35;
    margin: 0 0 12px;
  }
  h3 {
    font-size: 18px;
    line-height: 1.4;
    margin: 0 0 10px;
  }
  p {
    line-height: 1.65;
    max-width: 72ch;
    margin: 0 0 14px;
  }
  .muted {
    color: var(--color-muted);
  }
  .page-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 24px;
  }
  .balance {
    flex-shrink: 0;
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
  .balance strong {
    display: block;
    font-size: 22px;
    margin-bottom: 4px;
  }
  .balance small {
    display: block;
    max-width: 240px;
  }
  .panel {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 14px;
    padding: 28px;
    margin: 20px 0;
  }
  .questionnaire {
    max-width: 760px;
    margin: 32px auto;
  }
  .step-line {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    padding-bottom: 20px;
    margin-bottom: 24px;
    border-bottom: 1px solid var(--color-border);
  }
  .step-line span {
    color: var(--color-muted);
  }
  .step-line .current {
    color: var(--color-ink);
    font-weight: 700;
  }
  .fields {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0 20px;
  }
  .fields .wide {
    grid-column: 1 / -1;
  }
  .actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
    margin-top: 18px;
  }
  .actions .ant-btn {
    white-space: normal;
    height: auto;
    min-height: 42px;
  }
  .filter-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    margin: 12px 0 22px;
  }
  .filter-bar .ant-input-affix-wrapper {
    width: min(100%, 340px);
  }
  .research-list {
    border-top: 1px solid var(--color-border);
  }
  .research-row {
    padding: 26px 0;
    border-bottom: 1px solid var(--color-border);
    display: grid;
    grid-template-columns: minmax(0, 1fr) 180px;
    gap: 28px;
  }
  .research-row h2 {
    font-size: 21px;
    overflow-wrap: anywhere;
  }
  .research-row p {
    white-space: pre-line;
    overflow-wrap: anywhere;
  }
  .research-meta {
    display: flex;
    gap: 8px 18px;
    flex-wrap: wrap;
    align-items: center;
    margin: 12px 0;
    font-size: 14px;
  }
  .research-meta span {
    display: inline-flex;
    gap: 6px;
    align-items: center;
  }
  .participate {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .participate strong {
    font-size: 20px;
  }
  .notice {
    background: var(--color-page);
    border-radius: 9px;
    padding: 14px 18px;
    margin: 16px 0;
    line-height: 1.6;
  }
  .empty {
    text-align: center;
    padding: 54px 20px;
  }
  .empty p {
    margin-left: auto;
    margin-right: auto;
  }
  details {
    margin: 20px 0;
  }
  summary {
    cursor: pointer;
    font-weight: 650;
    padding: 8px 0;
  }
  .group {
    border-top: 1px solid var(--color-border);
    padding: 20px 0 4px;
    margin-top: 16px;
  }
  .progress-line {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    font-variant-numeric: tabular-nums;
    margin-top: 12px;
  }
  .history {
    list-style: none;
    padding: 0;
    margin: 16px 0;
  }
  .history li {
    display: flex;
    gap: 20px;
    justify-content: space-between;
    border-bottom: 1px solid var(--color-border);
    padding: 14px 0;
  }
  .history strong {
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
  .preview {
    background: var(--color-page);
    padding: 20px;
    border-radius: 12px;
    margin: 20px 0;
  }
  .ant-form-item {
    min-width: 0;
  }
  .ant-input-number {
    width: 100%;
  }
  .ant-tabs-content-holder {
    min-width: 0;
  }
  .ant-tag {
    white-space: normal;
  }
  .ant-select {
    max-width: 100%;
  }
  @media (max-width: 760px) {
    .page-head {
      flex-direction: column;
      gap: 12px;
    }
    .balance {
      text-align: left;
    }
    .panel {
      padding: 20px 16px;
    }
    .fields {
      grid-template-columns: 1fr;
    }
    .research-row {
      grid-template-columns: 1fr;
      gap: 8px;
      padding: 22px 0;
    }
    .participate {
      flex-direction: row;
      align-items: center;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .questionnaire {
      margin: 20px auto;
    }
    .filter-bar > * {
      width: 100%;
    }
  }
`;
