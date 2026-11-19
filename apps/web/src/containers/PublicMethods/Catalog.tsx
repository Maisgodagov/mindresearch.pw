import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, ChevronDown, CircleHelp, Clock3, ListChecks, Search, X } from "lucide-react";
import { PublicShell, Metadata, PublicLoading, PublicError } from "./shared";
import { publicRequest } from "./types";
import type { CatalogMethod, CatalogPage } from "./catalogModel";
import "./catalog.css";
import { publicBootstrap } from "./bootstrap";
import { MethodStatsBadge, useMethodStats, type MethodCounts } from "./stats";
import { catalogQueryKey } from "../../../../api/src/public-methods/discovery";

function TestLink({ method, counts }: { method: CatalogMethod; counts?: MethodCounts }) {
  return (
    <article className="tc-test">
      <div className="tc-test-copy">
        <h3><Link to={`/methods/${method.slug}/`}>{method.name}</Link></h3>
        <p className="tc-test-official"><span className="tc-test-caption"><CircleHelp size={16} strokeWidth={1.75} aria-hidden="true" />{method.title}</span><span className="tc-test-abbreviation">{method.abbreviation}</span></p>
        <p className="tc-test-description">{method.intro}</p>
        {counts && <MethodStatsBadge counts={counts} />}
      </div>
      <div className="tc-test-aside">
        <div className="tc-test-meta">{method.topic}</div>
        <dl>
          {method.questionCount !== undefined && <div><dt><ListChecks size={16} strokeWidth={1.75} aria-hidden="true" />Вопросы</dt><dd>{method.questionCount}</dd></div>}
          <div><dt><Clock3 size={16} strokeWidth={1.75} aria-hidden="true" />Время</dt><dd>{method.minutes}</dd></div>
        </dl>
        <Link className="tc-test-action" to={`/methods/${method.slug}/`} aria-label={`Подробнее: ${method.name}`}>
          Подробнее о тесте <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export function PublicMethods() {
  const countsFor = useMethodStats();
  const [data, setData] = useState<CatalogPage | null>(() => publicBootstrap("/methods/", catalogQueryKey(new URLSearchParams(window.location.search))));
  const [loading, setLoading] = useState(false);
  const [retry, setRetry] = useState(0);
  const [error, setError] = useState("");
  const [params, setParams] = useSearchParams();
  const [topicQuery, setTopicQuery] = useState("");
  const query = params.get("q") ?? "", section = params.get("section") ?? "";
  const topics = [...new Set(params.getAll("topic").filter(Boolean))];
  const requestParams = new URLSearchParams();
  if (query) requestParams.set("q", query);
  if (section) requestParams.set("section", section);
  topics.forEach(topic => requestParams.append("topic", topic));
  const pageValue = Number(params.get("page"));
  if (Number.isInteger(pageValue) && pageValue > 1) requestParams.set("page", String(pageValue));
  const requestKey = requestParams.toString();
  useEffect(() => {
    const snapshot = publicBootstrap<CatalogPage>("/methods/", requestKey);
    if (snapshot && !retry) { setData(snapshot); setLoading(false); setError(""); return; }
    const controller = new AbortController();
    setLoading(true); setError("");
    const timer = window.setTimeout(() => {
      publicRequest<CatalogPage>(`catalog?${requestKey}`, undefined, "GET", controller.signal)
        .then(result => { if (!controller.signal.aborted) setData(result); })
        .catch(error => { if (!controller.signal.aborted) setError(error.message); })
        .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    }, 250);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [requestKey, retry]);
  const methods = data?.items ?? null;
  const groups = data?.topics ?? [];
  const sections = [...new Set(groups.map(group => group.section))];
  const filter = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    next.delete("page");
    if (value) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
  };
  const chooseSection = (value: string) => {
    const next = new URLSearchParams(params);
    next.delete("page");
    next.delete("topic");
    if (value) next.set("section", value); else next.delete("section");
    setParams(next, { replace: true });
  };
  const toggleTopic = (topic: string) => {
    const next = new URLSearchParams(params);
    next.delete("page");
    next.delete("section");
    next.delete("topic");
    const selected = topics.includes(topic) ? topics.filter(item => item !== topic) : [...topics, topic];
    selected.forEach(item => next.append("topic", item));
    setParams(next, { replace: true });
  };
  const resetTopics = () => {
    const next = new URLSearchParams(params);
    next.delete("page");
    next.delete("section"); next.delete("topic");
    setParams(next, { replace: true });
  };
  const pageHref = (page: number) => {
    const next = new URLSearchParams(params);
    if (page === 1) next.delete("page"); else next.set("page", String(page));
    return `?${next}`;
  };
  return (
    <PublicShell>
      <Metadata methods={methods ?? undefined} />
      <div className="test-catalog">
        <header className="tc-intro">
          <h1>Психологические тесты онлайн</h1>
          <p className="tc-intro-description">Тесты на самооценку, психологическое благополучие и цифровые привычки.<br className="tc-intro-break" /> Пройдите выбранную методику и получите результат с пояснениями.</p>
          <label className="tc-search">
            <Search size={20} aria-hidden="true" />
            <input aria-label="Найти психологический тест" placeholder="Найти тест или тему" maxLength={200} value={query} onChange={e => filter("q", e.target.value)} />
            {query && <button type="button" aria-label="Очистить поиск" onClick={() => filter("q", "")}><X size={18} aria-hidden="true" /></button>}
          </label>
        </header>
        <section className="tc-discovery" aria-label="Каталог тестов">
          {methods && !error && <>
            <div className="tc-topic-filters" role="group" aria-label="Разделы тестов">
              <button type="button" aria-pressed={!section && !topics.length} onClick={() => chooseSection("")}>Все тесты</button>
              {sections.map(name => <button type="button" key={name} aria-pressed={section === name} onClick={() => chooseSection(name)}>{name}</button>)}
              <details className="tc-topic-picker" onKeyDown={event => { if (event.key === "Escape") { event.currentTarget.open = false; event.currentTarget.querySelector("summary")?.focus(); } }} onBlur={event => { if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget as Node)) event.currentTarget.open = false; }}>
                <summary>Все темы <ChevronDown size={16} aria-hidden="true" /></summary>
                <div className="tc-topic-panel">
                  <div className="tc-topic-panel-top">
                  <div className="tc-topic-panel-head"><div><h2>Темы тестов</h2><p className="tc-topic-hint">Выберите одну или несколько тем</p></div><button type="button" aria-label="Закрыть темы" onClick={event => { const details = event.currentTarget.closest("details"); if (details) { details.open = false; details.querySelector("summary")?.focus(); } }}><X size={18} aria-hidden="true" /></button></div>
                  <label className="tc-topic-search"><Search size={18} aria-hidden="true" /><input aria-label="Найти тему" placeholder="Найти тему" value={topicQuery} onChange={event => setTopicQuery(event.target.value)} /></label>
                  </div>
                  <div className="tc-topic-scroll">
                  <div className="tc-topic-options">
                    {sections.map(name => {
                      const options = groups.filter(group => group.section === name && group.topic.toLocaleLowerCase("ru").includes(topicQuery.trim().toLocaleLowerCase("ru")));
                      return options.length ? <fieldset key={name}><legend>{name}</legend>{options.map(group => <label key={group.topic}><input type="checkbox" checked={topics.includes(group.topic)} onChange={() => toggleTopic(group.topic)} /><span>{group.topic}</span><small>{group.count}</small></label>)}</fieldset> : null;
                    })}
                  </div>
                  {!groups.some(group => group.topic.toLocaleLowerCase("ru").includes(topicQuery.trim().toLocaleLowerCase("ru"))) && <p className="tc-topic-hint" role="status">Такой темы пока нет. Попробуйте другое название.</p>}
                  </div>
                  <div className="tc-topic-footer">
                  <button type="button" className="tc-topic-clear" disabled={!topics.length && !section} onClick={resetTopics}>Сбросить выбор</button>
                  <button type="button" className="tc-topic-done" onClick={event => { const details = event.currentTarget.closest("details"); if (details) { details.open = false; details.querySelector("summary")?.focus(); } }}>Показать результаты{loading ? "…" : ` (${data?.total ?? 0})`} <ArrowRight size={16} aria-hidden="true" /></button>
                  </div>
                </div>
              </details>
            </div>
            {(topics.length > 0 || section) && <div className="tc-selected-topics" role="group" aria-label="Выбранные фильтры">
              {section && <button type="button" aria-label={`Убрать раздел: ${section}`} onClick={() => chooseSection("")}>{section}<X size={14} aria-hidden="true" /></button>}
              {topics.map(topic => <button type="button" key={topic} aria-label={`Убрать тему: ${topic}`} onClick={() => toggleTopic(topic)}>{topic}<X size={14} aria-hidden="true" /></button>)}
              <button type="button" className="tc-reset-topics" onClick={resetTopics}>Сбросить</button>
            </div>}
          </>}
          {error ? <PublicError message={error} retry={() => setRetry(value => value + 1)} /> : !methods || loading ? <PublicLoading /> : <>
            <div className="tc-discovery-head">
              <h2 id="tc-topics" aria-live="polite" aria-atomic="true">{section || (topics.length === 1 ? topics[0] : topics.length ? "Выбранные темы" : query ? "Результаты поиска" : "Все тесты")}({data?.total ?? 0})</h2>
            </div>
            <div className="tc-tests">{methods.map(m => <TestLink key={m.slug} method={m} counts={countsFor(m.slug)} />)}</div>
            {data && data.pageCount > 1 && <nav className="tc-pagination" aria-label="Страницы тестов">
              {data.page > 1 && <Link to={pageHref(data.page - 1)} onClick={() => document.querySelector('.tc-discovery')?.scrollIntoView({ block: 'start' })}>Назад</Link>}
              {Array.from({ length: data.pageCount }, (_, i) => i + 1).filter(page => page === 1 || page === data.pageCount || Math.abs(page - data.page) <= 1).map((page, index, pages) => <span key={page}>
                {index > 0 && page - pages[index - 1] > 1 && <span className="tc-page-gap">…</span>}
                <Link aria-label={`Страница ${page}`} aria-current={page === data.page ? "page" : undefined} to={pageHref(page)} onClick={() => document.querySelector('.tc-discovery')?.scrollIntoView({ block: 'start' })}>{page}</Link>
              </span>)}
              {data.page < data.pageCount && <Link to={pageHref(data.page + 1)} onClick={() => document.querySelector('.tc-discovery')?.scrollIntoView({ block: 'start' })}>Далее</Link>}
            </nav>}
            {!methods.length && <div className="tc-empty">
              <h3>Пока ничего не нашлось</h3>
              <p>Попробуйте «самооценка», «поддержка» или название методики.</p>
              <button type="button" className="pm-text" onClick={() => setParams({})}>Сбросить фильтры <X size={16} aria-hidden="true" /></button>
            </div>}
          </>}
        </section>
        <aside className="tc-research">
          <div><h2>Нужен опрос для своего исследования?</h2><p>Объединяйте методики и свои вопросы, собирайте ответы по ссылке и считайте статистику в mindresearch.</p></div>
          <Link className="pm-button pm-soft" to="/for-researchers">Для исследователей <ArrowRight size={18} aria-hidden="true" /></Link>
        </aside>
      </div>
    </PublicShell>
  );
}
