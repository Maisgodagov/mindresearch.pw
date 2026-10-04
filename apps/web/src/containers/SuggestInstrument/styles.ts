import styled from "styled-components";
import { Card } from "../../ui";

export const Form = styled(Card)`
  width: 100%;
  margin: 0;
  padding: clamp(24px, 4vw, 42px);
  border: 1px solid #dce6da;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 8px 28px rgba(38, 57, 43, 0.045);

  h1 {
    margin: 0 0 10px;
    color: #2e4935;
    font: 650 clamp(27px, 3.2vw, 36px)/1.18 var(--font-heading), sans-serif;
    letter-spacing: -0.035em;
  }
  .intro {
    max-width: 700px;
    margin: 0;
    color: #6e7d72;
    font-size: 14px;
    line-height: 1.65;
  }
  .note {
    display: flex;
    align-items: flex-start;
    gap: 11px;
    margin: 22px 0 28px;
    padding: 14px 16px;
    border: 1px solid #e2ebdf;
    border-radius: 12px;
    background: #f2f6f0;
    color: #637468;
    font-size: 12px;
    line-height: 1.55;
  }
  .note::before {
    content: "i";
    display: grid;
    flex: 0 0 20px;
    width: 20px;
    height: 20px;
    place-items: center;
    border-radius: 50%;
    background: #e2eddf;
    color: #52764b;
    font-size: 12px;
    font-weight: 750;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0 16px;
  }
  .wide { grid-column: 1 / -1; }
  label {
    display: block;
    margin: 17px 0 7px;
    color: #53675a;
    font-size: 12px;
    font-weight: 700;
    line-height: 1.4;
  }
  .required { color: #a25f59; }
  input {
    min-height: 46px;
    border-radius: 10px;
  }
  .adaptation-select { width: 100%; }
  .adaptation-select > button {
    height: 52px;
    border-radius: 10px;
  }
  .adaptation-native-select { display: none; }
  form > button {
    min-height: 44px;
    margin-top: 22px;
    padding-inline: 17px;
    border: 0;
    border-radius: 10px;
    background: #55784f;
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    box-shadow: none;
  }
  form > button:hover:not(:disabled) {
    border: 0;
    background: #466a43;
    color: #fff;
  }
  .success {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 22px;
    padding: 16px;
    border: 1px solid #d8e7d4;
    border-radius: 12px;
    background: #f1f7ef;
    color: #426848;
    font-size: 14px;
    font-weight: 650;
  }
  .error {
    margin: 12px 0 0;
    color: #a25555;
    font-size: 12px;
  }
  .history {
    margin-top: 30px;
    padding-top: 23px;
    border-top: 1px solid #e5ebe3;
  }
  .history h2 {
    margin: 0 0 13px;
    color: #2e4935;
    font-size: 19px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  .history p {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin: 0;
    padding: 12px 13px;
    border: 1px solid #e4ebe1;
    border-radius: 10px;
    background: #fbfcfa;
    color: #77847a;
    font-size: 12px;
  }
  .history p + p { margin-top: 8px; }
  .history p b { color: #344b3a; font-weight: 700; }
  @media (max-width: 620px) {
    padding: 22px 17px;
    border-radius: 15px;
    .intro { font-size: 13px; }
    .note { margin: 18px 0 20px; padding: 12px; }
    .grid { grid-template-columns: 1fr; }
    .wide { grid-column: auto; }
    label { margin-top: 14px; }
    form > button { width: 100%; justify-content: center; }
    .history { margin-top: 24px; padding-top: 19px; }
    .history p { align-items: flex-start; flex-direction: column; gap: 4px; }
  }
`;
