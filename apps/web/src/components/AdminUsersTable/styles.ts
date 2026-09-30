import styled from "styled-components";
import { Card } from "../../ui";
export const UsersCard = styled(Card)`padding: 21px; border-radius: 18px; @media (max-width: 480px) { padding: 15px; }`;
export const TableCard = styled.div`
  .meta { color: #839087; font-size: 11px; line-height: 1.5; }
  .user-grid { display: grid; grid-template-columns: minmax(180px, 1.4fr) repeat(4, minmax(90px, .6fr)) minmax(255px, 1.1fr); gap: 14px; align-items: center; }
  .user-grid + .user-grid { border-top: 1px solid #e7ece5; margin-top: 13px; padding-top: 13px; }
  .user-name b, .user-name span, .metric b, .metric span { display: block; }
  .user-name span { color: #849087; font-size: 11px; }
  .metric span { color: #89948d; font-size: 10px; }
  .role { display: flex; gap: 8px; min-width: 255px; align-items: center; }
  .role-select { flex: 1; min-width: 155px; }
  .role button { min-height: 42px; padding: 0 11px; border: 0; border-radius: 9px; background: #e7efe4; color: #486451; font-weight: 700; white-space: nowrap; }
  .badge { padding: 5px 8px; border-radius: 999px; background: #edf3ea; color: #56705e; font-size: 10px; font-weight: 750; white-space: nowrap; }
  @media (max-width: 850px) { .user-grid { grid-template-columns: 1fr 1fr; } .user-name, .role { grid-column: 1/-1; } }
  @media (max-width: 480px) { .role { min-width: 0; width: 100%; flex-wrap: wrap; } .role-select { flex: 1 1 170px; min-width: 0; } }
`;
