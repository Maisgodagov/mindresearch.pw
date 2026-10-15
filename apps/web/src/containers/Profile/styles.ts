import styled, { css } from "styled-components";
import { Modal } from "antd";

const controls = css`
  .text-action,
  .icon-action {
    appearance: none;
    border: 0;
    background: transparent;
    color: #44634b;
    font: inherit;
    font-size: 13px;
    font-weight: 650;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 40px;
    padding: 8px 0;
    border-radius: 8px;
    transition:
      color 160ms ease,
      background-color 160ms ease;
  }
  .text-action:hover {
    color: #263f2d;
    text-decoration: underline;
    text-underline-offset: 4px;
  }
  .icon-action {
    padding: 10px;
    flex: none;
  }
  .icon-action:hover {
    background: #edf2e9;
  }
  button:disabled {
    cursor: wait;
    opacity: 0.6;
  }
  button:focus-visible,
  a:focus-visible {
    outline: 2px solid #64845c;
    outline-offset: 4px;
  }
  svg {
    flex: none;
  }
  ::selection {
    background: #dfead7;
    color: #28412e;
  }
`;

export const ProfileSurface = styled.div`
  --profile-ink: #304d3a;
  --profile-muted: #647469;
  max-width: 1060px;
  color: var(--profile-ink);
  ${controls}
  .page-heading {
    margin: 0 0 28px;
  }
  .page-heading h1 {
    margin: 0 0 6px;
    font-size: 32px;
    font-weight: 550;
    letter-spacing: -0.025em;
  }
  .page-heading p {
    margin: 0;
    color: var(--profile-muted);
    font-size: 14px;
  }
  .profile-card {
    padding: 36px;
    border: 1px solid #dce5d8;
    border-radius: 16px;
    background: #fff;
  }
  .identity {
    display: grid;
    grid-template-columns: 112px minmax(0, 1fr) auto;
    gap: 24px;
    align-items: start;
  }
  .avatar-wrap {
    position: relative;
    width: 112px;
    height: 112px;
  }
  .avatar-wrap > img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
  .avatar-edit {
    position: absolute;
    bottom: 0;
    right: 0;
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border: 3px solid white;
    border-radius: 50%;
    background: #e5efde;
    color: #35543b;
    cursor: pointer;
    transition: background-color 160ms ease;
  }
  .avatar-edit:hover {
    background: #d2e2c8;
  }
  .identity-copy {
    padding-top: 6px;
    min-width: 0;
  }
  .identity h2 {
    margin: 0 0 10px;
    font-size: 28px;
    line-height: 1.25;
    font-weight: 600;
    letter-spacing: -0.025em;
    overflow-wrap: anywhere;
  }
  .bio {
    margin: 0;
    max-width: 65ch;
    color: #526659;
    font-size: 14px;
    line-height: 1.7;
    white-space: pre-line;
    overflow-wrap: anywhere;
  }
  .bio.empty {
    color: var(--profile-muted);
  }
  .edit-details {
    align-self: start;
    margin-top: 6px;
    border-color: #d8e2d4;
    color: #3e5b44;
    background: #f6f9f3;
  }
  .profile-facts {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 0.8fr) minmax(0, 1.4fr);
    gap: 24px;
    margin: 32px 0 0;
    padding: 26px 0;
    border-block: 1px solid #e5ebe1;
  }
  .profile-facts > div {
    min-width: 0;
  }
  dt {
    font-size: 12px;
    color: var(--profile-muted);
    margin-bottom: 9px;
  }
  dd {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 25px;
    font-size: 13px;
    font-weight: 600;
    overflow-wrap: anywhere;
  }
  dd > span {
    min-width: 0;
  }
  dd small {
    font-weight: 400;
  }
  .profile-facts small {
    display: block;
    font-size: 11px;
    color: var(--profile-muted);
    margin-top: 6px;
    line-height: 1.5;
  }
  .public-address dd {
    gap: 2px;
  }
  .public-address .icon-action {
    padding: 4px;
    min-height: 25px;
  }
  .address {
    user-select: all;
  }
  .address a {
    display: inline;
    color: #416d47;
    text-decoration: none;
  }
  .address a svg {
    margin-left: 5px;
    vertical-align: middle;
  }
  .address a:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .links-section {
    padding: 24px 0 28px;
  }
  .section-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px 18px;
    margin-bottom: 12px;
  }
  h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 650;
  }
  .empty-links {
    margin: 0;
    color: var(--profile-muted);
    font-size: 13px;
    line-height: 1.6;
  }
  .visibility {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    background: #f2f6ee;
    padding: 20px 22px;
    border-radius: 12px;
  }
  .visibility-description {
    min-width: 0;
  }
  .visibility-heading {
    display: flex;
    gap: 9px;
    align-items: center;
  }
  .visibility p {
    margin: 7px 0 0;
    max-width: 65ch;
    color: #5b6c5f;
    font-size: 13px;
    line-height: 1.6;
  }
  .visibility-switch {
    appearance: none;
    position: relative;
    width: 46px;
    height: 28px;
    flex: 0 0 46px;
    border: 0;
    border-radius: 20px;
    background: #9eada1;
    padding: 3px;
    cursor: pointer;
    transition: background-color 160ms ease;
  }
  .visibility-switch span {
    display: block;
    width: 22px;
    height: 22px;
    background: #fff;
    border-radius: 50%;
    transition: transform 160ms ease;
  }
  .visibility-switch[aria-checked="true"] {
    background: #52734c;
  }
  .visibility-switch[aria-checked="true"] span {
    transform: translateX(18px);
  }
  .visibility-switch:hover {
    background: #85998a;
  }
  .visibility-switch[aria-checked="true"]:hover {
    background: #3d5c38;
  }
  .account-actions {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    border-top: 1px solid #e5ebe1;
    padding-top: 19px;
    margin-top: 28px;
  }
  .logout-action {
    color: #6f625b;
  }
  .save-notice {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 32px;
    margin-top: 12px;
    font-size: 13px;
    color: #416448;
  }
  .load-error {
    padding: 20px 0;
  }
  @media (max-width: 1120px) {
    .profile-facts {
      grid-template-columns: 1fr 1fr;
    }
    .public-address {
      grid-column: 1 / -1;
    }
    .identity {
      grid-template-columns: 100px minmax(0, 1fr);
    }
    .avatar-wrap {
      width: 100px;
      height: 100px;
    }
    .edit-details {
      grid-column: 2;
      justify-self: start;
      margin-top: -8px;
    }
  }
  @media (max-width: 600px) {
    .page-heading {
      margin-bottom: 20px;
    }
    .page-heading h1 {
      font-size: 28px;
    }
    .profile-card {
      padding: 22px 20px;
    }
    .identity {
      grid-template-columns: 76px minmax(0, 1fr);
      gap: 16px;
    }
    .avatar-wrap {
      width: 76px;
      height: 76px;
    }
    .avatar-edit {
      width: 32px;
      height: 32px;
      bottom: -2px;
      right: -2px;
    }
    .identity h2 {
      font-size: 22px;
    }
    .identity-copy {
      padding-top: 0;
    }
    .bio {
      font-size: 13px;
    }
    .edit-details {
      grid-column: 1 / -1;
      margin-top: 2px;
    }
    .profile-facts {
      grid-template-columns: 1fr;
      gap: 20px;
      padding: 22px 0;
      margin-top: 24px;
    }
    .public-address {
      grid-column: auto;
    }
    .visibility {
      padding: 18px 16px;
      gap: 14px;
    }
    .section-heading {
      align-items: flex-start;
    }
    .section-heading .text-action {
      min-height: 32px;
    }
    .account-actions {
      flex-wrap: wrap;
      gap: 4px 20px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      transition: none !important;
    }
  }
`;

