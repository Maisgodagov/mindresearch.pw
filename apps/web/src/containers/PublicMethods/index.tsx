import { trackPublicLifecycle } from "../../publicAnalytics";
import { useEffect, useRef, useState, type ReactNode } from "react";
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
  Share2,
  LoaderCircle,
  RotateCcw,
  Trash2,
  Leaf,
  Cloud,
  CloudOff,
} from "lucide-react";
import { Page, Shell, Button } from "../../ui";
import { Top, Header, Bar, QuestionCard, Options, Choice, Nav } from "../SurveyTaking/styles";
import { AnchoredRating, isAnchoredRating } from "../../components/AnchoredRating";
import { formatOptionLabel } from "../../utils/formatOptionLabel";
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
import { resultReading } from "./resultInterpretation";
import { cardChoices, characterAtlases, characterColumns, characters, type Character } from "./cardScenes";
import "./public-methods.css";
import "./respondent.css";

function RespondentFrame({ children }: { children: ReactNode }) {
  return <Page><Shell className="public-assessment-respondent">{children}</Shell></Page>;
}
function answerPause(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const abort = () => { window.clearTimeout(timer); reject(new DOMException("Cancelled", "AbortError")); };
    const timer = window.setTimeout(() => { signal.removeEventListener("abort", abort); resolve(); }, ms);
    signal.addEventListener("abort", abort, { once: true });
    if (signal.aborted) abort();
  });
}

