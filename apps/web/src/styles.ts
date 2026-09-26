import {createGlobalStyle} from 'styled-components';
export const GlobalStyle=createGlobalStyle`
  :root{--font-heading:"Lora Variable";font-family:"Manrope Variable",ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:#24332b;background:#f3f6f0;font-synthesis:none}
  *{box-sizing:border-box;scrollbar-width:thin;scrollbar-color:#8fa58f transparent}
  *::-webkit-scrollbar{width:10px;height:10px}
  *::-webkit-scrollbar-track{background:transparent}
  *::-webkit-scrollbar-thumb{background:#8fa58f;border:3px solid transparent;border-radius:999px;background-clip:padding-box}
  *::-webkit-scrollbar-thumb:hover{background:#6f8b75;border:2px solid transparent;background-clip:padding-box}
  *::-webkit-scrollbar-corner{background:transparent}
  html,body,#root{min-height:100%}
  body{margin:0;min-width:320px;min-height:100vh}
  button,input,textarea,select{font:inherit}
  button{cursor:pointer}
  a{color:inherit}
  ::selection{background:#cbdcca}
`;
