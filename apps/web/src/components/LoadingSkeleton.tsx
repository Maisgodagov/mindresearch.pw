import styled, { keyframes } from 'styled-components';
const pulse = keyframes`50% { opacity: .5; }`;

export const Skeleton = styled.div.attrs({ 'aria-hidden': true })<{
  $width?: string; $height?: string; $radius?: string;
}>`
  width: ${p => p.$width ?? '100%'};
  max-width: 100%;
  height: ${p => p.$height ?? '16px'};
  border-radius: ${p => p.$radius ?? '6px'};
  background: var(--color-skeleton, #e7ede5);
  animation: ${pulse} 1.5s ease-in-out infinite;
  @media (prefers-reduced-motion: reduce) { animation: none; }
  @media (forced-colors: active) { background: GrayText; }
`;

const Layout = styled.div`
  display: grid; gap: 20px; width: 100%; min-width: 0;
  .sk-heading, .sk-stack { display: grid; gap: 12px; min-width: 0; }
  .sk-heading { margin-bottom: 8px; }
  .sk-actions { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
  .sk-cards { display: grid; grid-template-columns: repeat(auto-fit,minmax(min(100%,max(500px,calc((100% - 16px)/2))),1fr)); gap: 16px; }
  .sk-panel { padding: 24px; border: 1px solid var(--color-border,#d9e2d8); border-radius: 14px; background: var(--color-surface,#fff); min-width: 0; }
  .sk-card { display: grid; gap: 16px; min-height: 300px; }
  .sk-stats { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 16px; }
  .sk-row { display: grid; grid-template-columns: 32px 1.5fr 1fr .7fr; gap: 16px; align-items: center; padding: 16px 0; border-bottom: 1px solid var(--color-border,#d9e2d8); }
  .sk-identity { display: flex; align-items: center; gap: 24px; }
  .sk-identity > :first-child { flex-shrink: 0; }
  .sk-identity > .sk-stack { flex: 1; }
  .sk-fields { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 24px; margin-top: 28px; }
  .sk-editor { display: grid; grid-template-columns: minmax(0,2fr) minmax(280px,1fr); gap: 24px; align-items: start; }
  .sk-public { width: min(100%,720px); margin-inline: auto; }
  .sk-feed { display: grid; gap: 16px; }
  .sk-research { display: grid; grid-template-columns: minmax(0,1fr) 160px; gap: 24px; }
  @media(max-width:720px) {
    .sk-editor, .sk-fields, .sk-stats { grid-template-columns: 1fr; }
    .sk-editor > :last-child { display: none; }
    .sk-panel { padding: 20px; }
    .sk-research { grid-template-columns: 1fr; gap: 18px; }
    .sk-identity { gap: 16px; flex-wrap: wrap; }
    .sk-identity > .sk-stack { flex: 1 1 140px; }
    .sk-identity > :last-child { margin-top: 4px; }
    .sk-row { grid-template-columns: 28px 1fr .7fr; gap: 12px; }
    .sk-row > :last-child { display: none; }
  }
`;

export type SkeletonVariant = 'cards' | 'form' | 'dashboard' | 'public' | 'profile' | 'builder' | 'community' | 'table' | 'details' | 'sharing' | 'invitation' | 'results' | 'review';
const Line = ({ width = '100%', height = '16px' }: { width?: string; height?: string }) => <Skeleton $width={width} $height={height} />;
const Actions = () => <div className="sk-actions"><Line width="140px" height="42px" /><Line width="110px" height="42px" /></div>;
const Heading = () => <div className="sk-heading"><Line width="min(360px,75%)" height="42px" /><Line width="min(540px,90%)" /></div>;
const Fields = ({ count = 4 }: { count?: number }) => <div className="sk-stack">{Array.from({length:count},(_,i)=>i).map(i => <div className="sk-stack" key={i}><Line width="30%" height="12px" /><Line height="42px" /></div>)}<Actions /></div>;
const Rows = ({ count = 5 }: { count?: number }) => <div>{Array.from({ length: count },(_,i) => <div className="sk-row" key={i}><Skeleton $height="30px" $radius="50%" /><Line width={i % 2 ? '72%' : '90%'} /><Line width="70%" /><Line width="80%" /></div>)}</div>;
const Cards = () => <div className="sk-cards">{[1,2,3,4].map(i => <div className="sk-panel sk-card" key={i}><Line width="90px" height="24px" /><Line width={i % 2 ? '70%' : '85%'} height="26px" /><Line width="95%" /><Line width="65%" /><Actions /></div>)}</div>;
const Feed = () => <div className="sk-feed">{[1,2,3].map(i => <div className="sk-panel sk-research" key={i}><div className="sk-stack"><Line width="65%" height="24px" /><Line width="95%" /><Line width="75%" /><div className="sk-actions"><Line width="100px" height="24px" /><Line width="80px" height="24px" /></div></div><div className="sk-stack"><Line width="90px" /><Line width="70px" /><Line height="42px" /></div></div>)}</div>;

