import { describe, expect, it } from 'vitest';
import { methodology as burnout } from '../data/methodologies/method-1178.js';
import { methodology as oro } from '../data/methodologies/method-1890.js';
import { methodology as dass } from '../data/methodologies/method-2100.js';
import { calculateConfigurableScores, checkConfigurableCases } from './configurable.js';

const profile = (count: number, value: string | number) => Object.fromEntries(Array.from({ length: count }, (_, i) => [String(i + 1), value]));
const score = (m: typeof burnout, answers: Record<string, unknown>) => calculateConfigurableScores(m.scoringConfig!, answers);

describe('Efimova parental burnout: author appendix, p. 38', () => {
  const keys = { emotional_exhaustion: [1,2,3,6,8,13,14,16,20], depersonalization: [5,10,11,15,22], reduced_parental_accomplishment: [4,7,9,12,17,18,19,21] };
  it('matches all item lists and the sole reverse item', () => {
    expect(burnout.instrument.questions).toHaveLength(22);
    for (const scale of burnout.scoringConfig!.scales) {
      expect(scale.items).toEqual(keys[scale.key as keyof typeof keys]);
      expect(scale.reverseItems).toEqual(scale.key === 'emotional_exhaustion' ? [6] : []);
    }
  });
  it.each([0,1,2,3,4,5,6])('checks constant answer %i independently', value => {
    expect(score(burnout, profile(22, value))).toEqual({ emotional_exhaustion: 8 * value + (6-value), depersonalization: 5*value, reduced_parental_accomplishment: 8*value });
  });
  it('tests every item in isolation, including the direction of item 6', () => {
    for (let item=1;item<=22;item++) {
      const expected = { emotional_exhaustion: 6, depersonalization: 0, reduced_parental_accomplishment: 0 };
      for (const [key, list] of Object.entries(keys)) if(list.includes(item)) expected[key as keyof typeof expected] += item===6 ? -1 : 1;
      expect(score(burnout,{...profile(22,0),[item]:1})).toEqual(expected);
    }
  });
  it('achieves both exhaustion limits, not just constant-response profiles', () => {
    expect(score(burnout,{...profile(22,0),'6':6})?.emotional_exhaustion).toBe(0);
    expect(score(burnout,{...profile(22,6),'6':0})?.emotional_exhaustion).toBe(54);
  });
});

describe('ORO: selected published 30/8/7/7/8 affirmative-answer key', () => {
  const keys = { acceptance_rejection:[3,4,8,10,12,14,15,16,18,20,24,26,27,29,37,38,39,40,42,43,44,45,46,47,49,52,53,55,56,60], cooperation:[6,9,21,25,31,34,35,36], symbiosis:[1,5,7,28,32,41,58], authoritarian_hypersocialization:[2,19,30,48,50,57,59], little_loser:[9,11,13,17,22,28,54,61] };
  it('preserves 61 questions and the exact chosen edition of all five keys', () => {
    expect(oro.instrument.questions).toHaveLength(61);
    for (const s of oro.scoringConfig!.scales) expect(s.items).toEqual(keys[s.key as keyof typeof keys]);
  });
  it('all no answers score zero and all yes answers give the five maxima', () => {
    expect(score(oro,profile(61,'no'))).toEqual({acceptance_rejection:0,cooperation:0,symbiosis:0,authoritarian_hypersocialization:0,little_loser:0});
    expect(score(oro,profile(61,'yes'))).toEqual({acceptance_rejection:30,cooperation:8,symbiosis:7,authoritarian_hypersocialization:7,little_loser:8});
  });
  it('checks every affirmative answer including shared and unused items', () => {
    for(let item=1;item<=61;item++) {
      const expected=Object.fromEntries(Object.entries(keys).map(([key,list])=>[key,list.includes(item)?1:0]));
      expect(score(oro,{...profile(61,'no'),[item]:'yes'})).toEqual(expected);
    }
  });
  it('rejects an unsupported answer value on a keyed item', () => {
    expect(score(oro,{...profile(61,'no'),'4':'maybe'})).toBeNull();
  });
});

describe('DASS-21: UNSW key and exactly one doubling', () => {
  const keys={depression:[3,5,10,13,16,17,21],anxiety:[2,4,7,9,15,19,20],stress:[1,6,8,11,12,14,18]};
  it('matches 21 items and the three official seven-item keys', () => {
    expect(dass.instrument.questions).toHaveLength(21);
    for(const s of dass.scoringConfig!.scales) expect(s.items).toEqual(keys[s.key as keyof typeof keys]);
  });
  it.each([0,1,2,3])('checks all answers %i', value => {
    expect(score(dass,profile(21,value))).toEqual({depression:14*value,anxiety:14*value,stress:14*value});
  });
  it('checks each item separately, ruling out scale swaps and double doubling', () => {
    for(let item=1;item<=21;item++) expect(score(dass,{...profile(21,0),[item]:3})).toEqual(Object.fromEntries(Object.entries(keys).map(([key,list])=>[key,list.includes(item)?6:0])));
  });
});

describe.each([burnout,oro,dass])('$instrument.title', m => {
  it('passes its recorded control profiles and boundaries', () => {
    expect(checkConfigurableCases({questions:m.instrument.questions.map(q=>({text:q.text,options:q.options!})),scoring:m.scoringConfig!,cases:m.validationCases!}).passed).toBe(true);
  });
  it('handles the actual string values stored by the survey', () => {
    const c=m.validationCases![0];
    expect(score(m,Object.fromEntries(Object.entries(c.answers).map(([key,value])=>[key,String(value)])))).toEqual(c.expected);
  });
  it('rejects missing or invalid keyed answers', () => {
    const c={...m.validationCases![0].answers};
    const key=String(m.scoringConfig!.scales[0].items[0]);
    delete c[key]; expect(score(m,c)).toBeNull();
    expect(score(m,{...m.validationCases![0].answers,[key]:999})).toBeNull();
  });
});
