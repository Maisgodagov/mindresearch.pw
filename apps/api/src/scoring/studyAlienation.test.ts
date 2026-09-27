import{describe,expect,it}from'vitest';
import{studyAlienationInstrument}from'../data/studyAlienation.js';
import{scoreStudyAlienation,STUDY_ALIENATION_SCALES}from'./studyAlienation.js';
const answers=(value:number)=>new Map(Array.from({length:12},(_,index)=>[index+1,value]));
describe('scoreStudyAlienation',()=>{
  it('ships the validated short form in exact order',()=>{expect(studyAlienationInstrument.questions).toHaveLength(12);expect(studyAlienationInstrument.questions.map(q=>q.code)).toEqual(Array.from({length:12},(_,i)=>`test_9_${i+1}`));expect(studyAlienationInstrument.questions.every(q=>q.options?.map(o=>o.value).join(',')==='1,2,3,4,5')).toBe(true)});
  it('uses the published four-scale key',()=>{expect(STUDY_ALIENATION_SCALES.vegetativeness.items).toEqual([4,8,11]);expect(STUDY_ALIENATION_SCALES.powerlessness.items).toEqual([1,5,9]);expect(STUDY_ALIENATION_SCALES.nihilism.items).toEqual([2,6,12]);expect(STUDY_ALIENATION_SCALES.adventurousness.items).toEqual([3,7,10])});
  it('calculates minimum and maximum protocols',()=>{expect(scoreStudyAlienation(answers(1))!.overall.average).toBe(1);expect(scoreStudyAlienation(answers(5))!.overall.average).toBe(5);expect(Object.values(scoreStudyAlienation(answers(5))!.scales).every(scale=>scale.average===5)).toBe(true)});
  it('keeps all four scales independent',()=>{const input=answers(1);STUDY_ALIENATION_SCALES.nihilism.items.forEach(item=>input.set(item,5));const result=scoreStudyAlienation(input)!;expect(result.scales.nihilism.average).toBe(5);expect(result.overall.average).toBe(2);expect(Object.values(result.scales).filter(scale=>scale.label!==result.scales.nihilism.label).every(scale=>scale.average===1)).toBe(true)});
  it('rejects incomplete, invalid, and wrong-key protocols',()=>{const incomplete=answers(3);incomplete.delete(12);expect(scoreStudyAlienation(incomplete)).toBeNull();const invalid=answers(3);invalid.set(12,6);expect(scoreStudyAlienation(invalid)).toBeNull();const wrong=answers(3);wrong.delete(1);wrong.set(13,3);expect(scoreStudyAlienation(wrong)).toBeNull()});
});
