import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { BarChart3, ClipboardList, Leaf, ShieldCheck } from "lucide-react";
import { api, setAccessToken } from "../api";
import { Button, Card, Page } from "../ui";
import { PasswordInput } from "./PasswordInput";

const RegisterPage = styled(Page)`
  min-height: 100dvh;
  display: grid;
  align-items: center;
  padding: 28px 0;
`;

const Shell = styled.div`
  width: min(100% - 48px, 1080px);
  margin: auto;
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(390px, .82fr);
  align-items: center;
  gap: clamp(34px, 6vw, 86px);
  @media (max-width: 820px) {
    width: min(100% - 36px, 520px);
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const Intro = styled.div`
  padding: 12px 0;
  .brand {
    display: flex;
    align-items: center;
    gap: 11px;
    color: #47634f;
    font-size: 19px;
    font-weight: 800;
    letter-spacing: -.025em;
    margin-bottom: clamp(32px, 5vw, 58px);
  }
  .brand svg { width: 30px; height: 30px; stroke-width: 1.8; }
  .eyebrow {
    color: #748478;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: .12em;
    text-transform: uppercase;
    margin: 0 0 13px;
  }
  h1 {
    max-width: 640px;
    font: 500 clamp(39px, 5.2vw, 61px)/1.06 var(--font-heading), Georgia, serif;
    color: #2d4635;
    letter-spacing: -.035em;
    margin: 0 0 20px;
  }
  .intro-copy {
    max-width: 555px;
    font-size: 15px;
    color: #67766c;
    line-height: 1.7;
    margin: 0;
  }
  .features {
    display: grid;
    gap: 0;
    margin-top: 27px;
    max-width: 530px;
    border-top: 1px solid rgba(115, 139, 117, .22);
  }
  .feature {
    display: grid;
    grid-template-columns: 22px 1fr;
    gap: 12px;
    align-items: start;
    padding: 12px 0;
    border-bottom: 1px solid rgba(115, 139, 117, .22);
    color: #4f6255;
    font-size: 13px;
    line-height: 1.5;
  }
  .feature svg { color: #64816b; margin-top: 1px; }
  @media (max-width: 820px) {
    padding: 0;
    .brand { margin-bottom: 22px; }
    h1 { max-width: 560px; font-size: clamp(34px, 8vw, 48px); }
    .intro-copy { font-size: 14px; }
    .features { display: none; }
  }
`;

const Box = styled(Card)`
  padding: clamp(25px, 4vw, 38px);
  border-radius: 21px;
  background: rgba(255, 255, 255, .9);
  box-shadow: 0 24px 70px rgba(48, 70, 54, .085);

  .form-kicker {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #77867a;
    font-size: 11px;
    font-weight: 700;
    margin-bottom: 11px;
  }
  .form-kicker::before {
    content: "";
    width: 19px;
    height: 1px;
    background: #8da38c;
  }
  h2 {
    font: 500 29px/1.2 var(--font-heading), Georgia, serif;
    color: #304a38;
    letter-spacing: -.02em;
    margin: 0 0 23px;
  }
  form { display: grid; }
  .field { display: grid; gap: 7px; margin-bottom: 15px; }
  label { color: #586a5e; font-size: 12px; font-weight: 700; }
  label span { color: #8a968d; font-weight: 500; }
  input {
    display: block;
    width: 100%;
    height: 50px;
    min-width: 0;
    padding: 0 14px;
    border: 1px solid #d2ddd2;
    border-radius: 10px;
    background: #fff;
    color: #26382f;
    font-size: 14px;
    line-height: 1.3;
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
  .error { color: #a05252; font-size: 13px; line-height: 1.45; margin: 0 0 12px; }
  form > button { width: 100%; margin-top: 7px; border-radius: 10px; }
  .bottom { text-align: center; font-size: 12px; color: #748078; margin: 18px 0 0; }
  .bottom a { color: #47644f; font-weight: 700; text-underline-offset: 3px; }
  @media (max-width: 820px) { padding: 25px; }
`;

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
      setError("Пароли не совпадают");
      return;
    }
    try {
      const response = await api.post("/auth/register", { name, email, password });
      setAccessToken(response.data.token);
      nav("/app");
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Не удалось зарегистрироваться");
    }
  }

  return (
    <RegisterPage>
      <Shell>
        <Intro>
          <div className="brand"><Leaf aria-hidden="true" /><span>mindresearch</span></div>
          <p className="eyebrow">Инструменты для исследований</p>
          <h1>Опросы, которые удобно создавать и проходить</h1>
          <p className="intro-copy">
            Собирайте исследования из проверенных психологических методик и собственных вопросов. Делитесь одной ссылкой, получайте ответы и изучайте результаты в понятном кабинете.
          </p>
          <div className="features">
            <div className="feature"><ShieldCheck size={18} /><span>Проверенные методики с прозрачными ключами и автоматическим расчётом</span></div>
            <div className="feature"><ClipboardList size={18} /><span>Гибкий конструктор авторских опросов</span></div>
            <div className="feature"><BarChart3 size={18} /><span>Статистика и экспорт результатов</span></div>
          </div>
        </Intro>
        <Box>
          <div className="form-kicker">Начните работу</div>
          <h2>Создать аккаунт</h2>
          <form onSubmit={submit}>
            <div className="field">
              <label htmlFor="register-name">Ваше имя</label>
              <input id="register-name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Как к вам обращаться" required />
            </div>
            <div className="field">
              <label htmlFor="register-email">Электронная почта</label>
              <input id="register-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" required />
            </div>
            <div className="field">
              <label htmlFor="register-password">Пароль <span>(минимум 8 символов)</span></label>
              <PasswordInput id="register-password" autoComplete="new-password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="register-confirm">Повторите пароль</label>
              <PasswordInput id="register-confirm" autoComplete="new-password" minLength={8} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required />
            </div>
            {error && <p className="error" role="alert">{error}</p>}
            <Button type="submit">Создать аккаунт</Button>
          </form>
          <p className="bottom">Уже есть аккаунт? <Link to="/login">Войти</Link></p>
        </Box>
      </Shell>
    </RegisterPage>
  );
}
