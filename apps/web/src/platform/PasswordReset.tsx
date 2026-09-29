import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { CheckCircle2, Leaf } from "lucide-react";
import { api } from "../api";
import { Button, Card, Page } from "../ui";
import { PasswordInput } from "./PasswordInput";

const Box = styled(Card)`
  width: min(100% - 32px, 450px);
  margin: 10vh auto;
  padding: 40px;
  .brand { display:flex; align-items:center; gap:9px; color:#486650; font-size:19px; font-weight:850; margin-bottom:28px; }
  .brand svg { width:27px; height:27px; }
  h1 { font:500 34px var(--font-heading),serif; color:#304a38; margin:0 0 10px; }
  p { color:#718077; font-size:13px; line-height:1.55; }
  label { display:block; color:#657269; font-size:13px; margin:18px 0 7px; }
  input { width:100%; padding:14px; border:1px solid #d2ddd2; border-radius:13px; background:#fff; outline:none; &:focus { border-color:#6f8f77; box-shadow:0 0 0 3px rgba(95,128,104,.1); } }
  form > button { width:100%; margin-top:22px; }
  .message { display:flex; align-items:flex-start; gap:8px; padding:13px; border-radius:11px; background:#eaf2e7; color:#4d7057; }
  .message svg { flex:none; margin-top:2px; }
  .error { color:#a05252; }
  .back { display:block; text-align:center; margin-top:18px; color:#58705f; font-size:13px; }
`;

const Brand = () => <div className="brand"><Leaf aria-hidden="true" /> mindresearch</div>;

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSending(true);
    setError("");
    try {
      const response = await api.post("/auth/forgot-password", { email });
      setMessage(response.data.message);
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Не удалось отправить письмо");
    } finally {
      setSending(false);
    }
  }

  return (
    <Page>
      <Box>
        <Brand />
        <h1>Восстановление пароля</h1>
        <p>Укажите почту аккаунта. Мы отправим одноразовую ссылку, которая действует 30 минут.</p>
        {message ? (
          <p className="message"><CheckCircle2 size={16} /><span>{message}</span></p>
        ) : (
          <form onSubmit={submit}>
            <label htmlFor="forgot-email">Электронная почта</label>
            <input id="forgot-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required autoFocus />
            {error && <p className="error">{error}</p>}
            <Button disabled={sending}>{sending ? "Отправляем…" : "Отправить ссылку"}</Button>
          </form>
        )}
        <Link className="back" to="/login">Вернуться ко входу</Link>
      </Box>
    </Page>
  );
}

export function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (password !== confirmation) {
      setError("Пароли не совпадают");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await api.post("/auth/reset-password", { token, password });
      setSaved(true);
      setTimeout(() => nav("/login"), 1800);
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Не удалось изменить пароль");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Page>
      <Box>
        <Brand />
        <h1>Новый пароль</h1>
        {saved ? (
          <p className="message"><CheckCircle2 size={16} /><span>Пароль изменён. Сейчас вы перейдёте ко входу.</span></p>
        ) : (
          <>
            <p>Придумайте новый пароль длиной не менее восьми символов.</p>
            <form onSubmit={submit}>
              <label htmlFor="new-password">Новый пароль</label>
              <PasswordInput id="new-password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" required autoFocus />
              <label htmlFor="confirm-password">Повторите пароль</label>
              <PasswordInput id="confirm-password" minLength={8} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} autoComplete="new-password" required />
              {!token && <p className="error">В ссылке отсутствует код восстановления.</p>}
              {error && <p className="error">{error}</p>}
              <Button disabled={saving || !token}>{saving ? "Сохраняем…" : "Сохранить пароль"}</Button>
            </form>
          </>
        )}
        <Link className="back" to="/login">Вернуться ко входу</Link>
      </Box>
    </Page>
  );
}
