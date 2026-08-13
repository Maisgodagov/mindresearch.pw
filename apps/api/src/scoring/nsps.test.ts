import{describe,expect,it}from'vitest';
import{scoreNsps}from'./nsps.js';
const answers=(value:number)=>new Map(Array.from({length:27},(_,i)=>[i+1,value]));
describe('scoreNsps',()=>{
  it('requires all 27 valid answers',()=>{expect(scoreNsps(new Map([[1,1]]))).toBeNull();expect(scoreNsps(answers(6))).toBeNull()});
  it('calculates total and subscales',()=>{const result=scoreNsps(answers(3))!;expect(result.overall.score).toBe(81);expect(result.scales.socialCompetence.score).toBe(33);expect(result.scales.physicalAppearance.score).toBe(24);expect(result.scales.signsOfAnxiety.score).toBe(24)});
  it('uses each item once',()=>{const items=Object.values(scoreNsps(answers(1))!.scales).flatMap(scale=>scale.items);expect(items.sort((a,b)=>a-b)).toEqual(Array.from({length:27},(_,i)=>i+1))});
});
