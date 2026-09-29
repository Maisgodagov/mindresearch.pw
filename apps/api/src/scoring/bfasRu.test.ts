import { describe, expect, it } from 'vitest';
import { bfasRuInstrument, bfasRuScoring, bfasRuValidationCases } from '../data/bfasRu.js';
import { calculateConfigurableScores, checkConfigurableCases } from './configurable.js';

describe('Russian BFAS',()=>{
  it('keeps the published 100-item, 10-aspect structure',()=>{
    expect(bfasRuInstrument.questions).toHaveLength(100);
    expect(bfasRuScoring.scales).toHaveLength(15);
    expect(checkConfigurableCases({questions:bfasRuInstrument.questions.map(q=>({text:q.text,options:q.options??[]})),scoring:bfasRuScoring,cases:bfasRuValidationCases})).toMatchObject({passed:true});
  });

  it('reverse-codes (R) items and aggregates aspect and domain means',()=>{
    const answers=Object.fromEntries(Array.from({length:100},(_,i)=>[String(i+1),3]));
    answers['1']=5;
    answers['2']=1;
    const actual=calculateConfigurableScores(bfasRuScoring,answers);
    expect(actual).not.toBeNull();
    expect(actual?.enthusiasm).toBe(3.4);
    expect(actual?.assertiveness).toBe(3);
    expect(actual?.extraversion).toBe(3.2);
  });

  it('does not score an incomplete response',()=>{
    expect(calculateConfigurableScores(bfasRuScoring,{'1':3})).toBeNull();
  });
});
