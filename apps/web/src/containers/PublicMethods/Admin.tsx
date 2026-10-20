import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, LoaderCircle, Plus, Save, Send, Trash2 } from "lucide-react";
import { Modal } from "antd";
import { api, getCurrentUser } from "../../api";
import { PlatformLayout } from "../PlatformLayout";
import type { PublicMethod } from "./types";
import "./public-methods.css";
import "./admin.css";
type Publication = {
  slug: string;
  draft: PublicMethod;
  published: PublicMethod | null;
  revision: number;
};
export function PublicMethodsAdmin() {
  const [items, setItems] = useState<Publication[]>([]),
    [selected, setSelected] = useState<Publication | null>(null),
    [content, setContent] = useState<PublicMethod | null>(null),
    [busy, setBusy] = useState<"draft" | "publish" | "unpublish" | null>(null),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [allowed, setAllowed] = useState<boolean | null>(null),
    [preview, setPreview] = useState(false);
  const load = async () => {
    const { data } = await api.get<Publication[]>("/admin/public-methods");
    setItems(data);
    return data;
  };
  useEffect(() => {
    getCurrentUser()
      .then(async (user) => {
        const ok = ["owner", "admin"].includes(user.role);
        setAllowed(ok);
        if (ok) await load();
      })
      .catch((e) => {
        setAllowed(false);
        setError(e.message);
      });
  }, []);
  const select = (item: Publication) => {
    setSelected(item);
    setContent(structuredClone(item.draft));
    setNotice("");
    setError("");
  };
  const choose = (item: Publication) => {
    if (busy) return;
    if (
      selected &&
      content &&
      JSON.stringify(content) !== JSON.stringify(selected.draft)
    ) {
      Modal.confirm({
        title: "Перейти к другой методике?",
        content: "Несохранённые изменения будут потеряны.",
        okText: "Перейти",
        cancelText: "Остаться",
        onOk: () => select(item),
      });
    } else select(item);
  };
  const save = async (action: "draft" | "publish" | "unpublish") => {
    if (!content || !selected) return;
    setBusy(action);
    setError("");
    setNotice("");
    try {
      await api.put(`/admin/public-methods/${selected.slug}`, {
        content,
        action,
        revision: selected.revision,
      });
      const list = await load();
      const updated = list.find((i) => i.slug === selected.slug)!;
      setSelected(updated);
      setContent(structuredClone(updated.draft));
      setNotice(
        action === "publish"
          ? "Страница опубликована. Новый текст уже доступен посетителям."
          : action === "unpublish"
            ? "Страница снята с публикации. Старые результаты сохраняются."
            : "Черновик сохранён. Публичная страница не изменилась.",
      );
    } catch (e: any) {
      setError(
        e.response?.data?.message ??
          "Не удалось сохранить. Проверьте поля и повторите.",
      );
    } finally {
      setBusy(null);
    }
  };
  const field = (label: string, key: keyof PublicMethod, multiline = false) => (
    <label className="pma-field">
      {label}
      {multiline ? (
        <textarea
          rows={3}
          value={String(content?.[key] ?? "")}
          onChange={(e) =>
            setContent((c) => (c ? { ...c, [key]: e.target.value } : c))
          }
        />
      ) : (
        <input
          value={String(content?.[key] ?? "")}
          onChange={(e) =>
            setContent((c) => (c ? { ...c, [key]: e.target.value } : c))
          }
        />
      )}
    </label>
  );
  return (
    <PlatformLayout>
      <div className="public-methods pma">
        <header>
          <h1>Публичные методики</h1>
          <p>
            Описание и источники редактируются отдельно от вопросов и правил
            подсчёта.
          </p>
          <Link className="pm-text" to="/methods">
            Открыть каталог
          </Link>
        </header>
        {allowed === null ? (
          <p role="status">Загрузка…</p>
        ) : !allowed ? (
          <p role="alert">Этот раздел доступен администраторам.</p>
        ) : (
          <>
            <div className="pma-tabs">
              {items.map((item) => (
                <button
                  key={item.slug}
                  aria-pressed={selected?.slug === item.slug}
                  onClick={() => choose(item)}
                >
                  {item.draft.abbreviation}
                  <span>{item.published ? "Опубликовано" : "Черновик"}</span>
                </button>
              ))}
            </div>
            {!content ? (
              <p>Выберите методику для редактирования.</p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void save("draft");
                }}
              >
                <div className="pma-heading">
                  <h2>{content.name}</h2>
                  <button
                    type="button"
                    className="pm-button pm-soft"
                    onClick={() => setPreview(true)}
                  >
                    <Eye size={17} />
                    Предпросмотр текста
                  </button>
                </div>
                <p className="pm-secondary">
                  Версия: {content.version}. Порядок вопросов, ключи и адрес
                  страницы здесь не изменяются.
                </p>
                <fieldset disabled={Boolean(busy)} className="pma-fields">
                  {field("Название методики", "name")}
                  {field("Заголовок пояснения", "title")}
                  {field("Тема", "topic")}
                  {field("Время прохождения", "minutes")}
                  {field("Короткое описание", "intro", true)}
                  {field("Аудитория", "audience", true)}
                  {field("Инструкция", "instruction", true)}
                  <h2>Содержание страницы</h2>
                  {content.sections.map((section, i) => (
                    <div className="pma-section" key={i}>
                      <label className="pma-field">
                        Заголовок
                        <input
                          required
                          maxLength={160}
                          value={section.title}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              sections: content.sections.map((s, j) =>
                                i === j ? { ...s, title: e.target.value } : s,
                              ),
                            })
                          }
                        />
                      </label>
                      <label className="pma-field">
                        Текст
                        <textarea
                          required
                          rows={5}
                          maxLength={6000}
                          value={section.text}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              sections: content.sections.map((s, j) =>
                                i === j ? { ...s, text: e.target.value } : s,
                              ),
                            })
                          }
                        />
                      </label>
                      <button
                        className="pm-text"
                        type="button"
                        disabled={content.sections.length <= 1}
                        onClick={() =>
                          setContent({
                            ...content,
                            sections: content.sections.filter(
                              (_, j) => j !== i,
                            ),
                          })
                        }
                      >
                        <Trash2 size={16} />
                        Удалить раздел
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="pm-button pm-soft"
                    disabled={content.sections.length >= 12}
                    onClick={() =>
                      setContent({
                        ...content,
                        sections: [
                          ...content.sections,
                          { title: "Новый раздел", text: "Текст раздела" },
                        ],
                      })
                    }
                  >
                    <Plus size={17} />
                    Добавить раздел
                  </button>
                  {field("Ограничения интерпретации", "limitations", true)}
                  {field("Условия использования", "rights", true)}
                  <h2>Источники</h2>
                  {content.sources.map((source, i) => (
                    <div className="pma-section" key={i}>
                      <label className="pma-field">
                        Название источника
                        <input
                          required
                          maxLength={500}
                          value={source.title}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              sources: content.sources.map((s, j) =>
                                i === j ? { ...s, title: e.target.value } : s,
                              ),
                            })
                          }
                        />
                      </label>
                      <label className="pma-field">
                        Ссылка HTTPS
                        <input
                          required
                          type="url"
                          value={source.url}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              sources: content.sources.map((s, j) =>
                                i === j ? { ...s, url: e.target.value } : s,
                              ),
                            })
                          }
                        />
                      </label>
                      <button
                        className="pm-text"
                        type="button"
                        disabled={content.sources.length <= 1}
                        onClick={() =>
                          setContent({
                            ...content,
                            sources: content.sources.filter((_, j) => j !== i),
                          })
                        }
                      >
                        <Trash2 size={16} />
                        Удалить источник
                      </button>
                    </div>
                  ))}
                  <button
                    className="pm-button pm-soft"
                    type="button"
                    disabled={content.sources.length >= 15}
                    onClick={() =>
                      setContent({
                        ...content,
                        sources: [...content.sources, { title: "", url: "" }],
                      })
                    }
                  >
                    <Plus size={17} />
                    Добавить источник
                  </button>
                </fieldset>
                {error && (
                  <p className="pm-inline-error" role="alert">
                    {error}
                  </p>
                )}
                {notice && (
                  <p className="pma-notice" role="status">
                    {notice}
                  </p>
                )}
                <div className="pma-actions">
                  <button
                    className="pm-button pm-soft"
                    disabled={Boolean(busy)}
                    type="submit"
                  >
                    {busy === "draft" ? (
                      <LoaderCircle className="pm-spin" size={17} />
                    ) : (
                      <Save size={17} />
                    )}
                    Сохранить черновик
                  </button>
                  <button
                    className="pm-button pm-primary"
                    disabled={Boolean(busy)}
                    type="button"
                    onClick={() => void save("publish")}
                  >
                    {busy === "publish" ? (
                      <LoaderCircle className="pm-spin" size={17} />
                    ) : (
                      <Send size={17} />
                    )}
                    Опубликовать
                  </button>
                  {selected?.published && (
                    <button
                      className="pm-text"
                      type="button"
                      disabled={Boolean(busy)}
                      onClick={() => void save("unpublish")}
                    >
                      Снять с публикации
                    </button>
                  )}
                </div>
              </form>
            )}
          </>
        )}
        {error && !content && <p role="alert">{error}</p>}
        <Modal
          open={preview}
          title="Предпросмотр текста страницы"
          onCancel={() => setPreview(false)}
          footer={null}
          width={800}
        >
          {content && (
            <div className="pma-preview">
              <h1>{content.name}</h1>
              <p>{content.intro}</p>
              <p>{content.audience}</p>
              {content.sections.map((section, i) => (
                <section key={i}>
                  <h2>{section.title}</h2>
                  <p>{section.text}</p>
                </section>
              ))}
              <h2>Ограничения</h2>
              <p>{content.limitations}</p>
              <h2>Источники</h2>
              <ul>
                {content.sources.map((source, i) => (
                  <li key={i}>
                    {source.title} — {source.url}
                  </li>
                ))}
              </ul>
              <p>{content.rights}</p>
            </div>
          )}
        </Modal>
      </div>
    </PlatformLayout>
  );
}
