import styled from 'styled-components';
import { Button as AntButton } from 'antd';

export const StyledButton = styled(AntButton)`
  min-height: 48px;
  border-radius: 12px;
  padding-inline: 20px;
  font-weight: 700;
  box-shadow: none;
  transition: background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease;
`;
