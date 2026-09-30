import styled from "styled-components";
import { Card } from "../../ui";

export const ProfileShell = styled.div`
  width: min(100% - 48px, 1180px);
  margin: auto;
  padding: 25px 0 70px;
  & > div:first-child {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    color: #42614b;
    font-size: 18px;
    font-weight: 800;
    letter-spacing: -0.03em;
  }
  @media (max-width: 580px) { width: min(100% - 28px, 1180px); padding-top: 18px; }
`;

export const Hero = styled(Card)`
  margin-top: clamp(30px, 5vw, 64px);
  border-radius: 24px;
  & > .ant-card-body {
    min-height: 280px;
    display: grid;
    grid-template-columns: 160px minmax(0, 1fr);
    gap: 34px;
    align-items: center;
    padding: clamp(30px, 5vw, 58px);
  }
  .avatar {
    width: 148px;
    height: 148px;
    border-radius: 50%;
    background: #e2ece0;
    display: grid;
    place-items: center;
    overflow: hidden;
    color: #62806a;
  }
  .avatar img { width: 100%; height: 100%; object-fit: cover; }
  .avatar + div { min-width: 0; }
  .avatar + div > span {
    display: inline-block;
    margin-bottom: 10px;
    color: #718077;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: .04em;
    text-transform: uppercase;
  }
  h1 {
    font: 500 clamp(38px, 5.2vw, 62px)/1.12 var(--font-heading), serif;
    color: #304a38;
    margin: 0 0 12px;
    letter-spacing: -.025em;
  }
  p { line-height: 1.65; color: #68766d; white-space: pre-line; font-size: 16px; margin: 0; }
  .not-found-copy { grid-column: 1/-1; max-width: 620px; margin: auto; text-align: center; padding: 24px 0; }
  .not-found-copy h1 { font-size: clamp(34px, 6vw, 52px); }
  .not-found-copy p { margin: 0; font-size: 16px; }
  @media (max-width: 580px) {
    margin-top: 28px;
    & > .ant-card-body { min-height: 0; grid-template-columns: 72px minmax(0,1fr); gap: 15px; padding: 24px 20px; }
    .avatar { width: 72px; height: 72px; }
    .avatar + div > span { font-size: 10px; margin-bottom: 5px; }
    h1 { font-size: clamp(27px, 8vw, 34px); margin-bottom: 5px; overflow-wrap: anywhere; }
    p { font-size: 14px; }
    .not-found-copy { grid-column: 1/-1; }
  }
`;

export const SurveyList = styled.div`
  display: grid;
  gap: 14px;
  margin-top: 28px;
  h2 { font: 500 28px var(--font-heading), serif; color: #304a38; margin: 0 0 2px; }
  .survey {
    border-radius: 18px;
    transition: transform .16s ease, box-shadow .16s ease;
  }
  .survey:hover { transform: translateY(-2px); box-shadow: 0 14px 34px rgba(38,58,43,.08); }
  .survey > .ant-card-body {
    display: grid;
    grid-template-columns: 42px minmax(0,1fr) auto;
    align-items: center;
    gap: 18px;
    padding: 22px 26px;
  }
  .survey > .ant-card-body > svg { width: 22px; height: 22px; color: #58765f; }
  .survey > .ant-card-body > div { min-width: 0; }
  .survey b { display: block; color: #354d3b; font-size: 17px; margin-bottom: 5px; }
  .survey span { display: block; font-size: 13px; color: #7b867f; line-height: 1.45; }
  .survey a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 42px;
    padding: 0 16px;
    border-radius: 11px;
    background: #557660;
    color: white;
    font-weight: 700;
    font-size: 13px;
    text-decoration: none;
    white-space: nowrap;
    transition: background .15s ease;
  }
  .survey a:hover { background: #45644f; }
  @media (max-width: 580px) {
    margin-top: 22px;
    h2 { font-size: 23px; }
    .survey > .ant-card-body { grid-template-columns: 32px minmax(0,1fr); gap: 10px 12px; padding: 16px; }
    .survey > .ant-card-body > svg { width: 20px; height: 20px; }
    .survey a { grid-column: 2; justify-self: start; min-height: 38px; }
  }
`;
