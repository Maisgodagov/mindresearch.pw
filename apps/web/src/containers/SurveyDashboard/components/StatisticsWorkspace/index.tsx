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
  Save,
  Users,
} from "lucide-react";
import { api } from "../../../../api";
import { ResultsAction as Button } from "../ResultsAction";
import { getApiErrorMessage } from "../../../../utils/apiErrors";
import type { SampleCondition } from "../../selection";
import type { Analysis, Input, Model, Sample } from "./types";
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
  conditions: SampleCondition[];
  completedOnly: boolean;
  selectedIds: string[];
  saveOnOpen: boolean;
  onClose: () => void;
};
type Choice = { sampleId: string; variableId: string };

export default function StatisticsWorkspace({
  surveyId,
  conditions,
  completedOnly,
  selectedIds,
  saveOnOpen,
  onClose,
}: Props) {
  const url = `/admin/surveys/${surveyId}/statistics`;
  const [model, setModel] = useState<Model | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<"samples" | "new" | "history">("samples");
  const [savingSample, setSavingSample] = useState(saveOnOpen),
    [sampleName, setSampleName] = useState(""),
    [source, setSource] = useState("filtered");
  const [editing, setEditing] = useState<Sample | null>(null),
    [members, setMembers] = useState<string[]>([]),
    [search, setSearch] = useState(""),
    [candidateOnly, setCandidateOnly] = useState(false);
  const [method, setMethod] = useState("descriptive"),
    [choices, setChoices] = useState<Choice[]>([
      { sampleId: "", variableId: "" },
    ]);
  const [alpha, setAlpha] = useState("0.05"),
    [mu, setMu] = useState("0"),
    [name, setName] = useState(""),
    [manual, setManual] = useState<Record<string, string>>({}),
    [manualReason, setManualReason] = useState("");
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
  async function perform(action: () => Promise<void>) {
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
      setBusy(false);
    }
  }
  function invalidate() {
    setPreview(null);
    setManual({});
  }
  const selectedMethod = model?.methods.find((m) => m.id === method);
  const kind = selectedMethod?.kind ?? "single";
  const config = () => ({
    method,
    alpha: Number(alpha),
    mu: Number(mu),
    name,
    manualReason,
    manual: Object.fromEntries(
      Object.entries(manual)
        .filter(([, value]) => value.trim())
        .map(([key, value]) => [key, Number(value.replace(",", "."))]),
    ),
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
    setManual({});
  }
  function chooseMethod(id: string) {
    setMethod(id);
    invalidate();
    const next = model?.methods.find((m) => m.id === id);
    const count = next?.kind === "single" ? 1 : 2;
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
        ["Гипотеза", "Двусторонняя"],
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
            <span
              className="pilot-status"
              title="Доступен только admin и owner"
            >
              Закрытый пилот
            </span>
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
          {error ? "Загрузка не завершена." : "Загружаем выборки и показатели…"}
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
                  {model.canWrite && (
                    <Button
                      onClick={() => {
                        setSavingSample(!savingSample);
                        setEditing(null);
                        setSampleName("");
                      }}
                    >
                      <Plus size={15} />
                      Сохранить текущую выборку
                    </Button>
                  )}
                </div>
              </div>
              {savingSample && model.canWrite && (
                <form
                  className="editor"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void perform(async () => {
                      await api.post(`${url}/samples`, {
                        name: sampleName,
                        conditions: conditions.map(
                          ({ question, title, labels, range }) => ({
                            question,
                            title,
                            labels,
                            range,
                          }),
                        ),
                        completedOnly,
                        source,
                        memberIds: selectedIds,
                      });
                      await load();
                      setSavingSample(false);
                      setSampleName("");
                    });
                  }}
                >
                  <h3>Сохранение текущей выборки</h3>
                  <p className="muted">
                    Используем условия, настроенные в таблице респондентов, по
                    всем страницам.
                  </p>
                  <div className="fields">
                    <label className="field">
                      Название · необязательно
                      <input
                        value={sampleName}
                        onChange={(e) => setSampleName(e.target.value)}
                        maxLength={160}
                        placeholder="Например, участники 25–40 лет"
                      />
                    </label>
                    <label className="field">
                      Кого сохранить
                      <select
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                      >
                        <option value="filtered">
                          Текущая выборка по всем страницам
                        </option>
                        <option value="selected" disabled={!selectedIds.length}>
                          Отмеченные в таблице ({selectedIds.length})
                        </option>
                      </select>
                    </label>
                  </div>
                  <p className="notice">
                    {completedOnly
                      ? "Только завершённые прохождения."
                      : "Текущий фильтр включает все статусы, в том числе незавершённые."}{" "}
                    {conditions.length
                      ? conditions.map((c) => c.title).join(" · ")
                      : "Дополнительных условий нет."}{" "}
                    Для расчёта будут проверены пропуски каждого показателя.
                  </p>
                  <div className="actions">
                    <Button $emphasized htmlType="submit" loading={busy}>
                      <Save size={15} />
                      Сохранить выборку
                    </Button>
                    <Button onClick={() => setSavingSample(false)}>
                      Отмена
                    </Button>
                  </div>
                </form>
              )}
              {!model.samples.length && !savingSample && (
                <div className="empty">
                  <Users size={28} />
                  <h3>Начните с первой выборки</h3>
                  <p className="muted">
                    Вернитесь к респондентам и настройте возраст или ответы для
                    отбора. Можно сохранить и весь опрос без дополнительных
                    условий.
                  </p>
                  {model.canWrite && (
                    <Button $emphasized onClick={() => setSavingSample(true)}>
                      Сохранить выборку
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
                        setSavingSample(false);
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
                <div className="editor">
                  <div className="toolbar">
                    <div>
                      <h3>Состав: {editing.name}</h3>
                      <p className="muted">
                        Выбрано {members.length}. Сохранение создаст v
                        {editing.revision + 1}; прежние отчёты сохранят исходный
                        состав.
                      </p>
                    </div>
                    <Button onClick={() => setEditing(null)}>
                      Закрыть состав
                    </Button>
                  </div>
                  <div className="fields">
                    <label className="field">
                      Название
                      <input
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
                        placeholder="Имя, возраст или ID"
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
                      Только подходящие вне группы ({editing.candidates.length})
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
                          `${p.alias} ${p.age ?? ""} ${p.id}`
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
              )}
            </>
          )}
          {tab === "new" && (
            <div className="analysis-layout">
              <div>
                {!model.samples.length ? (
                  <div className="empty">
                    <h3>Сначала сохраните выборку</h3>
                    <p className="muted">
                      Расчёт будет связан с её конкретным составом и версией.
                    </p>
                    <Button
                      onClick={() => {
                        setTab("samples");
                        setSavingSample(true);
                      }}
                    >
                      Перейти к сохранению
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="step-title">
                      <span>Шаг 1 из 3</span>
                      <h3>Метод и данные</h3>
                    </div>
                    <label className="field">
                      Метод расчёта
                      <select
                        value={method}
                        onChange={(e) => chooseMethod(e.target.value)}
                      >
                        {model.methods.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <p className="method-description">
                      {selectedMethod?.description}
                    </p>
                    {choices.map((choice, index) => (
                      <div className="input-group" key={index}>
                        <h3>
                          {kind === "paired"
                            ? `Показатель ${index + 1} · значения одного участника`
                            : `${choices.length === 1 ? "Выборка" : `Группа ${index + 1}`}`}
                        </h3>
                        <div className="fields">
                          <label className="field">
                            Сохранённая выборка
                            <select
                              value={choice.sampleId}
                              onChange={(e) => {
                                setChoices((current) =>
                                  current.map((c, i) =>
                                    i === index
                                      ? { ...c, sampleId: e.target.value }
                                      : kind === "paired"
                                        ? { ...c, sampleId: e.target.value }
                                        : c,
                                  ),
                                );
                                invalidate();
                              }}
                            >
                              <option value="">Выберите выборку</option>
                              {model.samples.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.name} · v{s.revision} · {s.members.length}{" "}
                                  чел.
                                </option>
                              ))}
                            </select>
                          </label>
                          <label className="field">
                            Числовой показатель
                            <select
                              value={choice.variableId}
                              onChange={(e) => {
                                setChoices((current) =>
                                  current.map((c, i) =>
                                    i === index ||
                                    kind === "independent" ||
                                    kind === "multiple"
                                      ? { ...c, variableId: e.target.value }
                                      : c,
                                  ),
                                );
                                invalidate();
                              }}
                            >
                              <option value="">Выберите показатель</option>
                              {model.variables.map((v) => (
                                <option key={v.id} value={v.id}>
                                  {v.label}
                                  {v.version ? ` · ${v.version}` : ""}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                      </div>
                    ))}
                    {kind === "multiple" && (
                      <div className="actions">
                        <Button
                          disabled={choices.length >= 8}
                          onClick={() => {
                            setChoices((c) => [
                              ...c,
                              { sampleId: "", variableId: c[0].variableId },
                            ]);
                            invalidate();
                          }}
                        >
                          <Plus size={14} />
                          Добавить группу
                        </Button>
                        {choices.length > 2 && (
                          <Button
                            onClick={() => {
                              setChoices((c) => c.slice(0, -1));
                              invalidate();
                            }}
                          >
                            Убрать последнюю
                          </Button>
                        )}
                      </div>
                    )}
                    <div className="fields">
                      <label className="field">
                        Уровень значимости α
                        <select
                          value={alpha}
                          onChange={(e) => {
                            setAlpha(e.target.value);
                            setPreview(null);
                          }}
                        >
                          <option value="0.05">0,05 · ДИ 95%</option>
                          <option value="0.01">0,01 · ДИ 99%</option>
                          <option value="0.1">0,10 · ДИ 90%</option>
                        </select>
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
                    <details>
                      <summary>
                        Дополнить отсутствующие значения вручную
                      </summary>
                      <p className="notice">
                        Ввод дополняет только пропуски выбранного показателя.
                        Сохранённые ответы не изменяются. Источник будет указан
                        в отчёте.
                      </p>
                      <label className="field">
                        Источник и причина дополнения
                        <textarea
                          value={manualReason}
                          maxLength={1000}
                          onChange={(e) => {
                            setManualReason(e.target.value);
                            setPreview(null);
                          }}
                          placeholder="Например, данные из дополнительного очного замера"
                        />
                      </label>
                      {choices.map((choice, index) => {
                        const sample = model.samples.find(
                          (s) => s.id === choice.sampleId,
                        );
                        const missing = model.participants.filter(
                          (p) =>
                            sample?.members.includes(p.id) &&
                            p.values[choice.variableId] === undefined,
                        );
                        return choice.variableId && missing.length > 0 ? (
                          <div key={index}>
                            <h4>
                              Вход {index + 1} · {missing.length} пропусков
                              (первые 50)
                            </h4>
                            {missing.slice(0, 50).map((p) => (
                              <label className="field" key={p.id}>
                                {p.alias}
                                <input
                                  type="number"
                                  step="any"
                                  value={manual[`${index}:${p.id}`] ?? ""}
                                  onChange={(e) => {
                                    setManual((m) => ({
                                      ...m,
                                      [`${index}:${p.id}`]: e.target.value,
                                    }));
                                    setPreview(null);
                                  }}
                                />
                              </label>
                            ))}
                          </div>
                        ) : null;
                      })}
                    </details>
                    <div className="actions" style={{ marginTop: 20 }}>
                      <Button
                        $emphasized
                        loading={busy}
                        disabled={
                          !model.canWrite ||
                          choices.some((c) => !c.sampleId || !c.variableId) ||
                          (method === "t_one" && !mu.trim())
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
                          })
                        }
                      >
                        Проверить данные
                      </Button>
                    </div>
                    {preview && (
                      <section className="editor">
                        <div className="step-title">
                          <span>Шаг 2 из 3</span>
                          <h3>Проверка перед запуском</h3>
                        </div>
                        <p className="muted">
                          Гипотеза двусторонняя. Пропуски исключаются; парные
                          показатели сопоставлены по ID прохождения.
                        </p>
                        <div className="scroll">
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
                        </div>
                        <InputTables input={preview.input} />
                        <label className="check">
                          <span>
                            Нажимая «Рассчитать», вы подтверждаете выбранный
                            план и исходные значения.
                          </span>
                        </label>
                        <Button
                          $emphasized
                          loading={busy}
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
                            })
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
                      <dd>Двусторонняя</dd>
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
                    Парные методы используют два показателя одного прохождения.
                  </li>
                  <li>Пропуск не считается нулём.</li>
                  <li>
                    Один запуск — одна гипотеза. Для серии проверок потребуется
                    поправка.
                  </li>
                </ul>
                <details className="pilot-details">
                  <summary>Возможности пилота</summary>
                  <p>
                    13 методов, до 5000 участников опроса. Многомерные модели и
                    статистическое сравнение эффектов добавим следующими
                    этапами.
                  </p>
                </details>
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
                    Отдельная проверка различий эффектов в пилот пока не
                    включена.
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
                          <div className="metrics">
                            {report.result.statistic !== null && (
                              <div>
                                <span>{report.result.statisticLabel}</span>
                                <strong>
                                  {number(report.result.statistic)}
                                </strong>
                              </div>
                            )}
                            {report.result.p !== null && (
                              <div>
                                <span>p · двусторонний</span>
                                <strong>{probability(report.result.p)}</strong>
                              </div>
                            )}
                            <div>
                              <span>Уровень значимости α</span>
                              <strong>
                                {number(report.input.config.alpha)}
                              </strong>
                            </div>
                          </div>
                          {report.result.p !== null && (
                            <p>
                              {report.result.p < report.input.config.alpha
                                ? "Нулевая гипотеза отвергается при выбранном α."
                                : "Оснований отвергнуть нулевую гипотезу при выбранном α недостаточно."}{" "}
                              Интерпретируйте результат с учётом гипотезы метода
                              и ограничений ниже.
                            </p>
                          )}
                          <div className="scroll">
                            <table>
                              <thead>
                                <tr>
                                  <th>Группа / показатель</th>
                                  <th>N</th>
                                  <th>Среднее</th>
                                  <th>Медиана</th>
                                  <th>SD</th>
                                  <th>Мин.</th>
                                  <th>Макс.</th>
                                </tr>
                              </thead>
                              <tbody>
                                {report.result.summary.map((s, i) => (
                                  <tr key={i}>
                                    <td>{s.label}</td>
                                    <td>{s.n}</td>
                                    <td>{number(s.mean)}</td>
                                    <td>{number(s.median)}</td>
                                    <td>{number(s.sd)}</td>
                                    <td>{number(s.min)}</td>
                                    <td>{number(s.max)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          {report.result.effect !== null && (
                            <p>
                              <strong>{report.result.effectLabel}:</strong>{" "}
                              {number(report.result.effect)}
                            </p>
                          )}
                          {report.result.ci && (
                            <p>
                              <strong>{report.result.ciLabel}:</strong>{" "}
                              {report.result.ci.map(number).join(" … ")}
                            </p>
                          )}
                          <details>
                            <summary>Дисперсия и квартили</summary>
                            <div className="scroll">
                              <table>
                                <thead>
                                  <tr>
                                    <th>Группа / показатель</th>
                                    <th>Дисперсия</th>
                                    <th>Q₁</th>
                                    <th>Q₃</th>
                                    <th>IQR</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {report.result.summary.map((s, i) => (
                                    <tr key={i}>
                                      <td>{s.label}</td>
                                      <td>{number(s.variance)}</td>
                                      <td>{number(s.q1)}</td>
                                      <td>{number(s.q3)}</td>
                                      <td>{number(s.q3 - s.q1)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </details>
                          {report.result.modes && (
                            <p>
                              Мода:{" "}
                              {report.result.modes.length
                                ? `${report.result.modes.map(number).join(", ")} · частота ${report.result.modeFrequency}`
                                : "все значения различны; модальная группа не выделяется"}
                            </p>
                          )}
                          {report.result.skewness !== undefined && (
                            <p>Асимметрия: {number(report.result.skewness)}</p>
                          )}
                          {report.result.excess !== undefined && (
                            <p>
                              Исправленный эксцесс (относительно 0):{" "}
                              {number(report.result.excess)}
                            </p>
                          )}
                          {report.result.warnings.map((warning, i) => (
                            <p className="notice" key={i}>
                              {warning}
                            </p>
                          ))}
                          <p className="muted">
                            Результат относится к зафиксированным данным и
                            одному выбранному сравнению. p не является
                            вероятностью истинности гипотезы.
                          </p>
                        </>
                      )}
                      {reportTab === "data" && (
                        <>
                          <p className="notice">
                            Данные из сохранённого снимка. Ручные дополнения
                            помечены; исходные ответы опроса не изменены.
                          </p>
                          <InputTables input={report.input} />
                        </>
                      )}
                      {reportTab === "trace" && (
                        <>
                          <h4>Формула</h4>
                          <p className="formula">{report.result.formula}</p>
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
                            <br />
                            Гипотеза: двусторонняя. α ={" "}
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
                  <Button onClick={() => void openReport(a.id)}>
                    Открыть
                    <ArrowRight size={14} />
                  </Button>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </Workspace>
  );
}

function InputTables({ input }: { input: Input }) {
  return (
    <>
      {input.groups.map((group, index) => (
        <details key={index}>
          <summary>
            {group.label} · {group.included.length} включено /{" "}
            {group.excluded.length} исключено
          </summary>
          <div className="scroll">
            <table>
              <thead>
                <tr>
                  <th>Участник / ID</th>
                  <th>Значение</th>
                  <th>Источник</th>
                </tr>
              </thead>
              <tbody>
                {group.included.map((row) => (
                  <tr key={row.id}>
                    <td>
                      {row.alias}
                      <small>{row.id}</small>
                    </td>
                    <td>{String(row.value)}</td>
                    <td>{row.manual ? "Введено вручную" : "Опрос"}</td>
                  </tr>
                ))}
                {group.excluded.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
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
          Источник ручных дополнений: {input.manualReason}
        </p>
      )}
    </>
  );
}
