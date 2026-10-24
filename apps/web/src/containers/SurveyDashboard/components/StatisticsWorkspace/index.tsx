import { StatisticsResult } from "./StatisticsResult";
import { Modal } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  FileText,
  Pencil,
  CheckCircle2,
  Columns2,
  Calculator,
  Download,
  Plus,
  RefreshCw,
  Users,
  Trash2,
} from "lucide-react";
import { SkeletonScreen } from "../../../../components/LoadingSkeleton";
import { SelectField } from "../../../../components/SelectField";
import { api } from "../../../../api";
import { ResultsAction as Button } from "../ResultsAction";
import { getApiErrorMessage } from "../../../../utils/apiErrors";
import type { Analysis, Input, Model, Sample, Output } from "./types";
import { Workspace } from "./styles";

const number = (value: number | null | undefined) =>
  value == null
    ? "—"
    : value.toLocaleString("ru-RU", { maximumFractionDigits: 5 });
const probability = (p: number | null | undefined) =>
  p == null ? "—" : p < 0.000001 ? "< 0,000001" : number(p);
const statuses = {
  queued: "В очереди",
  running: "Выполняется",
  completed: "Готово",
  failed: "Не рассчитано",
};
type Props = {
  surveyId: string;
  onClose: () => void;
};
type Choice = { sampleId: string; variableId: string };

