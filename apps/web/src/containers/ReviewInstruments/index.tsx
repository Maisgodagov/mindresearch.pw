import { useCallback, useEffect, useState } from "react";
import { api } from "../../api";
import { TextAreaField } from "../../components/TextAreaField";
import { Button, Card, SkeletonScreen } from "../../ui";
import { PlatformLayout } from "../PlatformLayout";
import { Stack } from "./styles";
import type { InstrumentSubmission, SubmissionStatus } from "./types";

export function ReviewInstruments() {
  const [items, setItems] = useState<InstrumentSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await api.get<InstrumentSubmission[]>("/admin/instrument-submissions");
    setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => { load().catch(() => setLoading(false)); }, [load]);

  async function update(item: InstrumentSubmission, status: SubmissionStatus) {
    await api.patch(`/admin/instrument-submissions/${item.id}`, {
      status,
      adminNote: item.adminNote ?? "",
    });
    await load();
  }

  if (loading) return <PlatformLayout><SkeletonScreen variant="cards" /></PlatformLayout>;

  return (
    <PlatformLayout>
      <Stack>
        <h1>Заявки на добавление методик</h1>
        {items.length === 0 && <Card className="item">Новых запросов пока нет.</Card>}
        {items.map((item) => (
          <Card className="item" key={item.id}>
            <span className="meta">
              {item.submitterName} · {item.submitterEmail} · {new Date(item.createdAt).toLocaleDateString("ru-RU")}
            </span>
            <h2>{item.title}</h2>
            <p><b>Автор или авторы:</b> {item.originalAuthor || "не указаны"}</p>
            <p><b>Год публикации:</b> {item.publicationYear ?? "не указан"}</p>
            <p>
              <b>Русскоязычная адаптация:</b>{" "}
              {item.hasRussianAdaptation === null ? "пользователь не знает" : item.hasRussianAdaptation ? "есть" : "нет или не найдена"}
            </p>
            <TextAreaField
              value={item.adminNote ?? ""}
              placeholder="Комментарий администратора"
              onChange={(event) => setItems((current) => current.map((entry) =>
                entry.id === item.id ? { ...entry, adminNote: event.target.value } : entry,
              ))}
            />
            <div className="actions">
              <Button onClick={() => update(item, "reviewing")}>Взять в работу</Button>
              <Button onClick={() => update(item, "approved")}>Отметить принятой</Button>
              <Button onClick={() => update(item, "rejected")}>Отклонить</Button>
            </div>
          </Card>
        ))}
      </Stack>
    </PlatformLayout>
  );
}
