import { beforeAll, describe, expect, it } from 'vitest';
import { fixtureItems as items,fixturePerson,fixturePeople } from './fixtures.js';
import { createBaseline } from './baseline.js';
import { calculateV2, aggregateOverall } from './engine.js';
import { QUALITY_V2_CONFIG as config } from './config.js';
import { geometric, spearman, hash } from './math.js';
import { rpr, patterns,referenceModel } from './psychometrics.js';
import { normalized,keyFor } from './keys.js';
import { alpha } from './diagnostics.js';
import {createQualityWorker} from './worker-runtime.js';
import type {Baseline,Index} from './types.js';
let baseline:Baseline;
const now='2026-10-07T00:00:00Z';
beforeAll(()=>{baseline=createBaseline('fixture-survey',items,fixturePeople());},30000);
const result=(p=fixturePerson('new-consistent'))=>calculateV2(p,items,baseline,now);
const idx=(score:number|null):Index=>({score,confidence:score===null?0:1,status:score===null?'insufficient_data':'high',partial:false,flags:[],components:{},metrics:{},version:config.version,calculated_at:now,baseline_version:baseline.version});
describe('Behavioral domain',()=>{
 it('normal pace is high',()=>expect(result().behavioral.score).toBeGreaterThan(90));
 it('all answers in half a second score low',()=>expect(result(fixturePerson('fast','consistent',.5)).behavioral.score).toBeLessThan(30));
 it('a few isolated fast questions do not collapse quality',()=>{const p=fixturePerson('few-fast');[2,17,41].forEach(i=>p.answers[items[i].id].activeSeconds=.5);expect(result(p).behavioral.score).toBeGreaterThan(80);});
 it('elapsed pauses never penalize the active-time score',()=>{const p=fixturePerson('pause'),q=structuredClone(p);q.completedAt='2026-10-01T00:00:00Z';expect(result(p).behavioral).toEqual(result(q).behavioral);});
 it('threefold end acceleration is flagged',()=>{const p=fixturePerson('fatigue');items.slice(48).forEach(i=>p.answers[i.id].activeSeconds=8/3);expect(result(p).behavioral.flags.some(f=>f.code==='BEHAVIOR_ACCELERATION')).toBe(true);});
 it('without telemetry score is null, not zero',()=>{const p=fixturePerson('old');Object.values(p.answers).forEach(a=>a.activeSeconds=null);expect(result(p).behavioral.score).toBeNull();expect(result(p).overall.score).not.toBeNull();expect(result(p).overall.partial).toBe(true);});
 it('behavior is independent of answers',()=>{const a=fixturePerson('a','consistent'),b=fixturePerson('a','random');expect(result(a).behavioral).toEqual(result(b).behavioral);});
 it('acceleration requires a recorded visit sequence',()=>{const p=fixturePerson('old-sequence');Object.values(p.answers).forEach(a=>delete a.visitSequence);expect(result(p).behavioral.components.acceleration.score).toBeNull();});
 it('long inactive time cannot hide uniform speeding',()=>{const p=fixturePerson('mask','consistent',.5);p.answers[items[0].id].activeSeconds=36000;expect(result(p).behavioral.score).toBeLessThan(40);});
 it('missing reference data does not manufacture a score',()=>{const p=fixturePerson('new');expect(calculateV2(p,items,null,now).behavioral.score).toBeNull();});
});
describe('Response domain',()=>{
 it('consistent profiles have high RPR',()=>expect(rpr(fixturePerson('consistency'),items,baseline.full.splits,config).value).toBeGreaterThan(.85));
 it('random responses have substantially lower RPR',()=>{const a=rpr(fixturePerson('same'),items,baseline.full.splits,config),b=rpr(fixturePerson('same','random'),items,baseline.full.splits,config);expect(a.value!-b.value!).toBeGreaterThan(.4);});
 it('extreme consistent psychological profiles retain high response quality',()=>{const q=result(fixturePerson('extreme','extreme'));expect(q.response.score).toBeGreaterThan(70);expect(q.response.flags.some(f=>f.severity==='strong')).toBe(false);});
 it('longstring five is not an automatic flag or penalty',()=>{const p=fixturePerson('run5','random');items.slice(0,5).forEach(i=>p.answers[i.id].value=1);p.answers[items[5].id].value=2;expect(patterns(p,items,config).battery.run).toBe(5);expect(result(p).response.components.patterning.score).toBe(100);});
 it('extreme mechanical longstring gets a reference-based flag',()=>{const p=fixturePerson('mechanical');Object.values(p.answers).forEach(a=>a.value=1);expect(result(p).response.flags.some(f=>f.code==='RESPONSE_EXTREME_LONGSTRING')).toBe(true);expect(result(p).response.components.patterning.score).toBeGreaterThanOrEqual(65);});
 it('no attention checks means no attention penalty',()=>{const q=result();expect(q.response.components.attention.score).toBeNull();expect(q.response.flags.some(f=>f.domain==='attention')).toBe(false);});
 it('two failed attention checks cause a strong flag',()=>{const p=fixturePerson('attention'),extra=items.slice(0,2).map((i,n)=>({...i,id:'attention'+n,attentionExpected:7,exclude:true}));extra.forEach(i=>p.answers[i.id]={value:1,activeSeconds:1,visits:1});const q=calculateV2(p,[...items,...extra],baseline,now);expect(q.response.flags.some(f=>f.domain==='attention'&&f.severity==='strong')).toBe(true);});
 it('response is independent of all time fields',()=>expect(result(fixturePerson('equal','consistent',8)).response).toEqual(result(fixturePerson('equal','consistent',.5)).response));
 it('attention items are excluded from time and psychometric reference',()=>{const extra={...items[0],id:'attention-item',attentionExpected:2};const m=referenceModel([...items,extra],fixturePeople(),config,'seed');expect(m.time[extra.id]).toBeUndefined();expect(m.pairs.some(p=>p.a===extra.id||p.b===extra.id)).toBe(false);});
 it('missing/invalid responses are not numerically coerced into valid answers',()=>{expect(normalized(items[0],null)).toBeNull();expect(normalized(items[0],'')).toBeNull();expect(normalized(items[0],99)).toBeNull();});
});
describe('Aggregate, reproducibility and legacy',()=>{
 it('90 and 90 produce 90',()=>expect(aggregateOverall(idx(90),idx(90),baseline,config,now).score).toBe(90));
 it('100 and 25 produce geometric 50',()=>expect(aggregateOverall(idx(100),idx(25),baseline,config,now).score).toBe(50));
 it('missing behavior preserves response and limits confidence',()=>{const q=aggregateOverall(idx(null),idx(90),baseline,config,now);expect(q.score).toBe(90);expect(q.confidence).toBeLessThanOrEqual(.6);expect(q.partial).toBe(true);});
 it('two missing indices remain insufficient',()=>expect(aggregateOverall(idx(null),idx(null),baseline,config,now).score).toBeNull());
 it('V1 value is excluded from every V2 result and hash',()=>{const p=fixturePerson('legacy'),q=structuredClone(p);p.legacy_quality_v1=0;q.legacy_quality_v1=100;expect(result(p)).toEqual(result(q));});
 it('changing V1 cannot change baseline membership or reference version',()=>{const people=fixturePeople().slice(0,60),other=structuredClone(people);other.forEach(p=>p.legacy_quality_v1=0);const a=createBaseline('legacy',items,people),b=createBaseline('legacy',items,other);expect(a.version).toBe(b.version);expect(a.full).toEqual(b.full);});
 it('calibration participant uses a held-out fold',()=>{const p=fixturePeople()[0],fold=baseline.memberFold[p.id];expect(baseline.folds[fold].n).toBeLessThan(baseline.full.n);expect(baseline.folds[fold].time[items[0].id].n).toBe(80);const model=referenceModel(items,fixturePeople().filter(p=>baseline.memberFold[p.id]!==fold),config,config.seed+':'+config.version+':'+baseline.version);expect(model.pairs).toEqual(baseline.folds[fold].pairs);});
 it('same frozen baseline and raw data are exactly reproducible',()=>expect(result()).toEqual(result()));
 it('raw answers never change during quality calculation',()=>{const p=fixturePerson('raw'),before=hash(p);result(p);expect(hash(p)).toBe(before);});
 it('config is frozen by value',()=>{const c=structuredClone(config),b=createBaseline('config',items,fixturePeople().slice(0,60),c),before=b.configHash;c.behavior.fastSeconds=50;expect(hash(b.config)).toBe(before);});
 it('multiple correlated speeding flags count as one independent domain',()=>{const q=result(fixturePerson('quick','consistent',.5));expect(q.strong_flag_count).toBeGreaterThan(1);expect(q.independent_concerning_domains).toBe(1);});
 it('absent components redistribute weights',()=>expect(geometric([{score:90,weight:.45},{score:null,weight:.3}])).toBe(90));
 it('Spearman handles tied ranks',()=>expect(spearman([1,1,2,3],[2,2,4,6])).toBeCloseTo(1));
 it('alpha is a group statistic only',()=>expect(alpha([[1,1,1],[2,2,2],[3,3,3]])).toBeCloseTo(1));
 it('verified reverse keys preserve direction',()=>{expect(keyFor('test_3',1).scales[0].reverse).toBe(true);expect(keyFor('test_6',31).scales[0].reverse).toBe(true);expect(keyFor('unverified',1).scales).toEqual([]);});
});


