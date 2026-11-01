import styled from 'styled-components';
import { Card, Page } from '../../ui';

export const RegisterPage = styled(Page)`
  min-height: 100dvh;
  display: grid;
  align-items: center;
  padding: 32px 0;
`;

export const Shell = styled.div`
  width: min(100% - 48px, 1080px);
  margin: auto;
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(390px, .82fr);
  align-items: center;
  gap: clamp(32px, 6vw, 80px);
  @media (max-width: 820px) {
    width: min(100% - 32px, 520px);
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

export const Intro = styled.div`
  padding: 12px 0;
  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--color-text-47634f);
    font-size: 19px;
    font-weight: 600;
    letter-spacing: -.025em;
    margin-bottom: clamp(32px, 5vw, 56px);
  }
  .brand svg { width: 30px; height: 30px; stroke-width: 1.8; }
  .eyebrow {
    color: var(--color-text-748478);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0;
    text-transform: none;
    margin: 0 0 12px;
  }
  h1 {
    max-width: 640px;
    font: 500 clamp(39px, 5.2vw, 61px)/1.06 var(--font-heading), Georgia, serif;
    color: var(--color-text-2d4635);
    letter-spacing: -.035em;
    margin: 0 0 20px;
  }
  .intro-copy {
    max-width: 555px;
    font-size: 15px;
    color: var(--color-text-67766c);
    line-height: 1.7;
    margin: 0;
  }
  .features {
    display: grid;
    gap: 0;
    margin-top: 32px;
    max-width: 530px;
    border-top: 1px solid var(--color-brand-alpha-220);
  }
  .feature {
    display: grid;
    grid-template-columns: 22px 1fr;
    gap: 12px;
    align-items: start;
    padding: 12px 0;
    border-bottom: 1px solid var(--color-brand-alpha-220);
    color: var(--color-text-4f6255);
    font-size: 14px;
    line-height: 1.5;
  }
  .feature svg { color: var(--color-text-64816b); margin-top: 1px; }
  @media (max-width: 820px) {
    padding: 0;
    .brand { margin-bottom: 24px; }
    h1 { max-width: 560px; font-size: clamp(34px, 8vw, 48px); }
    .intro-copy { font-size: 14px; }
    .features { display: none; }
  }
`;

export const Box = styled(Card)`
  padding: clamp(24px, 4vw, 40px);
  border-radius: var(--radius-card);
  background: var(--color-surface);
  box-shadow: none;

  h2 {
    font: 500 29px/1.2 var(--font-heading), Georgia, serif;
    color: var(--color-text-304a38);
    letter-spacing: -.02em;
    margin: 0 0 24px;
  }
  form { display: grid; }
  .field { display: grid; gap: 8px; margin-bottom: 20px; }
  label { color: var(--color-brand); font-size: 14px; font-weight: 500; }
  label span { color: var(--color-text-8a968d); font-weight: 500; }
  input {
    display: block;
    width: 100%;
    height: 48px;
    min-width: 0;
    padding: 0 14px;
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius-control);
    background: var(--color-surface);
    color: var(--color-text-26382f);
    font-size: 14px;
    line-height: 1.3;
    outline: none;
    transition: border-color .16s ease, box-shadow .16s ease, background .16s ease;
  }
  input::placeholder { color: var(--color-text-9aa59d); }
  input:hover { border-color: var(--color-border-strong); }
  input:focus {
    border-color: var(--color-brand);
    background: var(--color-surface);
    box-shadow: 0 0 0 3px var(--color-brand-alpha-120);
  }
  .error { color: var(--color-text-a05252); font-size: 13px; line-height: 1.45; margin: 0 0 12px; }
  form > button { width: 100%; margin-top: 8px; border-radius: var(--radius-control); }
  .bottom { text-align: center; font-size: 14px; color: var(--color-palette-748078); margin: 24px 0 0; }
  .bottom a { color: var(--color-brand); font-weight: 500; text-underline-offset: 3px; }
  @media (max-width: 820px) { padding: 24px; }
`;

