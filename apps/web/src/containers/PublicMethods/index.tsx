import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Modal } from "antd";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  Leaf,
  LoaderCircle,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { PublicShell, Metadata, PublicLoading, PublicError, Sources } from "./shared";
import {
  publicRequest,
  rememberAssessment,
  savedAssessment,
  formatScore,
  type Assessment,
  type PublicMethod,
  type PublicResult,
} from "./types";
import { resultCard } from "./card";
import "./public-methods.css";

export { PublicMethods } from "./Catalog";
export { PublicMethodPage } from "./MethodPage";
export function PublicAssessment() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [method, setMethod] = useState<PublicMethod | null>(null),
    [assessment, setAssessment] = useState<Assessment | null>(null),
    [adult, setAdult] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setAssessment(null);
    setError("");
    publicRequest<{ method: PublicMethod }>(`methods/${slug}`)
      .then(async (data) => {
        if (!active) return;
        setMethod(data.method);
        const id = savedAssessment(data.method.slug);
        if (id) {
          try {
            const a = await publicRequest<Assessment>(`assessments/${id}`);
            if (active) setAssessment(a);
          } catch {
            rememberAssessment(data.method.slug);
          }
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);
  const start = async () => {
    if (!method || !adult) return;
    setBusy(true);
    setError("");
    try {
      const a = await publicRequest<Assessment>(
        `methods/${method.slug}/assessments`,
        { adult: true },
      );
      rememberAssessment(method.slug, a.id);
      setAssessment(a);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const move = async (direction: number) => {
    if (!assessment) return;
    setBusy(true);
    setError("");
    const finishing =
      direction === 1 &&
      assessment.position === assessment.definition.questions.length - 1;
    try {
      const a = await publicRequest<Assessment>(
        `assessments/${assessment.id}/${finishing ? "complete" : "save"}`,
        {
          answers: assessment.answers,
          position: finishing
            ? assessment.position
            : assessment.position + direction,
          revision: assessment.revision,
        },
      );
      setAssessment(a);
      if (finishing) navigate(`/assessment/result?id=${a.id}`);
      else document.querySelector<HTMLElement>(".pm-question-title")?.focus();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const choose = async (value: number) => {
    if (!assessment || busy) return;
    const answers = {
      ...assessment.answers,
      [assessment.definition.questions[assessment.position].code]: value,
    };
    setAssessment({ ...assessment, answers });
    setBusy(true);
    setError("");
    try {
      const a = await publicRequest<Assessment>(
        `assessments/${assessment.id}/save`,
        {
          answers,
          position: assessment.position,
          revision: assessment.revision,
        },
      );
      setAssessment(a);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  useEffect(() => {
    if (assessment && !assessment.result)
      document.querySelector<HTMLElement>(".pm-question-title")?.focus();
  }, [assessment?.id, assessment?.position]);
  const q = assessment?.definition.questions[assessment.position];
  return (
    <PublicShell>
      <Metadata method={method ?? undefined} privatePage />
      {loading ? (
        <PublicLoading />
      ) : !method ? (
        <PublicError message={error || "Методика не опубликована"} />
      ) : (
        <div className="pm-taking">
          <Link className="pm-text pm-back" to={`/methods/${method.slug}`}>
            <ArrowLeft size={16} />О методике
          </Link>
          {assessment?.result ? (
            <section className="pm-start">
              <h1>Вы уже прошли эту методику</h1>
              <p>
                Сохранённый результат доступен в этом браузере до{" "}
                {new Date(assessment.expiresAt).toLocaleDateString("ru-RU")}.
              </p>
              <Link
                className="pm-button pm-primary"
                to={`/assessment/result?id=${assessment.id}`}
              >
                Посмотреть результат <ArrowRight size={18} />
              </Link>
              <button
                className="pm-text"
                onClick={() => {
                  rememberAssessment(method.slug);
                  setAssessment(null);
                }}
              >
                Пройти ещё раз
              </button>
            </section>
          ) : !assessment ? (
            <section className="pm-start">
              <h1>{method.name}</h1>
              <p className="pm-lead">{method.instruction}</p>
              <p>{method.audience}</p>
              <div className="pm-note">
                <h2>Ваши ответы остаются личными</h2>
                <p>
                  Имя и почту не спрашиваем. Незавершённое прохождение хранится
                  до 7 дней, результат — до 30 дней. Доступ привязан к этому
                  браузеру. Вы сможете удалить данные самостоятельно.
                </p>
              </div>
              <label className="pm-consent">
                <input
                  type="checkbox"
                  checked={adult}
                  onChange={(e) => setAdult(e.target.checked)}
                />
                <span>
                  Мне исполнилось 18 лет. Я ознакомился(-ась) с условиями
                  хранения ответов и хочу пройти методику.
                </span>
              </label>
              <button
                className="pm-button pm-primary"
                disabled={!adult || busy}
                onClick={start}
              >
                {busy ? (
                  <LoaderCircle className="pm-spin" size={18} />
                ) : (
                  <ArrowRight size={18} />
                )}
                Начать
              </button>
            </section>
          ) : (
            q && (
              <section className="pm-question" aria-busy={busy}>
                <div className="pm-question-meta">
                  <span>{assessment.definition.method.abbreviation}</span>
                  <span>
                    Вопрос {assessment.position + 1} из{" "}
                    {assessment.definition.questions.length}
                  </span>
                </div>
                <progress
                  aria-label="Прогресс прохождения"
                  max={assessment.definition.questions.length}
                  value={assessment.position + 1}
                />
                <h1 className="pm-question-title" tabIndex={-1}>
                  {q.text}
                </h1>
                <fieldset disabled={busy}>
                  <legend className="pm-sr-only">Выберите один ответ</legend>
                  {q.options?.map((option) => (
                    <label
                      className={`pm-option ${assessment.answers[q.code] === Number(option.value) ? "is-selected" : ""}`}
                      key={option.value}
                    >
                      <input
                        type="radio"
                        name={q.code}
                        value={option.value}
                        checked={
                          assessment.answers[q.code] === Number(option.value)
                        }
                        onChange={() => void choose(Number(option.value))}
                      />
                      <span>{option.label}</span>
                      {assessment.answers[q.code] === Number(option.value) && (
                        <Check size={19} />
                      )}
                    </label>
                  ))}
                </fieldset>
                <div className="pm-question-controls">
                  <button
                    className="pm-button pm-soft"
                    disabled={busy || assessment.position === 0}
                    onClick={() => void move(-1)}
                  >
                    <ArrowLeft size={17} />
                    Назад
                  </button>
                  <span className="pm-save-state" role="status">
                    {busy
                      ? "Сохраняем…"
                      : error
                        ? "Не удалось сохранить"
                        : "Ответы сохраняются автоматически"}
                  </span>
                  <button
                    className="pm-button pm-primary"
                    disabled={
                      busy || !Object.hasOwn(assessment.answers, q.code)
                    }
                    onClick={() => void move(1)}
                  >
                    {busy && <LoaderCircle size={17} className="pm-spin" />}
                    {assessment.position ===
                    assessment.definition.questions.length - 1
                      ? "Посмотреть результат"
                      : "Далее"}
                    <ArrowRight size={17} />
                  </button>
                </div>
              </section>
            )
          )}
          {error && (
            <p className="pm-inline-error" role="alert">
              {error}{" "}
              {assessment && (
                <button
                  className="pm-text"
                  onClick={() => window.location.reload()}
                >
                  Загрузить сохранённые ответы
                </button>
              )}
            </p>
          )}
        </div>
      )}
    </PublicShell>
  );
}
export function PublicAssessmentResult() {
  const [params] = useSearchParams(),
    navigate = useNavigate();
  const id = params.get("id");
  const [a, setA] = useState<Assessment | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [preview, setPreview] = useState<{ url: string; blob: Blob } | null>(null),
    [confirmDelete, setConfirmDelete] = useState(false);
  useEffect(() => {
    setA(null);
    setError("");
    if (!id) {
      setError("В этом адресе нет сохранённого прохождения");
      return;
    }
    let active = true;
    publicRequest<Assessment>(`assessments/${id}`)
      .then((value) => {
        if (active) {
          if (!value.result) setError("Сначала завершите прохождение");
          else setA(value);
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [id]);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview.url);
    },
    [preview],
  );
  const openCard = async () => {
    if (!a?.result) return;
    setBusy(true);
    setError("");
    try {
      const blob = await resultCard(a.result);
      setPreview({ url: URL.createObjectURL(blob), blob });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const remove = async () => {
    if (!a) return;
    setBusy(true);
    try {
      await publicRequest(`assessments/${a.id}`, undefined, "DELETE");
      rememberAssessment(a.definition.method.slug);
      navigate(`/methods/${a.definition.method.slug}`);
    } catch (e) {
      setError((e as Error).message);
      setConfirmDelete(false);
    } finally {
      setBusy(false);
    }
  };
  const result = a?.result;
  return (
    <PublicShell>
      <Metadata privatePage />
      {!a ? (
        error ? (
          <PublicError message={error} />
        ) : (
          <PublicLoading />
        )
      ) : (
        result && (
          <>
            <Link
              className="pm-text pm-back"
              to={`/methods/${result.method.slug}`}
            >
              <ArrowLeft size={16} />О методике
            </Link>
            <section className="pm-result-layout">
              <div className="pm-result-paper">
                <div className="pm-result-top">
                  <Leaf size={24} />
                  <span>Ваш результат · {result.method.abbreviation}</span>
                </div>
                <h1>{result.method.name}</h1>
                <div className="pm-result-value">
                  <strong>{formatScore(result.scales[0].value)}</strong>
                  <span>из {result.scales[0].max}</span>
                </div>
                <h2>{result.scales[0].label}</h2>
                <ScaleProfile result={result} />
                <p className="pm-result-explanation">{result.explanation}</p>
              </div>
              <aside className="pm-result-aside">
                <h2>Сохраните для себя</h2>
                <p>
                  Вертикальная карточка с вашим результатом и логотипом
                  mindresearch. Без имени и ответов на отдельные вопросы.
                </p>
                <button
                  className="pm-button pm-primary"
                  disabled={busy}
                  onClick={() => void openCard()}
                >
                  {busy ? (
                    <LoaderCircle size={18} className="pm-spin" />
                  ) : (
                    <Download size={18} />
                  )}
                  Карточка результата
                </button>
                <p className="pm-secondary">
                  PNG · 1080 × 1920
                  <br />
                  Публикуйте только то, чем готовы поделиться.
                </p>
                <div className="pm-note">
                  <h3>Это не диагноз</h3>
                  <p>{result.method.limitations}</p>
                </div>
                <Link className="pm-text" to="/methods">
                  Посмотреть другие методики <ArrowRight size={17} />
                </Link>
              </aside>
            </section>
            {error && (
              <p role="alert" className="pm-inline-error">
                {error}
              </p>
            )}
            <div className="pm-result-details">
              <details>
                <summary>Как получен результат</summary>
                {result.method.sections
                  .filter((s) =>
                    /рассчиты|Подсчёт|Интерпретац|понимать|вердикт/.test(
                      s.title,
                    ),
                  )
                  .map((s) => (
                    <section key={s.title}>
                      <h3>{s.title}</h3>
                      <p>{s.text}</p>
                    </section>
                  ))}
                <p className="pm-secondary">
                  Сохранена версия {result.method.version}. Дата прохождения:{" "}
                  {new Date(result.completedAt).toLocaleDateString("ru-RU")}.
                  Результат не пересчитывается при обновлении страницы методики.
                </p>
              </details>
              <Sources method={result.method} />
              <div className="pm-private-data">
                <p>
                  Результат доступен в этом браузере до{" "}
                  {new Date(a.expiresAt).toLocaleDateString("ru-RU")}. Скачанная
                  карточка останется у вас после удаления данных.
                </p>
                <button
                  className="pm-text"
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash2 size={16} />
                  Удалить моё прохождение
                </button>
              </div>
            </div>
            <Modal
              title="Карточка результата"
              open={Boolean(preview)}
              onCancel={() => setPreview(null)}
              footer={null}
              width={430}
            >
              {preview && (
                <div className="pm-card-preview">
                  <img
                    src={preview.url}
                    alt="Предпросмотр карточки вашего результата"
                  />
                  <a
                    className="pm-download"
                    href={preview.url}
                    download={`mindresearch-${result.method.slug}.png`}
                  >
                    <Download size={18} />
                    Скачать PNG
                  </a>
                  <p>
                    Изображение создаётся в вашем браузере и не публикуется на
                    сайте.
                  </p>
                </div>
              )}
            </Modal>
            <Modal
              title="Удалить прохождение?"
              open={confirmDelete}
              onCancel={() => setConfirmDelete(false)}
              footer={null}
            >
              <p>
                Ответы и результат будут удалены. Восстановить их не получится.
              </p>
              <div className="pm-modal-actions">
                <button
                  className="pm-button pm-soft"
                  onClick={() => setConfirmDelete(false)}
                >
                  Отмена
                </button>
                <button
                  className="pm-button pm-primary"
                  disabled={busy}
                  onClick={() => void remove()}
                >
                  {busy && <LoaderCircle size={17} className="pm-spin" />}
                  Удалить
                </button>
              </div>
            </Modal>
          </>
        )
      )}
    </PublicShell>
  );
}
function ScaleProfile({ result }: { result: PublicResult }) {
  return (
    <div className="pm-scale-profile">
      {result.scales.map((s) => (
        <div className="pm-scale" key={s.label}>
          {result.scales.length > 1 && (
            <div className="pm-scale-label">
              <span>{s.label}</span>
              <strong>
                {formatScore(s.value)} / {s.max}
              </strong>
            </div>
          )}
          <div
            className="pm-scale-track"
            role="meter"
            aria-label={s.label}
            aria-valuemin={s.min}
            aria-valuemax={s.max}
            aria-valuenow={s.value}
          >
            <span
              style={{
                width: `${Math.max(0, Math.min(1, (s.value - s.min) / (s.max - s.min))) * 100}%`,
              }}
            />
          </div>
          <div className="pm-scale-ends">
            <span>{s.min}</span>
            <span>{s.max}</span>
          </div>
          <p>{s.explanation}</p>
        </div>
      ))}
    </div>
  );
}
