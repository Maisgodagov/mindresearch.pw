import{describe,expect,it}from'vitest';
import{gpsInstrument}from'../data/gps.js';
import{GPS_REVERSE_ITEMS,scoreGps}from'./gps.js';
const answers=(value:number)=>new Map(Array.from({length:20},(_,index)=>[index+1,value]));
describe('scoreGps',()=>{
  it('ships the exact 20-item English student form',()=>{expect(gpsInstrument.questions).toHaveLength(20);expect(gpsInstrument.questions.map(q=>q.code)).toEqual(Array.from({length:20},(_,i)=>`test_10_${i+1}`));expect(gpsInstrument.questions.every(q=>q.options?.map(o=>o.value).join(',')==='1,2,3,4,5')).toBe(true)});
  it('uses the published reverse key',()=>{expect(GPS_REVERSE_ITEMS).toEqual([3,4,6,8,11,13,14,15,18,20])});
  it('calculates theoretical minimum and maximum',()=>{const minimum=answers(1);GPS_REVERSE_ITEMS.forEach(item=>minimum.set(item,5));expect(scoreGps(minimum)!.overall).toMatchObject({score:20,average:1});const maximum=answers(5);GPS_REVERSE_ITEMS.forEach(item=>maximum.set(item,1));expect(scoreGps(maximum)!.overall).toMatchObject({score:100,average:5})});
  it('calculates a mixed protocol by reversing only keyed items',()=>{const input=answers(3);input.set(1,5);input.set(3,5);const result=scoreGps(input)!;expect(result.overall.score).toBe(60);expect(result.overall.average).toBe(3)});
  it('rejects incomplete, invalid, and wrong-key protocols',()=>{const incomplete=answers(3);incomplete.delete(20);expect(scoreGps(incomplete)).toBeNull();const invalid=answers(3);invalid.set(20,6);expect(scoreGps(invalid)).toBeNull();const wrong=answers(3);wrong.delete(1);wrong.set(21,3);expect(scoreGps(wrong)).toBeNull()});
});
