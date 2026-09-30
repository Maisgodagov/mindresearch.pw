import { buttonDefaults } from './const';
import type { Props } from './types';
import { StyledButton } from './styles';

export function Button({ type = buttonDefaults.type, htmlType, size = buttonDefaults.size, ...props }: Props) {
  const isNativeType = type === 'submit' || type === 'reset' || type === 'button';
  return <StyledButton type={isNativeType ? buttonDefaults.type : type} htmlType={htmlType ?? (isNativeType ? type : undefined)} size={size} {...props} />;
}

export type { Props as ButtonProps } from './types';
