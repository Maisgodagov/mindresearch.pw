import {describe,it,expect} from 'vitest';
import {applyQualityView,DEFAULT_QUALITY_VIEW,metricValue,type Quality,type QualityView} from './quality';
import {qualityExportRow,QUALITY_FIELDS} from '../../admin/exportResults';
import type {Respondent} from './types';
const index=(score:number|null)=>({score,confidence:score==null?0:.8,status:score==null?'insufficient_data':'acceptable',partial:false,flags:[],components:{},metrics:{},version:'2.0.0',calculated_at:'2026-01-01',baseline_version:'frozen'}) as Quality['overall'];
function q(score:number|null,coverage=1):Quality{return{version:2,algorithm_version:'2.0.0',config_hash:'hash',baseline_version:'frozen',calculated_at:'2026-01-01',overall:index(score),behavioral:{...index(score),metrics:{telemetry_coverage:coverage,fast_fraction:.1,median_ratio:.8}},response:{...index(score),components:{rpr:{score:80,confidence:.8,metrics:{rpr:.75,reference_percentile:.15},flags:[]}}},strong_flag_count:0,warning_flag_count:1,independent_concerning_domains:0,hard_checks:{eligibility:'unknown',eligibility_reason:null,duplicate:false,completeness:{required:1,answered:1,complete:true}},cohort:'public',telemetry_version:null,input_hash:'input'};}
const people:Respondent[]=['fresh','mid','old','missing'].map((id,i)=>({id,alias:id,status:'completed',startedAt:'2026-01-0'+(4-i),completedAt:'2026-01-05',lastActivityAt:'2026-01-05',answered:1,groups:[],cohort:i%2?'trusted':'public',eligibility:i===2?'fail':'unknown'}));
const qualities={fresh:q(90),mid:q(45),old:q(75,0)};
const view=(v:Partial<QualityView>={}):QualityView=>({...DEFAULT_QUALITY_VIEW,filters:[],...v});
const ids=(v:QualityView)=>applyQualityView(people,qualities,v).map(p=>p.id);
describe('V2 list preserves chronological order and missing values',()=>{
 it('default exactly preserves API order',()=>expect(ids(view())).toEqual(people.map(p=>p.id)));
 it('reset restores all original rows and order',()=>{ids(view({sort:'overall',direction:'asc',cohort:'public'}));expect(ids(view())).toEqual(['fresh','mid','old','missing']);});
 it('oldest reverses without mutating source',()=>{expect(ids(view({sort:'oldest'}))).toEqual(['missing','old','mid','fresh']);expect(people[0].id).toBe('fresh');});
 it('lowest overall first, missing last',()=>expect(ids(view({sort:'overall',direction:'asc'}))).toEqual(['mid','old','fresh','missing']));
 it('descending keeps missing last too',()=>expect(ids(view({sort:'overall',direction:'desc'}))).toEqual(['fresh','old','mid','missing']));
 it('insufficient rows can be sorted first',()=>expect(ids(view({sort:'insufficient'}))).toEqual(['missing','fresh','mid','old']));
 it('numeric score filter',()=>expect(ids(view({filters:[{metric:'overall',operator:'lte',value:'55'}]}))).toEqual(['mid']));
 it('missing is not zero',()=>expect(ids(view({filters:[{metric:'overall',operator:'missing',value:''}]}))).toEqual(['missing']));
 it('confidence is a percentage in UI filters',()=>expect(metricValue(qualities.fresh,'confidence')).toBe(80));
 it('cohort selection',()=>expect(ids(view({cohort:'trusted'}))).toEqual(['mid','missing']));
 it('eligibility remains outside quality',()=>expect(ids(view({eligibility:'fail'}))).toEqual(['old']));
 it('telemetry and V2 availability are separate',()=>{expect(ids(view({telemetry:'missing',available:'present'}))).toEqual(['old']);});
 it('filters cannot modify frozen scores',()=>{const before=JSON.stringify(qualities);ids(view({cohort:'public',sort:'response'}));expect(JSON.stringify(qualities)).toBe(before);});
 it('unavailable V2 rows can be selected',()=>expect(ids(view({available:'missing'}))).toEqual(['missing']));
 it('status filter includes not-yet-computed rows',()=>expect(ids(view({qualityStatus:'insufficient_data'}))).toEqual(['missing']));
});
describe('V2 export contract',()=>{
 it('contains three indices and raw metrics without V1',()=>{const row=qualityExportRow({...people[0],qualityMetrics:qualities.fresh});expect(row.overall_quality_score).toBe(90);expect(row.behavior_fast_fraction).toBe(.1);expect(row.response_rpr).toBe(.75);expect(QUALITY_FIELDS).not.toContain('legacy_quality_v1');});
 it('null data exports null/blank, never a fabricated zero',()=>{const row=qualityExportRow(people[3]);expect(row.overall_quality_score).toBeUndefined();expect(row.overall_quality_status).toBe('insufficient_data');});
});
