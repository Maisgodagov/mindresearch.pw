import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  CircleAlert,
  Link2,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { api } from "../../api";
import { Button, Card } from "../../ui";
import { FieldInput } from "../../components/FieldInput";
import { TextAreaField } from "../../components/TextAreaField";
import { SelectField as Select } from "../../components/SelectField";
import { makeState } from "./const";
import type {
  CheckCase,
  Draft,
  Option,
  Question,
  Scale,
  State,
  ValidationReport,
} from "./types";
import { isValidationReport } from "./types";
import {
  getApiErrorList,
  getApiErrorMessage,
  getApiErrorPayload,
} from "../../utils/apiErrors";
import { Panel } from "./styles";
import { DraftList } from "./components/DraftList";

export function MethodologyStudio() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [state, setState] = useState<State>(makeState);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [bulkQuestions, setBulkQuestions] = useState("");
  const current = drafts.find((item) => item.id === selected);
  const locked = Boolean(current?.isVerified);
  const archived = Boolean(
    current?.isVerified && current.status === "archived",
  );
  const usableOptions = useMemo(
    () =>
      state.options
        .map((option) => Number(option.value))
        .filter(Number.isInteger),
    [state.options],
  );
  const parsedBulkQuestions = useMemo(
    () =>
      bulkQuestions
        .split(/\r?\n/)
        .map((line) => line.trim().replace(/^(?:\d+[.)]\s*|[-•*]\s*)/, ""))
        .filter(Boolean),
    [bulkQuestions],
  );
  const uncoveredQuestionNumbers = useMemo(
    () =>
      state.questions.flatMap((_, index) =>
        state.scoring.scales.some((scale) => scale.items.includes(index + 1))
          ? []
          : [index + 1],
      ),
    [state.questions, state.scoring.scales],
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
    setBulkQuestions("");
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
    const min = usableOptions.length
      ? Math.min(...usableOptions)
      : state.scoring.min;
    const max = usableOptions.length
      ? Math.max(...usableOptions)
      : state.scoring.max;
    const steps = [
      `Ответы кодируются целыми значениями от ${min} до ${max}.`,
      `Для обратно кодируемых вопросов используется преобразование ${min} + ${max} − ответ.`,
      ...scales.map(
        (scale) =>
          `Шкала «${scale.label}»: ${scale.aggregation === "sum" ? "сумма" : "среднее"} баллов по вопросам ${scale.items.join(", ") || "не выбраны"}.`,
      ),
      "Расчёт отображается только при наличии ответов на все вопросы, включённые в шкалы.",
    ];
    const keys = scales.map((scale) => ({
      label: scale.label,
      value: `Вопросы: ${scale.items.join(", ") || "не выбраны"}. Обратно кодируемые: ${scale.reverseItems.join(", ") || "нет"}. Подсчёт: ${scale.aggregation === "sum" ? "сумма" : "среднее"}.`,
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
    } catch (error: unknown) {
      setMessage(
        getApiErrorMessage(
          error,
          "Не удалось сохранить. Проверьте формат контрольных примеров.",
        ),
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
    } catch (error: unknown) {
      setMessage(
        getApiErrorMessage(
          error,
          "Не удалось выполнить проверку. Проверьте JSON в контрольных примерах.",
        ),
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
    } catch (error: unknown) {
      const payload = getApiErrorPayload(error);
      setErrors(getApiErrorList(error));
      setReport(isValidationReport(payload?.checks) ? payload.checks : null);
      setMessage(
        getApiErrorMessage(error, "Не удалось опубликовать методику."),
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
    } catch (error: unknown) {
      setMessage(getApiErrorMessage(error, "Не удалось создать черновик."));
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
    } catch (error: unknown) {
      setMessage(getApiErrorMessage(error, "Не удалось удалить черновик."));
    } finally {
      setBusy(false);
    }
  };
  const removeMethod = async () => {
    if (!selected || archived) return;
    setBusy(true);
    try {
      const response = await api.delete(
        `/admin/methodology-studio/${selected}`,
      );
      if (response.data.archived) await load(selected);
      else {
        setDrafts((items) => items.filter((item) => item.id !== selected));
        setSelected("");
        setState(makeState());
      }
      setMessage(
        locked
          ? "Методика перемещена в архив. Существующие опросы и результаты сохранены."
          : "Черновик методики удалён.",
      );
    } catch (error: unknown) {
      setMessage(getApiErrorMessage(error, "Не удалось удалить методику."));
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
    } catch (error: unknown) {
      setMessage(
        getApiErrorMessage(error, "Не удалось восстановить методику."),
      );
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
  const importQuestions = () => {
    const remaining = Math.max(0, 300 - state.questions.length);
    const imported = parsedBulkQuestions.slice(0, remaining);
    if (!imported.length) {
      setMessage(
        remaining
          ? "Добавьте вопросы: каждый вопрос должен быть на отдельной строке."
          : "Достигнут лимит в 300 вопросов.",
      );
      return;
    }
    setState((current) => ({
      ...current,
      questions: [...current.questions, ...imported.map((text) => ({ text }))],
    }));
    setBulkQuestions("");
    setMessage(
      imported.length < parsedBulkQuestions.length
        ? "Часть вопросов добавлена; достигнут лимит в 300 вопросов."
        : "Список вопросов добавлен.",
    );
  };

  return (
    <Panel>
      <DraftList
        drafts={drafts}
        selectedId={selected}
        busy={busy}
        onCreate={createDraft}
        onSelect={(draft) => {
          setSelected(draft.id);
          hydrate(draft);
        }}
      />
      <Card className="editor">
        <div className="section-head">
          <div>
            <h2>
              {locked ? "Опубликованная методика" : "Конструктор методики"}
            </h2>
            <p className="intro">
              Заполняйте по источнику. Автоподсчёт ограничен числовыми ответами,
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
              <FieldInput
                disabled={archived}
                value={state.methodology.title}
                onChange={(e) => changeMeta("title", e.target.value)}
                placeholder="Например, шкала академической мотивации"
              />
            </label>
            <label className="field">
              Автор / авторы
              <FieldInput
                disabled={archived}
                value={state.methodology.author}
                onChange={(e) => changeMeta("author", e.target.value)}
                placeholder="Фамилия, инициалы"
              />
            </label>
            <label className="field">
              Версия методики или ключа
              <FieldInput
                disabled={locked || archived}
                value={state.methodology.version}
                onChange={(e) => changeMeta("version", e.target.value)}
                placeholder="author-2024-v1"
              />
            </label>
            <label className="field">
              Год публикации
              <FieldInput
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
              <TextAreaField
                disabled={archived}
                value={state.methodology.summary}
                onChange={(e) => changeMeta("summary", e.target.value)}
                placeholder="Что измеряет методика, для какой группы и как интерпретировать высокий балл"
              />
            </label>
            <label className="field full">
              Адаптация и версия текста
              <TextAreaField
                disabled={archived}
                value={state.methodology.adaptation}
                onChange={(e) => changeMeta("adaptation", e.target.value)}
                placeholder="Например: русскоязычная адаптация, выборка, особенности формулировок"
              />
            </label>
            <label className="field full">
              Основание для использования текста и ключа
              <TextAreaField
                disabled={archived}
                value={state.methodology.rightsNote}
                onChange={(e) => changeMeta("rightsNote", e.target.value)}
                placeholder="Лицензия, public domain, письменное разрешение или ссылка на условия использования"
              />
            </label>
            <label className="field full">
              Примечания и ограничения интерпретации
              <TextAreaField
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
                <FieldInput
                  disabled={archived}
                  value={source.title}
                  onChange={(e) =>
                    updateSource(index, { title: e.target.value })
                  }
                  placeholder="Название источника"
                />
                <FieldInput
                  disabled={archived}
                  value={source.url}
                  onChange={(e) => updateSource(index, { url: e.target.value })}
                  placeholder="https://…"
                />
                <Button
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
                </Button>
              </div>
            ))}
          </div>
          <Button className="add" disabled={archived} onClick={addSource}>
            <Link2 size={15} /> Добавить источник
          </Button>
        </section>
        <section className="section">
          <div className="section-head">
            <div>
              <h2>2. Вопросы и варианты ответа</h2>
              <p>
                Одинаковая числовая шкала применяется к каждому вопросу;
                формулировку можно менять отдельно.
              </p>
            </div>
            <span className="pill">{state.questions.length} вопросов</span>
          </div>
          <p className="muted">
            Числовой диапазон автоматически определяется по вариантам ниже.
            Значения должны быть целыми и непрерывными. В конструкторе
            поддерживаются один ответ на вопрос, одинаковый числовой диапазон,
            равный вес вопросов, обратное кодирование и шкалы «сумма» или
            «среднее».
          </p>
          <div className="rows">
            {state.options.map((option, index) => (
              <div className="row option" key={index}>
                <FieldInput
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
                <FieldInput
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
                <Button
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
                </Button>
              </div>
            ))}
          </div>
          {!locked && (
            <div className="bulk-import">
              <label className="field">
                Быстро добавить несколько вопросов
                <TextAreaField
                  disabled={archived}
                  value={bulkQuestions}
                  onChange={(event) => setBulkQuestions(event.target.value)}
                  placeholder={
                    "Вставьте список: один вопрос на строку\n1. Первый вопрос\n2. Второй вопрос"
                  }
                />
              </label>
              <p className="muted">
                Нумерация и маркеры списка в начале строки будут убраны. После
                добавления проверьте, в какие шкалы входят новые вопросы.
              </p>
              <Button
                className="add"
                disabled={archived || parsedBulkQuestions.length === 0}
                onClick={importQuestions}
              >
                <Plus size={15} /> Добавить вопросы
                {parsedBulkQuestions.length
                  ? ` (${parsedBulkQuestions.length})`
                  : ""}
              </Button>
            </div>
          )}
          <Button
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
          </Button>
          <div className="rows">
            {state.questions.map((question, index) => (
              <div className="row question" key={index}>
                <span className="number">{index + 1}</span>
                <FieldInput
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
                  placeholder={`Текст вопроса ${index + 1}`}
                />
                <Button
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
                  aria-label="Удалить вопрос"
                >
                  <Trash2 size={15} />
                </Button>
              </div>
            ))}
          </div>
          <Button
            className="add"
            disabled={locked}
            onClick={() =>
              setState((current) => ({
                ...current,
                questions: [...current.questions, { text: "" }],
              }))
            }
          >
            <Plus size={15} /> Добавить вопрос
          </Button>
        </section>
        <section className="section">
          <div className="section-head">
            <div>
              <h2>3. Настройка автоподсчёта</h2>
              <p>
                Для каждой шкалы выберите вопросы, обратное кодирование и способ
                агрегирования.
              </p>
            </div>
          </div>
          {state.scoring.scales.map((scale, index) => (
            <div className="scale" key={index}>
              <div className="scale-top">
                <FieldInput
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
                <Select
                  disabled={locked}
                  value={scale.aggregation}
                  options={[
                    { value: "sum", label: "Сумма баллов" },
                    { value: "mean", label: "Среднее значение" },
                  ]}
                  onChange={(value) =>
                    updateScale(index, {
                      aggregation: value as "sum" | "mean",
                    })
                  }
                />
                <Button
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
                </Button>
              </div>
              <div>
                <p className="muted">Вопросы, входящие в шкалу</p>
                <div className="chips">
                  {state.questions.map((_, itemIndex) => (
                    <label className="chip" key={itemIndex}>
                      <FieldInput
                        disabled={locked}
                        type="checkbox"
                        title={state.questions[itemIndex].text}
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
                  Обратно кодируемые вопросы (после выбора шкалы)
                </p>
                <div className="chips">
                  {scale.items.map((item) => (
                    <label className="chip" key={item}>
                      <FieldInput
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
          {!locked && uncoveredQuestionNumbers.length > 0 && (
            <p className="coverage-warning">
              Пока не включены ни в одну шкалу: вопросы{" "}
              {uncoveredQuestionNumbers.join(", ")}. Если по методике они должны
              участвовать в подсчёте, отметьте их в нужной шкале. Вопросы о
              респонденте или контрольные вопросы можно оставить вне шкал.
            </p>
          )}
          <Button className="add" disabled={locked} onClick={addScale}>
            <Plus size={15} /> Добавить шкалу
          </Button>
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
                <Button
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
                </Button>
              </div>
              <FieldInput
                disabled={locked}
                value={testCase.title}
                onChange={(e) => setCase(index, { title: e.target.value })}
                placeholder="Например: проверка обратно кодируемого вопроса"
              />
              <div className="grid">
                <label className="field">
                  Ответы по номерам вопросов
                  <TextAreaField
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
                  <TextAreaField
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
          <Button
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
          </Button>
          <p className="muted">
            Формат: в ответах ключ — номер вопроса, значение — выбранный
            числовой балл; в ожидаемом результате ключ — код шкалы, значение —
            сумма или среднее после обратного кодирования.
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
                {report.results.map((result) => (
                  <div className="validation-case" key={result.title}>
                    <b>
                      {result.title}: {result.passed ? "✓ пройден" : "ошибка"}
                    </b>
                    <div className="validation-scale">
                      {result.differences.map((difference) => (
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
                        Не заданы ответы на вопросы:{" "}
                        {result.missingItems.join(", ")}
                      </small>
                    )}
                  </div>
                ))}{" "}
                {report.boundaryChecks.map((result) => (
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
          {locked && !archived && (
            <Button onClick={save} disabled={busy}>
              <Save size={15} /> Сохранить изменения
            </Button>
          )}
          {locked && !archived && (
            <Button
              className="add"
              onClick={() => setConfirmingDelete(true)}
              disabled={busy}
            >
              <Trash2 size={15} /> Убрать из каталога
            </Button>
          )}
          {archived && locked && (
            <Button onClick={restoreMethod} disabled={busy}>
              Восстановить методику
            </Button>
          )}
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
                <Button
                  className="add"
                  onClick={() => setConfirmingDelete(true)}
                  disabled={busy}
                >
                  <Trash2 size={15} /> Удалить черновик
                </Button>
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
          <div
            role="presentation"
            onClick={() => setConfirmingDelete(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1000,
              display: "grid",
              placeItems: "center",
              padding: 20,
              background: "rgba(24, 36, 28, .42)",
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="method-delete-title"
              onClick={(event) => event.stopPropagation()}
              style={{
                width: "min(460px, 100%)",
                padding: 24,
                borderRadius: 18,
                background: "#fff",
                boxShadow: "0 24px 80px rgba(20, 35, 24, .25)",
              }}
            >
              <h2
                id="method-delete-title"
                style={{ margin: "0 0 10px", color: "#395540" }}
              >
                {locked
                  ? "Убрать методику из каталога?"
                  : "Удалить черновик методики?"}
              </h2>
              <p className="muted">
                {locked
                  ? "Она перестанет показываться при создании новых опросов. Уже созданные исследования, вопросы и результаты останутся доступны; методику можно восстановить."
                  : "Черновик будет удалён без возможности восстановления."}
              </p>
              <div
                className="actions"
                style={{ marginTop: 20, justifyContent: "flex-end" }}
              >
                <Button
                  onClick={() => setConfirmingDelete(false)}
                  disabled={busy}
                >
                  Отмена
                </Button>
                <Button onClick={removeMethod} disabled={busy}>
                  <Trash2 size={15} /> {locked ? "Убрать" : "Удалить"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </Panel>
  );
}
