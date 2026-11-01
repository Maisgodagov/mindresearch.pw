import styled from 'styled-components';
import { Button } from '../../../ui';

export const ResultsAction = styled(Button).attrs({ type: 'text' as const })<{ $emphasized?: boolean }>`
  #root &&& {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 40px;
    height: 40px;
    padding: 0 13px;
    border: 0 !important;
    border-radius: 7px;
    background: ${p=>p.$emphasized?'var(--color-brand)':'var(--color-brand-soft)'} !important;
    color: ${p=>p.$emphasized?'var(--color-surface)':'var(--color-ink)'} !important;
    box-shadow: none !important;
    font-size: 13px;
    font-weight: 650;
    white-space: nowrap;
  }
  #root &&&:not(:disabled):hover {
    background: ${p=>p.$emphasized?'var(--color-brand)':'var(--color-brand-soft)'} !important;
    color: ${p=>p.$emphasized?'var(--color-surface)':'var(--color-ink)'} !important;
  }
  #root &&&:not(:disabled):active {
    background: ${p=>p.$emphasized?'var(--color-brand)':'var(--color-border-strong)'} !important;
    transform: translateY(1px);
  }
  #root &&&:focus-visible { outline: 2px solid var(--color-brand); outline-offset: 3px; }
  #root &&&:disabled { opacity: .5; }
  #root &&& svg { flex-shrink: 0; }
`;
