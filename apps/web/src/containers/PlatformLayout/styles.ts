import styled from "styled-components";
import { Button } from "../../components/Button";
import { sidebarWidth, sidebarTransitionMs } from "../../components/PlatformSidebar/const";

export const Frame = styled.div<{ $collapsed: boolean }>`
  min-height: 100dvh; background: var(--color-page); display: grid;
  grid-template-columns: ${p => p.$collapsed ? sidebarWidth.collapsed : sidebarWidth.expanded}px minmax(0, 1fr);
  transition: grid-template-columns ${sidebarTransitionMs}ms ease;
  @media (max-width: 760px) { grid-template-columns: 1fr; padding-bottom: 64px; }
`;

export const Main = styled.main`
  width: min(100% - 48px, 1320px); container-name: platform-main; container-type: inline-size;
  margin: 0 auto; padding: 28px 0 64px; min-width: 0;
  @media (max-width: 760px) { width: min(100% - 28px, 1320px); padding-top: 21px; padding-bottom: 32px; }
  @media (max-width: 420px) { width: min(100% - 22px, 1320px); }
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
      color: #fff;
      background: #557660;
      box-shadow: 0 6px 18px rgba(38, 57, 43, 0.22);
    }
    &&:hover, &&:active { color: #fff; background: #45644f; border: 0; }
  }
`;
