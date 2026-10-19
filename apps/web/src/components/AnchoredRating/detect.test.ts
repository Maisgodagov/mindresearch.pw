import {describe,it,expect} from 'vitest';
import {isAnchoredRating} from './detect';
const options=Array.from({length:9},(_,i)=>({value:String(i+1),label:i===0?'Очень редко':i===8?'Очень часто':String(i+1)}));
describe('endpoint-anchored rating detection',()=>{
 it('recognizes the SPTS 1–9 scale',()=>expect(isAnchoredRating('single',options)).toBe(true));
 it('preserves multiple choices, null, named intermediate answers and nonsequential scales',()=>{
  expect(isAnchoredRating('multiple',options)).toBe(false);expect(isAnchoredRating('single',null)).toBe(false);
  expect(isAnchoredRating('single',options.map((o,i)=>i===3?{...o,label:'Иногда'}:o))).toBe(false);
  expect(isAnchoredRating('single',options.filter((_,i)=>i!==3))).toBe(false);
  expect(isAnchoredRating('single',[{value:'1',label:'Да'},{value:'2',label:'Нет'}])).toBe(false);
 });
});
