import styled from "styled-components";

export const Profile = styled.div`
  display:grid; gap:0; margin:14px 0 3px; max-width:960px;
  .scale { display:grid; grid-template-columns:minmax(180px,240px) minmax(0,1fr) 52px; gap:8px 20px; align-items:center; padding:12px 0; border-bottom:1px solid #dce5d7; }
  .scale:last-child { border-bottom:0; }
  .label { color:#354d3b; font-size:12px; line-height:1.5; }
  .label small { display:block; color:#526557; margin-top:3px; font-size:11px; }
  .value { color:#36563b; text-align:right; font-size:14px; font-weight:700; font-variant-numeric:tabular-nums; }
  .track { height:8px; border-radius:3px; background:#dce6d6; overflow:hidden; }
  .fill { height:100%; border-radius:inherit; background:#648366; }
  .range-limits { display:flex; justify-content:space-between; margin-top:5px; color:#526557; font-size:10px; font-variant-numeric:tabular-nums; }
  .scale-plot { padding-top:12px; }
  .no-range { color:#526557; font-size:11px; }
  .caption { grid-column:2 / 4; color:#526557; font-size:11px; }
  @media(max-width:700px) {
    .scale { grid-template-columns:minmax(0,1fr) 52px; gap:8px 12px; }
    .label { grid-column:1; }
    .value { grid-column:2; grid-row:1; align-self:start; }
    .scale-plot, .track, .no-range { grid-column:1 / -1; grid-row:2; }
    .scale-plot { padding-top:0; }
    .caption { grid-column:1 / -1; }
  }
`;
