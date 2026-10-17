import { describe, it, expect } from 'vitest';
import { distributionOptions, numericRangeLabels, methodSortOptions } from './selection';
import { applyQualityView, DEFAULT_QUALITY_VIEW, type Quality } from './quality';
import type { Respondent, Result } from './types';

const person = (id:string, age:number|null, score?:number):Respondent => ({id,age,alias:id,status:'completed',startedAt:'2026-01-01',lastActivityAt:'2026-01-01',completedAt:null,answered:1,groups:score===undefined?[]:[{id:'g',code:'method',title:'Методика',position:1,answers:[],result:{formulaVersion:'1',interpretation:null,values:{overall:{score},scales:{a:{label:'Шкала А',score:score*2}}}}}]});
const rows:Result['distribution'] = [
  {questionId:'age',code:'q1',text:'Ваш возраст',value:37,label:'37',count:2,sessionIds:['a','b'],sectionPosition:1,questionPosition:0},
  {questionId:'age',code:'q1',text:'Ваш возраст',value:20,label:'20',count:1,sessionIds:['c'],sectionPosition:1,questionPosition:0},
  {questionId:'first',code:'q2',text:'Первый блок',value:1,count:1,sessionIds:['a'],sectionPosition:0,questionPosition:5},
];
describe('Results cohort selection and ordering',()=>{
  it('orders by block then question and keeps distinct IDs for repeated text',()=>{
    expect(distributionOptions([...rows,{...rows[0],questionId:'other',sectionPosition:2}]).map(o=>o.value)).toEqual(['first','age','other']);
  });
  it('includes numeric endpoints and never coerces empty/non-numeric answers to zero',()=>{
    const data=['','abc','19','20','37','40','41'].map(answer=>({answer}));
    expect(numericRangeLabels(data,'20','40')).toEqual(['20','37','40']);
    expect(numericRangeLabels(data,'40','20')).toEqual([]);
    expect(numericRangeLabels(data,'','40')).toEqual([]);
  });
  it('sorts ages numerically across the whole sample with missing ages last in both directions',()=>{
    const people=[person('a',37),person('b',null),person('c',20)];
    for(const direction of ['asc','desc'] as const) expect(applyQualityView(people,{}, {...DEFAULT_QUALITY_VIEW,sort:'age',direction}).map(p=>p.id)).toEqual(direction==='asc'?['c','a','b']:['a','c','b']);
    expect(people.map(p=>p.id)).toEqual(['a','b','c']);
  });
  it('exposes and sorts individual method scores and scales, preserving missing values',()=>{
    const people=[person('a',37,10),person('b',20),person('c',25,3)];
    const options=methodSortOptions(people,[{code:'method',title:'Методика',sectionKind:'verified'}]);
    expect(options.map(o=>o.value)).toEqual(['method:method:overall.score','method:method:scales.a.score']);
    expect(applyQualityView(people,{}, {...DEFAULT_QUALITY_VIEW,sort:'method:method:scales.a.score',direction:'asc'}).map(p=>p.id)).toEqual(['c','a','b']);
  });
  it('quality selections use OR and combine with other filters using AND',()=>{
    const people=[person('a',37),person('b',20),person('c',25)];
    people[1].status='in_progress';
    const qualities=Object.fromEntries(['a','b'].map((id,i)=>[id,{overall:{status:i?'review':'high'}}])) as Record<string,Quality>;
    expect(applyQualityView(people,qualities,{...DEFAULT_QUALITY_VIEW,qualityStatus:['high','review']}).map(p=>p.id)).toEqual(['a','b']);
    expect(applyQualityView(people,qualities,{...DEFAULT_QUALITY_VIEW,qualityStatus:['high','review'],status:'completed'}).map(p=>p.id)).toEqual(['a']);
    expect(applyQualityView(people,qualities,{...DEFAULT_QUALITY_VIEW,qualityStatus:[]}).length).toBe(3);
    expect(applyQualityView(people,qualities,{...DEFAULT_QUALITY_VIEW,qualityStatus:['insufficient_data']}).map(p=>p.id)).toEqual(['c']);
  });
});
