import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Alert,
  Button,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Modal,
  Popover,
  Radio,
  Select,
  Spin,
  Tabs,
  Tag,
  message,
} from "antd";
import { ChevronDown, CircleHelp, Clock3, RefreshCw, Search, UserRound, Wallet } from "lucide-react";
import { api, getCurrentUser } from "../../api";
import { getApiErrorMessage } from "../../utils/apiErrors";
import { PlatformLayout } from "../PlatformLayout";
import { CommunityModal, CommunitySurface } from "./styles";
import { ProfileForm } from "./ProfileForm";
import { CommunityIntro } from "./CommunityIntro";
import { ListingForm } from "./ListingForm";
import { criteriaTags, criteriaText, dateLabel, statusLabels } from "./model";

const pointWords = { one: "балл", few: "балла", other: "баллов", many: "баллов", zero: "баллов", two: "балла" };
const points = (amount: number) => `${amount} ${pointWords[new Intl.PluralRules("ru").select(amount)]}`;

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
    [helpOpen, setHelpOpen] = useState(false),
    [walletOpen, setWalletOpen] = useState(false),
    [historyOpen, setHistoryOpen] = useState(false),
    [questionnaireOpen, setQuestionnaireOpen] = useState(false),
    [editor, setEditor] = useState<any>(null);
  const [feed, setFeed] = useState<any[]>([]),
    [listings, setListings] = useState<any[]>([]),
    [listBusy, setListBusy] = useState(false);
  const [search, setSearch] = useState(""),
    [duration, setDuration] = useState(0),
    [topic, setTopic] = useState<string>(),
    [screen, setScreen] = useState<any>(null),
    [working, setWorking] = useState(false);
  const [appeal, setAppeal] = useState<any>(null),
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
      const [f, l] = await Promise.all([
        api.get("/community/feed"),
        api.get("/community/listings"),
      ]);
      setFeed(f.data);
      setListings(l.data);
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
      (!duration || x.minutes <= duration) &&
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
  const ready = Boolean(me?.profile?.complete);
  return (
    <PlatformLayout>
      <CommunitySurface>
        {ready && (
          <header className="community-header">
            <div>
              <h1>Найти респондентов</h1>
            </div>
            <div className="community-tools">
              <Button icon={<UserRound size={16} />} onClick={() => setEditingProfile(true)}>
                Карточка участника
              </Button>
              <Popover open={walletOpen} onOpenChange={setWalletOpen} trigger="click" placement="bottomRight" title="Ваш баланс" content={
                <div className="wallet-details" style={{ maxWidth: 260 }}>
                  <p>Заработано: <strong>{me.wallet.earned}</strong></p>
                  <p>Бонусных: <strong>{me.wallet.bonus}</strong></p>
                  <p>Используйте баллы для продвижения своего опроса.</p>
                  <Button type="link" onClick={() => { setHistoryOpen(true); setWalletOpen(false); }}>История начислений</Button>
                </div>
              }>
                <Button className="wallet-button" icon={<Wallet size={16} />} aria-label={`Баланс: ${points(balance)}`}>
                  {points(balance)}
                </Button>
              </Popover>
            </div>
          </header>
        )}
        {loading ? (
          <Spin tip="Открываем раздел">
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
            {!ready && !questionnaireOpen ? (
              <CommunityIntro
                hasDraft={Boolean(
                  me.profile?.data && Object.keys(me.profile.data).length,
                )}
                onStart={() => setQuestionnaireOpen(true)}
              />
            ) : !ready ? (
              <ProfileForm
                profile={me.profile}
                onCancel={
                  ready
                    ? () => setEditingProfile(false)
                    : () => {
                        setQuestionnaireOpen(false);
                        void loadMe().catch((e) =>
                          setError(
                            getApiErrorMessage(
                              e,
                              "Не удалось обновить карточку. Попробуйте ещё раз.",
                            ),
                          ),
                        );
                      }
                }
                onSaved={async () => {
                  await loadMe();
                  setEditingProfile(false);
                  await loadLists();
                }}
              />
            ) : (
              <>
                {me.profile.confirmedAt &&
                  Date.now() - new Date(me.profile.confirmedAt).getTime() >
                    180 * 86400000 && (
                    <Alert
                      type="info"
                      title="Проверьте актуальность карточки участника"
                      action={
                        <Button onClick={() => setEditingProfile(true)}>
                          Проверить карточку
                        </Button>
                      }
                    />
                  )}
                <Tabs
                  className="community-tabs"
                  activeKey={tab}
                  onChange={(key) => {
                    setTab(key);
                    setEditor(null);
                  }}
                  items={[
                    {
                      key: "feed",
                      label: "Опросы",
                      children: (
                        <section aria-label="Исследования сообщества">
                          <div className="section-heading">
                            <div>
                              <h2>Исследования сообщества</h2>
                              <p className="muted">Подобраны по вашей карточке</p>
                            </div>
                            <Button type="text" icon={<RefreshCw size={16} />} onClick={() => void loadLists()} loading={listBusy}>Обновить</Button>
                          </div>
                          {feed.length > 0 && (
                          <div className="filter-bar">
                            <Input
                              aria-label="Поиск исследований"
                              prefix={<Search size={17} />}
                              placeholder="Найти опрос"
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              allowClear
                            />
                            <Select
                              aria-label="Длительность исследования"
                              value={duration}
                              onChange={setDuration}
                              options={[
                                { value: 0, label: "Любая длительность" },
                                { value: 5, label: "До 5 минут" },
                                { value: 15, label: "До 15 минут" },
                                { value: 30, label: "До 30 минут" },
                                { value: 60, label: "До часа" },
                                { value: 120, label: "До двух часов" },
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
                          </div>
                          )}
                          {listBusy ? (
                            <Spin />
                          ) : shown.length ? (
                            <div className="research-list">
                              {shown.map((x) => (
                                <article className="research-row" key={x.id}>
                                  <div className="research-content">
                                    <h2>{x.title}</h2>
                                    <p className="research-description">{x.description}</p>
                                    <div className="research-criteria" aria-label="Условия участия">
                                      {criteriaTags(x.criteria).map((label, i) => <span key={`${label}-${i}`}>{label}</span>)}
                                    </div>
                                    {x.sensitive && (
                                      <p className="research-warning">
                                        <strong>Перед участием</strong>{x.sensitive}
                                      </p>
                                    )}
                                    <p className="research-match">
                                      {x.match === "pass"
                                        ? "Подходит по вашей карточке"
                                        : x.match === "screening"
                                          ? "Короткий отбор перед участием"
                                          : "Нужно уточнить карточку"}
                                    </p>
                                  </div>
                                  <div className="participate">
                                    <span className="research-time"><Clock3 size={16} />{x.minutes} мин</span>
                                    <strong>+{points(x.reward)}</strong>
                                    <small className="muted">За зачтённое прохождение</small>
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
                                        ? "Уточнить карточку"
                                        : "Участвовать"}
                                    </Button>
                                  </div>
                                </article>
                              ))}
                            </div>
                          ) : (
                            <div className="community-empty">
                              <h3>
                                {
                                  search || topic || duration > 0
                                    ? "По вашим фильтрам ничего не найдено"
                                    : "Подходящих опросов пока нет"
                                }
                              </h3>
                              <p className="muted">
                                {search || topic || duration > 0
                                  ? "Попробуйте изменить тему, длительность или запрос."
                                  : "Новые исследования появятся здесь, когда авторам понадобятся участники с вашей карточкой."}
                              </p>
                              {(search || topic || duration > 0) && (
                                <Button
                                  onClick={() => {
                                    setSearch("");
                                    setTopic(undefined);
                                    setDuration(0);
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
                          available={balance}
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
                          <div className="section-heading">
                            <div>
                              <h2>Ваши исследования в сообществе</h2>
                              <p className="muted">
                                Разместите свой опрос и собирайте ответы.
                              </p>
                            </div>
                            <Button
                              type="primary"
                              onClick={() => setEditor({ new: true })}
                            >
                              Разместить исследование
                            </Button>
                          </div>
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
                                <p className="listing-summary">
                                  Зачтено: <strong>{l.completed}</strong> · В работе: {Number(l.pending) + Number(l.reserved)} · Бюджет: {l.earned_budget + l.bonus_budget}
                                </p>
                                <details className="listing-details">
                                <summary>Статистика и выборка</summary>
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
                                      const group = l.groups?.find(
                                        (g: any) => g.quota_id === q.id,
                                      );
                                      return `${q.label}: ${Number(group?.completed ?? 0)} зачтено, ${Number(group?.pending ?? 0) + Number(group?.reserved ?? 0)} в работе / ${q.target}`;
                                    })
                                    .join("; ")}
                                </p>
                                </details>
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
                                    <Button
                                      onClick={() => {
                                        setAmount(1);
                                        setTopup(l);
                                      }}
                                    >
                                      Пополнить бюджет
                                    </Button>
                                    <Dropdown trigger={["click"]} menu={{
                                      items: [
                                        { key: "edit", label: "Настройки выборки" },
                                        { key: "results", label: "Результаты" },
                                        { type: "divider" },
                                        { key: "close", label: "Закрыть размещение", danger: true },
                                      ],
                                      onClick: ({ key }) => {
                                        if (key === "edit") setEditor(l);
                                        if (key === "results") navigate(`/app/surveys/${l.survey_id}/results`);
                                        if (key === "close") setCloseTarget(l);
                                      },
                                    }}>
                                      <Button>Ещё <ChevronDown size={14} /></Button>
                                    </Dropdown>
                                  </div>
                                )}
                              </article>
                            ))
                          ) : (
                            <div className="community-empty">
                              <h3>Ваш опрос может быть здесь</h3>
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
                          <div className="section-heading">
                          <div><h2>Участия и начисления</h2>
                          <p className="muted">Статусы прохождений и история баллов</p></div>
                          <Button
                            type="text"
                            icon={<RefreshCw size={16} />}
                            onClick={() => void action(async () => {})}
                            loading={working}
                          >
                            Обновить статусы
                          </Button>
                          </div>
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
                                <span> {points(p.reward)}</span>
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
                            <div className="community-empty">
                              <h3>Вы пока не участвовали в исследованиях</h3>
                              <p className="muted">Выберите подходящий опрос в первой вкладке.</p>
                            </div>
                          )}
                        </section>
                      ),
                    },
                  ]}
                />
                <Button className="community-help" type="text" icon={<CircleHelp size={16} />} onClick={() => setHelpOpen(true)}>Как это работает</Button>
              </>
            )}
          </>
        )}
        <CommunityModal
          open={historyOpen}
          title="История баллов"
          onCancel={() => setHistoryOpen(false)}
          footer={null}
          width={520}
        >
          <CommunitySurface>
            {me?.history?.length ? <ul className="history">
              {me.history.map((h: any) => <li key={h.id}>
                <div>{h.note}<br /><small className="muted">{dateLabel(h.createdAt)}</small></div>
                <strong>{h.amount > 0 ? "+" : ""}{h.amount}</strong>
              </li>)}
            </ul> : <p className="muted">Операций пока нет.</p>}
          </CommunitySurface>
        </CommunityModal>
        <CommunityModal
          open={helpOpen}
          title="Как это работает"
          onCancel={() => setHelpOpen(false)}
          footer={<Button type="primary" onClick={() => setHelpOpen(false)}>Понятно</Button>}
          width={620}
        >
          <div className="help-copy">
            <p className="help-intro">Вы проходите опросы других участников, а они — ваши.</p>
            <h3>Участвуйте и получайте баллы</h3>
            <p>В ленте — исследования, подобранные по вашей карточке. У некоторых есть короткий отбор перед началом. Награда указана заранее и начисляется после проверки прохождения.</p>
            <h3>Продвигайте свой опрос</h3>
            <p>Во вкладке «Моё продвижение» выберите опубликованный опрос, задайте выборку и выделите бюджет из баллов. Он расходуется на зачтённые участия. Показы распределяются между подходящими исследованиями — большой баланс не гарантирует первое место.</p>
            <h3>Следите за результатом</h3>
            <p>В «Моём участии» видны сроки, статусы и начисления. Перед началом система резервирует место и награду минимум на 2 часа; точный срок указан в участии. Проверка обычно запускается в течение нескольких минут после завершения.</p>
            <h3>Внимательные ответы важнее скорости</h3>
            <p>Индекс качества помогает обнаруживать случайное прокликивание. Отсутствие индекса у нового исследования не мешает начислению. Спорные случаи проверяет другой администратор; решение можно попросить пересмотреть. Баллы не оценивают личность и не влияют на психологические результаты.</p>
            <p className="help-note">При первом входе в раздел начисляются 8 бонусных баллов. Они уже включены в баланс. Баллы нельзя купить или передать. Карточка не публикуется и не передаётся автору вместе с ответами.</p>
          </div>
        </CommunityModal>
        <CommunityModal
          open={ready && editingProfile}
          title="Карточка участника"
          onCancel={() => setEditingProfile(false)}
          footer={null}
          width={720}
          destroyOnHidden
        >
          <CommunitySurface className="community-dialog-surface">
            {ready && <ProfileForm
              embedded
              profile={me.profile}
              onSaved={async () => {
                await loadMe();
                setEditingProfile(false);
                await loadLists();
                message.success("Карточка обновлена");
              }}
            />}
          </CommunitySurface>
        </CommunityModal>
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