export const ProfileDialog = styled(Modal)`
  .ant-modal-content {
    padding: 28px;
    border-radius: 16px;
    background: #fff;
  }
  .ant-modal-header {
    margin-bottom: 10px;
    padding-right: 28px;
    background: transparent;
  }
  .ant-modal-title {
    color: #304d3a;
    font-size: 22px;
    line-height: 1.35;
    font-weight: 600;
    letter-spacing: -0.02em;
  }
  .ant-modal-close {
    color: #5c7161;
    top: 20px;
    right: 20px;
  }
  .ant-modal-close:hover {
    background: #edf3e8;
  }
  @media (max-width: 600px) {
    .ant-modal-content {
      padding: 24px 20px;
    }
    .ant-modal-title {
      font-size: 20px;
    }
  }
`;

export const DialogBody = styled.div`
  color: #304d3a;
  ${controls}
  .dialog-intro {
    margin: 0 0 22px;
    color: #617266;
    font-size: 13px;
    line-height: 1.65;
  }
  fieldset {
    margin: 0;
    padding: 0;
    border: 0;
    min-width: 0;
  }
  label {
    display: block;
    margin: 18px 0 7px;
    font-size: 13px;
    font-weight: 650;
    color: #425b49;
  }
  fieldset > label:first-child {
    margin-top: 0;
  }
  input,
  textarea {
    width: 100%;
    caret-color: #416448;
  }
  input::placeholder,
  textarea::placeholder {
    color: #68796c;
    opacity: 1;
  }
  textarea {
    resize: vertical;
    min-height: 110px;
  }
  .field-hint {
    font-size: 12px;
    line-height: 1.6;
    color: #647469;
    margin: 8px 0 0;
  }
  .slug-field {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .slug-field > span {
    color: #647469;
    font-size: 14px;
  }
  .slug-field input {
    flex: 1;
    min-width: 0;
  }
  .dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding-top: 22px;
    margin-top: 24px;
    border-top: 1px solid #e5ebe1;
  }
  .dialog-actions button {
    white-space: normal;
    height: auto;
    min-height: 42px;
  }
  .form-error {
    margin: 18px 0 0;
    padding: 12px 14px;
    background: #faf0ed;
    border-radius: 8px;
    color: #934b3c;
    font-size: 13px;
    line-height: 1.6;
  }
  .avatar-preview {
    display: flex;
    justify-content: center;
    margin: 4px 0 24px;
  }
  .avatar-preview img {
    width: 104px;
    height: 104px;
    border-radius: 50%;
  }
  .social-fields {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0 18px;
  }
  .social-fields label {
    margin-top: 12px;
  }
  .custom-links-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 28px 0 4px;
    gap: 12px;
  }
  h3 {
    font-size: 15px;
    font-weight: 650;
    margin: 0;
  }
  .custom-links-heading span {
    color: #647469;
    font-size: 12px;
  }
  .custom-link {
    display: grid;
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr) 36px;
    align-items: end;
    gap: 10px;
  }
  .custom-link .icon-action {
    margin-bottom: 2px;
  }
  .add-link {
    margin-top: 12px;
  }
  .confirm-symbol {
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    color: #4a6b44;
    background: #edf3e7;
    border-radius: 50%;
    margin: 22px 0 18px;
  }
  .confirm-copy {
    color: #526659;
    font-size: 14px;
    line-height: 1.75;
    margin: 0;
  }
  .confirm-url {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 14px 0 0;
    color: #416448;
    font-size: 13px;
    overflow-wrap: anywhere;
  }
  .confirm-url span {
    min-width: 0;
  }
  .logout-everywhere {
    display: flex;
    margin: 18px auto 0;
    font-size: 12px;
  }
  @media (max-width: 600px) {
    .social-fields {
      grid-template-columns: 1fr;
    }
    .custom-link {
      grid-template-columns: minmax(0, 1fr) 36px;
    }
    .custom-link > div:first-child {
      grid-column: 1 / -1;
    }
    .dialog-actions {
      gap: 8px;
    }
  }
`;

export const Avatars = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 56px);
  justify-content: center;
  gap: 14px;
  padding: 4px;
  button {
    display: block;
    width: 56px;
    height: 56px;
    min-width: 56px;
    aspect-ratio: 1;
    padding: 3px;
    border: 2px solid transparent;
    border-radius: 50%;
    background: transparent;
    cursor: pointer;
    transition: border-color 160ms ease;
  }
  button:hover {
    border-color: #a1b298;
  }
  button.selected {
    border-color: #4f7456;
  }
  button:focus-visible {
    outline: 2px solid #64845c;
    outline-offset: 3px;
  }
  button img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
  @media (max-width: 420px) {
    grid-template-columns: repeat(auto-fill, 50px);
    gap: 12px;
    button {
      width: 50px;
      height: 50px;
      min-width: 50px;
    }
  }
`;
