import styled from 'styled-components';
import { pageDefaults } from './const';

export const StyledPage = styled.main`
  display:flow-root;
  min-height:100dvh;
  background:var(--color-page, ${pageDefaults.background});
`;
