import styled from "styled-components";

export const QuestionSelect = styled.div`
  width: min(100%, 520px);
  min-width: 280px;
  @media (max-width: 700px) {
    width: 100%;
    min-width: 0;
  }
`;

export const DistributionChart = styled.div`
  height: 300px;
  min-width: 0;
  margin-top: 10px;
  @media (max-width: 700px) {
    height: 270px;
    margin-top: 4px;
  }
  @media (max-width: 560px) {
    height: 240px;
  }
`;
