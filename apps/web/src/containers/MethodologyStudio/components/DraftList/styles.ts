import styled from "styled-components";
import { Card } from "../../../../ui";

export const DraftListCard = styled(Card)`
  padding: 18px;
  border-radius: 18px;

  .list-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }

  .list-head h2 { margin: 0; color: #395540; font-size: 18px; }
  .muted { color: #829087; font-size: 12px; line-height: 1.5; }

  .drafts {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 9px;
    margin-top: 14px;
    max-height: 70vh;
    min-width: 0;
    padding: 0 4px 0 0;
    overflow-x: hidden;
    overflow-y: auto;
  }

  button.draft {
    appearance: none;
    display: block;
    width: 100%;
    min-width: 0;
    height: auto;
    margin: 0;
    padding: 12px 14px;
    border: 1px solid #dce5d9;
    border-radius: 13px;
    background: #fff;
    color: #354c3b;
    font: inherit;
    text-align: left;
    white-space: normal;
    cursor: pointer;
    transition: border-color .16s ease, background .16s ease, box-shadow .16s ease;
  }

  button.draft:hover { border-color: #9bb19c; background: #f8faf7; }
  button.draft:focus-visible { outline: 3px solid #dcebd8; outline-offset: 1px; }
  button.draft.active { border-color: #698875; background: #f1f6ef; box-shadow: inset 3px 0 #698875; }

  .draft-title {
    display: block;
    width: 100%;
    min-width: 0;
    color: #354c3b;
    font-size: 14px;
    font-weight: 750;
    line-height: 1.4;
    overflow-wrap: anywhere;
  }

  .draft-meta {
    display: grid;
    gap: 3px;
    width: 100%;
    min-width: 0;
    margin-top: 7px;
    color: #839087;
    font-size: 11px;
    line-height: 1.4;
    overflow-wrap: anywhere;
  }

  .draft-meta-text { display: block; min-width: 0; }
  .archive-badge { display: inline-flex; width: fit-content; align-items: center; gap: 5px; padding: 4px 8px; border-radius: 999px; background: #f5eee0; color: #806b3f; font-size: 10px; font-weight: 750; }
  .draft.active .archive-badge { background: #eee4ce; color: #705a2c; }
`;
