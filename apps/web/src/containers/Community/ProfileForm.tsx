import { useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  InputNumber,
  Select,
  message,
} from "antd";
import { api } from "../../api";
import { getApiErrorMessage } from "../../utils/apiErrors";
import { options, profileFields } from "./model";
import { ageForProfile } from "../../../../api/src/community/age";

const groups = [
  ["age", "sex", "adultConfirmed"],
  ["education", "studying", "employment"],
  ["marital", "children", "childAges"],
];
export function ProfileForm({
  profile,
  onSaved,
  onCancel,
  embedded = false,
}: {
  profile: any;
  onSaved: () => Promise<void>;
  onCancel?: () => void;
  embedded?: boolean;
}) {
  const [form] = Form.useForm(),
    [step, setStep] = useState(0),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [hideChildren, setHideChildren] = useState(
    profile?.data?.children === null,
  );
  const children = Form.useWatch("children", form) ?? 0;
  const pick = (name: string, label: string, values: string[]) => (
    <Form.Item
      name={name}
      label={label}
      rules={[{ required: true, message: "Выберите ответ" }]}
    >
      <Select
        placeholder="Выберите ответ"
        options={
          name === "sex"
            ? [
                { value: "female", label: "Женский" },
                { value: "male", label: "Мужской" },
              ]
            : options(values)
        }
      />
    </Form.Item>
  );
  async function persist(complete: boolean, silent = false) {
    setBusy(true);
    setError("");
    try {
      if (complete) await form.validateFields();
      const {
        birthDate: _legacyDate,
        ageRecordedAt: _recordedAt,
        country: _country,
        region: _region,
        ...values
      } = form.getFieldsValue(true);
      if (hideChildren) {
        values.children = null;
        values.childAges = [];
      } else
        values.childAges = Array.from(
          { length: values.children ?? 0 },
          (_, i) => values.childAges?.[i] ?? null,
        );
      await api.put("/community/profile", { data: values, complete });
      if (complete) await onSaved();
      else if (!silent)
        message.success("Черновик карточки сохранён. Можно вернуться позже.");
      return true;
    } catch (e) {
      if (!(e as any)?.errorFields)
        setError(
          getApiErrorMessage(
            e,
            "Не удалось сохранить карточку. Попробуйте ещё раз.",
          ),
        );
      return false;
    } finally {
      setBusy(false);
    }
  }
  async function next() {
    try {
      await form.validateFields(groups[step]);
      if (!profile?.complete) {
        if (!(await persist(false, true))) return;
      }
      setStep((s) => s + 1);
    } catch {
      /* Form presents errors at their fields. */
    }
  }
  return (
    <section className="panel questionnaire" aria-label="Анкета участника">
      {!embedded && <div className="questionnaire-heading">
        <h2>Карточка участника</h2>
        <span className="questionnaire-progress">{step + 1} / 3</span>
      </div>}
      <p className="questionnaire-caption">Анонимные сведения для подбора опросов</p>
      <div className="step-line" aria-label={`Шаг ${step + 1} из 3`}>
        {["Основное", "Учёба и работа", "Семья"].map((s, i) => (
          <span
            key={s}
            className={i === step ? "current" : undefined}
            aria-current={i === step ? "step" : undefined}
          >
            {i + 1}. {s}
          </span>
        ))}
      </div>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          childAges: [],
          ...profile?.data,
          age: ageForProfile(profile?.data ?? {}) ?? undefined,
          ...Object.fromEntries(
            ["sex", "education", "employment", "studying", "marital"]
              .filter((key) =>
                ["private", "other"].includes(profile?.data?.[key]),
              )
              .map((key) => [key, undefined]),
          ),
        }}
        scrollToFirstError
      >
        <div style={{ display: step === 0 ? "block" : "none" }}>
          <div className="fields">
            <Form.Item
              name="age"
              label="Возраст, полных лет"
              rules={[
                { required: true, message: "Укажите ваш возраст" },
                {
                  type: "number",
                  min: 18,
                  max: 100,
                  message: "Укажите возраст от 18 до 100 лет",
                },
              ]}
            >
              <InputNumber
                min={18}
                max={100}
                precision={0}
                placeholder="Например, 27"
              />
            </Form.Item>
            {pick("sex", "Пол", profileFields.sex)}
          </div>
          <Form.Item
            name="adultConfirmed"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error(
                          "Для участия необходимо быть совершеннолетним.",
                        ),
                      ),
              },
            ]}
          >
            <Checkbox>
              Мне исполнилось 18 лет. Я согласен использовать карточку для подбора
              исследований.
            </Checkbox>
          </Form.Item>
        </div>
        <div
          style={{ display: step === 1 ? "block" : "none" }}
          className="fields"
        >
          {pick("education", "Образование", profileFields.education)}
          {pick("studying", "Учитесь сейчас?", ["yes", "no"])}
          {pick("employment", "Занятость", profileFields.employment)}
        </div>
        <div style={{ display: step === 2 ? "block" : "none" }}>
          <div className="fields">
            {pick("marital", "Семейное положение", profileFields.marital)}
              <Form.Item
                name="children"
                label="Количество детей"
                rules={
                  hideChildren
                    ? []
                    : [{ required: true, message: "Укажите количество детей" }]
                }
              >
                <InputNumber
                  min={0}
                  max={30}
                  precision={0}
                  disabled={hideChildren}
                />
              </Form.Item>
          </div>
          <div className="children-privacy">
              <Checkbox
                checked={hideChildren}
                onChange={(e) => {
                  setHideChildren(e.target.checked);
                  if (e.target.checked)
                    form.setFieldsValue({ children: null, childAges: [] });
                }}
              >
                Не указывать сведения о детях
              </Checkbox>
          </div>
          {!hideChildren && children > 0 && (
            <div className="fields">
              {Array.from({ length: Math.min(30, children) }, (_, i) => (
                <Form.Item
                  name={["childAges", i]}
                  label={`Возраст ребёнка ${i + 1}, полных лет`}
                  key={i}
                  rules={[
                    { required: true, message: "Укажите возраст ребёнка" },
                  ]}
                >
                  <InputNumber min={0} max={100} precision={0} />
                </Form.Item>
              ))}
            </div>
          )}
        </div>
        {error && <p role="alert">{error}</p>}
        <div className="actions">
          {step > 0 && (
            <Button disabled={busy} onClick={() => setStep((s) => s - 1)}>
              Назад
            </Button>
          )}
          {step < 2 ? (
            <Button type="primary" disabled={busy} onClick={() => void next()}>
              Продолжить
            </Button>
          ) : (
            <Button
              type="primary"
              loading={busy}
              onClick={() => void persist(true)}
            >
              {profile?.complete
                ? "Сохранить карточку"
                : "Показать подходящие исследования"}
            </Button>
          )}
          {onCancel && profile?.complete && (
            <Button
              type="text"
              disabled={busy}
              onClick={() => {
                onCancel();
              }}
            >
              Отмена
            </Button>
          )}
        </div>
      </Form>
    </section>
  );
}
