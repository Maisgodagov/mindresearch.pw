import { textFieldDefaults } from './const';
import type { Props } from './types';
import { StyledInput } from './styles';

export function TextField({ size = textFieldDefaults.size, ...props }: Props) {
  return <StyledInput size={size} {...props} />;
}

export type { Props as TextFieldProps } from './types';
