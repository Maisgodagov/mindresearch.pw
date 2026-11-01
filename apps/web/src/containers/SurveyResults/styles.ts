import styled from "styled-components";
import { Card } from "../../components/Card";

export const Header = styled.header`
  padding: 24px 0 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-text-526f5b);
  font-size: 18px;
  font-weight: 750;
`;
export const Hero = styled(Card)`
  margin: 5vh auto 18px;
  background: var(--color-surface);
  & > .ant-card-body {
    padding: clamp(24px, 4vw, 36px);
  }
  h1 {
    font:
      500 clamp(32px, 7vw, 50px)/1.08 var(--font-heading),
      serif;
    color: var(--color-text-2f4938);
    margin: 12px 0 8px;
  }
  p {
    color: var(--color-text-607067);
    line-height: 1.6;
    margin: 0;
    max-width: 680px;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: var(--color-text-50705a);
    background: var(--color-brand-soft);
    padding: 7px 11px;
    border-radius: 99px;
    font-size: 13px;
  }
  @media (max-width: 480px) {
    margin-top: 3vh;
    border-radius: 20px;
    & > .ant-card-body {
      padding: 22px 18px;
    }
  }
`;
export const Grid = styled.div`
  columns: 2;
  column-gap: 14px;
  margin: 18px 0;
  & > * {
    display: inline-block;
    width: 100%;
    margin: 0 0 14px;
    vertical-align: top;
    break-inside: avoid;
  }
  @media (max-width: 720px) {
    columns: 1;
  }
`;
export const ResultCard = styled(Card)`
  padding: 22px;
  h2 {
    font:
      600 19px/1.3 var(--font-heading),
      serif;
    color: var(--color-text-334c3b);
    margin: 0 0 8px;
  }
  .summary {
    font-size: 14px;
    line-height: 1.55;
    color: var(--color-text-657269);
    margin-bottom: 18px;
  }
  .main {
    font-size: 25px;
    font-weight: 800;
    color: var(--color-text-3f624a);
    margin: 8px 0;
  }
  .sub {
    color: var(--color-text-7a867e);
    font-size: 12px;
  }
  @media (max-width: 480px) {
    padding: 17px;
    border-radius: 18px;
  }
`;
export const Bars = styled.div`
  display: grid;
  gap: 13px;
  .row {
    display: grid;
    grid-template-columns: minmax(120px, 1fr) 54px;
    gap: 6px 10px;
    align-items: center;
  }
  .name {
    font-size: 12px;
    color: var(--color-text-526158);
  }
  .value {
    text-align: right;
    font-weight: 800;
    color: var(--color-text-3f5e48);
  }
  .track {
    grid-column: 1 / 3;
    height: 9px;
    background: var(--color-brand-soft);
    border-radius: 10px;
    overflow: hidden;
  }
  .fill {
    height: 100%;
    background: var(--color-brand);
    border-radius: 10px;
  }
  .note {
    grid-column: 1 / 3;
    color: var(--color-text-7c887f);
    font-size: 11px;
    margin-top: -2px;
  }
  .note.high {
    color: var(--color-text-8a654d);
  }
`;
export const Notice = styled(Card)`
  margin: 0 0 30px;
  color: var(--color-text-647168);
  font-size: 13px;
  line-height: 1.55;
  & > .ant-card-body {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 20px;
  }
  svg {
    flex: none;
    color: var(--color-text-63806a);
    margin-top: 2px;
  }
`;
export const Sources = styled(Card)`
  margin: 22px 0 44px;
  padding: 22px 24px;
  color: var(--color-text-657269);
  font-size: 13px;
  line-height: 1.55;
  h2 {
    font:
      600 19px/1.3 var(--font-heading),
      serif;
    color: var(--color-text-334c3b);
    margin: 0 0 6px;
  }
  .intro {
    margin: 0 0 16px;
    color: var(--color-text-7b877f);
  }
  .group + .group {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--color-brand-soft);
  }
  .method {
    font-weight: 750;
    color: var(--color-text-405a48);
    margin-bottom: 7px;
  }
  .links {
    display: flex;
    flex-wrap: wrap;
    gap: 7px 16px;
  }
  a {
    color: var(--color-text-52705a);
    text-decoration: underline;
    text-decoration-color: var(--color-border-strong);
    text-underline-offset: 3px;
    display: inline-flex;
    align-items: flex-start;
    gap: 5px;
  }
  a:hover {
    color: var(--color-text-2f4938);
    text-decoration-color: currentColor;
  }
  svg {
    flex: none;
    margin-top: 3px;
  }
`;
