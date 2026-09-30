import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf } from "lucide-react";
import { api, setAccessToken } from "../../api";
import { FieldInput } from "../../components/FieldInput";
import { PasswordField } from "../../components/PasswordField";
import { Button, Page } from "../../ui";
import { legacyLoginDefaults, legacyLoginError } from "./const";
import { LoginBox } from "./styles";
import type { LegacyLoginForm } from "./types";

export function LegacyLogin() {
  const [form, setForm] = useState<LegacyLoginForm>(legacyLoginDefaults);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      const { data } = await api.post<{ token: string }>("/auth/login", form);
      setAccessToken(data.token);
      navigate("/admin");
    } catch {
      setError(legacyLoginError);
    }
  }

  return (
    <Page>
      <LoginBox>
        <Leaf color="#58735f" />
        <h1>Панель исследования</h1>
        <form onSubmit={submit}>
          <label htmlFor="legacy-email">Электронная почта</label>
          <FieldInput id="legacy-email" type="email" value={form.email} onChange={(event) => setForm(current => ({ ...current, email: event.target.value }))} required />
          <label htmlFor="legacy-password">Пароль</label>
          <PasswordField id="legacy-password" value={form.password} onChange={(event) => setForm(current => ({ ...current, password: event.target.value }))} required />
          {error && <p className="error">{error}</p>}
          <Button type="primary">Войти</Button>
        </form>
      </LoginBox>
    </Page>
  );
}
