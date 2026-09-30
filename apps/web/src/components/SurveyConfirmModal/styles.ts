import styled from 'styled-components';

export const ModalContent = styled.div`
  color:#69776e;
  p{line-height:1.6;font-size:14px}
  .warning{padding:12px 13px;border-radius:12px;background:#f7f1e8;color:#716548;font-size:12px}
  .actions{display:flex;justify-content:flex-end;gap:10px;margin-top:22px}
  @media(max-width:480px){.actions{flex-direction:column-reverse}.actions button{width:100%}}
`;
