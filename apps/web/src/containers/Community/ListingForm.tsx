import { useEffect, useRef, useState } from "react";
import { Button, Form, Input, InputNumber, Select } from "antd";
import { api } from "../../api";
import { getApiErrorMessage } from "../../utils/apiErrors";
import { criteriaText, options, profileFields, rewardFor } from "./model";

const stages = ["Об опросе", "Участники", "Бюджет"];
export function ListingForm({ available, initial, selectedSurvey, onSaved, onCancel }: {
  available: number; initial?: any; selectedSurvey?: string;
  onSaved: () => Promise<void>; onCancel: () => void;
}) {
  const [form] = Form.useForm();
  const section = useRef<HTMLElement>(null);
  const [surveys, setSurveys] = useState<any[]>([]);
  const [surveyLoading, setSurveyLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const values = Form.useWatch([], form) ?? {};
  const minutes = values.minutes ?? 10;
  const criteria = values.criteria ?? {};
  const reward = rewardFor(minutes);
  const target = (values.quotas ?? []).reduce((sum: number, q: any) => sum + (q.target ?? 0), 0);
  const capacity = Math.floor((values.budget ?? 0) / reward);
  useEffect(() => {
    let alive = true;
    api.get("/admin/surveys")
      .then(r => { if (alive) setSurveys(r.data.filter((s: any) => s.status === "active")); })
      .catch(e => { if (alive) setError(getApiErrorMessage(e, "Не удалось загрузить опросы.")); })
      .finally(() => { if (alive) setSurveyLoading(false); });
    return () => { alive = false; };
  }, []);
  function go(nextStep: number) {
    setStep(nextStep);
    setError("");
    section.current?.scrollIntoView({ block: "start" });
  }
  function checkAudience() {
    const c = form.getFieldValue("criteria") ?? {};
    const quotas = form.getFieldValue("quotas") ?? [];
    if ((c.ageMin ?? 18) > (c.ageMax ?? 100)) throw new Error("Возраст «от» не может быть больше возраста «до».");
    if ((c.childrenMin ?? 0) > (c.childrenMax ?? 30)) throw new Error("Проверьте диапазон количества детей.");
    for (let i = 0; i < quotas.length; i++) {
      const a = quotas[i];
      if (a.ageMin > a.ageMax) throw new Error(`Проверьте возраст в группе ${i + 1}.`);
      for (const b of quotas.slice(i + 1)) {
        if ((!a.sex || !b.sex || a.sex === b.sex) && Math.max(a.ageMin, b.ageMin) <= Math.min(a.ageMax, b.ageMax))
          throw new Error("Группы пересекаются. Разделите их по полу или возрасту.");
      }
    }
  }
  function showValidation(e: any) {
    const field = e?.errorFields?.[0]?.name?.[0];
    if (field) {
      setStep(["criteria", "quotas", "screening"].includes(field) ? 1 : field === "budget" ? 2 : 0);
      if (["criteria", "quotas", "screening", "sensitive"].includes(field)) setExpanded(true);
    } else setError(getApiErrorMessage(e, e instanceof Error ? e.message : "Не удалось сохранить размещение."));
  }
  async function next() {
    setError("");
    try {
      await form.validateFields(step === 0
        ? ["surveyId", "description", "topic", "minutes", "sensitive"]
        : [["criteria"], ["quotas"], ["screening"]], { recursive: true });
      if (step === 1) checkAudience();
      go(step + 1);
    } catch (e) { if (step === 1) setExpanded(true); showValidation(e); }
  }
  async function save() {
    setError("");
    try {
      await form.validateFields();
      try { checkAudience(); } catch (e) { setStep(1); setExpanded(true); throw e; }
      const config = structuredClone(form.getFieldsValue(true));
      config.screening = (config.screening ?? []).map((q: any) => ({
        ...q, options: q.optionsText.split("\n").map((s: string) => s.trim()).filter(Boolean),
      }));
      config.quotas = config.quotas.map((q: any) => ({ ...q, sex: q.sex || undefined }));
      for (const key of ["ageMin", "ageMax", "childrenMin", "childrenMax"])
        if (config.criteria[key] === null) delete config.criteria[key];
      delete config.criteria.country;
      delete config.criteria.region;
      if (!config.criteria.studying) delete config.criteria.studying;
      setBusy(true);
      if (initial) await api.patch(`/community/listings/${initial.id}`, { config: { ...config, budget: initial.config.budget } });
      else await api.post("/community/listings", config);
      await onSaved();
    } catch (e) { showValidation(e); }
    finally { setBusy(false); }
  }
  const multiple = (key: string, label: string) => <Form.Item name={["criteria", key]} label={label}>
    <Select mode="multiple" placeholder="Без ограничений" options={options((profileFields as any)[key])} />
  </Form.Item>;
  const moreCriteria = initial && ["studying", "childrenMin", "childrenMax", "education", "employment", "marital"]
    .some(key => Array.isArray(initial.config.criteria[key]) ? initial.config.criteria[key].length : initial.config.criteria[key] != null);
  return <section ref={section} className="panel listing-editor" aria-label="Настройка размещения">
    <div className="listing-heading">
      <h2>{initial ? "Настройки размещения" : "Разместить исследование"}</h2>
      <span>{step + 1} / 3</span>
    </div>
    <div className="listing-steps" aria-label={`Шаг ${step + 1} из 3`}>
      {stages.map((title, i) => <span key={title} aria-current={i === step ? "step" : undefined}>{title}</span>)}
    </div>
    <Form form={form} layout="vertical" initialValues={initial ? {
      ...initial.config, screening: initial.config.screening.map((q: any) => ({ ...q, optionsText: q.options.join("\n") })),
    } : {
      surveyId: selectedSurvey, minutes: 10, budget: Math.min(8, available),
      criteria: { sex: [], education: [], employment: [], marital: [] }, screening: [],
      quotas: [{ id: "all", label: "Все подходящие участники", ageMin: 18, ageMax: 100, target: 100 }],
    }}>
      <div hidden={step !== 0}>
        <Form.Item name="surveyId" label="Опубликованный опрос" rules={[{ required: true, message: "Выберите активный опрос" }]}>
          <Select disabled={!!initial} loading={surveyLoading} placeholder="Выберите свой опрос"
            options={surveys.map(s => ({ value: s.id, label: s.title }))} />
        </Form.Item>
        {!surveyLoading && !surveys.length && <p className="listing-hint">Сначала опубликуйте опрос в разделе «Мои опросы».</p>}
        <Form.Item name="description" label="Описание для участников" rules={[{ required: true, min: 20, max: 1500, message: "От 20 до 1500 символов" }]}>
          <Input.TextArea rows={3} maxLength={1500} placeholder="О чём исследование и что предстоит участнику" />
        </Form.Item>
        <div className="fields">
          <Form.Item name="topic" label="Тема" rules={[{ required: true, min: 2, max: 80, message: "Укажите тему: от 2 до 80 символов" }]}>
            <Input maxLength={80} placeholder="Например, отношения" />
          </Form.Item>
          <Form.Item name="minutes" label="Время, минут" rules={[{ required: true, type: "number", min: 1, max: 60, message: "От 1 до 60 минут" }]}>
            <InputNumber min={1} max={60} precision={0} disabled={!!initial} />
          </Form.Item>
        </div>
        <details className="listing-extra" open={expanded || Boolean(initial?.config.sensitive)}>
          <summary>Предупреждение о чувствительных темах</summary>
          <Form.Item name="sensitive" label="О чём предупредить участника" rules={[{ max: 300, message: "Не более 300 символов" }]}>
            <Input maxLength={300} placeholder="Например, вопросы об утрате близких" />
          </Form.Item>
        </details>
      </div>
      <div hidden={step !== 1}>
        <p className="listing-hint">Выберите нужные ограничения. Пустые фильтры не сужают выборку.</p>
        <div className="fields listing-basic-criteria">
          <Form.Item name={["criteria", "ageMin"]} label="Возраст от"><InputNumber min={18} max={100} precision={0} placeholder="18" /></Form.Item>
          <Form.Item name={["criteria", "ageMax"]} label="Возраст до"><InputNumber min={18} max={100} precision={0} placeholder="100" /></Form.Item>
          <div className="wide">{multiple("sex", "Пол")}</div>
        </div>
        <details className="listing-extra" open={expanded || Boolean(moreCriteria)}>
          <summary>Учёба, работа и семья</summary>
          <div className="fields">
            {multiple("education", "Образование")}
            <Form.Item name={["criteria", "studying"]} label="Учится сейчас"><Select allowClear placeholder="Без ограничений" options={options(["yes", "no"])} /></Form.Item>
            {multiple("employment", "Занятость")}
            {multiple("marital", "Семейное положение")}
            <Form.Item name={["criteria", "childrenMin"]} label="Детей от"><InputNumber min={0} max={30} precision={0} /></Form.Item>
            <Form.Item name={["criteria", "childrenMax"]} label="Детей до"><InputNumber min={0} max={30} precision={0} /></Form.Item>
          </div>
          <p className="listing-hint">Все условия действуют одновременно. Внутри поля подходит любой из выбранных вариантов.</p>
        </details>
        <Form.List name="quotas">{(fields, { add, remove }) => <div className="listing-quotas">
          {fields.map(({ key, name }) => <div className="listing-quota" key={key}>
            <Form.Item name={[name, "id"]} hidden><Input /></Form.Item>
            <Form.Item name={[name, "target"]} label={fields.length === 1 ? "Сколько ответов нужно" : `Ответов в группе ${name + 1}`}
              rules={[{ required: true, type: "number", min: 1, max: 1000, message: "От 1 до 1000 ответов" }]}>
              <InputNumber min={1} max={1000} precision={0} />
            </Form.Item>
            <details className="listing-extra" open={expanded || fields.length > 1 || Boolean(initial)}>
              <summary>{fields.length === 1 ? "Настроить квоты по полу и возрасту" : `Условия группы ${name + 1}`}</summary>
              <div className="fields">
                <Form.Item name={[name, "label"]} label={`Название группы ${name + 1}`} rules={[{ required: true, max: 160, message: "Укажите название группы" }]}><Input maxLength={160} /></Form.Item>
                <Form.Item name={[name, "sex"]} label={`Пол группы ${name + 1}`}><Select allowClear placeholder="Любой" options={options(profileFields.sex)} /></Form.Item>
                <Form.Item name={[name, "ageMin"]} label={`Возраст группы ${name + 1} от`} rules={[{ required: true }]}><InputNumber min={18} max={100} precision={0} /></Form.Item>
                <Form.Item name={[name, "ageMax"]} label={`Возраст группы ${name + 1} до`} rules={[{ required: true }]}><InputNumber min={18} max={100} precision={0} /></Form.Item>
              </div>
              {fields.length > 1 && <Button type="text" danger onClick={() => remove(name)}>Удалить группу {name + 1}</Button>}
            </details>
          </div>)}
          <Button type="link" className="listing-add" disabled={fields.length >= 12}
            onClick={() => add({ id: crypto.randomUUID(), label: "", ageMin: 18, ageMax: 100, target: 25 })}>Добавить группу участников</Button>
        </div>}</Form.List>
        <details className="listing-extra" open={expanded || Boolean(initial?.config.screening.length)}>
          <summary>Отборочные вопросы{values.screening?.length ? ` · ${values.screening.length}` : ""}</summary>
          <p className="listing-hint">До 5 вопросов перед опросом. Участник не видит, какие ответы дают доступ; баллы за отбор не начисляются.</p>
          <Form.List name="screening">{(fields, { add, remove }) => <>
            {fields.map(({ key, name }) => <div className="listing-screening" key={key}>
              <Form.Item name={[name, "id"]} hidden><Input /></Form.Item>
              <Form.Item name={[name, "question"]} label={`Вопрос ${name + 1}`} rules={[{ required: true, min: 3, max: 300, message: "От 3 до 300 символов" }]}><Input maxLength={300} /></Form.Item>
              <Form.Item name={[name, "optionsText"]} label="Варианты — каждый с новой строки" rules={[{ required: true, validator: (_, v) => {
                const a = String(v ?? "").split("\n").map(s => s.trim()).filter(Boolean);
                return a.length >= 2 && a.length <= 8 && new Set(a).size === a.length ? Promise.resolve() : Promise.reject(new Error("От 2 до 8 разных вариантов"));
              } }]}>
                <Input.TextArea rows={2} onChange={() => form.setFieldValue(["screening", name, "accepted"], [])} />
              </Form.Item>
              <Form.Item noStyle shouldUpdate>{() => {
                const choices = String(form.getFieldValue(["screening", name, "optionsText"]) ?? "").split("\n").map(s => s.trim()).filter(Boolean);
                return <Form.Item name={[name, "accepted"]} label="Какие ответы подходят" rules={[{ required: true, type: "array", min: 1, message: "Выберите хотя бы один ответ" }]}>
                  <Select mode="multiple" options={choices.map((label, value) => ({ label, value }))} />
                </Form.Item>;
              }}</Form.Item>
              <Button type="text" danger onClick={() => remove(name)}>Удалить вопрос {name + 1}</Button>
            </div>)}
            <Button type="link" className="listing-add" disabled={fields.length >= 5}
              onClick={() => add({ id: crypto.randomUUID(), question: "", optionsText: "Да\nНет", accepted: [] })}>Добавить вопрос</Button>
          </>}</Form.List>
        </details>
      </div>
      <div hidden={step !== 2}>
        <dl className="listing-review">
          <div><dt>Опрос</dt><dd>{surveys.find(s => s.id === values.surveyId)?.title ?? initial?.title ?? "—"}</dd></div>
          <div><dt>Участники</dt><dd>{criteriaText(criteria)}</dd></div>
          <div><dt>Цель</dt><dd>{target} ответов{(values.quotas?.length ?? 0) > 1 ? ` · ${values.quotas.length} группы` : ""}</dd></div>
          <div><dt>За участие</dt><dd>{reward} {reward === 1 ? "балл" : reward < 5 ? "балла" : "баллов"} · {minutes} мин</dd></div>
        </dl>
        {!initial ? <>
          <Form.Item name="budget" label="Бюджет, баллов" extra={`На балансе: ${available}`} rules={[
            { required: true, type: "number", min: reward, max: available, message: available < reward ? "Недостаточно баллов для одного участия" : `От ${reward} до ${available} баллов` },
          ]}><InputNumber min={reward} max={Math.max(reward, available)} precision={0} /></Form.Item>
          <p className="listing-budget-note">Бюджета хватит максимум на <strong>{Math.min(target, capacity)} прохождений</strong>. Это лимит, а не гарантия набора. Позже бюджет можно пополнить.</p>
        </> : <p className="listing-budget-note">Бюджет и длительность сохраняются. Пополнить бюджет можно после сохранения настроек.</p>}
      </div>
      {error && <p className="listing-error" role="alert">{error}</p>}
      <div className="listing-actions">
        <Button type="text" disabled={busy} onClick={onCancel}>Отмена</Button>
        <div>
          {step > 0 && <Button disabled={busy} onClick={() => go(step - 1)}>Назад</Button>}
          {step < 2 ? <Button type="primary" onClick={() => void next()}>Продолжить</Button>
            : <Button type="primary" loading={busy} onClick={() => void save()}>{initial ? "Сохранить настройки" : "Разместить исследование"}</Button>}
        </div>
      </div>
    </Form>
  </section>;
}
