import { textAreaDefaults } from './const';
import type { Props } from './types';
import { StyledTextArea } from './styles';

export function TextAreaField({ autoSize = textAreaDefaults.autoSize, ...props }: Props) {
  return <StyledTextArea autoSize={autoSize} {...props} />;
}

export type { Props as TextAreaFieldProps } from './types';
