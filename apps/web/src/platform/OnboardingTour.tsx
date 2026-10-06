import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { api, getCurrentUser } from "../api";
import { Button } from "../ui";

type Step = {
  path: string;
  target: string;
  title: string;
  body: string;
  onTargetClick?: string;
  advanceEvent?: string;
  onEnterEvent?: string;
  conditionalSave?: boolean;
  capturePath?: "results";
};
type Rect = { top: number; left: number; width: number; height: number };
type CardPosition = { top: number; left: number };
type TourRect = Rect & { focused?: boolean };

const steps: Step[] = [
  { path: "/app", target: '[data-onboarding="create-survey"]', onTargetClick: '[data-onboarding="create-survey"]', title: "Создайте", body: "Нажмите «Новый опрос», чтобы перейти к настройке" },
  { path: "/app/surveys/new", target: '[data-onboarding="survey-settings"]', onEnterEvent: "mindresearch:onboarding-fill-settings-example", title: "Настройте опрос", body: "Задайте название и описание. Черновик сохраняется автоматически." },
  { path: "/app/surveys/new", target: '[data-onboarding="methodology"]', onTargetClick: '[data-onboarding="methodology"]', title: "Выберите методику", body: "Нажмите «Выбрать методику», чтобы открыть каталог проверенных методик" },
  { path: "/app/surveys/new", target: '[data-onboarding="catalog-categories"]', advanceEvent: "mindresearch:onboarding-methodology-added", title: "Найдите методику по категории", body: "В каталоге можно отфильтровать методики по категориям. Выберите подходящее направление, затем нажмите «Добавить в опрос» у нужной методики." },
  { path: "/app/surveys/new", target: '[data-onboarding="added-methodology"]', title: "\u041c\u0435\u0442\u043e\u0434\u0438\u043a\u0430 \u0434\u043e\u0431\u0430\u0432\u043b\u0435\u043d\u0430", body: "\u041c\u0435\u0442\u043e\u0434\u0438\u043a\u0430 \u0443\u0436\u0435 \u0432 \u043e\u043f\u0440\u043e\u0441\u0435. \u0417\u0434\u0435\u0441\u044c \u043c\u043e\u0436\u043d\u043e \u043e\u0437\u043d\u0430\u043a\u043e\u043c\u0438\u0442\u044c\u0441\u044f \u0441 \u0435\u0451 \u0441\u043e\u0434\u0435\u0440\u0436\u0430\u043d\u0438\u0435\u043c. \u0417\u0430\u0442\u0435\u043c \u043c\u043e\u0436\u043d\u043e \u0434\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0441\u043e\u0431\u0441\u0442\u0432\u0435\u043d\u043d\u044b\u0439 \u0442\u0435\u0441\u0442." },
  { path: "/app/surveys/new", target: '[data-onboarding="custom-test"]', onTargetClick: '[data-onboarding="custom-test"]', title: "Создайте свой тест", body: "Нажмите «Создать тест», чтобы добавить собственный блок вопросов." },
  { path: "/app/surveys/new", target: '[data-onboarding="custom-test-block"]', onEnterEvent: "mindresearch:onboarding-fill-question-example", title: "\u0412\u0430\u0448 \u0441\u043e\u0431\u0441\u0442\u0432\u0435\u043d\u043d\u044b\u0439 \u0431\u043b\u043e\u043a", body: "\u0412 \u0431\u043b\u043e\u043a\u0435 \u0443\u0436\u0435 \u0435\u0441\u0442\u044c \u043f\u0440\u0438\u043c\u0435\u0440 \u0432\u043e\u043f\u0440\u043e\u0441\u0430 \u0438 \u0432\u0430\u0440\u0438\u0430\u043d\u0442\u043e\u0432 \u043e\u0442\u0432\u0435\u0442\u0430. \u041c\u043e\u0436\u043d\u043e \u0438\u0445 \u0438\u0437\u043c\u0435\u043d\u0438\u0442\u044c \u0438\u043b\u0438 \u043f\u0435\u0440\u0435\u0439\u0442\u0438 \u043a \u0441\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u0438\u044e." },
  { path: "/app/surveys/new", target: '[data-onboarding="save-survey"]', advanceEvent: "mindresearch:onboarding-survey-saved", conditionalSave: true, title: "\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u0435 \u043e\u043f\u0440\u043e\u0441", body: "\u041d\u0430\u0436\u043c\u0438\u0442\u0435 \u00ab\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c \u043e\u043f\u0440\u043e\u0441\u00bb. \u0415\u0441\u043b\u0438 \u043e\u043f\u0440\u043e\u0441 \u043e\u0441\u0442\u0430\u043d\u0435\u0442\u0441\u044f \u0447\u0435\u0440\u043d\u043e\u0432\u0438\u043a\u043e\u043c, \u043f\u043e\u043a\u0430\u0436\u0443, \u043a\u0430\u043a \u0435\u0433\u043e \u043e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u0442\u044c." },
  { path: "/app", target: '[data-onboarding="survey-publish"][data-survey-id="__survey_id__"]', advanceEvent: "mindresearch:onboarding-survey-published", title: "\u041e\u043f\u0443\u0431\u043b\u0438\u043a\u0443\u0439\u0442\u0435 \u043e\u043f\u0440\u043e\u0441", body: "\u041d\u0430\u0436\u043c\u0438\u0442\u0435 \u00ab\u041e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u0442\u044c\u00bb, \u0447\u0442\u043e\u0431\u044b \u0441\u0434\u0435\u043b\u0430\u0442\u044c \u043e\u043f\u0440\u043e\u0441 \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u044b\u043c \u0434\u043b\u044f \u0443\u0447\u0430\u0441\u0442\u043d\u0438\u043a\u043e\u0432." },
  { path: "/app", target: '[data-onboarding="survey-copy-link"][data-survey-id="__survey_id__"]', advanceEvent: "mindresearch:onboarding-link-copied", title: "Скопируйте ссылку", body: "Нажмите «Скопировать ссылку», чтобы отправить опрос участникам" },
  { path: "/app", target: '[data-onboarding="survey-statistics"][data-survey-id="__survey_id__"]', onTargetClick: '[data-onboarding="survey-statistics"][data-survey-id="__survey_id__"]', capturePath: "results", title: "Откройте статистику", body: "Нажмите «Статистика», чтобы посмотреть прохождения и ответы респондентов" },
  { path: "$results", target: '[data-onboarding="survey-results"]', title: "Изучите результаты", body: "Здесь отображаются ответы респондентов и распределение ответов по вопросам" },
];

