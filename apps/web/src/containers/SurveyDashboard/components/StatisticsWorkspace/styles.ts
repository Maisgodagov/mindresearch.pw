import styled from "styled-components";

export const Workspace = styled.section`
  --ink: #273b30;
  --muted: #59685e;
  --line: #dce4dc;
  --accent: #52764c;
  --wash: #f4f7f2;
  color: var(--ink);
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  min-width: 0;
  .workspace-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    padding: 24px 28px 18px;
  }
  h2 {
    font-size: 24px;
    line-height: 1.3;
    letter-spacing: -0.025em;
    margin: 0 0 8px;
    font-weight: 700;
  }
  h3 {
    font-size: 18px;
    line-height: 1.4;
    margin: 0 0 12px;
    letter-spacing: -0.015em;
  }
  h4 {
    font-size: 15px;
    margin: 20px 0 8px;
  }
  p {
    margin: 0 0 12px;
    line-height: 1.65;
    max-width: 75ch;
  }
  .muted,
  small {
    color: var(--muted);
  }
  small {
    font-size: 12px;
    line-height: 1.5;
    display: block;
  }
  .tabs {
    display: flex;
    gap: 4px;
    border-bottom: 1px solid var(--line);
    padding: 0 24px;
    overflow-x: auto;
  }
  .tabs button {
    border: 0;
    background: transparent;
    padding: 14px 16px;
    color: var(--muted);
    font: inherit;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    border-bottom: 2px solid transparent;
  }
  .tabs button[aria-selected="true"] {
    color: var(--accent);
    border-bottom-color: var(--accent);
  }
  .body {
    padding: 26px 28px;
    min-width: 0;
  }
  .toolbar {
    display: flex;
    gap: 10px;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }
  .actions {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
  }
  .sample-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 16px;
    align-items: center;
    padding: 20px 0;
    border-top: 1px solid var(--line);
  }
  .sample-row h3 {
    font-size: 16px;
    margin-bottom: 4px;
  }
  .sample-row p {
    font-size: 13px;
    margin: 0;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #425d3d;
    background: #edf3e8;
    border-radius: 6px;
    padding: 4px 8px;
    font-size: 12px;
    font-weight: 600;
  }
  .empty {
    padding: 36px 0;
    max-width: 65ch;
  }
  .empty svg {
    color: var(--accent);
    margin-bottom: 14px;
  }
  .editor {
    padding: 22px 0;
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    margin: 12px 0 24px;
  }
  .fields {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 20px;
  }
  label.field {
    display: grid;
    gap: 7px;
    align-content: start;
    font-size: 13px;
    font-weight: 600;
    min-width: 0;
  }
  input:not([type="checkbox"]),
  select,
  textarea {
    box-sizing: border-box;
    width: 100%;
    min-height: 42px;
    padding: 10px 12px;
    border: 1px solid #bdcbbd;
    border-radius: 8px;
    background: #fff;
    color: var(--ink);
    font: inherit;
    font-weight: 400;
    caret-color: var(--accent);
  }
  select {
    min-width: 0;
    text-overflow: ellipsis;
  }
  textarea {
    resize: vertical;
    min-height: 72px;
  }
  input[type="checkbox"] {
    accent-color: var(--accent);
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
  button:focus-visible,
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible,
  summary:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
  }
  ::selection {
    background: #dcebcf;
    color: #273b30;
  }
  .check {
    display: flex;
    gap: 9px;
    align-items: center;
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
  }
  .member-list {
    max-height: 340px;
    overflow: auto;
    border-top: 1px solid var(--line);
    margin: 16px 0;
  }
  .member {
    padding: 12px 4px;
    border-bottom: 1px solid var(--line);
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .member span {
    flex: 1;
    min-width: 0;
  }
  .member input {
    margin: 0;
  }
  .member small {
    font-weight: 400;
  }
  .notice {
    background: var(--wash);
    border: 1px solid var(--line);
    border-radius: 8px;
    padding: 12px 16px;
    font-size: 13px;
    line-height: 1.65;
    margin: 14px 0;
  }
  .error {
    background: #fff4f1;
    border: 1px solid #e9c9c0;
    color: #873d30;
    border-radius: 8px;
    padding: 12px 16px;
    margin: 16px 28px;
    line-height: 1.6;
  }
  .error button {
    color: inherit;
  }
  .body .error {
    margin: 14px 0;
  }
  .analysis-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 260px;
    gap: 32px;
  }
  .analysis-layout aside {
    border-left: 1px solid var(--line);
    padding-left: 24px;
    font-size: 13px;
    line-height: 1.65;
  }
  .analysis-layout aside h3 {
    font-size: 15px;
  }
  .analysis-layout aside ul {
    padding-left: 18px;
    margin-top: 8px;
  }
  .input-group {
    padding: 18px 0;
    border-top: 1px solid var(--line);
  }
  .input-group h3 {
    font-size: 16px;
  }
  .step-title {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 18px;
  }
  .step-title span {
    color: var(--accent);
    font-size: 13px;
    font-weight: 600;
  }
  .scroll {
    overflow-x: auto;
    max-width: 100%;
    margin: 14px 0;
    overscroll-behavior: contain;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    text-align: left;
    font-variant-numeric: tabular-nums;
  }
  th {
    color: var(--muted);
    font-weight: 600;
    background: var(--wash);
    white-space: nowrap;
  }
  th,
  td {
    padding: 11px 12px;
    border-bottom: 1px solid var(--line);
    vertical-align: top;
  }
  td:first-child {
    min-width: 150px;
  }
  .formula {
    font-size: 18px;
    line-height: 1.8;
    padding: 18px 0;
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    overflow-wrap: anywhere;
  }
  .metrics {
    display: flex;
    gap: 32px;
    flex-wrap: wrap;
    margin: 22px 0;
  }
  .metrics strong {
    display: block;
    font-size: 25px;
    line-height: 1.4;
    font-weight: 650;
    font-variant-numeric: tabular-nums;
  }
  .metrics span {
    font-size: 12px;
    color: var(--muted);
  }
  .report-heading {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 18px;
  }
  .report-heading h3 {
    font-size: 21px;
  }
  details {
    border-top: 1px solid var(--line);
    padding: 14px 0;
  }
  summary {
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
  }
  .trace {
    padding: 12px 0;
  }
  .trace li {
    margin-bottom: 8px;
    line-height: 1.6;
    overflow-wrap: anywhere;
  }
  .history-row {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 18px 0;
    border-top: 1px solid var(--line);
  }
  .history-row > div {
    flex: 1;
    min-width: 0;
  }
  .text-button {
    border: 0;
    background: transparent;
    padding: 0;
    color: var(--accent);
    font: inherit;
    font-weight: 600;
    text-align: left;
    cursor: pointer;
  }
  .text-button:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .status {
    font-size: 12px;
    color: var(--muted);
    margin-top: 4px;
  }
  @media (max-width: 950px) {
    .analysis-layout {
      grid-template-columns: minmax(0, 1fr);
    }
    .analysis-layout aside {
      border-left: 0;
      border-top: 1px solid var(--line);
      padding: 18px 0 0;
    }
  }
  @media (max-width: 600px) {
    .workspace-head {
      padding: 18px 16px;
      flex-direction: column;
      gap: 10px;
    }
    .body {
      padding: 20px 16px;
    }
    .tabs {
      padding: 0 8px;
    }
    .tabs button {
      padding: 12px 9px;
      font-size: 13px;
    }
    .fields {
      grid-template-columns: minmax(0, 1fr);
      gap: 14px;
    }
    .sample-row {
      grid-template-columns: minmax(0, 1fr);
    }
    .error {
      margin: 12px 16px;
    }
    h2 {
      font-size: 21px;
    }
    input:not([type="checkbox"]),
    select,
    textarea {
      font-size: 16px;
    }
    .metrics {
      gap: 22px;
    }
    .history-row {
      flex-wrap: wrap;
    }
  }
`;
