import { BrandWordmark } from "../BrandWordmark";
import { useState, useEffect } from "react";
import {
  Bug,
  ChevronDown,
  Leaf,
  LogIn,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { MobileMenuButton, Sidebar, ToggleButton } from "./styles";
import type { PlatformSidebarProps } from "./types";

export function PlatformSidebar({
  collapsed,
  links,
  onToggle,
  onReport,
  onLogout,
}: PlatformSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [researchOpen, setResearchOpen] = useState(true);
  const closeMobile = () => setMobileOpen(false);
  useEffect(() => {
    if (!mobileOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [mobileOpen]);
  const researchPaths = [
    "/app",
    "/app/surveys/new",
    "/app/methodologies/suggest",
    "/app/community",
  ];
  const research = links.find((link) => link.to === "/for-researchers");
  const renderLink = ({
    to,
    end,
    label,
    icon: Icon,
  }: (typeof links)[number]) => (
    <NavLink
      to={to}
      end={end}
      aria-label={label}
      title={collapsed ? label : undefined}
      key={to}
      onClick={closeMobile}
    >
      <Icon size={18} />
      <span>{label}</span>
    </NavLink>
  );
  const reportButton = onReport && (
    <button
      className="report"
      type="button"
      title={collapsed ? "Сообщить об ошибке" : undefined}
      onClick={() => {
        closeMobile();
        onReport();
      }}
    >
      <Bug size={18} />
      <span>Сообщить об ошибке</span>
    </button>
  );
  return (
    <Sidebar
      $collapsed={collapsed}
      $mobileOpen={mobileOpen}
      data-authenticated={Boolean(onLogout)}
    >
      {mobileOpen && (
        <button
          className="menu-backdrop"
          aria-label="Закрыть меню"
          onClick={closeMobile}
        />
      )}
      <MobileMenuButton
        className="mobile-menu-toggle"
        data-authenticated={Boolean(onLogout)}
        type="button"
        aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((open) => !open)}
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        <span>{mobileOpen ? "Закрыть меню" : "Меню"}</span>
      </MobileMenuButton>
      <div className="top">
        <div
          className="brand"
          role="img"
          aria-label="mindresearch by Евгения Годагова"
        >
          <Leaf size={24} />
          <BrandWordmark />
        </div>
        <ToggleButton
          className="toggle"
          type="button"
          aria-label={
            collapsed ? "Развернуть боковое меню" : "Свернуть боковое меню"
          }
          title={
            collapsed ? "Развернуть боковое меню" : "Свернуть боковое меню"
          }
          onClick={onToggle}
        >
          {collapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </ToggleButton>
      </div>
      <nav className="nav" aria-label="Основное меню">
        {onLogout && research ? (
          <>
            <div className="research-group-heading">
              {renderLink(research)}
              <button
                className="research-group-toggle"
                type="button"
                aria-label={
                  researchOpen
                    ? "Свернуть раздел Для исследователей"
                    : "Развернуть раздел Для исследователей"
                }
                aria-expanded={researchOpen}
                aria-controls="research-navigation"
                onClick={() => setResearchOpen((open) => !open)}
              >
                <ChevronDown size={16} />
              </button>
            </div>
            <div
              id="research-navigation"
              className="research-children"
              data-open={researchOpen}
            >
              {links
                .filter((link) => researchPaths.includes(link.to))
                .map(renderLink)}
            </div>
            <div className="personal-navigation">
              {links
                .filter(
                  (link) =>
                    link.to === "/app/profile" || link.to === "/methods",
                )
                .map(renderLink)}
              {reportButton}
            </div>
            <div className="admin-navigation">
              {links
                .filter((link) => link.to.startsWith("/app/admin"))
                .map(renderLink)}
            </div>
          </>
        ) : (
          links.map(renderLink)
        )}
        {onLogout && (
          <button
            className="mobile-logout"
            type="button"
            onClick={() => {
              closeMobile();
              onLogout();
            }}
          >
            <LogOut size={18} />
            <span>Выйти</span>
          </button>
        )}
        {!onLogout && (
          <NavLink
            to="/login"
            className="guest-login-mobile"
            onClick={closeMobile}
          >
            <LogIn size={18} />
            <span>Войти</span>
          </NavLink>
        )}
      </nav>
      {onLogout ? (
        <button
          className="logout"
          type="button"
          title={collapsed ? "Выйти" : undefined}
          aria-label="Выйти"
          onClick={onLogout}
        >
          <LogOut size={17} />
          <span>Выйти</span>
        </button>
      ) : (
        <NavLink
          to="/login"
          className="logout"
          aria-label="Войти"
          title={collapsed ? "Войти" : undefined}
        >
          <LogIn size={17} />
          <span>Войти</span>
        </NavLink>
      )}
    </Sidebar>
  );
}

export type { PlatformSidebarProps, SidebarLink } from "./types";
