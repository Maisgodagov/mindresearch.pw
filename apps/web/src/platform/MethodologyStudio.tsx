import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  Check,
  ChevronRight,
  CircleAlert,
  FilePlus2,
  Link2,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { api } from "../api";
import { Button, Card } from "../ui";

type Option = { value: string; label: string };
type Question = { text: string };
type Scale = {
  key: string;
  label: string;
  items: number[];
  reverseItems: number[];
  aggregation: "sum" | "mean";
};
type CheckCase = { title: string; answersText: string; expectedText: string };
type Draft = {
  id: string;
  code: string;
  title: string;
  isVerified: boolean;
  isBuiltin?: boolean;
  status?: "active" | "archived";
  uniformOptions?: boolean;
  formulaVersion?: string;
  methodology: any;
  scoring: { min: number; max: number; scales: Scale[] };
  cases: any[];
  questions: { text: string; options: Option[] }[];
};
type State = {
  methodology: {
    title: string;
    author: string;
    version: string;
    year: number | null;
    summary: string;
    adaptation: string;
    rightsNote: string;
    steps: string[];
    keys?: { label: string; value: string }[];
    notes: string[];
    sources: { title: string; url: string }[];
  };
  questions: Question[];
  options: Option[];
  scoring: { min: number; max: number; scales: Scale[] };
  cases: CheckCase[];
};

const makeState = (): State => ({
  methodology: {
    title: "",
    author: "",
    version: "1.0",
    year: null,
    summary: "",
    adaptation: "",
    rightsNote: "",
    steps: [],
    keys: [],
    notes: [],
    sources: [],
  },
  questions: [],
  options: [1, 2, 3, 4, 5].map((value) => ({
    value: String(value),
    label: String(value),
  })),
  scoring: { min: 1, max: 5, scales: [] },
  cases: [],
});

