import{describe,expect,it}from'vitest';
import{scoreSspm2011,SSPM_2011_OVERALL,SSPM_2011_SCALES}from'./sspm2011.js';

const matchingAnswers=()=>new Map(Array.from({length:52},(_,i)=>{const n=i+1;return[n,SSPM_2011_OVERALL.yes.includes(n)?1:4]}));

describe('ССПМ-2011',()=>{
  it('не считает неполный протокол',()=>expect(scoreSspm2011(new Map([[1,1]]))).toBeNull());
  it('считает совпадение с ключом Да/Нет по группам вариантов',()=>{
    const result=scoreSspm2011(matchingAnswers())!;
    expect(result.overall).toMatchObject({score:52,maxScore:52,level:'high'});
    expect(result.scales.planning.score).toBe(9);
    expect(result.scales.reliability.score).toBe(9);
  });
  it('применяет обе опубликованные нормативные границы каждой шкалы',()=>{
    for(const definition of [...Object.values(SSPM_2011_SCALES),SSPM_2011_OVERALL]){
      const readScale=(answers:Map<number,number>)=>{const result=scoreSspm2011(answers)!;return definition===SSPM_2011_OVERALL?result.overall:Object.values(result.scales).find(x=>x.label===definition.label)!};
      const withScore=(target:number)=>{const answers=matchingAnswers();const keyed=[...definition.yes,...definition.no];for(const n of keyed.slice(target))answers.set(n,answers.get(n)!<=2?4:1);return answers};
      expect(readScale(withScore(definition.lowMax))).toMatchObject({score:definition.lowMax,level:'low'});
      expect(readScale(withScore(definition.lowMax+1))).toMatchObject({score:definition.lowMax+1,level:'medium'});
      expect(readScale(withScore(definition.highMin-1))).toMatchObject({score:definition.highMin-1,level:'medium'});
      expect(readScale(withScore(definition.highMin))).toMatchObject({score:definition.highMin,level:'high'});
    }
  });
});
