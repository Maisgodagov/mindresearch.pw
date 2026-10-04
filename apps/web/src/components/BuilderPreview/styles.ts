import styled from "styled-components";
import { Page, Shell } from "../../ui";
import { Button } from "../../ui";

export const Layer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  overflow: auto;
  background: #f3f6f0;
`;

export const PreviewPage = styled(Page)`
  min-height: 100dvh;
`;

export const PreviewShell = styled(Shell)`
  padding-bottom: 60px;
`;

export const Toolbar = styled.div`
  position: sticky;
  top: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin: 0 calc(50% - 50vw);
  padding: 10px max(16px, calc((100vw - 720px) / 2));
  border-bottom: 1px solid #dce5da;
  background: rgba(246, 248, 244, 0.94);
  backdrop-filter: blur(14px);
  .context {
    display: flex;
    align-items: center;
    gap: 9px;
    color: #526f5b;
    font-size: 12px;
  }
  .context b {
    display: block;
    color: #344d3b;
    font-size: 13px;
  }
  .close {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 10px 13px;
    border: 1px solid #cbd8cb;
    border-radius: 11px;
    background: #fff;
    color: #405b48;
    font-weight: 750;
  }
  @media (max-width: 560px) {
    align-items: flex-start;
    gap: 8px;
    padding: 9px 12px;
    .context { font-size: 10px; }
    .context b { font-size: 11px; }
    .close { min-height: 36px; padding: 7px 9px; font-size: 10px; white-space: nowrap; }
  }
`;
