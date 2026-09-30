import styled from "styled-components";

export const CatalogContent = styled.div<{ $locked: boolean }>`
  width: 100%;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  pointer-events: ${({ $locked }) => ($locked ? "none" : "auto")};
  opacity: ${({ $locked }) => ($locked ? 0.55 : 1)};
  .catalog-empty { padding: 12px; text-align: center; }
`;

export const CatalogTools = styled.div`
  display: grid;
  width: 100%;
  min-width: 0;
  gap: 12px;
  margin-top: 15px;
  max-width: 100%;
  box-sizing: border-box;
  .create-custom {
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    max-width: 100%;
    padding-inline: 10px;
    white-space: normal;
    overflow-wrap: anywhere;
    min-height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 1px solid #526f5b;
    border-radius: 11px;
    background: #526f5b;
    color: #fff;
    font-weight: 750;
    letter-spacing: 0.005em;
    box-shadow: 0 5px 14px rgba(48, 70, 54, 0.1);
    cursor: pointer;
    transition: background 0.16s ease, box-shadow 0.16s ease;
  }
  .create-custom:hover {
    background: #425d4b;
    box-shadow: 0 7px 18px rgba(48, 70, 54, 0.15);
  }
  .create-custom:active { background: #3d5745; }
  .divider {
    display: flex;
    align-items: center;
    gap: 9px;
    color: #829087;
    font-size: 11px;
  }
  .divider::before, .divider::after {
    content: "";
    height: 1px;
    flex: 1;
    background: #e1e8df;
  }
  .catalog-count {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    color: #66786b;
    font-size: 12px;
  }
  .catalog-count strong {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    border-radius: 999px;
    padding: 6px 9px;
    background: #e8f0e5;
    color: #46614e;
    font-size: 12px;
    flex: none;
    white-space: nowrap;
  }
  .catalog-count > span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .search { position: relative; min-width: 0; width: 100%; }
  .search input {
    box-sizing: border-box;
    display: block;
    width: 100%;
    min-width: 0;
    max-width: 100%;
    box-sizing: border-box;
  }
  .search svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #728178;
  }
  @container platform-main (max-width: 520px) {
    .catalog-count { align-items: flex-start; flex-wrap: wrap; }
    .catalog-count > span {
      white-space: normal;
      overflow: visible;
      text-overflow: clip;
      flex: 1 1 150px;
    }
  }
`;

export const Library = styled.div`
  display: grid;
  gap: 11px;
  max-height: 560px;
  margin-top: 12px;
  padding-right: 5px;
  overflow-y: auto;
  scrollbar-color: #a9bba9 transparent;
  scrollbar-width: thin;
  .item {
    min-width: 0;
    border: 1px solid #dce5da;
    border-radius: 16px;
    padding: 16px;
    background: #fff;
    transition: 0.18s;
  }
  .item:hover {
    border-color: #b9cbb9;
    box-shadow: 0 10px 28px rgba(51, 75, 58, 0.07);
  }
  .top { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
  .title { min-width: 0; overflow-wrap: anywhere; font-weight: 750; color: #3d5544; }
  .verified { color: #52745b; font-size: 11px; display: flex; align-items: center; gap: 4px; white-space: nowrap; flex: none; }
  .author { font-size: 11px; color: #68776d; margin-top: 6px; }
  .description { overflow-wrap: anywhere; font-size: 12px; color: #78847c; line-height: 1.5; margin: 9px 0; }
  .bottom { display: flex; justify-content: space-between; align-items: center; gap: 8px; font-size: 11px; color: #89948c; flex-wrap: wrap; }
  .links { display: flex; gap: 5px; min-width: 0; flex-wrap: wrap; }
  .more { border: 0; background: transparent; color: #526f5b; padding: 7px; display: flex; align-items: center; gap: 4px; font-weight: 650; }
  .add { border: 0; background: #e5eee2; color: #46614e; border-radius: 9px; padding: 8px 11px; font-weight: 700; }
  @container (max-width: 360px) {
    .top { flex-direction: column; gap: 6px; }
    .verified { white-space: normal; }
    .bottom { align-items: flex-start; flex-direction: column; }
    .links { flex-wrap: wrap; }
  }
  @container platform-main (max-width: 520px) {
    .top { flex-direction: column; gap: 6px; }
    .verified { white-space: normal; }
    .bottom { align-items: flex-start; flex-direction: column; }
    .links { flex-wrap: wrap; }
  }
`;
