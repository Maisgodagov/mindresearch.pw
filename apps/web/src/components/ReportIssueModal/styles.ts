import styled from 'styled-components';

export const Content = styled.div`
  color:#748178;
  p{margin:0 0 18px;line-height:1.5;font-size:13px}
  .field{display:grid;gap:7px;margin-top:14px}
  .field label{font-size:12px;font-weight:750;color:#526558}
  .actions{display:flex;justify-content:flex-end;gap:9px;margin-top:17px}
  .success{padding:12px;border-radius:11px;background:#e9f3e6;color:#476750}
  .error{color:#9a5752;margin-top:10px}
  @media(max-width:480px){.actions{flex-direction:column-reverse}.actions button{width:100%}}
`;
