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
        <div className="method-document">
          <Link
            className="pm-text md-back"
            to={`/methods?topic=${encodeURIComponent(m.topic)}`}
          >
            <ArrowLeft size={16} />
            {m.topic}
          </Link>
          <header className="md-heading">
            <h1>{m.title}</h1>
            <p className="md-official-name">
              {m.name} · {m.abbreviation}
            </p>
          </header>
          <div className="md-layout">
            <div className="md-content">
              <p className="md-intro">{m.intro}</p>
              <section className="md-overview">
                <h2>Что измеряет методика</h2>
                <p>{m.sections[0]?.text}</p>
              </section>
              <section className="md-before">
                <h2>Перед началом</h2>
                <p>{m.instruction}</p>
                <p className="md-audience">{m.audience}</p>
              </section>
              <section className="md-reference" aria-labelledby="details-title">
                <h2 id="details-title">Разобраться подробнее</h2>
                {m.sections.slice(1).map((s, i) => (
                  <details key={`${slug}-${i}`}>
                    <summary>
                      {s.title}
                      <ChevronDown size={18} />
                    </summary>
                    <div>
                      <p>{s.text}</p>
                    </div>
                  </details>
                ))}
              </section>
              <section className="md-limits">
                <h2>О границах результата</h2>
                <p>{m.limitations}</p>
              </section>
              <Sources method={m} />
              <AuthenticatedOnly>
                <div className="md-for-research">
                  <h2>Используйте в своём исследовании</h2>
                  <p>
                    Добавьте методику в опрос и сравните её показатели с другими
                    данными.
                  </p>
                  <Link className="pm-text" to="/app/surveys/new">
                    Создать опрос <ArrowRight size={16} />
                  </Link>
                </div>
              </AuthenticatedOnly>
            </div>
            <aside className="md-start">
              <div className="md-start-main">
                <h2>Уделите себе несколько минут</h2>
                <dl>
                  <div>
                    <dt>
                      <FileText size={17} />
                      Вопросы
                    </dt>
                    <dd>{data.questionCount}</dd>
                  </div>
                  <div>
                    <dt>
                      <Clock3 size={17} />
                      Время
                    </dt>
                    <dd>{m.minutes}</dd>
                  </div>
                  <div>
                    <dt>Возраст</dt>
                    <dd>18+</dd>
                  </div>
                </dl>
                <Link
                  className="pm-button pm-primary"
                  to={`/methods/${m.slug}/start`}
                >
                  Пройти методику <ArrowRight size={18} />
                </Link>
                <p className="md-privacy">
                  <LockKeyhole size={15} />
                  Без регистрации, имени и почты
                </p>
              </div>
              <div className="md-result-list">
                <h3>После прохождения</h3>
                <ul>
                  {[
                    "Показатели и их объяснение",
                    "Подробности подсчёта",
                    "Карточка для сохранения",
                  ].map((text) => (
                    <li key={text}>
                      <Check size={16} />
                      {text}
                    </li>
                  ))}
                </ul>
                <p>
                  Результат виден только вам в этом браузере. Вы сами решаете,
                  чем делиться.
                </p>
              </div>
            </aside>
          </div>
          <div className="md-bottom">
            <Link className="pm-text" to="/methods">
              <ArrowLeft size={16} />
              Все методики
            </Link>
            <Link className="pm-button pm-soft" to={`/methods/${m.slug}/start`}>
              Начать прохождение <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      )}
    </PublicShell>
  );
}
