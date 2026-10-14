import {loadMethodologyRegistry} from '../apps/api/dist/data/methodologyRegistry.js';
import {calculateConfigurableScores} from '../apps/api/dist/scoring/configurable.js';
import {withdrawnMethodologyCodes} from '../apps/api/dist/data/withdrawnMethodologies.js';
import {registryScoringIssues} from '../apps/api/dist/scoring/registryAudit.js';
import {readFile,writeFile} from 'node:fs/promises';

export function auditRegistration(registration) {
 const {instrument,scoringConfig: scoring,validationCases: cases=[]}=registration;
 if(!scoring)return {code:instrument.code,issues:[]};
 const issues=[];
 const required=[...new Set(scoring.scales.flatMap(s=>s.items))];
 for(const s of scoring.scales) {
  if(!['sum','mean','count-option'].includes(s.aggregation))issues.push({kind:'unsupported-aggregation',scale:s.key,aggregation:s.aggregation});
  if(s.items.some(i=>!Number.isInteger(i)||i<1||i>instrument.questions.length))issues.push({kind:'missing-question',scale:s.key});
 }
 // Use each question's own answers; demographic questions outside keys are irrelevant.
 const allowed = item => {
  const q=instrument.questions[item-1];
  if(!q)return [];
  if(q.options?.length)return q.options.map(o=>q.type==='multiple'?[o.value]:o.value);
  if(q.type==='number')return [q.validation?.min??scoring.min,q.validation?.max??scoring.max];
  return []; // Text/free-format input requires a specific, reviewed scoring adapter.
 };
 const base=Object.fromEntries(required.map(i=>[String(i),allowed(i)[0]]));
 for(const item of required) {
  const values=allowed(item);
  if(!values.length){issues.push({kind:'unsupported-input',item});continue;}
  if(scoring.scales.every(s=>s.aggregation==='count-option')&&!values.some(value=>scoring.scales.some(s=>s.optionValue===String(value))))issues.push({kind:'uncounted-required-input',item});
  for(const value of values)if(calculateConfigurableScores(scoring,{...base,[item]:value})===null){issues.push({kind:'valid-response-rejected',item,value});break;}
 }
 for(const [index,c] of cases.entries()) {
  const actual=calculateConfigurableScores(scoring,c.answers);
  const differences=scoring.scales.filter(s=>!actual||!Number.isFinite(c.expected?.[s.key])||Math.abs(actual[s.key]-c.expected[s.key])>1e-8).map(s=>({scale:s.key,expected:c.expected?.[s.key],actual:actual?.[s.key]??null}));
  if(differences.length)issues.push({kind:'control-case-mismatch',index,title:c.title,differences});
 }
 return {code:instrument.code,title:instrument.title,version:registration.formulaVersion,issues};
}

const registrations=await loadMethodologyRegistry();
const report=registrations.map(auditRegistration);
if(!process.argv.includes('--check'))await writeFile('docs/methodologies/scoring-audit-current.json',JSON.stringify({generatedAt:new Date().toISOString(),methods:report},null,2));
console.log(JSON.stringify({total:report.length,flagged:report.filter(r=>r.issues.length).length,issueTypes:report.flatMap(r=>r.issues).reduce((a,x)=>(a[x.kind]=(a[x.kind]??0)+1,a),{}),selected:report.filter(r=>['test_68','test_149','test_242','test_468','test_1521','test_2451','test_2214','test_2350','test_1270','test_1879'].includes(r.code))},null,2));
const activeFailures=registrations.filter(r=>!withdrawnMethodologyCodes.has(r.instrument.code)&&registryScoringIssues(r).length);
console.log(JSON.stringify({active:registrations.length-withdrawnMethodologyCodes.size,activeFailures:activeFailures.map(r=>({code:r.instrument.code,issues:registryScoringIssues(r)}))}));
if(process.argv.includes('--check')&&activeFailures.length)process.exitCode=1;
