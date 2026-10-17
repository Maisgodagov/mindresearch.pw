import {beforeEach,describe,it,expect,vi} from 'vitest';
vi.mock('./db.js',()=>({db:{query:vi.fn()}}));
import {db} from './db.js';
import {loadAnswerDistribution,loadDistributionMembers} from './survey-results.js';
describe('Sample-scoped answer distributions',()=>{
  beforeEach(()=>vi.clearAllMocks());
  it('returns no answers for an empty sample without querying the whole survey',async()=>{
    expect(await loadAnswerDistribution('survey',[])).toEqual([]);expect(db.query).not.toHaveBeenCalled();
  });
  it('limits aggregates to this survey, non-deleted sessions and requested IDs',async()=>{
    vi.mocked(db.query).mockResolvedValueOnce([[{questionId:'q',type:'single',code:'q1',text:'Question',options:[{value:1,label:'Yes'}],value:'1',count:2,sectionPosition:0,questionPosition:0}],[]] as any);
    const result=await loadAnswerDistribution('survey',['a','b']);
    const [sql,params]=vi.mocked(db.query).mock.calls[0];
    expect(sql).toContain('rs.survey_id=? AND s.survey_id=? AND rs.deleted_at IS NULL');
    expect(sql).toContain('rs.id IN (?,?)');expect(params).toEqual(['survey','survey','a','b']);
    expect(result[0]).toMatchObject({questionId:'q',label:'Yes',count:2});
  });
});

describe('Individual multiple-choice options',()=>{
  const options=[{value:'parents',label:'К родителям'},{value:'friends',label:'К друзьям, коллегам'},{value:'relatives',label:'К другим родственникам'}];
  beforeEach(()=>vi.clearAllMocks());
  it('aggregates each option separately regardless of combination order, without splitting commas inside labels',async()=>{
    vi.mocked(db.query).mockResolvedValueOnce([[
      {questionId:'q',type:'multiple',options,value:JSON.stringify(['parents','friends']),count:2},
      {questionId:'q',type:'multiple',options,value:JSON.stringify(['friends','parents']),count:1},
      {questionId:'q',type:'multiple',options,value:JSON.stringify(['relatives']),count:1},
    ],[]] as any);
    expect((await loadAnswerDistribution('survey')).map(row=>({label:row.label,count:row.count}))).toEqual([
      {label:'К родителям',count:3},{label:'К друзьям, коллегам',count:3},{label:'К другим родственникам',count:1},
    ]);
  });
  it('matches any selected option inside responses containing other options and deduplicates members',async()=>{
    vi.mocked(db.query).mockResolvedValueOnce([[
      {sessionId:'a',options,value:JSON.stringify(['parents','friends'])},
      {sessionId:'b',options,value:JSON.stringify(['relatives','parents'])},
      {sessionId:'c',options,value:JSON.stringify(['friends'])},
    ],[]] as any);
    expect(await loadDistributionMembers('survey','q',['К родителям','К другим родственникам'])).toEqual(['a','b']);
  });
  it('does not match a combined label or split a label containing a comma',async()=>{
    vi.mocked(db.query).mockResolvedValueOnce([[
      {sessionId:'a',options,value:JSON.stringify(['friends'])},
    ],[]] as any);
    expect(await loadDistributionMembers('survey','q',['К друзьям'])).toEqual([]);
  });
});
