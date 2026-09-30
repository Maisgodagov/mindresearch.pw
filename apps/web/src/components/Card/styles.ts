import styled from 'styled-components';
import { Card as AntCard } from 'antd';

export const StyledCard = styled(AntCard)`
  border-color: rgba(87, 116, 94, 0.16);
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 12px 34px rgba(48, 70, 54, 0.055);
  & > .ant-card-body { padding: 0; }
`;
