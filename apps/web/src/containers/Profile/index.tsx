import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  Copy,
  ExternalLink,
  Globe2,
  KeyRound,
  Link2,
  Lock,
  LogOut,
  Mail,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import {
  api,
  getCurrentUser,
  invalidateCurrentUser,
  logout,
  logoutAll,
  setAccessToken,
} from "../../api";
import { Button, SkeletonScreen } from "../../ui";
import { FieldInput } from "../../components/FieldInput";
import { TextAreaField } from "../../components/TextAreaField";
import { ProfileLinks, LinkedBio } from "../../components/ProfileLinks";
import { avatarSeeds, StockAvatar } from "../../components/StockAvatar";
import {
  emptyProfileLinks,
  socialNetworks,
  type ProfileLinks as Links,
} from "../../profileLinks";
import { getApiErrorMessage } from "../../utils/apiErrors";
import { PlatformLayout } from "../PlatformLayout";
import type { Profile } from "./types";
import { translit } from "./const";
import { ProfileSurface, ProfileDialog, DialogBody, Avatars } from "./styles";

type Editor = "details" | "avatar" | "links" | "password" | "visibility" | null;
const emptyProfile: Profile = {
  name: "",
  email: "",
  role: "",
  bio: "",
  avatarSeed: "willow",
  publicSlug: "",
  isProfilePublic: false,
  profileLinks: emptyProfileLinks(),
};
const emptyPasswords = {
  currentPassword: "",
  newPassword: "",
  confirmation: "",
};

