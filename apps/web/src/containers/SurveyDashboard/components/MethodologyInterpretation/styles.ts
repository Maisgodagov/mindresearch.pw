import styled, { css } from "styled-components";

const profile = css`
  display:grid;
  gap:0;
  margin-top:16px;
  max-width:960px;
  .scale { display:grid; grid-template-columns:minmax(180px, 240px) minmax(0,1fr) 52px; align-items:center; gap:8px 20px; padding:12px 0; border-bottom:1px solid var(--color-brand-soft); }
  .scale:last-of-type { border-bottom:0; }
  .name { color:var(--color-text-354d3b); font-size:12px; line-height:1.5; }
  .name small { display:block; margin-top:3px; color:var(--color-text-526557); font-size:11px; }
  .value { text-align:right; color:var(--color-text-36563b); font-size:14px; font-weight:700; font-variant-numeric:tabular-nums; }
  .track { height:8px; position:relative; border-radius:3px; background:var(--color-brand-soft); }
  .fill { height:100%; border-radius:3px; background:var(--color-brand); }
  .caption, .level { grid-column:2 / 4; color:var(--color-text-526557); font-size:11px; line-height:1.5; }
  .limits { grid-column:2; display:flex; justify-content:space-between; color:var(--color-text-526557); font-size:10px; }
  .chart-note { margin-top:12px; color:var(--color-text-526557); font-size:11px; line-height:1.6; }
  .chart-axis { grid-column:1 / -1; position:relative; margin-left:260px; margin-right:72px; height:18px; color:var(--color-text-526557); font-size:10px; font-variant-numeric:tabular-nums; }
  .chart-axis span { position:absolute; transform:translateX(-50%); }
  .chart-axis span:first-child { left:0; transform:none; }
  .chart-axis span:last-child { right:0; transform:none; }
  &.support-bands .track::before, &.support-bands .track::after { content:''; position:absolute; top:-3px; bottom:-3px; width:1px; background:var(--color-border-strong); }
  &.support-bands .track::before { left:42.857%; }
  &.support-bands .track::after { left:71.429%; }
  @media(max-width:700px) {
    .scale { grid-template-columns:minmax(0,1fr) 48px; gap:8px 12px; padding:12px 0; }
    .name { grid-column:1; }
    .value { grid-column:2; grid-row:1; align-self:start; }
    .track { grid-column:1 / -1; grid-row:2; }
    .caption, .level { grid-column:1 / -1; }
    .limits { grid-column:1 / -1; }
    .chart-axis { margin:0; }
    .chart-note { font-size:10px; }
  }
`;

export const ScoreProfile = styled.div`${profile}`;
export const SupportProfile = styled.div`${profile}`;


export const SccsSummary = styled.div`
  max-width:960px; padding:4px 0; color:var(--color-text-354d3b);
  .sccs-main { display:grid; grid-template-columns:140px minmax(0,1fr) 140px; gap:28px; align-items:center; }
  .sccs-primary > span, .sccs-total > span { display:block; color:var(--color-text-526557); font-size:11px; margin-bottom:3px; }
  .sccs-primary strong { font-size:22px; font-weight:700; font-variant-numeric:tabular-nums; }
  .sccs-primary small, .sccs-total small { font-size:12px; font-weight:400; color:var(--color-text-526557); }
  .sccs-total { padding-left:24px; border-left:1px solid var(--color-brand-soft); }
  .sccs-total strong { font-size:17px; font-weight:650; font-variant-numeric:tabular-nums; }
  .sccs-axis { display:flex; justify-content:space-between; color:var(--color-text-526557); font-size:10px; margin-bottom:8px; font-variant-numeric:tabular-nums; }
  .sccs-track { position:relative; height:6px; background:var(--color-brand-soft); border-radius:3px; }
  .sccs-fill { display:block; height:100%; background:var(--color-brand); border-radius:3px; }
  .sccs-point { position:absolute; top:50%; transform:translate(-50%,-50%); width:10px; height:10px; background:var(--color-brand); border:2px solid var(--color-brand-soft); border-radius:50%; }
  .sccs-reference { position:absolute; top:-4px; bottom:-4px; width:1px; background:var(--color-brand); }
  .sccs-range-caption { display:block; color:var(--color-text-526557); font-size:10px; margin-top:8px; }
  .sccs-comparison { margin-top:12px; padding-top:10px; border-top:1px solid var(--color-brand-soft); display:flex; align-items:center; gap:6px; font-size:12px; }
  .sccs-comparison button { display:inline-flex; align-items:center; justify-content:center; width:24px; height:24px; min-height:24px; padding:0; border:0; border-radius:4px; background:transparent; color:var(--color-text-52764b); cursor:pointer; }
  .sccs-comparison button:hover { background:var(--color-brand-soft); }
  .sccs-comparison button:focus-visible { outline:2px solid var(--color-brand); outline-offset:2px; }
  @media(max-width:700px) { .sccs-main { grid-template-columns:1fr auto; gap:16px; } .sccs-range { grid-column:1 / -1; grid-row:2; } .sccs-total { grid-column:2; grid-row:1; padding-left:16px; } }
`;
