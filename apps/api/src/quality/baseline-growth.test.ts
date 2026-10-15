import { describe, expect, it } from 'vitest';
import { shouldGrowBaseline, eligibleReferenceCount } from './baseline-growth.js';
import { QUALITY_V2_CONFIG } from './config.js';
import type { Baseline } from './types.js';
const baseline=(n:number,source='completed')=>({memberIds:Array.from({length:n},(_,i)=>String(i)),source,config:QUALITY_V2_CONFIG}) as Baseline;
describe('reference growth',()=>{
 it('upgrades stale first-participant reference at 25 eligible completions',()=>{expect(shouldGrowBaseline(baseline(1),9)).toBe(false);expect(shouldGrowBaseline(baseline(1),10)).toBe(true);expect(shouldGrowBaseline(baseline(10),24)).toBe(false);expect(shouldGrowBaseline(baseline(1),36)).toBe(true)});
 it('grows in stages, then stays frozen',()=>{expect(shouldGrowBaseline(baseline(25),36)).toBe(false);expect(shouldGrowBaseline(baseline(25),50)).toBe(true);expect(shouldGrowBaseline(baseline(50),100)).toBe(true);expect(shouldGrowBaseline(baseline(100),500)).toBe(false)});
 it('preserves trusted references and other algorithm versions',()=>{expect(shouldGrowBaseline(baseline(1,'trusted'),100)).toBe(false);expect(shouldGrowBaseline({...baseline(1),config:{...QUALITY_V2_CONFIG,version:'old'}},100)).toBe(false);expect(shouldGrowBaseline(null,100)).toBe(false)});
 it('excludes incomplete, deleted upstream, test, duplicate and ineligible participants',()=>{const people=[{}, {status:'in_progress'}, {duplicate:true}, {eligibility:'fail'}, {cohort:'admin_test'}].map(p=>({status:'completed',duplicate:false,eligibility:'unknown',cohort:'unassigned',...p})) as Parameters<typeof eligibleReferenceCount>[0];expect(eligibleReferenceCount(people)).toBe(1)});
});

it('a 36-person reference makes previously unavailable behavioral scores calculable', async () => {
  const { createBaseline } = await import('./baseline.js');
  const { calculateV2 } = await import('./engine.js');
  const { fixtureItems, fixturePeople, fixturePerson } = await import('./fixtures.js');
  const people = fixturePeople().slice(0,36).map(p => ({...p, trusted:false, cohort:'unassigned'}));
  const early = createBaseline('growth-fixture',fixtureItems,people.slice(0,1));
  expect(shouldGrowBaseline(early,people.length)).toBe(true);
  const participant = fixturePerson('new-participant');
  expect(calculateV2(participant,fixtureItems,early).overall.score).toBeNull();
  const grown = createBaseline('growth-fixture',fixtureItems,people);
  expect(calculateV2(participant,fixtureItems,grown).behavioral.score).not.toBeNull();
  expect(calculateV2(people[0],fixtureItems,grown).behavioral.score).not.toBeNull();
},30000);