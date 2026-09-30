import styled from "styled-components";

export const Stack = styled.div`
  display: grid; gap: 14px; max-width: 900px;
  h1 { font: 500 38px var(--font-heading), serif; color: #304a38; }
  .item { padding: 23px; border-radius: 18px; }
  .meta { color: #78857c; font-size: 12px; }
  .body { white-space: pre-wrap; color: #5f6e64; line-height: 1.55; }
  .actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 16px; }
  textarea { width: 100%; min-height: 80px; border: 1px solid #d6e0d4; border-radius: 11px; padding: 11px; margin-top: 12px; }
`;
