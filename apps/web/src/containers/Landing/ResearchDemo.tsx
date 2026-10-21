import { useState } from "react";
import { ArrowDown, ArrowUp, Eye, Trash2, Save } from "lucide-react";
import { SurveyBuilderToolbar } from "../SurveyBuilder/components/SurveyBuilderToolbar";
import { SectionCard } from "../SurveyBuilder/styles";
import { BuilderPreview } from "../../components/BuilderPreview";
import {
  MethodologyModal,
  type Methodology,
} from "../../components/MethodologyModal";
import { Button } from "../../components/Button";
import { SelectField } from "../../components/SelectField";
import { RespondentResults } from "../SurveyDashboard/components/RespondentResults";
import {
  demoInstruments,
  demoMethodologies,
  demoSection,
  initialSections,
  demoPeople,
  demoVariables,
  personValue,
  descriptive,
  correlation,
  previewQuestions,
} from "./demoData";

const stages = ["Собрать опрос", "Пройти", "Результаты", "Статистика"];
const hints = [
  "Добавьте методику или свой вопрос. Изменения остаются только в этом примере.",
  "Посмотрите, как участник увидит опрос. Здесь сокращённый пример: по одному вопросу из каждой методики.",
  "Выберите участников, отсортируйте данные или скачайте настоящий Excel с вымышленными результатами.",
  "Проверьте расчёт на исходных значениях. В примере доступны описательные показатели и коэффициент Пирсона.",
];
const fmt = (n: number | null) =>
  n === null ? "—" : n.toLocaleString("ru-RU", { maximumFractionDigits: 3 });
