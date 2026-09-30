import styled from "styled-components";

export const ScoreProfile = styled.div`
  display: grid;
  gap: 14px;
  margin-top: 16px;
  .scale {
    display: grid;
    grid-template-columns: minmax(140px, 210px) 1fr 42px;
    gap: 12px;
    align-items: center;
  }
  .name {
    color: #435a49;
  }
  .value {
    text-align: right;
    font-weight: 800;
    font-size: 16px;
  }
  .track {
    height: 22px;
    border-radius: 7px;
    position: relative;
    overflow: hidden;
    background: #eef1ed;
  }
  .fill {
    height: 100%;
    border-radius: 7px;
    background: #64876d;
    transition: width 0.35s;
  }
  .limits {
    grid-column: 2;
    display: flex;
    justify-content: space-between;
    color: #849087;
    font-size: 11px;
    margin-top: -10px;
  }
  .level {
    grid-column: 2 / 4;
    color: #6f7e73;
    font-size: 11px;
    margin-top: -8px;
  }
  @media (max-width: 700px) {
    .scale {
      grid-template-columns: 1fr 38px;
    }
    .name {
      grid-column: 1 / 3;
    }
    .limits {
      grid-column: 1;
    }
    .level {
      grid-column: 1 / 3;
    }
  }
`;

export const Metrics = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 12px;
  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
  .metric {
    background: #f7faf6;
    border: 1px solid #dce7da;
    border-radius: 12px;
    padding: 12px;
  }
  .metric b {
    display: block;
    font-size: 20px;
    margin-bottom: 3px;
  }
  .metric span {
    color: #77847b;
    font-size: 12px;
  }
`;

export const SupportProfile = styled.div`
  display: grid;
  gap: 14px;
  margin-top: 16px;
  .scale {
    display: grid;
    grid-template-columns: minmax(150px, 230px) 1fr 50px;
    gap: 12px;
    align-items: center;
  }
  .name {
    color: #435a49;
  }
  .value {
    text-align: right;
    font-weight: 800;
    font-size: 16px;
  }
  .track {
    height: 22px;
    border-radius: 7px;
    overflow: hidden;
    background: #eef1ed;
  }
  .fill {
    height: 100%;
    border-radius: 7px;
    background: #64876d;
  }
  .caption {
    grid-column: 2 / 4;
    color: #6f7e73;
    font-size: 11px;
    margin-top: -9px;
  }
  @media (max-width: 700px) {
    .scale {
      grid-template-columns: 1fr 45px;
    }
    .name {
      grid-column: 1 / 3;
    }
    .caption {
      grid-column: 1 / 3;
    }
  }
`;
