import { createGlobalStyle } from "styled-components";
export const GlobalStyle = createGlobalStyle`
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
  #root input:not(.ant-input):not(.ant-input-number-input):not(.ant-checkbox-input):not(.ant-radio-input):not(.ant-select-selection-search-input):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="hidden"]):not([type="submit"]):not([type="button"]),
  #root textarea:not(.ant-input),
  #root select:not(.ant-select-selection-search-input){
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
  #root input:not(.ant-input):not(.ant-input-number-input):not(.ant-checkbox-input):not(.ant-radio-input):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="hidden"]):not([type="submit"]):not([type="button"]){height:53px;padding:0 15px}
  #root textarea:not(.ant-input){padding:13px 15px;line-height:1.55}
  #root select:not(.ant-select-selection-search-input){min-height:53px;padding:0 14px}
  #root input:not(.ant-input):not(.ant-input-number-input):not(.ant-checkbox-input):not(.ant-radio-input):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="hidden"]):not([type="submit"]):not([type="button"]):hover,
  #root textarea:not(.ant-input):hover,#root select:not(.ant-select-selection-search-input):hover{border-color:#b9cbb9}
  #root input:not(.ant-input):not(.ant-input-number-input):not(.ant-checkbox-input):not(.ant-radio-input):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="hidden"]):not([type="submit"]):not([type="button"]):focus,
  #root textarea:not(.ant-input):focus,#root select:not(.ant-select-selection-search-input):focus{border-color:#78947e;background:#fffefa;box-shadow:0 0 0 3px rgba(95,128,104,.12)}
  #root input.invalid,#root textarea.invalid{border-color:#c96d67;background:#fff8f7;box-shadow:0 0 0 3px rgba(190,83,76,.12)}
  #root input:disabled:not(.ant-input):not(.ant-checkbox-input):not(.ant-radio-input),#root textarea:disabled:not(.ant-input),#root select:disabled{cursor:not-allowed;opacity:.65}
  a{color:inherit}
  .ant-btn{font-weight:650}
  .ant-btn.ant-btn:not(:disabled):not(.ant-btn-primary):not(.ant-btn-dangerous):hover,
  .ant-btn.ant-btn:not(:disabled):not(.ant-btn-primary):not(.ant-btn-dangerous):focus-visible{background:#e2ebe0!important;color:#3f5e47!important;box-shadow:none!important}
  .ant-btn.ant-btn:not(:disabled):not(.ant-btn-primary):not(.ant-btn-dangerous):active{background:#dfeadd!important;color:#354f3d!important}
  .ant-btn.ant-btn-primary:not(:disabled):hover,
  .ant-btn.ant-btn-primary:not(:disabled):focus-visible{background:#45634f!important;color:#fff!important;box-shadow:0 3px 9px rgba(48,70,54,.14)!important}
  .ant-btn.ant-btn-primary:not(:disabled):active{background:#3d5947!important}
  .ant-btn.ant-btn-dangerous:not(:disabled):hover,
  .ant-btn.ant-btn-dangerous:not(:disabled):focus-visible{background:#fbefed!important;color:#a84e47!important}
  .ant-btn.ant-btn:not(:disabled):hover{border-color:transparent!important;filter:brightness(.96)}
  .ant-btn.ant-btn:not(:disabled):active{border-color:transparent!important;filter:brightness(.92)}
  .ant-card{color:#26382f}
  .ant-input,.ant-input-affix-wrapper,.ant-select-selector,.ant-input-number{border-radius:12px!important}
  ::selection{background:#cbdcca}
`;
