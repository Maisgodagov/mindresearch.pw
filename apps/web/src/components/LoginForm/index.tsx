import { Link } from 'react-router-dom';
import { ArrowRight, Leaf } from 'lucide-react';
import { Button } from '../Button';
import { PasswordField } from '../PasswordField';
import { TextField } from '../TextField';
import { loginFormCopy as copy } from './const';
import type { LoginFormProps } from './types';
import { LoginCard, LoginPage } from './styles';

export function LoginForm({ email, password, error, onEmailChange, onPasswordChange, onSubmit }: LoginFormProps) {
  return <LoginPage>
    <LoginCard>
      <div className="brand"><Leaf aria-hidden="true" /><span>{copy.brand}</span></div>
      <p className="eyebrow">{copy.eyebrow}</p>
      <h1>{copy.title}</h1>
      <form onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="login-email">{copy.email}</label>
          <TextField id="login-email" type="email" autoComplete="email" value={email} onChange={(event) => onEmailChange(event.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="login-password">{copy.password}</label>
          <PasswordField id="login-password" autoComplete="current-password" value={password} onChange={(event) => onPasswordChange(event.target.value)} required />
        </div>
        <Link className="forgot" to="/forgot-password">{copy.forgot}<ArrowRight size={13} aria-hidden="true" /></Link>
        {error && <p className="error" role="alert">{error}</p>}
        <Button type="primary" htmlType="submit">{copy.submit}</Button>
      </form>
      <p className="bottom">{copy.registerPrompt} <Link to="/register">{copy.register}</Link></p>
    </LoginCard>
  </LoginPage>;
}
