import { useEffect, useState, type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Select from "react-select";
import {
  Bug,
  ClipboardList,
  Leaf,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Send,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { api, getCachedCurrentUser, getCurrentUser, logout } from "../api";

const Frame = styled.div<{ $collapsed: boolean }>`
  min-height: 100dvh;
  background: #f3f6f0;
  display: grid;
  grid-template-columns: ${(p) => (p.$collapsed ? "76px" : "240px")} minmax(
      0,
      1fr
    );
  transition: grid-template-columns 0.22s ease;
  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    padding-bottom: 74px;
  }
`;
const Side = styled.aside<{ $collapsed: boolean }>`
  padding: 24px ${(p) => (p.$collapsed ? "10px" : "18px")};
  border-right: 1px solid #dfe7dc;
  background: rgba(250, 252, 248, 0.94);
  position: sticky;
  top: 0;
  height: 100dvh;
  transition: padding 0.22s ease;
  .top {
    display: flex;
    flex-direction: ${(p) => (p.$collapsed ? "column" : "row")};
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 24px;
    min-height: ${(p) => (p.$collapsed ? "72px" : "36px")};
  }
  .brand {
    display: flex;
    align-items: center;
    justify-content: ${(p) => (p.$collapsed ? "center" : "flex-start")};
    gap: 9px;
    color: #3e5e48;
    font-weight: 800;
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
  .toggle {
    border: 0;
    background: #e8efe5;
    color: #55705d;
    width: 30px;
    height: 30px;
    display: grid;
    place-items: center;
    border-radius: 9px;
    cursor: pointer;
    flex: none;
    padding: 0;
  }
  .nav {
    display: grid;
    gap: 5px;
  }
  a,
  .logout,
  .report {
    border: 0;
    text-decoration: none;
    background: transparent;
    color: #68766c;
    display: flex;
    align-items: center;
    justify-content: ${(p) => (p.$collapsed ? "center" : "flex-start")};
    gap: 10px;
    padding: 12px;
    border-radius: 12px;
    font-weight: 650;
    font-size: 14px;
    white-space: nowrap;
    cursor: pointer;
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
    background: #e6eee3;
    color: #3d5c46;
  }
  .report {
    width: 100%;
    margin-top: 10px;
  }
  .logout {
    position: absolute;
    bottom: 22px;
    left: ${(p) => (p.$collapsed ? "10px" : "18px")};
    right: ${(p) => (p.$collapsed ? "10px" : "18px")};
    width: auto;
  }
  @media (max-width: 760px) {
    position: fixed;
    z-index: 10;
    top: auto;
    bottom: 0;
    width: 100%;
    height: 68px;
    border-right: 0;
    border-top: 1px solid #dfe7dc;
    padding: 8px;
    .top,
    .logout {
      display: none;
    }
    .nav {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(55px, 1fr));
    }
    a,
    .report {
      justify-content: center;
      flex-direction: column;
      gap: 2px;
      padding: 5px;
      font-size: 10px;
      margin: 0;
    }
    a span,
    .report span {
      display: inline;
    }
  }
`;
const Main = styled.main`
  width: min(100% - 36px, 1180px);
  margin: 0 auto;
  padding: 34px 0 70px;
`;
const ReportOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(28, 42, 32, 0.46);
  backdrop-filter: blur(5px);
`;
const ReportModal = styled.div`
  width: min(100%, 560px);
  padding: 26px;
  border: 1px solid #d9e3d7;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 24px 80px rgba(35, 55, 40, 0.24);
  position: relative;
  h2 {
    margin: 0 0 7px;
    color: #304a38;
    font:
      600 28px var(--font-heading),
      serif;
  }
  p {
    margin: 0 0 18px;
    color: #748178;
    line-height: 1.5;
    font-size: 13px;
  }
  .close {
    position: absolute;
    right: 17px;
    top: 17px;
    width: 34px;
    height: 34px;
    border: 0;
    border-radius: 10px;
    background: #eef3eb;
    color: #526b59;
    display: grid;
    place-items: center;
  }
  .field {
    display: grid;
    gap: 7px;
    margin-top: 14px;
  }
  .field label {
    font-size: 12px;
    font-weight: 750;
    color: #526558;
  }
  select,
  textarea {
    width: 100%;
    border: 1px solid #cedacd;
    border-radius: 12px;
    background: #fff;
    padding: 12px;
    color: #30443a;
    font: inherit;
  }
  textarea {
    min-height: 150px;
    resize: vertical;
  }
  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 9px;
    margin-top: 17px;
  }
  .cancel,
  .submit {
    border: 0;
    border-radius: 11px;
    padding: 11px 15px;
    font-weight: 750;
  }
  .cancel {
    background: #edf2eb;
    color: #5b6e61;
  }
  .submit {
    background: #557660;
    color: #fff;
  }
  .submit:disabled {
    opacity: 0.55;
  }
  .success {
    padding: 12px;
    border-radius: 11px;
    background: #e9f3e6;
    color: #476750;
  }
`;
const reportTypeOptions = [
  { value: "bug", label: "Ошибка на сайте" },
  { value: "methodology", label: "Ошибка в методике" },
  { value: "other", label: "Другое" },
];
const reportSelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    minHeight: 52,
    borderRadius: 12,
    borderColor: state.isFocused ? "#78947e" : "#cedacd",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(95,128,104,.1)" : "none",
    background: "#fff",
    "&:hover": { borderColor: "#9caf9d" },
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 16px 45px rgba(42,64,48,.18)",
    zIndex: 110,
  }),
  menuList: (base: any) => ({ ...base, padding: 5 }),
  option: (base: any, state: any) => ({
    ...base,
    borderRadius: 8,
    fontSize: 14,
    background: state.isSelected
      ? "#5d7b65"
      : state.isFocused
        ? "#edf4ea"
        : "#fff",
    color: state.isSelected ? "#fff" : "#34483a",
    cursor: "pointer",
  }),
  singleValue: (base: any) => ({ ...base, color: "#34483a", fontSize: 14 }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base: any, state: any) => ({
    ...base,
    color: state.isFocused ? "#56745e" : "#7b8980",
    "&:hover": { color: "#45614d" },
  }),
  menuPortal: (base: any) => ({ ...base, zIndex: 120 }),
};
const links = [
  { to: "/app", end: true, label: "Мои опросы", icon: ClipboardList },
  { to: "/app/surveys/new", label: "Создать", icon: Plus },
  { to: "/app/methodologies/suggest", label: "Запросить методику", icon: Send },
  { to: "/app/profile", label: "Профиль", icon: UserRound },
];

export function PlatformLayout({ children }: { children: ReactNode }) {
  const nav = useNavigate(),
    cached = getCachedCurrentUser();
  const [role, setRole] = useState(cached?.role ?? "");
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem("mindresearch_sidebar_collapsed") === "1",
  );
  const [reportOpen, setReportOpen] = useState(false),
    [category, setCategory] = useState("bug"),
    [description, setDescription] = useState(""),
    [reportSending, setReportSending] = useState(false),
    [reportSent, setReportSent] = useState(false),
    [reportError, setReportError] = useState("");
  useEffect(() => {
    if (!cached)
      getCurrentUser()
        .then((user) => setRole(String(user.role ?? "")))
        .catch(() => {});
  }, []);
  const toggle = () =>
    setCollapsed((value) => {
      const next = !value;
      localStorage.setItem("mindresearch_sidebar_collapsed", next ? "1" : "0");
      return next;
    });
  const visibleLinks = ["owner", "admin"].includes(role)
    ? [
        ...links.slice(0, 3),
        {
          to: "/app/admin/methodologies",
          label: "Конструктор методик",
          icon: ClipboardList,
        },
        { to: "/app/admin", label: "Админ-центр", icon: ShieldCheck },
        links[3],
      ]
    : links;
  const sendReport = async () => {
    if (description.trim().length < 10) return;
    setReportSending(true);
    setReportError("");
    try {
      await api.post("/account/bug-reports", {
        category,
        description: description.trim(),
        pageUrl: window.location.href,
      });
      setReportSent(true);
      setDescription("");
    } catch (error: any) {
      setReportError(
        error.response?.data?.message ?? "Не удалось отправить сообщение",
      );
    } finally {
      setReportSending(false);
    }
  };
  return (
    <Frame $collapsed={collapsed}>
      <Side $collapsed={collapsed}>
        <div className="top">
          <div className="brand">
            <Leaf size={24} />
            <span>mindresearch</span>
          </div>
          <button
            className="toggle"
            type="button"
            aria-label={
              collapsed ? "Развернуть боковое меню" : "Свернуть боковое меню"
            }
            title={
              collapsed ? "Развернуть боковое меню" : "Свернуть боковое меню"
            }
            onClick={toggle}
          >
            {collapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </button>
        </div>
        <div className="nav">
          {visibleLinks.map(({ to, end, label, icon: Icon }) => (
            <NavLink
              to={to}
              end={end}
              aria-label={label}
              title={collapsed ? label : undefined}
              key={to}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
          <button
            className="report"
            type="button"
            title={collapsed ? "Сообщить об ошибке" : undefined}
            onClick={() => {
              setReportOpen(true);
              setReportSent(false);
            }}
          >
            <Bug size={18} />
            <span>Сообщить об ошибке</span>
          </button>
        </div>
        <button
          className="logout"
          title={collapsed ? "Выйти" : undefined}
          aria-label="Выйти"
          onClick={async () => {
            await logout();
            nav("/login");
          }}
        >
          <LogOut size={17} />
          <span>Выйти</span>
        </button>
      </Side>
      <Main>{children}</Main>
      {reportOpen && (
        <ReportOverlay
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setReportOpen(false);
          }}
        >
          <ReportModal
            role="dialog"
            aria-modal="true"
            aria-label="Сообщить об ошибке"
          >
            <button
              className="close"
              aria-label="Закрыть"
              onClick={() => setReportOpen(false)}
            >
              <X size={18} />
            </button>
            <h2>Сообщить об ошибке</h2>
            <p>
              Опишите проблему — сообщение вместе с адресом текущей страницы
              попадёт администраторам.
            </p>
            {reportSent ? (
              <div className="success">Спасибо! Сообщение отправлено.</div>
            ) : (
              <>
                <div className="field">
                  <label>Тип проблемы</label>
                  <Select
                    options={reportTypeOptions}
                    value={reportTypeOptions.find(
                      (option) => option.value === category,
                    )}
                    onChange={(option) => setCategory(option?.value ?? "bug")}
                    styles={reportSelectStyles}
                    isSearchable={false}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    aria-label="Тип проблемы"
                  />
                </div>
                <div className="field">
                  <label>Что произошло?</label>
                  <textarea
                    autoFocus
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Опишите, что вы делали, что ожидали увидеть и что произошло на самом деле"
                  />
                </div>
                {reportError && (
                  <p style={{ color: "#9a5752", marginTop: 10 }}>
                    {reportError}
                  </p>
                )}
                <div className="actions">
                  <button
                    className="cancel"
                    onClick={() => setReportOpen(false)}
                  >
                    Отмена
                  </button>
                  <button
                    className="submit"
                    disabled={reportSending || description.trim().length < 10}
                    onClick={sendReport}
                  >
                    {reportSending ? "Отправляем…" : "Отправить"}
                  </button>
                </div>
              </>
            )}
          </ReportModal>
        </ReportOverlay>
      )}
    </Frame>
  );
}
