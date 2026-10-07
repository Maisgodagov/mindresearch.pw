import { surveyDurationLabel } from "../../surveyDuration";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  Check,
  Cloud,
  CloudOff,
  Leaf,
} from "lucide-react";
import { api } from "../../api";
import { formatOptionLabel } from "../../utils/formatOptionLabel";
import type { Question, Survey } from "../../types";
import { Button, Page, Shell, SkeletonScreen } from "../../ui";
import { ResultsPage } from "../SurveyResults";
import { StockAvatar } from "../../components/StockAvatar";
import type { Resume, Value } from "./types";
import { useQuestionTiming } from "./useQuestionTiming";
import {
  Header,
  Welcome,
  Top,
  Bar,
  QuestionCard,
  Options,
  Choice,
  Input,
  MultipleHint,
  Closed,
  Nav,
} from "./styles";
export function SurveyPage() {
  const { slug = "anketa" } = useParams();
  const [survey, setSurvey] = useState<Survey>();
  const [unavailable, setUnavailable] = useState<"archived" | "error" | null>(
    null,
  );
  const [resume, setResume] = useState<Resume | null>(null);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Value>>({});
  const [token, setToken] = useState("");
  const [saving, setSaving] = useState(false);
  const [offline, setOffline] = useState(false);
  const [done, setDone] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const answering = useRef(false);
  const questionTiming = useQuestionTiming(token, survey?.questions[index]?.id, started && !done);
  useEffect(() => {
    let active = true;
    api
      .get(`/public/surveys/${slug}`)
      .then(async (r) => {
        if (!active) return;
        const loaded: Survey = r.data;
        setSurvey(loaded);
        const resultToken = sessionStorage.getItem(`survey_result_${slug}`);
        if (resultToken) {
          setToken(resultToken);
          setDone(true);
          return;
        }
        const key = `survey_session_${slug}`,
          savedToken = localStorage.getItem(key);
        if (!savedToken) return;
        try {
          const session = await api.get(`/public/sessions/${savedToken}`);
          if (session.data.status === "completed") {
            localStorage.removeItem(key);
            sessionStorage.setItem(`survey_result_${slug}`, savedToken);
            setToken(savedToken);
            setDone(true);
            return;
          }
          const savedAnswers = Object.fromEntries(
            session.data.answers.map(
              (a: { questionId: string; value: Value }) => [
                a.questionId,
                a.value,
              ],
            ),
          );
          const restored = Object.fromEntries(
            loaded.questions.flatMap((question, questionIndex) =>
              Object.prototype.hasOwnProperty.call(savedAnswers, question.id)
                ? [[String(questionIndex), savedAnswers[question.id]]]
                : [],
            ),
          );
          if (active)
            setResume({
              token: savedToken,
              position: Math.min(
                session.data.currentPosition ?? 0,
                loaded.questions.length - 1,
              ),
              answers: restored,
              answered: session.data.answers.length,
            });
        } catch {
          localStorage.removeItem(key);
        }
      })
      .catch((error) => {
        if (active)
          setUnavailable(error.response?.status === 410 ? "archived" : "error");
      });
    return () => {
      active = false;
    };
  }, [slug]);
  async function start() {
    if (resume) {
      setToken(resume.token);
      setIndex(resume.position);
      setAnswers(resume.answers);
      setStarted(true);
      return;
    }
    const r = await api.post(`/public/surveys/${slug}/sessions`);
    localStorage.setItem(`survey_session_${slug}`, r.data.token);
    setToken(r.data.token);
    setStarted(true);
  }
  async function save(q: Question, value: Value, pos = index, timing?: { visitId: string; activeMs: number; visitSequence?: number }) {
    if (!token) return false;
    setSaving(true);
    setOffline(false);
    try {
      await api.put(`/public/sessions/${token}/answers`, {
        questionId: q.id,
        value,
        position: pos,
        timing,
      });
      return true;
    } catch {
      setOffline(true);
      return false;
    } finally {
      setSaving(false);
    }
  }
  function choose(q: Question, value: Value) {
    setAnswers((a) => ({ ...a, [String(index)]: value }));
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => save(q, value), 250);
  }
  async function chooseSingle(q: Question, value: string) {
    if (answering.current) return;
    answering.current = true;
    setAnswers((a) => ({ ...a, [String(index)]: value }));
    if (!(await save(q, value, index, questionTiming.stop()))) {
      questionTiming.resume();
      answering.current = false;
      return;
    }
    await new Promise((r) => setTimeout(r, 320));
    setTransitioning(true);
    await new Promise((r) => setTimeout(r, 180));
    await next(true);
    setTransitioning(false);
    answering.current = false;
  }
  async function next(alreadySaved = false) {
    if (!survey) return;
    window.clearTimeout(timer.current);
    if (!alreadySaved) {
      const question = survey.questions[index];
      const answer = answers[String(index)];
      if (answer !== undefined && !(await save(question, answer, index, questionTiming.stop()))) {
        questionTiming.resume(); return;
      }
    }
    if (index === survey.questions.length - 1) {
      try { await api.post(`/public/sessions/${token}/complete`); }
      catch { setOffline(true); questionTiming.resume(); return; }
      localStorage.removeItem(`survey_session_${slug}`);
      sessionStorage.setItem(`survey_result_${slug}`, token);
      setDone(true);
    } else setIndex((i) => i + 1);
    questionTiming.finish();
  }
  async function previous() {
    if (answering.current) return;
    window.clearTimeout(timer.current);
    const question = survey?.questions[index], answer = answers[String(index)];
    if (question && answer !== undefined) {
      if (!(await save(question, answer, index - 1, questionTiming.stop()))) { questionTiming.resume(); return; }
      questionTiming.finish();
    }
    setIndex((i) => i - 1);
  }
  const q = survey?.questions[index],
    value = q ? answers[String(index)] : undefined;
  const valid = useMemo(
    () =>
      value !== undefined &&
      value !== "" &&
      (!Array.isArray(value) || value.length > 0),
    [value],
  );
  if (unavailable)
    return (
      <Page>
        <Shell>
          <Header>
            <Leaf /> mindresearch
          </Header>
          <Closed>
            <div className="icon">
              <Archive size={25} />
            </div>
            <h1>
              {unavailable === "archived"
                ? "Исследование завершено"
                : "Опрос недоступен"}
            </h1>
            <p>
              {unavailable === "archived"
                ? "Автор завершил сбор ответов. Спасибо за интерес к исследованию."
                : "Возможно, ссылка указана неверно или опрос больше недоступен."}
            </p>
          </Closed>
        </Shell>
      </Page>
    );
  if (!survey)
    return (
      <Page>
        <Shell>
          <Header>
            <Leaf /> mindresearch
          </Header>
          <SkeletonScreen variant="public" />
        </Shell>
      </Page>
    );
  if (done) return <ResultsPage token={token} />;
  if (!started)
    return (
      <Page>
        <Shell>
          <Header>
            <Leaf /> mindresearch
          </Header>
          <Welcome>
            <span>Анонимное исследование</span>
            <h1>{survey.welcomeTitle}</h1>
            <p>{survey.welcomeText}</p>
            {survey.author && (
              <a className="author" href={`/p/${survey.author.slug}`}>
                <StockAvatar seed={survey.author.avatarSeed} alt="" />
                Автор: {survey.author.name}
              </a>
            )}
            <div className="meta">
              {resume ? (
                <>
                  <span>
                    Сохранено {resume.answered} из {survey.questions.length}
                  </span>
                  <span>
                    Пройдено{" "}
                    {Math.round(
                      (resume.answered / survey.questions.length) * 100,
                    )}
                    %
                  </span>
                </>
              ) : (
                <>
                  <span>{survey.questions.length} вопросов</span>
                  <span>≈ {surveyDurationLabel(survey.questions.length, survey.settings?.estimatedDuration)}</span>
                </>
              )}
              <span>Можно прерваться</span>
            </div>
            <Button type="primary" size="large" onClick={start}>
              {resume ? "Продолжить" : "Начать"} <ArrowRight size={18} />
            </Button>
          </Welcome>
        </Shell>
      </Page>
    );
  return (
    <Page>
      <Shell>
        <Top>
          <Header>
            <Leaf /> mindresearch
          </Header>
          <div className="save-line">
            <span className="save">
              {offline ? (
                <>
                  <CloudOff size={14} /> Повторим сохранение
                </>
              ) : (
                <>
                  <Cloud size={14} />
                  {saving ? "Сохраняем…" : "Сохранено"}
                </>
              )}
            </span>
          </div>
          <Bar>
            <i
              style={{
                width: `${((index + 1) / survey.questions.length) * 100}%`,
              }}
            />
          </Bar>
        </Top>
        {q && (
          <QuestionCard $leaving={transitioning}>
            <span className="eyebrow">
              Вопрос {index + 1} из {survey.questions.length}
            </span>
            <div className="question">{q.text}</div>
            {q.type === "multiple" && (
              <MultipleHint>Можно выбрать несколько вариантов</MultipleHint>
            )}
            {(q.type === "single" || q.type === "multiple") && (
              <Options>
                {q.options?.map((o) => {
                  const active =
                    q.type === "multiple"
                      ? Array.isArray(value) && value.includes(o.value)
                      : value === o.value;
                  return (
                    <Choice
                      key={`${index}-${o.value}`}
                      $active={active}
                      disabled={transitioning}
                      onClick={() =>
                        q.type === "single"
                          ? chooseSingle(q, o.value)
                          : choose(
                              q,
                              active
                                ? (value as string[]).filter(
                                    (x) => x !== o.value,
                                  )
                                : [...((value as string[]) ?? []), o.value],
                            )
                      }
                    >
                      {q.type === "multiple" && (
                        <span className="dot checkbox">
                          {active && <Check size={14} />}
                        </span>
                      )}
                      {formatOptionLabel(o.label, o.value)}
                    </Choice>
                  );
                })}
              </Options>
            )}
            {(q.type === "text" || q.type === "number") && (
              <Input
                autoFocus
                type={q.type}
                value={(value as string | number) ?? ""}
                min={q.validation?.min}
                max={q.validation?.max}
                placeholder="Ваш ответ"
                onChange={(e) =>
                  choose(
                    q,
                    q.type === "number"
                      ? Number(e.target.value)
                      : e.target.value,
                  )
                }
              />
            )}
            <Nav>
              <Button
                aria-label="Назад"
                disabled={index === 0 || saving || transitioning}
                onClick={previous}
                style={{
                  background: "transparent",
                  color: "#526f5b",
                  padding: "12px",
                }}
              >
                <ArrowLeft />
              </Button>
              {q.type !== "single" && (
                <Button
                  type="primary"
                  disabled={!valid || saving}
                  onClick={() => next()}
                >
                  {index === survey.questions.length - 1
                    ? "Завершить"
                    : "Готово"}{" "}
                  <ArrowRight size={18} />
                </Button>
              )}
            </Nav>
          </QuestionCard>
        )}
      </Shell>
    </Page>
  );
}
