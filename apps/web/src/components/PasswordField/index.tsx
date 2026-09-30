import { passwordFieldDefaults } from "./const";
import type { Props } from "./types";
import { StyledPassword } from "./styles";

export function PasswordField({
  size = passwordFieldDefaults.size,
  ...props
}: Props) {
  return <StyledPassword size={size} {...props} />;
}

export type { Props as PasswordFieldProps } from "./types";
