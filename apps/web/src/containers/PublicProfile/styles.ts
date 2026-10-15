import styled from "styled-components";

export const ProfileShell = styled.div<{ $embedded?: boolean }>`
  width: ${({ $embedded }) =>
    $embedded ? "100%" : "min(calc(100% - 64px), 1060px)"};
  max-width: 1060px;
  margin: ${({ $embedded }) => ($embedded ? "0" : "0 auto")};
  padding: ${({ $embedded }) => ($embedded ? "0 0 32px" : "28px 0 64px")};
  color: #304d3a;
  .public-brand {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    color: #36553e;
    font-size: 19px;
    font-weight: 750;
    text-decoration: none;
    letter-spacing: -0.025em;
    margin-bottom: 32px;
  }
  .public-brand > svg {
    flex: none;
  }
  .profile-loading {
    padding: 32px 0;
  }
  a:focus-visible,
  button:focus-visible {
    outline: 2px solid #64845c;
    outline-offset: 4px;
  }
  ::selection {
    background: #dfead7;
    color: #28412e;
  }
  .profile-state {
    padding: 48px 36px;
    background: #fff;
    border: 1px solid #dce5d8;
    border-radius: 16px;
  }
  .profile-state h1 {
    font-size: 28px;
    line-height: 1.3;
    font-weight: 600;
    margin: 0 0 12px;
    color: #304d3a;
  }
  .profile-state p {
    color: #5f7164;
    font-size: 14px;
    line-height: 1.7;
    margin: 0;
  }
  .state-action,
  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 42px;
    margin-top: 20px;
    font: inherit;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    color: #416d47;
  }
  .state-action {
    cursor: pointer;
    background: #edf3e7;
    border: 0;
    border-radius: 9px;
    padding: 10px 16px;
  }
  .state-action:hover {
    background: #dfead7;
  }
  .back-link:hover {
    text-decoration: underline;
    text-underline-offset: 4px;
  }
  @media (max-width: 600px) {
    width: ${({ $embedded }) => ($embedded ? "100%" : "calc(100% - 32px)")};
    padding-top: ${({ $embedded }) => ($embedded ? "0" : "20px")};
    .public-brand {
      font-size: 16px;
      margin-bottom: 24px;
      gap: 7px;
    }
    .profile-state {
      padding: 30px 22px;
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

export const Hero = styled.section`
  display: grid;
  grid-template-columns: 112px minmax(0, 1fr);
  column-gap: 28px;
  row-gap: 16px;
  padding: 36px;
  border: 1px solid #dce5d8;
  border-radius: 16px;
  background: #fff;
  .avatar {
    grid-column: 1;
    grid-row: 1 / 4;
    width: 112px;
    height: 112px;
    border-radius: 50%;
    overflow: hidden;
  }
  .avatar img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .author-name {
    min-width: 0;
    align-self: center;
  }
  h1 {
    font-size: 36px;
    line-height: 1.2;
    font-weight: 600;
    letter-spacing: -0.025em;
    color: #304d3a;
    margin: 0 0 10px;
    overflow-wrap: anywhere;
  }
  .author-role {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 6px 14px;
    font-size: 13px;
    line-height: 1.6;
    color: #607165;
    margin: 0;
  }
  .author-role span {
    overflow-wrap: anywhere;
    min-width: 0;
  }
  .author-bio {
    grid-column: 2;
    max-width: 70ch;
    min-width: 0;
    margin: 0;
    font-size: 15px;
    line-height: 1.8;
    color: #4f6556;
    white-space: pre-line;
    overflow-wrap: anywhere;
  }
  .author-links {
    grid-column: 2;
    min-width: 0;
  }
  .author-links:empty {
    display: none;
  }
  .author-links > div {
    margin-top: 2px;
    gap: 8px;
  }
  .author-links a {
    min-height: 40px;
    font-size: 13px;
    padding: 9px 13px;
  }
  @media (max-width: 700px) {
    padding: 26px;
    gap: 18px 22px;
    grid-template-columns: 88px minmax(0, 1fr);
    .avatar {
      width: 88px;
      height: 88px;
      grid-row: 1;
    }
    h1 {
      font-size: 28px;
      margin-bottom: 8px;
    }
    .author-bio,
    .author-links {
      grid-column: 1 / -1;
    }
  }
  @media (max-width: 420px) {
    padding: 24px 20px;
    grid-template-columns: 72px minmax(0, 1fr);
    column-gap: 16px;
    .avatar {
      width: 72px;
      height: 72px;
    }
    h1 {
      font-size: 25px;
    }
    .author-role {
      font-size: 12px;
      gap: 2px 12px;
    }
    .author-bio {
      font-size: 14px;
    }
  }
