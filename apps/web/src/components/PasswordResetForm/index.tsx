import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '../Button';
import { PasswordField } from '../PasswordField';
import { TextField } from '../TextField';
import { passwordResetCopy as copy } from './const';
import type { ForgotPasswordFormProps, ResetPasswordFormProps } from './types';
import { FormContent, ResetForm } from './styles';

export function ForgotPasswordForm({ email, message, error, sending, onEmailChange, onSubmit }: ForgotPasswordFormProps) {
  return <FormContent>
    {message ? <p className="message"><CheckCircle2 size={16} /><span>{message}</span></p> : <ResetForm onSubmit={onSubmit}>
      <label htmlFor="forgot-email">{copy.emailLabel}</label>
      <TextField id="forgot-email" type="email" value={email} onChange={(event) => onEmailChange(event.target.value)} autoComplete="email" required autoFocus />
      {error && <p className="error">{error}</p>}
      <Button type="primary" htmlType="submit" disabled={sending}>{sending ? copy.sendingButton : copy.sendButton}</Button>
    </ResetForm>}
    <Link className="back" to="/login">Вернуться ко входу</Link>
  </FormContent>;
}

export function ResetPasswordForm({ tokenExists, password, confirmation, error, saved, saving, onPasswordChange, onConfirmationChange, onSubmit }: ResetPasswordFormProps) {
  return <FormContent>
    {saved ? <p className="message"><CheckCircle2 size={16} /><span>{copy.savedMessage}</span></p> : <>
      <p>Придумайте новый пароль длиной не менее восьми символов.</p>
      <ResetForm onSubmit={onSubmit}>
        <label htmlFor="new-password">{copy.passwordLabel}</label>
        <PasswordField id="new-password" minLength={8} value={password} onChange={(event) => onPasswordChange(event.target.value)} autoComplete="new-password" required autoFocus />
        <label htmlFor="confirm-password">{copy.confirmationLabel}</label>
        <PasswordField id="confirm-password" minLength={8} value={confirmation} onChange={(event) => onConfirmationChange(event.target.value)} autoComplete="new-password" required />
        {!tokenExists && <p className="error">{copy.missingToken}</p>}
        {error && <p className="error">{error}</p>}
        <Button type="primary" htmlType="submit" disabled={saving || !tokenExists}>{saving ? copy.savingButton : copy.saveButton}</Button>
      </ResetForm>
    </>}
    <Link className="back" to="/login">Вернуться ко входу</Link>
  </FormContent>;
}