it('background worker loads TypeScript and calculates without blocking the API',async()=>{
 const worker=createQualityWorker();
 try{const value=await new Promise<any>((resolve,reject)=>{worker.once('error',reject);worker.on('message',m=>{if(m.type==='error')reject(new Error(m.message));if(m.type==='result')resolve(m.value);});worker.postMessage({task:'calculate_subset',surveyId:'fixture-survey',items,people:[fixturePerson('worker')],baseline});});expect(value.results.worker.overall.score).toBeGreaterThan(70);expect(value.diagnostics).toBeNull();}finally{await worker.terminate();}
},15000);

it('uniform but coherent normalized profile has undefined RPR, not a false low correlation',()=>{const p=fixturePerson('uniform');items.forEach(i=>p.answers[i.id].value=i.scales[0].reverse?1:7);const q=result(p);expect(q.response.components.rpr.score).toBeNull();expect(q.response.score).toBeGreaterThan(70);});
it('reference selection excludes confirmed duplicates and failed eligibility only from calibration',()=>{const people=fixturePeople().slice(0,60);people[0].duplicate=true;people[1].eligibility='fail';const b=createBaseline('eligibility',items,people);expect(b.memberIds).not.toContain(people[0].id);expect(b.memberIds).not.toContain(people[1].id);const q=calculateV2(people[1],items,b,now);expect(q.hard_checks.eligibility).toBe('fail');expect(q.overall.score).toBeGreaterThan(70);});
it('pair dictionary limits every item to three pairs',()=>{const count=new Map<string,number>();baseline.full.pairs.forEach(p=>[p.a,p.b].forEach(id=>count.set(id,(count.get(id)??0)+1)));expect(Math.max(...count.values())).toBeLessThanOrEqual(config.response.pairs.maxPerItem);});

it('blank and invalid mandatory answers fail completeness without a score penalty rule',()=>{const p=fixturePerson('missing-required');p.answers[items[0].id].value='';expect(result(p).hard_checks.completeness.complete).toBe(false);});
