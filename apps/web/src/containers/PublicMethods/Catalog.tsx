import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Search,
  X,
} from "lucide-react";
import { PublicShell, Metadata, PublicLoading, PublicError } from "./shared";
import { publicRequest } from "./types";
import {
  collections,
  findMethods,
  methodCount,
  type CatalogMethod,
} from "./catalogModel";
import "./catalog.css";
export function PublicMethods() {
  const [methods, setMethods] = useState<CatalogMethod[] | null>(null),
    [error, setError] = useState("");
  const [params, setParams] = useSearchParams();
  const topic = params.get("topic") ?? "",
    query = params.get("q") ?? "";
  const [allTopics, setAllTopics] = useState(false),
    [topicQuery, setTopicQuery] = useState(""),
    [topicPage, setTopicPage] = useState(0);
  const load = () => {
    setError("");
    publicRequest<CatalogMethod[]>("methods")
      .then(setMethods)
      .catch((e) => setError(e.message));
  };
  useEffect(load, []);
  const groups = useMemo(() => collections(methods ?? []), [methods]);
  const matches = findMethods(methods ?? [], topic, query);
  const filteredTopics = groups.filter((g) =>
    g.topic
      .toLocaleLowerCase("ru")
      .includes(topicQuery.trim().toLocaleLowerCase("ru")),
  );
  const perPage = allTopics ? 12 : 6;
  const visibleTopics = filteredTopics.slice(
    topicPage * perPage,
    (topicPage + 1) * perPage,
  );
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: key === "q" });
  };
  return (
    <PublicShell>
      <Metadata />
      <div className="method-library">
        <header className="ml-heading">
          <div>
            <h1>Методики</h1>
            <p>Начните с темы, которую хотите исследовать.</p>
          </div>
          <Link className="ml-research-link" to="/for-researchers">
            Проводите исследование? <ArrowRight size={16} />
          </Link>
        </header>
        <label className="ml-search">
          <Search size={21} />
          <input
            aria-label="Поиск методики"
            placeholder="Название, тема или то, что хотите узнать"
            value={query}
            onChange={(e) => update("q", e.target.value)}
          />
          {query && (
            <button aria-label="Очистить поиск" onClick={() => update("q", "")}>
              <X size={18} />
            </button>
          )}
        </label>
        {error ? (
          <PublicError message={error} retry={load} />
        ) : !methods ? (
          <PublicLoading />
        ) : (
          <>
            {!topic && !query && (
              <section
                className="ml-collections"
                aria-labelledby="collections-title"
              >
                <div className="ml-section-heading">
                  <h2 id="collections-title">Что вам интересно?</h2>
                  {groups.length > 6 && (
                    <button
                      onClick={() => {
                        setAllTopics((v) => !v);
                        setTopicPage(0);
                        setTopicQuery("");
                      }}
                      className="pm-text"
                    >
                      {allTopics
                        ? "Свернуть подборки"
                        : `Все темы · ${groups.length}`}
                      <ChevronDown size={16} />
                    </button>
                  )}
                </div>
                {allTopics && (
                  <label className="ml-topic-search">
                    <Search size={17} />
                    <input
                      aria-label="Поиск темы"
                      value={topicQuery}
                      placeholder="Найти тему"
                      onChange={(e) => {
                        setTopicQuery(e.target.value);
                        setTopicPage(0);
                      }}
                    />
                  </label>
                )}
                <div className="ml-collection-grid">
                  {visibleTopics.map((group) => (
                    <button
                      className="ml-collection"
                      key={group.topic}
                      onClick={() => update("topic", group.topic)}
                    >
                      <span className="ml-collection-count">
                        {methodCount(group.items.length)}
                      </span>
                      <h3>{group.topic}</h3>
                      <p>{group.items[0].title}</p>
                      <span className="ml-collection-link">
                        Смотреть подборку <ArrowRight size={18} />
                      </span>
                    </button>
                  ))}
                </div>
                {!visibleTopics.length && (
                  <p className="ml-empty">
                    Такой темы пока нет. Попробуйте другое название.
                  </p>
                )}
                {allTopics && filteredTopics.length > perPage && (
                  <div className="ml-pagination">
                    <button
                      className="pm-button pm-soft"
                      aria-label="Предыдущие темы"
                      disabled={!topicPage}
                      onClick={() => setTopicPage((p) => p - 1)}
                    >
                      <ChevronLeft size={17} />
                    </button>
                    <span>
                      Страница {topicPage + 1} из{" "}
                      {Math.ceil(filteredTopics.length / perPage)}
                    </span>
                    <button
                      className="pm-button pm-soft"
                      aria-label="Следующие темы"
                      disabled={
                        (topicPage + 1) * perPage >= filteredTopics.length
                      }
                      onClick={() => setTopicPage((p) => p + 1)}
                    >
                      <ChevronRight size={17} />
                    </button>
                  </div>
                )}
              </section>
            )}
            <section className="ml-results" aria-labelledby="methods-title">
              <div className="ml-section-heading">
                <div>
                  {topic && (
                    <button
                      className="pm-text ml-back"
                      onClick={() => update("topic", "")}
                    >
                      <ArrowLeft size={15} />
                      Все темы
                    </button>
                  )}
                  <h2 id="methods-title">
                    {topic || (query ? "Результаты поиска" : "Все методики")}
                  </h2>
                </div>
                <span className="ml-result-count" role="status">
                  {methodCount(matches.length)}
                </span>
              </div>
              <div className="ml-methods">
                {matches.map((m) => (
                  <article className="ml-method" key={m.slug}>
                    <div className="ml-method-main">
                      <span className="ml-method-code">
                        {m.abbreviation}
                        <span>{m.topic}</span>
                      </span>
                      <h3>
                        <Link to={`/methods/${m.slug}`}>{m.name}</Link>
                      </h3>
                      <p>{m.intro}</p>
                    </div>
                    <div className="ml-method-action">
                      <span>
                        <Clock3 size={15} />
                        {m.minutes}
                        {m.questionCount
                          ? ` · ${m.questionCount} вопросов`
                          : ""}
                      </span>
                      <Link
                        className="pm-button pm-soft"
                        to={`/methods/${m.slug}`}
                      >
                        Открыть методику <ArrowRight size={17} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
              {!matches.length && (
                <div className="ml-empty">
                  <h3>Методики не найдены</h3>
                  <p>Попробуйте другое название или вернитесь ко всем темам.</p>
                  <button
                    className="pm-button pm-soft"
                    onClick={() => setParams({})}
                  >
                    Сбросить поиск
                  </button>
                </div>
              )}
            </section>
            <p className="ml-footnote">
              Можно пройти для себя без регистрации. На странице каждой методики
              — описание, ограничения и первоисточники.
            </p>
          </>
        )}
      </div>
    </PublicShell>
  );
}