export function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [draft, setDraft] = useState<Profile>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [editor, setEditor] = useState<Editor>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [passwords, setPasswords] = useState(emptyPasswords);
  const [copied, setCopied] = useState(false);

  async function load() {
    setLoading(true);
    setLoadError("");
    try {
      const data = await getCurrentUser();
      setProfile({
        ...data,
        bio: data.bio ?? "",
        profileLinks: data.profileLinks ?? emptyProfileLinks(),
        avatarSeed: data.avatarSeed || "willow",
        isProfilePublic: Boolean(data.isProfilePublic),
      } as Profile);
    } catch {
      setLoadError(
        "Не удалось загрузить профиль. Проверьте подключение и попробуйте ещё раз.",
      );
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);

  function open(next: Editor) {
    setDraft(structuredClone(profile));
    setPasswords(emptyPasswords);
    setError("");
    setNotice("");
    setEditor(next);
  }
  function close() {
    if (!busy) {
      setEditor(null);
      setError("");
      setPasswords(emptyPasswords);
    }
  }
  function updateLinks(value: Links) {
    setDraft((current) => ({ ...current, profileLinks: value }));
  }
  async function saveProfile(patch: Partial<Profile>, message: string) {
    setBusy(true);
    setError("");
    try {
      const next = { ...profile, ...patch };
      await api.patch("/account/me", next);
      setProfile(next);
      invalidateCurrentUser();
      setEditor(null);
      setNotice(message);
    } catch (failure) {
      setError(
        getApiErrorMessage(
          failure,
          "Не удалось сохранить изменения. Попробуйте ещё раз.",
        ),
      );
    } finally {
      setBusy(false);
    }
  }
  async function saveDetails(event: FormEvent) {
    event.preventDefault();
    await saveProfile(
      { name: draft.name.trim(), bio: draft.bio, publicSlug: draft.publicSlug },
      "Данные профиля обновлены",
    );
  }
  async function changePassword(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (passwords.newPassword !== passwords.confirmation) {
      setError("Новые пароли не совпадают. Проверьте оба поля.");
      return;
    }
    setBusy(true);
    try {
      const response = await api.patch("/account/password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setAccessToken(response.data.token);
      setPasswords(emptyPasswords);
      setEditor(null);
      setNotice("Пароль изменён");
    } catch (failure) {
      setError(
        getApiErrorMessage(
          failure,
          "Не удалось изменить пароль. Проверьте текущий пароль и повторите.",
        ),
      );
    } finally {
      setBusy(false);
    }
  }
  async function signOut(all = false) {
    setBusy(true);
    setError("");
    try {
      await (all ? logoutAll() : logout());
      navigate("/login");
    } catch (failure) {
      const message = getApiErrorMessage(
        failure,
        "Не удалось выйти из аккаунта. Попробуйте ещё раз.",
      );
      if (editor) setError(message);
      else setNotice(message);
    } finally {
      setBusy(false);
    }
  }
  const publicPath = `/p/${profile.publicSlug}`;
  const publicUrl = `${window.location.origin}${publicPath}`;
  const displayUrl = `mindresearch.pro${publicPath}`;
  const titles: Record<NonNullable<Editor>, string> = {
    details: "Редактировать профиль",
    avatar: "Выберите аватар",
    links: "Социальные сети и ссылки",
    password: "Сменить пароль",
    visibility: profile.isProfilePublic
      ? "Скрыть профиль?"
      : "Открыть публичный профиль?",
  };
  const actions = (label = "Сохранить изменения") => (
    <div className="dialog-actions">
      <Button htmlType="button" disabled={busy} onClick={close}>
        Отмена
      </Button>
      <Button htmlType="submit" type="primary" loading={busy} disabled={busy}>
        {label}
      </Button>
    </div>
  );
  const errorMessage = error && (
    <p className="form-error" role="alert">
      {error}
    </p>
  );

  return (
    <PlatformLayout>
      <ProfileSurface>
        <header className="page-heading">
          <h1>Профиль</h1>
          <p>Ваши данные и страница автора исследований.</p>
        </header>
        {loading ? (
          <SkeletonScreen variant="form" />
        ) : loadError ? (
          <div className="load-error" role="alert">
            <p>{loadError}</p>
            <Button onClick={() => void load()}>Повторить</Button>
          </div>
        ) : (
          <article className="profile-card" aria-label="Ваш профиль">
            <div className="identity">
              <div className="avatar-wrap">
                <StockAvatar seed={profile.avatarSeed} alt="Аватар профиля" />
                <button
                  className="avatar-edit"
                  type="button"
                  aria-label="Изменить аватар"
                  onClick={() => open("avatar")}
                  disabled={busy}
                >
                  <Pencil size={16} />
                </button>
              </div>
              <div className="identity-copy">
                <h2>{profile.name}</h2>
                <p className={profile.bio ? "bio" : "bio empty"}>
                  <LinkedBio
                    text={
                      profile.bio ||
                      "Расскажите о себе, чтобы участники могли познакомиться с автором исследования."
                    }
                  />
                </p>
              </div>
              <Button
                className="edit-details"
                onClick={() => open("details")}
                disabled={busy}
              >
                <Pencil size={15} />
                Редактировать
              </Button>
            </div>
            <dl className="profile-facts">
              <div>
                <dt>Электронная почта</dt>
                <dd>
                  <Mail size={16} aria-hidden="true" />
                  <span>{profile.email}</span>
                </dd>
                <small>Видна только вам</small>
              </div>
              <div>
                <dt>Публичный юзернейм</dt>
                <dd>
                  <span>
                    {profile.publicSlug
                      ? `@${profile.publicSlug}`
                      : "Не указан"}
                  </span>
                </dd>
                <small>Используется в адресе страницы</small>
              </div>
              <div className="public-address">
                <dt>Ссылка на профиль</dt>
                <dd>
                  {profile.publicSlug ? (
                    <>
                      <span className="address">
                        {profile.isProfilePublic ? (
                          <a href={publicPath} target="_blank" rel="noreferrer">
                            {displayUrl}
                            <ExternalLink size={14} />
                          </a>
                        ) : (
                          displayUrl
                        )}
                      </span>
                      <button
                        type="button"
                        className="icon-action"
                        aria-label={
                          copied
                            ? "Ссылка скопирована"
                            : "Скопировать ссылку на профиль"
                        }
                        disabled={busy}
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(publicUrl);
                            setCopied(true);
                          } catch {
                            setNotice(
                              "Не удалось скопировать ссылку. Её можно выделить вручную.",
                            );
                          }
                        }}
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </>
                  ) : (
                    <span>Укажите юзернейм в редактировании</span>
                  )}
                </dd>
                <small>
                  {profile.isProfilePublic
                    ? "Страница доступна по этой ссылке"
                    : "Ссылка заработает, когда вы откроете профиль"}
                </small>
              </div>
            </dl>
            <section
              className="links-section"
              aria-labelledby="profile-links-heading"
            >
              <div className="section-heading">
                <h3 id="profile-links-heading">Социальные сети и ссылки</h3>
                <button
                  type="button"
                  className="text-action"
                  onClick={() => open("links")}
                  disabled={busy}
                >
                  <Pencil size={14} />
                  Изменить ссылки
                </button>
              </div>
              <ProfileLinks value={profile.profileLinks} />
              {!profile.profileLinks.links.length &&
                !socialNetworks.some((n) => profile.profileLinks[n.key]) && (
                  <p className="empty-links">
                    Добавьте соцсети, личный сайт или профессиональную страницу.
                  </p>
                )}
            </section>
            <section
              className="visibility"
              aria-labelledby="visibility-heading"
            >
              <div className="visibility-description">
                <div className="visibility-heading">
                  {profile.isProfilePublic ? (
                    <Globe2 size={18} />
                  ) : (
                    <Lock size={18} />
                  )}
                  <h3 id="visibility-heading">Публичный профиль</h3>
                </div>
                <p>
                  {profile.isProfilePublic
                    ? "Вашу страницу и открытые опросы может увидеть любой, у кого есть ссылка."
                    : "Ваша страница скрыта. Опросы по прямым ссылкам остаются доступны участникам."}
                </p>
              </div>
              <button
                className="visibility-switch"
                type="button"
                role="switch"
                aria-checked={profile.isProfilePublic}
                aria-label="Публичный профиль"
                disabled={busy}
                onClick={() => open("visibility")}
              >
                <span />
              </button>
            </section>
            <footer className="account-actions">
              <button
                className="text-action"
                type="button"
                disabled={busy}
                onClick={() => open("password")}
              >
                <KeyRound size={17} />
                Сменить пароль
              </button>
              <button
                className="text-action logout-action"
                type="button"
                disabled={busy}
                onClick={() => void signOut()}
              >
                <LogOut size={17} />
                Выйти из аккаунта
              </button>
            </footer>
          </article>
        )}
        <div className="save-notice" role="status" aria-live="polite">
          {notice && (
            <>
              <Check size={16} />
              {notice}
            </>
          )}
        </div>
      </ProfileSurface>
      <ProfileDialog
        open={editor !== null}
        title={editor ? titles[editor] : ""}
        onCancel={close}
        footer={null}
        centered
        width={editor === "links" ? 680 : 560}
        closable={!busy}
        maskClosable={!busy}
        keyboard={!busy}
      >
        <DialogBody data-analytics-private>
          {editor === "details" && (
            <form onSubmit={saveDetails}>
              <p className="dialog-intro">
                Эти данные появятся на вашей странице автора.
              </p>
              <fieldset disabled={busy}>
                <label htmlFor="profile-name">Имя</label>
                <FieldInput
                  id="profile-name"
                  autoFocus
                  required
                  minLength={2}
                  maxLength={120}
                  value={draft.name}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, name: e.target.value }))
                  }
                />
                <label htmlFor="profile-bio">О себе</label>
                <TextAreaField
                  id="profile-bio"
                  rows={4}
                  maxLength={3000}
                  value={draft.bio ?? ""}
                  placeholder="Специализация, образование, профессиональные интересы"
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, bio: e.target.value }))
                  }
                />
                <label htmlFor="profile-slug">Публичный юзернейм</label>
                <div className="slug-field">
                  <span>/p/</span>
                  <FieldInput
                    id="profile-slug"
                    required
                    minLength={3}
                    maxLength={120}
                    pattern="[a-z0-9-]+"
                    value={draft.publicSlug ?? ""}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        publicSlug: translit(e.target.value),
                      }))
                    }
                  />
                </div>
                <p className="field-hint">
                  От 3 символов: латинские буквы, цифры и дефис. Изменение
                  юзернейма изменит ссылку на профиль.
                </p>
              </fieldset>
              {errorMessage}
              {actions()}
            </form>
          )}
          {editor === "avatar" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void saveProfile(
                  { avatarSeed: draft.avatarSeed },
                  "Аватар обновлён",
                );
              }}
            >
              <p className="dialog-intro">
                Выберите иллюстрацию для своего профиля.
              </p>
              <div className="avatar-preview">
                <StockAvatar seed={draft.avatarSeed} alt="Выбранный аватар" />
              </div>
              <Avatars>
                {avatarSeeds.map((seed, index) => (
                  <button
                    key={seed}
                    type="button"
                    disabled={busy}
                    className={draft.avatarSeed === seed ? "selected" : ""}
                    aria-label={`Аватар ${index + 1}`}
                    aria-pressed={draft.avatarSeed === seed}
                    onClick={() =>
                      setDraft((p) => ({ ...p, avatarSeed: seed }))
                    }
                  >
                    <StockAvatar seed={seed} />
                  </button>
                ))}
              </Avatars>
              {errorMessage}
              {actions("Сохранить аватар")}
            </form>
          )}
          {editor === "links" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void saveProfile(
                  { profileLinks: draft.profileLinks },
                  "Ссылки обновлены",
                );
              }}
            >
              <p className="dialog-intro">
                Помогите участникам найти вас. Ссылки появятся в публичном
                профиле.
              </p>
              <fieldset disabled={busy}>
                <div className="social-fields">
                  {socialNetworks.map((network) => (
                    <div key={network.key}>
                      <label htmlFor={`profile-${network.key}`}>
                        {network.label}
                      </label>
                      <FieldInput
                        id={`profile-${network.key}`}
                        value={draft.profileLinks[network.key] ?? ""}
                        maxLength={2048}
                        placeholder={network.placeholder}
                        onChange={(e) =>
                          updateLinks({
                            ...draft.profileLinks,
                            [network.key]: e.target.value,
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
                <div className="custom-links-heading">
                  <h3>Другие ссылки</h3>
                  <span>До пяти ссылок</span>
                </div>
                {draft.profileLinks.links.map((link, index) => (
                  <div className="custom-link" key={index}>
                    <div>
                      <label htmlFor={`link-label-${index}`}>Название</label>
                      <FieldInput
                        id={`link-label-${index}`}
                        required
                        maxLength={80}
                        value={link.label}
                        placeholder="Профиль на b17"
                        onChange={(e) =>
                          updateLinks({
                            ...draft.profileLinks,
                            links: draft.profileLinks.links.map((item, i) =>
                              i === index
                                ? { ...item, label: e.target.value }
                                : item,
                            ),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label htmlFor={`link-url-${index}`}>Ссылка</label>
                      <FieldInput
                        id={`link-url-${index}`}
                        required
                        maxLength={2048}
                        value={link.url}
                        placeholder="https://"
                        onChange={(e) =>
                          updateLinks({
                            ...draft.profileLinks,
                            links: draft.profileLinks.links.map((item, i) =>
                              i === index
                                ? { ...item, url: e.target.value }
                                : item,
                            ),
                          })
                        }
                      />
                    </div>
                    <button
                      type="button"
                      className="icon-action"
                      aria-label={`Удалить ссылку ${index + 1}`}
                      onClick={() =>
                        updateLinks({
                          ...draft.profileLinks,
                          links: draft.profileLinks.links.filter(
                            (_, i) => i !== index,
                          ),
                        })
                      }
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                ))}
                {draft.profileLinks.links.length < 5 && (
                  <button
                    className="text-action add-link"
                    type="button"
                    onClick={() =>
                      updateLinks({
                        ...draft.profileLinks,
                        links: [
                          ...draft.profileLinks.links,
                          { label: "", url: "" },
                        ],
                      })
                    }
                  >
                    <Plus size={16} />
                    Добавить ссылку
                  </button>
                )}
              </fieldset>
              {errorMessage}
              {actions("Сохранить ссылки")}
            </form>
          )}
          {editor === "visibility" && (
            <>
              <div className="confirm-symbol">
                {profile.isProfilePublic ? (
                  <Lock size={26} />
                ) : (
                  <Globe2 size={26} />
                )}
              </div>
              <p className="confirm-copy">
                {profile.isProfilePublic
                  ? "Ваша страница автора станет недоступна посетителям. Опросы по прямым ссылкам продолжат работать, а собранные ответы сохранятся."
                  : "Любой, у кого есть ссылка, сможет увидеть ваше имя, аватар, описание, социальные сети и открытые опросы. Электронная почта останется скрытой."}
              </p>
              {!profile.isProfilePublic && (
                <div className="confirm-url">
                  <Link2 size={16} />
                  <span>{displayUrl}</span>
                </div>
              )}
              {errorMessage}
              <div className="dialog-actions">
                <Button disabled={busy} onClick={close}>
                  Отмена
                </Button>
                <Button
                  type="primary"
                  loading={busy}
                  disabled={busy}
                  onClick={() =>
                    void saveProfile(
                      { isProfilePublic: !profile.isProfilePublic },
                      profile.isProfilePublic
                        ? "Профиль скрыт"
                        : "Профиль теперь доступен всем по ссылке",
                    )
                  }
                >
                  {profile.isProfilePublic
                    ? "Скрыть профиль"
                    : "Открыть профиль"}
                </Button>
              </div>
            </>
          )}
          {editor === "password" && (
            <form onSubmit={changePassword}>
              <p className="dialog-intro">
                Введите текущий пароль и задайте новый.
              </p>
              <fieldset disabled={busy}>
                <label htmlFor="current-password">Текущий пароль</label>
                <FieldInput
                  id="current-password"
                  type="password"
                  autoFocus
                  required
                  autoComplete="current-password"
                  value={passwords.currentPassword}
                  onChange={(e) =>
                    setPasswords((p) => ({
                      ...p,
                      currentPassword: e.target.value,
                    }))
                  }
                />
                <label htmlFor="new-password">Новый пароль</label>
                <FieldInput
                  id="new-password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords((p) => ({ ...p, newPassword: e.target.value }))
                  }
                />
                <p className="field-hint">Не менее 8 символов.</p>
                <label htmlFor="confirm-password">Повторите новый пароль</label>
                <FieldInput
                  id="confirm-password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={passwords.confirmation}
                  onChange={(e) =>
                    setPasswords((p) => ({
                      ...p,
                      confirmation: e.target.value,
                    }))
                  }
                />
              </fieldset>
              {errorMessage}
              {actions("Изменить пароль")}
              <button
                className="text-action logout-everywhere"
                type="button"
                disabled={busy}
                onClick={() => void signOut(true)}
              >
                <LogOut size={15} />
                Выйти на всех устройствах
              </button>
            </form>
          )}
        </DialogBody>
      </ProfileDialog>
    </PlatformLayout>
  );
}
