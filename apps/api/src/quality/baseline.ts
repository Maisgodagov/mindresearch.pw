import { hash, shuffled, stats } from './math.js';
import { referenceModel, rpr, pairConsistency } from './psychometrics.js';
import { QUALITY_V2_CONFIG, type QualityConfig } from './config.js';
import type { Baseline, Item, Participant } from './types.js';
export function createBaseline(surveyId:string,items:Item[],people:Participant[],config:QualityConfig=QUALITY_V2_CONFIG,highQualityIds:string[]=[]):Baseline{
  config=structuredClone(config);
  const completed=people.filter(p=>p.status==='completed'&&!p.duplicate&&p.eligibility!=='fail'&&p.cohort!=='admin_test').sort((a,b)=>a.id.localeCompare(b.id)).map(p=>({...p,legacy_quality_v1:undefined})),trusted=completed.filter(p=>p.trusted),highQuality=completed.filter(p=>highQualityIds.includes(p.id));
  const source=trusted.length>=config.reference.minCalibrationN?'trusted':highQuality.length>=config.reference.minCalibrationN?'high_quality_v2':'completed';
  const members=(source==='trusted'?trusted:source==='high_quality_v2'?highQuality:completed).sort((a,b)=>a.id.localeCompare(b.id));
  const configHash=hash(config),itemHash=hash(items),trainingSnapshotHash=hash({members,timing:completed}),version=`v2-${hash({surveyId,configHash,itemHash,trainingSnapshotHash,source}).slice(0,20)}`;
  const randomized=shuffled(completed,`${config.seed}:${version}:folds`),memberFold:Baseline['memberFold']={};randomized.forEach((p,index)=>memberFold[p.id]=index%config.reference.folds);
  const seed=`${config.seed}:${config.version}:${version}`;
  const withTimeFallback=(reference:ReturnType<typeof referenceModel>,timing:Participant[])=>{const fallback=referenceModel(items,timing,config,seed,false);for(const field of ['time','blockTime','typeTime'] as const){for(const[key,stats]of Object.entries(reference[field]))stats.source=source;for(const[key,stats]of Object.entries(fallback[field]))if((reference[field][key]?.n??0)<config.reference.minQuestionN&&stats.n>=config.reference.minQuestionN)reference[field][key]={...stats,source:'completed_time_fallback'};}return reference;};
  const folds=Array.from({length:config.reference.folds},(_,fold)=>withTimeFallback(referenceModel(items,members.filter(p=>memberFold[p.id]!==fold),config,seed),completed.filter(p=>memberFold[p.id]!==fold)));
  const full=withTimeFallback(referenceModel(items,members,config,seed),completed),calibrationObservations:Baseline['calibrationObservations']={};
  for(const person of members){const model=folds[memberFold[person.id]];calibrationObservations[person.id]={rpr:rpr(person,items,model.splits,config).value,pairs:pairConsistency(person,items,model.pairs,config).value};}
  return{id:version,surveyId,version,createdAt:new Date().toISOString(),config,configHash,itemHash,items,source,memberIds:members.map(p=>p.id),memberFold,full,folds,calibrationObservations,
    calibration:{rpr:stats(Object.values(calibrationObservations).flatMap(v=>v.rpr===null?[]:[v.rpr])),pairs:stats(Object.values(calibrationObservations).flatMap(v=>v.pairs===null?[]:[v.pairs]))},trainingSnapshotHash,frozen:true};
}
