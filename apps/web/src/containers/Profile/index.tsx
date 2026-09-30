import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ExternalLink, Globe2, KeyRound, Lock } from "lucide-react";
import {
  api,
  getCurrentUser,
  invalidateCurrentUser,
  logoutAll,
  setAccessToken,
  useDemoFallbacks,
} from "../../api";
import { Button } from "../../ui";
import { getApiErrorMessage } from "../../utils/apiErrors";
import { FieldInput } from "../../components/FieldInput";
import { TextAreaField } from "../../components/TextAreaField";
import { demoUser } from "../../platform/demo";
import { avatarSeeds, StockAvatar } from "../../components/StockAvatar";
import { PlatformLayout } from "../PlatformLayout";

import { SkeletonScreen } from "../../ui";
import type { Profile } from "./types";
import { translit } from "./const";
import { Layout, Column, Form, PasswordForm, Avatars, Preview } from "./styles";
export function ProfilePage() {
  const initial = (
    useDemoFallbacks
      ? { ...demoUser, avatarSeed: "willow" }
      : {
          name: "",
          email: "",
          role: "",
          bio: "",
          avatarSeed: "willow",
          publicSlug: "",
          isProfilePublic: false,
        }
  ) as Profile;
  const nav = useNavigate();
  const [profile, setProfile] = useState<Profile>(initial),
    [loading, setLoading] = useState(true),
    [saved, setSaved] = useState(false),
    [error, setError] = useState("");
  const [passwordOpen, setPasswordOpen] = useState(false),
    [passwords, setPasswords] = useState({
      currentPassword: "",
      newPassword: "",
      confirmation: "",
    }),
    [passwordMessage, setPasswordMessage] = useState(""),
    [passwordError, setPasswordError] = useState(""),
    [passwordSaving, setPasswordSaving] = useState(false);
  useEffect(() => {
    getCurrentUser()
      .then((data) =>
        setProfile({
          ...data,
          avatarSeed: data.avatarSeed || "willow",
          isProfilePublic: Boolean(data.isProfilePublic),
        } as Profile),
      )
      .catch(() => {
        if (!useDemoFallbacks)
          setError("Не удалось загрузить профиль с сервера.");
      })
      .finally(() => setLoading(false));
  }, []);
  if (loading)
    return (
      <PlatformLayout>
        <SkeletonScreen variant="form" />
      </PlatformLayout>
    );
  const set = <K extends keyof Profile>(key: K, value: Profile[K]) =>
    setProfile((p) => ({ ...p, [key]: value }));
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await api.patch("/account/me", profile);
      invalidateCurrentUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: unknown) {
      if (useDemoFallbacks) {
        setSaved(true);
        return;
      }
      setError(getApiErrorMessage(err, "Не удалось сохранить"));
    }
  }
  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");
    setPasswordMessage("");
    if (passwords.newPassword !== passwords.confirmation) {
      setPasswordError("Новые пароли не совпадают");
      return;
    }
    setPasswordSaving(true);
    try {
      const response = await api.patch("/account/password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setAccessToken(response.data.token);
      setPasswords({ currentPassword: "", newPassword: "", confirmation: "" });
      setPasswordMessage("Пароль изменён");
    } catch (err: unknown) {
      setPasswordError(getApiErrorMessage(err, "Не удалось изменить пароль"));
    } finally {
      setPasswordSaving(false);
    }
  }
  return (
    <PlatformLayout>
      <Layout>
        <Column>
          <Form>
            <h1>Профиль</h1>
            <p className="intro">
              Информация об авторе исследования и публичная страница.
            </p>
            <form onSubmit={save}>
              <label>Имя</label>
              <FieldInput
                value={profile.name}
                onChange={(e) => set("name", e.target.value)}
                required
              />
              <label>Выберите аватар</label>
              <Avatars>
                {avatarSeeds.map((seed) => (
                  <Button
                    type="button"
                    className={profile.avatarSeed === seed ? "active" : ""}
                    aria-label={`Выбрать аватар ${seed}`}
                    onClick={() => set("avatarSeed", seed)}
                    key={seed}
                  >
                    <StockAvatar seed={seed} />
                  </Button>
                ))}
              </Avatars>
              <label>О себе</label>
              <TextAreaField
                value={profile.bio ?? ""}
                onChange={(e) => set("bio", e.target.value)}
                placeholder="Образование, специализация, профессиональные интересы…"
              />
              <label>Адрес публичной страницы</label>
              <div className="slug">
                /p/
                <FieldInput
                  value={profile.publicSlug ?? ""}
                  onChange={(e) => set("publicSlug", translit(e.target.value))}
                />
              </div>
              <label className="switch">
                <FieldInput
                  type="checkbox"
                  checked={profile.isProfilePublic}
                  onChange={(e) => set("isProfilePublic", e.target.checked)}
                />
                <div>
                  <b>
                    {profile.isProfilePublic
                      ? "Профиль опубликован"
                      : "Профиль скрыт"}
                  </b>
                  <span>
                    {profile.isProfilePublic
                      ? "Участники смогут открыть страницу автора."
                      : "Страница доступна только вам."}
                  </span>
                </div>
              </label>
              {error && <p className="error">{error}</p>}
              <Button type="submit">Сохранить</Button>
              {saved && (
                <span className="saved">
                  <Check size={13} /> Сохранено
                </span>
              )}
            </form>
          </Form>
          <PasswordForm>
            <h2>
              <KeyRound size={21} /> Безопасность
            </h2>
            {!passwordOpen ? (
              <Button
                className="open-password"
                type="button"
                onClick={() => setPasswordOpen(true)}
              >
                Сменить пароль
              </Button>
            ) : (
              <>
                <p className="intro">
                  Введите текущий пароль и дважды укажите новый.
                </p>
                <form className="password-form" onSubmit={changePassword}>
                  <label>Текущий пароль</label>
                  <FieldInput
                    type="password"
                    value={passwords.currentPassword}
                    onChange={(e) =>
                      setPasswords((x) => ({
                        ...x,
                        currentPassword: e.target.value,
                      }))
                    }
                    required
                    autoComplete="current-password"
                  />
                  <label>Новый пароль — минимум 8 символов</label>
                  <FieldInput
                    type="password"
                    minLength={8}
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords((x) => ({
                        ...x,
                        newPassword: e.target.value,
                      }))
                    }
                    required
                    autoComplete="new-password"
                  />
                  <label>Повторите новый пароль</label>
                  <FieldInput
                    type="password"
                    minLength={8}
                    value={passwords.confirmation}
                    onChange={(e) =>
                      setPasswords((x) => ({
                        ...x,
                        confirmation: e.target.value,
                      }))
                    }
                    required
                    autoComplete="new-password"
                  />
                  {passwordError && <p className="error">{passwordError}</p>}
                  {passwordMessage && (
                    <p className="saved">
                      <Check size={13} /> {passwordMessage}
                    </p>
                  )}
                  <div className="password-actions">
                    <Button disabled={passwordSaving}>
                      {passwordSaving ? "Сохраняем…" : "Изменить пароль"}
                    </Button>
                    <Button
                      className="cancel"
                      type="button"
                      onClick={() => setPasswordOpen(false)}
                    >
                      Отмена
                    </Button>
                  </div>
                </form>
              </>
            )}
            <Button
              className="logout-all"
              type="button"
              onClick={async () => {
                await logoutAll();
                nav("/login");
              }}
            >
              Выйти на всех устройствах
            </Button>
          </PasswordForm>
        </Column>
        <Preview>
          <div className="avatar">
            <StockAvatar seed={profile.avatarSeed} alt="Аватар профиля" />
          </div>
          <h2>{profile.name || "Имя автора"}</h2>
          <p>
            {profile.bio || "Здесь появится информация об авторе исследования."}
          </p>
          <span className="badge">
            {profile.isProfilePublic ? (
              <>
                <Globe2 size={12} /> Публичный профиль
              </>
            ) : (
              <>
                <Lock size={12} /> Видите только вы
              </>
            )}
          </span>
          {profile.isProfilePublic && profile.publicSlug ? (
            <p>
              <a
                href={`/p/${profile.publicSlug}`}
                target="_blank"
                rel="noreferrer"
              >
                Открыть страницу <ExternalLink size={12} />
              </a>
            </p>
          ) : null}
        </Preview>
      </Layout>
    </PlatformLayout>
  );
}
