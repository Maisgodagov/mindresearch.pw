import { respondentQuestions } from '../../../../api/src/respondent';
import { usePageTitle } from "../../pageTitle";
import { defaultSurveyDuration, surveyDurationLabel } from "../../surveyDuration";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SelectField as Select } from "../../components/SelectField";
import { FieldInput } from "../../components/FieldInput";
import { TextAreaField } from "../../components/TextAreaField";
import {
  DndContext,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  Plus,
  Pencil,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import { api, useDemoFallbacks } from "../../api";
import { getApiErrorMessage } from "../../utils/apiErrors";
import { Button, SkeletonScreen } from "../../ui";
import {
  MethodologyModal,
  type Methodology,
} from "../../components/MethodologyModal";
import { demoInstruments, demoMethodologies } from "../../platform/demo";
import { PlatformLayout } from "../PlatformLayout";
import {
  BuilderPreview,
  type PreviewQuestion,
} from "../../components/BuilderPreview";
import { SortableQuestion, SortableSection } from "./components/SortableBlocks";
import { SurveyScreenSection } from "./components/SurveyScreenSection";
import { SurveyBuilderToolbar } from "./components/SurveyBuilderToolbar";
import type { Instrument, Option, Question, Section } from "./types";
import {
  filterRussianCatalog,
  makeQuestion,
  questionTypeOptions,
} from "./const";
import {
  Header,
  HeaderSaveStatus,
  Columns,
  Panel,
  Stack,
  SectionCard,
  AddQuestionButton,
} from "./styles";

function applySharedAnswerType(
  section: Section,
  type: "single" | "multiple",
): Section {
  const options = (section.sharedOptions ?? []).map((option) => ({ ...option }));
  return {
    ...section,
    sharedAnswerType: type,
    questions: section.questions?.map((question) => ({
      ...question,
      type,
      options,
    })),
  };
}

export function SurveyBuilder() {
  const nav = useNavigate();
  const { surveyId } = useParams();
  const [instruments, setInstruments] = useState<Instrument[]>([]),
    [methodologies, setMethodologies] = useState<Record<string, Methodology>>(
      {},
    ),
    [activeMethodology, setActiveMethodology] = useState<Methodology | null>(
      null,
    ),
    [sections, setSections] = useState<Section[]>([]),
    [open, setOpen] = useState<Record<string, boolean>>({}),
    [libraryQuery, setLibraryQuery] = useState(""),
    [previewQuestions, setPreviewQuestions] = useState<
      PreviewQuestion[] | null
    >(null),
    [previewLoading, setPreviewLoading] = useState(false),
    [previewError, setPreviewError] = useState(""),
    [invalidFields, setInvalidFields] = useState<string[]>([]),
    [libraryQuestionsLoading, setLibraryQuestionsLoading] = useState<
      Record<string, boolean>
    >({}),
    [builderReady, setBuilderReady] = useState(false),
    [catalogLoading, setCatalogLoading] = useState(true),
    [draftRestored, setDraftRestored] = useState(false),
    [lastSaved, setLastSaved] = useState<Date | null>(null),
    [saving, setSaving] = useState(false),
    [error, setError] = useState(""),
    [structureLocked, setStructureLocked] = useState(false);
  const draftSurveyId = useRef("");
  const autosaveStarted = useRef(false);
  const surveyVersion=useRef(0);
  const autosaveQueue=useRef<Promise<unknown>>(Promise.resolve());
  const conflicted=useRef(false);
  const [hasConflict,setHasConflict]=useState(false);
  const [loadFailed,setLoadFailed]=useState(false);
  const [canChangeStatus,setCanChangeStatus]=useState(true);
  const savingFull=useRef(false);
  const autosaveDraft = useRef(!surveyId);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const [meta, setMeta] = useState({
    title: "",
    description: "",
    welcomeTitle: "Спасибо, что решили принять участие",
    welcomeText:
      "Здесь нет правильных или неправильных ответов — важен ваш личный опыт.",
    status: "active" as "draft" | "active" | "archived",
    showAuthor: true,
    collectAlias: true,
    collectAge: true,
    collectGender: true,
    estimatedDuration: { ...defaultSurveyDuration },
    resultPresentation: {
      showResults: true,
      showScores: true,
      title: "Спасибо за ваши ответы",
      text: "",
    },
  });
  const initialMeta = useRef(meta);
  usePageTitle(meta.title.trim()?`${meta.title} — конструктор`:"Создание опроса");
  useEffect(() => {
    setCatalogLoading(true);
    Promise.all([
      api.get("/account/instruments"),
      api.get("/admin/methodologies"),
    ])
      .then(([i, m]) => {
        setInstruments(filterRussianCatalog(i.data));
        setMethodologies(m.data);
      })
      .catch(() => {
        if (useDemoFallbacks) {
          setInstruments(filterRussianCatalog(demoInstruments));
          setMethodologies(demoMethodologies);
        } else {
          setError("Не удалось загрузить методики с сервера.");
        }
      })
      .finally(() => setCatalogLoading(false));
    setBuilderReady(false);
    autosaveStarted.current = false;
    autosaveDraft.current = !surveyId;
    draftSurveyId.current = surveyId ?? "";
    setDraftRestored(false);
    setLoadFailed(false);setHasConflict(false);
    setLastSaved(null);
    if (surveyId)
      api
        .get(`/account/surveys/${surveyId}`)
        .then(({ data }) => {
          surveyVersion.current=data.version??0;conflicted.current=false;
          setCanChangeStatus(data.canChangeStatus!==false);
          setMeta({
            title: data.title,
            description: data.description ?? "",
            welcomeTitle: data.welcomeTitle,
            welcomeText: data.welcomeText,
            status: data.status,
            showAuthor: Boolean(data.showAuthor),
            collectAlias: Number(data.responseCount)>0 ? data.collectAlias !== false : true,
            collectAge: Number(data.responseCount)>0 ? data.collectAge === true : true,
            collectGender: Number(data.responseCount)>0 ? data.collectGender === true : true,
            estimatedDuration: data.estimatedDuration ?? data.settings?.estimatedDuration ?? { ...defaultSurveyDuration },
            resultPresentation: data.resultPresentation,
          });
          setSections(
            data.sections.map((section: Section) => ({
              ...section,
              useSharedOptions: section.useSharedOptions ?? false,
              sharedAnswerType:
                section.sharedAnswerType ??
                (section.questions?.length &&
                section.questions.every((question) => question.type === "multiple")
                  ? "multiple"
                  : "single"),
              sharedOptions: section.sharedOptions ?? [
                { value: "1", label: "" },
                { value: "2", label: "" },
              ],
            })),
          );
          setOpen(
            data.builderOpen ??
              Object.fromEntries(
                data.sections
                  .filter((section: Section) => section.kind === "custom")
                  .map((section: Section) => [section.id, true]),
              ),
          );
          autosaveDraft.current =
            Boolean(data.builderState) || data.status === "draft";
          setDraftRestored(Boolean(data.builderState));
          setStructureLocked(Number(data.responseCount) > 0);
          setBuilderReady(true);
        })
        .catch(() => {
          setLoadFailed(true);
          setError("Не удалось загрузить опрос.");
          setBuilderReady(true);
        });
    else {
      setMeta({ ...initialMeta.current });
      setSections([]);
      setOpen({});
      setStructureLocked(false);
      setBuilderReady(true);
    }
  }, [surveyId]);
  useEffect(() => {
    if (!builderReady || !autosaveDraft.current) return;
    if (!autosaveStarted.current) {
      autosaveStarted.current = true;
      return;
    }
    const state = { meta, sections, open };
    const timer = window.setTimeout(async () => {
      if(savingFull.current||conflicted.current)return;
      try {
        const pending=autosaveQueue.current.then(async()=>{
          if(conflicted.current)return;
          let id=surveyId||draftSurveyId.current;
          if(!id){
            const {data}=await api.post('/account/surveys/draft',state);
            id=data.id;draftSurveyId.current=id;surveyVersion.current=0;
            window.history.replaceState(window.history.state,'',`/app/surveys/${id}/edit`);
          }else{
            const {data}=await api.put(`/account/surveys/${id}/draft-state`,state,{headers:{'X-Survey-Version':surveyVersion.current}});
            surveyVersion.current=data.version;
          }
        });
        autosaveQueue.current=pending.catch((err)=>{if(err.response?.status===409)conflicted.current=true;});
        await pending;
        setLastSaved(new Date());
      } catch (err:any) {
        if(err.response?.status===409){conflicted.current=true;setHasConflict(true);autosaveDraft.current=false;setError(getApiErrorMessage(err,'Конфликт версий'));return;}
        setError("Не удалось сохранить черновик на сервере.");
      }
    }, 650);
    return () => window.clearTimeout(timer);
  }, [builderReady, surveyId, meta, sections, open]);
  const count = useMemo(
    () =>
      sections.reduce(
        (sum, s) => sum + (s.questionCount ?? s.questions?.length ?? 0),
        (meta.collectAlias ? 1 : 0) + (meta.collectAge ? 1 : 0) + (meta.collectGender ? 1 : 0),
      ),
    [sections, meta.collectAlias, meta.collectAge, meta.collectGender],
  );
  if (!builderReady || catalogLoading)
    return (
      <PlatformLayout>
        <SkeletonScreen variant="builder" />
      </PlatformLayout>
    );
  const addInstrument = (i: Instrument) => {
    if (sections.some((s) => s.instrumentId === i.id)) return;
    setSections((s) => [
      ...s,
      {
        id: crypto.randomUUID(),
        kind: "library",
        instrumentId: i.id,
        formGenders: i.formGenders,
        formGender: "male",
        title: i.title,
        questionCount: i.questionCount,
        isVerified: i.isVerified,
      },
    ]);
    setInvalidFields((current) => current.filter((key) => key !== "sections"));
  };
  const addCustom = () => {
    const id = crypto.randomUUID();
    setSections((s) => [
      ...s,
      {
        id,
        kind: "custom",
        title: "Свой блок вопросов",
        questions: [makeQuestion()],
        useSharedOptions: false,
        sharedAnswerType: "single",
        sharedOptions: [
          { value: "1", label: "" },
          { value: "2", label: "" },
        ],
      },
    ]);
    setOpen((o) => ({ ...o, [id]: true }));
    setInvalidFields((current) => current.filter((key) => key !== "sections"));
  };
  const move = (index: number, delta: number) =>
    setSections((s) => {
      const copy = [...s],
        to = index + delta;
      if (to < 0 || to >= copy.length) return s;
      [copy[index], copy[to]] = [copy[to], copy[index]];
      return copy;
    });
  const reorderSections = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    setSections((current) => {
      const from = current.findIndex((section) => section.id === active.id),
        to = current.findIndex((section) => section.id === over.id);
      return from < 0 || to < 0 ? current : arrayMove(current, from, to);
    });
  };
  const updateSection = (id: string, fn: (section: Section) => Section) =>
    setSections((s) => s.map((x) => (x.id === id ? fn(x) : x)));
  const toggleLibrarySection = async (section: Section) => {
    if (open[section.id]) {
      setOpen((current) => ({ ...current, [section.id]: false }));
      return;
    }
    setOpen((current) => ({ ...current, [section.id]: true }));
    if (section.questions || !section.instrumentId) return;
    setLibraryQuestionsLoading((current) => ({
      ...current,
      [section.id]: true,
    }));
    try {
      const { data } = await api.get(
        `/account/instruments/${section.instrumentId}/questions`,
        { params: { formGender: section.formGender ?? "male" } },
      );
      updateSection(section.id, (current) => ({
        ...current,
        questions: (current.formGender ?? "male") === (section.formGender ?? "male") ? data.questions : current.questions,
      }));
    } catch {
      setError("Не удалось загрузить вопросы методики.");
    } finally {
      setLibraryQuestionsLoading((current) => ({
        ...current,
        [section.id]: false,
      }));
    }
  };
  const clearInvalid = (key: string) =>
    setInvalidFields((current) => current.filter((item) => item !== key));
  const showValidation = (keys: string[], message: string) => {
    setInvalidFields(keys);
    setError(message);
    window.requestAnimationFrame(() =>
      window.requestAnimationFrame(() => {
        const target = document.querySelector<HTMLElement>(
          '[data-validation-error="true"]',
        );
        target?.scrollIntoView({ behavior: "smooth", block: "center" });
        window.setTimeout(() => target?.focus({ preventScroll: true }), 350);
      }),
    );
  };
  const openPreview = async () => {
    setPreviewLoading(true);
    setPreviewError("");
    try {
      const blocks = await Promise.all(
        sections.map(async (section) => {
          if (section.kind === "custom")
            return (section.questions ?? []).map((question) => ({
              ...question,
              text: question.text || "Текст вопроса",
              options:
                question.type === "single" || question.type === "multiple"
                  ? section.useSharedOptions
                    ? (section.sharedOptions ?? [])
                    : question.options
                  : [],
              sectionTitle: section.title || "Собственный тест",
            }));
          const { data } = await api.get(
            `/account/instruments/${section.instrumentId}/questions`,
        { params: { formGender: section.formGender ?? "male" } },
          );
          return data.questions.map(
            (question: Omit<PreviewQuestion, "sectionTitle">) => ({
              ...question,
              sectionTitle: section.title,
            }),
          );
        }),
      );
      setPreviewQuestions([
        ...respondentQuestions(meta),
        ...blocks.flat(),
      ]);
    } catch {
      setPreviewError(
        "Не удалось загрузить вопросы для предпросмотра. Попробуйте ещё раз.",
      );
    } finally {
      setPreviewLoading(false);
    }
  };
  const duplicateQuestion = (sectionId: string, question: Question) =>
    updateSection(sectionId, (s) => {
      const questions = [...(s.questions ?? [])],
        index = questions.findIndex((x) => x.id === question.id),
        copy = {
          ...question,
          id: crypto.randomUUID(),
          options: question.options.map((option) => ({ ...option })),
        };
      questions.splice(index + 1, 0, copy);
      return { ...s, questions };
    });
  const moveQuestion = (sectionId: string, index: number, delta: number) =>
    updateSection(sectionId, (s) => {
      const questions = [...(s.questions ?? [])],
        to = index + delta;
      if (to < 0 || to >= questions.length) return s;
      [questions[index], questions[to]] = [questions[to], questions[index]];
      return { ...s, questions };
    });
  const reorderQuestions = (
    sectionId: string,
    { active, over }: DragEndEvent,
  ) => {
    if (!over || active.id === over.id) return;
    updateSection(sectionId, (s) => {
      const questions = [...(s.questions ?? [])],
        from = questions.findIndex((x) => x.id === active.id),
        to = questions.findIndex((x) => x.id === over.id);
      if (from < 0 || to < 0) return s;
      return { ...s, questions: arrayMove(questions, from, to) };
    });
  };
  async function submit() {
    const invalid: string[] = [];
    if (meta.title.trim().length < 2) invalid.push("title");
    if (meta.estimatedDuration.mode === "custom" && !meta.estimatedDuration.text.trim()) invalid.push("estimatedDuration");
    if (meta.welcomeTitle.trim().length < 2) invalid.push("welcomeTitle");
    if (meta.welcomeText.trim().length < 2) invalid.push("welcomeText");
    if (meta.resultPresentation.title.trim().length < 2)
      invalid.push("resultTitle");
    if (!sections.length) invalid.push("sections");
    const invalidSections: string[] = [];
    for (const section of sections)
      if (section.kind === "custom") {
        if (!section.title.trim()) {
          invalid.push(`section-${section.id}-title`);
          invalidSections.push(section.id);
        }
        if (section.useSharedOptions)
          (section.sharedOptions ?? []).forEach((option, index) => {
            if (!option.label.trim()) {
              invalid.push(`section-${section.id}-shared-${index}`);
              invalidSections.push(section.id);
            }
          });
        section.questions?.forEach((question) => {
          if (!question.text.trim()) {
            invalid.push(`question-${question.id}-text`);
            invalidSections.push(section.id);
          }
          if (
            (question.type === "single" || question.type === "multiple") &&
            !section.useSharedOptions
          )
            question.options.forEach((option, index) => {
              if (!option.label.trim()) {
                invalid.push(`question-${question.id}-option-${index}`);
                invalidSections.push(section.id);
              }
            });
        });
      }
    if (invalid.length) {
      if (invalidSections.length)
        setOpen((current) => ({
          ...current,
          ...Object.fromEntries(invalidSections.map((id) => [id, true])),
        }));
      showValidation(
        invalid,
        invalid.includes("sections")
          ? "Добавьте хотя бы одну методику или собственный тест."
          : "Заполните выделенные поля.",
      );
      return;
    }
    setSaving(true);
    savingFull.current=true;
    setInvalidFields([]);
    setError("");
    const payload = {
      ...meta,
      sections: sections.map((s) =>
        s.kind === "library"
          ? { kind: "library", instrumentId: s.instrumentId, formGender: s.formGender ?? "male" }
          : {
              kind: "custom",
              title: s.title,
              description: "",
              questions: s.questions?.map((q) => ({
                text: q.text,
                type: q.type,
                required: q.required,
                validation: q.validation ?? undefined,
                options:
                  q.type === "single" || q.type === "multiple"
                    ? s.useSharedOptions
                      ? s.sharedOptions
                      : q.options
                    : undefined,
              })),
            },
      ),
    };
    try {
      await autosaveQueue.current;
      if(conflicted.current)throw new Error('Опрос изменён другим пользователем. Обновите страницу перед сохранением.');
      const targetId = surveyId || draftSurveyId.current;
      targetId
        ? await api.put(`/account/surveys/${targetId}`, payload,{headers:{'X-Survey-Version':surveyVersion.current}})
        : await api.post("/account/surveys", payload);
      autosaveDraft.current = false;
      nav("/app");
    } catch (err: unknown) {
      if((err as any).response?.status===409){conflicted.current=true;setHasConflict(true);autosaveDraft.current=false;}
      setError(getApiErrorMessage(err, "Не удалось создать опрос"));
    } finally {
      savingFull.current=false;
      setSaving(false);
    }
  }
  if(loadFailed)return <PlatformLayout><h1>Опрос недоступен для редактирования</h1><p>Проверьте права доступа или откройте результаты опроса.</p><Button onClick={()=>nav(`/app/surveys/${surveyId}/results`)}>Открыть результаты</Button></PlatformLayout>;
  return (
    <PlatformLayout>
      <Header>
        <div className="header-copy">
          <h1>{surveyId ? "Редактирование опроса" : "Новый опрос"}</h1>
          <p>
            Соберите исследование из проверенных методик и собственных вопросов.
          </p>
        </div>
        <HeaderSaveStatus role="status" aria-live="polite">
          <span className="status-dot" />
          <span className="status-copy">
            {saving ? "Сохраняем опрос…" : draftRestored ? "Черновик восстановлен" : "Автосохранение включено"}
          </span>
          {lastSaved && !saving && (
            <span className="saved-time">
              · Сохранено {lastSaved.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </HeaderSaveStatus>
      </Header>
      {hasConflict&&<div role="alert" style={{padding:20,marginBottom:20,border:'1px solid var(--color-border)',borderRadius:12}}><p>Опрос изменён другим пользователем. Ваши правки остаются здесь, но не перезаписывают сохранённую версию.</p><Button onClick={()=>{const blob=new Blob([JSON.stringify({meta,sections,open},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='survey-local-changes.json';a.click();URL.revokeObjectURL(url);}}>Скачать мои изменения</Button></div>}
      <Columns>
        <div className="editor-column">
        <Panel
          className={`structure-panel${invalidFields.includes("sections") ? " invalid-panel" : ""}`}
          data-validation-error={
            invalidFields.includes("sections") || undefined
          }
          tabIndex={invalidFields.includes("sections") ? -1 : undefined}
        >
          <h2>Содержание опроса</h2>
          <p className="hint">{`${sections.length + 3} блока · ${count} вопросов. Экраны закреплены сверху и снизу; методики и вопросы можно перемещать.`}</p>
          <div
            style={
              structureLocked ? { pointerEvents: "none", opacity: 0.65 } : {}
            }
          >
            <SurveyScreenSection
              kind="start"
              title="Стартовый экран"
              helper="Показывается респонденту перед вопросами"
              heading={meta.welcomeTitle}
              body={meta.welcomeText}
              headingInvalid={invalidFields.includes("welcomeTitle")}
              bodyInvalid={invalidFields.includes("welcomeText")}
              headingLabel="Заголовок"
              bodyLabel="Текст перед началом"
              headingPlaceholder="Заголовок стартового экрана"
              bodyPlaceholder="Расскажите участнику об исследовании"
              settingLabel="Показывать ссылку на профиль автора"
              settingChecked={meta.showAuthor}
              onHeadingChange={(welcomeTitle) => {
                setMeta({ ...meta, welcomeTitle });
                clearInvalid("welcomeTitle");
              }}
              onBodyChange={(welcomeText) => {
                setMeta({ ...meta, welcomeText });
                clearInvalid("welcomeText");
              }}
              onSettingChange={(showAuthor) => setMeta({ ...meta, showAuthor })}
            >
              <div className="duration-setting">
                <span className="duration-label">Примерное время прохождения</span>
                <label className="screen-setting">
                  <input type="radio" name="estimated-duration" checked={meta.estimatedDuration.mode === "auto"} onChange={() => setMeta(current => ({ ...current, estimatedDuration: { ...current.estimatedDuration, mode: "auto" } }))} />
                  <span>Рассчитать автоматически · {surveyDurationLabel([...sections.flatMap(s => s.questions ?? Array.from({ length: s.questionCount ?? 0 }, () => ({ type: "single" }))), ...(meta.collectAlias ? [{ type: "text" }] : []), ...(meta.collectAge ? [{type:"number"}] : []), ...(meta.collectGender ? [{type:"single"}] : [])])}</span>
                </label>
                <p className="hint">Из расчёта 5–10 секунд на закрытый вопрос и 30–90 секунд на открытый вопрос, с округлением до 5 минут.</p>
                <label className="screen-setting">
                  <input type="radio" name="estimated-duration" checked={meta.estimatedDuration.mode === "custom"} onChange={() => setMeta(current => ({ ...current, estimatedDuration: { mode: "custom", text: current.estimatedDuration.text || "10 минут" } }))} />
                  <span>Указать своё время</span>
                </label>
                {meta.estimatedDuration.mode === "custom" && <label className="screen-field">
                  <span>Время для респондента</span>
                  <FieldInput aria-label="Время для респондента" maxLength={80} placeholder="Например, 10–15 минут" value={meta.estimatedDuration.text} onChange={event => { setMeta(current => ({ ...current, estimatedDuration: { mode: "custom", text: event.target.value } })); clearInvalid("estimatedDuration"); }} />
                  {invalidFields.includes("estimatedDuration") && <span role="alert">Укажите примерное время прохождения.</span>}
                </label>}
              </div>
            </SurveyScreenSection>
            <SectionCard style={{marginTop:15}} data-respondent-block>
              <div className="section-head"><span className="section-drag" style={{cursor:'default'}}><UserRound size={18}/></span><div className="section-name"><b>О респонденте</b><span>{respondentQuestions(meta).length} обязательных вопроса · закреплённый блок</span></div><span title="Системный блок нельзя удалить"><ShieldCheck size={16}/></span></div>
              <div className="body" style={{paddingTop:13}}>{respondentQuestions(meta).map((question,index)=><div className="readonly-question" key={question.id}>
                <span className="number">{index+1}</span><div><b>{question.text}</b><div className="question-meta">{question.type==='text'?'Текстовый ответ':question.type==='number'?'Числовой ответ · от 1 до 120 лет':'Один вариант · Женский / Мужской / Предпочитаю не указывать'} · обязательный</div></div>
              </div>)}</div>
            </SectionCard>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={() => setOpen({})}
              measuring={{droppable:{strategy:MeasuringStrategy.Always}}}
              onDragEnd={reorderSections}
            >
              <SortableContext
                items={sections.map((section) => section.id)}
                strategy={verticalListSortingStrategy}
              >
                <Stack>
                  {sections.map((section, index) => (
                    <SortableSection
                      key={section.id}
                      id={section.id}
                    >
                      {(sectionHandle) => (
                        <>
                          <div className="section-head">
                            {sectionHandle}
                            <div className="section-name">
                              <b>{section.title}</b>
                              <span>
                                {section.kind === "library"
                                  ? "Подтверждённая методика · автоматический расчёт"
                                  : `${section.questions?.length ?? 0} собственных вопросов · без автоматического расчёта`}
                              </span>
                            </div>
                            <Button
                              className="icon"
                              aria-label="Переместить блок выше"
                              onClick={() => move(index, -1)}
                            >
                              <ArrowUp size={15} />
                            </Button>
                            <Button
                              className="icon"
                              aria-label="Переместить блок ниже"
                              onClick={() => move(index, 1)}
                            >
                              <ArrowDown size={15} />
                            </Button>
                            <Button
                              className="icon"
                              aria-label={
                                open[section.id]
                                  ? "Свернуть блок"
                                  : "Развернуть блок"
                              }
                              title={
                                section.kind === "library"
                                  ? "Посмотреть вопросы методики"
                                  : undefined
                              }
                              onClick={() =>
                                section.kind === "library"
                                  ? toggleLibrarySection(section)
                                  : setOpen((o) => ({
                                      ...o,
                                      [section.id]: !o[section.id],
                                    }))
                              }
                            >
                              {open[section.id] ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              )}
                            </Button>
                            <Button
                              className="icon delete-action"
                              aria-label="Удалить блок"
                              onClick={() =>
                                setSections((s) =>
                                  s.filter((x) => x.id !== section.id),
                                )
                              }
                            >
                              <Trash2 size={15} />
                            </Button>
                          </div>
                          {section.kind === "library" && section.formGenders?.length && (
                            <div className="form-gender-control">
                              <span className="form-gender-label">Бланк методики</span>
                              <div className="form-gender-options" role="radiogroup" aria-label={`Бланк методики «${section.title}»`}>
                                {([{ value: "male", label: "Мужской" }, { value: "female", label: "Женский" }] as const).map(form => (
                                  <label key={form.value}>
                                    <input
                                      type="radio"
                                      name={`form-gender-${section.id}`}
                                      aria-label={`${form.label} бланк`}
                                      value={form.value}
                                      checked={(section.formGender ?? "male") === form.value}
                                      disabled={structureLocked}
                                      onChange={() => {
                                        updateSection(section.id, current => ({ ...current, formGender: form.value, questions: undefined }));
                                        setOpen(current => ({ ...current, [section.id]: false }));
                                      }}
                                    />
                                    <span>{form.label}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}
                          {section.kind === "library" && open[section.id] && (
                            <div className="library-questions">
                              <p className="library-note">
                                Вопросы подтверждённой методики доступны только
                                для просмотра и не редактируются.
                              </p>
                              {libraryQuestionsLoading[section.id] ? (
                                <SkeletonScreen variant="details" heading={false} label="Загрузка вопросов методики" />
                              ) : (
                                section.questions?.map((question, qi) => (
                                  <div
                                    className="readonly-question"
                                    key={question.id}
                                  >
                                    <span className="number">{qi + 1}</span>
                                    <div>
                                      <b>{question.text}</b>
                                      <div className="question-meta">
                                        {question.type === "multiple"
                                          ? "Несколько вариантов"
                                          : question.type === "single"
                                            ? "Один вариант"
                                            : question.type === "number"
                                              ? "Числовой ответ"
                                              : "Текстовый ответ"}
                                        {question.required
                                          ? " · обязательный"
                                          : ""}
                                      </div>
                                      {(question.type === "single" ||
                                        question.type === "multiple") &&
                                        question.options.length > 0 && (
                                          <div className="readonly-options">
                                            {question.options.map((option) => (
                                              <span key={option.value}>
                                                {option.label}
                                              </span>
                                            ))}
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                          {section.kind === "custom" && open[section.id] && (
                            <div className="body">
                              <div className="field">
                                <label>
                                  Название собственного теста или блока
                                </label>
                                <FieldInput
                                  className={
                                    invalidFields.includes(
                                      `section-${section.id}-title`,
                                    )
                                      ? "invalid"
                                      : undefined
                                  }
                                  data-validation-error={
                                    invalidFields.includes(
                                      `section-${section.id}-title`,
                                    ) || undefined
                                  }
                                  value={section.title}
                                  onChange={(e) => {
                                    clearInvalid(`section-${section.id}-title`);
                                    updateSection(section.id, (s) => ({
                                      ...s,
                                      title: e.target.value,
                                    }));
                                  }}
                                />
                              </div>
                              <div
                                className="field shared-options-field"
                                style={{
                                  padding: "13px",
                                  background: "#f2f6f0",
                                  borderRadius: 12,
                                }}
                              >
                                <label
                                  style={{
                                    display: "flex",
                                    gap: 9,
                                    alignItems: "center",
                                    margin: 0,
                                  }}
                                  className="shared-options-toggle"
                                >
                                  <input
                                    type="checkbox"
                                    checked={Boolean(section.useSharedOptions)}
                                    onChange={(e) => updateSection(section.id, (s) => {
                                      if (!e.target.checked)
                                        return { ...s, useSharedOptions: false };
                                      const answerType =
                                        s.sharedAnswerType ??
                                        (s.questions?.length &&
                                        s.questions.every((question) => question.type === "multiple")
                                          ? "multiple"
                                          : "single");
                                      return {
                                        ...applySharedAnswerType(s, answerType),
                                        useSharedOptions: true,
                                      };
                                    })}
                                  />
                                  Один список вариантов для всех вопросов теста
                                </label>
                                {section.useSharedOptions && (
                                  <>
                                    <div className="shared-answer-setting">
                                      <span className="shared-answer-label">Тип ответа</span>
                                      <div className="shared-answer-options" role="group" aria-label="Тип ответа для всех вопросов">
                                        <button
                                          type="button"
                                          className={section.sharedAnswerType !== "multiple" ? "selected" : undefined}
                                          aria-pressed={section.sharedAnswerType !== "multiple"}
                                          onClick={() => updateSection(section.id, (s) => applySharedAnswerType(s, "single"))}
                                        >
                                          Один вариант
                                        </button>
                                        <button
                                          type="button"
                                          className={section.sharedAnswerType === "multiple" ? "selected" : undefined}
                                          aria-pressed={section.sharedAnswerType === "multiple"}
                                          onClick={() => updateSection(section.id, (s) => applySharedAnswerType(s, "multiple"))}
                                        >
                                          Несколько вариантов
                                        </button>
                                      </div>
                                    </div>
                                  <div
                                    className="options"
                                    style={{ marginTop: 10 }}
                                  >
                                    {(section.sharedOptions ?? []).map(
                                      (option, oi) => (
                                        <div
                                          className="option"
                                          key={option.value}
                                        >
                                          <FieldInput
                                            className={
                                              invalidFields.includes(
                                                `section-${section.id}-shared-${oi}`,
                                              )
                                                ? "invalid"
                                                : undefined
                                            }
                                            data-validation-error={
                                              invalidFields.includes(
                                                `section-${section.id}-shared-${oi}`,
                                              ) || undefined
                                            }
                                            value={option.label}
                                            placeholder={`Вариант ${oi + 1}`}
                                            onChange={(e) => {
                                              clearInvalid(
                                                `section-${section.id}-shared-${oi}`,
                                              );
                                              updateSection(
                                                section.id,
                                                (s) => ({
                                                  ...s,
                                                  sharedOptions: (
                                                    s.sharedOptions ?? []
                                                  ).map((item, index) =>
                                                    index === oi
                                                      ? {
                                                          ...item,
                                                          label: e.target.value,
                                                        }
                                                      : item,
                                                  ),
                                                }),
                                              );
                                            }}
                                          />
                                          {(section.sharedOptions?.length ??
                                            0) > 2 && (
                                            <Button
                                              className="tiny delete-action"
                                              onClick={() =>
                                                updateSection(
                                                  section.id,
                                                  (s) => ({
                                                    ...s,
                                                    sharedOptions: (
                                                      s.sharedOptions ?? []
                                                    )
                                                      .filter(
                                                        (_, index) =>
                                                          index !== oi,
                                                      )
                                                      .map((item, index) => ({
                                                        ...item,
                                                        value: String(
                                                          index + 1,
                                                        ),
                                                      })),
                                                  }),
                                                )
                                              }
                                            >
                                              <Trash2 size={14} />
                                            </Button>
                                          )}
                                        </div>
                                      ),
                                    )}
                                    <Button
                                      className="add-option"
                                      onClick={() =>
                                        updateSection(section.id, (s) => ({
                                          ...s,
                                          sharedOptions: [
                                            ...(s.sharedOptions ?? []),
                                            {
                                              value: String(
                                                (s.sharedOptions?.length ?? 0) +
                                                  1,
                                              ),
                                              label: "",
                                            },
                                          ],
                                        }))
                                      }
                                    >
                                      <Plus size={14} /> Вариант ответа
                                    </Button>
                                    <p className="hint">
                                      Список будет применён ко всем вопросам с
                                      выбором одного или нескольких вариантов.
                                    </p>
                                  </div>
                                                                  </>
)}
                              </div>
                              <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={(event) =>
                                  reorderQuestions(section.id, event)
                                }
                              >
                                <SortableContext
                                  items={(section.questions ?? []).map(
                                    (question) => question.id,
                                  )}
                                  strategy={verticalListSortingStrategy}
                                >
                                  {section.questions?.map((q, qi) => (
                                    <SortableQuestion key={q.id} id={q.id}>
                                      {(questionHandle) => (
                                        <>
                                          <div className="qhead">
                                            <div className="qtitle">
                                              {questionHandle}
                                              <b>Вопрос {qi + 1}</b>
                                            </div>
                                            <div className="qactions">
                                              <Button
                                                className="tiny"
                                                aria-label="Выше"
                                                onClick={() =>
                                                  moveQuestion(
                                                    section.id,
                                                    qi,
                                                    -1,
                                                  )
                                                }
                                              >
                                                <ArrowUp size={14} />
                                              </Button>
                                              <Button
                                                      className="tiny"
                                                aria-label="Ниже"
                                                onClick={() =>
                                                  moveQuestion(
                                                    section.id,
                                                    qi,
                                                    1,
                                                  )
                                                }
                                              >
                                                <ArrowDown size={14} />
                                              </Button>
                                              <Button
                                                className="tiny"
                                                onClick={() =>
                                                  duplicateQuestion(
                                                    section.id,
                                                    q,
                                                  )
                                                }
                                              >
                                                <Copy size={14} /> Копировать
                                              </Button>
                                              <Button
                                                className="tiny delete-action"
                                                onClick={() =>
                                                  updateSection(
                                                    section.id,
                                                    (s) => ({
                                                      ...s,
                                                      questions:
                                                        s.questions?.filter(
                                                          (x) => x.id !== q.id,
                                                        ),
                                                    }),
                                                  )
                                                }
                                              >
                                                <Trash2 size={14} />
                                              </Button>
                                            </div>
                                          </div>
                                          <div className="qgrid">
                                            <FieldInput
                                              className={
                                                invalidFields.includes(
                                                  `question-${q.id}-text`,
                                                )
                                                  ? "invalid"
                                                  : undefined
                                              }
                                              data-validation-error={
                                                invalidFields.includes(
                                                  `question-${q.id}-text`,
                                                ) || undefined
                                              }
                                              value={q.text}
                                              onChange={(e) => {
                                                clearInvalid(
                                                  `question-${q.id}-text`,
                                                );
                                                updateSection(
                                                  section.id,
                                                  (s) => ({
                                                    ...s,
                                                    questions: s.questions?.map(
                                                      (x) =>
                                                        x.id === q.id
                                                          ? {
                                                              ...x,
                                                              text: e.target
                                                                .value,
                                                            }
                                                          : x,
                                                    ),
                                                  }),
                                                );
                                              }}
                                              placeholder="Текст вопроса"
                                            />
                                            <Select
                                              size="middle"
                                              value={q.type}
                                              disabled={Boolean(section.useSharedOptions)}
                                              options={[...questionTypeOptions]}
                                              getPopupContainer={(trigger) =>
                                                trigger.parentElement ??
                                                document.body
                                              }
                                              aria-label="Тип вопроса"
                                              onChange={(value) => {
                                                const type =
                                                  value as Question["type"];
                                                updateSection(
                                                  section.id,
                                                  (s) => ({
                                                    ...s,
                                                    questions: s.questions?.map(
                                                      (x) =>
                                                        x.id === q.id
                                                          ? {
                                                              ...x,
                                                              type,
                                                              options:
                                                                type ===
                                                                  "single" ||
                                                                type ===
                                                                  "multiple"
                                                                  ? x.options
                                                                      .length
                                                                    ? x.options
                                                                    : [
                                                                        {
                                                                          value:
                                                                            "1",
                                                                          label:
                                                                            "",
                                                                        },
                                                                        {
                                                                          value:
                                                                            "2",
                                                                          label:
                                                                            "",
                                                                        },
                                                                      ]
                                                                  : [],
                                                            }
                                                          : x,
                                                    ),
                                                  }),
                                                );
                                              }}
                                            />
                                          </div>
                                          {(q.type === "single" ||
                                            q.type === "multiple") &&
                                            !section.useSharedOptions && (
                                              <div className="options">
                                                {q.options.map((option, oi) => (
                                                  <div
                                                    className="option"
                                                    key={option.value}
                                                  >
                                                    <FieldInput
                                                      className={
                                                        invalidFields.includes(
                                                          `question-${q.id}-option-${oi}`,
                                                        )
                                                          ? "invalid"
                                                          : undefined
                                                      }
                                                      data-validation-error={
                                                        invalidFields.includes(
                                                          `question-${q.id}-option-${oi}`,
                                                        ) || undefined
                                                      }
                                                      value={option.label}
                                                      onChange={(e) => {
                                                        clearInvalid(
                                                          `question-${q.id}-option-${oi}`,
                                                        );
                                                        updateSection(
                                                          section.id,
                                                          (s) => ({
                                                            ...s,
                                                            questions:
                                                              s.questions?.map(
                                                                (x) =>
                                                                  x.id === q.id
                                                                    ? {
                                                                        ...x,
                                                                        options:
                                                                          x.options.map(
                                                                            (
                                                                              o,
                                                                              i,
                                                                            ) =>
                                                                              i ===
                                                                              oi
                                                                                ? {
                                                                                    ...o,
                                                                                    label:
                                                                                      e
                                                                                        .target
                                                                                        .value,
                                                                                  }
                                                                                : o,
                                                                          ),
                                                                      }
                                                                    : x,
                                                              ),
                                                          }),
                                                        );
                                                      }}
                                                      placeholder={`Вариант ${oi + 1}`}
                                                    />
                                                    {q.options.length > 2 && (
                                                      <Button
                                                        className="tiny delete-action"
                                                        onClick={() =>
                                                          updateSection(
                                                            section.id,
                                                            (s) => ({
                                                              ...s,
                                                              questions:
                                                                s.questions?.map(
                                                                  (x) =>
                                                                    x.id ===
                                                                    q.id
                                                                      ? {
                                                                          ...x,
                                                                          options:
                                                                            x.options.filter(
                                                                              (
                                                                                _,
                                                                                i,
                                                                              ) =>
                                                                                i !==
                                                                                oi,
                                                                            ),
                                                                        }
                                                                      : x,
                                                                ),
                                                            }),
                                                          )
                                                        }
                                                      >
                                                        <Trash2 size={14} />
                                                      </Button>
                                                    )}
                                                  </div>
                                                ))}
                                                <Button
                                                  className="add-option"
                                                  onClick={() =>
                                                    updateSection(
                                                      section.id,
                                                      (s) => ({
                                                        ...s,
                                                        questions:
                                                          s.questions?.map(
                                                            (x) =>
                                                              x.id === q.id
                                                                ? {
                                                                    ...x,
                                                                    options: [
                                                                      ...x.options,
                                                                      {
                                                                        value:
                                                                          String(
                                                                            x
                                                                              .options
                                                                              .length +
                                                                              1,
                                                                          ),
                                                                        label:
                                                                          "",
                                                                      },
                                                                    ],
                                                                  }
                                                                : x,
                                                          ),
                                                      }),
                                                    )
                                                  }
                                                >
                                                  <Plus size={14} /> Добавить
                                                  вариант ответа
                                                </Button>
                                              </div>
                                            )}
                                          <label className="required">
                                            <input
                                              type="checkbox"
                                              checked={q.required}
                                              onChange={(e) =>
                                                updateSection(
                                                  section.id,
                                                  (s) => ({
                                                    ...s,
                                                    questions: s.questions?.map(
                                                      (x) =>
                                                        x.id === q.id
                                                          ? {
                                                              ...x,
                                                              required:
                                                                e.target
                                                                  .checked,
                                                            }
                                                          : x,
                                                    ),
                                                  }),
                                                )
                                              }
                                            />{" "}
                                            Обязательный вопрос
                                          </label>

                                        </>
                                      )}
                                    </SortableQuestion>
                                  ))}
                                </SortableContext>
                              </DndContext>
                              <AddQuestionButton
                                onClick={() => {
                                  updateSection(section.id, (s) => ({
                                    ...s,
                                    questions: [
                                      ...(s.questions ?? []),
                                      {
                                        ...makeQuestion(),
                                        options: s.useSharedOptions
                                          ? (s.sharedOptions ?? []).map(
                                              (option) => ({ ...option }),
                                            )
                                          : makeQuestion().options,
                                      },
                                    ],
                                  }));
                                }}
                              >
                                <span className="plus">
                                  <Plus size={15} />
                                </span>{" "}
                                Добавить вопрос
                              </AddQuestionButton>
                            </div>
                          )}
                        </>
                      )}
                    </SortableSection>
                  ))}
                </Stack>
              </SortableContext>
            </DndContext>
          </div>
            <SurveyScreenSection
              kind="finish"
              title="Финальный экран"
              helper="Показывается после отправки ответов"
              heading={meta.resultPresentation.title}
              body={meta.resultPresentation.text}
              headingInvalid={invalidFields.includes("resultTitle")}
              headingLabel="Заголовок"
              bodyLabel="Сообщение после завершения"
              headingPlaceholder="Спасибо за ваши ответы"
              bodyPlaceholder="Ваши ответы сохранены"
              settingLabel="Показывать рассчитанные результаты подтверждённых методик"
              settingChecked={meta.resultPresentation.showScores}
              onHeadingChange={(title) => {
                setMeta({
                  ...meta,
                  resultPresentation: { ...meta.resultPresentation, title },
                });
                clearInvalid("resultTitle");
              }}
              onBodyChange={(text) =>
                setMeta({
                  ...meta,
                  resultPresentation: { ...meta.resultPresentation, text },
                })
              }
              onSettingChange={(showScores) =>
                setMeta({
                  ...meta,
                  resultPresentation: {
                    ...meta.resultPresentation,
                    showScores,
                    showResults: showScores,
                  },
                })
              }
            />
          {error && <p className="error">{error}</p>}
        </Panel>


        </div>
        <SurveyBuilderToolbar
          title={meta.title}
          description={meta.description}
          titleInvalid={invalidFields.includes("title")}
          onTitleChange={(value) => {
            setMeta({ ...meta, title: value });
            clearInvalid("title");
          }}
          onDescriptionChange={(value) => setMeta({ ...meta, description: value })}
          instruments={instruments}
          methodologies={methodologies}
          sections={sections}
          query={libraryQuery}
          locked={structureLocked}
          previewLoading={previewLoading}
          previewError={previewError}
          saving={saving}
          publishImmediately={meta.status === "active"}
          canChangeStatus={canChangeStatus}
          onQueryChange={setLibraryQuery}
          onCreateCustom={addCustom}
          onShowMethodology={setActiveMethodology}
          onAddInstrument={addInstrument}
          onPreview={openPreview}
          onPublishChange={(value) =>
            setMeta({ ...meta, status: value ? "active" : "draft" })
          }
          onSave={submit}
        />
      </Columns>
      {activeMethodology && (
        <MethodologyModal
          methodology={activeMethodology}
          onClose={() => setActiveMethodology(null)}
        />
      )}
      {previewQuestions && (
        <BuilderPreview
          meta={meta}
          questions={previewQuestions}
          onClose={() => setPreviewQuestions(null)}
        />
      )}
    </PlatformLayout>
  );
}
