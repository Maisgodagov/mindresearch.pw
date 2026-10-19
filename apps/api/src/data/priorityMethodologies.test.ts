import { describe,it,expect } from 'vitest';
import {methodology as m1} from './methodologies/priority-test_3001.js';
import {methodology as m2} from './methodologies/priority-test_3002.js';
import {methodology as m3} from './methodologies/priority-test_3003.js';
import {methodology as m4} from './methodologies/priority-test_3004.js';
import {methodology as spts} from './methodologies/method-2142.js';
import { applyInstrumentForm, supportsFormGender } from './instrumentForms.js';
import { registryScoringIssues } from '../scoring/registryAudit.js';
import { calculateConfigurableScores } from '../scoring/configurable.js';
describe('priority methodologies and gender forms',()=>{
 it('passes independent endpoints and every single keyed-item contribution',async()=>{
  const registrations=[m1,m2,m3,m4,spts];
  expect(registrations).toHaveLength(5);
  for(const r of registrations){
   expect(registryScoringIssues(r)).toEqual([]);
   const scoring=r.scoringConfig!;
   const base=Object.fromEntries(r.instrument.questions.map((_,i)=>[i+1,scoring.min]));
   const low=calculateConfigurableScores(scoring,base)!;
   for(let item=1;item<=r.instrument.questions.length;item++){
    const actual=calculateConfigurableScores(scoring,{...base,[item]:scoring.max})!;
    for(const scale of scoring.scales){
     const multiplicity=scale.items.filter(i=>i===item).length;
     const change=multiplicity*(scoring.max-scoring.min)*(scale.reverseItems.includes(item)?-1:1)/(scale.aggregation==='mean'?scale.items.length:1);
     expect(actual[scale.key]-low[scale.key]).toBeCloseTo(change,8);
    }
   }
   const female=applyInstrumentForm(r.instrument.code,r.instrument.questions,'female');
   expect(female.length).toBe(r.instrument.questions.length);
   expect(female.some((q,i)=>q.text!==r.instrument.questions[i].text)).toBe(true);
   expect(female.map(q=>q.code)).toEqual(r.instrument.questions.map(q=>q.code));
   expect(female.map(q=>q.options?.map(o=>o.value))).toEqual(r.instrument.questions.map(q=>q.options?.map(o=>o.value)));
   expect(female[0].validation?.formGender).toBe('female');
  }
 });
 it('does not offer gender forms for unrelated methods',()=>{
  expect(supportsFormGender('test_1')).toBe(false);
  expect(()=>applyInstrumentForm('test_1',[],'female')).toThrow();
 });
});
