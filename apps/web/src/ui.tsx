import styled from 'styled-components';
export const Page=styled.main`min-height:100dvh;background:radial-gradient(circle at 90% 0,#e1eadc 0,transparent 34%),#f3f6f0;`;
export const Shell=styled.div`width:min(100% - 32px,720px);margin:auto;`;
export const Card=styled.section`background:rgba(255,255,255,.82);border:1px solid rgba(87,116,94,.14);border-radius:28px;box-shadow:0 20px 60px rgba(48,70,54,.08);`;
export const Button=styled.button`border:0;border-radius:16px;padding:15px 22px;background:#526f5b;color:white;font-weight:650;transition:.18s;min-height:52px;&:hover{background:#425d4b;transform:translateY(-1px)}&:disabled{opacity:.45;cursor:not-allowed;transform:none}`;
export const GhostButton=styled(Button)`background:transparent;color:#526f5b;border:1px solid #ccd8cd;&:hover{background:#edf2ec}`;
