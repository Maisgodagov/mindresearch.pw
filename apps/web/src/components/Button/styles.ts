import styled from 'styled-components';
import { Button as AntButton } from 'antd';

export const StyledButton = styled(AntButton)`
  min-height: 44px;
  border-radius: var(--radius-control);
  padding-inline: 16px;
  font-weight: 600;
  box-shadow: none;
  &&.ant-btn-default:not(.ant-btn-dangerous) {
    color: var(--color-ink);
    background: var(--color-surface-muted);
    border-color: transparent;
  }
  &&.ant-btn-text { border: 0 !important; }
  transition: background-color 0.16s ease, border-color 0.16s ease, color 0.16s ease, box-shadow 0.16s ease;
`;
