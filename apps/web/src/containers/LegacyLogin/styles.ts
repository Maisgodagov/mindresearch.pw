import styled from "styled-components";
import { Card } from "../../ui";

export const LoginBox = styled(Card)`
  width: min(100% - 32px, 430px); margin: 12vh auto; padding: 40px;
  h1 { font: 500 36px var(--font-heading), serif; color: #304a38; }
  label { display: block; color: #657269; font-size: 13px; margin: 18px 0 7px; }
  button { width: 100%; margin-top: 24px; }
  .error { color: #a05252; }
`;
