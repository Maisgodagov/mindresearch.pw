import { useEffect, useState } from "react";
import styled from "styled-components";
import Select from "react-select";
import { CheckCircle2, Send } from "lucide-react";
import { api } from "../api";
import { Button, Card, SkeletonScreen } from "../ui";
import { PlatformLayout } from "./Layout";
const Form = styled(Card)`
  padding: clamp(22px, 5vw, 36px);
  border-radius: 22px;
  max-width: 760px;
  margin: auto;
  h1 {
    font:
      500 36px var(--font-heading),
      serif;
    color: #304a38;
    margin: 0 0 9px;
  }
  .intro {
    color: #718077;
    line-height: 1.6;
  }
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 14px;
  }
  .wide {
    grid-column: 1/-1;
  }
  label {
    display: block;
    font-size: 13px;
    font-weight: 700;
    color: #5f7065;
    margin: 18px 0 7px;
  }
  input {
    width: 100%;
    padding: 13px;
    border: 1px solid #d4dfd3;
    border-radius: 12px;
    background: #fff;
    outline: none;
  }
  .required {
    color: #9a5c55;
  }
  .note {
    background: #eef4eb;
    padding: 14px;
    border-radius: 12px;
    color: #607067;
    font-size: 12px;
    line-height: 1.55;
    margin: 18px 0;
  }
  .success {
    display: flex;
    gap: 9px;
    align-items: center;
    color: #4f765a;
    margin-top: 16px;
  }
  .error {
    color: #a25555;
  }
  button {
    margin-top: 20px;
  }
  .history {
    margin-top: 32px;
    padding-top: 22px;
    border-top: 1px solid #e1e8df;
  }
  .history p {
    color: #65736a;
  }
  @media (max-width: 620px) {
    .grid {
      grid-template-columns: 1fr;
    }
    .wide {
      grid-column: auto;
    }
  }
`;
type Submission = {
  id: string;
  title: string;
  originalAuthor?: string;
  publicationYear?: number | null;
  status: string;
  createdAt: string;
};
type Adaptation = "" | "yes" | "no";
const adaptationOptions = [
  { value: "" as Adaptation, label: "Не знаю" },
  { value: "yes" as Adaptation, label: "Да, существует" },
  { value: "no" as Adaptation, label: "Нет или не найдена" },
];
const selectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    minHeight: 48,
    borderRadius: 12,
    borderColor: state.isFocused ? "#78947e" : "#d4dfd3",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(95,128,104,.1)" : "none",
    background: "#fff",
    "&:hover": { borderColor: "#9caf9d" },
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 16px 45px rgba(42,64,48,.16)",
    zIndex: 20,
  }),
  menuList: (base: any) => ({ ...base, padding: 5 }),
  option: (base: any, state: any) => ({
    ...base,
    borderRadius: 8,
    fontSize: 14,
    background: state.isSelected
      ? "#5d7b65"
      : state.isFocused
        ? "#edf4ea"
        : "#fff",
    color: state.isSelected ? "#fff" : "#34483a",
    cursor: "pointer",
  }),
  singleValue: (base: any) => ({ ...base, color: "#34483a", fontSize: 14 }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base: any, state: any) => ({
    ...base,
    color: state.isFocused ? "#56745e" : "#7b8980",
    "&:hover": { color: "#45614d" },
  }),
};
export function SuggestInstrument() {
  const [form, setForm] = useState({
      title: "",
      originalAuthor: "",
      publicationYear: "",
      adaptation: "" as Adaptation,
    }),
    [sent, setSent] = useState(false),
    [saving, setSaving] = useState(false),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [items, setItems] = useState<Submission[]>([]);
  useEffect(() => {
    api
      .get("/account/instrument-submissions")
      .then((r) => setItems(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  if (loading)
    return (
      <PlatformLayout>
        <SkeletonScreen variant="form" />
      </PlatformLayout>
    );
  const set = (key: keyof typeof form, value: string) =>
    setForm((x) => ({ ...x, [key]: value }));
  async function submit(e: React.FormEvent) {
    e.preventDefault();
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
      const r = await api.post("/account/instrument-submissions", payload);
      setItems((x) => [
        {
          id: r.data.id,
          title: form.title,
          originalAuthor: form.originalAuthor,
          publicationYear: payload.publicationYear,
          status: "submitted",
          createdAt: new Date().toISOString(),
        },
        ...x,
      ]);
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Не удалось отправить запрос");
    } finally {
      setSaving(false);
    }
  }
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
                <input
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  required
                  minLength={2}
                />
              </div>
              <div className="wide">
                <label>
                  Автор или авторы оригинала <span className="required">*</span>
                </label>
                <input
                  value={form.originalAuthor}
                  onChange={(e) => set("originalAuthor", e.target.value)}
                  required
                  minLength={2}
                />
              </div>
              <div>
                <label>Год публикации</label>
                <input
                  type="number"
                  min="1800"
                  max={new Date().getFullYear() + 1}
                  value={form.publicationYear}
                  onChange={(e) => set("publicationYear", e.target.value)}
                  placeholder="Например, 1988"
                />
              </div>
              <div>
                <label>Есть русскоязычная адаптация?</label>
                <Select
                  value={adaptationOptions.find(
                    (option) => option.value === form.adaptation,
                  )}
                  options={adaptationOptions}
                  onChange={(option) => set("adaptation", option?.value ?? "")}
                  styles={selectStyles}
                  isSearchable={false}
                  menuPlacement="auto"
                />
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
                  : ""} ·{" "}
                {item.status === "submitted"
                  ? "ожидает рассмотрения"
                  : item.status === "reviewing"
                    ? "рассматривается"
                    : item.status === "approved"
                      ? "принят в работу"
                      : "отклонён"}
              </p>
            ))}
          </div>
        )}
      </Form>
    </PlatformLayout>
  );
}
