import { useState } from "react";
import { Bug, Leaf, LogOut, Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "../Button";
import { MobileMenuButton, Sidebar, ToggleButton } from "./styles";
import type { PlatformSidebarProps } from "./types";

export function PlatformSidebar({ collapsed, links, onToggle, onReport, onLogout }: PlatformSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);
  return (
    <Sidebar $collapsed={collapsed} $mobileOpen={mobileOpen}>
      <MobileMenuButton type="button" aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"} aria-expanded={mobileOpen} onClick={() => setMobileOpen(open => !open)}>
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </MobileMenuButton>
      <div className="top">
        <div className="brand"><Leaf size={24} /><span>mindresearch</span></div>
        <ToggleButton className="toggle" type="button" aria-label={collapsed ? "Развернуть боковое меню" : "Свернуть боковое меню"} title={collapsed ? "Развернуть боковое меню" : "Свернуть боковое меню"} onClick={onToggle}>
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </ToggleButton>
      </div>
      <div className="nav">
        {links.map(({ to, end, label, icon: Icon }) => (
          <NavLink to={to} end={end} aria-label={label} title={collapsed ? label : undefined} key={to} className={to === "/app/methodologies/suggest" || to === "/app/admin/methodologies" ? "mobile-hidden" : undefined} onClick={closeMobile}>
            <Icon size={18} /><span>{label}</span>
          </NavLink>
        ))}
        <Button className="report" type="button" title={collapsed ? "Сообщить об ошибке" : undefined} onClick={onReport}>
          <Bug size={18} /><span>Сообщить об ошибке</span>
        </Button>
      </div>
      <button className="logout" type="button" title={collapsed ? "Выйти" : undefined} aria-label="Выйти" onClick={onLogout}>
        <LogOut size={17} /><span>Выйти</span>
      </button>
    </Sidebar>
  );
}

export type { PlatformSidebarProps, SidebarLink } from "./types";
