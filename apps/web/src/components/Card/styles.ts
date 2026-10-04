import styled from 'styled-components';
import { Card as AntCard } from 'antd';

export const StyledCard = styled(AntCard)`
  border-color: #dce4da;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(31, 48, 34, .035);
  & > .ant-card-body { padding: 0; }
`;
