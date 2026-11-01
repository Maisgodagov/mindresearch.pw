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
  Share2,
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
      if (finishing) navigate(`/assessment/result/?id=${a.id}`);
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
          <Link className="pm-text pm-back" to={`/methods/${method.slug}/`}>
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
  const [cardError, setCardError] = useState("");
  const [shareNotice, setShareNotice] = useState("");
  useEffect(() => {
    if (!a?.result) return;
    let active = true;
    let url: string | undefined;
    setPreview(null);
    setCardError("");
    resultCard(a.result).then(blob => {
      if (!active) return;
      url = URL.createObjectURL(blob);
      setPreview({ url, blob });
    }).catch(e => { if (active) setCardError((e as Error).message); });
    return () => { active = false; if (url) URL.revokeObjectURL(url); };
  }, [a]);
  const shareCard = async () => {
    if (!preview || !a?.result) return;
    setBusy(true);
    setError("");
    setShareNotice("");
    const file = new File([preview.blob], `mindresearch-${a.result.method.slug}.png`, { type: "image/png" });
    const saveFile = () => {
      const link = document.createElement("a");
      link.href = preview.url;
      link.download = file.name;
      document.body.append(link);
      link.click();
      link.remove();
      setShareNotice("PNG-карточку можно прикрепить к сториз или сообщению.");
    };
    try {
      // Desktop Windows can advertise file sharing even when its share panel
      // has no working targets. Use the native sheet on touch devices only.
      const touchInterface = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
      if (touchInterface && navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] });
      } else {
        saveFile();
      }
    } catch (e) {
      // Cancelling the native sheet should not initiate an unwanted download.
      if ((e as Error).name !== "AbortError") {
        try { saveFile(); }
        catch { setError("Не удалось сохранить карточку. Попробуйте ещё раз."); }
      }
    } finally { setBusy(false); }
  };
  const remove = async () => {
    if (!a) return;
    setBusy(true);
    try {
      await publicRequest(`assessments/${a.id}`, undefined, "DELETE");
      rememberAssessment(a.definition.method.slug);
      navigate(`/methods/${a.definition.method.slug}/`);
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
              to={`/methods/${result.method.slug}/`}
            >
              <ArrowLeft size={16} />О методике
            </Link>
            <section className="pm-story-layout">
              <div className="pm-story-visual">
                {preview ? (
                  <img className="pm-story-image" src={preview.url} alt={`Карточка результата: ${result.method.name}. ${result.scales.map(scale => `${scale.label}: ${formatScore(scale.value)} из ${scale.max}`).join(". ")}`} />
                ) : cardError ? (
                  <p role="alert">{cardError}</p>
                ) : (
                  <div className="pm-story-skeleton" role="status" aria-label="Создаём карточку результата" />
                )}
                <div className="pm-story-share">
                  <button className="pm-button pm-primary" disabled={busy || !preview} onClick={() => void shareCard()}>
                    {busy ? <LoaderCircle size={18} className="pm-spin" /> : <Share2 size={18} />}
                    Поделиться
                  </button>
                  {shareNotice && <p role="status">{shareNotice}</p>}
                </div>
              </div>
              <div className="pm-story-description">
                <h1>Как понимать результат</h1>
                <p className="pm-story-method">{result.method.name}</p>
                <p className="pm-story-summary">{result.explanation}</p>
                <ResultInterpretation result={result} />
                <section className="pm-story-limits">
                  <h2>Что важно учитывать</h2>
                  <p>{result.method.limitations}</p>
                </section>
                <Link className="pm-text" to="/methods/">Другие тесты <ArrowRight size={17} /></Link>
              </div>
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
              <details>
                <summary>Источники и версия</summary>
                <Sources method={result.method} hideTitle />
              </details>
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
function ResultInterpretation({ result }: { result: PublicResult }) {
  const groups = new Map<string, string[]>();
  for (const scale of result.scales) {
    const explanation = scale.explanation.trim();
    if (!explanation || explanation === result.explanation.trim()) continue;
    groups.set(explanation, [...(groups.get(explanation) ?? []), scale.label]);
  }
  return (
    <div className="pm-story-interpretation">
      {[...groups].map(([explanation, labels]) => (
        <section key={explanation}>
          <h2>{labels.length === result.scales.length
            ? "Что говорят ваши ответы"
            : labels.join(" · ")}</h2>
          <p>{explanation}</p>
        </section>
      ))}
    </div>
  );
}
