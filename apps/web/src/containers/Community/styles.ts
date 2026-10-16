import styled from "styled-components";

export const CommunitySurface = styled.div`
  .questionnaire .ant-form-item-extra {
    color: var(--color-muted);
  }
  .community-intro {
    margin: 0;
  }
  .intro-title {
    padding: 0 0 30px;
    border-bottom: 1px solid var(--color-border);
    margin-bottom: 36px;
  }
  .intro-title h1 {
    margin: 0;
    font-size: clamp(27px, 2.8vw, 34px);
    font-weight: 650;
    letter-spacing: -0.025em;
  }
  .intro-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.18fr) minmax(340px, 0.82fr);
    align-items: start;
    gap: clamp(28px, 3vw, 44px);
  }
  .intro-overview {
    padding-top: 20px;
  }
  .intro-overview h2 {
    color: var(--color-muted);
    font-size: 18px;
    font-weight: 550;
    margin: 0 0 22px;
  }
  .intro-overview .intro-lead {
    font-size: clamp(32px, 3.5vw, 46px);
    line-height: 1.18;
    letter-spacing: -0.035em;
    font-weight: 600;
    margin: 0 0 24px;
  }
  .intro-lead strong {
    color: var(--color-brand-strong);
    font-weight: 700;
    display: inline-block;
    margin-top: 8px;
  }
  .intro-description {
    color: var(--color-muted);
    font-size: 17px;
    max-width: 52ch;
  }
  .intro-preparation {
    padding: 28px;
    background: #fff;
    border: 1px solid #d9e2d8;
    border-radius: 16px;
  }
  .intro-card-heading {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 16px;
  }
  .intro-card-heading h2 {
    font-size: 25px;
    line-height: 1.25;
    font-weight: 650;
    letter-spacing: -0.025em;
    margin: 0;
    max-width: 26ch;
  }
  .intro-anonymous {
    color: var(--color-brand-strong);
  }
  .intro-preparation > p {
    font-size: 14px;
    color: var(--color-muted);
  }
  .intro-start {
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .intro-start .ant-btn {
    height: auto;
    min-height: 48px;
    padding: 12px 14px;
    white-space: normal;
    width: 100%;
    font-size: 14px;
  }

  .intro-preparation .intro-privacy {
    font-size: 12px;
    line-height: 1.65;
    margin: 22px 0 0;
    padding-top: 18px;
    border-top: 1px solid var(--color-border);
  }
  @media (max-width: 1050px) {
    .intro-layout {
      grid-template-columns: 1fr;
      gap: 30px;
    }
    .intro-overview {
      padding-top: 0;
    }
    .intro-overview .intro-lead {
      font-size: clamp(34px, 5vw, 46px);
    }
    .intro-description {
      max-width: 48ch;
    }
  }
  @media (max-width: 600px) {
    .intro-title {
      margin-bottom: 26px;
      padding-bottom: 22px;
    }
    .intro-overview h2 {
      margin-bottom: 16px;
      font-size: 16px;
    }
    .intro-overview .intro-lead {
      font-size: 34px;
    }
    .intro-description {
      font-size: 15px;
    }
    .intro-preparation {
      padding: 24px 20px;
    }
    .intro-card-heading h2 {
      font-size: 24px;
    }
    .intro-layout {
      gap: 28px;
    }
  }
  input::placeholder,
  textarea::placeholder {
    color: #647268 !important;
    opacity: 1;
  }
  .ant-select-placeholder,
  .ant-select-selection-placeholder {
    color: #647268 !important;
    opacity: 1;
  }
  .ant-select-input,
  .ant-select-selection-search-input {
    border: 0 !important;
    border-radius: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
    padding: 0 !important;
    height: auto !important;
    min-height: 0 !important;
  }
  color: var(--color-ink);
  width: 100%;
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
    max-width: 680px;
    margin: 20px auto;
    padding: 24px;
  }
  .questionnaire-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  .questionnaire-heading h2 {
    margin: 0;
    font-size: 23px;
    font-weight: 650;
  }
  .questionnaire-progress {
    color: var(--color-muted);
    font-size: 13px;
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
  }
  .questionnaire .questionnaire-caption {
    color: var(--color-muted);
    font-size: 13px;
    margin: 6px 0 20px;
  }
  .questionnaire .step-line {
    display: grid;
    grid-template-columns: 1fr 1.4fr 1fr;
    gap: 6px;
    padding: 0;
    margin-bottom: 22px;
    border: 0;
  }
  .questionnaire .step-line span {
    padding: 9px 4px;
    border-bottom: 2px solid var(--color-border);
    font-size: 12px;
    text-align: center;
  }
  .questionnaire .step-line .current {
    border-color: var(--color-brand-strong);
    color: var(--color-brand-strong);
  }
  .questionnaire .ant-form-item {
    margin-bottom: 16px;
  }
  .questionnaire .ant-form-item-label {
    padding-bottom: 5px;
  }
  .questionnaire .ant-form-item-label > label,
  .questionnaire .ant-checkbox-wrapper {
    font-size: 13px;
  }
  .questionnaire .actions {
    justify-content: flex-end;
    padding-top: 16px;
    margin-top: 20px;
    gap: 8px;
  }
  .questionnaire .children-privacy {
    margin: 0 0 20px;
  }
  @media (max-width: 600px) {
    .questionnaire {
      padding: 20px 16px;
      margin: 12px 0;
    }
    .questionnaire-heading h2 {
      font-size: 21px;
    }
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
