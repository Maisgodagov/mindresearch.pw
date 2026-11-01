import { publicSeo, publicStructuredData } from "../../../../api/src/public-methods/seo";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ExternalLink, RotateCcw } from "lucide-react";
import { PlatformLayout } from "../PlatformLayout";
import type { PublicMethod } from "./types";
import "./public-methods.css";
const noMethods: PublicMethod[] = [];
export function Metadata({
  method,
  privatePage = false,
  methods = noMethods,
}: {
  method?: PublicMethod;
  privatePage?: boolean;
  methods?: PublicMethod[];
}) {
  const { pathname, search } = useLocation();
  useEffect(() => {
    const seo = publicSeo(method);
    const filtered = new URLSearchParams(search).has("q") || new URLSearchParams(search).has("topic");
    document.title = privatePage ? "Ваше прохождение | mindresearch" : seo.title;
    const values: [string, string, string][] = [
      ["name", "robots", privatePage ? "noindex,nofollow" : filtered ? "noindex,follow" : "index,follow,max-image-preview:large"],
      ["name", "description", privatePage ? "Личное прохождение психологического теста." : seo.description],
      ...(!privatePage ? [
        ["property", "og:site_name", "mindresearch"],
        ["property", "og:title", seo.title], ["property", "og:description", seo.description],
        ["property", "og:url", seo.url], ["property", "og:type", "website"],
        ["property", "og:locale", "ru_RU"], ["property", "og:image", seo.image],
        ["property", "og:image:width", "1200"], ["property", "og:image:height", "630"],
        ["property", "og:image:alt", method?.name || "Психологические тесты mindresearch"],
        ["name", "twitter:card", "summary_large_image"], ["name", "twitter:title", seo.title],
        ["name", "twitter:description", seo.description], ["name", "twitter:image", seo.image],
      ] as [string, string, string][] : []),
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
    canonical.href = seo.url;
    const current = canonical;
    let structured = document.getElementById("public-methods-schema") as HTMLScriptElement | null;
    const previousStructured = structured?.textContent;
    if (privatePage && structured) structured.remove();
    if (!privatePage) {
      if (!structured) {
        structured = document.createElement("script");
        structured.id = "public-methods-schema";
        structured.type = "application/ld+json";
        document.head.append(structured);
      }
      structured.textContent = JSON.stringify(publicStructuredData(methods, method));
    }
    return () => {
      changes.forEach((undo) => undo());
      if (structured && privatePage && previousStructured !== undefined) document.head.append(structured);
      if (structured && !privatePage) {
        if (previousStructured === undefined) structured.remove();
        else structured.textContent = previousStructured ?? "";
      }
      if (prior) current.href = prior;
      else current.remove();
    };
  }, [method, methods, privatePage, pathname, search]);
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
      <Link className="pm-text" to="/methods/">
        Вернуться к методикам
      </Link>
    </div>
  );
}
export function Sources({ method, hideTitle = false }: { method: PublicMethod; hideTitle?: boolean }) {
  return (
    <section id="sources" className="pm-article-section">
      {!hideTitle && <h2>Источники и версия</h2>}
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
