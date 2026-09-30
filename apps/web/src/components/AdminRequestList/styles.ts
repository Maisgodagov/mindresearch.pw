import styled from "styled-components";
export const Queue = styled.div`
  display: grid; gap: 12px;
  .item { padding: 21px; border-radius: 18px; }
  .top { display: flex; justify-content: space-between; gap: 14px; align-items: flex-start; }
  .meta { color: #839087; font-size: 11px; line-height: 1.5; }
  h2 { margin: 6px 0 9px; color: #3a5140; font-size: 20px; }
  p { color: #5f6e64; line-height: 1.55; }
  .badge { padding: 5px 8px; border-radius: 999px; background: #edf3ea; color: #56705e; font-size: 10px; font-weight: 750; white-space: nowrap; }
  .actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
  .page-link { display: inline-flex; align-items: center; gap: 5px; color: #52705a; font-size: 12px; }
  .empty { padding: 32px; text-align: center; color: #7a887e; }
  @media (max-width: 480px) { .item { padding: 15px; } }
`;
