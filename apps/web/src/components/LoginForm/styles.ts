import styled from 'styled-components';
import { Card } from '../Card';
import { Page } from '../Page';

export const LoginPage = styled(Page)`
  min-height:100dvh;display:grid;place-items:center;padding:28px 16px;
`;

export const LoginCard = styled(Card)`
  width:min(100%,468px);margin:auto;padding:clamp(28px,6vw,44px);
  border-radius:22px;background:rgba(255,255,255,.88);
  box-shadow:0 24px 70px rgba(48,70,54,.09);
  .brand{display:flex;align-items:center;gap:10px;color:#486650;font-weight:800;font-size:18px;letter-spacing:-.025em;margin-bottom:30px}
  .brand svg{width:27px;height:27px;stroke-width:1.8}
  .eyebrow{margin:0 0 8px;color:#7b897f;font-size:10px;font-weight:800;letter-spacing:.11em;text-transform:uppercase}
  h1{font:500 clamp(32px,7vw,39px)/1.15 var(--font-heading),Georgia,serif;color:#304a38;letter-spacing:-.025em;margin:0 0 27px}
  form{display:grid;gap:0}
  .field{display:grid;gap:8px;margin-bottom:19px}
  label{color:#586a5e;font-size:12px;font-weight:700}
  .ant-input,.ant-input-affix-wrapper{min-height:53px;border-radius:11px;font-size:15px}
  .forgot{justify-self:start;display:inline-flex;align-items:center;gap:5px;margin:-5px 0 3px;color:#526e59;font-size:12px;font-weight:650;text-decoration-color:#aab8aa;text-underline-offset:3px}
  .forgot svg{transition:transform .16s ease}
  .forgot:hover svg{transform:translateX(2px)}
  form>.ant-btn{width:100%;margin-top:19px;border-radius:11px}
  .error{margin:10px 0 0;color:#a05252;font-size:13px}
  .bottom{color:#78847c;font-size:12px;line-height:1.5;text-align:center;margin:23px 0 0}
  .bottom a{color:#47644f;font-weight:700;text-underline-offset:3px}
  @media(max-width:480px){padding:28px 23px;border-radius:18px;.brand{margin-bottom:24px}}
`;
