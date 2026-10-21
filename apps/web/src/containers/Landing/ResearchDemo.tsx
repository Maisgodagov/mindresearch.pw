import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Button } from "../../components/Button";
import { SelectField } from "../../components/SelectField";
import { RespondentResults } from "../SurveyDashboard/components/RespondentResults";
import {
  demoInstruments,
  demoPeople,
  demoVariables,
  personValue,
  descriptive,
  correlation,
} from "./demoData";
const fmt = (n: number | null) =>
  n === null ? "—" : n.toLocaleString("ru-RU", { maximumFractionDigits: 3 });
export default function ResearchDemo({
  view,
  sample,
  onSaveSample,
}: {
  view: "results" | "analysis";
  sample: string[];
  onSaveSample: (ids: string[]) => void;
}) {
  const [notice, setNotice] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({}),
    [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [sort, setSort] = useState({
      key: "alias",
      direction: "asc" as "asc" | "desc",
    }),
    [exporting, setExporting] = useState(false);
  const [group, setGroup] = useState("all"),
    [method, setMethod] = useState("description"),
    [variable, setVariable] = useState("test_19"),
    [second, setSecond] = useState("test_1");
  const [checked, setChecked] = useState(false),
    [calculated, setCalculated] = useState(false);
  useEffect(() => {
    setChecked(false);
    setCalculated(false);
  }, [sample]);
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
  return (
    <div className="landing-data-demo">
      {notice && (
        <p className="demo-notice" role="status">
          {notice}
        </p>
      )}{" "}
      {view === "results" && (
        <>
          <div className="demo-result-actions">
            <span>12 участников · 3 методики</span>
            <Button
              disabled={!chosen.length}
              onClick={() => {
                onSaveSample(chosen.map((p) => p.id));
                setNotice(
                  `Выборка из ${chosen.length} участников готова. Выберите её в блоке статистического анализа ниже.`,
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
      {view === "analysis" && (
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
                показаны только вычисленные описательные значения, без выводов о
                значимости.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
