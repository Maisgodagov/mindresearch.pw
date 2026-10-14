import {describe,expect,it} from 'vitest';
import {calculateConfigurableScores as calculate,checkConfigurableCases,configurableScaleBounds,type ConfigurableScoring} from './configurable.js';
import {methodology as oejts} from '../data/methodologies/method-0027.js';
import {methodology as cbi} from '../data/methodologies/method-0432.js';
import {methodology as dubovitskaya} from '../data/methodologies/method-0211.js';
import {methodology as mcbride} from '../data/methodologies/method-0111.js';
import {methodology as ipip} from '../data/methodologies/method-1504.js';
import {methodology as shs} from '../data/methodologies/method-2433.js';
import {methodology as mds} from '../data/methodologies/method-2200.js';
import {methodology as wemwbs} from '../data/methodologies/method-2332.js';
import {methodology as fop} from '../data/methodologies/method-1241.js';
import {methodology as ftnd} from '../data/methodologies/method-1862.js';
import {withdrawnMethodologyCodes} from '../data/withdrawnMethodologies.js';
const profile=(n:number,value:number|string)=>Object.fromEntries(Array.from({length:n},(_,i)=>[String(i+1),value]));
const score=(m:typeof oejts,answers:Record<string,unknown>)=>calculate(m.scoringConfig!,answers);

describe('OEJTS: Jorgenson 2015, page 3, literal equations',()=>{
 const oracle=(q:Record<string,number>)=>({IE:30-q[3]-q[7]-q[11]+q[15]-q[19]+q[23]+q[27]-q[31],SN:12+q[4]+q[8]+q[12]+q[16]+q[20]-q[24]-q[28]+q[32],FT:30-q[2]+q[6]+q[10]-q[14]-q[18]+q[22]-q[26]-q[30],JP:18+q[1]+q[5]-q[9]+q[13]-q[17]+q[21]-q[25]+q[29]});
 it('checks each item independently and mixed profiles, exposing fake intercept weights',()=>{
  for(let item=1;item<=32;item++) for(const value of [1,5]){const q={...profile(32,3),[item]:value} as Record<string,number>;expect(score(oejts,q)).toEqual(oracle(q));}
  for(let offset=0;offset<5;offset++){const q=Object.fromEntries(Array.from({length:32},(_,i)=>[String(i+1),(i+offset)%5+1]));expect(score(oejts,q)).toEqual(oracle(q));}
 });
 it('reports 8–40 for all four equations',()=>{for(const scale of oejts.scoringConfig!.scales)expect(configurableScaleBounds(oejts.scoringConfig!,scale)).toEqual([8,40]);});
});

describe('CBI: Borritz and Kristensen, first edition pp. 2–4',()=>{
 it('maps every answer for every item to its response score, then averages',()=>{
  for(let item=1;item<=19;item++)for(let value=1;value<=5;value++){
   const answers={...profile(19,3),[item]:String(value)};
   const expected={personal:50,work:50,client:50};
   const key=item<=6?'personal':item<=13?'work':'client';
   expected[key]+=((item===10?(value-1)*25:125-25*value)-50)/(key==='work'?7:6);
   const actual=score(cbi,answers)!;for(const k of Object.keys(expected) as (keyof typeof expected)[])expect(actual[k]).toBeCloseTo(expected[k],12);
  }
 });
 it('reports 0–100 for response-mapped means',()=>{for(const scale of cbi.scoringConfig!.scales)expect(configurableScaleBounds(cbi.scoringConfig!,scale)).toEqual([0,100]);});
});

it('Dubovitskaya: binary agreement, published page 44; 20 matching answers score 20',()=>{
 const positives=[1,2,5,6,8,11,12,14,17,19];
 const answers=Object.fromEntries(Array.from({length:20},(_,i)=>[String(i+1),positives.includes(i+1)?'1':'0']));
 expect(score(dubovitskaya,answers)).toEqual({intrinsic_motivation:20});
 expect(score(dubovitskaya,profile(20,'1'))).toEqual({intrinsic_motivation:10});
 expect(score(dubovitskaya,{...answers,'1':'3'})).toBeNull();
});
it('McBride: counts the actual yes/no values emitted by the survey form',()=>{
 expect(score(mcbride,profile(33,'yes'))).toEqual({yes_count:33});expect(score(mcbride,profile(33,'no'))).toEqual({yes_count:0});
 expect(score(mcbride,{...profile(33,'no'),'18':'yes'})).toEqual({yes_count:1});
});
it('SHS: the fourth item alone reverses, mean remains 1–7',()=>{
 expect(score(shs,profile(4,1))).toEqual({shs:2.5});expect(score(shs,{'1':7,'2':7,'3':7,'4':1})).toEqual({shs:7});
});
it('IPIP: seven positive and three negative intellect markers give 7*5+3*1=38',()=>{expect(score(ipip,profile(50,5))).toEqual({E:30,A:34,C:34,ES:18,I:38});});
it('checks direct sums and the MDS mean without changing working formulas',()=>{
 expect(score(wemwbs,profile(14,5))).toEqual({total:70});expect(score(fop,profile(12,5))).toEqual({total:60});expect(score(mds,profile(16,100))).toEqual({mds16_mean:100});
});
it('FTND has question-specific response sets, not four responses on all six items',()=>{
 expect(checkConfigurableCases({questions:ftnd.instrument.questions.map(q=>({text:q.text,options:q.options??[]})),scoring:ftnd.scoringConfig!,cases:ftnd.validationCases!}).passed).toBe(true);
});
it.each([oejts,cbi,dubovitskaya,mcbride,ipip,shs,mds,wemwbs,fop])('retains confirmed $instrument.code and passes saved controls',m=>{
 expect(withdrawnMethodologyCodes.has(m.instrument.code)).toBe(false);
 expect(checkConfigurableCases({questions:m.instrument.questions.map(q=>({text:q.text,options:q.options??[]})),scoring:m.scoringConfig!,cases:m.validationCases!}).passed).toBe(true);
});
it('does not silently execute prose formulas as sums',()=>{
 const unsupported={min:0,max:10,scales:[{key:'x',label:'x',items:[1],reverseItems:[],aggregation:'formula',formula:'2 * Q1'}]} as ConfigurableScoring;
 expect(calculate(unsupported,{'1':4})).toBeNull();
});
it.each([true,false,[],{},'',' '])('rejects an invalid numeric answer %j',value=>{expect(score(shs,{...profile(4,4),'1':value})).toBeNull();});
it('preserves the explicitly exempt ORO and prior priority repairs',()=>{for(const code of ['test_1907','test_1208','test_2114','test_1391'])expect(withdrawnMethodologyCodes.has(code)).toBe(false);});
it('withdraws unresolved alternative-form algorithms instead of silently scoring the wrong form',()=>{for(const code of ['test_638','test_1559','test_1933'])expect(withdrawnMethodologyCodes.has(code)).toBe(true);});
