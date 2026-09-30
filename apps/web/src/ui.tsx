import styled from 'styled-components';
import { Card } from './components/Card';
import { Button } from './components/Button';
import { Page } from './components/Page';
export { Card, Button };
export { Page };
export const Shell=styled.div`width:min(100% - 32px,720px);margin:auto;min-width:0;@media(max-width:480px){width:calc(100% - 24px)}`;
export const GhostButton=styled(Button)`&&{background:transparent;color:#526f5b;border:1px solid #ccd8cd;box-shadow:none}&:hover{background:#edf2ec!important;box-shadow:none!important}`;
export const Skeleton=styled.div<{$width?:string;$height?:string;$radius?:string}>`
  width:${p=>p.$width??'100%'};height:${p=>p.$height??'16px'};border-radius:${p=>p.$radius??'9px'};
  background:#e7ede5;animation:skeleton-pulse 1.35s ease-in-out infinite;
  @keyframes skeleton-pulse{50%{opacity:.55}}
  @media(prefers-reduced-motion:reduce){animation:none}
`;
const SkeletonLayout=styled.div`
  display:grid;gap:18px;width:100%;
  .heading{display:grid;gap:10px;margin-bottom:4px}
  .cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
  .stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
  .card{padding:22px;border:1px solid rgba(87,116,94,.12);border-radius:20px;background:rgba(255,255,255,.72);display:grid;gap:13px}
  .form{padding:28px;border:1px solid rgba(87,116,94,.12);border-radius:22px;background:rgba(255,255,255,.72);display:grid;gap:16px}
  .rows{display:grid;gap:11px}.row{display:grid;grid-template-columns:34px 1.2fr .7fr .8fr;gap:15px;align-items:center;padding:13px 0;border-bottom:1px solid #edf0eb}
  @media(max-width:720px){.cards,.stats{grid-template-columns:1fr}.row{grid-template-columns:28px 1fr}.row>*:nth-child(n+3){display:none}}
`;
export function SkeletonScreen({variant='cards'}:{variant?:'cards'|'form'|'dashboard'|'public'}){
  return <SkeletonLayout aria-label="Загрузка" aria-busy="true"><div className="heading"><Skeleton $width="min(360px,70%)" $height="42px" $radius="13px"/><Skeleton $width="min(620px,90%)" $height="14px"/></div>{variant==='dashboard'&&<><div className="stats">{[1,2,3].map(x=><div className="card" key={x}><Skeleton $width="42%" $height="30px"/><Skeleton $width="70%"/></div>)}</div><div className="form"><Skeleton $width="34%" $height="26px"/><div className="rows">{[1,2,3,4,5].map(x=><div className="row" key={x}><Skeleton $height="28px"/><Skeleton/><Skeleton/><Skeleton/></div>)}</div></div></>}{variant==='form'&&<div className="form"><Skeleton $width="55%" $height="28px"/>{[1,2,3,4].map(x=><div key={x}><Skeleton $width="22%" $height="11px"/><Skeleton $height="48px" $radius="12px" style={{marginTop:7}}/></div>)}</div>}{variant==='public'&&<div className="form"><Skeleton $width="24%" $height="24px"/><Skeleton $width="82%" $height="54px" $radius="14px"/><Skeleton $width="94%"/><Skeleton $width="76%"/><Skeleton $width="140px" $height="48px" $radius="13px"/></div>}{variant==='cards'&&<div className="cards">{[1,2,3,4].map(x=><div className="card" key={x}><Skeleton $width="28%" $height="22px"/><Skeleton $width="58%" $height="27px"/><Skeleton $width="90%"/><Skeleton $width="66%"/><Skeleton $height="1px"/><Skeleton $width="72%" $height="34px"/></div>)}</div>}</SkeletonLayout>
}
