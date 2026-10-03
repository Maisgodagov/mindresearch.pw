import styled from "styled-components";

export const CatalogContent = styled.div<{ $locked: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  pointer-events: ${({ $locked }) => ($locked ? "none" : "auto")};
  opacity: ${({ $locked }) => ($locked ? 0.56 : 1)};

  .create-custom,
  .choose-method {
    min-height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    padding-inline: 14px;
    border-radius: 10px;
    font-weight: 750;
    white-space: nowrap;
    flex: 0 0 auto;
  }
  .create-custom {
    border: 1px solid #d5e1d3;
    background: #f7faf5;
    color: #45624e;
    box-shadow: none;
  }
  .create-custom:hover {
    border-color: #9cb49c !important;
    background: #edf4ea !important;
    color: #3e5e48 !important;
  }
  .choose-method {
    position: relative;
    padding-right: 54px;
    border: 1px solid #d5e1d3;
    background: #f7faf5;
    color: #45624e;
  }
  .choose-method:hover {
    border-color: #9cb49c !important;
    background: #edf4ea !important;
    color: #3e5e48 !important;
  }
  .available-count {
    position: absolute;
    right: 12px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: #718578;
    font-size: 11px;
    font-weight: 650;
  }
`;

export const CatalogTools = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 18px;
  .search {
    position: relative;
    flex: 1;
    min-width: 0;
  }
  .search input {
    display: block;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    max-width: 100%;
    height: 46px;
    padding-left: 42px;
  }
  .search svg {
    position: absolute;
    z-index: 1;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #77877c;
  }
  .results-count {
    flex: none;
    color: #7a887f;
    font-size: 12px;
  }
  @media (max-width: 560px) {
    align-items: stretch;
    flex-direction: column;
    gap: 7px;
    .results-count { text-align: right; }
  }
`;

export const CatalogIntro = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  p { margin: 0; color: #78847c; font-size: 13px; line-height: 1.5; }
  > span {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 10px;
    border-radius: 999px;
    background: #e8f0e5;
    color: #46614e;
    font-size: 12px;
    font-weight: 700;
  }
  @media (max-width: 560px) { flex-direction: column; gap: 9px; }
`;

export const Library = styled.div`
  display: grid;
  gap: 9px;
  margin-top: 12px;
  padding: 1px 5px 4px 1px;
  .item {
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    padding: 14px 15px;
    border: 1px solid #dce5da;
    border-radius: 14px;
    background: #fff;
    transition: border-color 0.16s, box-shadow 0.16s;
  }
  .item:hover {
    border-color: #b9cbb9;
    box-shadow: 0 7px 20px rgba(51, 75, 58, 0.06);
  }
  .item-main { min-width: 0; }
  .top { display: flex; align-items: flex-start; gap: 10px; }
  .title { min-width: 0; overflow-wrap: anywhere; font-weight: 750; color: #3d5544; line-height: 1.45; }
  .verified { color: #52745b; font-size: 11px; display: inline-flex; align-items: center; gap: 4px; white-space: nowrap; flex: none; }
  .author { font-size: 11px; color: #68776d; margin-top: 4px; }
  .description { display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow-wrap: anywhere; font-size: 12px; color: #78847c; line-height: 1.45; margin-top: 5px; }
  .item-meta { margin-top: 6px; color: #89948c; font-size: 11px; }
  .links { display: flex; align-items: center; gap: 6px; flex: none; }
  .more { border: 0; background: transparent; color: #526f5b; padding: 9px; display: inline-flex; align-items: center; gap: 5px; font-weight: 650; }
  .add { min-height: 38px; padding-inline: 13px; border-radius: 9px; font-weight: 700; }
  .empty { padding: 32px 12px; text-align: center; color: #7c8880; }
  .load-more-sentinel { height: 8px; }
  @media (max-width: 680px) {
    .item { align-items: stretch; flex-direction: column; gap: 8px; }
    .top { flex-direction: column; gap: 4px; }
    .verified { white-space: normal; }
    .links { justify-content: flex-end; }
  }
`;