const Spotlight = styled.div<{ $rect: TourRect }>`
  position: fixed; z-index: 1000; pointer-events: none; border: 2px solid #91b08a;
  border-radius: 12px;
  box-shadow: 0 0 0 4px rgba(145,176,138,.18), 0 0 0 100vmax rgba(17,31,22,.52);
  top: ${({ $rect }) => $rect.top - 5}px; left: ${({ $rect }) => $rect.left - 5}px;
  width: ${({ $rect }) => $rect.width + 10}px; height: ${({ $rect }) => $rect.height + 10}px;
`;
const Card = styled.section<{ $position: CardPosition }>`
  position: fixed; z-index: 1002; top: ${({ $position }) => $position.top}px; left: ${({ $position }) => $position.left}px;
  width: min(360px, calc(100vw - 32px)); padding: 20px; border: 1px solid #d9e2d8;
  border-radius: 16px; background: #fff; color: #26392d; box-shadow: 0 16px 48px rgba(15,30,19,.2);
  h2 { margin: 0 0 8px; font: 700 19px/1.3 Manrope Variable, sans-serif; }
  p { margin: 0; color: #5f7064; font: 400 14px/1.55 Manrope Variable, sans-serif; }
  .progress { height: 3px; margin: 0 0 16px; overflow: hidden; border-radius: 5px; background: #edf2eb; }
  .progress span { display: block; height: 100%; background: #55764f; }
  .meta { margin-top: 14px; color: #718076; font-size: 12px; }
  .error { margin-top: 10px; color: #a5433b; font-size: 12px; }
  .controls { display: flex; align-items: center; gap: 8px; margin-top: 18px; }
  .controls .skip { margin-right: auto; }
  @media (max-width: 600px) { padding: 16px; h2 { font-size: 17px; } p { font-size: 13px; } }
`;

