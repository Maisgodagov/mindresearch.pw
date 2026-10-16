import { useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Select,
  message,
} from "antd";
import { api } from "../../api";
import { getApiErrorMessage } from "../../utils/apiErrors";
import { options, profileFields } from "./model";

const groups = [
  ["birthDate", "sex", "country", "region", "adultConfirmed"],
  ["education", "studying", "employment"],
  ["marital", "children", "childAges"],
];
export function ProfileForm({
  profile,
  onSaved,
  onCancel,
}: {
  profile: any;
  onSaved: () => Promise<void>;
  onCancel?: () => void;
}) {
  const [form] = Form.useForm(),
    [step, setStep] = useState(0),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [hideDate, setHideDate] = useState(profile?.data?.birthDate === null),
    [hideChildren, setHideChildren] = useState(
      profile?.data?.children === null,
    );
  const children = Form.useWatch("children", form) ?? 0;
  const pick = (name: string, label: string, values: string[]) => (
    <Form.Item
      name={name}
      label={label}
      rules={[{ required: true, message: "Выберите ответ" }]}
    >
      <Select options={options(values, true)} />
    </Form.Item>
  );
  async function persist(complete: boolean, silent = false) {
    setBusy(true);
    setError("");
    try {
      if (complete) await form.validateFields();
      const values = form.getFieldsValue(true);
      if (hideDate) values.birthDate = null;
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
      else if (!silent) message.success("Черновик анкеты сохранён. Можно вернуться позже.");
      return true;
    } catch (e) {
      if (!(e as any)?.errorFields)
        setError(
          getApiErrorMessage(
            e,
            "Не удалось сохранить анкету. Попробуйте ещё раз.",
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
        if (!await persist(false, true)) return;
      }
      setStep((s) => s + 1);
    } catch {
      /* Form presents errors at their fields. */
    }
  }
  return (
    <section className="panel questionnaire" aria-label="Анкета участника">
      <h2>{profile?.complete ? "Анкета участника" : "Сначала познакомимся"}</h2>
      <p className="muted">
        Расскажите немного о себе, чтобы мы подобрали подходящие исследования.
        Ответы не публикуются в вашем профиле. Около 3 минут.
      </p>
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
        initialValues={{ childAges: [], ...profile?.data }}
        scrollToFirstError
      >
        <div style={{ display: step === 0 ? "block" : "none" }}>
          <div className="fields">
            <div>
              <Form.Item
                name="birthDate"
                label="Дата рождения"
                rules={
                  hideDate
                    ? []
                    : [{ required: true, message: "Укажите дату рождения" }]
                }
              >
                <Input type="date" disabled={hideDate} />
              </Form.Item>
              <Checkbox
                checked={hideDate}
                onChange={(e) => {
                  setHideDate(e.target.checked);
                  if (e.target.checked) form.setFieldValue("birthDate", null);
                }}
              >
                Не указывать дату рождения
              </Checkbox>
            </div>
            {pick("sex", "Пол", profileFields.sex)}
            <Form.Item
              name="country"
              label="Страна проживания"
              rules={[{ required: true, message: "Укажите страну" }]}
            >
              <Input maxLength={160} />
            </Form.Item>
            <Form.Item
              name="region"
              label="Регион проживания"
              rules={[
                {
                  required: true,
                  message: "Укажите регион или «Не указывать»",
                },
              ]}
            >
              <Input
                maxLength={160}
                placeholder="Например, Московская область"
              />
            </Form.Item>
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
              Мне исполнилось 18 лет. Я согласен использовать анкету для подбора
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
            <div>
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
          </div>
          {!hideChildren && children > 0 && (
            <div className="fields">
              {Array.from({ length: Math.min(30, children) }, (_, i) => (
                <Form.Item
                  name={["childAges", i]}
                  label={`Возраст ребёнка ${i + 1}, полных лет`}
                  key={i}
                  extra="Можно оставить пустым"
                >
                  <InputNumber min={0} max={100} precision={0} />
                </Form.Item>
              ))}
            </div>
          )}
        </div>
        <p className="muted">
          Если вы предпочитаете не указывать сведения, исследования с такими
          требованиями будут доступны после уточнения анкеты. Специфические
          вопросы авторы задают отдельно перед участием.
        </p>
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
              {profile?.complete ? "Сохранить анкету" : "Найти исследования"}
            </Button>
          )}
          {!profile?.complete && (
            <Button disabled={busy} onClick={() => void persist(false)}>
              Сохранить и продолжить позже
            </Button>
          )}
          {onCancel && (
            <Button disabled={busy} onClick={onCancel}>
              Отмена
            </Button>
          )}
        </div>
      </Form>
    </section>
  );
}
