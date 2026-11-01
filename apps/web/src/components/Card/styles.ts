import styled from 'styled-components';
import { Card as AntCard } from 'antd';

export const StyledCard = styled(AntCard)`
  border-color: var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
  box-shadow: none;
  & > .ant-card-body { padding: 0; }
`;
