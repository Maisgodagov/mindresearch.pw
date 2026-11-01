import styled from 'styled-components';
import { Card } from '../Card';
import { Page } from '../Page';

export const LoginPage = styled(Page)`
  min-height:100dvh;display:grid;place-items:center;padding:32px 16px;
`;

export const LoginCard = styled(Card)`
  width:min(100%,468px);min-width:0;margin:auto;padding:clamp(24px,6vw,40px);
  border-radius:var(--radius-card);background:var(--color-surface);
  box-shadow:none;
  .brand{display:flex;align-items:center;gap:10px;color:var(--color-brand);font-weight:600;font-size:18px;letter-spacing:-.025em;margin-bottom:32px}
  .brand svg{width:27px;height:27px;stroke-width:1.8}
  .eyebrow{margin:0 0 8px;color:var(--color-secondary);font-size:13px;font-weight:600;letter-spacing:0;text-transform:none}
  h1{font:500 clamp(32px,7vw,39px)/1.15 var(--font-heading),Georgia,serif;color:var(--color-ink);letter-spacing:-.025em;margin:0 0 24px}
  form{display:grid;gap:0}
  .field{display:grid;gap:8px;margin-bottom:20px}
  label{color:var(--color-brand);font-size:14px;font-weight:500}
  .ant-input,.ant-input-affix-wrapper{min-height:48px;border-radius:var(--radius-control);font-size:15px}
  .forgot{justify-self:start;display:inline-flex;align-items:center;gap:5px;margin:-5px 0 3px;color:var(--color-brand);font-size:14px;font-weight:650;text-decoration-color:var(--color-border-strong);text-underline-offset:3px}
  .forgot svg{transition:transform .16s ease}
  .forgot:hover svg{transform:translateX(2px)}
  form>.ant-btn{width:100%;margin-top:24px;border-radius:var(--radius-control)}
  .error{margin:10px 0 0;color:var(--color-text-a05252);font-size:13px}
  .bottom{color:var(--color-muted);font-size:14px;line-height:1.5;text-align:center;margin:24px 0 0}
  .bottom a{color:var(--color-brand);font-weight:500;text-underline-offset:3px}
  @media(max-width:480px){padding:24px;border-radius:var(--radius-card);.brand{margin-bottom:24px;gap:8px}.brand .brand-wordmark{flex-wrap:wrap;min-width:0;gap:4px 8px}.brand .brand-wordmark>small{margin-left:0}}
`;
