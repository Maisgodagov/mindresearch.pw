import { createGlobalStyle } from "styled-components";
export const GlobalStyle = createGlobalStyle`
  :root{
    --font-heading:"Manrope Variable";
    --font-body:"Manrope Variable",ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;
    --radius-control:8px;
    --radius-card:16px;
    --shadow-floating:0 8px 24px var(--color-brand-alpha-080);
    --motion-ease:cubic-bezier(.22,1,.36,1);
    --motion-fast:160ms;
    --motion-panel:220ms;
    font-family:var(--font-body);
    color:var(--color-ink);
    background:var(--color-page);
    font-synthesis:none;
    font-variant-numeric:tabular-nums;
    text-rendering:optimizeLegibility
  }
  *{box-sizing:border-box;scrollbar-width:thin;scrollbar-color:var(--color-border-strong) transparent}
  *::-webkit-scrollbar{width:10px;height:10px}
  *::-webkit-scrollbar-track{background:transparent}
  *::-webkit-scrollbar-thumb{background:var(--color-border-strong);border:3px solid transparent;border-radius:999px;background-clip:padding-box}
  *::-webkit-scrollbar-thumb:hover{background:var(--color-brand);border:2px solid transparent;background-clip:padding-box}
  *::-webkit-scrollbar-corner{background:transparent}
  html,body,#root{min-height:100%}
  body{margin:0;min-width:320px;min-height:100vh;background:var(--color-page)}
  button,input,textarea,select{font:inherit}
  button{cursor:pointer}
  #root input:not(.ant-select-input):not(.ant-input):not(.ant-input-number-input):not(.ant-checkbox-input):not(.ant-radio-input):not(.ant-select-selection-search-input):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="hidden"]):not([type="submit"]):not([type="button"]),
  #root textarea:not(.ant-input),
  #root select:not(.ant-select-selection-search-input){
    border:1px solid var(--color-border);
    border-radius:var(--radius-control);
    background:var(--color-surface);
    color:var(--color-ink);
    font-family:var(--font-body);
    font-size:14px;
    line-height:1.4;
    box-shadow:none;
    outline:none;
    transition:border-color .16s ease,box-shadow .16s ease,background-color .16s ease;
  }
  #root input:not(.ant-select-input):not(.ant-input):not(.ant-input-number-input):not(.ant-checkbox-input):not(.ant-radio-input):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="hidden"]):not([type="submit"]):not([type="button"]){height:44px;padding:0 13px}
  #root textarea:not(.ant-input){padding:13px 15px;line-height:1.55}
  #root select:not(.ant-select-selection-search-input){min-height:44px;padding:0 13px}
  #root input:not(.ant-select-input):not(.ant-input):not(.ant-input-number-input):not(.ant-checkbox-input):not(.ant-radio-input):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="hidden"]):not([type="submit"]):not([type="button"]):hover,
  #root textarea:not(.ant-input):hover,#root select:not(.ant-select-selection-search-input):hover{border-color:var(--color-border-strong)}
  #root input:not(.ant-select-input):not(.ant-input):not(.ant-input-number-input):not(.ant-checkbox-input):not(.ant-radio-input):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="hidden"]):not([type="submit"]):not([type="button"]):focus,
  #root textarea:not(.ant-input):focus,#root select:not(.ant-select-selection-search-input):focus{border-color:var(--color-brand-strong);background:var(--color-surface);box-shadow:0 0 0 3px var(--color-focus)}
  #root input.invalid,#root textarea.invalid{border-color:var(--color-palette-c96d67);background:var(--color-palette-fff8f7);box-shadow:0 0 0 3px var(--color-palette-be534c-a120)}
  #root input:disabled:not(.ant-input):not(.ant-checkbox-input):not(.ant-radio-input),#root textarea:disabled:not(.ant-input),#root select:disabled{cursor:not-allowed;opacity:.65}
  a{color:inherit}
  .ant-btn{border-radius:var(--radius-control);font-weight:600;transition:background-color .16s ease,border-color .16s ease,color .16s ease,box-shadow .16s ease}
  .ant-btn.ant-btn:not(:disabled):not(.ant-btn-primary):not(.ant-btn-dangerous):hover,
  .ant-btn.ant-btn:not(:disabled):not(.ant-btn-primary):not(.ant-btn-dangerous):focus-visible{background:var(--color-brand-soft)!important;color:var(--color-brand)!important;border-color:transparent!important;box-shadow:none!important}
  #root .ant-btn.ant-btn.toggle:not(:disabled):not(.ant-btn-primary):not(.ant-btn-dangerous):hover,
  #root .ant-btn.ant-btn.report:not(:disabled):not(.ant-btn-primary):not(.ant-btn-dangerous):hover{border-color:transparent!important;box-shadow:none!important}
  #root .ant-btn.ant-btn.toggle,
  #root .ant-btn.ant-btn.report{transition:background-color .16s ease,color .16s ease,box-shadow .16s ease!important}
  #root .ant-btn.ant-btn.delete-action:not(:disabled):hover,
  #root .ant-btn.ant-btn.delete-action:not(:disabled):focus-visible{background:var(--color-palette-fee4e2)!important;color:var(--color-text-b42318)!important;border-color:var(--color-palette-fda29b)!important;box-shadow:none!important}
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
  .ant-btn.ant-btn:not(:disabled):not(.ant-btn-primary):not(.ant-btn-dangerous):active{background:var(--color-brand-soft)!important;color:var(--color-text-304d2d)!important}
  .ant-btn.ant-btn-primary:not(:disabled):hover,
  .ant-btn.ant-btn-primary:not(:disabled):focus-visible{background:var(--color-brand)!important;color:var(--color-surface)!important;box-shadow:none!important}
  .ant-btn.ant-btn-primary:not(:disabled):active{background:var(--color-brand)!important}
  .ant-btn.ant-btn-dangerous:not(:disabled):hover,
  .ant-btn.ant-btn-dangerous:not(:disabled):focus-visible{background:var(--color-palette-fbefed)!important;color:var(--color-text-a84e47)!important}
  .ant-card{color:var(--color-ink)}
  .ant-input,.ant-input-affix-wrapper,.ant-select-selector,.ant-input-number{border-radius:var(--radius-control)!important}
  .ant-modal .ant-modal-title{font-size:20px;font-weight:700;letter-spacing:-.025em;color:var(--color-ink)}
  #root .structure-panel{
    padding:0!important;
    background:var(--color-brand-soft)!important;
    border-color:var(--color-brand-soft)!important;
    box-shadow:none!important;
  }
  #root .structure-panel > .ant-card-body{
    padding:16px!important;
    border-radius:inherit;
    background:var(--color-brand-soft)!important;
  }
  :focus-visible{outline:2px solid var(--color-brand-strong);outline-offset:3px}
  @media(max-width:760px){
    #root input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="hidden"]),
    #root textarea,#root select,.ant-input,.ant-select-selector{font-size:16px}
  }
  @media(prefers-reduced-motion:reduce){
    *,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}
    /* Keep the explicitly requested sidebar toggle visible in reduced-motion mode. */
    [data-sidebar-motion]{transition-duration:var(--sidebar-transition-duration)!important}
  }
  ::selection{background:var(--color-brand-soft);color:var(--color-text-1e2c23)}
`;
