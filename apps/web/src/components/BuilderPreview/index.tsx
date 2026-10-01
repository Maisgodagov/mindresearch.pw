import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Eye, Leaf, X } from "lucide-react";
import { Button } from "../../ui";
import { formatOptionLabel } from "../../utils/formatOptionLabel";
import { initialPreviewScreen, singleChoiceAdvanceDelayMs } from "./const";
import {
  AnswerInput, Brand, Choice, Done, Layer, Navigation, Options, PreviewPage,
  PreviewShell, Progress, QuestionCard, Toolbar, Welcome,
} from "./styles";
import type { PreviewProps, PreviewValue } from "./types";

export function BuilderPreview({ meta, questions, onClose }: PreviewProps) {
  const [screen, setScreen] = useState(initialPreviewScreen);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, PreviewValue>>({});
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

  function nextQuestion() {
    if (index >= questions.length - 1) setScreen("done");
    else setIndex((current) => current + 1);
  }

  function chooseSingle(optionValue: string) {
    if (!question) return;
    setAnswers((current) => ({ ...current, [question.id]: optionValue }));
    window.setTimeout(nextQuestion, singleChoiceAdvanceDelayMs);
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
          <Brand><Leaf /> mindresearch</Brand>

          {screen === "welcome" && (
            <Welcome>
              <span>Анонимное исследование</span>
              <h1>{meta.welcomeTitle || "Заголовок приветствия"}</h1>
              <p>{meta.welcomeText || "Здесь появится текст перед началом опроса."}</p>
              <div className="meta"><span>{questions.length} вопросов</span><span>Можно прерваться</span></div>
              {questions.length ? (
                <Button onClick={() => setScreen("questions")}>Начать <ArrowRight size={18} /></Button>
              ) : (
                <div className="empty">В опросе пока нет вопросов. Вернитесь к редактированию и добавьте методику или собственный тест.</div>
              )}
            </Welcome>
          )}

          {screen === "questions" && question && (
            <>
              <Progress>
                <div className="caption"><span>{question.sectionTitle}</span><span>{index + 1} из {questions.length}</span></div>
                <div className="line"><i style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div>
              </Progress>
              <QuestionCard>
                <span className="eyebrow">Вопрос {index + 1} из {questions.length}</span>
                <div className="question">{question.text || "Текст вопроса"}</div>
                {question.type === "multiple" && <div className="hint">Можно выбрать несколько вариантов</div>}
                {(question.type === "single" || question.type === "multiple") && (
                  <Options>
                    {question.options.map((option) => {
                      const active = question.type === "multiple"
                        ? Array.isArray(value) && value.includes(option.value)
                        : value === option.value;
                      return (
                        <Choice key={option.value} $active={active} onClick={() => question.type === "single" ? chooseSingle(option.value) : toggleMultiple(option.value)}>
                          <span className="dot">{active && <Check size={14} />}</span>{formatOptionLabel(option.label, option.value)}
                        </Choice>
                      );
                    })}
                  </Options>
                )}
                {(question.type === "text" || question.type === "number") && (
                  <AnswerInput
                    autoFocus
                    type={question.type}
                    value={(value as string | number) ?? ""}
                    placeholder="Ваш ответ"
                    onChange={(event) => updateTextAnswer(event.target.value)}
                  />
                )}
                <Navigation>
                  <Button className="back" disabled={index === 0} onClick={() => setIndex((current) => current - 1)} aria-label="Назад"><ArrowLeft /></Button>
                  <span className="preview-note">Режим предпросмотра</span>
                  {question.type !== "single" && (
                    <Button disabled={!valid} onClick={nextQuestion}>
                      {index === questions.length - 1 ? "Завершить" : "Готово"} <ArrowRight size={18} />
                    </Button>
                  )}
                </Navigation>
              </QuestionCard>
            </>
          )}

          {screen === "done" && (
            <Done>
              <span className="badge"><CheckCircle2 size={15} /> Опрос завершён</span>
              <h1>{meta.resultPresentation.title || "Спасибо за ваши ответы"}</h1>
              <p>{meta.resultPresentation.text || "Ваши ответы сохранены."}</p>
              {meta.resultPresentation.showScores && <div className="scores">Здесь будут показаны рассчитанные результаты добавленных подтверждённых методик.</div>}
              <Button style={{ marginTop: 24 }} onClick={onClose}>Вернуться к редактированию</Button>
            </Done>
          )}
        </PreviewShell>
      </PreviewPage>
    </Layer>
  );
}

export type { PreviewMeta, PreviewQuestion, PreviewProps } from "./types";
