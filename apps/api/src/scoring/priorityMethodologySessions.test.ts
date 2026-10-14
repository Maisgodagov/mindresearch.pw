import { beforeEach, expect, it, vi } from 'vitest';
import { methodology as burnout } from '../data/methodologies/method-1178.js';
import { methodology as oro } from '../data/methodologies/method-1890.js';
import { methodology as dass } from '../data/methodologies/method-2100.js';
const database=vi.hoisted(()=>({query:vi.fn(),execute:vi.fn().mockResolvedValue([{}])}));
vi.mock('../db.js',()=>({db:database}));
import { calculateConfiguredAssessmentsForSession } from './index.js';
beforeEach(()=>vi.clearAllMocks());

it.each([
  {m:burnout,value:'0',expected:{emotional_exhaustion:{score:6,max:54},depersonalization:{score:0,max:30},reduced_parental_accomplishment:{score:0,max:48}}},
  {m:oro,value:'yes',expected:{acceptance_rejection:{score:30,max:30},cooperation:{score:8,max:8},symbiosis:{score:7,max:7},authoritarian_hypersocialization:{score:7,max:7},little_loser:{score:8,max:8}}},
  {m:dass,value:'3',expected:{depression:{score:42,max:42},anxiety:{score:42,max:42},stress:{score:42,max:42}}},
])('saves scores, version and ranges for $m.instrument.code from stored JSON answers',async({m,value,expected})=>{
  database.query.mockResolvedValue([m.instrument.questions.map(q=>({sectionId:'section',sectionCode:m.instrument.code,questionCode:q.code,value:JSON.stringify(value),title:m.instrument.title,formulaVersion:m.formulaVersion,scoringConfig:JSON.stringify(m.scoringConfig)}))]);
  await calculateConfiguredAssessmentsForSession('session',[m.instrument.code]);
  expect(database.execute).toHaveBeenCalledTimes(1);
  const [sql,args]=database.execute.mock.calls[0];
  expect(sql).toContain('INSERT INTO assessment_results');expect(args[2]).toBe(m.formulaVersion);
  expect(JSON.parse(args[3])).toMatchObject({complete:true,answered:m.instrument.questions.length,scales:expected});
});
