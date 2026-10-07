import { createQualityWorker } from './worker-runtime.js';
import { randomUUID } from 'node:crypto';
import { db } from '../db.js';
import { keyFor } from './keys.js';
import { QUALITY_V2_CONFIG } from './config.js';
import { hash } from './math.js';
import type { Baseline, Item, Participant, QualityV2 } from './types.js';
export const qualityEnabled=()=>process.env.QUALITY_V2_ENABLED!=='0';
export function json<T=any>(value:any):T{return typeof value==='string'?JSON.parse(value):value;}
export async function loadQualityInputs(surveyId:string){
  const[qrows]=await db.query<any[]>(`SELECT q.*,s.code instrument,s.id block,s.title blockTitle,s.position blockPosition,s.section_kind sectionKind,i.scoring_code scoringCode FROM questions q JOIN sections s ON s.id=q.section_id LEFT JOIN instruments i ON i.id=s.source_instrument_id WHERE s.survey_id=? ORDER BY s.position,q.position`,[surveyId]);
  const items:Item[]=qrows.map((row,index)=>{const validation=json(row.validation)??{},instrument=row.scoringCode??row.instrument,number=Number(String(row.code).match(/(\d+)$/)?.[1]),key=keyFor(instrument,number),options=json(row.options)??[],attention=validation.qualityType==='attention_check'?validation.expectedValue:undefined;return{id:row.id,code:row.code,block:row.block,instrument,title:row.blockTitle,text:row.text,order:index,position:row.position,type:row.type,required:Boolean(row.required),options,...key,psychological:row.instrument!=='respondent'&&(key.scales.length>0||row.sectionKind==='verified'||validation.psychological===true),exclude:row.instrument==='respondent'||validation.excludeFromQuality===true,attentionExpected:attention}});
  const[sessions]=await db.query<any[]>(`SELECT rs.id,rs.status,rs.started_at startedAt,rs.completed_at completedAt,m.cohort,m.calibration_trusted trusted,m.eligibility,m.eligibility_reason eligibilityReason,m.confirmed_duplicate duplicate,m.telemetry_version telemetryVersion FROM response_sessions rs LEFT JOIN quality_metadata m ON m.session_id=rs.id WHERE rs.survey_id=? AND rs.deleted_at IS NULL ORDER BY rs.started_at DESC`,[surveyId]);
  const[answers]=await db.query<any[]>(`SELECT a.session_id sessionId,a.question_id questionId,CAST(a.value AS CHAR) value,qt.seconds activeSeconds,qt.visits,qt.firstVisitAt,qt.visitSequence FROM answers a JOIN response_sessions rs ON rs.id=a.session_id LEFT JOIN (SELECT t.session_id,t.question_id,SUM(t.active_ms)/1000 seconds,COUNT(*) visits,MIN(t.recorded_at) firstVisitAt,MIN(t.visit_sequence) visitSequence FROM question_timings t JOIN response_sessions r ON r.id=t.session_id WHERE r.survey_id=? GROUP BY t.session_id,t.question_id) qt ON qt.session_id=a.session_id AND qt.question_id=a.question_id WHERE rs.survey_id=? AND rs.deleted_at IS NULL`,[surveyId,surveyId]);
  const people:Participant[]=sessions.map(row=>({...row,alias:'Без псевдонима',cohort:row.cohort??'unassigned',trusted:Boolean(row.trusted),eligibility:row.eligibility??'unknown',eligibilityReason:row.eligibilityReason??null,duplicate:Boolean(row.duplicate),telemetryVersion:row.telemetryVersion??null,answers:{}}));const byId=new Map(people.map(p=>[p.id,p]));
  for(const row of answers){const p=byId.get(row.sessionId);if(!p)continue;p.answers[row.questionId]={value:json(row.value),activeSeconds:row.activeSeconds==null?null:Number(row.activeSeconds),visits:row.visits==null?null:Number(row.visits),visitSequence:row.visitSequence==null?null:Number(row.visitSequence),firstVisitAt:row.firstVisitAt?new Date(row.firstVisitAt).toISOString():null};const item=items.find(i=>i.id===row.questionId);if(item?.code==='alias')p.alias=String(json(row.value));if(row.activeSeconds!=null&&!p.telemetryVersion)p.telemetryVersion='visible-time-v1';}
  for(const p of people){p.startedAt=new Date(p.startedAt).toISOString();p.completedAt=p.completedAt?new Date(p.completedAt).toISOString():null;}
  return{items,people};
}
export async function activeBaseline(surveyId:string){const[rows]=await db.query<any[]>(`SELECT b.snapshot FROM quality_settings s JOIN quality_baselines b ON b.id=s.active_baseline WHERE s.survey_id=?`,[surveyId]);return rows.length?json<Baseline>(rows[0].snapshot):null;}
export async function storedQualities(surveyId:string){const baseline=await activeBaseline(surveyId),version=baseline?.version??'none';const[rows]=await db.query<any[]>(`SELECT qr.session_id sessionId,qr.result FROM quality_results qr JOIN quality_result_heads h ON h.session_id=qr.session_id AND h.algorithm_version=qr.algorithm_version AND h.baseline_version=qr.baseline_version AND h.input_hash=qr.input_hash JOIN response_sessions rs ON rs.id=qr.session_id WHERE rs.survey_id=? AND qr.algorithm_version=? AND qr.baseline_version=?`,[surveyId,QUALITY_V2_CONFIG.version,version]);return Object.fromEntries(rows.map(row=>[row.sessionId,json<QualityV2>(row.result)]));}
async function workerTask(task:string,surveyId:string,items:Item[],people:Participant[],baseline:Baseline|null,progress?:(done:number,total:number)=>void,highQualityIds?:string[]){
  return new Promise<any>((resolve,reject)=>{const worker=createQualityWorker();let settled=false;const finish=(error?:Error,value?:unknown)=>{if(settled)return;settled=true;void worker.terminate();error?reject(error):resolve(value)};worker.on('message',m=>{if(m.type==='progress')progress?.(m.done,m.total);else if(m.type==='error')finish(new Error(m.message));else if(m.type==='result')finish(undefined,m.value)});worker.on('error',e=>finish(e));worker.on('exit',code=>{if(!settled)finish(new Error(`Quality worker exited ${code}`))});worker.postMessage({task,surveyId,items,people,baseline,highQualityIds});});
}
export async function freezeBaseline(surveyId:string,cohort?:string){const{items,people}=await loadQualityInputs(surveyId),qualities=await storedQualities(surveyId),high=people.filter(p=>(qualities[p.id]?.overall.score??0)>=QUALITY_V2_CONFIG.reference.highQualityScore&&qualities[p.id].overall.confidence>=QUALITY_V2_CONFIG.reference.highQualityConfidence).map(p=>p.id),selected=cohort?people.filter(p=>cohort==='trusted'?p.trusted:p.cohort===cohort):people;
  if(!selected.some(p=>p.status==='completed'))throw new Error('Нет завершённых прохождений в выбранной reference группе');
  const baseline:Baseline=await workerTask('baseline',surveyId,items,selected,null,undefined,high);
  await db.execute(`INSERT IGNORE INTO quality_baselines(id,survey_id,algorithm_version,config_hash,snapshot) VALUES (?,?,?,?,?)`,[baseline.id,surveyId,baseline.config.version,baseline.configHash,JSON.stringify(baseline)]);await db.execute(`INSERT INTO quality_settings(survey_id,active_baseline) VALUES (?,?) ON DUPLICATE KEY UPDATE active_baseline=VALUES(active_baseline)`,[surveyId,baseline.id]);return baseline;
}
export async function recompute(surveyId:string,options:{sessionId?:string;cohort?:string;baselineVersion?:string}={},progress?:(done:number,total:number)=>void){const{items,people}=await loadQualityInputs(surveyId);let baseline=await activeBaseline(surveyId);if(options.baselineVersion){const[rows]=await db.query<any[]>('SELECT snapshot FROM quality_baselines WHERE id=? AND survey_id=?',[options.baselineVersion,surveyId]);if(!rows.length)throw new Error('Baseline не найден');baseline=json<Baseline>(rows[0].snapshot);}if(!baseline&&people.some(p=>p.status==='completed'))baseline=await freezeBaseline(surveyId);
  if(baseline&&baseline.config.version!==QUALITY_V2_CONFIG.version&&!options.baselineVersion)throw new Error('Algorithm version changed; create a new baseline');
  if(baseline&&baseline.itemHash!==hash(items))throw new Error('Структура вопросов изменилась; создайте новую версию baseline');
  const selected=people.filter(p=>(!options.sessionId||p.id===options.sessionId)&&(!options.cohort||(options.cohort==='trusted'?p.trusted:p.cohort===options.cohort)));
  const data=await workerTask(options.sessionId||options.cohort?'calculate_subset':'calculate',surveyId,items,selected,baseline,progress);for(const p of selected){const result:QualityV2|undefined=data.results[p.id];if(!result)continue;await db.execute(`INSERT IGNORE INTO quality_results(session_id,algorithm_version,baseline_version,input_hash,result,input_snapshot) VALUES (?,?,?,?,?,?)`,[p.id,result.algorithm_version,result.baseline_version??'none',result.input_hash,JSON.stringify(result),JSON.stringify({items,participant:p})]);await db.execute('INSERT INTO quality_result_heads(session_id,algorithm_version,baseline_version,input_hash) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE input_hash=VALUES(input_hash)',[p.id,result.algorithm_version,result.baseline_version??'none',result.input_hash]);}return{count:Object.keys(data.results).length,baseline_version:baseline?.version??null,diagnostics:data.diagnostics};
}
let running=false;
export async function enqueueQuality(surveyId:string,kind='recompute',options:Record<string,unknown>={}){if(!qualityEnabled())return null;const id=randomUUID();await db.execute('INSERT INTO quality_jobs(id,survey_id,kind,options) VALUES (?,?,?,?)',[id,surveyId,kind,JSON.stringify(options)]);void runJobs();return id;}
export async function runJobs() {
  if (running || !qualityEnabled()) return;
  running = true;
  try {
    while (true) {
      const connection = await db.getConnection();
      let job: any;
      try {
        await connection.beginTransaction();
        const [rows] = await connection.query<any[]>("SELECT * FROM quality_jobs WHERE status='queued' ORDER BY created_at LIMIT 1 FOR UPDATE SKIP LOCKED");
        if (!rows.length) { await connection.commit(); break; }
        job = rows[0];
        await connection.execute("UPDATE quality_jobs SET status='running',error=NULL WHERE id=?", [job.id]);
        await connection.commit();
      } catch (error) { await connection.rollback(); throw error; }
      finally { connection.release(); }
      let updates = Promise.resolve();
      try {
        const options = json(job.options);
        let output: any;
        if (job.kind === 'baseline') {
          const baseline = await freezeBaseline(job.survey_id, options.cohort);
          output = { baseline_version: baseline.version, source: baseline.source, count: baseline.memberIds.length };
          output.recompute_job = await enqueueQuality(job.survey_id, 'recompute', {});
        } else {
          output = await recompute(job.survey_id, options, (done, total) => {
            updates = updates.then(async () => { await db.execute('UPDATE quality_jobs SET progress=?,total=? WHERE id=?', [done,total,job.id]); });
          });
        }
        await updates;
        await db.execute("UPDATE quality_jobs SET status='completed',progress=?,total=?,output=? WHERE id=?", [output.count,output.count,JSON.stringify(output),job.id]);
      } catch (error) {
        await updates.catch(() => {});
        await db.execute("UPDATE quality_jobs SET status='failed',error=? WHERE id=?", [error instanceof Error ? error.message : String(error),job.id]);
      }
    }
  } catch (error) { console.error('Quality V2 job runner error', error instanceof Error ? error.message : error); }
  finally { running = false; }
}
export async function resumeQualityJobs(){await db.execute("UPDATE quality_jobs SET status='queued',error='Resumed after server restart' WHERE status='running'");void runJobs();const interval=setInterval(()=>{void runJobs()},30000);interval.unref();}
