import styled from "styled-components";
export const AdminWorkspace = styled.div`
  max-width: 1280px;
  width: 100%;
  color: #304a38;
  h1 {
    font-size: clamp(28px, 4vw, 42px);
    margin: 10px 0;
  }
  h2 {
    font-size: 21px;
    margin: 0 0 16px;
  }
  p {
    line-height: 1.6;
  }
  .muted {
    color: #6a7c70;
  }
  .error {
    color: #a03a35;
  }
  .back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 18px;
    color: #436b4d;
  }
  .top {
    display: flex;
    gap: 20px;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }
  .tabs {
    display: flex;
    gap: 10px;
    margin: 24px 0;
    flex-wrap: wrap;
  }
  .tabs button[aria-pressed="true"] {
    background: #355d42;
    color: white;
  }
  .panel {
    background: #fff;
    border: 1px solid #dce6dc;
    border-radius: 18px;
    padding: 24px;
    margin-bottom: 20px;
    min-width: 0;
  }
  .summary-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
    margin: 20px 0;
  }
  .metric {
    padding: 18px;
    background: #fff;
    border: 1px solid #dce6dc;
    border-radius: 14px;
  }
  .metric b {
    display: block;
    font-size: 28px;
  }
  .metric span {
    font-size: 13px;
    color: #6a7c70;
  }
  .columns {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 20px;
  }
  .profile {
    display: flex;
    gap: 22px;
    align-items: center;
  }
  .avatar {
    width: 86px;
    height: 86px;
    flex-shrink: 0;
  }
  .avatar img {
    width: 100%;
    border-radius: 50%;
  }
  .facts {
    display: grid;
    grid-template-columns: 150px 1fr;
    gap: 12px;
  }
  .facts dt {
    color: #6a7c70;
  }
  .facts dd {
    margin: 0;
    overflow-wrap: anywhere;
  }
  .timeline {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .timeline li {
    display: flex;
    gap: 14px;
    justify-content: space-between;
    border-bottom: 1px solid #e5ece5;
    padding: 12px 0;
    flex-wrap: wrap;
  }
  .timeline small {
    color: #6a7c70;
  }
  .timeline b {
    display: block;
  }
  .bar-row {
    margin: 12px 0;
  }
  .bar-label {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: 13px;
    overflow-wrap: anywhere;
  }
  .bar {
    height: 7px;
    margin-top: 7px;
    background: #e7efe4;
    border-radius: 8px;
    overflow: hidden;
  }
  .bar span {
    display: block;
    height: 100%;
    background: #5f845b;
  }
  .table-scroll {
    overflow: auto;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  th,
  td {
    text-align: left;
    padding: 12px;
    border-bottom: 1px solid #e4ece3;
  }
  th {
    color: #6a7c70;
    font-weight: 600;
    white-space: nowrap;
  }
  .empty {
    padding: 30px 0;
    color: #6a7c70;
    max-width: 650px;
  }
  .link-line {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
    overflow-wrap: anywhere;
    margin: 12px 0 28px;
  }
  .link-line a {
    color: #436b4d;
    overflow-wrap: anywhere;
  }
  .survey-description {
    white-space: pre-line;
  }
  .survey-content section {
    border-top: 1px solid #e4ece3;
    padding-top: 16px;
  }
  .survey-content li {
    margin: 12px 0;
    overflow-wrap: anywhere;
  }
  .replay-container {
    overflow: auto;
    max-width: 100%;
  }
  .retention {
    font-size: 12px;
    color: #6a7c70;
  }
  @media (max-width: 760px) {
    .columns {
      grid-template-columns: 1fr;
    }
    .panel {
      padding: 18px;
    }
    .facts {
      grid-template-columns: 1fr;
      gap: 6px;
    }
    .facts dd {
      margin-bottom: 10px;
    }
    .profile {
      align-items: flex-start;
    }
    .avatar {
      width: 62px;
      height: 62px;
    }
  }
`;