export default function ResearchDemo() {
  const [stage, setStage] = useState(0),
    [title, setTitle] = useState("Самоэффективность и социальная поддержка"),
    [description, setDescription] = useState("");
  const [sections, setSections] = useState(initialSections),
    [query, setQuery] = useState(""),
    [own, setOwn] = useState("Что помогает вам справляться с трудностями?");
  const [preview, setPreview] = useState(false),
    [methodology, setMethodology] = useState<Methodology | null>(null),
    [notice, setNotice] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({}),
    [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [sort, setSort] = useState({
      key: "alias",
      direction: "asc" as "asc" | "desc",
    }),
    [exporting, setExporting] = useState(false);
  const [sample, setSample] = useState<string[]>([]),
    [group, setGroup] = useState("all"),
    [method, setMethod] = useState("description"),
    [variable, setVariable] = useState("test_19"),
    [second, setSecond] = useState("test_1");
  const [checked, setChecked] = useState(false),
    [calculated, setCalculated] = useState(false);
  const chosen = demoPeople.filter((p) => selected[p.id]);
  const people = [...demoPeople].sort((a, b) => {
    const x = sort.key === "age" ? (a.age ?? 0) : a.alias,
      y = sort.key === "age" ? (b.age ?? 0) : b.alias;
    return (
      (typeof x === "number" && typeof y === "number"
        ? x - y
        : String(x).localeCompare(String(y))) *
      (sort.direction === "asc" ? 1 : -1)
    );
  });
  const rows =
    group === "saved"
      ? demoPeople.filter((p) => sample.includes(p.id))
      : demoPeople;
  const values = rows.map((p) => personValue(p, variable));
  const summary = descriptive(values);
  const change = () => {
    setChecked(false);
    setCalculated(false);
  };
  const resultSections = demoInstruments.map((i) => ({
    code: i.code!,
    title: i.title,
    sectionKind: "verified",
  }));
  async function exportExcel() {
    setExporting(true);
    try {
      const { exportRespondents } = await import("../../admin/exportResults");
      await exportRespondents(
        chosen.length ? chosen : demoPeople,
        resultSections,
      );
    } catch {
      setNotice("Не удалось скачать файл. Попробуйте ещё раз.");
    } finally {
      setExporting(false);
    }
  }
  function move(index: number, offset: number) {
    setSections((old) => {
      const next = [...old];
      [next[index], next[index + offset]] = [next[index + offset], next[index]];
      return next;
    });
  }
  return (
    <div className="research-demo">
      <div className="demo-caption">
        <span className="demo-live" />
        Интерактивный пример <span>Все данные вымышлены</span>
      </div>
      <div className="demo-tabs" role="tablist" aria-label="Этап исследования">
        {stages.map((label, i) => (
          <button
            key={label}
            id={`demo-tab-${i}`}
            role="tab"
            aria-selected={stage === i}
            aria-controls="demo-panel"
            tabIndex={stage === i ? 0 : -1}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                const next = (i + (e.key === "ArrowRight" ? 1 : 3)) % 4;
                setStage(next);
                document.getElementById(`demo-tab-${next}`)?.focus();
              }
            }}
            onClick={() => {
              setStage(i);
              setNotice("");
            }}
          >
            <span>{i + 1}</span>
            {label}
          </button>
        ))}
      </div>
      <div
        className="demo-panel"
        id="demo-panel"
        role="tabpanel"
        aria-labelledby={`demo-tab-${stage}`}
      >
        <p className="demo-hint">{hints[stage]}</p>
        {notice && (
          <p className="demo-notice" role="status">
            {notice}
          </p>
        )}
        {stage === 0 && (
          <div className="demo-builder">
            <div className="demo-sections">
              <h3>Содержание опроса</h3>
              {sections.map((section, i) => (
                <SectionCard key={section.id}>
                  <header className="section-head">
                    <div className="section-name">
                      <b>{section.title}</b>
                      <span>
                        {section.kind === "custom"
                          ? "Ваш вопрос"
                          : `${section.questionCount} вопросов · готовая методика`}
                      </span>
                    </div>
                    <div className="demo-order">
                      <button
                        aria-label={`Поднять ${section.title}`}
                        disabled={i === 0}
                        onClick={() => move(i, -1)}
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button
                        aria-label={`Опустить ${section.title}`}
                        disabled={i === sections.length - 1}
                        onClick={() => move(i, 1)}
                      >
                        <ArrowDown size={16} />
                      </button>
                      <button
                        aria-label={`Удалить ${section.title}`}
                        onClick={() =>
                          setSections((old) =>
                            old.filter((s) => s.id !== section.id),
                          )
                        }
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </header>
                  {section.kind === "custom" && (
                    <label className="demo-own">
                      Текст вопроса
                      <textarea
                        value={own}
                        onChange={(e) => setOwn(e.target.value)}
                      />
                    </label>
                  )}
                </SectionCard>
              ))}
              {!sections.length && (
                <p>Добавьте методику из каталога или создайте свой вопрос.</p>
              )}
            </div>
            <SurveyBuilderToolbar
              title={title}
              description={description}
              titleInvalid={!title.trim()}
              onTitleChange={setTitle}
              onDescriptionChange={setDescription}
              instruments={demoInstruments}
              methodologies={demoMethodologies}
              sections={sections}
              query={query}
              locked={false}
              previewLoading={false}
              previewError=""
              saving={false}
              publishImmediately={false}
              canChangeStatus={false}
              onQueryChange={setQuery}
              onCreateCustom={() =>
                setSections((old) =>
                  old.some((s) => s.kind === "custom")
                    ? old
                    : [
                        ...old,
                        {
                          id: "demo-own",
                          kind: "custom",
                          title: "Мой блок вопросов",
                          questionCount: 1,
                        },
                      ],
                )
              }
              onShowMethodology={setMethodology}
              onAddInstrument={(i) =>
                setSections((old) =>
                  old.some((s) => s.instrumentId === i.id)
                    ? old
                    : [...old, demoSection(i)],
                )
              }
              onPreview={() => setPreview(true)}
              onPublishChange={() => {}}
              onSave={() =>
                setNotice(
                  "В примере опрос изменяется только в браузере. Чтобы сохранить своё исследование, создайте аккаунт.",
                )
              }
            />
          </div>
        )}
        {stage === 1 && (
          <div className="demo-invitation">
            <h3>{title || "Ваше исследование"}</h3>
            <p>
              Участнику достаточно ссылки. Он видит понятные вопросы, прогресс и
              завершение опроса — без создания аккаунта.
            </p>
            <Button
              disabled={!sections.length}
              onClick={() => setPreview(true)}
            >
              <Eye size={17} />
              Открыть пример прохождения
            </Button>
            <small>
              Ответы в этом примере не отправляются и не меняют демонстрационные
              результаты.
            </small>
          </div>
        )}
        {stage === 2 && (
          <>
            <div className="demo-result-actions">
              <span>12 участников · 3 методики</span>
              <Button
                disabled={!chosen.length}
                onClick={() => {
                  setSample(chosen.map((p) => p.id));
                  setNotice(
                    `Выборка из ${chosen.length} участников готова. Откройте «Статистика» и выберите её.`,
                  );
                  change();
                }}
              >
                <Save size={16} />
                Сохранить выборку{chosen.length ? ` · ${chosen.length}` : ""}
              </Button>
            </div>
            <RespondentResults
              storageKey="mindresearch:demo:results-table:v1"
              sortKey={sort.key}
              sortDirection={sort.direction}
              methodSortOptions={[]}
              onColumnSort={(key, direction) => setSort({ key, direction })}
              readOnly
              showAge
              respondents={people}
              totalCount={12}
              qualities={{}}
              deletedRespondents={[]}
              sections={resultSections}
              selected={selected}
              deletedSelected={{}}
              expanded={expanded}
              allSelected={chosen.length === 12}
              selectedCount={chosen.length}
              trashOpen={false}
              exporting={exporting}
              updatingTrash={false}
              adminView={false}
              onSelectAll={(value) =>
                setSelected(
                  Object.fromEntries(demoPeople.map((p) => [p.id, value])),
                )
              }
              onSelectRespondent={(id, value) =>
                setSelected((old) => ({ ...old, [id]: value }))
              }
              onSelectDeleted={() => {}}
              onToggleExpanded={(id) =>
                setExpanded((old) => ({ ...old, [id]: !old[id] }))
              }
              onToggleTrash={() => {}}
              onDeleteSelected={() => {}}
              onExport={() => void exportExcel()}
              onRestore={() => {}}
              renderMethodHelp={() => null}
              renderMethodResult={(g) => {
                const v = g?.result?.values;
                return v ? (
                  <strong>
                    {fmt(
                      Number(
                        g?.code === "test_1"
                          ? (v.overall as { score: number }).score
                          : v.score,
                      ),
                    )}
                  </strong>
                ) : (
                  "—"
                );
              }}
              getRespondentGroups={(p) => p.groups}
              renderRespondentDetails={(p) => (
                <p>
                  Демонстрационный участник · {p.age} лет. Показаны вымышленные
                  итоговые баллы трёх методик.
                </p>
              )}
            />
          </>
        )}
        {stage === 3 && (
          <div className="demo-statistics">
            <div className="demo-fields">
              <label>
                Метод расчёта
                <SelectField
                  aria-label="Метод расчёта"
                  value={method}
                  options={[
                    { value: "description", label: "Описательная статистика" },
                    { value: "pearson", label: "Корреляция Пирсона" },
                  ]}
                  onChange={(v) => {
                    setMethod(String(v));
                    change();
                  }}
                />
              </label>
              <label>
                Выборка
                <SelectField
                  aria-label="Выборка"
                  value={group}
                  options={[
                    { value: "all", label: "Все 12 участников" },
                    ...(sample.length
                      ? [
                          {
                            value: "saved",
                            label: `Моя выборка · ${sample.length}`,
                          },
                        ]
                      : []),
                  ]}
                  onChange={(v) => {
                    setGroup(String(v));
                    change();
                  }}
                />
              </label>
              <label>
                Показатель
                <SelectField
                  aria-label="Показатель"
                  value={variable}
                  options={demoVariables.map((v) => ({
                    value: v.id,
                    label: v.label,
                  }))}
                  onChange={(v) => {
                    setVariable(String(v));
                    if (String(v) === second)
                      setSecond(
                        demoVariables.find((x) => x.id !== String(v))!.id,
                      );
                    change();
                  }}
                />
              </label>
              {method === "pearson" && (
                <label>
                  Второй показатель
                  <SelectField
                    aria-label="Второй показатель"
                    value={second}
                    options={demoVariables
                      .filter((v) => v.id !== variable)
                      .map((v) => ({ value: v.id, label: v.label }))}
                    onChange={(v) => {
                      setSecond(String(v));
                      change();
                    }}
                  />
                </label>
              )}
            </div>
            <div className="demo-calculate">
              <Button
                onClick={() => {
                  setChecked(true);
                  setCalculated(false);
                }}
              >
                Проверить данные
              </Button>
              {checked && (
                <Button onClick={() => setCalculated(true)}>Рассчитать</Button>
              )}
            </div>
            {checked && (
              <div className="demo-audit">
                <h3>Проверка перед расчётом</h3>
                <p>
                  Включено: {rows.length}. Пропусков: 0. Все значения —
                  демонстрационные.
                </p>
                <details>
                  <summary>Посмотреть исходные значения</summary>
                  <table>
                    <thead>
                      <tr>
                        <th>Участник</th>
                        <th>Показатель 1</th>
                        {method === "pearson" && <th>Показатель 2</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((p) => (
                        <tr key={p.id}>
                          <td>{p.alias}</td>
                          <td>{fmt(personValue(p, variable))}</td>
                          {method === "pearson" && (
                            <td>{fmt(personValue(p, second))}</td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </details>
              </div>
            )}
            {calculated && summary && (
              <div className="demo-calculated" role="status">
                <h3>
                  {method === "description"
                    ? "Описательная статистика"
                    : "Коэффициент корреляции Пирсона"}
                </h3>
                <div className="demo-metrics">
                  {(method === "description"
                    ? [
                        ["Участников", summary.n],
                        ["Среднее", summary.mean],
                        ["Медиана", summary.median],
                        ["Стандартное отклонение", summary.sd],
                      ]
                    : [
                        ["Участников", rows.length],
                        [
                          "r Пирсона",
                          correlation(
                            values,
                            rows.map((p) => personValue(p, second)),
                          ),
                        ],
                      ]
                  ).map(([label, value]) => (
                    <div key={String(label)}>
                      <strong>{fmt(value as number | null)}</strong>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
                <details>
                  <summary>Формула расчёта</summary>
                  <p>
                    {method === "description"
                      ? "Среднее = Σx / n. Стандартное отклонение = √(Σ(x − среднее)² / (n − 1)). Медиана — центральное значение упорядоченного ряда; для чётного n — среднее двух центральных."
                      : "r = Σ((x − среднее x)(y − среднее y)) / √(Σ(x − среднее x)² · Σ(y − среднее y)²). Значения сопоставляются по одному участнику."}
                  </p>
                </details>
                <p className="demo-hint">
                  Это упрощённый пример. В рабочем разделе доступны настройки
                  гипотез, проверки применимости и подробные отчёты; здесь
                  показаны только вычисленные описательные значения, без выводов
                  о значимости.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      {preview && (
        <BuilderPreview
          closeLabel="Вернуться к примеру"
          meta={{
            welcomeTitle: title || "Пример опроса",
            welcomeText:
              "Сокращённая демонстрация: по одному вопросу из каждой выбранной методики. Ответы не сохраняются.",
            showAuthor: false,
            resultPresentation: {
              title: "Так выглядит завершение опроса",
              text: "Спасибо! В вашем исследовании здесь будет заданный вами текст и, при необходимости, результаты.",
              showScores: false,
            },
          }}
          questions={previewQuestions(sections, own)}
          onClose={() => setPreview(false)}
        />
      )}
      {methodology && (
        <MethodologyModal
          methodology={methodology}
          onClose={() => setMethodology(null)}
        />
      )}
    </div>
  );
}