export default function StatisticsWorkspace({ surveyId, onClose }: Props) {
  const url = `/admin/surveys/${surveyId}/statistics`;
  const [model, setModel] = useState<Model | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const [pendingCalculation, setPendingCalculation] = useState<
    "preview" | "calculate" | null
  >(null);
  const [tab, setTab] = useState<"samples" | "new" | "history">("samples");
  const [sampleName, setSampleName] = useState("");
  const [deleting, setDeleting] = useState<Analysis | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [editing, setEditing] = useState<Sample | null>(null),
    [members, setMembers] = useState<string[]>([]),
    [search, setSearch] = useState(""),
    [candidateOnly, setCandidateOnly] = useState(false);
  const [method, setMethod] = useState("descriptive"),
    [choices, setChoices] = useState<Choice[]>([
      { sampleId: "", variableId: "" },
    ]);
  const [vectors, setVectors] = useState<Record<string, string>>({});
  const [matrixData, setMatrixData] = useState("");
  const [matrixSource, setMatrixSource] = useState("");
  const [parameters, setParameters] = useState<Record<string, string>>({});
  const [alpha, setAlpha] = useState("0.05"),
    [mu, setMu] = useState("0"),
    [name, setName] = useState("");
  const [preview, setPreview] = useState<{
      input: Input;
      hash: string;
      requestId: string;
    } | null>(null),
    [report, setReport] = useState<Analysis | null>(null),
    [reportTab, setReportTab] = useState("result");
  const [compareIds, setCompareIds] = useState<string[]>([]),
    [comparison, setComparison] = useState<Analysis[]>([]);
  const heading = useRef<HTMLHeadingElement>(null);
  const load = useCallback(async () => {
    const response = await api.get<Model>(url);
    setModel(response.data);
    return response.data;
  }, [url]);
  useEffect(() => {
    let cancelled = false;
    api
      .get<Model>(url)
      .then((r) => {
        if (!cancelled) setModel(r.data);
      })
      .catch((e) => {
        if (!cancelled)
          setError(getApiErrorMessage(e, "Не удалось загрузить статистику."));
      });
    heading.current?.focus();
    return () => {
      cancelled = true;
    };
  }, [url]);
  useEffect(() => {
    if (
      !model?.analyses.some(
        (a) => a.status === "queued" || a.status === "running",
      )
    )
      return;
    let cancelled = false;
    const timer = setInterval(() => {
      void api
        .get<Analysis[]>(`${url}/analyses`)
        .then(async (r) => {
          if (cancelled) return;
          let updatedReport: Analysis | undefined;
          if (
            report &&
            r.data.find((a) => a.id === report.id)?.status !== report.status
          ) {
            const response = await api.get<Analysis>(
              `${url}/analyses/${report.id}`,
            );
            updatedReport = response.data;
          }
          if (cancelled) return;
          setModel((m) => (m ? { ...m, analyses: r.data } : m));
          if (updatedReport) setReport(updatedReport);
        })
        .catch(() => {
          if (!cancelled)
            setError(
              "Не удалось обновить статус. Проверьте соединение и нажмите «Обновить».",
            );
        });
    }, 2000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [model?.analyses, report?.id, report?.status, url]);
  async function perform(
    action: () => Promise<void>,
    calculation?: "preview" | "calculate",
  ) {
    if (calculation) setPendingCalculation(calculation);
    setError("");
    setBusy(true);
    try {
      await action();
    } catch (e) {
      setError(
        getApiErrorMessage(
          e,
          "Не удалось выполнить действие. Попробуйте ещё раз.",
        ),
      );
    } finally {
      if (calculation) setPendingCalculation(null);
      setBusy(false);
    }
  }
  function invalidate() {
    setPreview(null);
  }
  const selectedMethod = model?.methods.find((m) => m.id === method);
  const kind = selectedMethod?.kind ?? "single";
  const linked = ["paired", "repeated", "multivariate"].includes(kind);
  const config = () => ({
    method,
    alpha: Number(alpha),
    mu: Number(mu),
    vectors: Object.fromEntries((selectedMethod?.vectors ?? []).map(v => [v.key, (vectors[v.key] ?? "").split(/[;\s,]+/).filter(Boolean).map(Number)])),
    parameters: Object.fromEntries((selectedMethod?.parameters ?? []).map(p => [p.key, Number(parameters[p.key] ?? p.value)])),
    name,
    manual: {},
    matrixData: kind === "manual" ? matrixData : "",
    manualReason: kind === "manual" ? matrixSource : "",
    groups: choices.map((c) => ({
      sampleId: c.sampleId,
      variableId: c.variableId,
      revision: model?.samples.find((s) => s.id === c.sampleId)?.revision,
    })),
  });
  async function openReport(id: string) {
    await perform(async () => {
      const r = await api.get<Analysis>(`${url}/analyses/${id}`);
      setReport(r.data);
      setReportTab("result");
      setComparison([]);
      setTab("history");
    });
  }
  function start(sample?: Sample) {
    setTab("new");
    setReport(null);
    setPreview(null);
    setChoices([
      {
        sampleId: sample?.id ?? model?.samples[0]?.id ?? "",
        variableId: model?.variables[0]?.id ?? "",
      },
    ]);
    setMethod("descriptive");
  }
  function chooseMethod(id: string) {
    setMethod(id);
    setParameters({});
    setVectors({});
    invalidate();
    const next = model?.methods.find((m) => m.id === id);
    const count = next?.kind === "manual" ? 0 : next?.minInputs ?? (next?.kind === "single" ? 1 : 2);
    setChoices((previous) =>
      Array.from(
        { length: count },
        (_, i) =>
          previous[i] ?? {
            sampleId: previous[0]?.sampleId ?? "",
            variableId: "",
          },
      ),
    );
  }
  async function exportReport(a: Analysis) {
    await perform(async () => {
      if (!a.result || !a.input) return;
      const { default: ExcelJS } = await import("exceljs");
      const workbook = new ExcelJS.Workbook();
      const result = workbook.addWorksheet("Результат");
      result.addRows([
        ["Название", a.name],
        ["Статистика", a.result.statisticLabel ?? ""],
        ["Значение", a.result.statistic],
        ["p", a.result.p],
        ["α", a.input.config.alpha],
        ["Эффект", a.result.effect],
        ["Тип эффекта", a.result.effectLabel ?? ""],
        ["ДИ", a.result.ci?.join(" … ") ?? ""],
        [],
        [
          "Группа / показатель",
          "N",
          "Среднее",
          "Медиана",
          "SD",
          "Минимум",
          "Максимум",
          "Дисперсия",
          "Q₁",
          "Q₃",
          "IQR",
        ],
        ...a.result.summary.map((s) => [
          s.label,
          s.n,
          s.mean,
          s.median,
          s.sd,
          s.min,
          s.max,
          s.variance,
          s.q1,
          s.q3,
          s.q3 - s.q1,
        ]),
      ]);
      if (a.result.modes)
        result.addRow([
          "Моды",
          a.result.modes.join(", "),
          "Частота",
          a.result.modeFrequency,
        ]);
      if (a.result.skewness !== undefined)
        result.addRow(["Асимметрия", a.result.skewness]);
      if (a.result.excess !== undefined)
        result.addRow(["Эксцесс", a.result.excess]);
      const data = workbook.addWorksheet("Данные");
      data.addRow([
        "Группа / показатель",
        "Версия",
        "ID",
        "Участник",
        "Значение",
        "Источник",
      ]);
      for (const g of a.input.groups) {
        if (g.variable.categories?.length) {
          data.addRow([g.label, "Коды категорий"]);
          for (const category of g.variable.categories) data.addRow(["", category.code, "", category.label]);
        }
        for (const row of g.included)
          data.addRow([
            g.label,
            g.revision,
            row.id,
            row.alias,
            row.value,
            row.manual ? "Введено вручную" : "Опрос",
          ]);
        for (const row of g.excluded)
          data.addRow([g.label, g.revision, row.id, "", null, row.reason]);
      }
      if (a.input.config.matrixData) {
        const matrices = Array.isArray(a.input.config.matrixData[0]?.[0]) ? a.input.config.matrixData as number[][][] : [a.input.config.matrixData as number[][]];
        for (const [i, matrix] of matrices.entries()) { const sheet = workbook.addWorksheet(`Матрица ${i + 1}`); sheet.addRows(matrix); }
      }
      const trace = workbook.addWorksheet("Расчёт");
      trace.addRows([
        [a.result.formula],
        ...a.result.steps.map((s) => [s]),
        ...a.result.warnings.map((s) => ["Ограничение", s]),
      ]);
      if (a.result.ranks)
        for (let i = 0; i < a.result.ranks.length; i++) {
          trace.addRow(["Ранги", i + 1]);
          a.result.ranks[i].forEach((rank, j) => trace.addRow([j + 1, rank]));
        }
      const settings = workbook.addWorksheet("Настройки");
      settings.addRows([
        ["Метод", a.input.config.method],
        ["Гипотеза", a.result.alternative ?? "two-sided"],
        ["α", a.input.config.alpha],
        ["μ₀", a.input.config.mu ?? ""],
        ["Снимок", a.input.snapshotAt],
        ["Движок", a.result.engine],
        ["SciPy", a.result.scipy],
        ["NumPy", a.result.numpy],
        ["Python", a.result.python],
        ["Правила", a.input.policy],
        ["Ручной источник", a.input.manualReason],
      ]);
      if (a.result.implementation) settings.addRow(["Версия реализации · SHA-256", a.result.implementation]);
      for (const reference of a.result.references ?? []) trace.addRow([reference.title, reference.url]);
      for (const [key, value] of Object.entries(a.input.config.vectors ?? {})) settings.addRow([key, value.join(", ")]);
      for (const [key, value] of Object.entries(a.input.config.parameters ?? {})) settings.addRow([key, value]);
      for (const [key, value] of Object.entries(a.result.packages ?? {})) settings.addRow([key, value]);
      for (const [index, t] of (a.result.tables ?? []).entries()) {
        const sheet = workbook.addWorksheet(`Таблица ${index + 1}`);
        sheet.addRow([t.title]);
        sheet.addRow(t.columns);
        sheet.addRows(t.rows);
      }
      for (const sheet of workbook.worksheets) {
        sheet.views = [{ state: "frozen", ySplit: 1 }];
        sheet.columns.forEach((c, i) => {
          c.width = i === 0 ? 48 : 24;
        });
        sheet.getRow(1).font = { bold: true };
      }
      const blob = new Blob([(await workbook.xlsx.writeBuffer()) as BlobPart], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        href = URL.createObjectURL(blob),
        link = document.createElement("a");
      link.href = href;
      link.download = "mindresearch-analysis.xlsx";
      link.click();
      setTimeout(() => URL.revokeObjectURL(href), 1000);
    });
  }
  const conditionDescription = (sample: Sample) =>
    [
      sample.definition.completedOnly
        ? "Завершённые прохождения"
        : "Все статусы",
      ...sample.definition.conditions.map(
        (c) =>
          `${c.title}: ${c.values?.join(", ") ?? `${c.min ?? "…"}–${c.max ?? "…"}`}`,
      ),
    ].join(" · ");
  return (
    <Workspace aria-label="Статистический анализ" data-view={tab}>
      <div className="workspace-head">
        <div>
          <div className="workspace-title">
            <h2 ref={heading} tabIndex={-1}>
              Статистический анализ
            </h2>
          </div>
          <p className="muted">
            Сохраните выборки, выберите показатели и проверьте расчёт до
            исходных значений.
          </p>
        </div>
        <Button onClick={onClose}>
          <ArrowLeft size={15} />К респондентам
        </Button>
      </div>
      <nav
        className="tabs workspace-tabs"
        aria-label="Разделы статистики"
        role="tablist"
        onKeyDown={(event) => {
          const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
          if (!keys.includes(event.key)) return;
          const buttons = Array.from(
            event.currentTarget.querySelectorAll<HTMLButtonElement>(
              "[role=tab]",
            ),
          );
          const current = buttons.indexOf(event.target as HTMLButtonElement);
          const next =
            event.key === "Home"
              ? 0
              : event.key === "End"
                ? buttons.length - 1
                : (current +
                    (event.key === "ArrowRight" ? 1 : -1) +
                    buttons.length) %
                  buttons.length;
          event.preventDefault();
          buttons[next]?.focus();
          buttons[next]?.click();
        }}
      >
        {(
          [
            ["samples", "Выборки"],
            ["new", "Новый расчёт"],
            ["history", "История расчётов"],
          ] as const
        ).map(([key, label]) => (
          <button
            role="tab"
            aria-selected={tab === key}
            key={key}
            onClick={() => {
              setTab(key);
              setError("");
            }}
          >
            {key === "samples" ? (
              <Users size={16} aria-hidden="true" />
            ) : key === "new" ? (
              <Calculator size={16} aria-hidden="true" />
            ) : (
              <Clock3 size={16} aria-hidden="true" />
            )}
            {label}
            {key === "samples" && model ? ` · ${model.samples.length}` : ""}
          </button>
        ))}
      </nav>
      {error && (
        <div className="error" role="alert">
          {error}{" "}
          <button
            className="text-button"
            disabled={busy}
            onClick={() =>
              void perform(async () => {
                await load();
              })
            }
          >
            Обновить
          </button>
        </div>
      )}
      {!model ? (
        <div className="body" role="status">
          {error ? (
            "Загрузка не завершена."
          ) : (
            <SkeletonScreen
              variant="table"
              heading={false}
              label="Загрузка выборок и расчётов"
            />
          )}
        </div>
      ) : (
        <div className="body">
          {!model.canWrite && (
            <p className="notice">
              Режим просмотра. Создавать выборки и расчёты может автор опроса
              или редактор с ролью admin/owner.
            </p>
          )}
          {tab === "samples" && (
            <>
              <div className="toolbar">
                <div>
                  <h3>Ваши выборки</h3>
                  <p className="muted">
                    Состав фиксируется. Новые участники добавляются только по
                    вашему решению.
                  </p>
                </div>
                <div className="actions">
                  <Button
                    disabled={busy}
                    onClick={() =>
                      void perform(async () => {
                        await load();
                      })
                    }
                  >
                    <RefreshCw size={14} />
                    Обновить
                  </Button>
                </div>
              </div>
              {!model.samples.length && (
                <div className="empty">
                  <Users size={28} />
                  <h3>Начните с первой выборки</h3>
                  <p className="muted">
                    Вернитесь к респондентам и настройте возраст или ответы для
                    отбора. Можно сохранить и весь опрос без дополнительных
                    условий.
                  </p>
                  {model.canWrite && (
                    <Button $emphasized onClick={onClose}>
                      К респондентам
                    </Button>
                  )}
                </div>
              )}
              {model.samples.length > 0 && (
                <div className="list-caption" aria-hidden="true">
                  <span>Выборка и условия</span>
                  <span>Состав</span>
                  <span>Действия</span>
                </div>
              )}
              {model.samples.map((sample) => (
                <div key={sample.id} className="sample-row">
                  <div className="sample-details">
                    <span className="sample-symbol">
                      <Users size={19} aria-hidden="true" />
                    </span>
                    <div>
                      <h3>
                        {sample.name}{" "}
                        <span className="version">· v{sample.revision}</span>
                      </h3>
                      <p>{conditionDescription(sample)}</p>
                      {sample.candidates.length > 0 && (
                        <small>
                          {sample.candidates.length} подходящих участников ещё
                          не добавлены
                        </small>
                      )}
                      {sample.unavailable.length > 0 && (
                        <small>
                          {sample.unavailable.length} участников недоступны для
                          нового расчёта
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="sample-size">
                    <strong>{sample.members.length}</strong>
                    <span>участников</span>
                  </div>
                  <div className="actions">
                    <Button
                      onClick={() => {
                        setEditing(sample);
                        setMembers(
                          sample.members.filter(
                            (id) => !sample.unavailable.includes(id),
                          ),
                        );
                        setSampleName(sample.name);
                        setSearch("");
                        setCandidateOnly(false);
                      }}
                    >
                      <Pencil size={14} />
                      Состав и название
                    </Button>
                    {model.canWrite && (
                      <Button $emphasized onClick={() => start(sample)}>
                        <Calculator size={15} />
                        Рассчитать
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {editing && (
                <Modal
                  open
                  title="Состав и название выборки"
                  width={860}
                  footer={null}
                  getContainer={() => document.getElementById("root")!}
                  closable={!busy}
                  maskClosable={!busy}
                  keyboard={!busy}
                  onCancel={() => {
                    if (!busy) setEditing(null);
                  }}
                >
                  <Workspace className="sample-modal">
                    <div className="toolbar">
                      <div>
                        <h3>Состав: {editing.name}</h3>
                        <p className="muted">
                          Выбрано {members.length}. Сохранение создаст v
                          {editing.revision + 1}; прежние отчёты сохранят
                          исходный состав.
                        </p>
                      </div>
                    </div>
                    <div className="fields">
                      <label className="field">
                        Название
                        <input
                          autoFocus
                          value={sampleName}
                          onChange={(e) => setSampleName(e.target.value)}
                          maxLength={160}
                          disabled={!model.canWrite}
                        />
                      </label>
                      <label className="field">
                        Поиск участника
                        <input
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Имя или возраст"
                        />
                      </label>
                    </div>
                    <div className="actions">
                      <label className="check">
                        <input
                          type="checkbox"
                          checked={candidateOnly}
                          onChange={(e) => setCandidateOnly(e.target.checked)}
                        />
                        Только подходящие вне группы (
                        {editing.candidates.length})
                      </label>
                      {model.canWrite && editing.candidates.length > 0 && (
                        <Button
                          onClick={() =>
                            setMembers((current) => [
                              ...new Set([...current, ...editing.candidates]),
                            ])
                          }
                        >
                          Добавить всех подходящих
                        </Button>
                      )}
                    </div>
                    <div className="member-list">
                      {model.participants
                        .filter(
                          (p) =>
                            (!candidateOnly ||
                              editing.candidates.includes(p.id)) &&
                            `${p.alias} ${p.age ?? ""}`
                              .toLowerCase()
                              .includes(search.toLowerCase()),
                        )
                        .map((p) => (
                          <label className="member check" key={p.id}>
                            <input
                              type="checkbox"
                              checked={members.includes(p.id)}
                              disabled={!model.canWrite}
                              onChange={(e) =>
                                setMembers((current) =>
                                  e.target.checked
                                    ? [...current, p.id]
                                    : current.filter((id) => id !== p.id),
                                )
                              }
                            />
                            <span>
                              {p.alias}
                              <small>
                                {p.age ?? "Возраст не указан"} ·{" "}
                                {p.gender ?? "Пол не указан"} ·{" "}
                                {p.status === "completed"
                                  ? "завершено"
                                  : "не завершено"}
                                {editing.candidates.includes(p.id)
                                  ? " · подходит под условия"
                                  : !editing.members.includes(p.id)
                                    ? " · добавление вручную"
                                    : ""}
                              </small>
                            </span>
                          </label>
                        ))}
                    </div>
                    {error && (
                      <p className="error" role="alert">
                        {error}
                      </p>
                    )}
                    <div className="modal-actions">
                      <Button disabled={busy} onClick={() => setEditing(null)}>
                        Отмена
                      </Button>
                      {model.canWrite && (
                        <Button
                          $emphasized
                          loading={busy}
                          disabled={!members.length || !sampleName.trim()}
                          onClick={() =>
                            void perform(async () => {
                              await api.put(`${url}/samples/${editing.id}`, {
                                revision: editing.revision,
                                name: sampleName,
                                memberIds: members,
                              });
                              await load();
                              setEditing(null);
                              setPreview(null);
                            })
                          }
                        >
                          Сохранить новую версию
                        </Button>
                      )}
                    </div>
                  </Workspace>
                </Modal>
              )}
            </>
          )}
          {tab === "new" && (
            <div className="analysis-layout">
              <div>
                {!model.samples.length && kind !== "manual" ? (
                  <div className="empty">
                    <h3>Сначала сохраните выборку</h3>
                    <p className="muted">
                      Сохраните выборку в списке респондентов. Расчёт будет
                      связан с её составом и версией.
                    </p>
                    <Button onClick={onClose}>К респондентам</Button>
                    <Button onClick={() => chooseMethod("mds_matrix_classical")}>Анализ заданных матриц</Button>
                  </div>
                ) : (
                  <>
                    <div className="step-title">
                      <span>Шаг 1 из 3</span>
                      <h3>Метод и данные</h3>
                    </div>
                    <label className="field">
                      Метод расчёта
                      <SelectField
                        showSearch
                        value={method}
                        onChange={(value) => chooseMethod(String(value))}
                        options={model.methods.map((m) => ({
                          value: m.id,
                          label: m.label,
                        }))}
                      />
                    </label>
                    <p className="method-description">
                      {selectedMethod?.description}
                    </p>
                    {kind === "manual" && <div className="input-group">
                      <label className="field">Матрица данных · JSON
                        <textarea rows={8} value={matrixData} placeholder={method === "mds_individual" ? "[[[0, 1, 2], [1, 0, 1], [2, 1, 0]], [[0, 2, 3], [2, 0, 1], [3, 1, 0]]]" : "[[0, 1, 2], [1, 0, 1], [2, 1, 0]]"}
                          onChange={e => { setMatrixData(e.target.value); invalidate(); }} />
                      </label>
                      <label className="field">Источник и порядок строк / столбцов
                        <textarea rows={2} value={matrixSource} placeholder="Откуда данные; что обозначают строки и столбцы и в каком порядке они идут"
                          onChange={e => { setMatrixSource(e.target.value); invalidate(); }} />
                      </label>
                    </div>}
                    {choices.map((choice, index) => (
                      <div className="input-group" key={index}>
                        <h3>
                          {linked || kind === "paired_groups"
                            ? selectedMethod?.roles?.[Math.min(index, selectedMethod.roles.length - 1)] ?? `Показатель ${index + 1} · значения одного участника`
                            : `${choices.length === 1 ? "Выборка" : `Группа ${index + 1}`}`}
                        </h3>
                        <div className="fields">
                          <label className="field">
                            Сохранённая выборка
                            <SelectField
                              value={choice.sampleId}
                              onChange={(value) => {
                                setChoices((current) =>
                                  current.map((c, i) =>
                                    i === index
                                      ? { ...c, sampleId: String(value) }
                                      : linked || (kind === "paired_groups" && Math.floor(i / 2) === Math.floor(index / 2))
                                        ? { ...c, sampleId: String(value) }
                                        : c,
                                  ),
                                );
                                invalidate();
                              }}
                              showSearch
                              placeholder="Выберите выборку"
                              options={model.samples.map((s) => ({
                                value: s.id,
                                label: `${s.name} · v${s.revision} · ${s.members.length} чел.`,
                              }))}
                            />
                          </label>
                          <label className="field">
                            Числовой показатель
                            <SelectField
                              value={choice.variableId}
                              onChange={(value) => {
                                setChoices((current) =>
                                  current.map((c, i) =>
                                    i === index ||
                                    kind === "independent" ||
                                    kind === "multiple"
                                      ? { ...c, variableId: String(value) }
                                      : c,
                                  ),
                                );
                                invalidate();
                              }}
                              showSearch
                              placeholder="Выберите показатель"
                              options={model.variables.map((v) => ({
                                value: v.id,
                                label:
                                  v.label +
                                  (v.version ? ` · ${v.version}` : ""),
                              }))}
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                    {["multiple", "repeated", "multivariate"].includes(kind) && (
                      <div className="actions">
                        <Button
                          disabled={choices.length >= (selectedMethod?.maxInputs ?? 16)}
                          onClick={() => {
                            setChoices((c) => [
                              ...c,
                              { sampleId: linked ? c[0].sampleId : "", variableId: linked ? "" : c[0].variableId },
                            ]);
                            invalidate();
                          }}
                        >
                          <Plus size={14} />
                          {linked ? "Добавить показатель" : "Добавить группу"}
                        </Button>
                        {choices.length > (selectedMethod?.minInputs ?? 2) && (
                          <Button
                            onClick={() => {
                              setChoices((c) => c.slice(0, -1));
                              invalidate();
                            }}
                          >
                            Убрать последний
                          </Button>
                        )}
                      </div>
                    )}
                    {selectedMethod?.vectors?.map(v => <label className="field" key={v.key}>{v.label}<input value={vectors[v.key] ?? ""} placeholder={v.placeholder} onChange={e => { setVectors(current => ({ ...current, [v.key]: e.target.value })); invalidate(); }} /></label>)}
                    {!!selectedMethod?.parameters?.length && <div className="fields">
                      {selectedMethod.parameters.map(p => <label className="field" key={p.key}>
                        {p.label}
                        {p.options ? <SelectField value={Number(parameters[p.key] ?? p.value)} options={p.options} onChange={value => { setParameters(current => ({ ...current, [p.key]: String(value) })); invalidate(); }} /> : <input type="number" step={p.integer ? "1" : "any"} min={p.min} max={p.max}
                          value={parameters[p.key] ?? String(p.value)}
                          onChange={e => { setParameters(current => ({ ...current, [p.key]: e.target.value })); invalidate(); }} />}
                      </label>)}
                    </div>}
                    <div className="fields">
                      <label className="field">
                        Уровень значимости α
                        <SelectField
                          value={alpha}
                          onChange={(value) => {
                            setAlpha(String(value));
                            setPreview(null);
                          }}
                          options={[
                            { value: "0.05", label: "0,05 · ДИ 95%" },
                            { value: "0.01", label: "0,01 · ДИ 99%" },
                            { value: "0.1", label: "0,10 · ДИ 90%" },
                          ]}
                        />
                      </label>
                      {method === "t_one" && (
                        <label className="field">
                          Проверяемое среднее μ₀
                          <input
                            type="number"
                            step="any"
                            value={mu}
                            onChange={(e) => {
                              setMu(e.target.value);
                              setPreview(null);
                            }}
                          />
                        </label>
                      )}
                      <label className="field">
                        Название расчёта · необязательно
                        <input
                          value={name}
                          maxLength={160}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Название для истории"
                        />
                      </label>
                    </div>
                    <div className="actions" style={{ marginTop: 20 }}>
                      <Button
                        $emphasized
                        loading={pendingCalculation === "preview"}
                        disabled={
                          busy ||
                          !model.canWrite ||
                          (kind === "manual" && (!matrixData.trim() || !matrixSource.trim())) ||
                          choices.some((c) => !c.sampleId || !c.variableId) ||
                          (method === "t_one" && !mu.trim()) ||
                          (selectedMethod?.parameters ?? []).some(p => parameters[p.key] !== undefined && (!parameters[p.key].trim() || !Number.isFinite(Number(parameters[p.key])) || (p.min !== undefined && Number(parameters[p.key]) < p.min) || (p.max !== undefined && Number(parameters[p.key]) > p.max) || (p.integer && !Number.isInteger(Number(parameters[p.key])))))
                        }
                        onClick={() =>
                          void perform(async () => {
                            const r = await api.post(
                              `${url}/preview`,
                              config(),
                            );
                            setPreview({
                              ...r.data,
                              requestId: crypto.randomUUID(),
                            });
                          }, "preview")
                        }
                      >
                        Проверить данные
                      </Button>
                    </div>
                    {preview && (
                      <section className="editor preview-section">
                        <div className="step-title">
                          <span>Шаг 2 из 3</span>
                          <h3>Проверка перед запуском</h3>
                        </div>
                        <p className="muted">
                          Для направленных методов порядок показателей задаёт ожидаемое возрастание. Пропуски исключаются; связанные показатели сопоставляются по участникам.
                        </p>
                        {preview.input.config.matrixData && <div className="notice">
                          <strong>Зафиксирована заданная матрица</strong>
                          <p>{preview.input.manualReason}</p>
                          <details><summary>Проверить исходные значения</summary><pre className="matrix-source">{JSON.stringify(preview.input.config.matrixData, null, 2)}</pre></details>
                        </div>}
                        {preview.input.groups.length > 0 && <div className="scroll">
                          <table>
                            <thead>
                              <tr>
                                <th>Группа / показатель</th>
                                <th>Включено</th>
                                <th>Исключено</th>
                              </tr>
                            </thead>
                            <tbody>
                              {preview.input.groups.map((g, i) => (
                                <tr key={i}>
                                  <td>
                                    {g.label}
                                    <small>Версия выборки {g.revision}</small>
                                  </td>
                                  <td>{g.included.length}</td>
                                  <td>{g.excluded.length}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>}
                        <InputTables
                          input={preview.input}
                          participants={model.participants}
                        />
                        <p className="calculation-confirmation">
                          <span>
                            Нажимая «Рассчитать», вы подтверждаете выбранный
                            план и исходные значения.
                          </span>
                        </p>
                        <Button
                          $emphasized
                          loading={pendingCalculation === "calculate"}
                          disabled={busy}
                          onClick={() =>
                            void perform(async () => {
                              const r = await api.post(`${url}/analyses`, {
                                ...config(),
                                previewHash: preview.hash,
                                requestId: preview.requestId,
                              });
                              await load();
                              await openReport(r.data.id);
                              setPreview(null);
                            }, "calculate")
                          }
                        >
                          <Calculator size={15} />
                          Рассчитать и сохранить
                        </Button>
                      </section>
                    )}
                  </>
                )}
              </div>
              <aside>
                <div className="run-summary">
                  <h3>Ваш расчёт</h3>
                  <p>{selectedMethod?.label}</p>
                  <dl>
                    <div>
                      <dt>Показатели</dt>
                      <dd>
                        {choices.filter((c) => c.variableId).length} из{" "}
                        {choices.length}
                      </dd>
                    </div>
                    <div>
                      <dt>Уровень значимости</dt>
                      <dd>α = {alpha.replace(".", ",")}</dd>
                    </div>
                    <div>
                      <dt>Гипотеза</dt>
                      <dd>{["page", "jonckheere"].includes(method) ? "Возрастание в указанном порядке" : method === "rosenbaum" ? "Первая группа выше второй" : "Указана в описании метода"}</dd>
                    </div>
                  </dl>
                </div>
                <h3>Что будет сохранено</h3>
                <p>
                  Состав выборок, точные значения, настройки, формулы и версия
                  движка.
                </p>
                <h3>Перед расчётом</h3>
                <ul>
                  <li>Независимые группы не должны пересекаться.</li>
                  <li>
                    Связанные методы используют полные наборы показателей одних участников.
                  </li>
                  <li>Пропуск не считается нулём.</li>
                  <li>
                    Попарные таблицы содержат своё семейство проверок и указанную поправку.
                  </li>
                </ul>
              </aside>
            </div>
          )}
          {tab === "history" && (
            <>
              <div className="toolbar">
                <div>
                  <h3>История расчётов</h3>
                  <p className="muted">
                    Отчёты сохраняют данные на момент запуска. Показаны
                    последние 100.
                  </p>
                </div>
                <div className="actions">
                  <Button
                    disabled={busy}
                    onClick={() =>
                      void perform(async () => {
                        await load();
                        if (report) {
                          const r = await api.get(
                            `${url}/analyses/${report.id}`,
                          );
                          setReport(r.data);
                        }
                      })
                    }
                  >
                    <RefreshCw size={14} />
                    Обновить
                  </Button>
                  <Button
                    disabled={compareIds.length < 2 || busy}
                    onClick={() =>
                      void perform(async () => {
                        const reports = await Promise.all(
                          compareIds.map((id) =>
                            api.get<Analysis>(`${url}/analyses/${id}`),
                          ),
                        );
                        setComparison(reports.map((r) => r.data));
                        setReport(null);
                      })
                    }
                  >
                    <Columns2 size={15} />
                    Сопоставить ({compareIds.length})
                  </Button>
                </div>
              </div>
              {comparison.length > 0 && (
                <>
                  <h3>Сопоставление отчётов</h3>
                  <p className="notice">
                    Это просмотр результатов рядом. Различие p или отметок
                    значимости само по себе не доказывает различия эффектов.
                    Для статистической проверки связей выберите соответствующий метод различия корреляций в новом расчёте.
                  </p>
                  <div className="scroll">
                    <table>
                      <thead>
                        <tr>
                          <th>Параметр</th>
                          {comparison.map((a) => (
                            <th key={a.id}>{a.name}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          "Метод",
                          "N",
                          "Средние",
                          "Статистика",
                          "p",
                          "α",
                          "Эффект",
                          "ДИ",
                          "Выборки / версии",
                          "Исключено",
                          "Гипотеза",
                        ].map((label, i) => (
                          <tr key={label}>
                            <th>{label}</th>
                            {comparison.map((a) => (
                              <td key={a.id}>
                                {
                                  [
                                    model.methods.find(
                                      (m) => m.id === a.input?.config.method,
                                    )?.label,
                                    a.result?.summary
                                      .map((s) => s.n)
                                      .join(" / "),
                                    a.result?.summary
                                      .map((s) => number(s.mean))
                                      .join(" / "),
                                    `${a.result?.statisticLabel ?? ""} ${number(a.result?.statistic)}`,
                                    probability(a.result?.p),
                                    number(a.input?.config.alpha),
                                    `${a.result?.effectLabel ?? ""} ${number(a.result?.effect)}`,
                                    a.result?.ci?.map(number).join(" … ") ??
                                      "—",
                                    a.input?.groups
                                      .map((g) => `${g.label} · v${g.revision}`)
                                      .join(" / "),
                                    a.input?.groups
                                      .map((g) => g.excluded.length)
                                      .join(" / "),
                                    "Двусторонняя; без поправки за серию проверок",
                                  ][i]
                                }
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
              {report && (
                <section className="editor">
                  <div className="report-heading">
                    <div>
                      <span className="badge">
                        Шаг 3 из 3 · {statuses[report.status]}
                      </span>
                      <h3 style={{ marginTop: 12 }}>{report.name}</h3>
                      <small>
                        {new Date(report.createdAt).toLocaleString("ru-RU")} ·
                        снимок{" "}
                        {report.input
                          ? new Date(report.input.snapshotAt).toLocaleString(
                              "ru-RU",
                            )
                          : "—"}
                      </small>
                    </div>
                    <div className="actions">
                      {report.result && (
                        <Button
                          disabled={busy}
                          onClick={() => void exportReport(report)}
                        >
                          <Download size={15} />
                          Excel-отчёт
                        </Button>
                      )}
                      <Button onClick={() => setReport(null)}>
                        Закрыть отчёт
                      </Button>
                    </div>
                  </div>
                  {report.status === "failed" && (
                    <p className="error" role="alert">
                      {report.error}
                    </p>
                  )}
                  {(report.status === "queued" ||
                    report.status === "running") && (
                    <p role="status">
                      Расчёт выполняется в фоне. Можно перейти к другим
                      разделам; результат появится в истории.
                    </p>
                  )}
                  {report.result && report.input && (
                    <>
                      <nav className="tabs" aria-label="Содержание отчёта">
                        {[
                          ["result", "Результат"],
                          ["data", "Исходные данные"],
                          ["trace", "Как рассчитано"],
                        ].map(([key, label]) => (
                          <button
                            key={key}
                            aria-selected={reportTab === key}
                            onClick={() => setReportTab(key)}
                          >
                            {label}
                          </button>
                        ))}
                      </nav>
                      {reportTab === "result" && (
                        <>
                          <StatisticsResult result={report.result} alpha={report.input.config.alpha} reportId={report.id}/>

                        </>
                      )}
                      {reportTab === "data" && (
                        <>
                          <p className="notice">
                            Данные из сохранённого снимка. Ручные дополнения
                            помечены; исходные ответы опроса не изменены.
                          </p>
                          {report.input.config.matrixData && <details><summary>Исходная матрица · JSON</summary><pre className="matrix-source">{JSON.stringify(report.input.config.matrixData, null, 2)}</pre></details>}
                          <InputTables
                            input={report.input}
                            participants={model.participants}
                          />
                        </>
                      )}
                      {reportTab === "trace" && (
                        <>
                          <h4>Формула</h4>
                          <p className="formula">{report.result.formula}</p>
                          {!!report.result.references?.length && <details><summary>Источники вычислительных процедур</summary><ul>{report.result.references.map(reference => <li key={reference.url}><a href={reference.url} target="_blank" rel="noopener noreferrer">{reference.title}</a></li>)}</ul></details>}
                          <ol className="trace">
                            {report.result.steps.map((step, i) => (
                              <li key={i}>{step}</li>
                            ))}
                          </ol>
                          {report.result.df !== null && (
                            <p>
                              Степени свободы:{" "}
                              {Array.isArray(report.result.df)
                                ? report.result.df.map(number).join(" / ")
                                : number(report.result.df)}
                            </p>
                          )}
                          {report.result.ranks && (
                            <details>
                              <summary>Промежуточные ранги</summary>
                              <p className="muted">
                                В порядке входных значений; для Вилкоксона —
                                только ненулевые разности.
                              </p>
                              {report.result.ranks.map((r, i) => (
                                <p key={i} style={{ overflowWrap: "anywhere" }}>
                                  {i + 1}: {r.map(number).join(", ")}
                                </p>
                              ))}
                            </details>
                          )}
                          <p className="notice">
                            {report.result.engine} · SciPy {report.result.scipy}{" "}
                            · NumPy {report.result.numpy} · Python{" "}
                            {report.result.python}
                            {Object.entries(report.result.packages ?? {}).map(([key, value]) => ` · ${key} ${value}`).join("")}
                            <br />
                            Вариант: {report.result.alternative ?? "two-sided"}. α ={" "}
                            {number(report.input.config.alpha)}. Политика:
                            полные наблюдения/пары, без импутации и исключения
                            выбросов.
                          </p>
                          <p>
                            <a
                              href={`https://docs.scipy.org/doc/scipy/reference/stats.html`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Документация вычислительных процедур SciPy
                            </a>
                          </p>
                        </>
                      )}
                    </>
                  )}
                </section>
              )}
              {!model.analyses.length && (
                <div className="empty">
                  <Calculator size={28} />
                  <h3>Здесь будут сохранённые расчёты</h3>
                  <p className="muted">
                    Каждый отчёт хранит свои значения, настройки и состав
                    выборки.
                  </p>
                  {model.canWrite && (
                    <Button $emphasized onClick={() => start()}>
                      Новый расчёт
                    </Button>
                  )}
                </div>
              )}
              {model.analyses.map((a) => (
                <div className="history-row" key={a.id}>
                  <input
                    type="checkbox"
                    aria-label={`Сопоставить: ${a.name}`}
                    checked={compareIds.includes(a.id)}
                    disabled={
                      a.status !== "completed" ||
                      (!compareIds.includes(a.id) && compareIds.length >= 4)
                    }
                    onChange={(e) =>
                      setCompareIds((ids) =>
                        e.target.checked
                          ? [...ids, a.id]
                          : ids.filter((id) => id !== a.id),
                      )
                    }
                  />
                  <span className="history-symbol">
                    <FileText size={19} aria-hidden="true" />
                  </span>
                  <div className="history-copy">
                    <button
                      className="text-button"
                      onClick={() => void openReport(a.id)}
                    >
                      {a.name}
                    </button>
                    <div className="status">
                      {new Date(a.createdAt).toLocaleString("ru-RU")}
                    </div>
                    {a.error && <small>{a.error}</small>}
                  </div>
                  <span className={`history-status ${a.status}`}>
                    {a.status === "completed" ? (
                      <CheckCircle2 size={14} aria-hidden="true" />
                    ) : (
                      <Clock3 size={14} aria-hidden="true" />
                    )}
                    {statuses[a.status]}
                  </span>
                  <div className="history-actions">
                    <Button onClick={() => void openReport(a.id)}>
                      Открыть
                      <ArrowRight size={14} />
                    </Button>
                    {model.canWrite && (
                      <Button
                        aria-label={`Удалить расчёт: ${a.name}`}
                        title={
                          a.status === "queued" || a.status === "running"
                            ? "Дождитесь завершения расчёта"
                            : "Удалить расчёт"
                        }
                        disabled={
                          a.status === "queued" || a.status === "running"
                        }
                        onClick={() => {
                          setDeleteError("");
                          setDeleting(a);
                        }}
                      >
                        <Trash2 size={15} aria-hidden="true" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
      <Modal
        open={!!deleting}
        title="Удалить расчёт?"
        width={440}
        footer={null}
        getContainer={() => document.getElementById("root")!}
        closable={!busy}
        maskClosable={!busy}
        keyboard={!busy}
        onCancel={() => {
          if (!busy) setDeleting(null);
        }}
      >
        <Workspace className="sample-modal">
          <p>
            Расчёт «{deleting?.name}» будет удалён из истории. Состав выборок и
            ответы участников сохранятся.
          </p>
          {deleteError && (
            <p className="error" role="alert">
              {deleteError}
            </p>
          )}
          <div className="modal-actions">
            <Button disabled={busy} onClick={() => setDeleting(null)}>
              Отмена
            </Button>
            <Button
              $emphasized
              loading={busy}
              onClick={() => {
                if (!deleting) return;
                const analysisId = deleting.id;
                setBusy(true);
                setDeleteError("");
                void api
                  .delete(`${url}/analyses/${analysisId}`)
                  .then(() => {
                    setModel((current) =>
                      current
                        ? {
                            ...current,
                            analyses: current.analyses.filter(
                              (a) => a.id !== analysisId,
                            ),
                          }
                        : current,
                    );
                    setCompareIds((ids) =>
                      ids.filter((id) => id !== analysisId),
                    );
                    setComparison((items) =>
                      items.filter((item) => item.id !== analysisId),
                    );
                    if (report?.id === analysisId) setReport(null);
                    setDeleting(null);
                  })
                  .catch((e) =>
                    setDeleteError(
                      getApiErrorMessage(e, "Не удалось удалить расчёт."),
                    ),
                  )
                  .finally(() => setBusy(false));
              }}
            >
              Удалить расчёт
            </Button>
          </div>
        </Workspace>
      </Modal>
    </Workspace>
  );
}

function InputTables({
  input,
  participants,
}: {
  input: Input;
  participants: Model["participants"];
}) {
  return (
    <div className="input-tables">
      {input.groups.map((group, index) => (
        <details key={index}>
          <summary>
            {group.label} · {group.included.length} включено /{" "}
            {group.excluded.length} исключено
          </summary>
          {!!group.variable.categories?.length && <p className="notice">Коды категорий: {group.variable.categories.map(c => c.code + " — " + c.label).join("; ")}. Для бинарных методов событие — код 1.</p>}
          <div className="scroll">
            <table>
              <thead>
                <tr>
                  <th>Участник</th>
                  <th>Значение</th>
                  <th>Источник</th>
                </tr>
              </thead>
              <tbody>
                {group.included.map((row) => (
                  <tr key={row.id}>
                    <td>{row.alias}</td>
                    <td>{String(row.value)}</td>
                    <td>{row.manual ? "Введено вручную" : "Опрос"}</td>
                  </tr>
                ))}
                {group.excluded.map((row) => (
                  <tr key={row.id}>
                    <td>
                      {participants.find((person) => person.id === row.id)
                        ?.alias ?? "Участник"}
                    </td>
                    <td>—</td>
                    <td>{row.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {group.variable.version && (
            <small>Версия формулы методики: {group.variable.version}</small>
          )}
        </details>
      ))}
      {input.manualReason && (
        <p className="notice">
          {input.config.matrixData ? "Источник матрицы" : "Источник ручных дополнений"}: {input.manualReason}
        </p>
      )}
    </div>
  );
}
