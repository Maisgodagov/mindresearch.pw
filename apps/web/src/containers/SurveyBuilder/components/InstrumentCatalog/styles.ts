import styled from "styled-components";

export const CatalogContent = styled.div<{ $locked: boolean }>`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: stretch;
  gap: 3px;
  margin: 0;
  pointer-events: ${({ $locked }) => ($locked ? "none" : "auto")};
  opacity: ${({ $locked }) => ($locked ? 0.56 : 1)};

  .create-custom,
  .choose-method {
    width: 100%;
    min-height: 38px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    padding-inline: 11px;
    border: 0 !important;
    border-radius: 7px;
    background: transparent !important;
    color: var(--color-text-405947);
    font-size: 12px;
    font-weight: 650;
    white-space: nowrap;
    flex: 0 0 auto;
    box-shadow: none;
    transition: background-color 130ms ease, color 130ms ease;
  }
  .choose-method { position: relative; padding-right: 9px; }
  .create-custom:hover,
  .choose-method:hover { background: var(--color-brand-soft) !important; color: var(--color-text-2d4d35) !important; }
  .available-count {
    position: static;
    flex: none;
    margin-left: auto;
    padding: 3px 5px;
    border-radius: 5px;
    background: var(--color-brand-soft);
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--color-text-6d7d70);
    font-size: 9px;
    font-weight: 600;
  }
`;

export const CatalogToolbar = styled.div`
  position: sticky;
  top: -6px;
  z-index: 4;
  padding: 4px 0 11px;
  border-bottom: 1px solid var(--color-brand-soft);
  background: var(--color-surface);
`;

export const CatalogTools = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
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
    height: 44px;
    padding: 0 13px 0 41px;
    border: 1px solid var(--color-brand-soft);
    border-radius: 10px;
    background: var(--color-surface);
    transition: border-color .15s ease, box-shadow .15s ease;
  }
  .search input:focus {
    border-color: var(--color-brand);
    box-shadow: 0 0 0 3px var(--color-brand-alpha-130);
    outline: 0;
  }
  .search svg {
    position: absolute;
    z-index: 1;
    left: 13px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-text-68796d);
  }
  .results-count {
    flex: none;
    color: var(--color-text-69786d);
    font-size: 11px;
    white-space: nowrap;
  }
  .category-filter {
    position: relative;
    display: flex;
    align-items: center;
    flex: 0 0 250px;
    min-width: 0;
    height: 44px;
    color: var(--color-text-68796d);
  }
  .category-trigger {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    height: 44px;
    padding: 0 12px;
    border: 1px solid var(--color-brand-soft);
    border-radius: 10px;
    background: var(--color-surface);
    color: var(--color-text-405947);
    font: inherit;
    font-size: 12px;
    text-align: left;
    cursor: pointer;
    transition: border-color .15s ease, box-shadow .15s ease, background .15s ease;
  }
  .category-trigger:hover { border-color: var(--color-border-strong); background: var(--color-surface-muted); }
  .category-trigger:focus-visible,
  .category-trigger[aria-expanded="true"] {
    border-color: var(--color-brand);
    outline: 3px solid var(--color-brand-alpha-150);
    outline-offset: 1px;
  }
  .category-trigger > span { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .category-trigger > svg { flex: none; color: var(--color-text-718174); }
  .category-menu {
    position: absolute;
    z-index: 20;
    top: calc(100% + 6px);
    right: 0;
    box-sizing: border-box;
    width: max(100%, 280px);
    max-width: calc(100vw - 40px);
    max-height: min(56vh, 430px);
    overflow-y: auto;
    padding: 6px;
    border: 1px solid var(--color-brand-soft);
    border-radius: 12px;
    background: var(--color-surface);
    box-shadow: 0 14px 34px var(--color-brand-alpha-180), 0 2px 7px var(--color-brand-alpha-080);
    overscroll-behavior: contain;
  }
  .category-option-group + .category-option-group { margin-top: 2px; padding-top: 3px; border-top: 1px solid var(--color-brand-soft); }
  .category-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    width: 100%;
    min-height: 32px;
    padding: 6px 10px;
    border: 0;
    border-radius: 7px;
    background: transparent;
    color: var(--color-text-485c4c);
    font: inherit;
    font-size: 12px;
    line-height: 1.35;
    text-align: left;
    cursor: pointer;
  }
  .category-option:hover,
  .category-option:focus-visible { outline: 0; background: var(--color-surface-muted); color: var(--color-text-35563a); }
  .category-option.selected { background: var(--color-brand-soft); color: var(--color-text-355c38); }
  .category-option.parent { min-height: 34px; font-size: 13px; font-weight: 700; }
  .category-option.parent > span,
  .category-option.child > span:last-child { flex: none; color: var(--color-text-768579); font-size: 11px; font-weight: 550; }
  .category-option.child { padding-left: 22px; font-size: 12px; font-weight: 450; }
  .category-menu::-webkit-scrollbar { width: 9px; }
  .category-menu::-webkit-scrollbar-thumb { border: 2px solid var(--color-surface); border-radius: 9px; background: var(--color-border-strong); }
  .category-menu::-webkit-scrollbar-track { background: transparent; }
  @media (max-width: 560px) {
    .category-menu { width: 100%; max-width: 100%; }
  }
  @media (max-width: 560px) {
    align-items: stretch;
    flex-direction: column;
    gap: 7px;
    .results-count { text-align: right; }
    .category-filter { flex-basis: auto; width: 100%; }
  }
