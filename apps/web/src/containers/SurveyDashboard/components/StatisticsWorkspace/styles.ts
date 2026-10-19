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
  &.sample-modal {
    border: 0;
    border-radius: 0;
    padding-top: 16px;
  }
  &.sample-modal .toolbar {
    margin-bottom: 24px;
  }
  &.sample-modal .member-list {
    max-height: min(340px, 40dvh);
  }
  .saved-sample-conditions {
    margin-top: 20px;
  }
  .saved-sample-conditions h4 {
    margin: 0 0 12px;
  }
  .saved-sample-conditions dl {
    margin: 0;
    display: grid;
    gap: 12px;
  }
  .saved-sample-conditions dt {
    font-size: 13px;
    font-weight: 600;
    line-height: 1.5;
  }
  .saved-sample-conditions dd {
    margin: 3px 0 0;
    font-size: 13px;
    color: var(--muted);
    line-height: 1.5;
  }
  .saved-sample-conditions p {
    margin: 12px 0 0;
  }
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 10px;
    padding-top: 8px;
  }
  .workspace-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    padding: 24px;
  }
  h2 {
    font-size: 22px;
    line-height: 1.3;
    letter-spacing: -0.025em;
    margin: 0;
    font-weight: 700;
  }
  h3 {
    font-size: 18px;
    line-height: 1.4;
    margin: 0 0 6px;
    letter-spacing: -0.015em;
    font-weight: 650;
  }
  h4 {
    font-size: 15px;
    margin: 20px 0 8px;
  }
  p {
    margin: 0 0 12px;
    line-height: 1.6;
    max-width: 75ch;
    font-size: 14px;
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
    padding: 10px 0;
    overflow-x: auto;
  }
  .tabs button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 0;
    background: transparent;
    padding: 10px 13px;
    color: var(--muted);
    font: inherit;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    border-radius: 6px;
  }
  .tabs button[aria-selected="true"] {
    color: #365431;
    background: #e4ecde;
  }
  .body {
    padding: 24px;
    min-width: 0;
  }
  .toolbar {
    display: flex;
    gap: 16px;
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
    grid-template-columns: minmax(0, 1fr) 90px auto;
    gap: 20px;
    align-items: center;
    padding: 18px 0;
    border-top: 1px solid var(--line);
  }
  .sample-row h3 {
    font-size: 15px;
    margin-bottom: 5px;
    font-weight: 650;
  }
  .sample-row p {
    font-size: 12px;
    margin: 0;
    color: var(--muted);
    line-height: 1.65;
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
    border-bottom: 0;
    margin: 16px 0;
  }
  .fields {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    margin-bottom: 18px;
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
    border: 1px solid #dce4d8;
    border-radius: 8px;
    background: #fafbf9;
    color: var(--ink);
    font: inherit;
    font-weight: 400;
    caret-color: var(--accent);
  }
  [role="combobox"] {
    height: 42px;
    border-radius: 8px;
    background: #fafbf9;
    font-size: 13px;
    font-weight: 400;
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
    border: 0;
    border-radius: 7px;
    padding: 12px 14px;
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
    grid-template-columns: minmax(0, 800px) minmax(220px, 270px);
    justify-content: space-between;
    align-items: start;
    gap: 32px;
  }
  .analysis-layout aside {
    position: sticky;
    top: 20px;
    align-self: start;
    background: #f4f7f1;
    border: 0;
    padding: 20px;
    font-size: 12px;
    line-height: 1.65;
  }
  .analysis-layout aside h3 {
    font-size: 13px;
    margin-bottom: 8px;
  }
  .analysis-layout aside ul {
    padding-left: 18px;
    margin-top: 8px;
  }
  .input-group {
    padding: 18px 0 0;
    margin-top: 20px;
    border-top: 1px solid var(--line);
  }
  .input-group h3 {
    font-size: 15px;
    margin-bottom: 12px;
  }
  .step-title {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    gap: 10px;
    align-items: center;
    margin-bottom: 20px;
  }
  .step-title span {
    color: var(--muted);
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
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
  .input-tables {
    margin-top: 24px;
  }
  .input-tables > details {
    padding: 22px 0;
  }
  .input-tables summary {
    line-height: 1.6;
  }
  .input-tables details[open] > summary {
    margin-bottom: 16px;
  }
  .preview-section .calculation-confirmation {
    margin: 24px 0 16px;
    font-size: 14px;
    line-height: 1.6;
    color: var(--muted);
  }
  .trace {
    padding: 12px 0;
  }
  .trace li {
    margin-bottom: 8px;
    line-height: 1.6;
    overflow-wrap: anywhere;
  }
  .history-actions {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .history-row {
    display: grid;
    grid-template-columns: 18px 36px minmax(0, 1fr) 118px auto;
    gap: 14px;
    align-items: center;
    padding: 17px 0;
    border-top: 1px solid var(--line);
  }
  .history-row > div {
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
    margin-top: 5px;
  }

  .workspace-title {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 8px;
  }
  .workspace-head p {
    margin: 0;
    font-size: 13px;
    color: var(--muted);
  }
  .pilot-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 500;
    color: var(--muted);
  }
  .pilot-status::before {
    content: "";
    width: 6px;
    height: 6px;
    background: #8ba47e;
    border-radius: 50%;
  }
  .workspace-tabs {
    padding: 9px 24px;
    background: #f8faf6;
    border-top: 1px solid #edf1e9;
  }
  .tabs button:hover {
    background: #edf2e8;
    color: #365431;
  }
  .tabs button[aria-selected="true"] {
    font-weight: 650;
  }
  .toolbar h3 {
    font-size: 17px;
  }
  .toolbar p {
    font-size: 13px;
    margin: 0;
    color: var(--muted);
    max-width: 65ch;
  }
  .list-caption {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 90px 310px;
    gap: 20px;
    padding: 10px 0;
    font-size: 11px;
    font-weight: 600;
    color: var(--muted);
  }
  .list-caption span:last-child {
    text-align: right;
  }
  .sample-details {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
  }
  .sample-details > div {
    min-width: 0;
  }
  .sample-symbol,
  .history-symbol {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    color: #56744d;
    background: #f0f4ec;
    border-radius: 8px;
  }
  .version {
    display: inline-block;
    font-size: 11px;
    font-weight: 500;
    color: var(--muted);
    margin-left: 5px;
  }
  .sample-size {
    display: grid;
    gap: 2px;
    font-variant-numeric: tabular-nums;
  }
  .sample-size strong {
    font-size: 17px;
    font-weight: 650;
  }
  .sample-size span {
    font-size: 11px;
    color: var(--muted);
  }
  .sample-row small {
    margin-top: 6px;
    font-size: 11px;
    color: #476b3d;
  }
  .method-description {
    color: var(--muted);
    font-size: 13px;
    margin: 10px 0 0;
    line-height: 1.65;
  }
  .step-title h3 {
    margin: 0;
  }
  .analysis-layout aside p,
  .analysis-layout aside li {
    font-size: 12px;
    line-height: 1.7;
  }
  .analysis-layout aside h3:not(:first-child) {
    margin-top: 22px;
  }
  .run-summary {
    padding-bottom: 16px;
    margin-bottom: 18px;
    border-bottom: 1px solid #dce5d6;
  }
  .run-summary > p {
    font-weight: 650;
    font-size: 14px !important;
    color: #365431;
  }
  .run-summary dl {
    margin: 14px 0 0;
  }
  .run-summary dl > div {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin: 8px 0;
    font-size: 11px;
  }
  .run-summary dt {
    color: var(--muted);
  }
  .run-summary dd {
    margin: 0;
    font-weight: 600;
    text-align: right;
  }
  .history-copy .text-button {
    font-size: 14px;
    color: var(--ink);
  }
  .history-status {
    display: inline-flex;
    align-items: center;
    justify-self: start;
    gap: 6px;
    padding: 5px 8px;
    border-radius: 5px;
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
    background: #f1f3ef;
    color: #59685e;
  }
  .history-status.completed {
    background: #edf4e7;
    color: #47663c;
  }
  .history-status.running {
    background: #edf2f5;
    color: #49697c;
  }
  .history-status.failed {
    background: #faeee9;
    color: #924d3c;
  }
  .history-row:has(input:checked) {
    background: #f5f8f1;
  }

  @media (max-width: 950px) {
    .analysis-layout {
      grid-template-columns: minmax(0, 1fr);
    }
    .analysis-layout aside {
      position: static;
      border: 0;
      padding: 18px;
      max-width: none;
    }
  }
  @media (max-width: 600px) {
    .workspace-head {
      padding: 18px 16px;
      flex-direction: column;
      align-items: flex-start;
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
      grid-template-columns: minmax(0, 1fr) 65px;
      gap: 12px;
      padding: 18px 0;
    }
    .sample-row .actions {
      grid-column: 1/-1;
      padding-left: 0;
    }
    .sample-details {
      gap: 10px;
    }
    .sample-symbol {
      width: 32px;
      height: 32px;
    }
    .list-caption {
      display: none;
    }
    .workspace-title {
      gap: 6px 12px;
    }
    .workspace-tabs {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      overflow: visible;
      padding: 8px;
    }
    .workspace-tabs button {
      flex-direction: column;
      white-space: normal;
      text-align: center;
      min-height: 60px;
      gap: 6px;
      font-size: 12px;
      padding: 8px 4px;
    }
    .workspace-tabs svg {
      width: 14px;
    }
    .toolbar {
      gap: 14px;
    }
    .toolbar > .actions {
      width: 100%;
    }
    .history-row {
      grid-template-columns: 18px 30px minmax(0, 1fr) auto;
      gap: 10px;
    }
    .history-symbol {
      width: 30px;
      height: 30px;
    }
    .history-copy {
      grid-column: 3;
    }
    .history-status {
      grid-column: 3;
      grid-row: 2;
    }
    .history-row > .history-actions {
      grid-column: 4;
      grid-row: 1 / span 2;
    }
    .history-row > input,
    .history-symbol {
      grid-row: 1;
    }

    .error {
      margin: 12px 16px;
    }
    h2 {
      font-size: 21px;
    }
    input:not([type="checkbox"]),
    [role="combobox"],
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
