import {describe,it,expect} from 'vitest';
import {respondentForm} from './respondentForm';
describe('automatic form rendering',()=>{
 const q={id:'q',text:'fallback',options:[{value:'1',label:'Да'}],validation:{formGender:'auto',formFallback:'female',formVariants:{male:{text:'Я уверен',options:[{value:'1',label:'Согласен'}]},female:{text:'Я уверена',options:[{value:'1',label:'Согласна'}]}}}};
 it('switches text and labels, supports changed gender and preserves ids and values',()=>{
  expect(respondentForm(q,'male').text).toBe('Я уверен');expect(respondentForm(q,'female').text).toBe('Я уверена');
  expect(respondentForm(q,'not_specified').text).toBe('Я уверена');expect(respondentForm(q,undefined).text).toBe('Я уверена');
  expect(respondentForm(q,'male').id).toBe('q');expect(respondentForm(q,'female').options[0].value).toBe('1');
  const fixed={...q,validation:{...q.validation,formGender:'female'}};expect(respondentForm(fixed,'male')).toBe(fixed);
 });
});
