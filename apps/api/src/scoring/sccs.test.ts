import{describe,expect,it}from'vitest';
import{scoreSccs}from'./sccs.js';

describe('SCCS',()=>{
  it('не считает неполный протокол',()=>expect(scoreSccs(new Map([[1,1]]))).toBeNull());
  it('реверсирует пункты 1–5, 7–10 и 12',()=>{const answers=new Map(Array.from({length:12},(_,i)=>[i+1,[6,11].includes(i+1)?5:1]));expect(scoreSccs(answers)).toMatchObject({average:5,sum:60,reference:{zScore:2.65}})});
  it('оставляет середину шкалы неизменной',()=>{const answers=new Map(Array.from({length:12},(_,i)=>[i+1,3]));expect(scoreSccs(answers)).toMatchObject({average:3,sum:36,reference:{zScore:-0.13}})});
});
