import { surveyDurationLabel } from "../../surveyDuration";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Eye, Leaf, X } from "lucide-react";
import { Button } from "../../ui";
import { getCurrentUser } from "../../api";
import { StockAvatar } from "../StockAvatar";
import { formatOptionLabel } from "../../utils/formatOptionLabel";
import {
  Header as TakingHeader,
  Welcome as TakingWelcome,
  Top as TakingTop,
  Bar as TakingBar,
  QuestionCard as TakingQuestionCard,
  Options as TakingOptions,
  Choice as TakingChoice,
  Input as TakingInput,
  MultipleHint,
  Nav,
} from "../../containers/SurveyTaking/styles";
import { Hero as ResultsHero, Notice as ResultsNotice } from "../../containers/SurveyResults/styles";
import { initialPreviewScreen, singleChoiceAdvanceDelayMs } from "./const";
import { Layer, PreviewPage, PreviewShell, Toolbar } from "./styles";
import type { PreviewProps, PreviewValue } from "./types";

export function BuilderPreview({ meta, questions, onClose }: PreviewProps) {
  const [screen, setScreen] = useState(initialPreviewScreen);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, PreviewValue>>({});
  const [transitioning, setTransitioning] = useState(false);
  const answering = useRef(false);
  const [author, setAuthor] = useState<{ name: string; slug: string; avatarSeed: string } | null>(null);
  const question = questions[index];
  const value = question ? answers[question.id] : undefined;
  const valid = useMemo(
    () => value !== undefined && value !== "" && (!Array.isArray(value) || value.length > 0),
    [value],
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);

  useEffect(() => {
    if (!meta.showAuthor) return;
    getCurrentUser()
      .then((user) => {
        if (user.isProfilePublic && user.publicSlug) {
          setAuthor({ name: user.name, slug: user.publicSlug, avatarSeed: user.avatarSeed });
        }
      })
      .catch(() => setAuthor(null));
  }, [meta.showAuthor]);

  function nextQuestion() {
    if (index >= questions.length - 1) setScreen("done");
    else setIndex((current) => current + 1);
  }

  function chooseSingle(optionValue: string) {
    if (!question || answering.current) return;
    answering.current = true;
    setAnswers((current) => ({ ...current, [question.id]: optionValue }));
    window.setTimeout(() => {
      setTransitioning(true);
      window.setTimeout(() => {
        nextQuestion();
        setTransitioning(false);
        answering.current = false;
      }, 180);
    }, singleChoiceAdvanceDelayMs);
  }

  function toggleMultiple(optionValue: string) {
    if (!question) return;
    setAnswers((current) => {
      const selected = Array.isArray(current[question.id]) ? current[question.id] as string[] : [];
      const next = selected.includes(optionValue)
        ? selected.filter((item) => item !== optionValue)
        : [...selected, optionValue];
      return { ...current, [question.id]: next };
    });
  }

  function updateTextAnswer(rawValue: string) {
    if (!question) return;
    setAnswers((current) => ({
      ...current,
      [question.id]: question.type === "number" ? Number(rawValue) : rawValue,
    }));
  }

  return (
    <Layer>
      <PreviewPage>
        <PreviewShell>
          <Toolbar>
            <div className="context"><Eye size={18} /><span><b>Предпросмотр опроса</b>Ответы здесь не сохраняются</span></div>
            <Button className="close" onClick={onClose}><X size={16} /> Вернуться к редактированию</Button>
          </Toolbar>
          <TakingHeader><Leaf /> mindresearch</TakingHeader>

          {screen === "welcome" && (
            <TakingWelcome>
              <h1>{meta.welcomeTitle || "Заголовок приветствия"}</h1>
              <p>{meta.welcomeText || "Здесь появится текст перед началом опроса."}</p>
              {author && (
                <a className="author" href={`/p/${author.slug}`}>
                  <StockAvatar seed={author.avatarSeed} alt="" /> Автор: {author.name}
                </a>
              )}
              <div className="meta"><span>{questions.length} вопросов</span><span>≈ {surveyDurationLabel(questions.length, meta.estimatedDuration)}</span><span>Можно прерваться</span></div>
              {questions.length ? (
                <Button type="primary" size="large" onClick={() => setScreen("questions")}>Начать <ArrowRight size={18} /></Button>
              ) : (
                <div className="empty">В опросе пока нет вопросов. Вернитесь к редактированию и добавьте методику или собственный тест.</div>
              )}
            </TakingWelcome>
          )}

          {screen === "questions" && question && (
            <>
              <TakingTop>
                <div className="save-line"><span className="save"><Eye size={14} /> Режим предпросмотра</span></div>
                <TakingBar><i style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></TakingBar>
              </TakingTop>
              <TakingQuestionCard $leaving={transitioning}>
                <span className="eyebrow">Вопрос {index + 1} из {questions.length}</span>
                <div className="question">{question.text || "Текст вопроса"}</div>
                {question.type === "multiple" && <MultipleHint>Можно выбрать несколько вариантов</MultipleHint>}
                {(question.type === "single" || question.type === "multiple") && (
                  <TakingOptions>
                    {question.options.map((option) => {
                      const active = question.type === "multiple"
                        ? Array.isArray(value) && value.includes(option.value)
                        : value === option.value;
                      return (
                        <TakingChoice key={option.value} $active={active} disabled={transitioning || answering.current} onClick={() => question.type === "single" ? chooseSingle(option.value) : toggleMultiple(option.value)}>
                          {question.type === "multiple" && <span className="dot checkbox">{active && <Check size={14} />}</span>}
                          {formatOptionLabel(option.label, option.value)}
                        </TakingChoice>
                      );
                    })}
                  </TakingOptions>
                )}
                {(question.type === "text" || question.type === "number") && (
                  <TakingInput
                    autoFocus
                    type={question.type}
                    min={question.validation?.min}
                    max={question.validation?.max}
                    value={(value as string | number) ?? ""}
                    placeholder="Ваш ответ"
                    onChange={(event) => updateTextAnswer(event.target.value)}
                  />
                )}
                <Nav>
                  <Button className="back" disabled={index === 0} onClick={() => setIndex((current) => current - 1)} aria-label="Назад"><ArrowLeft /></Button>
                  {question.type !== "single" && (
                    <Button type="primary" disabled={!valid || transitioning} onClick={nextQuestion}>
                      {index === questions.length - 1 ? "Завершить" : "Готово"} <ArrowRight size={18} />
                    </Button>
                  )}
                </Nav>
              </TakingQuestionCard>
            </>
          )}

          {screen === "done" && (
            <ResultsHero>
              <span className="badge"><CheckCircle2 size={15} /> Опрос завершён</span>
              <h1>{meta.resultPresentation.title || "Спасибо за ваши ответы"}</h1>
              <p>{meta.resultPresentation.text || "Ваши ответы сохранены."}</p>
              {meta.resultPresentation.showScores && <ResultsNotice>При реальном прохождении здесь отобразятся рассчитанные результаты методик.</ResultsNotice>}
              <Button style={{ marginTop: 24 }} onClick={onClose}>Вернуться к редактированию</Button>
            </ResultsHero>
          )}
        </PreviewShell>
      </PreviewPage>
    </Layer>
  );
}

export type { PreviewMeta, PreviewQuestion, PreviewProps } from "./types";
