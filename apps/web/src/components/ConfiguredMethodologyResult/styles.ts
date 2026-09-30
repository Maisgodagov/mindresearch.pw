import styled from "styled-components";

export const Profile = styled.div`
  display: grid; gap: 11px; margin: 14px 0 3px;
  .scale { display: grid; grid-template-columns: minmax(120px, 220px) minmax(70px, 1fr) auto; gap: 10px; align-items: center; }
  .label { color: #435a49; font-size: 13px; }
  .value { color: #365640; font-weight: 800; font-variant-numeric: tabular-nums; }
  .track { height: 12px; border-radius: 99px; background: #edf1eb; overflow: hidden; }
  .fill { height: 100%; border-radius: inherit; background: #64876d; }
  .caption { grid-column: 1/-1; color: #7b897f; font-size: 11px; margin-top: -7px; }
  @media (max-width: 600px) {
    .scale { grid-template-columns: minmax(90px, 1fr) auto; }
    .track { grid-column: 1/-1; grid-row: 2; }
  }
`;
