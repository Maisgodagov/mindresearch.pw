import styled from 'styled-components';
import { Card } from '../../components/Card';

export const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.8fr);
  gap: 18px;
  align-items: start;
  @media (max-width: 820px) {
    grid-template-columns: 1fr;
    & > :first-child { grid-row: 2; }
    & > :last-child { grid-row: 1; }
  }
`;
export const Column = styled.div`
  display: grid;
  gap: 18px;
`;
export const Form = styled(Card)`
  padding: 28px;
  border-radius: 22px;
  h1 {
    font:
      500 34px var(--font-heading),
      serif;
    color: #304a38;
    margin: 0 0 6px;
  }
  .intro {
    color: #77847b;
    margin: 0 0 25px;
  }
  label {
    display: block;
    color: #5e6f63;
    font-size: 13px;
    font-weight: 650;
    margin: 17px 0 7px;
  }
  input,
  textarea {
    width: 100%;
    padding: 13px 14px;
    border: 1px solid #d5dfd4;
    border-radius: 12px;
    background: #fff;
    outline: none;
    &:focus {
      border-color: #74937b;
    }
  }
  textarea {
    min-height: 130px;
    resize: vertical;
  }
  #root & .slug {
    display: flex;
    align-items: center;
    border: 1px solid #d5dfd4;
    border-radius: 12px;
    background: #fff;
    overflow: hidden;
    color: #829087;
    padding-left: 12px;
    transition: border-color .16s ease, box-shadow .16s ease;
  }
  #root & .slug:focus-within {
    border-color: #78947e;
    box-shadow: 0 0 0 3px rgba(95, 128, 104, .12);
  }
  #root & .slug input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="hidden"]):not([type="submit"]):not([type="button"]) {
    flex: 1;
    min-width: 0;
    height: 53px;
    border: 0 !important;
    border-radius: 0 !important;
    padding: 0 12px 0 4px;
    background: transparent !important;
    box-shadow: none !important;
  }
  #root & .slug input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="hidden"]):not([type="submit"]):not([type="button"]):focus {
    border: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
    outline: none;
  }
  .switch {
    display: flex;
    gap: 13px;
    align-items: center;
    padding: 15px;
    background: #f0f5ed;
    border-radius: 14px;
    margin: 20px 0;
    cursor: pointer;
  }
  .switch input {
    appearance: none;
    -webkit-appearance: none;
    width: 44px;
    height: 25px;
    flex: 0 0 44px;
    margin: 0;
    padding: 3px;
    border: 0;
    border-radius: 99px;
    background: #c3cec2;
    cursor: pointer;
    transition: 0.2s;
  }
  .switch input::before {
    content: "";
    display: block;
    width: 19px;
    height: 19px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 2px 5px rgba(35, 55, 41, 0.22);
    transition: 0.2s;
  }
  .switch input:checked {
    background: #5f8068;
  }
  .switch input:checked::before {
    transform: translateX(19px);
  }
  .switch input:focus-visible {
    outline: 3px solid rgba(95, 128, 104, 0.25);
  }
  .switch b {
    display: block;
    color: #405647;
  }
  .switch span {
    font-size: 12px;
    color: #748078;
  }
  .saved {
    color: #55765f;
    font-size: 13px;
    margin-left: 12px;
  }
  .error {
    color: #a05252;
    font-size: 13px;
  }
  form > button {
    min-height: 44px;
    padding: 10px 22px;
    border: 0;
    border-radius: 11px;
    background: #557660;
    color: #fff;
    font-weight: 750;
    box-shadow: 0 4px 12px rgba(45, 73, 52, 0.14);
    transition: background 0.16s ease, transform 0.16s ease;
  }
  form > button:hover { background: #45644f; transform: translateY(-1px); }
  @media (max-width: 520px) {
    padding: 20px 16px;
    border-radius: 18px;
    h1 { font-size: 29px; }
    .intro { margin-bottom: 20px; }
    .switch { align-items: flex-start; padding: 13px; }
    .saved { display: block; margin: 8px 0 0; }
  }
`;
export const PasswordForm = styled(Form)`
  h2 {
    font:
      600 23px var(--font-heading),
      serif;
    color: #304a38;
    margin: 0 0 18px;
    display: flex;
    align-items: center;
    gap: 9px;
  }
  .intro {
    margin: 0 0 20px;
  }
  .open-password {
    margin: 0;
    border: 0;
    padding: 0;
    min-height: 0;
    height: auto;
    background: transparent;
    color: #718078;
    font-size: 12px;
    font-weight: 500;
    text-decoration: underline;
    text-underline-offset: 3px;
    box-shadow: none;
  }
  .open-password:hover {
    background: transparent;
    color: #45624e;
    text-decoration: underline;
    box-shadow: none;
  }
  .password-actions {
    display: flex;
    align-items: center;
    gap: 18px;
    flex-wrap: wrap;
    margin-top: 20px;
  }
  .cancel,
  .logout-all {
    border: 0;
    background: transparent;
    color: #718078;
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
  }
  .logout-all {
    display: block;
    margin-top: 20px;
    font-size: 12px;
  }
`;
export const Avatars = styled.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 10px;
  margin-top: 10px;
  @media (max-width: 1100px) {
    grid-template-columns: repeat(8, minmax(0, 1fr));
  }
  @media (max-width: 520px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px 8px;
  }
  button {
    width: min(54px, 100%);
    aspect-ratio: 1;
    justify-self: center;
    border-radius: 50%;
    padding: 0;
    border: 2px solid transparent;
    background: transparent;
    overflow: hidden;
    cursor: pointer;
    transition: 0.15s;
  }
  @media (max-width: 520px) { button { width: min(62px, 100%); } }
  button:hover {
    transform: translateY(-2px);
    background: transparent;
  }
  button.active {
    border-color: #53755d;
    box-shadow: 0 0 0 2px #dce8da;
  }
  img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    padding: 0;
    box-sizing: border-box;
  }
`;
export const Preview = styled(Card)`
  padding: 25px;
  border-radius: 22px;
  position: sticky;
  top: 25px;
  .avatar {
    width: 82px;
    height: 82px;
    border-radius: 50%;
    overflow: hidden;
  }
  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  h2 {
    font:
      600 25px var(--font-heading),
      serif;
    margin: 16px 0 8px;
    color: #344d3b;
  }
  p {
    color: #6d7a71;
    line-height: 1.55;
    font-size: 14px;
    white-space: pre-line;
  }
  .badge {
    display: inline-flex;
    gap: 6px;
    align-items: center;
    font-size: 11px;
    color: #597362;
    background: #e7efe5;
    border-radius: 20px;
    padding: 6px 9px;
    margin-top: 12px;
  }
  @media (max-width: 820px) {
    position: static;
  }
  @media (max-width: 520px) {
    padding: 20px 16px;
    border-radius: 18px;
    .avatar { width: 68px; height: 68px; }
    h2 { font-size: 22px; }
  }
`;
