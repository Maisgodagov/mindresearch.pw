import styled from "styled-components";
import { Button } from "../Button";

export const Sidebar = styled.aside<{ $collapsed: boolean; $mobileOpen: boolean }>`
  padding: 22px ${(p) => (p.$collapsed ? "10px" : "16px")};
  border-right: 1px solid #e1e7df;
  background: #fbfcfa;
  position: sticky;
  top: 0;
  height: 100dvh;
  transition: none;
  .top {
    display: flex;
    flex-direction: ${(p) => (p.$collapsed ? "column" : "row")};
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 31px;
    min-height: ${(p) => (p.$collapsed ? "72px" : "36px")};
  }
  .brand {
    display: flex;
    align-items: center;
    justify-content: ${(p) => (p.$collapsed ? "center" : "flex-start")};
    gap: 9px;
    color: #365532;
    font-size: 17px;
    font-weight: 750;
    letter-spacing: -0.025em;
    min-width: 0;
    padding: ${(p) => (p.$collapsed ? "0" : "0 8px")};
  }
  .brand svg {
    flex: none;
  }
  .brand span {
    display: ${(p) => (p.$collapsed ? "none" : "block")};
    white-space: nowrap;
    overflow: hidden;
  }
  .nav {
    display: grid;
    gap: 4px;
  }
  a,
  .logout,
  .report {
    border: 0;
    text-decoration: none;
    background: transparent;
    color: #56645a;
    display: flex;
    align-items: center;
    justify-content: ${(p) => (p.$collapsed ? "center" : "flex-start")};
    gap: 10px;
    padding: 10px 11px;
    border-radius: 8px;
    font-weight: 650;
    font-size: 13px;
    white-space: nowrap;
    cursor: pointer;
    transition:
      background 0.16s ease,
      color 0.16s ease;
    position: relative;
  }
  a svg,
  .logout svg,
  .report svg {
    flex: none;
  }
  a span,
  .logout span,
  .report span {
    display: ${(p) => (p.$collapsed ? "none" : "inline")};
  }
  a.active,
  a:hover,
  .logout:hover,
  .report:hover {
    background: #f0f5ed;
    color: #365532;
  }
  a.active {
    background: #e5efe0;
    color: #2f4e2b;
  }
  .report {
    width: 100%;
    margin-top: 16px;
    color: #69786d;
  }
  .logout {
    position: absolute;
    bottom: 22px;
    left: ${(p) => (p.$collapsed ? "10px" : "18px")};
    right: ${(p) => (p.$collapsed ? "10px" : "18px")};
    width: auto;
    border-top: 1px solid #e1e7df;
    border-radius: 0;
    padding-top: 15px;
  }
  @media (max-width: 760px) {
    position: fixed;
    z-index: 10;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 62px;
    border: 0;
    border-top: 1px solid #e1e7df;
    padding: 5px 10px max(5px, env(safe-area-inset-bottom));
    background: rgba(251, 252, 250, 0.98);
    box-shadow: 0 -5px 16px rgba(33, 50, 37, 0.07);
    .top {
      display: none;
    }
    .nav {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: clamp(12px, 6vw, 30px);
      width: min(100%, 380px);
      height: 100%;
      margin: 0 auto;
      overflow: visible;
    }
    .nav .mobile-hidden,
    .nav .report { display: none; }
    a,
    .report {
      flex: 0 1 68px;
      min-width: 0;
      min-height: 0;
      justify-content: center;
      flex-direction: column;
      gap: 3px;
      padding: 4px 2px;
      font-size: 9px;
      margin: 0;
      border-radius: 8px;
      white-space: normal;
    }
    a svg { width: 17px; height: 17px; }
    a span,
    .report span {
      display: block;
      width: 100%;
      text-align: center;
      line-height: 1.1;
      white-space: normal;
      overflow-wrap: anywhere;
    }
    .logout { display: none; }
  }
`;

export const MobileMenuButton = styled(Button)`
  display: none;
`;

export const ToggleButton = styled(Button)`
  && {
    border: 0;
    background: transparent;
    color: #56745f;
    box-shadow: none;
  }
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  padding: 0;
  &&:hover,
  &&:active {
    border: 0;
    background: transparent;
    color: #385942;
    box-shadow: none;
  }
`;
