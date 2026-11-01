import styled from "styled-components";
import { Button, Card } from "../../ui";
import { FieldInput } from "../../components/FieldInput";

export const Header = styled.header`
  padding: 24px 0 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-text-526f5b);
  font-weight: 750;
  letter-spacing: 0.02em;
`;
export const Welcome = styled(Card)`
  margin: 8vh auto 0;
  padding: clamp(24px, 7vw, 56px);
  min-width: 0;
  h1 {
    font:
      500 clamp(34px, 7vw, 54px)/1.08 var(--font-heading),
      serif;
    margin: 18px 0;
    color: var(--color-text-2f4938);
    overflow-wrap: anywhere;
  }
  p {
    font-size: 17px;
    line-height: 1.65;
    color: var(--color-text-5d6b61);
    white-space: pre-line;
  }
  .author {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--color-text-58705f);
    text-decoration: none;
    font-size: 13px;
    margin-top: 12px;
  }
  .author img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
  }
  .meta {
    display: flex;
    gap: 18px;
    color: var(--color-text-728077);
    font-size: 14px;
    margin: 26px 0;
    flex-wrap: wrap;
  }
  @media (max-width: 480px) {
    margin-top: 4vh;
    border-radius: 20px;
    p {
      font-size: 15px;
    }
    .meta {
      gap: 10px 15px;
      margin: 20px 0;
    }
  }
`;
export const Top = styled.div`
  position: relative;
  padding: 14px 0;
  .save-line {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: -4px 0 3px;
  }
  .save-line .save {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: 5px;
    color: var(--color-text-7a887f);
    font-size: 12px;
    white-space: nowrap;
  }
  .save-line .save svg {
    flex: none;
  }
  @media (max-width: 420px) {
    .save-line {
      margin-top: -5px;
      margin-bottom: 3px;
    }
    .save-line .save {
      font-size: 10px;
    }
  }
`;
export const Bar = styled.div`
  height: 5px;
  background: var(--color-brand-soft);
  border-radius: 9px;
  overflow: hidden;
  i {
    display: block;
    height: 100%;
    background: var(--color-brand);
    transition: width 0.35s;
  }
`;
export const QuestionCard = styled(Card)<{ $leaving: boolean }>`
  margin: 5vh auto 24px;
  padding: clamp(20px, 6vw, 48px);
  min-height: 440px;
  display: flex;
  flex-direction: column;
  min-width: 0;
  opacity: ${(p) => (p.$leaving ? 0 : 1)};
  transform: translateY(${(p) => (p.$leaving ? "-10px" : "0")});
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
  pointer-events: ${(p) => (p.$leaving ? "none" : "auto")};
  .eyebrow {
    color: var(--color-text-738278);
    font-size: 13px;
  }
  .question {
    font:
      500 clamp(25px, 5vw, 36px)/1.25 var(--font-heading),
      serif;
    color: var(--color-text-293c30);
    margin: 18px 0 28px;
    overflow-wrap: anywhere;
  }
  @media (max-width: 560px) {
    min-height: 0;
    margin: 3vh auto 18px;
    padding: 22px 18px;
    border-radius: 20px;
    .question {
      margin: 16px 0 22px;
    }
  }
`;
export const Options = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  min-width: 0;
  gap: 10px;
  margin: auto 0;
`;
export const Choice = styled(Button)<{ $active: boolean }>`
  && {
    justify-content: flex-start !important;
    text-align: left;
    white-space: normal;
    height: auto;
    min-width: 0;
    max-width: 100%;
    line-height: 1.5;
  }
  display: flex;
  align-items: center;
  gap: 13px;
  width: 100%;
  padding: 15px 16px;
  border-radius: 16px;
  border: 1px solid ${(p) => (p.$active ? "var(--color-brand)" : "var(--color-brand-soft)")};
  background: ${(p) => (p.$active ? "var(--color-brand-soft)" : "var(--color-surface)")};
  color: var(--color-text-304036);
  min-height: 54px;
  transition: 0.15s;
  .option-label {
    min-width: 0;
    overflow-wrap: anywhere;
  }
  .dot {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 1px solid var(--color-brand);
    display: grid;
    place-items: center;
    flex: none;
    background: ${(p) => (p.$active ? "var(--color-brand)" : "transparent")};
    color: var(--color-surface);
  }
  .dot.checkbox {
    border-radius: 5px;
  }
`;
export const Input = styled(FieldInput)`
  width: 100%;
  border: 0;
  border-bottom: 2px solid var(--color-border-strong);
  background: transparent;
  padding: 14px 4px;
  font-size: 20px;
  color: var(--color-text-293c30);
  outline: none;
  &:focus {
    border-color: var(--color-brand);
  }
`;
export const MultipleHint = styled.div`
  margin: -16px 0 24px;
  color: var(--color-text-6e7f73);
  font-size: 14px;
  line-height: 1.4;
`;
export const Closed = styled(Card)`
  margin: 10vh auto 0;
  padding: clamp(30px, 7vw, 58px);
  text-align: center;
  .icon {
    width: 54px;
    height: 54px;
    margin: 0 auto 20px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: var(--color-brand-soft);
    color: var(--color-text-58725f);
  }
  h1 {
    font:
      500 clamp(32px, 6vw, 48px)/1.12 var(--font-heading),
      serif;
    color: var(--color-text-304a38);
    margin: 0 0 15px;
  }
  p {
    max-width: 520px;
    margin: auto;
    color: var(--color-text-68766d);
    font-size: 16px;
    line-height: 1.65;
  }
`;
export const Nav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
  gap: 10px;
  .save {
    font-size: 12px;
    color: var(--color-text-7a887f);
    display: flex;
    align-items: center;
    gap: 5px;
  }
  @media (max-width: 420px) {
    gap: 6px;
    margin-top: 22px;
    .save {
      font-size: 10px;
      justify-content: center;
      flex: 1;
      min-width: 0;
    }
    .save svg {
      flex: none;
    }
  }
`;
