import { relatedMethods } from "../../../../api/src/public-methods/seo";
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
} from "lucide-react";
import {
  PublicShell,
  Metadata,
  PublicLoading,
  PublicError,
  Sources,
} from "./shared";
import { publicRequest, type PublicMethod } from "./types";
import { AuthenticatedOnly } from "../PlatformLayout";
import "./catalog.css";

const methodBackground: Record<string, string> = {
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
    } | null>(null),
    [error, setError] = useState("");
  useEffect(() => {
    setData(null);
    setError("");
    const controller = new AbortController();
    publicRequest<{ method: PublicMethod; questionCount: number }>(
      `methods/${slug}`,
      undefined,
      "POST",
      controller.signal,
    )
      .then(setData)
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      });
    return () => controller.abort();
  }, [slug]);
  const [related, setRelated] = useState<PublicMethod[]>([]);
  useEffect(() => {
    const controller = new AbortController();
    publicRequest<PublicMethod[]>("methods", undefined, "GET", controller.signal)
      .then(setRelated).catch(() => {});
    return () => controller.abort();
  }, []);
  const m = data?.method;
  return (
    <PublicShell>
      <Metadata method={m} privatePage={Boolean(error)} />
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
              <h1>{m.title}</h1>
              <p className="td-intro">{m.intro}</p>
              <p className="td-method-background">
                <strong>{m.name} ({m.abbreviation}).</strong>{" "}
                {methodBackground[m.slug] ?? m.sections[0]?.text}
              </p>
              <a className="pm-text td-about-link" href="#about-test">
                Подробнее о тесте <ChevronDown size={17} />
              </a>
            </div>
            <aside className="td-test-passport" aria-label="Прохождение теста">
              <BookOpen size={25} strokeWidth={1.5} />
              <h2>{m.name}</h2>
              <p className="td-passport-version">{m.abbreviation} · Для взрослых, 18+</p>
              <div className="td-meta">
                <span><FileText size={18} />{data.questionCount} вопросов</span>
                <span><Clock3 size={18} />{m.minutes}</span>
              </div>
              <Link className="pm-button pm-primary" to={`/methods/${m.slug}/start/`}>
                Пройти тест <ArrowRight size={18} />
              </Link>
            </aside>
          </header>
          <div className="td-outcomes" aria-label="После прохождения">
            <div><ChartNoAxesCombined size={21} /><p><strong>Ваш результат</strong><span>Итоговые показатели с пояснениями</span></p></div>
            <div><BookOpen size={21} /><p><strong>Прозрачный подсчёт</strong><span>Объяснение, как складывается балл</span></p></div>
            <div><Download size={21} /><p><strong>Карточка на память</strong><span>Можно скачать и поделиться</span></p></div>
          </div>
          <div className="td-reading-layout">
            <nav className="td-contents" aria-label="На этой странице">
              <span>О тесте</span>
              <a href="#about-test">Что он измеряет</a>
              <a href="#before-test">Как отвечать</a>
              <a href="#test-details">Подсчёт и объяснение</a>
              <a href="#test-limits">Границы результата</a>
              <a href="#sources">Источники и версия</a>
            </nav>
            <div className="td-article">
              <section id="about-test">
                <h2>Что помогает понять этот тест</h2>
                <p>{m.sections[0]?.text}</p>
              </section>
              <section id="before-test" className="td-before">
                <h2>Как пройти тест</h2>
                <p>{m.instruction}</p>
                <p>{m.audience}</p>
              </section>
              <section id="test-details" className="td-details">
                <h2>Как устроена методика</h2>
                {m.sections.slice(1).map((section, i) => (
                  <details key={`${slug}-${i}`} open={i === 0}>
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
          {related.some(item => item.slug !== m.slug) && <section className="td-related">
            <h2>Другие психологические тесты</h2>
            <ul>{relatedMethods(related, m).map(item => (
              <li key={item.slug}><Link to={`/methods/${item.slug}/`}>{item.name}<ArrowRight size={17} /></Link></li>
            ))}</ul>
          </section>}
          <section className="td-finish">
            <div>
              <h2>Начните с нескольких минут для себя</h2>
              <p>
                {data.questionCount} вопросов · {m.minutes} · результат сразу
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
