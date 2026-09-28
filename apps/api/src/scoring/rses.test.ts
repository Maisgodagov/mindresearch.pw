import { describe, expect, it } from 'vitest';
import { rsesInstrument } from '../data/rses.js';
import { RSES_REVERSE_ITEMS, scoreRses } from './rses.js';

describe('RSES scoring',()=>{
  it('defines 10 required items',()=>{
    expect(rsesInstrument.code).toBe('test_17');
    expect(rsesInstrument.questions).toHaveLength(10);
    expect(RSES_REVERSE_ITEMS).toEqual([2,5,6,8,9]);
  });

  it('scores direct and reverse items on 0-30 scale',()=>{
    const max=new Map(Array.from({length:10},(_,i)=>{
      const number=i+1;
      return [number,RSES_REVERSE_ITEMS.includes(number)?0:3] as const;
    }));
    const min=new Map(Array.from({length:10},(_,i)=>{
      const number=i+1;
      return [number,RSES_REVERSE_ITEMS.includes(number)?3:0] as const;
    }));
    expect(scoreRses(max)?.score).toBe(30);
    expect(scoreRses(max)?.level).toBe('high');
    expect(scoreRses(min)?.score).toBe(0);
    expect(scoreRses(min)?.level).toBe('low');
  });

  it('requires a complete valid protocol',()=>{
    expect(scoreRses(new Map([[1,3]]))).toBeNull();
    expect(scoreRses(new Map(Array.from({length:10},(_,i)=>[i+1,4])))).toBeNull();
  });
});