`;

export const SurveyList = styled.section`
  margin-top: 36px;
  .surveys-heading {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 18px;
  }
  h2 {
    display: flex;
    gap: 12px;
    align-items: baseline;
    font-size: 23px;
    line-height: 1.35;
    font-weight: 550;
    letter-spacing: -0.02em;
    color: #304d3a;
    margin: 0;
  }
  .survey-count {
    font-size: 15px;
    color: #66766a;
    font-weight: 500;
    letter-spacing: 0;
    font-variant-numeric: tabular-nums;
  }
  .surveys-heading p {
    color: #607165;
    font-size: 13px;
    line-height: 1.6;
    margin: 7px 0 0;
  }
  .surveys {
    list-style: none;
    margin: 0;
    padding: 0;
    border: 1px solid #dce5d8;
    border-radius: 16px;
    background: #fff;
    overflow: hidden;
  }
  .survey {
    position: relative;
    display: grid;
    grid-template-columns: 24px minmax(0, 1fr) auto;
    align-items: center;
    gap: 22px;
    padding: 26px 30px;
    transition: background-color 160ms ease;
  }
  .survey + .survey {
    border-top: 1px solid #e5ebe1;
  }
  .survey:hover,
  .survey:focus-within {
    background: #f9fbf7;
  }
  .survey-icon {
    color: #5f7c60;
    flex: none;
  }
  .survey-copy {
    min-width: 0;
  }
  h3 {
    color: #354f3b;
    font-size: 16px;
    font-weight: 650;
    line-height: 1.55;
    margin: 0;
    overflow-wrap: anywhere;
  }
  .survey-copy p {
    max-width: 74ch;
    margin: 7px 0 0;
    font-size: 13px;
    color: #607165;
    line-height: 1.7;
    white-space: pre-line;
    overflow-wrap: anywhere;
  }
  .survey-start {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-height: 42px;
    padding: 10px 16px;
    border-radius: 9px;
    background: #52734c;
    color: #fff;
    font-size: 13px;
    font-weight: 650;
    line-height: 1.5;
    text-decoration: none;
    white-space: nowrap;
    transition: background-color 160ms ease;
  }
  .survey-start:hover {
    color: #fff;
    background: #3e5e39;
  }
  .survey-start svg {
    flex: none;
  }
  .empty-surveys {
    border: 1px solid #dce5d8;
    border-radius: 16px;
    background: #fff;
    padding: 30px;
  }
  .empty-surveys h3 {
    font-size: 16px;
    font-weight: 600;
  }
  .empty-surveys p {
    color: #607165;
    font-size: 14px;
    line-height: 1.7;
    margin: 8px 0 0;
  }
  @media (max-width: 700px) {
    .survey {
      grid-template-columns: 22px minmax(0, 1fr);
      gap: 14px;
      padding: 22px;
      align-items: start;
    }
    .survey-icon {
      margin-top: 3px;
    }
    .survey-start {
      grid-column: 2;
      justify-self: start;
    }
  }
  @media (max-width: 420px) {
    margin-top: 28px;
    h2 {
      font-size: 21px;
    }
    .survey {
      padding: 22px 20px;
      gap: 12px;
    }
    .empty-surveys {
      padding: 24px 20px;
    }
  }
`;
