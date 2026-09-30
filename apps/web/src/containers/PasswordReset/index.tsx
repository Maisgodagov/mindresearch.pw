import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Leaf } from "lucide-react";
import { api } from "../../api";
import { Page } from "../../ui";
import { ForgotPasswordForm, ResetPasswordForm } from "../../components/PasswordResetForm";
import { Box } from "./styles";
import { passwordResetDefaults } from "./const";
import type { PasswordResetApiError } from "./types";

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
    } catch (err) {
      setError((err as PasswordResetApiError).response?.data?.message ?? passwordResetDefaults.requestError);
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
        <ForgotPasswordForm email={email} message={message} error={error} sending={sending} onEmailChange={setEmail} onSubmit={submit} />
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
      setError(passwordResetDefaults.mismatchError);
      return;
    }
    setSaving(true);
    setError("");
    try {
      await api.post("/auth/reset-password", { token, password });
      setSaved(true);
      setTimeout(() => nav("/login"), passwordResetDefaults.redirectDelayMs);
    } catch (err) {
      setError((err as PasswordResetApiError).response?.data?.message ?? passwordResetDefaults.resetError);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Page>
      <Box>
        <Brand />
        <h1>Новый пароль</h1>
        <ResetPasswordForm tokenExists={Boolean(token)} password={password} confirmation={confirmation} error={error} saved={saved} saving={saving} onPasswordChange={setPassword} onConfirmationChange={setConfirmation} onSubmit={submit} />
      </Box>
    </Page>
  );
}
