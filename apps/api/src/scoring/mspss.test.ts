import{describe,expect,it}from'vitest';
import{scoreMspss}from'./mspss.js';
const filled=(value:number)=>new Map(Array.from({length:12},(_,i)=>[i+1,value]));
describe('MSPSS',()=>{
  it('не считает неполный протокол',()=>expect(scoreMspss(new Map([[1,7]]))).toBeNull());
  it('считает общий результат и три установленные субшкалы',()=>{const answers=filled(1);[1,2,5,10].forEach(n=>answers.set(n,7));[3,4,8,11].forEach(n=>answers.set(n,5));const result=scoreMspss(answers)!;expect(result.overall.score).toBe(4.33);expect(result.scales.significantOther.score).toBe(7);expect(result.scales.family.score).toBe(5);expect(result.scales.friends.score).toBe(1)});
  it('применяет ориентировочные границы без разрывов',()=>{expect(scoreMspss(filled(2))!.overall.level).toBe('low');expect(scoreMspss(filled(3))!.overall.level).toBe('moderate');expect(scoreMspss(filled(5))!.overall.level).toBe('moderate');expect(scoreMspss(filled(6))!.overall.level).toBe('high')});
});
