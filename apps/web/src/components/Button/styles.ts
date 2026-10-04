import styled from 'styled-components';
import { Button as AntButton } from 'antd';

export const StyledButton = styled(AntButton)`
  min-height: 42px;
  border-radius: 9px;
  padding-inline: 16px;
  font-weight: 650;
  box-shadow: none;
  transition: background-color 0.16s ease, border-color 0.16s ease, color 0.16s ease, box-shadow 0.16s ease;
`;
