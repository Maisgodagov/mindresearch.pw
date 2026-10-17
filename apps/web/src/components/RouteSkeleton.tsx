import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Skeleton, SkeletonScreen, type SkeletonVariant } from './LoadingSkeleton';
import { Frame, Main } from '../containers/PlatformLayout/styles';
import { collapsedStorageKey } from "../containers/PlatformLayout/const";
import { sidebarWidth } from './PlatformSidebar/const';

const Navigation = styled.aside`
  padding: 24px 16px; display: flex; flex-direction: column; gap: 16px;
  background: #fbfcfa; border-right: 1px solid var(--color-border);
  @media(max-width:760px) { display: none; }
`;
const PublicFrame = styled.main`
  width: min(100% - 32px,720px); margin: 0 auto; padding: 48px 0;
`;

export function routeSkeletonVariant(path: string): SkeletonVariant {
  if (path.includes('/results') || path === '/admin' || path === '/app/admin') return 'dashboard';
  if (path.endsWith('/edit') || path.endsWith('/new') || path.endsWith('/methodologies')) return 'builder';
  if (path.includes('/profile') || path.startsWith('/p/') || /\/admin\/users\/[^/]+$/.test(path)) return 'profile';
  if (path.includes('/community')) return 'community';
  if (path.includes('/preview') || path.startsWith('/s/')) return 'public';
  if (path.startsWith('/invite/')) return 'invitation';
  if (path.endsWith('/review')) return 'review';
  if (/\/admin\/users\/[^/]+\/surveys\/[^/]+$/.test(path)) return 'cards';
  if (path === '/app') return 'cards';
  return 'form';
}

export function RouteSkeleton() {
  const { pathname } = useLocation();
  const variant = routeSkeletonVariant(pathname);
  if (!pathname.startsWith('/app')) return <PublicFrame><SkeletonScreen variant={variant} fieldCount={pathname === "/login" || pathname.includes("password") ? 2 : 4} /></PublicFrame>;
  const collapsed = localStorage.getItem(collapsedStorageKey) === '1';
  return <Frame $collapsed={collapsed}>
    <Navigation aria-hidden="true">
      <Skeleton $height="36px" style={{marginBottom:16}} />
      {[1,2,3,4].map(i => <Skeleton key={i} $height="42px" $width={collapsed ? `${sidebarWidth.collapsed - 32}px` : '100%'} />)}
    </Navigation>
    <Main><SkeletonScreen variant={variant} /></Main>
  </Frame>;
}
