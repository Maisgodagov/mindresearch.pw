import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import {
  ArrowRight,
  ArrowLeft,
  Cloud,
  CheckCircle2,
  Clock3,
  Copy,
  ExternalLink,
  Leaf,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "../../components/Button";
import { FieldInput } from "../../components/FieldInput";
import { SelectField } from "../../components/SelectField";
import { SurveyTile } from "../../components/SurveyTile";
import { HeroBuilderDemo } from "./HeroBuilderDemo";
import { SectionCard, QuestionBox } from "../SurveyBuilder/styles";
import { InstrumentCatalog } from "../SurveyBuilder/components/InstrumentCatalog";
import {
  MethodologyModal,
  type Methodology,
} from "../../components/MethodologyModal";
import {
  Header,
  Bar,
  QuestionCard,
  Options,
  Choice,
} from "../SurveyTaking/styles";
import { Grid, Stat, Panel } from "../SurveyDashboard/styles";
import { SavedMethodResult } from "../SurveyDashboard/components/MethodScoreSummary/SavedMethodResult";
import {
  demoInstruments,
  demoMethodologies,
  demoSection,
  demoPeople,
} from "./demoData";
import type { Section } from "../SurveyBuilder/types";
import { gsesInstrument } from "../../../../api/src/data/gses";
import ResearchDemo from "./ResearchDemo";
const DemoContext = createContext<{
  sample: string[];
  setSample: (ids: string[]) => void;
}>({ sample: [], setSample: () => {} });
export function DemoProvider({ children }: { children: ReactNode }) {
  const [sample, setSample] = useState<string[]>([]);
  return (
    <DemoContext.Provider value={{ sample, setSample }}>
      {children}
    </DemoContext.Provider>
  );
}
function CustomDemo() {
  const [title, setTitle] = useState("Вопросы о самочувствии"),
    [text, setText] = useState("Как вы оцениваете своё самочувствие сегодня?"),
    [type, setType] = useState("single"),
    [required, setRequired] = useState(true),
    [options, setOptions] = useState([
      "Хорошо",
      "Скорее хорошо",
      "Могло бы быть лучше",
    ]);
  return (
    <SectionCard className="landing-custom-demo">
      <div className="section-head">
        <div className="section-name">
          <b>{title || "Мой блок вопросов"}</b>
          <span>Собственный вопрос · без автоматического расчёта</span>
        </div>
      </div>
      <div className="body">
        <label className="field">
          Название собственного теста или блока
          <FieldInput
            aria-label="Название собственного блока"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <QuestionBox>
          <div className="question-head">
            <b>Вопрос 1</b>
          </div>
          <div className="question-row">
            <FieldInput
              aria-label="Текст своего вопроса"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <SelectField
              aria-label="Тип своего вопроса"
              value={type}
              options={[
                { value: "single", label: "Один вариант" },
                { value: "multiple", label: "Несколько вариантов" },
                { value: "text", label: "Текстовый ответ" },
                { value: "number", label: "Числовой ответ" },
              ]}
              onChange={(v) => setType(String(v))}
            />
          </div>
          {(type === "single" || type === "multiple") && (
            <div className="options">
              {options.map((option, i) => (
                <div className="option" key={i}>
                  <FieldInput
                    aria-label={`Вариант ответа ${i + 1}`}
                    value={option}
                    onChange={(e) =>
                      setOptions((old) =>
                        old.map((v, n) => (i === n ? e.target.value : v)),
                      )
                    }
                  />
                  <Button
                    aria-label={`Удалить вариант ${i + 1}`}
                    disabled={options.length <= 2}
                    onClick={() =>
                      setOptions((old) => old.filter((_, n) => n !== i))
                    }
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
              <Button
                className="add-option"
                onClick={() => setOptions((old) => [...old, ""])}
              >
                <Plus size={14} />
                Добавить вариант ответа
              </Button>
            </div>
          )}
          <label className="required">
            <input
              type="checkbox"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
            />
            Обязательный вопрос
          </label>
        </QuestionBox>
      </div>
    </SectionCard>
  );
}
function CatalogDemo() {
  const [catalogueTotal, setCatalogueTotal] = useState<number | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/public/catalogue-summary", { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Catalogue unavailable");
        return r.json();
      })
      .then((data) => {
        if (Number.isInteger(data.total) && data.total > 0)
          setCatalogueTotal(data.total);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const [query, setQuery] = useState(""),
    [sections, setSections] = useState<Section[]>([]),
    [methodology, setMethodology] = useState<Methodology | null>(null);
  return (
    <>
      <p className="inline-demo-note">
        Ниже — три примера из каталога платформы.
      </p>
      <InstrumentCatalog
        embedded
        instruments={demoInstruments}
        totalCount={catalogueTotal ?? undefined}
        methodologies={demoMethodologies}
        sections={sections}
        query={query}
        locked={false}
        onQueryChange={setQuery}
        onCreateCustom={() => {}}
        onShowMethodology={setMethodology}
        onAddInstrument={(i) => setSections((old) => [...old, demoSection(i)])}
      />
      {sections.length > 0 && (
        <p className="inline-demo-note" role="status">
          Добавлено в пример: {sections.map((s) => s.title).join(", ")}.{" "}
          <button className="inline-reset" onClick={() => setSections([])}>
            Очистить
          </button>
        </p>
      )}
      {methodology && (
        <MethodologyModal
          methodology={methodology}
          onClose={() => setMethodology(null)}
        />
      )}
    </>
  );
}
function ShareDemo() {
  const [archived, setArchived] = useState(false),
    [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(
        `${location.origin}/for-researchers#respondent`,
      );
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }
  return (
    <SurveyTile
      survey={{
        id: "landing-demo",
        slug: "landing-demo",
        title: "Самочувствие и поддержка",
        description: "Исследование самочувствия и социальной поддержки",
        status: archived ? "archived" : "active",
        responses: 12,
        completed: 12,
        createdAt: "2026-10-01T09:00:00Z",
      }}
    >
      <Button className="copy" onClick={() => void copy()}>
        <Copy size={14} />
        {copied ? "Скопировано" : "Скопировать ссылку"}
      </Button>
      <a className="open-survey-link" href="#respondent">
        <ExternalLink size={14} />
        Открыть
      </a>
      <Button onClick={() => setArchived(!archived)}>
        {archived ? "Возобновить" : "Завершить"}
      </Button>
      <a className="results-action" href="#results">
        Статистика
        <ArrowRight size={14} />
      </a>
    </SurveyTile>
  );
}
const takingQuestions = gsesInstrument.questions;
type DemoProgress = {
  index: number;
  answers: Record<number, string>;
  done: boolean;
};
function readDemoProgress(key: string): DemoProgress {
  try {
    const data = JSON.parse(localStorage.getItem(key) ?? "null");
    if (
      data &&
      Number.isInteger(data.index) &&
      data.index >= 0 &&
      data.index < takingQuestions.length &&
      data.answers &&
      typeof data.answers === "object" &&
      !Array.isArray(data.answers)
    )
      return {
        index: data.index,
        answers: Object.fromEntries(
          Object.entries(data.answers).map(([key,value])=>[key,String(value)] as const).filter(
            ([key, value]) =>
              Number.isInteger(Number(key)) &&
              Number(key) >= 0 &&
              Number(key) < takingQuestions.length &&
              ["1", "2", "3", "4"].includes(String(value)),
          ),
        ),
        done: data.done === true,
      };
  } catch {}
  return { index: 0, answers: {}, done: false };
}
function TakingDemo({ phone = false }: { phone?: boolean }) {
  const storageKey = `mindresearch:landing-taking:gses:${phone ? "phone" : "desktop"}:v1`;
  const [progress, setProgress] = useState(() => readDemoProgress(storageKey));
  const [leaving, setLeaving] = useState(false),
    [busy, setBusy] = useState(false),
    [saved, setSaved] = useState(true);
  const timers = useRef<number[]>([]),
    answering = useRef(false);
  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(progress));
      setSaved(true);
    } catch {
      setSaved(false);
    }
  }, [progress, storageKey]);
  const { index, answers, done } = progress;
  const q = takingQuestions[index];
  function choose(value: string) {
    if (answering.current) return;
    answering.current = true;
    setBusy(true);
    setProgress((old) => ({
      ...old,
      answers: { ...old.answers, [index]: value },
    }));
    timers.current.push(window.setTimeout(() => setLeaving(true), 320));
    timers.current.push(
      window.setTimeout(() => {
        setProgress((old) => ({
          ...old,
          index: index === takingQuestions.length - 1 ? index : index + 1,
          done: index === takingQuestions.length - 1,
        }));
        setLeaving(false);
        setBusy(false);
        answering.current = false;
      }, 500),
    );
  }
  return (
    <div className={`landing-taking-demo${phone ? " is-phone" : ""}`}>
      <Header>
        <Leaf size={18} />
        <span>mindresearch</span>
      </Header>
      <div className="demo-save-status">
        <Cloud size={12} />
        {saved ? "Сохранено в примере" : "Без сохранения в браузере"}
      </div>
      <Bar>
        <i
          style={{
            width: `${done ? 100 : ((index + 1) / takingQuestions.length) * 100}%`,
          }}
        />
      </Bar>
      {done ? (
        <div className="inline-taking-done">
          <h3>Спасибо за ответы</h3>
          <p>
            В настоящем опросе исследователь получит ответы автоматически. В
            этом примере они остались в вашем браузере.
          </p>
          <Button
            onClick={() => setProgress({ index: 0, answers: {}, done: false })}
          >
            Пройти ещё раз
          </Button>
        </div>
      ) : (
        <>
          <QuestionCard className="inline-question-card" $leaving={leaving}>
            <span className="eyebrow" aria-live="polite">
              Вопрос {index + 1} из {takingQuestions.length}
            </span>
            <div className="question">{q.text}</div>
            <Options>
              {q.options?.map((option) => (
                <Choice
                  key={`${index}-${option.value}`}
                  className="demo-answer"
                  $active={answers[index] === option.value}
                  disabled={busy}
                  aria-pressed={answers[index] === option.value}
                  onClick={() => choose(option.value)}
                >
                  <span className="option-label">{option.label}</span>
                </Choice>
              ))}
            </Options>
            <div className="inline-taking-nav">
              <Button
                aria-label="Предыдущий вопрос"
                disabled={!index || busy}
                onClick={() =>
                  setProgress((old) => ({ ...old, index: old.index - 1 }))
                }
              >
                <ArrowLeft size={16} />
              </Button>
            </div>
          </QuestionCard>
        </>
      )}
    </div>
  );
}
function OverviewDemo() {
  return (
    <div className="landing-overview-demo">
      <h3>Самочувствие и поддержка</h3>
      <Grid>
        <Stat>
          <Users />
          <div>
            <b>12</b>
            <span>всего участников</span>
          </div>
        </Stat>
        <Stat>
          <CheckCircle2 />
          <div>
            <b>12</b>
            <span>завершили</span>
          </div>
        </Stat>
        <Stat>
          <Clock3 />
          <div>
            <b>100%</b>
            <span>завершаемость</span>
          </div>
        </Stat>
      </Grid>
      <Panel>
        <h3>Ссылка для участников</h3>
        <div className="inline-overview-link">
          <FieldInput
            readOnly
            aria-label="Демонстрационная ссылка"
            value="mindresearch.pro/for-researchers#respondent"
          />
          <a className="landing-text-link" href="#respondent">
            Посмотреть прохождение
            <ArrowRight size={15} />
          </a>
        </div>
      </Panel>
    </div>
  );
}
export function DemoMedia({
  name,
  alt,
  className = "",
}: {
  name: string;
  alt: string;
  className?: string;
}) {
  const { sample, setSample } = useContext(DemoContext);
  let component: ReactNode;
  switch (name) {
    case "builder":
      component = <HeroBuilderDemo />;
      break;
    case "custom":
      component = <CustomDemo />;
      break;
    case "catalog":
      component = <CatalogDemo />;
      break;
    case "share":
      component = <ShareDemo />;
      break;
    case "desktop":
      component = <TakingDemo />;
      break;
    case "phone":
      component = <TakingDemo phone />;
      break;
    case "statistics":
      component = <OverviewDemo />;
      break;
    case "respondents":
      component = (
        <ResearchDemo view="results" sample={sample} onSaveSample={setSample} />
      );
      break;
    case "analysis":
      component = (
        <ResearchDemo
          view="analysis"
          sample={sample}
          onSaveSample={setSample}
        />
      );
      break;
    case "scales":
      component = (
        <SavedMethodResult
          group={demoPeople[0].groups.find((g) => g.code === "test_1")!}
        />
      );
      break;
    default:
      return null;
  }
  return (
    <figure
      className={`landing-picture landing-component ${className}`}
      aria-label={alt}
    >
      <div className={`landing-component-surface media-${name}`}>
        {component}
      </div>
      <figcaption>Живой пример интерфейса · вымышленные данные</figcaption>
    </figure>
  );
}
