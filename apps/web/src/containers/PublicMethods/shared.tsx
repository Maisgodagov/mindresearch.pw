import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ExternalLink, RotateCcw } from "lucide-react";
import { PlatformLayout } from "../PlatformLayout";
import type { PublicMethod } from "./types";
import "./public-methods.css";
export function Metadata({
  method,
  privatePage = false,
}: {
  method?: PublicMethod;
  privatePage?: boolean;
}) {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = privatePage
      ? "Ваше прохождение | mindresearch"
      : method
        ? `${method.name} (${method.abbreviation}) — пройти онлайн | mindresearch`
        : "Психологические методики и тесты онлайн | mindresearch";
    const values: [string, string, string][] = [
      ["name", "robots", privatePage ? "noindex,nofollow" : "index,follow"],
      [
        "name",
        "description",
        method?.intro ??
          "Психологические методики для самопознания. Онлайн-прохождение без регистрации, понятные результаты и первоисточники.",
      ],
    ];
    const changes: (() => void)[] = [];
    for (const [attribute, key, value] of values) {
      let node = document.head.querySelector<HTMLMetaElement>(
        `meta[${attribute}="${key}"]`,
      );
      const previous = node?.content;
      if (!node) {
        node = document.createElement("meta");
        node.setAttribute(attribute, key);
        document.head.append(node);
      }
      node.content = value;
      const current = node;
      changes.push(() => {
        if (previous === undefined) current.remove();
        else current.content = previous;
      });
    }
    let canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    const prior = canonical?.href;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.append(canonical);
    }
    canonical.href = `https://mindresearch.pro${privatePage ? "/methods" : pathname.replace(/\/$/, "")}`;
    const current = canonical;
    return () => {
      changes.forEach((undo) => undo());
      if (prior) current.href = prior;
      else current.remove();
    };
  }, [method, privatePage, pathname]);
  return null;
}
export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <PlatformLayout publicAccess>
      <div className="public-methods pm-app">
        <a className="pm-skip" href="#public-main">
          К содержимому
        </a>
        <div id="public-main">{children}</div>
      </div>
    </PlatformLayout>
  );
}
export function PublicLoading() {
  return (
    <div className="pm-loading" role="status" aria-label="Загрузка">
      <span />
      <span />
      <span />
    </div>
  );
}
export function PublicError({
  message,
  retry,
}: {
  message: string;
  retry?: () => void;
}) {
  return (
    <div className="pm-error" role="alert">
      <h2>Не получилось загрузить данные</h2>
      <p>{message}</p>
      {retry && (
        <button className="pm-button pm-soft" onClick={retry}>
          <RotateCcw size={17} />
          Повторить
        </button>
      )}
      <Link className="pm-text" to="/methods">
        Вернуться к методикам
      </Link>
    </div>
  );
}
export function Sources({ method }: { method: PublicMethod }) {
  return (
    <section id="sources" className="pm-article-section">
      <h2>Источники и версия</h2>
      <p className="pm-secondary">{method.version}</p>
      <ol className="pm-sources">
        {method.sources.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noopener noreferrer">
              {s.title}
              <ExternalLink size={14} />
            </a>
          </li>
        ))}
      </ol>
      <p className="pm-secondary">{method.rights}</p>
      <p className="pm-secondary">
        Материал подготовлен редакцией mindresearch по указанным источникам. Не
        заменяет первоисточник методики.
      </p>
    </section>
  );
}
