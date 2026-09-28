import{describe,expect,it}from'vitest';
import{ipipNeo120Instrument}from'../data/ipipNeo120.js';
import{ipipNeo120Facets,scoreIpipNeo120}from'./ipipNeo120.js';

describe('IPIP-NEO-120',()=>{
  it('ships the published 120 English items with five response anchors',()=>{
    expect(ipipNeo120Instrument.code).toBe('test_15');
    expect(ipipNeo120Instrument.questions).toHaveLength(120);
    expect(ipipNeo120Instrument.questions[0].text).toBe('Worry about things');
    expect(ipipNeo120Instrument.questions[119].text).toBe('Act without thinking');
    expect(ipipNeo120Instrument.questions.every(q=>q.options?.map(o=>o.value).join(',')==='1,2,3,4,5')).toBe(true);
  });

  it('contains 30 four-item facets and covers every item exactly once',()=>{
    const itemNumbers=Object.values(ipipNeo120Facets).flatMap(facet=>facet.items.map(([item])=>item)).sort((a,b)=>a-b);
    expect(Object.keys(ipipNeo120Facets)).toHaveLength(30);
    expect(itemNumbers).toEqual(Array.from({length:120},(_,index)=>index+1));
  });

  it('scores direct and reversed items by official IPIP rules',()=>{
    const allOnes=new Map(Array.from({length:120},(_,index)=>[index+1,1] as const));
    const result=scoreIpipNeo120(allOnes)!;
    expect(result.facets.N1.score).toBe(4);
    expect(result.facets.N2.score).toBe(8);
    expect(result.facets.A2.score).toBe(20);
    expect(result.domains.neuroticism.score).toBe(52);
    expect(result.domains.neuroticism.average).toBeCloseTo(52/24);
  });

  it('rejects missing and out-of-range protocols',()=>{
    expect(scoreIpipNeo120(new Map([[1,3]]))).toBeNull();
    expect(scoreIpipNeo120(new Map(Array.from({length:120},(_,index)=>[index+1,index===0?6:3] as const)))).toBeNull();
  });
});
