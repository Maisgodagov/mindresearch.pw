import styled from "styled-components";
export const Tabs = styled.div`
  display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px;
  button { display: inline-flex; align-items: center; gap: 7px; padding: 10px 13px; border: 1px solid var(--color-border-strong); border-radius: 11px; background: var(--color-surface); color: var(--color-text-5d7063); font-weight: 700; }
  button.active { border-color: var(--color-brand); background: var(--color-brand); color: var(--color-text-fff); }
  .count { display: inline-grid; place-items: center; min-width: 21px; height: 21px; padding: 0 6px; border-radius: 999px; background: var(--color-palette-ffffff-a220); font-size: 10px; }
`;
