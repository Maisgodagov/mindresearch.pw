import {beforeEach,expect,it,vi} from 'vitest';
import {methodology as pss} from '../data/methodologies/method-2523.js';
import {methodology as ocai} from '../data/methodologies/method-0358.js';
import {methodology as educational} from '../data/methodologies/method-0396.js';
import {methodology as dembo} from '../data/methodologies/method-0523.js';
import {methodology as difficulties} from '../data/methodologies/method-0724.js';
import {methodology as motivation} from '../data/methodologies/method-0731.js';
import {methodology as lsas} from '../data/methodologies/method-2413.js';
import {aiqIvRuInstrument,aiqIvRuScoring,aiqIvRuValidationCases} from '../data/aiqIvRu.js';
const database=vi.hoisted(()=>({query:vi.fn(),execute:vi.fn().mockResolvedValue([{}])}));
vi.mock('../db.js',()=>({db:database}));
import {calculateConfiguredAssessmentsForSession} from './index.js';
beforeEach(()=>vi.clearAllMocks());
const aiq={instrument:aiqIvRuInstrument,scoringConfig:aiqIvRuScoring,validationCases:aiqIvRuValidationCases,formulaVersion:'aiq-iv-cheek-voiskounsky-35ru-v1'};
it.each([pss,ocai,educational,dembo,difficulties,motivation,lsas,aiq])('maps $instrument.code by canonical template position, not its code suffix',async m=>{
 const test=m.validationCases![0];
 database.query.mockResolvedValue([m.instrument.questions.map((question,index)=>({sectionId:'section',sectionCode:'copied-section',instrumentCode:m.instrument.code,questionCode:question.code,itemNumber:index+1,value:test.answers[String(index+1)]===undefined?null:JSON.stringify(test.answers[String(index+1)]),title:m.instrument.title,formulaVersion:m.formulaVersion,scoringConfig:JSON.stringify(m.scoringConfig)})).reverse()]);
 await calculateConfiguredAssessmentsForSession('session',['copied-section']);
 expect(database.query.mock.calls[0][0]).toContain('iq.position+1 itemNumber');
 expect(database.execute.mock.calls[0][0]).toContain('INSERT INTO assessment_results');
 const stored=JSON.parse(database.execute.mock.calls[0][1][3]);
 expect(Object.fromEntries(Object.entries(stored.scales).map(([key,value])=>[key,(value as {score:number}).score]))).toEqual(test.expected);
});
it('does not guess a question number when the copied code cannot be matched to its source',async()=>{
 database.query.mockResolvedValue([[{sectionId:'section',sectionCode:'section',instrumentCode:'test_2451',questionCode:'test_2451_1',itemNumber:null,value:'4',scoringConfig:JSON.stringify({min:1,max:7,scales:[{key:'shs',label:'SHS',items:[1],reverseItems:[],aggregation:'mean'}]})}]]);
 await calculateConfiguredAssessmentsForSession('session');
 expect(database.execute.mock.calls[0][0]).toContain('DELETE FROM assessment_results');
});
