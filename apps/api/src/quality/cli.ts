import {readFile,writeFile} from 'node:fs/promises';
import {createBaseline} from './baseline.js';
import {calculateV2} from './engine.js';
import {datasetDiagnostics} from './diagnostics.js';
import {hash} from './math.js';
import {fixtureItems,fixturePeople,fixturePerson} from './fixtures.js';
import type {Baseline,Item,Participant} from './types.js';
const args=process.argv.slice(2),command=args.shift(),flag=(key:string)=>args.includes('--'+key),option=(key:string)=>{const i=args.indexOf('--'+key);return i<0?undefined:args[i+1]};
async function run(){
  if(command==='backtest'){
    let items:Item[],people:Participant[],baseline:Baseline|null=null,surveyId=option('survey')??'synthetic-fixture';
    if(flag('demo')){
      items=fixtureItems;people=fixturePeople();baseline=createBaseline(surveyId,items,people);
      const cases=Array.from({length:20},(_,i)=>{const p=fixturePerson('case-'+i,i%4===1?'random':i%4===2?'extreme':'consistent',i%4===3?.5:8);p.trusted=false;p.cohort='public';if(i<4)Object.values(p.answers).forEach(a=>a.activeSeconds=null);return p;});people.push(...cases);
    }else if(option('input')){
      const input=JSON.parse(await readFile(option('input')!,'utf8'));items=input.items;people=input.people;baseline=input.baseline??null;surveyId=input.surveyId??surveyId;
    }else{
      if(!option('survey'))throw new Error('--survey or --input is required');
      const service=await import('./service.js'),database=await import('../db.js');
      try{({items,people}=await service.loadQualityInputs(surveyId));baseline=await service.activeBaseline(surveyId);}finally{await database.db.end();}
    }
    baseline??=createBaseline(surveyId,items,people);
    if(baseline.itemHash!==hash(items))throw new Error('Input metadata differs from frozen baseline');
    const results=Object.fromEntries(people.map(p=>[p.id,calculateV2(p,items,baseline)])),diagnostics=datasetDiagnostics(items,people,results);
    const report={source:flag('demo')?'SYNTHETIC — not production respondents':option('input')?'provided_raw_snapshot':'database',surveyId,algorithm:baseline.config.version,baseline_version:baseline.version,baseline_source:baseline.source,reference_n:baseline.memberIds.length,cohorts:Object.fromEntries(['trusted','public','unassigned'].map(c=>[c,people.filter(p=>c==='trusted'?p.trusted:p.cohort===c).length])),diagnostics,summary:people.map(p=>({id:p.id,cohort:p.cohort,overall:results[p.id].overall.score,behavior:results[p.id].behavioral.score,response:results[p.id].response.score,confidence:results[p.id].overall.confidence,rpr:results[p.id].response.components.rpr?.metrics.rpr,flags:results[p.id].overall.flags}))};
    const out=option('out')??'quality-v2-backtest.json';await writeFile(out,JSON.stringify(report,null,2),'utf8');console.log(JSON.stringify({out,source:report.source,baseline_version:baseline.version,n:people.length,cohorts:report.cohorts,distributions:diagnostics.distributions}));
    return;
  }
  if(command==='replay'){
    const input=JSON.parse(await readFile(option('input')!,'utf8')) as {items:Item[];participant:Participant;baseline:Baseline;calculated_at?:string};
    if(input.baseline.itemHash!==hash(input.items))throw new Error('Snapshot metadata hash mismatch');
    const result=calculateV2(input.participant,input.items,input.baseline,input.calculated_at);
    await writeFile(option('out')??'quality-v2-replay.json',JSON.stringify(result,null,2),'utf8');console.log('Frozen snapshot replay complete');return;
  }
  const service=await import('./service.js'),{db}=await import('../db.js');
  try{
    const surveyId=option('survey');if(!surveyId)throw new Error('--survey is required');
    if(command==='recompute'){
      const result=await service.recompute(surveyId,{sessionId:option('session'),cohort:option('cohort'),baselineVersion:option('baseline')},(done,total)=>console.log(done+'/'+total));console.log(JSON.stringify({count:result.count,baseline:result.baseline_version}));return;
    }
    if(command==='freeze'){
      const baseline=await service.freezeBaseline(surveyId,option('cohort'));console.log(JSON.stringify({version:baseline.version,source:baseline.source,n:baseline.memberIds.length}));return;
    }
    if(command==='metadata'){
      const input=JSON.parse(await readFile(option('input')!,'utf8')) as {sessionId:string;cohort?:string;trusted?:boolean;eligibility?:string;eligibilityReason?:string;duplicate?:boolean;telemetryVersion?:string|null}[];
      const {z}=await import('zod');
      const rows=z.array(z.object({sessionId:z.string().uuid(),cohort:z.enum(['trusted','public','unassigned','admin_test']).optional(),trusted:z.boolean().optional(),eligibility:z.enum(['unknown','pass','fail']).optional(),eligibilityReason:z.string().max(1000).nullable().optional(),duplicate:z.boolean().optional(),telemetryVersion:z.string().max(60).nullable().optional()})).parse(input);
      console.log(JSON.stringify({survey:surveyId,rows:rows.length,dryRun:!flag('apply')}));
      if(!flag('apply'))return;
      const connection=await db.getConnection();
      try{await connection.beginTransaction();for(const row of rows){const [owned]=await connection.query<any[]>('SELECT id FROM response_sessions WHERE id=? AND survey_id=?',[row.sessionId,surveyId]);if(!owned.length)throw new Error('Session outside selected survey');await connection.execute('INSERT IGNORE INTO quality_metadata(session_id) VALUES (?)',[row.sessionId]);const columns:Record<string,string>={cohort:'cohort',trusted:'calibration_trusted',eligibility:'eligibility',eligibilityReason:'eligibility_reason',duplicate:'confirmed_duplicate',telemetryVersion:'telemetry_version'},entries=Object.entries(row).filter(([k])=>k in columns);if(entries.length)await connection.execute('UPDATE quality_metadata SET '+entries.map(([k])=>columns[k]+'=?').join(',')+' WHERE session_id=?',[...entries.map(([,v])=>v),row.sessionId]);}await connection.commit();}catch(e){await connection.rollback();throw e;}finally{connection.release();}
      console.log('Metadata applied; freeze a new baseline explicitly, then recompute.');return;
    }
    throw new Error('Use backtest, recompute, freeze, metadata or replay');
  }finally{await db.end();}
}
run().catch(e=>{console.error(e instanceof Error?e.message:String(e));process.exitCode=1;});
