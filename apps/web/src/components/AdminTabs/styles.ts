import styled from "styled-components";
export const Tabs = styled.div`
  display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px;
  button { display: inline-flex; align-items: center; gap: 7px; padding: 10px 13px; border: 1px solid #d4dfd2; border-radius: 11px; background: #fff; color: #5d7063; font-weight: 700; }
  button.active { border-color: #557660; background: #557660; color: #fff; }
  .count { display: inline-grid; place-items: center; min-width: 21px; height: 21px; padding: 0 6px; border-radius: 999px; background: rgba(255,255,255,.22); font-size: 10px; }
`;
