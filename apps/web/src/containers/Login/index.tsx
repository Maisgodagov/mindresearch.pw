import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setAccessToken } from '../../api';
import { LoginForm } from '../../components/LoginForm';
import { loginContainerCopy } from './const';
import type { LoginResponse } from './types';

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    try {
      const response = await api.post<LoginResponse>("/auth/login", { email, password });
      setAccessToken(response.data.token);
      nav("/app");
    } catch {
      setError(loginContainerCopy.error);
    }
  }

  return <LoginForm email={email} password={password} error={error} onEmailChange={setEmail} onPasswordChange={setPassword} onSubmit={submit} />;
}
