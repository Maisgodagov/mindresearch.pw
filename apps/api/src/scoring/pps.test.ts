import{describe,expect,it}from'vitest';
import{ppsInstrument}from'../data/pps.js';
import{scorePps}from'./pps.js';
const answers=(value:number)=>new Map(Array.from({length:12},(_,index)=>[index+1,value]));
describe('scorePps',()=>{
  it('ships the exact 12-item English form with a 1–5 response scale',()=>{expect(ppsInstrument.questions).toHaveLength(12);expect(ppsInstrument.questions.map(q=>q.code)).toEqual(Array.from({length:12},(_,i)=>`test_11_${i+1}`));expect(ppsInstrument.questions.every(q=>q.options?.map(o=>o.value).join(',')==='1,2,3,4,5')).toBe(true)});
  it('calculates the theoretical minimum and maximum without reverse scoring',()=>{expect(scorePps(answers(1))!.overall).toMatchObject({score:12,average:1});expect(scorePps(answers(5))!.overall).toMatchObject({score:60,average:5})});
  it('calculates the published three item groups independently',()=>{const input=answers(1);[1,2,3].forEach(item=>input.set(item,2));[4,5,6,7,8].forEach(item=>input.set(item,3));[9,10,11,12].forEach(item=>input.set(item,4));const result=scorePps(input)!;expect(result.overall).toMatchObject({score:37,average:3.08});expect(result.scales.decisional).toMatchObject({score:6,average:2});expect(result.scales.implemental).toMatchObject({score:15,average:3});expect(result.scales.lateness).toMatchObject({score:16,average:4})});
  it('rejects incomplete, invalid, and wrong-key protocols',()=>{const incomplete=answers(3);incomplete.delete(12);expect(scorePps(incomplete)).toBeNull();const invalid=answers(3);invalid.set(12,6);expect(scorePps(invalid)).toBeNull();const wrong=answers(3);wrong.delete(1);wrong.set(13,3);expect(scorePps(wrong)).toBeNull()});
});
