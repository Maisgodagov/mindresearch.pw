import { createContext, useContext, useState, type ReactNode } from "react";
import {
  ArrowRight,
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
import survey from "../../../../api/src/data/survey.json";
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
  const [query, setQuery] = useState(""),
    [sections, setSections] = useState<Section[]>([]),
    [methodology, setMethodology] = useState<Methodology | null>(null);
  return (
    <>
      <InstrumentCatalog
        embedded
        instruments={demoInstruments}
        totalCount={demoInstruments.length}
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
const supportQuestions = survey.find((s) => s.code === "test_1")!.questions;
function TakingDemo({ phone = false }: { phone?: boolean }) {
  const [index, setIndex] = useState(0),
    [answers, setAnswers] = useState<Record<number, string>>({}),
    [done, setDone] = useState(false);
  const q = supportQuestions[index];
  return (
    <div className={`landing-taking-demo${phone ? " is-phone" : ""}`}>
      <Header>
        <Leaf size={18} />
        mindresearch
      </Header>
      <Bar>
        <i
          style={{
            width: `${(Object.keys(answers).length / supportQuestions.length) * 100}%`,
          }}
        />
      </Bar>
      {done ? (
        <div className="inline-taking-done">
          <h3>Спасибо за ответы</h3>
          <p>Это пример прохождения. Ответы не отправлялись.</p>
          <Button
            onClick={() => {
              setDone(false);
              setIndex(0);
              setAnswers({});
            }}
          >
            Пройти ещё раз
          </Button>
        </div>
      ) : (
        <>
          <QuestionCard className="inline-question-card" $leaving={false}>
            <span className="eyebrow">
              Вопрос {index + 1} из {supportQuestions.length}
            </span>
            <h3 className="question">{q.text}</h3>
            <Options>
              {q.options?.map((option) => (
                <Choice
                  key={option.value}
                  $active={answers[index] === option.value}
                  aria-pressed={answers[index] === option.value}
                  onClick={() =>
                    setAnswers((old) => ({ ...old, [index]: option.value }))
                  }
                >
                  {option.label}
                </Choice>
              ))}
            </Options>
            <div className="inline-taking-nav">
              <Button disabled={!index} onClick={() => setIndex(index - 1)}>
                Назад
              </Button>
              <Button
                disabled={!answers[index]}
                onClick={() =>
                  index === supportQuestions.length - 1
                    ? setDone(true)
                    : setIndex(index + 1)
                }
              >
                {index === supportQuestions.length - 1 ? "Завершить" : "Далее"}
                <ArrowRight size={15} />
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
