import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Download,
  ChartNoAxesCombined,
  ChevronDown,
  Clock3,
  FileText,
  UserRound,
} from "lucide-react";
import {
  PublicShell,
  Metadata,
  PublicLoading,
  PublicError,
  Sources,
} from "./shared";
import { publicRequest, formatQuestionCount, type PublicMethod } from "./types";
import { AuthenticatedOnly } from "../PlatformLayout";
import { MethodContents, scrollToMethodSection } from "./MethodContents";
import "./catalog.css";
import { publicBootstrap } from "./bootstrap";
import { MethodStatsBadge, useMethodStats } from "./stats";

const methodBackground: Record<string, string> = {
  "fear-of-missing-out": "Шкала Przybylski и соавторов (2013) описывает страх упустить переживания и встречи. Здесь используется шестипунктовая русская адаптация В. В. Ардисламова, П. Р. Кляхиной и Э. Р. Шаиповой (2024).",
  "nomophobia": "NMP-Q разработан Caglar Yildirim и Ana-Paula Correia (2015). Используется русская пятибалльная версия А. А. Максименко, А. А. Золотарёвой, С. В. Курапова и А. С. Кураповой (2025).",
  "social-media-use": "Шкала C. S. Andreassen и соавторов (2016) оценивает опыт использования социальных сетей. Используется бланк из публикации Д. С. Корниенко и соавторов (2023); русская форма проверялась на подростках 13–18 лет, взрослые нормы здесь не применяются.",
  "satisfaction-with-life": "Шкала Эда Динера, Роберта Эммонса, Рэнди Ларсена и Шэрон Гриффин (1985) измеряет общую удовлетворённость жизнью по вашим собственным критериям. Используется русскоязычная версия Елшанского и соавторов (2015).",
  "subjective-happiness": "Методика Сони Любомирски и Хайди Леппер (1999) измеряет общее субъективное ощущение счастья. Здесь используется русскоязычная форма Е. Н. Осина и Д. А. Леонтьева, описанная в публикации 2020 года.",
  "brief-thriving": "Краткий опросник Жун Су, Луиса Тэя и Эда Динера (2014) оценивает психологическое благополучие в целом. Используется русскоязычная адаптация В. Ю. Костенко, У. А. Набиевой и А. А. Лебедевой (2025).",

  "rosenberg-self-esteem": "Методика Морриса Розенберга измеряет глобальную самооценку — общее отношение к себе и ощущение собственной ценности. Здесь используется русскоязычная версия А. А. Золотарёвой (2020).",
  "general-self-efficacy": "Методика Ральфа Шварцера и Маттиаса Ерусалема измеряет общую самоэффективность — убеждённость в своей способности действовать и справляться с трудностями. Здесь используется русская версия В. Г. Ромека, опубликованная совместно с авторами в 1996 году.",
  "perceived-social-support": "Методика Грегори Зимета, Нэнси Далем, Сары Зимет и Гордона Фарли (1988) измеряет субъективное ощущение доступности помощи. Она позволяет отдельно рассмотреть поддержку семьи, друзей и значимого для вас человека.",
};
export function PublicMethodPage() {
  const { slug } = useParams();
  const [data, setData] = useState<{
      method: PublicMethod;
      questionCount: number;
    } | null>(() => publicBootstrap(`/methods/${slug}/`)),
    [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  useEffect(() => {
    const snapshot = publicBootstrap<{method: PublicMethod; questionCount: number}>(`/methods/${slug}/`);
    setData(snapshot);
    setError("");
    setNotFound(false);
    if (snapshot) return;
    const controller = new AbortController();
    publicRequest<{ method: PublicMethod; questionCount: number }>(
      `methods/${slug}`,
      undefined,
      "POST",
      controller.signal,
    )
      .then(setData)
      .catch((e) => {
        if (e.name !== "AbortError") { setError(e.message); setNotFound(e.status === 404); }
      });
    return () => controller.abort();
  }, [slug]);
  const m = data?.method;
  const countsFor = useMethodStats(m?.slug === slug ? m?.slug : undefined);
  const counts = m ? countsFor(m.slug) : undefined;
  return (
    <PublicShell>
      <Metadata method={m} privatePage={notFound} />
      {error ? (
        <PublicError message={error} />
      ) : !m || !data ? (
        <PublicLoading />
      ) : (
        <div className="test-document">
          <nav className="td-breadcrumb" aria-label="Навигация">
            <Link to="/methods/">
              <ArrowLeft size={16} />
              Все тесты
            </Link>
            <span>{m.topic}</span>
          </nav>
          <header className="td-hero">
            <div className="td-hero-copy">
              <h1>{m.name}</h1>
              {counts && <MethodStatsBadge counts={counts} />}
              <div className="td-meta" aria-label="Параметры теста">
                <span className="td-abbreviation">{m.abbreviation}</span>
                <span><FileText size={17} strokeWidth={1.75} aria-hidden="true" />{formatQuestionCount(data.questionCount)}</span>
                <span><Clock3 size={17} strokeWidth={1.75} aria-hidden="true" />{m.minutes}</span>
                <span><UserRound size={17} strokeWidth={1.75} aria-hidden="true" />Для взрослых, 18+</span>
              </div>
              <p className="td-intro">{m.intro}</p>
              <div className="td-actions">
              <Link className="pm-button pm-primary" to={`/methods/${m.slug}/start/`}>
                Пройти тест <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <a className="pm-text td-about-link" href="#about-test" onClick={scrollToMethodSection}>
                О методике <ChevronDown size={17} aria-hidden="true" />
              </a>
              </div>
            </div>
            <aside className="td-result-overview" aria-label="После прохождения">
              <h2>Что будет в результате</h2>
              <ul>
                <li><ChartNoAxesCombined size={20} strokeWidth={1.75} aria-hidden="true" /><div><strong>Баллы и пояснения</strong><p>Ваши показатели и что они означают</p></div></li>
                <li><BookOpen size={20} strokeWidth={1.75} aria-hidden="true" /><div><strong>Понятный расчёт</strong><p>Как ответы складываются в результат</p></div></li>
                <li><Download size={20} strokeWidth={1.75} aria-hidden="true" /><div><strong>Карточка результата</strong><p>Можно скачать и поделиться</p></div></li>
              </ul>
              <p className="td-result-note">Для самопознания. Результат не является диагнозом.</p>
            </aside>
          </header>
          <div className="td-reading-layout">
            <MethodContents slug={m.slug} />
            <div className="td-article">
              <section id="about-test">
                <h2>Что помогает понять этот тест</h2>
                <p>{m.sections[0]?.text}</p>
                {(methodBackground[m.slug] || m.sections.find(s => s.title === "Авторы и используемая версия")?.text) && <p className="td-method-background">{methodBackground[m.slug] || m.sections.find(s => s.title === "Авторы и используемая версия")?.text}</p>}
              </section>
              <section id="before-test" className="td-before">
                <h2>Как пройти тест</h2>
                <p>{m.instruction}</p>
                <p>{m.audience}</p>
              </section>
              <section id="test-details" className="td-details">
                <h2>Как устроена методика</h2>
                {m.sections.slice(1).map((section, i) => (
                  <details key={`${slug}-${i}`} >
                    <summary>
                      {section.title}
                      <ChevronDown size={18} />
                    </summary>
                    <p>{section.text}</p>
                  </details>
                ))}
              </section>
              <section id="test-limits">
                <h2>Как относиться к результату</h2>
                <p>{m.limitations}</p>
              </section>
              <Sources method={m} />
              <AuthenticatedOnly>
                <section>
                  <h2>Для вашего исследования</h2>
                  <p>
                    Добавьте методику в свой опрос, собирайте ответы и
                    анализируйте показатели вместе с другими данными
                    исследования.
                  </p>
                  <Link className="pm-text" to="/app/surveys/new">
                    Создать опрос <ArrowRight size={17} />
                  </Link>
                </section>
              </AuthenticatedOnly>
            </div>
          </div>
          <section className="td-finish">
            <div>
              <h2>Начните с нескольких минут для себя</h2>
              <p>
                {formatQuestionCount(data.questionCount)} · {m.minutes} · результат сразу
                после прохождения
              </p>
            </div>
            <Link
              className="pm-button pm-primary"
              to={`/methods/${m.slug}/start/`}
            >
              Пройти тест <ArrowRight size={18} />
            </Link>
          </section>
        </div>
      )}
    </PublicShell>
  );
}
