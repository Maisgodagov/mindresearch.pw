import styled from 'styled-components';

export const FormContent = styled.div`
  .message { display:flex; align-items:flex-start; gap:8px; padding:13px; border-radius:11px; background:#eaf2e7; color:#4d7057; }
  .message svg { flex:none; margin-top:2px; }
  .error { color:#a05252; }
  .back { display:block; text-align:center; margin-top:18px; color:#58705f; font-size:13px; }
`;

export const ResetForm = styled.form`
  label { display:block; color:#657269; font-size:13px; margin:18px 0 7px; }
  input { width:100%; }
  button[type="submit"] { width:100%; margin-top:22px; }
`;
