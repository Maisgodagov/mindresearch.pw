import styled from 'styled-components';
import { Card } from './components/Card';
import { Button } from './components/Button';
import { Page } from './components/Page';
export { Card, Button };
export { Page };
export const Shell=styled.div`width:min(100% - 32px,720px);margin:auto;min-width:0;@media(max-width:480px){width:calc(100% - 24px)}`;
export const GhostButton=styled(Button)`&&{background:transparent;color:var(--color-text-526f5b);border:1px solid var(--color-border-strong);box-shadow:none}&:hover{background:var(--color-brand-soft)!important;box-shadow:none!important}`;
export { Skeleton, SkeletonScreen } from './components/LoadingSkeleton';
