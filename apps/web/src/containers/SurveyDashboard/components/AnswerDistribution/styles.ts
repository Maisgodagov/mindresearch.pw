import styled from "styled-components";

export const QuestionSelect = styled.div`
  width: min(100%, 560px);
  min-width: 280px;
  @media (max-width: 700px) {
    width: 100%;
    min-width: 0;
  }
`;
