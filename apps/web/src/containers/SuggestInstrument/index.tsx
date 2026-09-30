import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { api } from "../../api";
import { FieldInput } from "../../components/FieldInput";
import { SelectField } from "../../components/SelectField";
import { Button, SkeletonScreen } from "../../ui";
import { PlatformLayout } from "../PlatformLayout";
import { adaptationOptions, initialSuggestionForm } from "./const";
import { Form } from "./styles";
import type { Adaptation, InstrumentSubmission, SuggestionForm } from "./types";

export function SuggestInstrument() {
  const [form, setForm] = useState(initialSuggestionForm);
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState<InstrumentSubmission[]>([]);

  useEffect(() => {
    api
      .get<InstrumentSubmission[]>("/account/instrument-submissions")
      .then(({ data }) => setItems(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = (key: keyof SuggestionForm, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        title: form.title,
        originalAuthor: form.originalAuthor,
        publicationYear: form.publicationYear
          ? Number(form.publicationYear)
          : null,
        hasRussianAdaptation:
          form.adaptation === "" ? null : form.adaptation === "yes",
      };
      const { data } = await api.post<{ id: string }>(
        "/account/instrument-submissions",
        payload,
      );
      setItems((current) => [
        {
          id: data.id,
          title: form.title,
          originalAuthor: form.originalAuthor,
          publicationYear: payload.publicationYear,
          status: "submitted",
          createdAt: new Date().toISOString(),
        },
        ...current,
      ]);
      setSent(true);
    } catch (requestError: unknown) {
      const message = (
        requestError as { response?: { data?: { message?: string } } }
      )?.response?.data?.message;
      setError(message ?? "Не удалось отправить запрос.");
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <PlatformLayout>
        <SkeletonScreen variant="form" />
      </PlatformLayout>
    );

  return (
    <PlatformLayout>
      <Form>
        <h1>Запросить методику</h1>
        <p className="intro">
          Если нужной методики пока нет на платформе, отправьте короткую заявку
          администраторам. Мы самостоятельно найдём первоисточники, проверим
          правила использования и расчёта, а затем вручную добавим
          подтверждённую версию.
        </p>
        <div className="note">
          Заявка не создаёт методику автоматически и не гарантирует её
          добавление. Она помогает нам понять, какие методики нужны
          пользователям в первую очередь.
        </div>
        {sent ? (
          <div className="success">
            <CheckCircle2 /> Запрос отправлен администраторам.
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="grid">
              <div className="wide">
                <label>
                  Название методики <span className="required">*</span>
                </label>
                <FieldInput
                  value={form.title}
                  onChange={(event) => set("title", event.target.value)}
                  required
                  minLength={2}
                />
              </div>
              <div className="wide">
                <label>
                  Автор или авторы оригинала <span className="required">*</span>
                </label>
                <FieldInput
                  value={form.originalAuthor}
                  onChange={(event) =>
                    set("originalAuthor", event.target.value)
                  }
                  required
                  minLength={2}
                />
              </div>
              <div>
                <label>Год публикации</label>
                <FieldInput
                  type="number"
                  min="1800"
                  max={new Date().getFullYear() + 1}
                  value={form.publicationYear}
                  onChange={(event) =>
                    set("publicationYear", event.target.value)
                  }
                  placeholder="Например, 1988"
                />
              </div>
              <div>
                <label>Есть русскоязычная адаптация?</label>
                <SelectField
                  value={form.adaptation || undefined}
                  showSearch={false}
                  placeholder="Не знаю"
                  options={adaptationOptions}
                  style={{ width: "100%" }}
                  className="adaptation-select"
                  onChange={(value) =>
                    set("adaptation", String(value ?? "") as Adaptation)
                  }
                />
                <select
                  className="adaptation-native-select"
                  value={form.adaptation}
                  onChange={(event) =>
                    set("adaptation", event.target.value as Adaptation)
                  }
                  aria-label="Есть русскоязычная адаптация?"
                >
                  {adaptationOptions.map((option) => (
                    <option
                      value={option.value}
                      key={option.value || "unknown"}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {error && <p className="error">{error}</p>}
            <Button disabled={saving}>
              {saving ? "Отправляем…" : "Отправить запрос"} <Send size={16} />
            </Button>
          </form>
        )}
        {items.length > 0 && (
          <div className="history">
            <h2>Мои запросы</h2>
            {items.map((item) => (
              <p key={item.id}>
                <b>{item.title}</b>
                {item.publicationYear
                  ? ` (${item.publicationYear})`
                  : ""} · {statusLabel(item.status)}
              </p>
            ))}
          </div>
        )}
      </Form>
    </PlatformLayout>
  );
}

function statusLabel(status: string) {
  switch (status) {
    case "submitted":
      return "ожидает рассмотрения";
    case "reviewing":
      return "рассматривается";
    case "approved":
      return "принят в работу";
    default:
      return "отклонён";
  }
}
