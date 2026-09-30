import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BarChart3, ClipboardList, Leaf, ShieldCheck } from "lucide-react";
import { api, setAccessToken } from "../../api";
import { getApiErrorMessage } from "../../utils/apiErrors";
import { Button } from "../../ui";
import { PasswordField } from "../../components/PasswordField";
import { TextField } from "../../components/TextField";
import { RegisterPage, Shell, Intro, Box } from "./styles";
import type { RegistrationValues } from "./types";
import { registrationErrors } from "./const";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (password !== confirmation) {
      setError(registrationErrors.passwordMismatch);
      return;
    }
    try {
      const values: RegistrationValues = { name, email, password };
      const response = await api.post("/auth/register", values);
      setAccessToken(response.data.token);
      nav("/app");
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, registrationErrors.submitFailed));
    }
  }

  return (
    <RegisterPage>
      <Shell>
        <Intro>
          <div className="brand">
            <Leaf aria-hidden="true" />
            <span>mindresearch</span>
          </div>
          <p className="eyebrow">Инструменты для исследований</p>
          <h1>Опросы, которые удобно создавать и проходить</h1>
          <p className="intro-copy">
            Собирайте исследования из проверенных психологических методик и
            собственных вопросов. Делитесь одной ссылкой, получайте ответы и
            изучайте результаты в понятном кабинете.
          </p>
          <div className="features">
            <div className="feature">
              <ShieldCheck size={18} />
              <span>
                Проверенные методики с прозрачными ключами и автоматическим
                расчётом
              </span>
            </div>
            <div className="feature">
              <ClipboardList size={18} />
              <span>Гибкий конструктор авторских опросов</span>
            </div>
            <div className="feature">
              <BarChart3 size={18} />
              <span>Статистика и экспорт результатов</span>
            </div>
          </div>
        </Intro>
        <Box>
          <div className="form-kicker">Начните работу</div>
          <h2>Создать аккаунт</h2>
          <form onSubmit={submit}>
            <div className="field">
              <label htmlFor="register-name">Ваше имя</label>
              <TextField
                id="register-name"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Как к вам обращаться"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="register-email">Электронная почта</label>
              <TextField
                id="register-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="register-password">
                Пароль <span>(минимум 8 символов)</span>
              </label>
              <PasswordField
                id="register-password"
                autoComplete="new-password"
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="register-confirm">Повторите пароль</label>
              <PasswordField
                id="register-confirm"
                autoComplete="new-password"
                minLength={8}
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                required
              />
            </div>
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <Button type="primary" htmlType="submit">
              Создать аккаунт
            </Button>
          </form>
          <p className="bottom">
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </p>
        </Box>
      </Shell>
    </RegisterPage>
  );
}
