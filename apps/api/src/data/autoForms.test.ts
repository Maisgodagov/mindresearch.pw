import {describe,it,expect} from 'vitest';
import {applyInstrumentForm,priorityQuestions,resolveInstrumentForm} from './instrumentForms.js';
describe('respondent gender forms',()=>{
 it('snapshots both forms and respects respondent gender, fallback and fixed selection',()=>{
  for(const code of ['test_3001','test_3002','test_3003','test_3004','test_2156'] as const){
   const questions=code==='test_2156'?Array.from({length:64},(_,i)=>({code:`spts_${i}`,text:'unchanged',type:'single' as const,options:[]})):priorityQuestions(code);
   const male=applyInstrumentForm(code,questions,'male'),female=applyInstrumentForm(code,questions,'female');
   for(const fallback of ['male','female'] as const){
    const auto=applyInstrumentForm(code,questions,'auto',fallback);
    auto.forEach((q,i)=>{
     expect(resolveInstrumentForm(q,'male').text).toBe(male[i].text);
     expect(resolveInstrumentForm(q,'female').text).toBe(female[i].text);
     expect(resolveInstrumentForm(q,'not_specified').text).toBe((fallback==='male'?male:female)[i].text);
     expect(resolveInstrumentForm(q,undefined).code).toBe(q.code);
     expect(resolveInstrumentForm(female[i],'male')).toBe(female[i]);
    });
   }
  }
 });
});
