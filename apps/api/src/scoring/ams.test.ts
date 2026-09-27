import{describe,expect,it}from'vitest';
import{amsInstrument}from'../data/ams.js';
import{AMS_SCALES,scoreAms}from'./ams.js';
const answers=(value:number)=>new Map(Array.from({length:28},(_,index)=>[index+1,value]));
describe('scoreAms',()=>{
  it('ships all official items and response values',()=>{expect(amsInstrument.questions).toHaveLength(28);expect(amsInstrument.questions.map(q=>q.code)).toEqual(Array.from({length:28},(_,i)=>`test_8_${i+1}`));expect(amsInstrument.questions.every(q=>q.options?.map(o=>o.value).join(',')==='1,2,3,4,5,6,7')).toBe(true)});
  it('uses the official key',()=>{expect(AMS_SCALES.intrinsicToKnow.items).toEqual([2,9,16,23]);expect(AMS_SCALES.intrinsicAccomplishment.items).toEqual([6,13,20,27]);expect(AMS_SCALES.intrinsicStimulation.items).toEqual([4,11,18,25]);expect(AMS_SCALES.extrinsicIdentified.items).toEqual([3,10,17,24]);expect(AMS_SCALES.extrinsicIntrojected.items).toEqual([7,14,21,28]);expect(AMS_SCALES.extrinsicExternal.items).toEqual([1,8,15,22]);expect(AMS_SCALES.amotivation.items).toEqual([5,12,19,26])});
  it('calculates boundaries',()=>{expect(Object.values(scoreAms(answers(1))!.scales).every(s=>s.average===1)).toBe(true);expect(Object.values(scoreAms(answers(7))!.scales).every(s=>s.average===7)).toBe(true)});
  it('keeps scales independent',()=>{const input=answers(1);AMS_SCALES.intrinsicToKnow.items.forEach(item=>input.set(item,7));const result=scoreAms(input)!;expect(result.scales.intrinsicToKnow.average).toBe(7);expect(Object.values(result.scales).filter(s=>s.label!==result.scales.intrinsicToKnow.label).every(s=>s.average===1)).toBe(true)});
  it('rejects incomplete, invalid, and wrong-key protocols',()=>{const incomplete=answers(4);incomplete.delete(28);expect(scoreAms(incomplete)).toBeNull();const invalid=answers(4);invalid.set(28,8);expect(scoreAms(invalid)).toBeNull();const wrong=answers(4);wrong.delete(1);wrong.set(29,4);expect(scoreAms(wrong)).toBeNull()});
});
