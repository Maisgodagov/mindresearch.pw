import { useEffect, useState } from "react";
import styled from "styled-components";
import { api } from "../api";
import { Button, Card, SkeletonScreen } from "../ui";
import { PlatformLayout } from "./Layout";
const Stack = styled.div`
  display: grid;
  gap: 14px;
  max-width: 900px;
  h1 {
    font:
      500 38px var(--font-heading),
      serif;
    color: #304a38;
  }
  .item {
    padding: 23px;
    border-radius: 18px;
  }
  .meta {
    color: #78857c;
    font-size: 12px;
  }
  .body {
    white-space: pre-wrap;
    color: #5f6e64;
    line-height: 1.55;
  }
  .actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 16px;
  }
  textarea {
    width: 100%;
    min-height: 80px;
    border: 1px solid #d6e0d4;
    border-radius: 11px;
    padding: 11px;
    margin-top: 12px;
  }
`;
export function ReviewInstruments() {
  const [items, setItems] = useState<any[]>([]),
    [loading, setLoading] = useState(true);
  const load = () =>
    api
      .get("/admin/instrument-submissions")
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false));
  useEffect(() => {
    load().catch(() => {});
  }, []);
  const update = async (item: any, status: string) => {
    await api.patch(`/admin/instrument-submissions/${item.id}`, {
      status,
      adminNote: item.adminNote ?? "",
    });
    await load();
  };
  if (loading)
    return (
      <PlatformLayout>
        <SkeletonScreen variant="cards" />
      </PlatformLayout>
    );
  return (
    <PlatformLayout>
      <Stack>
        <h1>Запросы на добавление методик</h1>
        {items.length === 0 && (
          <Card className="item">Новых запросов пока нет.</Card>
        )}
        {items.map((item) => (
          <Card className="item" key={item.id}>
            <span className="meta">
              {item.submitterName} · {item.submitterEmail} ·{" "}
              {new Date(item.createdAt).toLocaleDateString("ru")}
            </span>
            <h2>{item.title}</h2>
            <p>
              <b>Автор или авторы:</b> {item.originalAuthor}
            </p>
            <p>
              <b>Год публикации:</b> {item.publicationYear ?? "не указан"}
            </p>
            <p>
              <b>Русскоязычная адаптация:</b>{" "}
              {item.hasRussianAdaptation === null
                ? "пользователь не знает"
                : item.hasRussianAdaptation
                  ? "есть"
                  : "нет или не найдена"}
            </p>
            <textarea
              value={item.adminNote ?? ""}
              placeholder="Комментарий администратора"
              onChange={(e) =>
                setItems((current) =>
                  current.map((x) =>
                    x.id === item.id ? { ...x, adminNote: e.target.value } : x,
                  ),
                )
              }
            />
            <div className="actions">
              <Button onClick={() => update(item, "reviewing")}>
                Взять в работу
              </Button>
              <Button onClick={() => update(item, "approved")}>
                Отметить принятой
              </Button>
              <Button onClick={() => update(item, "rejected")}>
                Отклонить
              </Button>
            </div>
          </Card>
        ))}
      </Stack>
    </PlatformLayout>
  );
}