export function OnboardingTour({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "not_started" | "completed" | "skipped" | "error">("loading");
  const [active, setActive] = useState(false);
  const [promptVisible, setPromptVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<TourRect | null>(null);
  const [targetFound, setTargetFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [resultsPath, setResultsPath] = useState("/app");
  const [onboardingSurveyId, setOnboardingSurveyId] = useState("");
  const [userId, setUserId] = useState("");
  const enteredStep = useRef(-1);
  const progressKey = userId ? `mindresearch:onboarding-progress:${userId}` : "";
  const targetSelector = (selector: string) => selector.replace("__survey_id__", CSS.escape(onboardingSurveyId));
  const routeForStep = (candidate: Step) => candidate.path === "$results"
    ? resultsPath
    : candidate.path === "/app/surveys/new" && onboardingSurveyId
      ? `/app/surveys/${onboardingSurveyId}/edit`
      : candidate.path;
  const step = steps[index];
  const inPlatform = location.pathname.startsWith("/app");

  const loadOnboardingStatus = useCallback(() => {
    getCurrentUser().then(user => {
      const nextStatus = user.onboardingStatus ?? "not_started";
      enteredStep.current = -1;
      setUserId(user.id);
      if (nextStatus === "not_started") {
        try {
          const saved = sessionStorage.getItem(`mindresearch:onboarding-progress:${user.id}`);
          if (saved) {
            const progress = JSON.parse(saved) as { index?: number; surveyId?: string; resultsPath?: string };
            if (Number.isInteger(progress.index) && progress.index! >= 0 && progress.index! < steps.length) {
              setIndex(progress.index!);
            }
            if (typeof progress.surveyId === "string") setOnboardingSurveyId(progress.surveyId);
            if (typeof progress.resultsPath === "string" && progress.resultsPath.startsWith("/app/")) setResultsPath(progress.resultsPath);
          }
        } catch { /* Session storage is optional. */ }
      } else {
        try { sessionStorage.removeItem(`mindresearch:onboarding-progress:${user.id}`); } catch { /* Storage is optional. */ }
      }
      setStatus(nextStatus);
      setActive(nextStatus === "not_started");
    }).catch(() => setStatus("error"));
  }, []);

  useEffect(() => {
    if (inPlatform && status === "loading") loadOnboardingStatus();
  }, [inPlatform, loadOnboardingStatus, status]);

  useEffect(() => {
    const handleAuthenticated = () => {
      setStatus("loading");
      loadOnboardingStatus();
    };
    window.addEventListener("mindresearch:authenticated", handleAuthenticated);
    return () => window.removeEventListener("mindresearch:authenticated", handleAuthenticated);
  }, [loadOnboardingStatus]);

  useEffect(() => {
    if (!active || !promptVisible) return;
    const current = steps[index];
    const currentPath = routeForStep(current);
    if (location.pathname !== currentPath) {
      setPromptVisible(false);
      return;
    }
    setRect(null);
    setTargetFound(false);
    let attempts = 0;
    let timer = 0;
    let observer: ResizeObserver | undefined;
    let element: Element | null = null;
    const measure = () => {
      const selector = targetSelector(current.target);
      const found = document.querySelector(selector) ?? document.querySelector("main") ?? document.body;
      if (found !== element) {
        observer?.disconnect();
        element = found;
        observer = new ResizeObserver(measure);
        observer.observe(found);
      }
      const box = found.getBoundingClientRect();
      setRect({ top: Math.max(8, box.top), left: Math.max(8, box.left), width: Math.min(box.width, window.innerWidth - 16), height: Math.min(box.height, window.innerHeight - 16), focused: current.target === '[data-onboarding="question-fields"]' || current.target === '[data-onboarding="custom-test-block"]' });
      setTargetFound(found.matches(selector) || Boolean(found.closest(selector)));
    };
    const locate = () => {
      const found = document.querySelector(targetSelector(current.target));
      if (found) {
        found.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
        measure();
      } else if (attempts++ < 30) timer = window.setTimeout(locate, 100);
      else measure();
    };
    locate();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => { window.clearTimeout(timer); observer?.disconnect(); window.removeEventListener("resize", measure); window.removeEventListener("scroll", measure, true); };
  }, [active, index, location.pathname, promptVisible, resultsPath, onboardingSurveyId]);

  const finish = useCallback(async (result: "completed" | "skipped") => {
    setSaving(true); setError("");
    try {
      await api.post("/account/onboarding", { status: result });
      if (progressKey) {
        try { sessionStorage.removeItem(progressKey); } catch { /* Session storage is optional. */ }
      }
      setStatus(result); setActive(false);
    } catch {
      setError("Не удалось сохранить прохождение. Проверьте соединение и повторите попытку.");
    } finally { setSaving(false); }
  }, [progressKey]);

  const advance = useCallback(() => {
    setPromptVisible(false);
    if (index === steps.length - 1) void finish("completed");
    else setIndex(current => current + 1);
  }, [finish, index]);

  useEffect(() => {
    if (!active || !progressKey) return;
    try {
      sessionStorage.setItem(progressKey, JSON.stringify({ index, surveyId: onboardingSurveyId, resultsPath }));
    } catch { /* Session storage is optional. */ }
  }, [active, index, onboardingSurveyId, progressKey, resultsPath]);

  useEffect(() => {
    if (!active || !inPlatform) {
      setPromptVisible(false);
      return;
    }
    if (location.pathname === routeForStep(step)) return;
    const laterStep = steps.findIndex((candidate, candidateIndex) =>
      candidateIndex > index && routeForStep(candidate) === location.pathname &&
      (!candidate.target.includes("__survey_id__") || Boolean(onboardingSurveyId)),
    );
    if (laterStep >= 0) setIndex(laterStep);
    setPromptVisible(false);
  }, [active, inPlatform, index, location.pathname, onboardingSurveyId, resultsPath, step]);

  useEffect(() => {
    if (!active || !inPlatform || location.pathname !== routeForStep(step)) {
      setPromptVisible(false);
      return;
    }
    setPromptVisible(false);
    const timer = window.setTimeout(() => setPromptVisible(true), 1800);
    return () => window.clearTimeout(timer);
  }, [active, inPlatform, index, location.pathname, onboardingSurveyId, resultsPath, step]);

  useEffect(() => {
    if (!active || !promptVisible || !step.onEnterEvent || enteredStep.current === index) return;
    enteredStep.current = index;
    window.dispatchEvent(new Event(step.onEnterEvent));
  }, [active, index, promptVisible, step]);

  useEffect(() => {
    if (!active || !inPlatform) return;
    const handleClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element)) return;
      for (let candidateIndex = index; candidateIndex < steps.length; candidateIndex += 1) {
        const candidate = steps[candidateIndex];
        if (!candidate.onTargetClick) continue;
        const clicked = event.target.closest(targetSelector(candidate.onTargetClick));
        if (!clicked || clicked.getAttribute("aria-disabled") === "true" || clicked.matches(":disabled")) continue;
        if (candidate.capturePath) {
          const href = clicked.getAttribute("href") ?? clicked.closest("a")?.getAttribute("href");
          if (href) setResultsPath(href);
        }
        const surveyId = clicked.getAttribute("data-survey-id");
        if (surveyId) setOnboardingSurveyId(surveyId);
        setPromptVisible(false);
        setIndex(Math.min(candidateIndex + 1, steps.length - 1));
        return;
      }
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [active, inPlatform, index, onboardingSurveyId]);

  useEffect(() => {
    if (!active) return;
    const cleanups = steps.flatMap((candidate, candidateIndex) => {
      if (!candidate.advanceEvent) return [];
      const handleAdvance = (event: Event) => {
        if (candidateIndex < index) return;
        const eventSurveyId = (event as CustomEvent<{ surveyId?: string }>).detail?.surveyId;
        if (candidate.target.includes("__survey_id__") && eventSurveyId !== onboardingSurveyId) return;
        setPromptVisible(false);
        if (candidate.conditionalSave) {
          const detail = (event as CustomEvent<{ published?: boolean; surveyId?: string }>).detail;
          if (detail?.surveyId) setOnboardingSurveyId(detail.surveyId);
          setIndex(Math.min(candidateIndex + (detail?.published ? 2 : 1), steps.length - 1));
        } else {
          setIndex(Math.min(candidateIndex + 1, steps.length - 1));
        }
      };
      window.addEventListener(candidate.advanceEvent, handleAdvance);
      return [() => window.removeEventListener(candidate.advanceEvent!, handleAdvance)];
    });
    return () => cleanups.forEach(cleanup => cleanup());
  }, [active, index, onboardingSurveyId]);

  const cardPosition = useMemo<CardPosition>(() => {
    const margin = 16;
    const gap = 18;
    const width = Math.min(396, window.innerWidth - margin * 2);
    const cardHeight = step.target === '[data-onboarding="catalog-categories"]' ? 240 : 330;
    const minTop = margin;
    const maxTop = Math.max(minTop, window.innerHeight - cardHeight - margin);
    if (!rect) return { top: Math.max(minTop, (window.innerHeight - cardHeight) / 2), left: (window.innerWidth - width) / 2 };

    const rightLeft = rect.left + rect.width + gap;
    const leftLeft = rect.left - width - gap;
    const hasVerticalRoom = rect.top + cardHeight <= window.innerHeight - margin;
    if (step.target === '[data-onboarding="catalog-categories"]') {
      if (window.innerWidth <= 600) {
        return {
          top: Math.max(minTop, window.innerHeight - cardHeight - margin),
          left: (window.innerWidth - width) / 2,
        };
      }
      if (leftLeft >= margin) {
        return { top: Math.max(minTop, Math.min(rect.top, maxTop)), left: leftLeft };
      }
    }
    if (step.target === '[data-onboarding="custom-test-block"]') {
      const rightEdgePosition = window.innerWidth - width - margin;
      if (window.innerWidth <= 600) {
        const below = rect.top + rect.height + gap;
        if (below + cardHeight <= window.innerHeight - margin) {
          return { top: below, left: (window.innerWidth - width) / 2 };
        }
      }
      return { top: Math.max(minTop, Math.min(rect.top + 8, maxTop)), left: rightEdgePosition };
    }
    if (rect.focused && rightLeft + width <= window.innerWidth - margin && hasVerticalRoom) {
      return { top: Math.max(minTop, Math.min(rect.top, maxTop)), left: rightLeft };
    }
    if (rect.focused && leftLeft >= margin && hasVerticalRoom) {
      return { top: Math.max(minTop, Math.min(rect.top, maxTop)), left: leftLeft };
    }

    const below = rect.top + rect.height + gap;
    if (below + cardHeight <= window.innerHeight - margin) {
      return { top: below, left: Math.max(margin, Math.min(rect.left, window.innerWidth - width - margin)) };
    }
    const above = rect.top - cardHeight - gap;
    if (above >= margin) {
      return { top: above, left: Math.max(margin, Math.min(rect.left, window.innerWidth - width - margin)) };
    }

    const sideLeft = rightLeft + width <= window.innerWidth - margin
      ? rightLeft
      : Math.max(margin, leftLeft);
    if (sideLeft >= margin && sideLeft + width <= window.innerWidth - margin) {
      return { top: Math.max(minTop, Math.min(rect.top, maxTop)), left: sideLeft };
    }
    return { top: maxTop, left: Math.max(margin, Math.min(rect.left, window.innerWidth - width - margin)) };
  }, [rect, step.target]);

  return <>{children}{active && inPlatform && promptVisible && location.pathname === routeForStep(step) && <>
    {rect && targetFound && <Spotlight $rect={rect} />}
    <Card $position={cardPosition} role="dialog" aria-modal="false" aria-labelledby="onboarding-title">
      <div className="progress"><span style={{ width: `${((index + 1) / steps.length) * 100}%` }} /></div>
      <h2 id="onboarding-title">{step.title}</h2>
      <p>{step.body}</p>
      {!targetFound && <p className="meta">Элемент появится на странице после создания первого опроса.</p>}
      <div className="meta">Шаг {index + 1} из {steps.length}</div>
      {error && <div className="error" role="alert">{error}</div>}
      <div className="controls">
        <Button className="skip" disabled={saving} onClick={() => void finish("skipped")}>Пропустить</Button>
        {index > 0 && <Button disabled={saving} onClick={() => { const previousIndex = index - 1; setPromptVisible(false); setIndex(previousIndex); navigate(routeForStep(steps[previousIndex])); }}>Назад</Button>}
        {((!step.onTargetClick && !step.advanceEvent) || !targetFound) && <Button type="primary" disabled={saving} onClick={advance}>{index === steps.length - 1 ? "Завершить" : "Далее"}</Button>}
      </div>
    </Card>
  </>}</>;
}
