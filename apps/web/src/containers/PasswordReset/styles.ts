import styled from 'styled-components';
import { Card } from '../../components/Card';

export const Box = styled(Card)`
  width: min(100% - 32px, 450px);
  margin: 10vh auto;
  padding: 40px;
  .brand { display:flex; align-items:center; gap:9px; color:#486650; font-size:19px; font-weight:850; margin-bottom:28px; }
  .brand svg { width:27px; height:27px; }
  h1 { font:500 34px var(--font-heading),serif; color:#304a38; margin:0 0 10px; }
  p { color:#718077; font-size:13px; line-height:1.55; }
  .back { display:block; text-align:center; margin-top:18px; color:#58705f; font-size:13px; }
`;
