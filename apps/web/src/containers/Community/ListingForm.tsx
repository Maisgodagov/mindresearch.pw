import { useEffect, useRef, useState } from "react";
import { Button, Form, Popover, Slider } from "antd";
import { ChevronDown } from "lucide-react";
import { SelectField as AppSelect, type SelectFieldProps } from "../../components/SelectField";
import { FieldInput } from "../../components/FieldInput";
import { TextAreaField } from "../../components/TextAreaField";
import { api } from "../../api";
import { getApiErrorMessage } from "../../utils/apiErrors";
import { labels, options, profileFields, rewardFor } from "./model";

// Form.Item supplies value/onChange to the shared application control.
function SelectField(props: Omit<SelectFieldProps, "onChange"> & { onChange?: SelectFieldProps["onChange"] }) {
  return <AppSelect {...props} onChange={props.onChange ?? (() => {})} />;
}

function RangeField({ value, onChange, min, max, label, unit }: {
  value?: number[]; onChange?: (v: number[]) => void; min: number; max: number; label: string; unit: string;
}) {
  const [open, setOpen] = useState(false);
  const range = value ?? [min, max];
  const update = (index: number, raw: string) => {
    if (!raw) return;
    const n = Math.max(min, Math.min(max, Math.round(Number(raw))));
    if (!Number.isFinite(n)) return;
    onChange?.(index === 0 ? [Math.min(n, range[1]), range[1]] : [range[0], Math.max(n, range[0])]);
  };
  return <Popover trigger="click" open={open} onOpenChange={setOpen} placement="bottomLeft" content={
    <div className="listing-range-popup" style={{ width: 260 }}>
      <Slider range min={min} max={max} value={range} onChange={v => onChange?.(v)} ariaLabelForHandle={[`${label} от`, `${label} до`]} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <label>От<FieldInput type="number" aria-label={`${label}: минимум`} min={min} max={max} value={range[0]} onChange={e => update(0, e.target.value)} /></label>
        <label>До<FieldInput type="number" aria-label={`${label}: максимум`} min={min} max={max} value={range[1]} onChange={e => update(1, e.target.value)} /></label>
      </div>
      <Button type="primary" style={{ marginTop: 14, width: "100%" }} onClick={() => setOpen(false)}>Готово</Button>
    </div>
  }><button type="button" className="listing-range-control" aria-label={label} aria-expanded={open}>
    <span>{range[0] === range[1] ? range[0] : `${range[0]}–${range[1]}`} {unit}</span><ChevronDown size={15} />
  </button></Popover>;
}
const stages = ["Об опросе", "Участники", "Бюджет"];
export function ListingForm({ available, initial, selectedSurvey, onSaved, onCancel }: {
  available: number; initial?: any; selectedSurvey?: string; onSaved: () => Promise<void>; onCancel: () => void;
}) {
  const [form] = Form.useForm();
  const section = useRef<HTMLElement>(null);
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);
  const values = Form.useWatch([], form) ?? {};
  const selected = surveys.find(s => s.id === values.surveyId);
  const minutes = initial?.config.minutes ?? selected?.minutes ?? 5;
  const reward = rewardFor(minutes);
  const old = initial?.config.criteria ?? {};
  const initialChildren = old.childrenMax === 0 ? "no" : (old.childrenMin ?? 0) > 0 ? "yes" : "any";
  const audience = () => {
    const v = form.getFieldsValue(true);
    const criteria: any = {
      ageMin: v.ageRange?.[0] ?? 18, ageMax: v.ageRange?.[1] ?? 100,
      sex: v.sex === "any" ? [] : [v.sex], education: v.education ?? [], employment: v.employment ?? [], marital: v.marital ?? [],
    };
    if (v.studying && v.studying !== "any") criteria.studying = v.studying;
    if (v.hasChildren === "no") criteria.childrenMin = criteria.childrenMax = 0;
    if (v.hasChildren === "yes") { criteria.childrenMin = v.childrenRange?.[0] ?? 1; criteria.childrenMax = v.childrenRange?.[1] ?? 30; }
    return criteria;
  };
  useEffect(() => {
    let alive = true;
    api.get("/community/surveys").then(r => { if (alive) setSurveys(r.data); })
      .catch(e => { if (alive) setError(getApiErrorMessage(e, "Не удалось загрузить опросы.")); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);
  const go = (n: number) => { setStep(n); setError(""); section.current?.scrollIntoView({ block: "start" }); };
  async function next() {
    try {
      await form.validateFields(step === 0 ? ["surveyId", "description", "sensitive"] : ["target"]);
      if (step === 0 && !initial && (!selected || selected.minutes > 240)) { setError("Выберите опрос длительностью до 240 минут."); return; }
      go(step + 1);
    } catch { /* Errors appear beside fields. */ }
  }
  async function save() {
    setError("");
    try {
      await form.validateFields();
      const v = form.getFieldsValue(true);
      const quotas = initial ? initial.config.quotas.map((q: any, i: number) => ({ ...q, ...(initial.config.quotas.length === 1 && i === 0 ? { target: Number(v.target) } : {}) }))
        : [{ id: "all", label: "Все подходящие участники", ageMin: 18, ageMax: 100, target: Number(v.target) }];
      const config = { surveyId: v.surveyId, description: v.description, sensitive: v.sensitive ?? "", topic: initial?.config.topic ?? "Исследование", minutes,
        criteria: audience(), screening: [], quotas, budget: initial?.config.budget ?? Number(v.budget) };
      setBusy(true);
      if (initial) await api.patch(`/community/listings/${initial.id}`, { config });
      else await api.post("/community/listings", config);
      await onSaved();
    } catch (e: any) {
      if (e.errorFields?.length) setStep(e.errorFields[0].name[0] === "budget" ? 2 : e.errorFields[0].name[0] === "target" ? 1 : 0);
      else setError(getApiErrorMessage(e, "Не удалось сохранить размещение."));
    } finally { setBusy(false); }
  }
  const multi = (name: "education" | "employment" | "marital", label: string) => <Form.Item name={name} label={label}>
    <ChoiceField label={label} choices={options(profileFields[name])} />
  </Form.Item>;
  return <section ref={section} className="panel listing-editor" aria-label="Настройка размещения">
    <div className="listing-heading"><h2>{initial ? "Настройки размещения" : "Разместить исследование"}</h2><span>{step + 1} / 3</span></div>
    <div className="listing-steps" aria-label={`Шаг ${step + 1} из 3`}>{stages.map((s, i) => <span key={s} aria-current={step === i ? "step" : undefined}>{s}</span>)}</div>
    <Form form={form} layout="vertical" initialValues={{ surveyId: initial?.config.surveyId ?? selectedSurvey, description: initial?.config.description ?? "", sensitive: initial?.config.sensitive ?? "",
      ageRange: [old.ageMin ?? 18, old.ageMax ?? 100], sex: old.sex?.length === 1 ? old.sex[0] : "any", hasChildren: initialChildren,
      childrenRange: [Math.max(1, old.childrenMin ?? 1), Math.max(1, old.childrenMax ?? 30)], studying: old.studying ?? "any",
      education: old.education ?? [], employment: old.employment ?? [], marital: old.marital ?? [],
      target: initial?.config.quotas.reduce((s: number, q: any) => s + q.target, 0) ?? 100, budget: Math.min(8, available),
    }}>
      <div hidden={step !== 0}>
        <Form.Item name="surveyId" label="Опубликованный опрос" rules={[{ required: true, message: "Выберите опрос" }]}>
          <SelectField size="middle" aria-label="Опубликованный опрос" disabled={!!initial || loading} showSearch={surveys.length > 8} placeholder={loading ? "Загружаем опросы…" : "Выберите свой опрос"}
            options={surveys.map(s => ({ value: s.id, label: s.title, disabled: !s.eligible }))} />
        </Form.Item>
        {selected && <p className="listing-hint">Время из опроса: {initial ? `${minutes} мин` : selected.durationLabel}</p>}
        {!loading && !surveys.length && <p className="listing-hint">Сначала опубликуйте опрос в разделе «Мои опросы».</p>}
        <Form.Item name="description" label="Описание для участников" rules={[{ required: true, min: 20, max: 1500, message: "От 20 до 1500 символов" }]}>
          <TextAreaField autoSize={{ minRows: 3, maxRows: 6 }} maxLength={1500} placeholder="О чём исследование и что предстоит участнику" />
        </Form.Item>
        <details className="listing-extra" open={initial?.config.sensitive ? true : undefined}><summary>Предупреждение о чувствительных темах</summary>
          <Form.Item name="sensitive" label="О чём предупредить" rules={[{ max: 300 }]}><FieldInput maxLength={300} placeholder="Например, вопросы об утрате близких" /></Form.Item>
        </details>
      </div>
      <div hidden={step !== 1}>
        <div className="fields listing-audience-fields">
          <Form.Item name="ageRange" label="Возраст"><RangeField label="Возраст" min={18} max={100} unit="лет" /></Form.Item>
          <Form.Item name="sex" label="Пол"><SelectField size="middle" aria-label="Пол" options={[{ value: "any", label: "Любой" }, ...options(profileFields.sex)]} /></Form.Item>
          <Form.Item name="hasChildren" label="Наличие детей"><SelectField size="middle" aria-label="Наличие детей" options={[{ value: "any", label: "Неважно" }, { value: "yes", label: "Есть дети" }, { value: "no", label: "Нет детей" }]} /></Form.Item>
          {values.hasChildren === "yes" && <Form.Item name="childrenRange" label="Количество детей"><RangeField label="Количество детей" min={1} max={30} unit="" /></Form.Item>}
        </div>
        <details className="listing-extra" open={initial && (old.education?.length || old.employment?.length || old.marital?.length || old.studying) ? true : undefined}>
          <summary>Учёба, работа и семейное положение</summary>
          <div className="fields">{multi("education", "Образование")}
            <Form.Item name="studying" label="Учится сейчас"><SelectField size="middle" aria-label="Учится сейчас" options={[{ value: "any", label: "Неважно" }, ...options(["yes", "no"])]} /></Form.Item>
            {multi("employment", "Занятость")}{multi("marital", "Семейное положение")}
          </div>
        </details>
        <Form.Item name="target" label="Сколько ответов нужно" rules={[{ required: true, validator: (_, v) => Number.isInteger(Number(v)) && Number(v) >= 1 && Number(v) <= 1000 ? Promise.resolve() : Promise.reject(new Error("От 1 до 1000 ответов")) }]}>
          <FieldInput type="number" aria-label="Сколько ответов нужно" min={1} max={1000} disabled={initial?.config.quotas.length > 1} />
        </Form.Item>
        {initial?.config.quotas.length > 1 && <p className="listing-hint">Количество ответов в ранее созданных группах сохранено.</p>}
      </div>
      <div hidden={step !== 2}>
        <div className="listing-final-survey"><span>Вы размещаете</span><h3>{selected?.title ?? initial?.title ?? "—"}</h3></div>
        <dl className="listing-review listing-audience-review">
          <div><dt>Возраст</dt><dd>{values.ageRange?.[0] ?? 18}–{values.ageRange?.[1] ?? 100} лет</dd></div>
          <div><dt>Пол</dt><dd>{values.sex === "any" ? "Любой" : labels[values.sex]}</dd></div>
          <div><dt>Дети</dt><dd>{values.hasChildren === "no" ? "Нет детей" : values.hasChildren === "yes" ? `${values.childrenRange?.[0] ?? 1}–${values.childrenRange?.[1] ?? 30}` : "Неважно"}</dd></div>
          {([['education', 'Образование'], ['employment', 'Занятость'], ['marital', 'Семья']] as const).map(([key, title]) => {
            const chosen = values[key] ?? [];
            if (!chosen.length || chosen.length === profileFields[key].length) return null;
            return <div key={key}><dt>{title}</dt><dd className="listing-review-options">{chosen.map((v: string) => <span key={v}>{labels[v]}</span>)}</dd></div>;
          })}
          {values.studying && values.studying !== "any" && <div><dt>Учится сейчас</dt><dd>{labels[values.studying]}</dd></div>}
        </dl>
        <div className="listing-final-facts"><div><span>Нужно ответов</span><strong>{values.target}</strong></div><div><span>Награда участнику</span><strong>{reward} {reward === 1 ? "балл" : reward < 5 ? "балла" : "баллов"}</strong><small>{initial ? `${minutes} мин` : selected?.durationLabel}</small></div></div>
        {!initial ? <><Form.Item name="budget" label="Бюджет, баллов" extra={`На балансе: ${available}`} rules={[{ required: true, validator: (_, v) => Number.isInteger(Number(v)) && Number(v) >= reward && Number(v) <= available ? Promise.resolve() : Promise.reject(new Error(`От ${reward} до ${available} баллов`)) }]}>
          <FieldInput type="number" aria-label="Бюджет, баллов" min={reward} max={available} />
        </Form.Item><p className="listing-budget-note">Бюджета хватит максимум на <strong>{Math.min(Number(values.target ?? 0), Math.floor(Number(values.budget ?? 0) / reward))} прохождений</strong>. Позже его можно пополнить.</p></>
          : <p className="listing-budget-note">Бюджет и награда сохраняются.</p>}
      </div>
      {error && <p className="listing-error" role="alert">{error}</p>}
      <div className="listing-actions"><Button type="text" disabled={busy} onClick={onCancel}>Отмена</Button><div>
        {step > 0 && <Button disabled={busy} onClick={() => go(step - 1)}>Назад</Button>}
        {step < 2 ? <Button type="primary" onClick={() => void next()}>Продолжить</Button> : <Button type="primary" loading={busy} onClick={() => void save()}>{initial ? "Сохранить настройки" : "Разместить исследование"}</Button>}
      </div></div>
    </Form>
  </section>;
}
function ChoiceField({ value = [], onChange, choices, label }: { value?: string[]; onChange?: (v: string[]) => void; choices: { value: string; label: string }[]; label: string }) {
  return <div className="listing-choice-field" role="group" aria-label={label}>{choices.map(c => <button type="button" key={c.value} aria-pressed={value.includes(c.value)} onClick={() => onChange?.(value.includes(c.value) ? value.filter(v => v !== c.value) : [...value, c.value])}>{c.label}</button>)}</div>;
}
