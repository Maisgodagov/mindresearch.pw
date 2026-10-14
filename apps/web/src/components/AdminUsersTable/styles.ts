import styled from "styled-components";
import { Card } from "../../ui";
export const UsersCard = styled(Card)`padding: 21px; border-radius: 18px; @media (max-width: 480px) { padding: 15px; }`;
export const TableCard = styled.div`
  .meta { color: #839087; font-size: 11px; line-height: 1.5; }
  .user-grid { display: grid; grid-template-columns: minmax(180px, 1.4fr) repeat(4, minmax(90px, .6fr)) minmax(255px, 1.1fr); gap: 14px; align-items: center; }
  .user-entry { border-top: 1px solid #e7ece5; margin-top: 13px; padding-top: 13px; }
  .user-name b, .user-name span, .metric b, .metric span { display: block; }
  .user-name span { color: #849087; font-size: 11px; }
  .user-name .last-seen { margin-top: 5px; color: #436b4d; font-weight: 650; }
  .survey-toggle, .survey-item button { display: inline-flex; align-items: center; gap: 4px; margin-top: 7px; padding: 3px 0; border: 0; background: transparent; color: #2f6641; font: inherit; font-size: 12px; font-weight: 700; cursor: pointer; }
  .survey-toggle:focus-visible, .survey-item button:focus-visible { outline: 2px solid #2f6641; outline-offset: 3px; border-radius: 3px; }
  .survey-panel { margin: 16px 0 3px; padding: 14px 18px; border-radius: 12px; background: #f5f8f3; }
  .survey-panel > p { margin: 0; color: #516657; }
  .survey-panel .error { color: #9a3434; }
  .survey-item { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; flex-wrap: wrap; padding: 12px 0; }
  .survey-item + .survey-item { border-top: 1px solid #dce7dc; }
  .survey-item strong, .survey-item span { display: block; }
  .survey-item span { margin-top: 4px; color: #526658; font-size: 12px; }
  .survey-detail { flex-basis: 100%; max-height: 520px; overflow: auto; padding: 12px 16px; border-radius: 10px; background: white; color: #263b2a; }
  .survey-detail h3, .survey-detail h4 { margin: 10px 0 6px; }
  .survey-detail section + section { margin-top: 18px; border-top: 1px solid #e3ebe2; padding-top: 12px; }
  .survey-detail li { margin: 6px 0; }
  .metric span { color: #89948d; font-size: 10px; }
  .role { display: flex; gap: 8px; min-width: 255px; align-items: center; }
  .role-select { flex: 1; min-width: 155px; }
  .role button { min-height: 42px; padding: 0 11px; border: 0; border-radius: 9px; background: #e7efe4; color: #486451; font-weight: 700; white-space: nowrap; }
  .badge { padding: 5px 8px; border-radius: 999px; background: #edf3ea; color: #56705e; font-size: 10px; font-weight: 750; white-space: nowrap; }
  @media (max-width: 850px) { .user-grid { grid-template-columns: 1fr 1fr; } .user-name, .role { grid-column: 1/-1; } }
  @media (max-width: 480px) { .role { min-width: 0; width: 100%; flex-wrap: wrap; } .role-select { flex: 1 1 170px; min-width: 0; } }
`;
