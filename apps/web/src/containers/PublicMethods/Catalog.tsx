import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  ChartNoAxesCombined,
  Clock3,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { PublicShell, Metadata, PublicLoading, PublicError } from "./shared";
import { publicRequest } from "./types";
import { collections, findMethods, type CatalogMethod } from "./catalogModel";
import "./catalog.css";

const topicCopy: Record<string, { title: string; text: string }> = {
  Самооценка: {
    title: "Как вы относитесь к себе?",
    text: "Принятие себя и ощущение собственной ценности. Посмотрите, как вы оцениваете себя сейчас.",
  },
  Самоэффективность: {
    title: "Насколько вы верите в свои силы?",
    text: "Уверенность в том, что вы справитесь с трудностями. Исследуйте, как вы воспринимаете свои возможности.",
  },
  "Социальная поддержка": {
    title: "На чью поддержку вы опираетесь?",
    text: "Семья, друзья и близкий человек. Узнайте, насколько доступной вы ощущаете поддержку в своей жизни.",
  },
};
function TestLink({ method }: { method: CatalogMethod }) {
  return (
    <article className="tc-test">
      <div className="tc-test-copy">
        <span className="tc-test-meta">
          {method.abbreviation} ·{" "}
          {method.questionCount ? `${method.questionCount} вопросов · ` : ""}
          {method.minutes}
        </span>
        <h3>
          <Link to={`/methods/${method.slug}`}>{method.name}</Link>
        </h3>
        <p>{method.intro}</p>
      </div>
      <Link
        className="pm-button pm-soft tc-test-action"
        to={`/methods/${method.slug}`}
      >
        Подробнее о тесте <ArrowRight size={18} />
      </Link>
    </article>
  );
}
export function PublicMethods() {
  const [methods, setMethods] = useState<CatalogMethod[] | null>(null);
  const [error, setError] = useState("");
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "",
    topic = params.get("topic") ?? "";
  const load = () => {
    setError("");
    publicRequest<CatalogMethod[]>("methods")
      .then(setMethods)
      .catch((e) => setError(e.message));
  };
  useEffect(load, []);
  const groups = useMemo(() => collections(methods ?? []), [methods]);
  const matches = findMethods(methods ?? [], topic, query);
  const searching = Boolean(query || topic);
  const search = (value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set("q", value);
    else next.delete("q");
    setParams(next, { replace: true });
  };
  return (
    <PublicShell>
      <Metadata />
      <div className="test-catalog">
        <header className="tc-intro">
          <h1>
            Психологические тесты,
            <br />
            <span>чтобы лучше понять себя</span>
          </h1>
          <p>
            Как вы относитесь к себе, справляетесь с трудностями и ощущаете
            поддержку близких? Выберите тему, пройдите тест онлайн и получите
            результат с пояснениями.
          </p>
          <div className="tc-promises">
            <span>
              <UserRound size={17} />
              Без регистрации
            </span>
            <span>
              <Clock3 size={17} />
              Несколько минут на тест
            </span>
            <span>
              <ChartNoAxesCombined size={17} />
              Результат сразу
            </span>
          </div>
        </header>
        <section className="tc-discovery" aria-labelledby="tc-topics">
          <div className="tc-discovery-head">
            <div>
              <h2 id="tc-topics">Что вы хотите узнать о себе?</h2>
              <p>
                Психологические методики с описанием, источниками и понятным
                расчётом.
              </p>
            </div>
            <label className="tc-search">
              <Search size={20} />
              <input
                aria-label="Найти психологический тест"
                placeholder="Найти тест или тему"
                value={query}
                onChange={(e) => search(e.target.value)}
              />
              {query && (
                <button aria-label="Очистить поиск" onClick={() => search("")}>
                  <X size={18} />
                </button>
              )}
            </label>
          </div>
          {error ? (
            <PublicError message={error} retry={load} />
          ) : !methods ? (
            <PublicLoading />
          ) : searching ? (
            <div className="tc-search-results">
              <div className="tc-search-summary">
                <h2>{topic || "Результаты поиска"}</h2>
                <span role="status">Найдено: {matches.length}</span>
                <button className="pm-text" onClick={() => setParams({})}>
                  Все тесты <X size={16} />
                </button>
              </div>
              {matches.map((m) => (
                <TestLink key={m.slug} method={m} />
              ))}
              {!matches.length && (
                <div className="tc-empty">
                  <h3>Пока ничего не нашлось</h3>
                  <p>
                    Попробуйте «самооценка», «поддержка» или название методики.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="tc-collections">
              {groups.map((group) => {
                const copy = topicCopy[group.topic];
                return (
                  <section className="tc-collection" key={group.topic}>
                    <div className="tc-topic">
                      <span>{group.topic}</span>
                      <h2>{copy?.title ?? group.topic}</h2>
                      <p>
                        {copy?.text ??
                          "Выберите тест, чтобы узнать больше об этой стороне своей жизни."}
                      </p>
                    </div>
                    <div className="tc-topic-tests">
                      {group.items.map((m) => (
                        <TestLink key={m.slug} method={m} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </section>
        <section className="tc-guide" aria-labelledby="tc-guide-title">
          <div>
            <BookOpen size={25} />
            <h2 id="tc-guide-title">
              За каждым тестом — методика.
              <br />
              За результатом — ваши ответы.
            </h2>
          </div>
          <div>
            <p>
              Перед прохождением можно прочитать, что измеряет тест, какая
              версия используется и на какие источники мы опираемся. После —
              посмотреть рассчитанные показатели и пояснения к ним.
            </p>
            <p className="tc-limit">
              Тесты предназначены для самопознания взрослых. Результат не
              является диагнозом и не заменяет консультацию специалиста.
            </p>
          </div>
        </section>
        <aside className="tc-research">
          <div>
            <h2>Нужен опрос для своего исследования?</h2>
            <p>
              Объединяйте методики и свои вопросы, собирайте ответы по ссылке и
              считайте статистику в mindresearch.
            </p>
          </div>
          <Link className="pm-button pm-soft" to="/for-researchers">
            Для исследователей <ArrowRight size={18} />
          </Link>
        </aside>
      </div>
    </PublicShell>
  );
}