const Panel = styled.div`
  display: grid;
  grid-template-columns: minmax(210px, 280px) minmax(0, 1fr);
  gap: 16px;
  align-items: start;
  .list,
  .editor {
    padding: 18px;
    border-radius: 18px;
  }
  .list-head,
  .section-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }
  .list-head h2,
  .section h2 {
    margin: 0;
    color: #395540;
    font-size: 18px;
  }
  .drafts {
    display: grid;
    gap: 8px;
    margin-top: 14px;
    max-height: 70vh;
    overflow: auto;
  }
  .draft {
    width: 100%;
    text-align: left;
    border: 1px solid #dce5d9;
    border-radius: 12px;
    background: #fff;
    padding: 11px;
    color: #354c3b;
  }
  .draft.active {
    border-color: #698875;
    background: #f1f6ef;
  }
  .draft b,
  .draft span {
    display: block;
  }
  .draft span {
    font-size: 11px;
    color: #839087;
    margin-top: 4px;
  }
  .editor {
    display: grid;
    gap: 14px;
  }
  .intro {
    color: #758279;
    font-size: 13px;
    line-height: 1.5;
    margin: 0;
  }
  .section {
    padding: 16px;
    border: 1px solid #e0e8dc;
    border-radius: 14px;
    background: #fff;
    display: grid;
    gap: 12px;
  }
  .section-head p {
    margin: 3px 0 0;
    color: #829087;
    font-size: 12px;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
  .field {
    display: grid;
    gap: 5px;
    color: #53685a;
    font-size: 12px;
    font-weight: 650;
  }
  .field.full {
    grid-column: 1/-1;
  }
  input,
  textarea,
  select {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #d6e1d3;
    border-radius: 10px;
    background: #fff;
    padding: 10px 12px;
    color: #263a2d;
    font: inherit;
    font-size: 14px;
    outline: none;
  }
  input:focus,
  textarea:focus {
    border-color: #779580;
    box-shadow: 0 0 0 3px #edf4ec;
  }
  textarea {
    min-height: 82px;
    resize: vertical;
  }
  .small-input {
    max-width: 100px;
  }
  .rows {
    display: grid;
    gap: 8px;
  }
  .row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 8px;
    align-items: center;
  }
  .row.question {
    grid-template-columns: 34px minmax(0, 1fr) auto;
  }
  .row.option {
    grid-template-columns: 95px minmax(0, 1fr) auto;
  }
  .row.source {
    grid-template-columns: minmax(150px, 0.8fr) minmax(180px, 1.2fr) auto;
  }
  .number {
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #edf3e9;
    color: #52715a;
    font-size: 12px;
    font-weight: 750;
  }
  .icon-button {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border: 1px solid #d6e1d3;
    border-radius: 10px;
    background: #f7faf6;
    color: #62796a;
    cursor: pointer;
  }
  .add {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    min-height: 38px;
    padding: 0 13px;
    border: 1px solid #bfd0bd;
    border-radius: 10px;
    background: #e8f1e5;
    color: #42614a;
    font-weight: 700;
    cursor: pointer;
  }
  .add:hover {
    background: #dcebd8;
  }
  .pill {
    display: inline-flex;
    padding: 5px 8px;
    border-radius: 999px;
    background: #eef4eb;
    color: #56745d;
    font-size: 11px;
    align-items: center;
    gap: 5px;
  }
  .muted {
    font-size: 12px;
    line-height: 1.5;
    color: #7f8d83;
    margin: 0;
  }
  .scale {
    display: grid;
    gap: 9px;
    padding: 13px;
    border: 1px solid #e0e8dc;
    border-radius: 12px;
    background: #fbfcfa;
  }
  .scale-top {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 140px auto;
    gap: 8px;
    align-items: center;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .chip {
    display: inline-flex;
    gap: 5px;
    align-items: center;
    padding: 5px 8px;
    border: 1px solid #dce5d9;
    border-radius: 8px;
    background: white;
    color: #52665a;
    font-size: 11px;
  }
  .chip input {
    width: auto;
    margin: 0;
    accent-color: #557660;
  }
  .case {
    padding: 12px;
    border: 1px solid #e1e9de;
    border-radius: 12px;
    display: grid;
    gap: 9px;
  }
  .case-head {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    align-items: center;
  }
  .case textarea {
    font:
      12px/1.5 ui-monospace,
      Consolas,
      monospace;
    min-height: 74px;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
    align-items: center;
  }
  .feedback {
    padding: 12px;
    border-radius: 11px;
    background: #f0f5ed;
    color: #45644c;
    font-size: 12px;
  }
  .feedback.error {
    background: #fff1ef;
    color: #a03e35;
  }
  .guard {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    padding: 12px;
    border-radius: 11px;
    background: #f6f2e7;
    color: #786842;
    font-size: 12px;
    line-height: 1.5;
  }
  .head-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .validation-case {
    margin-top: 9px;
    padding-top: 8px;
    border-top: 1px solid rgba(80, 110, 85, 0.15);
  }
  .validation-scale {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 12px;
    margin-top: 5px;
    font-size: 11px;
  }
  .validation-scale .ok {
    color: #3d7048;
  }
  .validation-scale .bad {
    color: #a03e35;
  }
  @media (max-width: 850px) {
    grid-template-columns: 1fr;
    .drafts {
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      max-height: 260px;
    }
    .grid {
      grid-template-columns: 1fr;
    }
    .field.full {
      grid-column: auto;
    }
    .row.source,
    .scale-top {
      grid-template-columns: 1fr;
    }
    .row.option {
      grid-template-columns: 80px minmax(0, 1fr) auto;
    }
  }
`;

