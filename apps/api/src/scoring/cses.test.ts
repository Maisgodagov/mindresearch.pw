import { describe, expect, it } from 'vitest';
import { csesInstrument } from '../data/cses.js';
import { CSES_REVERSE_ITEMS, scoreCses } from './cses.js';

describe('CSES scoring',()=>{
  it('defines the original 12 item scale',()=>{
    expect(csesInstrument.code).toBe('test_18');
    expect(csesInstrument.questions).toHaveLength(12);
    expect(csesInstrument.questions[0].text).toBe('I am confident I get the success I deserve in life.');
    expect(csesInstrument.questions[11].text).toBe('There are times when things look pretty bleak and hopeless to me.');
    expect(CSES_REVERSE_ITEMS).toEqual([2,4,6,8,10,12]);
  });

  it('scores direct and reverse items on 1-5 scale',()=>{
    const max=new Map(Array.from({length:12},(_,i)=>{
      const number=i+1;
      return [number,CSES_REVERSE_ITEMS.includes(number)?1:5] as const;
    }));
    const min=new Map(Array.from({length:12},(_,i)=>{
      const number=i+1;
      return [number,CSES_REVERSE_ITEMS.includes(number)?5:1] as const;
    }));
    expect(scoreCses(max)).toMatchObject({score:60,average:5});
    expect(scoreCses(min)).toMatchObject({score:12,average:1});
  });

  it('requires a complete valid protocol',()=>{
    expect(scoreCses(new Map([[1,5]]))).toBeNull();
    expect(scoreCses(new Map(Array.from({length:12},(_,i)=>[i+1,6])))).toBeNull();
  });
});