export function SkeletonScreen({ variant = 'cards', heading = true, label = 'Загрузка содержимого', fieldCount = 4 }: { variant?: SkeletonVariant; heading?: boolean; label?: string; fieldCount?: number }) {
  return <Layout role="status" aria-label={label} aria-busy="true" data-skeleton={variant}>
    {heading && <Heading />}
    {variant === 'cards' && <Cards />}
    {variant === 'form' && <div className="sk-panel"><Fields count={fieldCount} /></div>}
    {variant === 'builder' && <><Actions /><div className="sk-editor"><div className="sk-stack"><div className="sk-panel"><Fields /></div><div className="sk-panel sk-stack"><Line width="55%" height="24px" /><Line height="88px" /><Actions /></div></div><div className="sk-panel sk-stack"><Line width="70%" height="24px" /><Rows count={6} /></div></div></>}
    {variant === 'profile' && <div className="sk-panel"><div className="sk-identity"><Skeleton $width="112px" $height="112px" $radius="50%" /><div className="sk-stack"><Line width="55%" height="28px" /><Line width="90%" /><Line width="70%" /></div><Line width="140px" height="42px" /></div><div className="sk-fields">{[1,2,3,4,5,6].map(i => <div className="sk-stack" key={i}><Line width="40%" height="12px" /><Line width="75%" height="22px" /></div>)}</div></div>}
    {variant === 'dashboard' && <><Actions /><div className="sk-stats">{[1,2,3].map(i => <div className="sk-panel sk-stack" key={i}><Line width="60%" /><Line width="40%" height="32px" /></div>)}</div><div className="sk-panel"><div className="sk-stack"><Line width="40%" height="24px" /><Actions /></div><Rows /></div></>}
    {variant === 'results' && <div className="sk-stack"><Line width="100px" height="24px" /><Line width="85%" height="40px" /><Line width="90%" />{[1,2,3].map(i => <div className="sk-panel sk-stack" key={i}><Line width="60%" height="24px" /><Line height="12px" /><Line width="85%" /><Line width="70%" /></div>)}</div>}
    {variant === 'review' && <div className="sk-stack">{[1,2,3].map(i => <div className="sk-panel sk-stack" key={i}><Line width="40%" height="12px" /><Line width="65%" height="26px" /><Line width="80%" /><Line height="72px" /><Actions /></div>)}</div>}
    {variant === 'table' && <div className="sk-panel"><Rows /></div>}
    {variant === 'details' && <div className="sk-stack">{[1,2,3].map(i => <div className="sk-stack" key={i}><Line width="75%" height="20px" /><Line width="55%" /><Line width="85%" /></div>)}</div>}
    {variant === 'community' && <><Actions /><Feed /></>}
    {variant === 'sharing' && <div className="sk-stack" style={{marginTop:24}}>{[1,2].map(i => <div key={i}><Line width="42%" height="22px" /><Rows count={2} /></div>)}</div>}
    {variant === 'invitation' && <div className="sk-stack"><Line width="95%" /><Line width="80%" /><Actions /></div>}
    {variant === 'public' && <div className="sk-panel sk-public sk-stack"><Line width="100px" height="24px" /><Line width="85%" height="36px" /><Line width="95%" /><Line width="75%" /><div className="sk-stack" style={{marginBlock:16}}>{[1,2,3,4].map(i => <Line key={i} height="48px" />)}</div><Actions /></div>}
  </Layout>;
}

// Ant Design uses this for every pending action, including modal confirmations.
// Keep the action text and disabled/loading behavior while replacing its spinner.
export const ActionSkeleton = styled.span.attrs({ 'aria-hidden': true })`
  display: inline-block; width: 18px; height: 10px; border-radius: 3px;
  background: currentColor; opacity: .35;
  animation: ${pulse} 1.5s ease-in-out infinite;
  @media(prefers-reduced-motion:reduce) { animation: none; }
`;