export function MethodologyStudio() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [state, setState] = useState<State>(makeState);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [report, setReport] = useState<any>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const current = drafts.find((item) => item.id === selected);
  const locked = Boolean(current?.isVerified);
  const archived = current?.status === "archived";
  const usableOptions = useMemo(
    () =>
      state.options
        .map((option) => Number(option.value))
        .filter(Number.isInteger),
    [state.options],
  );

  const load = async (keep = "") => {
    const response = await api.get("/admin/methodology-studio");
    const rows: Draft[] = response.data;
    setDrafts(rows);
    const next = keep || selected || rows[0]?.id || "";
    setSelected(next);
    const item = rows.find((row) => row.id === next);
    if (item) hydrate(item);
    else setState(makeState());
  };
  const hydrate = (item: Draft) => {
    const options = item.questions[0]?.options?.length
      ? item.questions[0].options
      : makeState().options;
    setState({
      methodology: { ...makeState().methodology, ...(item.methodology ?? {}) },
      questions: item.questions.map((question) => ({ text: question.text })),
      options: options.map((option) => ({
        value: String(option.value),
        label: option.label,
      })),
      scoring: item.scoring ?? { min: 1, max: 5, scales: [] },
      cases: (item.cases ?? []).map((testCase, index) => ({
        title: testCase.title || `Пример ${index + 1}`,
        answersText: JSON.stringify(testCase.answers ?? {}, null, 2),
        expectedText: JSON.stringify(testCase.expected ?? {}, null, 2),
      })),
    });
    setErrors([]);
    setReport(null);
    setMessage("");
  };
  useEffect(() => {
    load().catch((error) =>
      setMessage(
        error?.response?.data?.message ??
          "Не удалось загрузить конструктор методик.",
      ),
    );
  }, []);

  const changeMeta = (key: string, value: unknown) =>
    setState((current) => ({
      ...current,
      methodology: { ...current.methodology, [key]: value },
    }));
  const changeScoring = (key: string, value: unknown) =>
    setState((current) => ({
      ...current,
      scoring: { ...current.scoring, [key]: value },
    }));
  const updateScale = (index: number, patch: Partial<Scale>) =>
    setState((current) => ({
      ...current,
      scoring: {
        ...current.scoring,
        scales: current.scoring.scales.map((scale, i) =>
          i === index ? { ...scale, ...patch } : scale,
        ),
      },
    }));
  const buildPayload = () => {
    const numericOptions = state.options.map((option) => ({
      ...option,
      value: String(Number(option.value)),
    }));
    const seen = new Set<string>();
    const scales = state.scoring.scales.map((scale) => {
      let key =
        scale.label
          .trim()
          .toLowerCase()
          .replace(/[^a-zа-яё0-9]+/gi, "_")
          .replace(/^_|_$/g, "") || "scale";
      const base = key;
      let suffix = 2;
      while (seen.has(key)) key = `${base}_${suffix++}`;
      seen.add(key);
      return { ...scale, key };
    });
    const cases = state.cases.map((testCase) => ({
      title: testCase.title,
      answers: JSON.parse(testCase.answersText || "{}"),
      expected: JSON.parse(testCase.expectedText || "{}"),
    }));
    const min = usableOptions.length ? Math.min(...usableOptions) : state.scoring.min;
    const max = usableOptions.length ? Math.max(...usableOptions) : state.scoring.max;
    const steps = [
      `Ответы кодируются целыми значениями от ${min} до ${max}.`,
      `Для обратно кодируемых пунктов используется преобразование ${min} + ${max} − ответ.`,
      ...scales.map(
        (scale) =>
          `Шкала «${scale.label}»: ${scale.aggregation === "sum" ? "сумма" : "среднее"} баллов по пунктам ${scale.items.join(", ") || "не выбраны"}.`,
      ),
      "Расчёт отображается только при наличии ответов на все пункты, включённые в шкалы.",
    ];
    const keys = scales.map((scale) => ({
      label: scale.label,
      value: `Пункты: ${scale.items.join(", ") || "не выбраны"}. Обратные: ${scale.reverseItems.join(", ") || "нет"}. Подсчёт: ${scale.aggregation === "sum" ? "сумма" : "среднее"}.`,
    }));
    return {
      methodology: { ...state.methodology, steps, keys },
      questions: state.questions.map((question) => ({
        ...question,
        options: numericOptions,
      })),
      scoring: { ...state.scoring, min, max, scales },
      cases,
    };
  };
  const save = async () => {
    setBusy(true);
    setErrors([]);
    setMessage("");
    try {
      const payload = buildPayload();
      let savedId = selected;
      if (savedId)
        await api.put(`/admin/methodology-studio/${savedId}`, payload);
      else {
        const response = await api.post("/admin/methodology-studio", payload);
        savedId = response.data.id;
        setSelected(savedId);
      }
      setReport(null);
      await load(savedId);
      setMessage("Черновик сохранён.");
    } catch (error: any) {
      setMessage(
        error?.response?.data?.message ??
          "Не удалось сохранить. Проверьте формат контрольных примеров.",
      );
    } finally {
      setBusy(false);
    }
  };
  const validate = async () => {
    setBusy(true);
    setErrors([]);
    setReport(null);
    setMessage("");
    try {
      const response = await api.post(
        "/admin/methodology-studio/validate",
        buildPayload(),
      );
      setErrors(response.data.errors ?? []);
      setReport(response.data.checks);
      setMessage(
        response.data.checks?.passed
          ? "Контрольные примеры и граничные значения прошли проверку."
          : "Проверка не пройдена. Сверьте ключи и ожидаемые значения.",
      );
    } catch (error: any) {
      setMessage(
        error?.response?.data?.message ??
          "Не удалось выполнить проверку. Проверьте JSON в контрольных примерах.",
      );
    } finally {
      setBusy(false);
    }
  };
  const publish = async () => {
    if (!selected) {
      setMessage("Сначала сохраните черновик.");
      return;
    }
    setBusy(true);
    setErrors([]);
    setMessage("");
    try {
      const payload = buildPayload();
      await api.put(`/admin/methodology-studio/${selected}`, payload);
      const response = await api.post(
        `/admin/methodology-studio/${selected}/publish`,
      );
      await load(response.data.instrument.id);
      setMessage("Методика опубликована и добавлена в каталог.");
      setReport({
        passed: true,
        results: [],
        boundaryChecks: [{ value: "min/max", passed: true }],
      });
    } catch (error: any) {
      setErrors(error?.response?.data?.errors ?? []);
      setReport(error?.response?.data?.checks ?? null);
      setMessage(
        error?.response?.data?.message ?? "Не удалось опубликовать методику.",
      );
    } finally {
      setBusy(false);
    }
  };
  const createDraft = async () => {
    setBusy(true);
    try {
      const blank = makeState();
      const response = await api.post("/admin/methodology-studio", {
        methodology: blank.methodology,
        questions: [],
        scoring: blank.scoring,
        cases: [],
      });
      await load(response.data.id);
    } catch (error: any) {
      setMessage(
        error?.response?.data?.message ?? "Не удалось создать черновик.",
      );
    } finally {
      setBusy(false);
    }
  };
  const deleteDraft = async () => {
    if (
      !selected ||
      locked ||
      !window.confirm(
        "Удалить черновик методики? Это действие нельзя отменить.",
      )
    )
      return;
    setBusy(true);
    try {
      await api.delete(`/admin/methodology-studio/${selected}`);
      await load("");
      setMessage("Черновик удалён.");
    } catch (error: any) {
      setMessage(
        error?.response?.data?.message ?? "Не удалось удалить черновик.",
      );
    } finally {
      setBusy(false);
    }
  };
  const removeMethod = async () => {
    if (!selected || archived) return;
    setBusy(true);
    try {
      const response = await api.delete(`/admin/methodology-studio/${selected}`);
      if (response.data.archived) await load(selected);
      else {
        setDrafts((items) => items.filter((item) => item.id !== selected));
        setSelected("");
        setState(makeState());
      }
      setMessage(locked ? "Методика перемещена в архив. Существующие опросы и результаты сохранены." : "Черновик методики удалён.");
    } catch (error: any) {
      setMessage(error?.response?.data?.message ?? "Не удалось удалить методику.");
    } finally {
      setBusy(false);
      setConfirmingDelete(false);
    }
  };
  const restoreMethod = async () => {
    if (!selected) return;
    setBusy(true);
    try {
      await api.post(`/admin/methodology-studio/${selected}/restore`);
      await load(selected);
      setMessage("Методика восстановлена и доступна для новых опросов.");
    } catch (error: any) {
      setMessage(error?.response?.data?.message ?? "Не удалось восстановить методику.");
    } finally {
      setBusy(false);
    }
  };
  const setCase = (index: number, patch: Partial<CheckCase>) =>
    setState((current) => ({
      ...current,
      cases: current.cases.map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    }));
  const addSource = () =>
    changeMeta("sources", [
      ...state.methodology.sources,
      { title: "", url: "" },
    ]);
  const updateSource = (
    index: number,
    patch: Partial<{ title: string; url: string }>,
  ) =>
    changeMeta(
      "sources",
      state.methodology.sources.map((source, i) =>
        i === index ? { ...source, ...patch } : source,
      ),
    );
  const addScale = () =>
    changeScoring("scales", [
      ...state.scoring.scales,
      { key: "", label: "", items: [], reverseItems: [], aggregation: "sum" },
    ]);

  return (
    <Panel>
      <Card className="list">
        <div className="list-head">
          <h2>Мои методики</h2>
          <button
            className="icon-button"
            aria-label="Новая методика"
            title="Новая методика"
            onClick={createDraft}
            disabled={busy}
          >
            <FilePlus2 size={17} />
          </button>
        </div>
        <p className="muted">
          В опубликованных методиках можно менять описание, источники и формулировки вопросов; ключи автоподсчёта остаются защищёнными.
        </p>
        <div className="drafts">
          {drafts.map((item) => (
            <button
              key={item.id}
              className={`draft ${selected === item.id ? "active" : ""}`}
              onClick={() => {
                setSelected(item.id);
                hydrate(item);
              }}
            >
              <b>{item.title}</b>
              <span>
                {item.status === "archived"
                  ? "В архиве · можно восстановить"
                  : item.isVerified
                    ? `${item.isBuiltin ? "Встроенная" : "Опубликована"} · версия ${item.formulaVersion ?? "фиксированная"}`
                    : "Черновик"}
              </span>
            </button>
          ))}
          {!drafts.length && (
            <p className="muted">Пока нет методик. Нажмите +, чтобы начать.</p>
          )}
        </div>
      </Card>
      <Card className="editor">
        <div className="section-head">
          <div>
            <h2>
              {locked ? "Опубликованная методика" : "Конструктор методики"}
            </h2>
            <p className="intro">
              Заполняйте по источнику. Автоподсчёт ограничен числовыми пунктами,
              обратным кодированием и суммой или средним по шкалам.
            </p>
          </div>
          <span className="pill">
            {locked ? (
              <>
                <ShieldCheck size={13} /> Зафиксирована
              </>
            ) : (
              "Черновик"
            )}
          </span>
        </div>
        <div className="guard">
          <CircleAlert size={16} /> Конструктор не подтверждает права на
          воспроизведение методики и корректность источника. Перед публикацией
          вручную сверяйте формулировки, ключ и контрольные ответы с
          первоисточником.
        </div>
        <section className="section">
          <div className="section-head">
            <div>
              <h2>1. Описание и источники</h2>
              <p>Эти сведения увидят исследователи в карточке методики.</p>
            </div>
          </div>
          <div className="grid">
            <label className="field">
              Название методики
              <input
                disabled={archived}
                value={state.methodology.title}
                onChange={(e) => changeMeta("title", e.target.value)}
                placeholder="Например, шкала академической мотивации"
              />
            </label>
            <label className="field">
              Автор / авторы
              <input
                disabled={archived}
                value={state.methodology.author}
                onChange={(e) => changeMeta("author", e.target.value)}
                placeholder="Фамилия, инициалы"
              />
            </label>
            <label className="field">
              Версия методики или ключа
              <input
                disabled={locked || archived}
                value={state.methodology.version}
                onChange={(e) => changeMeta("version", e.target.value)}
                placeholder="author-2024-v1"
              />
            </label>
            <label className="field">
              Год публикации
              <input
                disabled={archived}
                type="number"
                value={state.methodology.year ?? ""}
                onChange={(e) =>
                  changeMeta(
                    "year",
                    e.target.value ? Number(e.target.value) : null,
                  )
                }
                placeholder="Необязательно"
              />
            </label>
            <label className="field full">
              Краткое описание
              <textarea
                disabled={archived}
                value={state.methodology.summary}
                onChange={(e) => changeMeta("summary", e.target.value)}
                placeholder="Что измеряет методика, для какой группы и как интерпретировать высокий балл"
              />
            </label>
            <label className="field full">
              Адаптация и версия текста
              <textarea
                disabled={archived}
                value={state.methodology.adaptation}
                onChange={(e) => changeMeta("adaptation", e.target.value)}
                placeholder="Например: русскоязычная адаптация, выборка, особенности формулировок"
              />
            </label>
            <label className="field full">
              Основание для использования текста и ключа
              <textarea
                disabled={archived}
                value={state.methodology.rightsNote}
                onChange={(e) => changeMeta("rightsNote", e.target.value)}
                placeholder="Лицензия, public domain, письменное разрешение или ссылка на условия использования"
              />
            </label>
            <label className="field full">
              Примечания и ограничения интерпретации
              <textarea
                disabled={archived}
                value={state.methodology.notes.join("\n")}
                onChange={(e) =>
                  changeMeta(
                    "notes",
                    e.target.value
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean),
                  )
                }
                placeholder="Например: методика не предназначена для постановки диагноза; не использовать пороги без опубликованных норм"
              />
            </label>
          </div>
          <div className="rows">
            {state.methodology.sources.map((source, index) => (
              <div className="row source" key={index}>
                <input
                  disabled={archived}
                  value={source.title}
                  onChange={(e) =>
                    updateSource(index, { title: e.target.value })
                  }
                  placeholder="Название источника"
                />
                <input
                  disabled={archived}
                  value={source.url}
                  onChange={(e) => updateSource(index, { url: e.target.value })}
                  placeholder="https://…"
                />
                <button
                  className="icon-button"
                  disabled={archived}
                  onClick={() =>
                    changeMeta(
                      "sources",
                      state.methodology.sources.filter((_, i) => i !== index),
                    )
                  }
                  aria-label="Удалить источник"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          <button className="add" disabled={archived} onClick={addSource}>
            <Link2 size={15} /> Добавить источник
          </button>
        </section>
        <section className="section">
          <div className="section-head">
            <div>
              <h2>2. Вопросы и варианты ответа</h2>
              <p>
                Одинаковая числовая шкала применяется к каждому пункту; текст
                пункта можно менять отдельно.
              </p>
            </div>
            <span className="pill">{state.questions.length} пунктов</span>
          </div>
          <p className="muted">
            Числовой диапазон автоматически определяется по вариантам ниже.
            Значения должны быть целыми и непрерывными. В конструкторе
            поддерживаются один ответ на пункт, одинаковый числовой диапазон,
            равный вес пунктов, обратное кодирование и шкалы «сумма» или
            «среднее».
          </p>
          <div className="rows">
            {state.options.map((option, index) => (
              <div className="row option" key={index}>
                <input
                  disabled={locked || archived}
                  type="number"
                  value={option.value}
                  onChange={(e) =>
                    setState((current) => ({
                      ...current,
                      options: current.options.map((item, i) =>
                        i === index ? { ...item, value: e.target.value } : item,
                      ),
                    }))
                  }
                />
                <input
                  disabled={(locked && !current?.uniformOptions) || archived}
                  value={option.label}
                  onChange={(e) =>
                    setState((current) => ({
                      ...current,
                      options: current.options.map((item, i) =>
                        i === index ? { ...item, label: e.target.value } : item,
                      ),
                    }))
                  }
                  placeholder="Подпись варианта"
                />
                <button
                  className="icon-button"
                  disabled={locked || state.options.length <= 2}
                  onClick={() =>
                    setState((current) => ({
                      ...current,
                      options: current.options.filter((_, i) => i !== index),
                    }))
                  }
                  aria-label="Удалить вариант"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
          <button
            className="add"
            disabled={locked}
            onClick={() =>
              setState((current) => ({
                ...current,
                options: [
                  ...current.options,
                  {
                    value: String(
                      Number(current.options.at(-1)?.value ?? 0) + 1,
                    ),
                    label: "",
                  },
                ],
              }))
            }
          >
            <Plus size={15} /> Добавить вариант ответа
          </button>
          <div className="rows">
            {state.questions.map((question, index) => (
              <div className="row question" key={index}>
                <span className="number">{index + 1}</span>
                <input
                  disabled={archived}
                  value={question.text}
                  onChange={(e) =>
                    setState((current) => ({
                      ...current,
                      questions: current.questions.map((item, i) =>
                        i === index ? { text: e.target.value } : item,
                      ),
                    }))
                  }
                  placeholder={`Текст пункта ${index + 1}`}
                />
                <button
                  className="icon-button"
                  disabled={locked}
                  onClick={() =>
                    setState((current) => ({
                      ...current,
                      questions: current.questions.filter(
                        (_, i) => i !== index,
                      ),
                      scoring: {
                        ...current.scoring,
                        scales: current.scoring.scales.map((scale) => ({
                          ...scale,
                          items: scale.items
                            .filter((item) => item !== index + 1)
                            .map((item) =>
                              item > index + 1 ? item - 1 : item,
                            ),
                          reverseItems: scale.reverseItems
                            .filter((item) => item !== index + 1)
                            .map((item) =>
                              item > index + 1 ? item - 1 : item,
                            ),
                        })),
                      },
                    }))
                  }
                  aria-label="Удалить пункт"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
          <button
            className="add"
            disabled={locked}
            onClick={() =>
              setState((current) => ({
                ...current,
                questions: [...current.questions, { text: "" }],
              }))
            }
          >
            <Plus size={15} /> Добавить пункт методики
          </button>
        </section>
        <section className="section">
          <div className="section-head">
            <div>
              <h2>3. Настройка автоподсчёта</h2>
              <p>
                Для каждой шкалы выберите пункты, обратное кодирование и способ
                агрегирования.
              </p>
            </div>
          </div>
          {state.scoring.scales.map((scale, index) => (
            <div className="scale" key={index}>
              <div className="scale-top">
                <input
                  disabled={locked}
                  value={scale.label}
                  onChange={(e) =>
                    updateScale(index, {
                      label: e.target.value,
                      key: e.target.value
                        .toLowerCase()
                        .replace(/[^a-zа-яё0-9]+/gi, "_"),
                    })
                  }
                  placeholder="Название шкалы"
                />
                <select
                  disabled={locked}
                  value={scale.aggregation}
                  onChange={(e) =>
                    updateScale(index, {
                      aggregation: e.target.value as "sum" | "mean",
                    })
                  }
                >
                  <option value="sum">Сумма баллов</option>
                  <option value="mean">Среднее значение</option>
                </select>
                <button
                  className="icon-button"
                  disabled={locked}
                  onClick={() =>
                    changeScoring(
                      "scales",
                      state.scoring.scales.filter((_, i) => i !== index),
                    )
                  }
                  aria-label="Удалить шкалу"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <div>
                <p className="muted">Пункты, входящие в шкалу</p>
                <div className="chips">
                  {state.questions.map((_, itemIndex) => (
                    <label className="chip" key={itemIndex}>
                      <input
                        disabled={locked}
                        type="checkbox"
                        checked={scale.items.includes(itemIndex + 1)}
                        onChange={(e) =>
                          updateScale(index, {
                            items: e.target.checked
                              ? [...scale.items, itemIndex + 1].sort(
                                  (a, b) => a - b,
                                )
                              : scale.items.filter(
                                  (item) => item !== itemIndex + 1,
                                ),
                            reverseItems: e.target.checked
                              ? scale.reverseItems
                              : scale.reverseItems.filter(
                                  (item) => item !== itemIndex + 1,
                                ),
                          })
                        }
                      />
                      {itemIndex + 1}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="muted">
                  Обратно кодируемые пункты (после выбора шкалы)
                </p>
                <div className="chips">
                  {scale.items.map((item) => (
                    <label className="chip" key={item}>
                      <input
                        disabled={locked}
                        type="checkbox"
                        checked={scale.reverseItems.includes(item)}
                        onChange={(e) =>
                          updateScale(index, {
                            reverseItems: e.target.checked
                              ? [...scale.reverseItems, item].sort(
                                  (a, b) => a - b,
                                )
                              : scale.reverseItems.filter(
                                  (value) => value !== item,
                                ),
                          })
                        }
                      />
                      {item}R
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <button className="add" disabled={locked} onClick={addScale}>
            <Plus size={15} /> Добавить шкалу
          </button>
        </section>
        <section className="section">
          <div className="section-head">
            <div>
              <h2>4. Контрольные примеры</h2>
              <p>
                Внесите реальные примеры «ответы → ожидаемые баллы» из ключа или
                проверенного расчёта. Публикация доступна после двух успешных
                примеров и автоматической проверки границ диапазона.
              </p>
            </div>
          </div>
          {state.cases.map((testCase, index) => (
            <div className="case" key={index}>
              <div className="case-head">
                <b>Пример {index + 1}</b>
                <button
                  className="icon-button"
                  disabled={locked}
                  onClick={() =>
                    setState((current) => ({
                      ...current,
                      cases: current.cases.filter((_, i) => i !== index),
                    }))
                  }
                  aria-label="Удалить пример"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <input
                disabled={locked}
                value={testCase.title}
                onChange={(e) => setCase(index, { title: e.target.value })}
                placeholder="Например: проверка обратного пункта"
              />
              <div className="grid">
                <label className="field">
                  Ответы по номерам пунктов
                  <textarea
                    disabled={locked}
                    value={testCase.answersText}
                    onChange={(e) =>
                      setCase(index, { answersText: e.target.value })
                    }
                    placeholder={'{"1": 1, "2": 5}'}
                  />
                </label>
                <label className="field">
                  Ожидаемый результат по кодам шкал
                  <textarea
                    disabled={locked}
                    value={testCase.expectedText}
                    onChange={(e) =>
                      setCase(index, { expectedText: e.target.value })
                    }
                    placeholder={'{"obshchaya_shkala": 3}'}
                  />
                </label>
              </div>
            </div>
          ))}
          <button
            className="add"
            disabled={locked}
            onClick={() =>
              setState((current) => ({
                ...current,
                cases: [
                  ...current.cases,
                  {
                    title: `Пример ${current.cases.length + 1}`,
                    answersText: "{}",
                    expectedText: "{}",
                  },
                ],
              }))
            }
          >
            <Plus size={15} /> Добавить контрольный пример
          </button>
          <p className="muted">
            Формат: в ответах ключ — номер пункта, значение — выбранный числовой
            балл; в ожидаемом результате ключ — код шкалы, значение — сумма или
            среднее после обратного кодирования.
          </p>
        </section>
        {(message || errors.length > 0 || report) && (
          <div
            className={`feedback ${errors.length || report?.passed === false ? "error" : ""}`}
          >
            {message}
            {errors.length > 0 && (
              <ul>
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            )}
            {report && (
              <div>
                <b>Контрольные значения:</b>{" "}
                {report.results?.map((result: any) => (
                  <div className="validation-case" key={result.title}>
                    <b>
                      {result.title}: {result.passed ? "✓ пройден" : "ошибка"}
                    </b>
                    <div className="validation-scale">
                      {result.differences?.map((difference: any) => (
                        <span
                          className={difference.passed ? "ok" : "bad"}
                          key={difference.key}
                        >
                          {difference.label}: ожидалось {difference.expected},
                          получилось {difference.actual ?? "нет результата"}
                        </span>
                      ))}
                    </div>
                    {!!result.missingItems?.length && (
                      <small className="bad">
                        Не заданы ответы на пункты:{" "}
                        {result.missingItems.join(", ")}
                      </small>
                    )}
                  </div>
                ))}{" "}
                {report.boundaryChecks?.map((result: any) => (
                  <span key={String(result.value)}>
                    {" "}
                    граница {result.value}: {result.passed ? "✓" : "ошибка"};
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="actions">
          {locked && !archived && <Button onClick={save} disabled={busy}><Save size={15} /> Сохранить изменения</Button>}
          {locked && !archived && <button className="add" onClick={() => setConfirmingDelete(true)} disabled={busy}><Trash2 size={15} /> Убрать из каталога</button>}
          {archived && locked && <Button onClick={restoreMethod} disabled={busy}>Восстановить методику</Button>}
          {!locked && (
            <>
              <Button onClick={save} disabled={busy}>
                <Save size={15} /> Сохранить черновик
              </Button>
              <Button onClick={validate} disabled={busy}>
                <Check size={15} /> Проверить расчёт
              </Button>
              <Button onClick={publish} disabled={busy}>
                <Upload size={15} /> Опубликовать в каталог
              </Button>
              {selected && (
                <button className="add" onClick={() => setConfirmingDelete(true)} disabled={busy}>
                  <Trash2 size={15} /> Удалить черновик
                </button>
              )}
            </>
          )}
          {locked && (
            <span className="muted">
              Формула версии {current?.formulaVersion} неизменяема. Чтобы
              изменить расчёт, создайте отдельную версию методики.
            </span>
          )}
        </div>
        {confirmingDelete && (
          <div role="presentation" onClick={() => setConfirmingDelete(false)} style={{ position: "fixed", inset: 0, zIndex: 1000, display: "grid", placeItems: "center", padding: 20, background: "rgba(24, 36, 28, .42)" }}>
            <div role="dialog" aria-modal="true" aria-labelledby="method-delete-title" onClick={(event) => event.stopPropagation()} style={{ width: "min(460px, 100%)", padding: 24, borderRadius: 18, background: "#fff", boxShadow: "0 24px 80px rgba(20, 35, 24, .25)" }}>
              <h2 id="method-delete-title" style={{ margin: "0 0 10px", color: "#395540" }}>{locked ? "Убрать методику из каталога?" : "Удалить черновик методики?"}</h2>
              <p className="muted">{locked ? "Она перестанет показываться при создании новых опросов. Уже созданные исследования, вопросы и результаты останутся доступны; методику можно восстановить." : "Черновик будет удалён без возможности восстановления."}</p>
              <div className="actions" style={{ marginTop: 20, justifyContent: "flex-end" }}>
                <Button onClick={() => setConfirmingDelete(false)} disabled={busy}>Отмена</Button>
                <Button onClick={removeMethod} disabled={busy}><Trash2 size={15} /> {locked ? "Убрать" : "Удалить"}</Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </Panel>
  );
}
