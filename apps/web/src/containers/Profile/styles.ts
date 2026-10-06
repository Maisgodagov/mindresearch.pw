import styled from 'styled-components';
import { Card } from '../../components/Card';

export const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(290px, 0.8fr);
  gap: 16px;
  align-items: start;
  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
    gap: 14px;
    & > .profile-preview { order: -1; }
  }
`;
export const Column = styled.div`
  display: grid;
  gap: 18px;
`;
export const Form = styled(Card)`
  padding: 28px;
  border: 1px solid #dce6da;
  border-radius: 20px;
  box-shadow: 0 5px 20px rgba(39, 57, 43, 0.035);
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
    .switch { align-items: center; gap: 10px; padding: 10px 11px; margin: 12px 0; border-radius: 12px; }
    .switch input { width: 36px; height: 21px; flex-basis: 36px; padding: 3px; }
    .switch input::before { width: 15px; height: 15px; }
    .switch input:checked::before { transform: translateX(15px); }
    .switch b { font-size: 12px; }
    .switch span { font-size: 11px; }
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
  grid-template-columns: repeat(auto-fill, minmax(42px, 54px));
  justify-content: start;
  gap: 9px;
  margin-top: 9px;
  padding: 12px;
  border: 1px solid #e7ede5;
  border-radius: 14px;
  background: #f8faf7;
  button {
    box-sizing: border-box;
    display: block;
    width: 100%;
    min-width: 42px;
    min-height: 0;
    max-width: 54px;
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
  button:hover {
    transform: scale(1.04);
    background: transparent;
  }
  button:focus-visible {
    outline: 2px solid #78947e;
    outline-offset: 2px;
  }
  button.active {
    border-color: #4f7456;
    background: #e4eee1;
    box-shadow: 0 0 0 3px #e4eee1;
    transform: scale(1.04);
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
  padding: 22px;
  border: 1px solid #dce6da;
  border-radius: 20px;
  background: linear-gradient(180deg, #f9fbf8 0%, #fff 68%);
  box-shadow: 0 5px 20px rgba(39, 57, 43, 0.035);
  position: sticky;
  top: 25px;
  &::before {
    content: "Предпросмотр профиля";
    display: block;
    margin-bottom: 17px;
    color: #819086;
    font-size: 10px;
    font-weight: 750;
    letter-spacing: 0.075em;
    text-transform: uppercase;
  }
  .avatar {
    width: 82px;
    height: 82px;
    border-radius: 50%;
    overflow: hidden;
    padding: 0;
    border: 1px solid #dce7d9;
    background: #edf3e9;
    box-shadow: 0 4px 12px rgba(44, 63, 47, 0.08);
    box-sizing: border-box;
  }
  .avatar img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
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
    border: 1px solid #e0e9dd;
  }
  @media (max-width: 1080px) {
    position: static;
  }
  @media (max-width: 520px) {
    padding: 20px 16px;
    border-radius: 18px;
    .avatar { width: 68px; height: 68px; }
    h2 { font-size: 22px; }
  }
`;
