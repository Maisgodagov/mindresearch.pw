import { cardDefaults } from './const';
import type { Props } from './types';
import { StyledCard } from './styles';

export function Card({ bordered = cardDefaults.bordered, ...props }: Props) {
  return <StyledCard bordered={bordered} {...props} />;
}

export type { Props as CardProps } from './types';
