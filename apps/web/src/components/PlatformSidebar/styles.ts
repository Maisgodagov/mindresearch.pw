import styled from "styled-components";
import { Button } from "../Button";

export const Sidebar = styled.aside<{
  $collapsed: boolean;
  $mobileOpen: boolean;
}>`
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
    gap: 6px;
    margin-bottom: 31px;
    min-height: ${(p) => (p.$collapsed ? "72px" : "36px")};
  }
  .brand {
    display: flex;
    align-items: center;
    justify-content: ${(p) => (p.$collapsed ? "center" : "flex-start")};
    gap: 6px;
    color: #365532;
    font-size: 17px;
    font-weight: 750;
    letter-spacing: -0.025em;
    min-width: 0;
    padding: 0;
  }
  .brand svg {
    flex: none;
    align-self: flex-start;
  }
  .brand .brand-wordmark > small {
    padding-left: 6px;
  }
  .brand .brand-wordmark .brand-author {
    font-size: 18px;
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
  .report:hover {
    background: #f0f5ed;
    color: #365532;
  }
  a.active {
    background: #e5efe0;
    color: #2f4e2b;
  }
  .guest-login-mobile {
    display: none;
  }
  .report {
    font-family: inherit;
    line-height: inherit;
    width: 100%;
    margin-top: 16px;
    color: #69786d;
  }
  .logout {
    appearance: none;
    position: absolute;
    bottom: 22px;
    left: ${(p) => (p.$collapsed ? "10px" : "18px")};
    right: ${(p) => (p.$collapsed ? "10px" : "18px")};
    width: auto;
    border-top: 1px solid #e1e7df;
    border-radius: 0;
    padding-top: 15px;
    text-align: left;
    transition: color 0.12s ease;
  }
  .logout:hover {
    background: transparent;
    color: #4b6250;
  }
  .logout:focus-visible {
    outline: 2px solid #91b784;
    outline-offset: 2px;
  }
  .mobile-logout {
    display: none;
  }
  .menu-backdrop {
    display: none;
  }
  .research-group-heading {
    display: flex;
    align-items: center;
    gap: 2px;
  }
  .research-group-heading > a {
    flex: 1;
    min-width: 0;
    padding-right: 4px;
    padding-left: 4px;
  }
  .research-group-toggle {
    display: grid;
    place-items: center;
    flex: none;
    width: 28px;
    height: 36px;
    padding: 0;
    border: 0;
    border-radius: 7px;
    color: #5a715c;
    background: transparent;
    cursor: pointer;
  }
  .research-group-toggle:hover {
    background: #edf3e8;
  }
  .research-group-toggle svg {
    transition: transform 160ms ease;
  }
  .research-group-toggle[aria-expanded="false"] svg {
    transform: rotate(-90deg);
  }
  .research-children {
    display: ${(p) => (p.$collapsed ? "grid" : "none")};
    padding-left: ${(p) => (p.$collapsed ? "0" : "17px")};
    gap: 3px;
  }
  .research-children[data-open="true"] {
    display: grid;
  }
  .research-group-toggle {
    display: ${(p) => (p.$collapsed ? "none" : "grid")};
  }
  .personal-navigation {
    display: grid;
    gap: 3px;
    margin-top: 20px;
  }
  .personal-navigation .report {
    margin-top: 0;
  }
  .admin-navigation:not(:empty) {
    display: grid;
    gap: 3px;
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid #e1e7df;
  }
  .nav {
    max-height: calc(100dvh - 180px);
    overflow-y: auto;
  }
  button:focus-visible,
  a:focus-visible {
    outline: 2px solid #8fa47d;
    outline-offset: 2px;
  }
  .mobile-header {
    display: none;
  }
  @media (max-width: 760px) {
    position: fixed;
    z-index: 60;
    top: 0;
    bottom: auto;
    left: 0;
    right: 0;
    width: 100%;
    height: calc(56px + env(safe-area-inset-top));
    padding: 0;
    border: 0;
    background: #fbfcfa;
    box-shadow: 0 1px 0 #e1e7df;
    .top,
    .logout {
      display: none;
    }
    .mobile-header {
      display: grid;
      grid-template-columns: 52px 1fr 52px;
      align-items: center;
      position: relative;
      z-index: 13;
      height: 100%;
      padding-top: env(safe-area-inset-top);
      background: #fbfcfa;
    }
    .mobile-wordmark {
      grid-column: 2;
      justify-content: center;
      padding: 0;
      font-size: 20px;
      font-weight: 750;
      letter-spacing: -0.025em;
      color: #355238;
    }
    .mobile-wordmark.active,
    .mobile-wordmark:hover {
      background: transparent;
    }
    .menu-backdrop {
      display: block;
      position: fixed;
      inset: calc(56px + env(safe-area-inset-top)) 0 0;
      border: 0;
      border-radius: 0;
      background: rgb(30 50 35 / 25%);
      z-index: 11;
    }
    .nav {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: flex-start;
      position: fixed;
      top: calc(56px + env(safe-area-inset-top));
      bottom: 0;
      left: 0;
      width: min(340px, calc(100vw - 40px));
      height: auto;
      max-height: none;
      padding: 20px 14px calc(20px + env(safe-area-inset-bottom));
      margin: 0;
      overflow-y: auto;
      overscroll-behavior: contain;
      background: #fbfcfa;
      z-index: 12;
      gap: 4px;
      border-radius: 0;
      transform: ${(p) =>
        p.$mobileOpen ? "translateX(0)" : "translateX(-100%)"};
      visibility: ${(p) => (p.$mobileOpen ? "visible" : "hidden")};
      transition:
        transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
        visibility 220ms;
    }
    .nav a,
    .nav .report,
    .nav .mobile-logout {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      flex: none;
      gap: 12px;
      min-height: 46px;
      padding: 10px 12px;
      margin: 0;
      font-size: 14px;
      white-space: normal;
    }
    .nav a span,
    .nav .report span,
    .nav .mobile-logout span {
      display: inline;
      width: auto;
      text-align: left;
      line-height: 1.4;
    }
    .nav .research-group-heading a {
      flex: 1;
    }
    .nav .research-group-toggle {
      display: grid;
      width: 40px;
      height: 44px;
    }
    .nav .research-children {
      padding-left: 18px;
      display: none;
    }
    .nav .research-children[data-open="true"] {
      display: grid;
    }
    .nav .personal-navigation,
    .nav .admin-navigation {
      width: 100%;
    }
    .nav .mobile-logout {
      border: 0;
      border-radius: 8px;
      background: transparent;
      color: #56645a;
      font-family: inherit;
      text-align: left;
      cursor: pointer;
      margin-top: 18px;
    }
    .nav .guest-login-mobile {
      display: flex;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .nav {
      transition: none;
    }
  }
`;

export const MobileMenuButton = styled(Button)`
  display: none;
  @media (max-width: 760px) {
    &&&,
    &&&:hover,
    &&&:active {
      display: grid;
      place-items: center;
      width: 44px;
      min-width: 44px;
      height: 44px;
      margin: 0 4px;
      padding: 0;
      border: 0;
      box-shadow: none;
      background: transparent;
      color: #355238;
      border-radius: 8px;
    }
    &&&:hover {
      background: #edf3e8;
    }
  }
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
