import { useEffect, useState } from "react";
import { Button, Form, Input, InputNumber, Select } from "antd";
import { api } from "../../api";
import { getApiErrorMessage } from "../../utils/apiErrors";
import { criteriaText, options, profileFields, rewardFor } from "./model";

export function ListingForm({
  available,
  initial,
  selectedSurvey,
  onSaved,
  onCancel,
}: {
  available: number;
  initial?: any;
  selectedSurvey?: string;
  onSaved: () => Promise<void>;
  onCancel: () => void;
}) {
  const [form] = Form.useForm(),
    [surveys, setSurveys] = useState<any[]>([]),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const values = Form.useWatch([], form) ?? {},
    minutes = values.minutes ?? 10,
    criteria = values.criteria ?? {};
  useEffect(() => {
    api
      .get("/admin/surveys")
      .then((r) => setSurveys(r.data.filter((s: any) => s.status === "active")))
      .catch((e) =>
        setError(getApiErrorMessage(e, "Не удалось загрузить опросы.")),
      );
  }, []);
  async function save() {
    try {
      const config = await form.validateFields();
      setBusy(true);
      setError("");
      config.screening = (config.screening ?? []).map((q: any) => ({
        ...q,
        options: q.optionsText
          .split("\n")
          .map((s: string) => s.trim())
          .filter(Boolean),
      }));
      config.quotas = config.quotas.map((q: any) => ({
        ...q,
        sex: q.sex || undefined,
      }));
      for (const key of ["ageMin", "ageMax", "childrenMin", "childrenMax"])
        if (config.criteria[key] === null) delete config.criteria[key];
      delete config.criteria.country;
      delete config.criteria.region;
      for (const key of ["studying"])
        if (!config.criteria[key]) delete config.criteria[key];
      if (initial)
        await api.patch(`/community/listings/${initial.id}`, {
          config: { ...config, budget: initial.config.budget },
        });
      else await api.post("/community/listings", config);
      await onSaved();
    } catch (e) {
      if (!(e as any)?.errorFields)
        setError(getApiErrorMessage(e, "Не удалось сохранить размещение."));
    } finally {
      setBusy(false);
    }
  }
  const multiple = (key: string, label: string) => (
    <Form.Item name={["criteria", key]} label={label}>
      <Select
        mode="multiple"
        placeholder="Без ограничений"
        options={options((profileFields as any)[key])}
      />
    </Form.Item>
  );
  return (
    <section className="panel" aria-label="Настройка размещения">
      <h2>{initial ? "Настройки размещения" : "Разместить исследование"}</h2>
      <p className="muted">
        Опишите выборку и задайте бюджет. Баллы списываются в бюджет
        продвижения; за каждое зачтённое прохождение участник получает награду.
      </p>
      <Form
        form={form}
        layout="vertical"
        initialValues={
          initial
            ? {
                ...initial.config,
                screening: initial.config.screening.map((q: any) => ({
                  ...q,
                  optionsText: q.options.join("\n"),
                })),
              }
            : {
                surveyId: selectedSurvey,
                minutes: 10,
                budget: Math.min(8, available),
                criteria: {
                  sex: [],
                  education: [],
                  employment: [],
                  marital: [],
                },
                screening: [],
                quotas: [
                  {
                    id: "all",
                    label: "Все подходящие участники",
                    ageMin: 18,
                    ageMax: 100,
                    target: 100,
                  },
                ],
              }
        }
        scrollToFirstError
      >
        <Form.Item
          name="surveyId"
          label="Опубликованный опрос"
          rules={[{ required: true, message: "Выберите активный опрос" }]}
        >
          <Select
            disabled={!!initial}
            placeholder="Выберите свой опрос"
            options={surveys.map((s) => ({ value: s.id, label: s.title }))}
          />
        </Form.Item>
        {!surveys.length && (
          <p className="muted">
            Для размещения нужен опубликованный активный опрос. Его можно
            создать в разделе «Мои опросы».
          </p>
        )}
        <Form.Item
          name="description"
          label="Описание для участников"
          rules={[
            {
              required: true,
              min: 20,
              max: 1500,
              message: "От 20 до 1500 символов",
            },
          ]}
        >
          <Input.TextArea rows={3} maxLength={1500} showCount />
        </Form.Item>
        <div className="fields">
          <Form.Item
            name="topic"
            label="Тема исследования"
            rules={[{ required: true, min: 2, max: 80 }]}
          >
            <Input maxLength={80} placeholder="Например, семья и отношения" />
          </Form.Item>
          <Form.Item
            name="minutes"
            label="Ориентировочное время, минут"
            rules={[{ required: true }]}
            extra={`Награда за зачтённое участие: ${rewardFor(minutes)} балл(а)`}
          >
            <InputNumber min={1} max={60} precision={0} disabled={!!initial} />
          </Form.Item>
        </div>
        <Form.Item
          name="sensitive"
          label="Предупреждение о чувствительных темах"
          extra="Если есть: что участнику стоит знать до начала"
        >
          <Input
            maxLength={300}
            placeholder="Например, вопросы об утрате близких"
          />
        </Form.Item>
        <h3>Кто может участвовать</h3>
        <p className="muted">
          Все указанные условия должны выполняться одновременно. Несколько
          вариантов внутри одного поля означают «любой из них».
        </p>
        <div className="fields">
          <Form.Item
            name={["criteria", "ageMin"]}
            label="Возраст от, включительно"
          >
            <InputNumber min={18} max={100} precision={0} placeholder="18" />
          </Form.Item>
          <Form.Item
            name={["criteria", "ageMax"]}
            label="Возраст до, включительно"
          >
            <InputNumber min={18} max={100} precision={0} placeholder="100" />
          </Form.Item>
          {multiple("sex", "Пол")}
          <Form.Item name={["criteria", "studying"]} label="Учится сейчас">
            <Select
              allowClear
              placeholder="Без ограничений"
              options={options(["yes", "no"])}
            />
          </Form.Item>
          <Form.Item
            name={["criteria", "childrenMin"]}
            label="Количество детей от"
          >
            <InputNumber min={0} max={30} precision={0} />
          </Form.Item>
          <Form.Item
            name={["criteria", "childrenMax"]}
            label="Количество детей до"
          >
            <InputNumber min={0} max={30} precision={0} />
          </Form.Item>
          {multiple("education", "Образование")}
          {multiple("employment", "Занятость")}
          {multiple("marital", "Семейное положение")}
        </div>
        <div className="preview">
          <strong>Условия на карточке</strong>
          <p>{criteriaText(criteria)}</p>
        </div>
        <h3>Сколько участников нужно</h3>
        <p className="muted">
          Оставьте одну общую группу или добавьте отдельные квоты по полу и
          возрасту. Группы не должны пересекаться.
        </p>
        <Form.List name="quotas">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <div className="group" key={key}>
                  <div className="fields">
                    <Form.Item name={[name, "id"]} hidden>
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name={[name, "label"]}
                      label={`Название группы ${name + 1}`}
                      rules={[{ required: true, max: 160 }]}
                    >
                      <Input maxLength={160} />
                    </Form.Item>
                    <Form.Item
                      name={[name, "target"]}
                      label="Нужно участников"
                      rules={[{ required: true }]}
                    >
                      <InputNumber min={1} max={1000} precision={0} />
                    </Form.Item>
                    <Form.Item name={[name, "sex"]} label="Пол группы">
                      <Select
                        allowClear
                        placeholder="Любой"
                        options={options(profileFields.sex)}
                      />
                    </Form.Item>
                    <Form.Item
                      name={[name, "ageMin"]}
                      label="Возраст группы от"
                      rules={[{ required: true }]}
                    >
                      <InputNumber min={18} max={100} precision={0} />
                    </Form.Item>
                    <Form.Item
                      name={[name, "ageMax"]}
                      label="Возраст группы до"
                      rules={[{ required: true }]}
                    >
                      <InputNumber min={18} max={100} precision={0} />
                    </Form.Item>
                  </div>
                  {fields.length > 1 && (
                    <Button onClick={() => remove(name)}>
                      Удалить группу {name + 1}
                    </Button>
                  )}
                </div>
              ))}
              <div className="actions">
                <Button
                  disabled={fields.length >= 12}
                  onClick={() =>
                    add({
                      id: crypto.randomUUID(),
                      label: "",
                      ageMin: 18,
                      ageMax: 100,
                      target: 25,
                    })
                  }
                >
                  Добавить группу
                </Button>
              </div>
            </>
          )}
        </Form.List>
        <h3 style={{ marginTop: 32 }}>Отборочные вопросы</h3>
        <p className="muted">
          До пяти коротких вопросов для специфических требований. Отбор проходит
          до основного опроса, без начисления баллов. Подходящие ответы
          участнику не показываются.
        </p>
        <Form.List name="screening">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name }) => (
                <div className="group" key={key}>
                  <Form.Item name={[name, "id"]} hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={[name, "question"]}
                    label={`Отборочный вопрос ${name + 1}`}
                    rules={[{ required: true, min: 3, max: 300 }]}
                  >
                    <Input maxLength={300} />
                  </Form.Item>
                  <Form.Item
                    name={[name, "optionsText"]}
                    label="Варианты ответа — каждый с новой строки"
                    rules={[
                      {
                        required: true,
                        validator: (_, v) => {
                          const a = String(v ?? "")
                            .split("\n")
                            .map((s) => s.trim())
                            .filter(Boolean);
                          return a.length >= 2 &&
                            a.length <= 8 &&
                            new Set(a).size === a.length
                            ? Promise.resolve()
                            : Promise.reject(
                                new Error("От 2 до 8 разных вариантов"),
                              );
                        },
                      },
                    ]}
                  >
                    <Input.TextArea rows={3} onChange={() => form.setFieldValue(['screening', name, 'accepted'], [])} />
                  </Form.Item>
                  <Form.Item noStyle shouldUpdate>
                    {() => {
                      const choices = String(
                        form.getFieldValue([
                          "screening",
                          name,
                          "optionsText",
                        ]) ?? "",
                      )
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean);
                      return (
                        <Form.Item
                          name={[name, "accepted"]}
                          label="Какие ответы подходят"
                          extra="После изменения вариантов выберите подходящие ответы заново."
                          rules={[{ required: true, type: "array", min: 1 }]}
                        >
                          <Select
                            mode="multiple"
                            options={choices.map((label, value) => ({
                              label,
                              value,
                            }))}
                          />
                        </Form.Item>
                      );
                    }}
                  </Form.Item>
                  <Button onClick={() => remove(name)}>
                    Удалить вопрос {name + 1}
                  </Button>
                </div>
              ))}
              <div className="actions">
                <Button
                  disabled={fields.length >= 5}
                  onClick={() =>
                    add({
                      id: crypto.randomUUID(),
                      question: "",
                      optionsText: "Да\nНет",
                      accepted: [],
                    })
                  }
                >
                  Добавить отборочный вопрос
                </Button>
              </div>
            </>
          )}
        </Form.List>
        {!initial && (
          <>
            <h3 style={{ marginTop: 32 }}>Бюджет продвижения</h3>
            <Form.Item
              name="budget"
              label={`Доступно с учётом стартового бюджета: ${available} балл(а)`}
              rules={[{ required: true }]}
            >
              <InputNumber
                min={rewardFor(minutes)}
                max={Math.max(rewardFor(minutes), available)}
                precision={0}
              />
            </Form.Item>
            <p className="muted">
              За этот бюджет можно получить до{" "}
              {Math.floor((values.budget ?? 0) / rewardFor(minutes))} зачтённых
              прохождений. Это лимит, а не гарантия набора.
            </p>
          </>
        )}
        <p className="notice">
          Условия фиксируются для каждого начатого участия. Фильтры и квоты
          помогают собрать нужные группы, но не гарантируют репрезентативность
          выборки.
        </p>
        {error && <p role="alert">{error}</p>}
        <div className="actions">
          <Button type="primary" loading={busy} onClick={() => void save()}>
            {initial ? "Сохранить настройки" : "Разместить исследование"}
          </Button>
          <Button disabled={busy} onClick={onCancel}>
            Отмена
          </Button>
        </div>
      </Form>
    </section>
  );
}
