import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
export const platformTitle =
  "Платформа для психологических исследований - mindresearch";
export const titleForPage = (text: string) =>
  `${text.trim().replace(/\s+/g, " ").slice(0, 140)} | mindresearch`;
export function usePageTitle(title: string | undefined) {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    if (title) document.title = titleForPage(title);
  }, [title, pathname]);
}
export function PageTitles() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    if (/^\/for-researchers\/?$/.test(pathname) || /^\/methods(?:\/[^/]+)?\/?$/.test(pathname)) return;
    // Run after page metadata cleanups when navigating away from a public article.
    const frame = requestAnimationFrame(() => {
      let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
      if (!robots) { robots = document.createElement("meta"); robots.name = "robots"; document.head.append(robots); }
      robots.content = "noindex,nofollow";
      document.head.querySelectorAll('link[rel="canonical"], #public-methods-schema, #researcher-schema').forEach(node => node.remove());
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, search]);
  useLayoutEffect(() => {
    const staticTitles: Record<string, string> = {
      "/for-researchers": "Для исследователей",
      "/login": "Вход",
      "/register": "Регистрация",
      "/forgot-password": "Восстановление пароля",
      "/reset-password": "Новый пароль",
      "/app": "Мои опросы",
      "/app/community": "Найти респондентов",
      "/app/profile": "Профиль и настройки",
      "/app/surveys/new": "Создание опроса",
      "/app/methodologies/suggest": "Запрос методики",
      "/app/methodologies/review": "Мои методики",
      "/app/admin": "Админ-центр",
      "/app/admin/methodologies": "Конструктор методик",
      "/admin": "Статистика опросов",
      "/admin/login": "Вход в кабинет",
    };
    const section =
      staticTitles[pathname] ??
      (pathname.startsWith("/p/")
        ? "Профиль автора"
        : pathname.endsWith("/results")
          ? "Статистика опроса"
          : pathname.endsWith("/edit")
            ? "Конструктор опроса"
            : pathname.includes("/admin/users/")
              ? "Просмотр пользователя"
              : pathname.startsWith("/s/")
                ? "Прохождение опроса"
                : null);
    document.title = section ? titleForPage(section) : platformTitle;
  }, [pathname, search]);
  return null;
}