`;

export const CatalogIntro = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  p {
    max-width: 72ch;
    margin: 0;
    color: var(--color-text-65736a);
    font-size: 12px;
    line-height: 1.5;
  }
  .catalog-total {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 9px;
    border: 0;
    border-radius: 999px;
    background: var(--color-surface-muted);
    color: var(--color-text-47654a);
    font-size: 11px;
    font-weight: 650;
    white-space: nowrap;
  }
  > span {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 9px;
    border-radius: 999px;
    background: var(--color-surface-muted);
    color: var(--color-text-47654a);
    font-size: 11px;
    font-weight: 650;
    white-space: nowrap;
  }
  @media (max-width: 560px) {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }
`;

export const Library = styled.div`
  display: grid;
  gap: 9px;
  margin-top: 12px;
  padding: 0 1px 4px;
  .item {
    min-width: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 20px;
    padding: 12px 13px;
    border: 1px solid var(--color-brand-soft);
    border-radius: 11px;
    background: var(--color-surface);
    transition: border-color .15s ease, background-color .15s ease, box-shadow .15s ease;
  }
  .item:hover {
    border-color: var(--color-border-strong);
    background: var(--color-surface);
    box-shadow: 0 2px 8px var(--color-brand-alpha-045);
  }
  .item-main { min-width: 0; }
  .top { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 10px; }
  .title { min-width: 0; overflow-wrap: anywhere; color: var(--color-text-2d3d32); font-size: 13px; font-weight: 700; line-height: 1.45; }
  .verified {
    display: inline-grid;
    place-items: center;
    flex: 0 0 22px;
    width: 22px;
    height: 22px;
    border-radius: 7px;
    background: var(--color-surface-muted);
    color: var(--color-text-4c714c);
  }
  .author {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 5px 7px;
    margin-top: 6px;
    color: var(--color-text-495b4d);
    font-size: 11px;
    font-weight: 550;
    line-height: 1.45;
  }
  .author-label {
    padding: 3px 7px;
    border: 0;
    border-radius: 6px;
    background: var(--color-surface-muted);
    color: var(--color-text-50664f);
    font-size: 10px;
    font-weight: 700;
  }
  .description {
    display: -webkit-box;
    max-width: 78ch;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow-wrap: anywhere;
    margin-top: 6px;
    color: var(--color-text-5e6e62);
    font-size: 12px;
    line-height: 1.5;
  }
  .item-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; margin-top: 9px; }
  .question-count,
  .scoring-type {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    min-height: 24px;
    padding: 4px 9px;
    border: 0;
    border-radius: 7px;
    background: var(--color-surface-muted);
    color: var(--color-text-5c6e60);
    font-size: 10px;
    font-weight: 650;
    line-height: 1.2;
  }
  .question-count svg { color: var(--color-text-75877a); }
  .scoring-type { background: var(--color-brand-soft); color: var(--color-text-466547); }
  .scoring-type svg { color: var(--color-text-52764b); }
  .category-tag {
    display: inline-flex;
    align-items: center;
    max-width: 100%;
    min-height: 24px;
    padding: 4px 9px;
    border-radius: 7px;
    background: var(--color-surface-muted);
    color: var(--color-text-50664f);
    font-size: 10px;
    font-weight: 600;
    line-height: 1.2;
  }
  .links {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    align-self: stretch;
    justify-content: space-between;
    gap: 12px;
    width: 160px;
    flex: none;
  }
  .more {
    min-height: 36px;
    padding: 0 9px;
    border: 0 !important;
    box-shadow: none !important;
    border-radius: 8px;
    background: transparent;
    color: var(--color-text-4a674e);
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    font-weight: 650;
    justify-content: center;
    align-self: flex-end;
  }
  .more:hover, .more:active { border: 0 !important; box-shadow: none !important; background: var(--color-surface-muted); color: var(--color-text-365532); }
  .add {
    min-height: 36px;
    padding-inline: 12px;
    border: 1px solid var(--color-brand) !important;
    border-radius: 8px;
    background: var(--color-brand) !important;
    color: var(--color-text-fff) !important;
    font-size: 13px;
    font-weight: 700;
    box-shadow: none;
    white-space: normal;
    line-height: 1.25;
    align-self: flex-end;
  }
  .add:hover:not(:disabled) { border-color: var(--color-brand) !important; background: var(--color-brand) !important; }
  .add:disabled { border-color: var(--color-brand-soft) !important; background: var(--color-brand-soft) !important; color: var(--color-text-7b887d) !important; }
  .empty { padding: 32px 12px; text-align: center; color: var(--color-text-59695d); }
  .load-more-sentinel { height: 8px; }
  @media (max-width: 680px) {
    .item { grid-template-columns: minmax(0, 1fr); align-items: start; gap: 9px; }
    .links { width: min(100%, 200px); justify-self: end; align-self: auto; }
  }
  @media (max-width: 460px) {
    .item { padding: 9px 8px; gap: 6px; border-radius: 9px; }
    .top { align-items: center; gap: 4px 7px; }
    .title { font-size: 12px; }
    .description { margin-top: 4px; font-size: 11px; line-height: 1.4; }
    .item-meta { gap: 4px; margin-top: 6px; }
    .category-tag,
    .question-count,
    .scoring-type { min-height: 21px; padding: 3px 7px; font-size: 9px; }
    .links { flex-direction: row; align-items: center; justify-content: space-between; gap: 5px; width: 100%; }
    .more { min-height: 30px; padding: 0 5px; font-size: 11px; align-self: auto; }
    .add { min-height: 31px; padding-inline: 9px; font-size: 11px; align-self: auto; }
  }
`;

export const CatalogPagination = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
  padding: 12px 2px 2px;
  border-top: 1px solid var(--color-brand-soft);
  color: var(--color-text-69786d);
  font-size: 12px;
  .pages { display: flex; align-items: center; flex-wrap: wrap; gap: 5px; }
  .page-number,
  .page-arrow {
    display: inline-grid;
    place-items: center;
    min-width: 34px;
    height: 34px;
    padding: 0 8px;
    border: 1px solid var(--color-brand-soft);
    border-radius: 8px;
    background: var(--color-surface);
    color: var(--color-text-405947);
    font-size: 12px;
    box-shadow: none;
  }
  .page-ellipsis { display: inline-grid; place-items: center; min-width: 20px; height: 34px; color: var(--color-text-738176); }
  .page-number:hover:not(:disabled),
  .page-arrow:hover:not(:disabled) { border-color: var(--color-brand); background: var(--color-surface-muted); color: var(--color-text-315238); }
  .page-number.active { border-color: var(--color-brand); background: var(--color-brand); color: var(--color-text-fff); }
  .page-arrow:disabled { cursor: default; opacity: .45; }
  @media (max-width: 560px) { justify-content: center; }
`;
