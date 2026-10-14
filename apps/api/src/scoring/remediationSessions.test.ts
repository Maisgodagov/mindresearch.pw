import {beforeEach,expect,it,vi} from 'vitest';
import {methodology as cbi} from '../data/methodologies/method-0432.js';
import {methodology as oejts} from '../data/methodologies/method-0027.js';
const database=vi.hoisted(()=>({query:vi.fn(),execute:vi.fn().mockResolvedValue([{}])}));
vi.mock('../db.js',()=>({db:database}));
import {calculateConfiguredAssessmentsForSession} from './index.js';
beforeEach(()=>vi.clearAllMocks());
it.each([{m:cbi,expected:{personal:{score:50,min:0,max:100},work:{score:50,min:0,max:100},client:{score:50,min:0,max:100}}},{m:oejts,expected:{IE:{score:24,min:8,max:40},SN:{score:24,min:8,max:40},FT:{score:24,min:8,max:40},JP:{score:24,min:8,max:40}}}])('saves corrected mapped/offset ranges for $m.instrument.code',async({m,expected})=>{
 database.query.mockResolvedValue([m.instrument.questions.map((q,index)=>({sectionId:'section',sectionCode:m.instrument.code,instrumentCode:m.instrument.code,questionCode:q.code,itemNumber:index+1,value:JSON.stringify('3'),title:m.instrument.title,formulaVersion:m.formulaVersion,scoringConfig:JSON.stringify(m.scoringConfig)}))]);
 await calculateConfiguredAssessmentsForSession('session',[m.instrument.code]);
 expect(database.execute).toHaveBeenCalledTimes(1);
 expect(database.execute.mock.calls[0][0]).toContain('INSERT INTO assessment_results');
 expect(JSON.parse(database.execute.mock.calls[0][1][3])).toMatchObject({complete:true,scales:expected});
});
it('does not calculate a withdrawn instrument even when a stale database still marks it verified',async()=>{
 database.query.mockResolvedValue([[{sectionId:'section',sectionCode:'copied_section',instrumentCode:'test_83',questionCode:'test_83_1',value:'3',title:'Withdrawn',scoringConfig:JSON.stringify({min:1,max:5,scales:[{key:'x',label:'x',items:[1],reverseItems:[],aggregation:'sum'}]})}]]);
 await calculateConfiguredAssessmentsForSession('session');
 expect(database.execute).not.toHaveBeenCalled();
});
