import type {MethodologyRegistration} from '../data/methodologyRegistry.js';
import {calculateConfigurableScores} from './configurable.js';

/** Technical consistency only. Passing this is not scientific validation of an instrument. */
export function registryScoringIssues(registration:MethodologyRegistration) {
 const {instrument,scoringConfig:scoring,validationCases:cases=[]}=registration;
 const issues:string[]=[];
 if(!scoring)return issues;
 if(!cases.length)issues.push('No control cases');
 const required=[...new Set(scoring.scales.flatMap(s=>s.items))];
 if(!scoring.scales.length)issues.push('No scales');
 for(const scale of scoring.scales){
  if(!['sum','mean','count-option'].includes(scale.aggregation))issues.push(`Unsupported aggregation: ${scale.key}`);
  if(scale.items.some(item=>!Number.isInteger(item)||item<1||item>instrument.questions.length))issues.push(`Missing question: ${scale.key}`);
 }
 const allowed=(item:number):unknown[]=>{
  const q=instrument.questions[item-1];
  if(!q)return [];
  if(q.options?.length)return q.options.map(o=>q.type==='multiple'?[o.value]:o.value);
  if(q.type==='number')return [q.validation?.min??scoring.min,q.validation?.max??scoring.max];
  return [];
 };
 const base=Object.fromEntries(required.map(item=>[String(item),allowed(item)[0]]));
 for(const item of required){
  const values=allowed(item);
  if(!values.length)issues.push(`Unsupported input: ${item}`);
  else if(scoring.scales.every(s=>s.aggregation==='count-option')&&!values.some(value=>scoring.scales.some(s=>s.aggregation==='count-option'&&s.optionValue===String(value))))issues.push(`No counted response for required item: ${item}`);
  else if(values.some(value=>calculateConfigurableScores(scoring,{...base,[item]:value})===null))issues.push(`Valid response rejected: ${item}`);
 }
 for(const [index,test] of cases.entries()){
  const actual=calculateConfigurableScores(scoring,test.answers);
  if(!actual||scoring.scales.some(scale=>!Number.isFinite(test.expected?.[scale.key])||Math.abs(actual[scale.key]-test.expected[scale.key])>1e-8))issues.push(`Control case mismatch: ${index+1}`);
 }
 return issues;
}
