import styled from 'styled-components';
export const Page=styled.main`display:flow-root;min-height:100dvh;background:radial-gradient(circle at 90% 0,#e1eadc 0,transparent 34%),#f3f6f0;`;
export const Shell=styled.div`width:min(100% - 32px,720px);margin:auto;`;
export const Card=styled.section`background:rgba(255,255,255,.82);border:1px solid rgba(87,116,94,.14);border-radius:28px;box-shadow:0 20px 60px rgba(48,70,54,.08);`;
export const Button=styled.button`border:0;border-radius:16px;padding:15px 22px;background:#526f5b;color:white;font-weight:650;transition:.18s;min-height:52px;&:hover{background:#425d4b;transform:translateY(-1px)}&:disabled{opacity:.45;cursor:not-allowed;transform:none}`;
export const GhostButton=styled(Button)`background:transparent;color:#526f5b;border:1px solid #ccd8cd;&:hover{background:#edf2ec}`;
export const Skeleton=styled.div<{$width?:string;$height?:string;$radius?:string}>`
  width:${p=>p.$width??'100%'};height:${p=>p.$height??'16px'};border-radius:${p=>p.$radius??'9px'};
  background:linear-gradient(100deg,#e7ede5 20%,#f5f8f3 38%,#e7ede5 56%);background-size:220% 100%;
  animation:skeleton-wave 1.35s ease-in-out infinite;
  @keyframes skeleton-wave{0%{background-position:100% 0}100%{background-position:-100% 0}}
  @media(prefers-reduced-motion:reduce){animation:none;background:#e7ede5}
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
