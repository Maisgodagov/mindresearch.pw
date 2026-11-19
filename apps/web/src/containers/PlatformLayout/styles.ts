import styled from "styled-components";
import { Button } from "../../components/Button";
import { PageContainer } from "../../components/PageContainer";
import { sidebarWidth, sidebarTransitionMs } from "../../components/PlatformSidebar/const";

export const Frame = styled.div.attrs<{ "data-sidebar-motion": boolean }>({ "data-sidebar-motion": true })<{ $collapsed: boolean }>`
  --sidebar-transition-duration: ${sidebarTransitionMs}ms;
  min-height: 100dvh; background: var(--color-page); display: grid;
  grid-template-columns: ${p => p.$collapsed ? sidebarWidth.collapsed : sidebarWidth.expanded}px minmax(0, 1fr);
  transition: grid-template-columns ${sidebarTransitionMs}ms cubic-bezier(.4, 0, .2, 1);
  @media (max-width: 760px) { grid-template-columns: 1fr; padding-top: calc(56px + env(safe-area-inset-top)); padding-bottom: 0; }
`;

export const Main = styled(PageContainer).attrs({ as: "main" })`
  container-name: platform-main; container-type: inline-size;
  padding-block: 32px 64px;
  &&& h1 {
    font-family: var(--font-heading), serif;
    font-size: 32px;
    font-weight: 500;
    line-height: 1.25;
    letter-spacing: -0.025em;
    color: var(--color-text-304a38);
    white-space: normal;
  }
  @media (max-width: 600px) { &&& h1 { font-size: 28px; } }
  @media (max-width: 760px) { padding-block: 24px 32px; }
`;

export const FloatingReportButton = styled(Button)`
  display: none;
  @media (max-width: 760px) {
    && {
      position: fixed;
      z-index: 9;
      right: 18px;
      bottom: 76px;
      display: grid;
      place-items: center;
      width: 42px;
      min-width: 42px;
      max-width: 42px;
      height: 42px;
      min-height: 42px;
      aspect-ratio: 1;
      flex: 0 0 42px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      color: var(--color-text-fff);
      background: var(--color-brand);
      box-shadow: 0 6px 18px var(--color-brand-alpha-220);
    }
    &&:hover, &&:active { color: var(--color-text-fff); background: var(--color-brand); border: 0; }
  }
`;
