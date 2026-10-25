import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  FileText,
  LockKeyhole,
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
  const m = data?.method;
  return (
    <PublicShell>
      <Metadata method={m} />
      {error ? (
        <PublicError message={error} />
      ) : !m || !data ? (
        <PublicLoading />
      ) : (
        <div className="test-document">
          <nav className="td-breadcrumb" aria-label="Навигация">
            <Link to="/methods">
              <ArrowLeft size={16} />
              Все тесты
            </Link>
            <span>{m.topic}</span>
          </nav>
          <header className="td-hero">
            <div className="td-hero-copy">
              <h1>{m.title}</h1>
              <p className="td-intro">{m.intro}</p>
              <p className="td-official">
                Методика: {m.name} · {m.abbreviation}
              </p>
              <div className="td-meta">
                <span>
                  <FileText size={17} />
                  {data.questionCount} вопросов
                </span>
                <span>
                  <Clock3 size={17} />
                  {m.minutes}
                </span>
                <span>Для взрослых · 18+</span>
              </div>
              <div className="td-actions">
                <Link
                  className="pm-button pm-primary"
                  to={`/methods/${m.slug}/start`}
                >
                  Пройти тест <ArrowRight size={18} />
                </Link>
                <a className="pm-text" href="#about-test">
                  Сначала о тесте <ChevronDown size={17} />
                </a>
              </div>
              <p className="td-privacy">
                <LockKeyhole size={15} />
                Без регистрации. Имя и почта не нужны.
              </p>
            </div>
            <aside className="td-result-preview">
              <h2>Что вы получите</h2>
              <p>Не просто число — результат, в котором можно разобраться.</p>
              <ul>
                {[
                  [
                    "Ваши показатели",
                    "Итоговые баллы по методике с пояснениями к результату.",
                  ],
                  [
                    "Понятный расчёт",
                    "Как из ваших ответов складывается итоговый показатель.",
                  ],
                  [
                    "Карточку результата",
                    "Сохраните её для себя или поделитесь, если захотите.",
                  ],
                ].map(([title, text]) => (
                  <li key={title}>
                    <Check size={18} />
                    <div>
                      <h3>{title}</h3>
                      <p>{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="td-result-note">
                Тест помогает исследовать свой опыт. Он не оценивает вашу
                личность и не ставит диагноз.
              </p>
            </aside>
          </header>
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
              to={`/methods/${m.slug}/start`}
            >
              Пройти тест <ArrowRight size={18} />
            </Link>
          </section>
        </div>
      )}
    </PublicShell>
  );
}
