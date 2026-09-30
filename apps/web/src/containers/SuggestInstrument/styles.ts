import styled from "styled-components";
import { Card } from "../../ui";

export const Form = styled(Card)`
  padding: clamp(22px, 5vw, 36px);
  border-radius: 22px;
  max-width: 760px;
  margin: auto;
  h1 { font: 500 36px var(--font-heading), serif; color: #304a38; margin: 0 0 9px; }
  .intro { color: #718077; line-height: 1.6; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 14px; }
  .adaptation-select { width: 100%; }
  .adaptation-native-select { display: none; }
  .wide { grid-column: 1/-1; }
  label { display: block; font-size: 13px; font-weight: 700; color: #5f7065; margin: 18px 0 7px; }
  .required { color: #9a5c55; }
  .note { background: #eef4eb; padding: 14px; border-radius: 12px; color: #607067; font-size: 12px; line-height: 1.55; margin: 18px 0; }
  .success { display: flex; gap: 9px; align-items: center; color: #4f765a; margin-top: 16px; }
  .error { color: #a25555; }
  form > button { margin-top: 20px; }
  .history { margin-top: 32px; padding-top: 22px; border-top: 1px solid #e1e8df; }
  .history p { color: #65736a; }
  @media (max-width: 620px) { .grid { grid-template-columns: 1fr; } .wide { grid-column: auto; } }
`;
