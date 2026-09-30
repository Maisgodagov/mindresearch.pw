import type { FormEvent } from 'react';

export type ForgotPasswordFormProps = {
  email: string;
  message: string;
  error: string;
  sending: boolean;
  onEmailChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export type ResetPasswordFormProps = {
  tokenExists: boolean;
  password: string;
  confirmation: string;
  error: string;
  saved: boolean;
  saving: boolean;
  onPasswordChange: (value: string) => void;
  onConfirmationChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};
