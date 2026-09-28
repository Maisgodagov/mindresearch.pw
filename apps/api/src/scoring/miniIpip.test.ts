import{describe,expect,it}from'vitest';
import{miniIpipInstrument}from'../data/miniIpip.js';
import{miniIpipScales,scoreMiniIpip}from'./miniIpip.js';

describe('Mini-IPIP',()=>{
  it('ships the published 20 items in Appendix order',()=>{
    expect(miniIpipInstrument.code).toBe('test_16');
    expect(miniIpipInstrument.questions).toHaveLength(20);
    expect(miniIpipInstrument.questions[0].text).toBe('Am the life of the party.');
    expect(miniIpipInstrument.questions[19].text).toBe('Do not have a good imagination.');
  });

  it('contains five four-item scales and covers every item once',()=>{
    const itemNumbers=Object.values(miniIpipScales).flatMap(scale=>scale.items.map(([item])=>item)).sort((a,b)=>a-b);
    expect(Object.keys(miniIpipScales)).toHaveLength(5);
    expect(itemNumbers).toEqual(Array.from({length:20},(_,index)=>index+1));
  });

  it('scores direct and reverse items by IPIP rules',()=>{
    const result=scoreMiniIpip(new Map(Array.from({length:20},(_,index)=>[index+1,1] as const)))!;
    expect(result.scales.extraversion.score).toBe(12);
    expect(result.scales.neuroticism.score).toBe(12);
    expect(result.scales.intellectImagination.score).toBe(16);
    expect(result.scales.intellectImagination.average).toBe(4);
  });

  it('rejects incomplete or invalid protocols',()=>{
    expect(scoreMiniIpip(new Map([[1,3]]))).toBeNull();
    expect(scoreMiniIpip(new Map(Array.from({length:20},(_,index)=>[index+1,index===2?0:3] as const)))).toBeNull();
  });
});
