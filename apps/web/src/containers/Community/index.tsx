import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Alert,
  Button,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Spin,
  Tabs,
  Tag,
  message,
} from "antd";
import { Clock3, Search, Users } from "lucide-react";
import { api, getCurrentUser } from "../../api";
import { getApiErrorMessage } from "../../utils/apiErrors";
import { PlatformLayout } from "../PlatformLayout";
import { CommunitySurface } from "./styles";
import { ProfileForm } from "./ProfileForm";
import { ListingForm } from "./ListingForm";
import { criteriaText, dateLabel, statusLabels } from "./model";

export function Community() {
  const navigate = useNavigate(),
    [params] = useSearchParams();
  const [me, setMe] = useState<any>(),
    [loading, setLoading] = useState(true),
    [forbidden, setForbidden] = useState(false),
    [error, setError] = useState("");
  const [tab, setTab] = useState(
      params.has("survey")
        ? "promotion"
        : params.get("tab") === "participation"
          ? "participation"
          : "feed",
    ),
    [editingProfile, setEditingProfile] = useState(false),
    [editor, setEditor] = useState<any>(null);
  const [feed, setFeed] = useState<any[]>([]),
    [listings, setListings] = useState<any[]>([]),
    [reviews, setReviews] = useState<any[]>([]),
    [listBusy, setListBusy] = useState(false);
  const [search, setSearch] = useState(""),
    [duration, setDuration] = useState(60),
    [topic, setTopic] = useState<string>(),
    [screen, setScreen] = useState<any>(null),
    [working, setWorking] = useState(false);
  const [appeal, setAppeal] = useState<any>(null),
    [review, setReview] = useState<any>(null),
    [topup, setTopup] = useState<any>(null),
    [closeTarget, setCloseTarget] = useState<any>(null);
  const [note, setNote] = useState(""),
    [amount, setAmount] = useState<number | null>(1),
    [screenForm] = Form.useForm();
  const requested = useRef(false);
  async function loadMe() {
    const r = await api.get("/community/me");
    setMe(r.data);
    return r.data;
  }
  async function loadLists() {
    setListBusy(true);
    setError("");
    try {
      const [f, l, r] = await Promise.all([
        api.get("/community/feed"),
        api.get("/community/listings"),
        api.get("/community/reviews"),
      ]);
      setFeed(f.data);
      setListings(l.data);
      setReviews(r.data);
    } catch (e) {
      setError(
        getApiErrorMessage(
          e,
          "Не удалось загрузить исследования. Попробуйте ещё раз.",
        ),
      );
    } finally {
      setListBusy(false);
    }
  }
  useEffect(() => {
    let alive = true;
    void getCurrentUser()
      .then(async (u) => {
        if (!["owner", "admin"].includes(u.role)) {
          if (alive) setForbidden(true);
          return;
        }
        const data = await api.get("/community/me");
        if (alive) setMe(data.data);
      })
      .catch((e) => {
        if (alive)
          setError(getApiErrorMessage(e, "Не удалось открыть раздел."));
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);
  useEffect(() => {
    if (me?.profile?.complete) void loadLists();
  }, [me?.profile?.complete]);
  useEffect(() => {
    if (me?.profile?.complete && params.has("survey") && !requested.current) {
      requested.current = true;
      setEditor({ new: true });
      setTab("promotion");
    }
  }, [me?.profile?.complete, params]);
  useEffect(() => {
    if (!me?.profile?.complete) return;
    const timer = window.setInterval(() => {
      void loadMe().catch(() => {});
    }, 30000);
    return () => window.clearInterval(timer);
  }, [me?.profile?.complete]);
  const shown = feed.filter(
    (x) =>
      (!search ||
        `${x.title} ${x.description} ${x.author}`
          .toLocaleLowerCase("ru")
          .includes(search.toLocaleLowerCase("ru"))) &&
      x.minutes <= duration &&
      (!topic || x.topic === topic),
  );
  useEffect(() => {
    if (tab !== "feed" || !shown.length) return;
    void api
      .post("/community/impressions", {
        ids: shown.slice(0, 50).map((x) => x.id),
      })
      .catch(() => {});
  }, [tab, feed, search, duration, topic]);
  async function refresh() {
    await loadMe();
    await loadLists();
  }
  async function action(fn: () => Promise<unknown>, success?: string) {
    setWorking(true);
    setError("");
    try {
      await fn();
      if (success) message.success(success);
      await refresh();
      return true;
    } catch (e) {
      const text = getApiErrorMessage(
        e,
        "Не удалось выполнить действие. Попробуйте ещё раз.",
      );
      setError(text);
      message.error(text);
      return false;
    } finally {
      setWorking(false);
    }
  }
  async function join(item: any, answers: Record<string, number> = {}) {
    setWorking(true);
    setError("");
    try {
      const r = await api.post(`/community/listings/${item.id}/join`, {
        answers,
      });
      setScreen(null);
      if (r.data.screenedOut) {
        message.info(
          "Сейчас требуется другая группа участников. Подберём вам другие исследования.",
        );
        await refresh();
        return;
      }
      localStorage.setItem(`survey_session_${r.data.slug}`, r.data.token);
      sessionStorage.removeItem(`survey_result_${r.data.slug}`);
      navigate(`/s/${r.data.slug}?community=1`);
    } catch (e) {
      const text = getApiErrorMessage(e, "Не удалось зарезервировать участие.");
      setError(text);
      message.error(text);
    } finally {
      setWorking(false);
    }
  }
  function openParticipation(p: any) {
    localStorage.setItem(`survey_session_${p.slug}`, p.token);
    sessionStorage.removeItem(`survey_result_${p.slug}`);
    navigate(`/s/${p.slug}?community=1`);
  }
  const balance = (me?.wallet?.earned ?? 0) + (me?.wallet?.bonus ?? 0);
  const available = balance + (me?.wallet?.bonusGranted ? 0 : 8);
  const ready = Boolean(me?.profile?.complete);
  return (
    <PlatformLayout>
      <CommunitySurface>
        <div className="page-head">
          <div>
            <h1>Взаимопомощь</h1>
            <p className="muted">
              Помогайте другим собрать выборку — получайте больше участников для
              своего исследования.
            </p>
            <Tag>Закрытый пилот · админ и владелец</Tag>
          </div>
          {ready && (
            <div className="balance">
              <strong>{balance} балл(а)</strong>
              <small className="muted">
                Заработано: {me.wallet.earned} · Бонусных: {me.wallet.bonus}
              </small>
            </div>
          )}
        </div>
        {loading ? (
          <Spin tip="Открываем взаимопомощь">
            <div style={{ minHeight: 180 }} />
          </Spin>
        ) : forbidden ? (
          <Alert
            type="info"
            title="Раздел пока доступен только администратору и владельцу платформы."
          />
        ) : !me ? (
          <Alert
            type="error"
            title={error || "Не удалось загрузить раздел"}
            action={
              <Button onClick={() => window.location.reload()}>
                Повторить
              </Button>
            }
          />
        ) : (
          <>
            {error && (
              <Alert
                type="error"
                title={error}
                closable
                onClose={() => setError("")}
                style={{ marginBottom: 20 }}
              />
            )}
            {!ready || editingProfile ? (
              <ProfileForm
                profile={me.profile}
                onCancel={ready ? () => setEditingProfile(false) : undefined}
                onSaved={async () => {
                  await loadMe();
                  setEditingProfile(false);
                  await loadLists();
                }}
              />
            ) : (
              <>
                <details>
                  <summary>Как работает взаимопомощь</summary>
                  <p>
                    Выбирайте подходящие исследования, проходите их внимательно
                    и получайте баллы после проверки. Баллы финансируют
                    продвижение вашего опроса. Награда и место резервируются
                    перед началом. Срок резерва — минимум 2 часа, точное время
                    видно в «Моём участии».
                  </p>
                  <p>
                    Новые исследования могут ещё не иметь индекса качества — это
                    не мешает начислению. Несколько признаков недобросовестного
                    прохождения требуют дополнительной проверки. Баллы не
                    оценивают человека и не меняют психологические результаты.
                  </p>
                  <p>
                    В закрытом пилоте при первом размещении доступно 8 стартовых
                    бонусных баллов. Баллы нельзя купить или передать другому
                    пользователю.
                  </p>
                </details>
                {me.profile.confirmedAt &&
                  Date.now() - new Date(me.profile.confirmedAt).getTime() >
                    180 * 86400000 && (
                    <Alert
                      type="info"
                      title="Проверьте актуальность анкеты участника"
                      action={
                        <Button onClick={() => setEditingProfile(true)}>
                          Проверить анкету
                        </Button>
                      }
                    />
                  )}
                <Tabs
                  activeKey={tab}
                  onChange={(key) => {
                    setTab(key);
                    setEditor(null);
                  }}
                  items={[
                    {
                      key: "feed",
                      label: "Найти исследование",
                      children: (
                        <section aria-label="Исследования сообщества">
                          <h2>Исследования сообщества</h2>
                          <p className="muted">
                            Подобраны по вашей анкете. Некоторые авторы зададут
                            дополнительные вопросы перед началом.
                          </p>
                          <div className="filter-bar">
                            <Input
                              aria-label="Поиск исследований"
                              prefix={<Search size={17} />}
                              placeholder="Название, описание или автор"
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              allowClear
                            />
                            <Select
                              aria-label="Длительность исследования"
                              value={duration}
                              onChange={setDuration}
                              options={[
                                { value: 60, label: "Любая длительность" },
                                { value: 5, label: "До 5 минут" },
                                { value: 15, label: "До 15 минут" },
                                { value: 30, label: "До 30 минут" },
                              ]}
                            />
                            <Select
                              aria-label="Тема исследования"
                              value={topic}
                              onChange={setTopic}
                              allowClear
                              placeholder="Любая тема"
                              style={{ minWidth: 180 }}
                              options={[
                                ...new Set(feed.map((x) => x.topic)),
                              ].map((value) => ({ value, label: value }))}
                            />
                            <Button
                              onClick={() => void loadLists()}
                              loading={listBusy}
                            >
                              Обновить
                            </Button>
                          </div>
                          {listBusy ? (
                            <Spin />
                          ) : shown.length ? (
                            <div className="research-list">
                              {shown.map((x) => (
                                <article className="research-row" key={x.id}>
                                  <div>
                                    <h2>{x.title}</h2>
                                    <p className="muted">
                                      {x.author} · {x.topic}
                                    </p>
                                    <p>{x.description}</p>
                                    <div className="research-meta">
                                      <span>
                                        <Clock3 size={16} />
                                        {x.minutes} мин
                                      </span>
                                      <span>
                                        <Users size={16} />
                                        {criteriaText(x.criteria)}
                                      </span>
                                    </div>
                                    {x.sensitive && (
                                      <p className="notice">
                                        Перед участием: {x.sensitive}
                                      </p>
                                    )}
                                    <Tag>
                                      {x.match === "pass"
                                        ? "Подходит по вашей анкете"
                                        : x.match === "screening"
                                          ? "Короткий отбор перед участием"
                                          : "Нужно уточнить анкету"}
                                    </Tag>
                                  </div>
                                  <div className="participate">
                                    <strong>+{x.reward} балл(а)</strong>
                                    <Button
                                      type="primary"
                                      loading={working}
                                      onClick={() => {
                                        if (x.match === "unknown")
                                          setEditingProfile(true);
                                        else if (x.screening.length) {
                                          screenForm.resetFields();
                                          setScreen(x);
                                        } else void join(x);
                                      }}
                                    >
                                      {x.match === "unknown"
                                        ? "Уточнить анкету"
                                        : "Участвовать"}
                                    </Button>
                                    <small className="muted">
                                      За зачтённое прохождение
                                    </small>
                                  </div>
                                </article>
                              ))}
                            </div>
                          ) : (
                            <div className="panel empty">
                              <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                  search || topic || duration < 60
                                    ? "По этим фильтрам ничего не найдено"
                                    : "Сейчас нет исследований, подходящих по вашей анкете"
                                }
                              />
                              <p className="muted">
                                Новые размещения появятся здесь. Менять
                                достоверные ответы ради доступа не нужно.
                              </p>
                              {(search || topic || duration < 60) && (
                                <Button
                                  onClick={() => {
                                    setSearch("");
                                    setTopic(undefined);
                                    setDuration(60);
                                  }}
                                >
                                  Сбросить фильтры
                                </Button>
                              )}
                            </div>
                          )}
                        </section>
                      ),
                    },
                    {
                      key: "promotion",
                      label: "Моё продвижение",
                      children: editor ? (
                        <ListingForm
                          available={available}
                          initial={editor.new ? undefined : editor}
                          selectedSurvey={params.get("survey") ?? undefined}
                          onCancel={() => setEditor(null)}
                          onSaved={async () => {
                            setEditor(null);
                            await refresh();
                            message.success("Размещение сохранено");
                          }}
                        />
                      ) : (
                        <section aria-label="Моё продвижение">
                          <div className="page-head">
                            <div>
                              <h2>Ваши исследования в сообществе</h2>
                              <p className="muted">
                                Распределяем показы между подходящими
                                исследованиями. Большой баланс не даёт
                                постоянного первого места.
                              </p>
                            </div>
                            <Button
                              type="primary"
                              onClick={() => setEditor({ new: true })}
                            >
                              Разместить исследование
                            </Button>
                          </div>
                          {!me.wallet.bonusGranted && (
                            <p className="notice">
                              При первом размещении вы получите 8 стартовых
                              бонусных баллов. Они доступны только внутри
                              взаимопомощи.
                            </p>
                          )}
                          {listings.length ? (
                            listings.map((l) => (
                              <article className="panel" key={l.id}>
                                <h3>{l.title}</h3>
                                <Tag>
                                  {l.state === "closed"
                                    ? "Закрыто"
                                    : l.state === "paused"
                                      ? "На паузе"
                                      : l.surveyStatus !== "active"
                                        ? "Опрос неактивен"
                                        : l.earned_budget + l.bonus_budget <
                                            l.reward
                                          ? "Бюджет исчерпан"
                                          : "Продвигается"}
                                </Tag>
                                <div className="research-meta">
                                  <span>Показы: {l.impressions}</span>
                                  <span>Начали: {l.started}</span>
                                  <span>Зачтено: {l.completed}</span>
                                  <span>На проверке: {l.pending}</span>
                                  <span>В резерве: {l.reserved}</span>
                                </div>
                                <p>
                                  Свободный бюджет:{" "}
                                  <strong>
                                    {l.earned_budget + l.bonus_budget}
                                  </strong>{" "}
                                  · Потрачено на зачтённые участия: {l.spent} ·
                                  Награда: {l.reward}
                                </p>
                                <p className="muted">
                                  {criteriaText(l.config.criteria)}
                                </p>
                                <p className="muted">
                                  Цель:{" "}
                                  {l.config.quotas
                                    .map((q: any) => {
                                      const group = l.groups?.find((g: any) => g.quota_id === q.id);
                                      return `${q.label}: ${Number(group?.completed ?? 0)} зачтено, ${Number(group?.pending ?? 0) + Number(group?.reserved ?? 0)} в работе / ${q.target}`;
                                    })
                                    .join("; ")}
                                </p>
                                {l.state !== "closed" && (
                                  <div className="actions">
                                    <Button
                                      disabled={working}
                                      onClick={() =>
                                        void action(() =>
                                          api.patch(
                                            `/community/listings/${l.id}`,
                                            {
                                              state:
                                                l.state === "active"
                                                  ? "paused"
                                                  : "active",
                                            },
                                          ),
                                        )
                                      }
                                    >
                                      {l.state === "active"
                                        ? "Приостановить"
                                        : "Возобновить"}
                                    </Button>
                                    <Button onClick={() => setEditor(l)}>
                                      Настройки выборки
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        setAmount(1);
                                        setTopup(l);
                                      }}
                                    >
                                      Пополнить бюджет
                                    </Button>
                                    <Button
                                      onClick={() =>
                                        navigate(
                                          `/app/surveys/${l.survey_id}/results`,
                                        )
                                      }
                                    >
                                      Результаты
                                    </Button>
                                    <Button onClick={() => setCloseTarget(l)}>
                                      Закрыть размещение
                                    </Button>
                                  </div>
                                )}
                              </article>
                            ))
                          ) : (
                            <div className="panel empty">
                              <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="Вы пока не разместили исследование"
                              />
                              <p className="muted">
                                Выберите опубликованный опрос, задайте выборку и
                                бюджет.
                              </p>
                            </div>
                          )}
                        </section>
                      ),
                    },
                    {
                      key: "participation",
                      label: "Моё участие",
                      children: (
                        <section>
                          <h2>Участия и начисления</h2>
                          <p className="muted">
                            После завершения проверка обычно запускается в
                            течение нескольких минут. Спорные случаи
                            рассматривает другой администратор.
                          </p>
                          <Button
                            onClick={() => void action(async () => {})}
                            loading={working}
                          >
                            Обновить статусы
                          </Button>
                          {me.participations.length ? (
                            me.participations.map((p: any) => (
                              <article className="panel" key={p.id}>
                                <h3>{p.title}</h3>
                                <Tag
                                  color={
                                    p.status === "credited"
                                      ? "success"
                                      : p.status === "review"
                                        ? "warning"
                                        : undefined
                                  }
                                >
                                  {statusLabels[p.status]}
                                </Tag>
                                <span> {p.reward} балл(а)</span>
                                {p.reason && <p>{p.reason}</p>}
                                {p.status === "reserved" && (
                                  <>
                                    <p className="muted">
                                      Завершите до {dateLabel(p.expiresAt)}.
                                      После срока награда и место освобождаются.
                                      Если уже завершили — ожидайте проверки.
                                    </p>
                                    <Button
                                      type="primary"
                                      onClick={() => openParticipation(p)}
                                    >
                                      Продолжить опрос
                                    </Button>
                                  </>
                                )}
                                {["review", "rejected"].includes(p.status) && (
                                  <div className="actions">
                                    <Button
                                      onClick={() => {
                                        setNote(p.appeal ?? "");
                                        setAppeal(p);
                                      }}
                                    >
                                      {p.appeal
                                        ? "Дополнить обращение"
                                        : "Попросить пересмотр"}
                                    </Button>
                                  </div>
                                )}
                              </article>
                            ))
                          ) : (
                            <div className="panel empty">
                              <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="Здесь появятся ваши участия"
                              />
                            </div>
                          )}
                          <h2>История баллов</h2>
                          <ul className="history">
                            {me.history.map((h: any) => (
                              <li key={h.id}>
                                <div>
                                  {h.note}
                                  <br />
                                  <small className="muted">
                                    {dateLabel(h.createdAt)}
                                  </small>
                                </div>
                                <strong>
                                  {h.amount > 0 ? "+" : ""}
                                  {h.amount}
                                </strong>
                              </li>
                            ))}
                          </ul>
                          {!me.history.length && (
                            <p className="muted">Операций пока нет.</p>
                          )}
                        </section>
                      ),
                    },
                    {
                      key: "profile",
                      label: "Анкета участника",
                      children: (
                        <section className="panel">
                          <h2>Ваши сведения для подбора</h2>
                          <p>
                            Анкета используется для отбора и не публикуется.
                            Проверяйте её, если изменились семейное положение,
                            работа или другие сведения.
                          </p>
                          <p className="muted">
                            {me.profile.confirmedAt
                              ? `Подтверждена: ${dateLabel(me.profile.confirmedAt)}`
                              : ""}
                          </p>
                          <Button onClick={() => setEditingProfile(true)}>
                            Редактировать анкету
                          </Button>
                        </section>
                      ),
                    },
                    {
                      key: "reviews",
                      label: `Проверка участий${reviews.length ? ` (${reviews.length})` : ""}`,
                      children: (
                        <section>
                          <h2>Спорные начисления</h2>
                          <p className="muted">
                            Нельзя проверять своё участие или участников
                            собственного исследования. Решения сохраняются в
                            журнале действий.
                          </p>
                          <Button
                            onClick={() => void loadLists()}
                            loading={listBusy}
                          >
                            Обновить очередь
                          </Button>
                          {reviews.length ? (
                            reviews.map((r) => (
                              <article className="panel" key={r.id}>
                                <h3>{r.title}</h3>
                                <p>{r.reason}</p>
                                {r.appeal && (
                                  <p className="notice">
                                    Обращение: {r.appeal}
                                  </p>
                                )}
                                <p className="muted">
                                  Участие {r.id} · {r.reward} балл(а)
                                </p>
                                <Button
                                  disabled={working}
                                  onClick={() =>
                                    void action(async () => {
                                      const response = await api.get(
                                        `/community/reviews/${r.id}`,
                                      );
                                      setNote("");
                                      setReview(response.data);
                                    })
                                  }
                                >
                                  Рассмотреть
                                </Button>
                              </article>
                            ))
                          ) : (
                            <div className="panel empty">
                              <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="Спорных начислений нет"
                              />
                            </div>
                          )}
                        </section>
                      ),
                    },
                  ]}
                />
              </>
            )}
          </>
        )}
        <Modal
          open={!!screen}
          title="Короткий отбор перед участием"
          onCancel={() => setScreen(null)}
          footer={null}
          destroyOnHidden
        >
          <p>
            Ответьте на вопросы, чтобы проверить условия участия. За отбор баллы
            не начисляются.
          </p>
          <Form
            form={screenForm}
            layout="vertical"
            onFinish={(answers) => void join(screen, answers)}
          >
            {screen?.screening.map((q: any) => (
              <Form.Item
                key={q.id}
                name={q.id}
                label={q.question}
                rules={[{ required: true, message: "Выберите ответ" }]}
              >
                <Radio.Group
                  options={q.options.map((label: string, value: number) => ({
                    label,
                    value,
                  }))}
                  orientation="vertical"
                />
              </Form.Item>
            ))}
            <Button type="primary" htmlType="submit" loading={working}>
              Проверить и начать
            </Button>
          </Form>
        </Modal>
        <Modal
          open={!!appeal}
          title="Пересмотр начисления"
          onCancel={() => setAppeal(null)}
          confirmLoading={working}
          okText="Отправить обращение"
          cancelText="Отмена"
          okButtonProps={{ disabled: note.trim().length < 10 }}
          onOk={() =>
            void action(async () => {
              await api.post(`/community/participations/${appeal.id}/appeal`, {
                text: note,
              });
              setAppeal(null);
            }, "Обращение сохранено")
          }
        >
          <label htmlFor="appeal-text">
            Расскажите, почему решение стоит пересмотреть
          </label>
          <Input.TextArea
            id="appeal-text"
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={1500}
          />
        </Modal>
        <Modal
          open={!!review}
          title="Решение по начислению"
          onCancel={() => setReview(null)}
          footer={
            <div className="actions">
              <Button
                disabled={working || note.trim().length < 10}
                onClick={() =>
                  void action(async () => {
                    await api.post(`/community/reviews/${review.id}`, {
                      approve: false,
                      reason: note,
                    });
                    setReview(null);
                  })
                }
              >
                Не начислять
              </Button>
              <Button
                type="primary"
                disabled={working || note.trim().length < 10}
                onClick={() =>
                  void action(async () => {
                    await api.post(`/community/reviews/${review.id}`, {
                      approve: true,
                      reason: note,
                    });
                    setReview(null);
                  })
                }
              >
                Начислить баллы
              </Button>
            </div>
          }
        >
          <p>{review?.reason}</p>
          {review && <>
            <p>Фактическое время: {Math.round((review.seconds ?? 0) / 6) / 10} мин · Ожидалось: {review.minutes} мин</p>
            <p>Подтверждённый дубликат: {review.duplicate ? 'Да' : 'Нет'} · Группа: {review.cohort ?? 'Не размечена'} · Соответствие: {review.eligibility ?? 'Не отмечено'}</p>
            {review.quality ? <>
              <p>Общий индекс: {review.quality.overall?.score ?? 'Недостаточно данных'} · Независимых групп признаков: {review.quality.independent_concerning_domains}</p>
              <ul>{(review.quality.overall?.flags ?? []).map((flag: any, i: number) => <li key={i}>{flag.explanation}</li>)}</ul>
            </> : <p>Статистический индекс пока недоступен.</p>}
            {review.screening?.map((q: any, i: number) => <p key={i}>{q.question}: {q.answer}</p>)}
            <a href={`/app/admin/users/${review.ownerId}/surveys/${review.surveyId}/results`} target="_blank" rel="noreferrer">Открыть результаты исследования</a>
          </>}
          <p>
            Рассмотрите доступные результаты и обстоятельства участия. Необычные
            ответы сами по себе не доказывают недобросовестность.
          </p>
          <label htmlFor="review-reason">
            Обоснование решения, минимум 10 символов
          </label>
          <Input.TextArea
            id="review-reason"
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={500}
          />
        </Modal>
        <Modal
          open={!!topup}
          title="Пополнить бюджет"
          onCancel={() => setTopup(null)}
          okText="Пополнить"
          cancelText="Отмена"
          confirmLoading={working}
          okButtonProps={{ disabled: !amount || amount > balance }}
          onOk={() =>
            void action(async () => {
              await api.patch(`/community/listings/${topup.id}`, {
                topup: amount,
              });
              setTopup(null);
            })
          }
        >
          <p>Доступно: {balance} балл(а)</p>
          <label htmlFor="topup-amount">Количество баллов</label>
          <InputNumber
            id="topup-amount"
            min={1}
            max={Math.max(1, balance)}
            precision={0}
            value={amount}
            onChange={setAmount}
          />
        </Modal>
        <Modal
          open={!!closeTarget}
          title="Закрыть размещение?"
          onCancel={() => setCloseTarget(null)}
          okText="Закрыть размещение"
          cancelText="Отмена"
          confirmLoading={working}
          onOk={() =>
            void action(async () => {
              await api.patch(`/community/listings/${closeTarget.id}`, {
                state: "closed",
              });
              setCloseTarget(null);
            })
          }
        >
          <p>
            Свободный бюджет вернётся на баланс. Начатые участия сохранят
            обещанную награду. Новые участники больше не смогут начать опрос
            через взаимопомощь.
          </p>
        </Modal>
      </CommunitySurface>
    </PlatformLayout>
  );
}
