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
    &[data-authenticated="true"] {
      .nav {
        display: ${(p) => (p.$mobileOpen ? "flex" : "none")};
        position: absolute;
        bottom: 70px;
        left: 12px;
        right: 12px;
        width: auto;
        height: auto;
        max-height: calc(100dvh - 100px);
        overflow-y: auto;
        flex-direction: column;
        align-items: stretch;
        gap: 4px;
        padding: 16px;
        background: #fbfcfa;
        border-radius: 16px;
        box-shadow: 0 10px 35px rgb(30 50 35 / 18%);
        z-index: 12;
      }
      .nav a,
      .nav .report {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        flex: none;
        gap: 12px;
        min-height: 44px;
        padding: 10px 12px;
        font-size: 14px;
      }
      .nav a span,
      .nav .report span {
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
        width: 44px;
        height: 44px;
      }
      .nav .research-children {
        padding-left: 20px;
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
        display: flex;
        align-items: center;
        gap: 12px;
        min-height: 44px;
        padding: 10px 12px;
        border: 0;
        border-radius: 8px;
        background: transparent;
        color: #56645a;
        font: inherit;
        font-size: 14px;
        text-align: left;
        cursor: pointer;
      }
      .nav .mobile-logout span {
        display: inline;
      }
      .menu-backdrop {
        display: block;
        position: fixed;
        inset: 0;
        border: 0;
        border-radius: 0;
        background: rgb(30 50 35 / 20%);
        z-index: 11;
      }
    }
    .top {
      display: none;
    }
    .nav {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: clamp(4px, 1.5vw, 12px);
      width: min(100%, 380px);
      height: 100%;
      margin: 0 auto;
      overflow: visible;
    }
    .nav .mobile-hidden,
    .nav .report {
      display: none;
    }
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
    a svg {
      width: 17px;
      height: 17px;
    }
    a span,
    .report span {
      display: block;
      width: 100%;
      text-align: center;
      line-height: 1.1;
      white-space: normal;
      overflow-wrap: anywhere;
    }
    .logout {
      display: none;
    }
    .nav .guest-login-mobile {
      display: flex;
    }
  }
`;

export const MobileMenuButton = styled(Button)`
  display: none;
  @media (max-width: 760px) {
    &&[data-authenticated="true"] {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      position: relative;
      z-index: 13;
      margin: 2px auto;
      height: 44px;
      min-width: 150px;
      border: 0;
      box-shadow: none;
      background: #e7efdf;
      color: #355238;
      border-radius: 9px;
      font-size: 14px;
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
