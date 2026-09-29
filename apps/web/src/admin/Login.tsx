import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ArrowRight, Leaf } from "lucide-react";
import { api, setAccessToken } from "../api";
import { Button, Card, Page } from "../ui";
import { PasswordInput } from "../platform/PasswordInput";

const LoginPage = styled(Page)`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 28px 16px;
`;

const Box = styled(Card)`
  width: min(100%, 468px);
  margin: auto;
  padding: clamp(28px, 6vw, 44px);
  border-radius: 22px;
  background: rgba(255, 255, 255, .88);
  box-shadow: 0 24px 70px rgba(48, 70, 54, .09);

  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #486650;
    font-weight: 800;
    font-size: 18px;
    letter-spacing: -.025em;
    margin-bottom: 30px;
  }
  .brand svg { width: 27px; height: 27px; stroke-width: 1.8; }
  .eyebrow {
    margin: 0 0 8px;
    color: #7b897f;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: .11em;
    text-transform: uppercase;
  }
  h1 {
    font: 500 clamp(32px, 7vw, 39px)/1.15 var(--font-heading), Georgia, serif;
    color: #304a38;
    letter-spacing: -.025em;
    margin: 0 0 27px;
  }
  form { display: grid; gap: 0; }
  .field { display: grid; gap: 8px; margin-bottom: 19px; }
  label { color: #586a5e; font-size: 12px; font-weight: 700; }
  input {
    display: block;
    width: 100%;
    height: 53px;
    min-width: 0;
    padding: 0 15px;
    border: 1px solid #d2ddd2;
    border-radius: 11px;
    background: #fff;
    color: #26382f;
    font-size: 15px;
    line-height: 1.3;
    box-shadow: inset 0 1px 2px rgba(38, 56, 47, .025);
    outline: none;
    transition: border-color .16s ease, box-shadow .16s ease, background .16s ease;
  }
  input::placeholder { color: #9aa59d; }
  input:hover { border-color: #b9cbb9; }
  input:focus {
    border-color: #78947e;
    background: #fffefa;
    box-shadow: 0 0 0 3px rgba(95, 128, 104, .12);
  }
  .forgot {
    justify-self: start;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin: -5px 0 3px;
    color: #526e59;
    font-size: 12px;
    font-weight: 650;
    text-decoration-color: #aab8aa;
    text-underline-offset: 3px;
  }
  .forgot svg { transition: transform .16s ease; }
  .forgot:hover svg { transform: translateX(2px); }
  form > button { width: 100%; margin-top: 19px; border-radius: 11px; }
  .error { margin: 10px 0 0; color: #a05252; font-size: 13px; }
  .bottom {
    color: #78847c;
    font-size: 12px;
    line-height: 1.5;
    text-align: center;
    margin: 23px 0 0;
  }
  .bottom a { color: #47644f; font-weight: 700; text-underline-offset: 3px; }
  @media (max-width: 480px) {
    padding: 28px 23px;
    border-radius: 18px;
    .brand { margin-bottom: 24px; }
  }
`;

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    try {
      const response = await api.post("/auth/login", { email, password });
      setAccessToken(response.data.token);
      nav("/app");
    } catch {
      setError("Не удалось войти. Проверьте данные.");
    }
  }

  return (
    <LoginPage>
      <Box>
        <div className="brand"><Leaf aria-hidden="true" /> <span>mindresearch</span></div>
        <p className="eyebrow">Рабочее пространство исследователя</p>
        <h1>Личный кабинет</h1>
        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="login-email">Электронная почта</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="login-password">Пароль</label>
            <PasswordInput
              id="login-password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <Link className="forgot" to="/forgot-password">
            Забыли пароль? <ArrowRight size={13} aria-hidden="true" />
          </Link>
          {error && <p className="error" role="alert">{error}</p>}
          <Button type="submit">Войти</Button>
        </form>
        <p className="bottom">Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
      </Box>
    </LoginPage>
  );
}
