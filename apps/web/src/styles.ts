import { createGlobalStyle } from "styled-components";
export const GlobalStyle = createGlobalStyle`
  :root{
    --font-heading:"Manrope Variable";
    --font-body:"Manrope Variable",ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;
    --color-brand:#91b784;
    --color-brand-strong:#52764b;
    --color-brand-ink:#365532;
    --color-brand-soft:#e8f1e3;
    --color-page:#f5f7f4;
    --color-surface:#fff;
    --color-surface-muted:#f8faf7;
    --color-ink:#1e2c23;
    --color-muted:#647268;
    --color-border:#d9e2d8;
    --color-focus:rgba(82,118,75,.2);
    font-family:var(--font-body);
    color:var(--color-ink);
    background:var(--color-page);
    font-synthesis:none;
    text-rendering:optimizeLegibility
  }
  *{box-sizing:border-box;scrollbar-width:thin;scrollbar-color:#a3b49e transparent}
  *::-webkit-scrollbar{width:10px;height:10px}
  *::-webkit-scrollbar-track{background:transparent}
  *::-webkit-scrollbar-thumb{background:#a3b49e;border:3px solid transparent;border-radius:999px;background-clip:padding-box}
  *::-webkit-scrollbar-thumb:hover{background:#7d9876;border:2px solid transparent;background-clip:padding-box}
  *::-webkit-scrollbar-corner{background:transparent}
  html,body,#root{min-height:100%}
  body{margin:0;min-width:320px;min-height:100vh;background:var(--color-page)}
  button,input,textarea,select{font:inherit}
  button{cursor:pointer}
  #root input:not(.ant-input):not(.ant-input-number-input):not(.ant-checkbox-input):not(.ant-radio-input):not(.ant-select-selection-search-input):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="hidden"]):not([type="submit"]):not([type="button"]),
  #root textarea:not(.ant-input),
  #root select:not(.ant-select-selection-search-input){
    border:1px solid var(--color-border);
    border-radius:9px;
    background:var(--color-surface);
    color:var(--color-ink);
    font-family:var(--font-body);
    font-size:14px;
    line-height:1.4;
    box-shadow:none;
    outline:none;
    transition:border-color .16s ease,box-shadow .16s ease,background-color .16s ease;
  }
  #root input:not(.ant-input):not(.ant-input-number-input):not(.ant-checkbox-input):not(.ant-radio-input):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="hidden"]):not([type="submit"]):not([type="button"]){height:44px;padding:0 13px}
  #root textarea:not(.ant-input){padding:13px 15px;line-height:1.55}
  #root select:not(.ant-select-selection-search-input){min-height:44px;padding:0 13px}
  #root input:not(.ant-input):not(.ant-input-number-input):not(.ant-checkbox-input):not(.ant-radio-input):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="hidden"]):not([type="submit"]):not([type="button"]):hover,
  #root textarea:not(.ant-input):hover,#root select:not(.ant-select-selection-search-input):hover{border-color:#a7bda2}
  #root input:not(.ant-input):not(.ant-input-number-input):not(.ant-checkbox-input):not(.ant-radio-input):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="hidden"]):not([type="submit"]):not([type="button"]):focus,
  #root textarea:not(.ant-input):focus,#root select:not(.ant-select-selection-search-input):focus{border-color:var(--color-brand-strong);background:#fff;box-shadow:0 0 0 3px var(--color-focus)}
  #root input.invalid,#root textarea.invalid{border-color:#c96d67;background:#fff8f7;box-shadow:0 0 0 3px rgba(190,83,76,.12)}
  #root input:disabled:not(.ant-input):not(.ant-checkbox-input):not(.ant-radio-input),#root textarea:disabled:not(.ant-input),#root select:disabled{cursor:not-allowed;opacity:.65}
  a{color:inherit}
  .ant-btn{border-radius:9px;font-weight:650;transition:background-color .16s ease,border-color .16s ease,color .16s ease,box-shadow .16s ease}
  .ant-btn.ant-btn:not(:disabled):not(.ant-btn-primary):not(.ant-btn-dangerous):hover,
  .ant-btn.ant-btn:not(:disabled):not(.ant-btn-primary):not(.ant-btn-dangerous):focus-visible{background:#edf4ea!important;color:#365532!important;border-color:#b8cbb2!important;box-shadow:none!important}
  #root .ant-btn.ant-btn.delete-action:not(:disabled):hover,
  #root .ant-btn.ant-btn.delete-action:not(:disabled):focus-visible{background:#fee4e2!important;color:#b42318!important;border-color:#fda29b!important;box-shadow:none!important}
  #root .structure-panel .ant-btn.ant-btn.icon:not(:disabled):hover,
  #root .structure-panel .ant-btn.ant-btn.tiny:not(:disabled):hover,
  #root .structure-panel .ant-btn.ant-btn.section-drag:not(:disabled):hover,
  #root .structure-panel .ant-btn.ant-btn.drag:not(:disabled):hover,
  #root .structure-panel .ant-btn.ant-btn.delete-action:not(:disabled):hover,
  #root .structure-panel .ant-btn.ant-btn.icon:not(:disabled):focus-visible,
  #root .structure-panel .ant-btn.ant-btn.tiny:not(:disabled):focus-visible,
  #root .structure-panel .ant-btn.ant-btn.section-drag:not(:disabled):focus-visible,
  #root .structure-panel .ant-btn.ant-btn.drag:not(:disabled):focus-visible,
  #root .structure-panel .ant-btn.ant-btn.delete-action:not(:disabled):focus-visible{border-color:transparent!important}
  .ant-btn.ant-btn:not(:disabled):not(.ant-btn-primary):not(.ant-btn-dangerous):active{background:#e3eddf!important;color:#304d2d!important}
  .ant-btn.ant-btn-primary:not(:disabled):hover,
  .ant-btn.ant-btn-primary:not(:disabled):focus-visible{background:#45683f!important;color:#fff!important;box-shadow:0 2px 5px rgba(36,63,32,.16)!important}
  .ant-btn.ant-btn-primary:not(:disabled):active{background:#385933!important}
  .ant-btn.ant-btn-dangerous:not(:disabled):hover,
  .ant-btn.ant-btn-dangerous:not(:disabled):focus-visible{background:#fbefed!important;color:#a84e47!important}
  .ant-card{color:var(--color-ink)}
  .ant-input,.ant-input-affix-wrapper,.ant-select-selector,.ant-input-number{border-radius:9px!important}
  .ant-modal .ant-modal-title{font-size:20px;font-weight:700;letter-spacing:-.025em;color:var(--color-ink)}
  #root .structure-panel{
    padding:0!important;
    background:#edf3ea!important;
    border-color:#d8e3d5!important;
    box-shadow:none!important;
  }
  #root .structure-panel > .ant-card-body{
    padding:16px!important;
    border-radius:inherit;
    background:#edf3ea!important;
  }
  :focus-visible{outline:3px solid var(--color-focus);outline-offset:2px}
  ::selection{background:#d8e8d0;color:#1e2c23}
`;
