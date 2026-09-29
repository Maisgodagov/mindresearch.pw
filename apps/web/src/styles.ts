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
  #root input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="hidden"]):not([type="submit"]):not([type="button"]),
  #root textarea,
  #root select{
    border:1px solid #d2ddd2;
    border-radius:11px;
    background:#fff;
    color:#26382f;
    font-family:"Manrope Variable",ui-sans-serif,system-ui,sans-serif;
    font-size:14px;
    line-height:1.4;
    box-shadow:inset 0 1px 2px rgba(38,56,47,.025);
    outline:none;
    transition:border-color .16s ease,box-shadow .16s ease,background .16s ease;
  }
  #root input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="hidden"]):not([type="submit"]):not([type="button"]){height:53px;padding:0 15px}
  #root textarea{padding:13px 15px;line-height:1.55}
  #root select{min-height:53px;padding:0 14px}
  #root input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="hidden"]):not([type="submit"]):not([type="button"]):hover,
  #root textarea:hover,#root select:hover{border-color:#b9cbb9}
  #root input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="hidden"]):not([type="submit"]):not([type="button"]):focus,
  #root textarea:focus,#root select:focus{border-color:#78947e;background:#fffefa;box-shadow:0 0 0 3px rgba(95,128,104,.12)}
  #root input.invalid,#root textarea.invalid{border-color:#c96d67;background:#fff8f7;box-shadow:0 0 0 3px rgba(190,83,76,.12)}
  #root input:disabled,#root textarea:disabled,#root select:disabled{cursor:not-allowed;opacity:.65}
  a{color:inherit}
  ::selection{background:#cbdcca}
`;
