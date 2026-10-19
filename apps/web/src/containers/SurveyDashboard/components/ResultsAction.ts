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
    background: ${p=>p.$emphasized?'#52764b':'#e4e9e0'} !important;
    color: ${p=>p.$emphasized?'#ffffff':'#344b39'} !important;
    box-shadow: none !important;
    font-size: 13px;
    font-weight: 650;
    white-space: nowrap;
  }
  #root &&&:not(:disabled):hover {
    background: ${p=>p.$emphasized?'#45683f':'#d8e2d2'} !important;
    color: ${p=>p.$emphasized?'#ffffff':'#2c432f'} !important;
  }
  #root &&&:not(:disabled):active {
    background: ${p=>p.$emphasized?'#385933':'#cbd8c5'} !important;
    transform: translateY(1px);
  }
  #root &&&:focus-visible { outline: 2px solid #52764b; outline-offset: 3px; }
  #root &&&:disabled { opacity: .5; }
  #root &&& svg { flex-shrink: 0; }
`;