export { PublicMethods } from "./Catalog";
export { PublicMethodPage } from "./MethodPage";
export function PublicAssessment() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const operation = useRef<AbortController | null>(null);
  const [transitioning, setTransitioning] = useState(false);
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
    setBusy(false);
    setTransitioning(false);
    setAdult(false);
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
      operation.current?.abort();
      operation.current = null;
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
      trackPublicLifecycle("test.started");
      rememberAssessment(method.slug, a.id);
      setAssessment(a);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const move = async (direction: number) => {
    if (!assessment || busy || operation.current) return;
    const controller = new AbortController();
    operation.current = controller;
    setBusy(true);
    setError("");
    try {
      const a = await publicRequest<Assessment>(
        `assessments/${assessment.id}/save`,
        {
          answers: assessment.answers,
          position: assessment.position + direction,
          revision: assessment.revision,
        }, "POST", controller.signal,
      );
      setAssessment(a);
    } catch (e) {
      if (!controller.signal.aborted) setError((e as Error).message);
    } finally {
      if (operation.current === controller) operation.current = null;
      if (!controller.signal.aborted) setBusy(false);
    }
  };
  const choose = async (value: number) => {
    if (!assessment || busy || operation.current) return;
    const controller = new AbortController();
    operation.current = controller;
    const finishing = assessment.position === assessment.definition.questions.length - 1;
    const answers = {
      ...assessment.answers,
      [assessment.definition.questions[assessment.position].code]: value,
    };
    setAssessment({ ...assessment, answers });
    setBusy(true);
    setError("");
    try {
      const a = await publicRequest<Assessment>(
        `assessments/${assessment.id}/${finishing ? "complete" : "save"}`,
        {
          answers,
          position: finishing ? assessment.position : assessment.position + 1,
          revision: assessment.revision,
        }, "POST", controller.signal,
      );
      if (finishing && a.result) trackPublicLifecycle("test.completed");
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      await answerPause(reducedMotion ? 0 : 320, controller.signal);
      setTransitioning(true);
      await answerPause(reducedMotion ? 0 : 180, controller.signal);
      setAssessment(a);
      if (finishing) navigate(`/assessment/result/?id=${a.id}`);
    } catch (e) {
      if (!controller.signal.aborted) setError((e as Error).message);
    } finally {
      if (operation.current === controller) operation.current = null;
      if (!controller.signal.aborted) { setBusy(false); setTransitioning(false); }
    }
  };
  useEffect(() => {
    if (assessment && !assessment.result)
      document.querySelector<HTMLElement>(".pm-question-title")?.focus();
  }, [assessment?.id, assessment?.position]);
  const q = assessment?.definition.questions[assessment.position];
  const answering = Boolean(assessment && !assessment.result);
  const Frame = answering ? RespondentFrame : PublicShell;
  return (
    <Frame>
      <Metadata method={method ?? undefined} privatePage />
      {loading ? (
        <PublicLoading />
      ) : !method ? (
        <PublicError message={error || "Методика не опубликована"} />
      ) : (
        <div className="pm-taking">
          {!answering && <Link className="pm-text pm-back" to={`/methods/${method.slug}/`}>
            <ArrowLeft size={16} />О методике
          </Link>}
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
                data-analytics="test.start"
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
              <>
                <Top>
                  <Header><Leaf aria-hidden="true" /><span>mindresearch</span></Header>
                  <div className="save-line"><span className="save" role="status">{error ? <><CloudOff size={14} aria-hidden="true" />Не удалось сохранить</> : <><Cloud size={14} aria-hidden="true" />{busy ? "Сохраняем…" : "Сохранено"}</>}</span></div>
                  <Bar role="progressbar" aria-label="Прогресс прохождения" aria-valuemin={0} aria-valuemax={assessment.definition.questions.length} aria-valuenow={assessment.position + 1}><i style={{width: `${(assessment.position + 1) / assessment.definition.questions.length * 100}%`}} /></Bar>
                </Top>
                <QuestionCard $leaving={transitioning} className="respondent-question" aria-busy={busy}>
                <span className="eyebrow">Вопрос {assessment.position + 1} из {assessment.definition.questions.length}</span>
                <h1 id="public-question" className="question pm-question-title" tabIndex={-1}>
                  {q.text}
                </h1>
                {isAnchoredRating("single", q.options) ? <AnchoredRating key={q.code} options={q.options!} value={assessment.answers[q.code] === undefined ? undefined : String(assessment.answers[q.code])} disabled={transitioning} onChange={value => void choose(Number(value))} /> : <Options role="group" aria-labelledby="public-question">
                  {q.options?.map((option) => (
                    <Choice
                      className="respondent-option"
                      key={`${q.code}:${option.value}`}
                      $active={assessment.answers[q.code] === Number(option.value)}
                      aria-pressed={assessment.answers[q.code] === Number(option.value)}
                      disabled={transitioning}
                      onClick={() => void choose(Number(option.value))}
                    >
                      <span className="option-label">{formatOptionLabel(option.label, option.value)}</span>
                    </Choice>
                  ))}
                </Options>}
                <Nav>
                  <Button
                    aria-label="Назад"
                    disabled={busy || transitioning || assessment.position === 0}
                    onClick={() => void move(-1)}
                    style={{background: "transparent", color: "var(--color-text-526f5b)", padding: "12px"}}
                  >
                    <ArrowLeft size={17} />
                  </Button>
                </Nav>
                </QuestionCard>
                <Link className="respondent-about" to={`/methods/${method.slug}/`}><ArrowLeft size={16} aria-hidden="true" />О методике</Link>
              </>
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
    </Frame>
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
  const [sceneIndex, setSceneIndex] = useState(0);
  const [character, setCharacter] = useState<Character | null>(null);
  const [personIndex, setPersonIndex] = useState({ woman: 0, man: 0 });
  const [cardRetry, setCardRetry] = useState(0);
  const choices = a?.result ? cardChoices(a.result, a.id) : null;
  const location = choices?.locations[sceneIndex] ?? choices?.locations[0];
  const selectedCharacter = character ?? choices?.character ?? "none";
  const availablePeople = selectedCharacter === "none" ? [] : choices?.people[selectedCharacter] ?? [];
  const person = selectedCharacter === "none" ? 0 : availablePeople[personIndex[selectedCharacter]] ?? 0;
  const [cardError, setCardError] = useState("");
  const [shareNotice, setShareNotice] = useState("");
  useEffect(() => {
    if (!a?.result || !location || !choices) return;
    let active = true;
    let url: string | undefined;
    setPreview(null);
    setCardError("");
    resultCard(a.result, {character: selectedCharacter, layout: "tiles", art:{row:location.row, column:location.column, person, personRow:choices.row}}).then(blob => {
      if (!active) return;
      url = URL.createObjectURL(blob);
      setPreview({ url, blob });
    }).catch(e => { if (active) setCardError((e as Error).message); });
    return () => { active = false; if (url) URL.revokeObjectURL(url); };
  }, [a, location?.row, location?.column, choices?.row, selectedCharacter, person, cardRetry]);
  function recoverPreview(failed: NonNullable<typeof preview>) {
    if (!failed.url.startsWith("blob:")) return setCardError("Не удалось показать карточку");
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result;
      if (typeof url === "string") setPreview(current => current === failed ? { ...failed, url } : current);
    };
    reader.onerror = () => setCardError("Не удалось показать карточку");
    reader.readAsDataURL(failed.blob);
  }
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
                {cardError ? (
                  <div><p role="alert">{cardError}</p><button type="button" className="pm-button" onClick={() => setCardRetry(value=>value+1)}>Создать карточку заново</button></div>
                ) : preview ? (
                  <img className="pm-story-image" src={preview.url} onError={() => recoverPreview(preview)} alt={`Карточка результата: ${result.method.name}. ${result.scales.map(scale => `${scale.label}: ${formatScore(scale.value)} из ${scale.max}`).join(". ")}`} />
                ) : (
                  <div className="pm-story-skeleton" role="status" aria-label="Создаём карточку результата" />
                )}
                {choices && location && <details className="pm-card-settings">
                  <summary>Настроить карточку</summary>
                  <div className="pm-card-controls">
                  <fieldset>
                    <legend>Сцена</legend>
                    <div className="pm-card-options pm-card-scenes">
                      {choices.locations.map(({ label, row, column }, index) => (
                        <label key={label} title={label}>
                          <input type="radio" name="card-scene" aria-label={label} checked={sceneIndex === index}
                            onChange={() => setSceneIndex(index)} />
                          <span className="pm-card-thumbnail" aria-hidden="true" style={{
                            backgroundImage: 'url("/images/result-cards/scenes-atlas.webp")',
                            backgroundPosition: `${column * 25}% ${row * 50}%`,
                          }} />
                        </label>
                      ))}
                    </div>
                    <span className="pm-card-scene-name">{location.label}</span>
                  </fieldset>
                  <fieldset>
                    <legend>Персонаж</legend>
                    <div className="pm-card-character-types">
                      {(["woman", "man", "none"] as const).map(value => (
                        <label key={value}>
                          <input type="radio" name="card-character-type" checked={selectedCharacter === value}
                            onChange={() => setCharacter(value)} />
                          <span>{characters[value]}</span>
                        </label>
                      ))}
                    </div>
                    {selectedCharacter !== "none" && (
                      <div className="pm-card-options pm-card-portraits">
                        {availablePeople.map((portrait, index) => (
                          <label key={portrait}>
                            <input type="radio" name="card-portrait" aria-label={`Персонаж ${index + 1}`}
                              checked={person === portrait}
                              onChange={() => setPersonIndex(current => ({ ...current, [selectedCharacter]: index }))} />
                            <span className="pm-card-thumbnail" aria-hidden="true" style={{
                              backgroundImage: `url("/images/result-cards/${selectedCharacter}-${characterAtlases[Math.floor(portrait / characterColumns)]}.webp")`,
                              backgroundPosition: `${(portrait % characterColumns) * 25}% ${choices.row * 50}%`,
                            }} />
                          </label>
                        ))}
                      </div>
                    )}
                  </fieldset>
                  </div>
                </details>}
                <div className="pm-story-share">
                  <button className="pm-button pm-primary" data-analytics="test.share" disabled={busy || !preview} onClick={() => void shareCard()}>
                    {busy ? <LoaderCircle size={18} className="pm-spin" /> : <Share2 size={18} />}
                    Поделиться
                  </button>
                  {shareNotice && <p role="status">{shareNotice}</p>}
                </div>
              </div>
              <div className="pm-story-description">
                <h1>Как понимать результат</h1>
                <p className="pm-story-method">{result.method.name}</p>
                <p className="pm-story-summary">{resultReading(result).detail}</p>
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
