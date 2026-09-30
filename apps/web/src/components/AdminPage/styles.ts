import styled from "styled-components";
import { adminPageContentWidth } from "./const";

export const AdminPageRoot = styled.div`
  max-width: ${adminPageContentWidth}px;
  h1 { margin: 0; color: #304a38; font: 500 clamp(34px, 5vw, 46px) var(--font-heading), serif; }
  .lead { color: #748178; margin: 7px 0 22px; }
`;
