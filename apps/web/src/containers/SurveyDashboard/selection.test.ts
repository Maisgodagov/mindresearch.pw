import { describe, it, expect } from 'vitest';
import { atomicDistribution, membershipLabels, distributionOptions, numericRangeLabels, methodSortOptions, applySampleConditions, upsertSampleCondition, type SampleCondition } from './selection';
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

describe('Cumulative sample conditions',()=>{
  const people=[person('a',20),person('b',30),person('c',40),person('d',50)];
  const age:SampleCondition={question:'age',title:'Возраст',labels:[],range:{min:'20',max:'40'},sessionIds:['a','b','c']};
  const job:SampleCondition={question:'job',title:'Занятость',labels:['Работаю','Учусь'],sessionIds:['b','c','d']};
  const answer:SampleCondition={question:'answer',title:'Ответ',labels:['Да'],sessionIds:['c','d']};
  it('intersects age and multiple question memberships before sorting/pagination',()=>{
    expect(applySampleConditions(people,[age,job,answer]).map(p=>p.id)).toEqual(['c']);
  });
  it('restores excluded members when an earlier condition is removed',()=>{
    expect(applySampleConditions(people,[job,answer]).map(p=>p.id)).toEqual(['c','d']);
    expect(applySampleConditions(people,[])).toEqual(people);
  });
  it('updates the same question without discarding conditions for other questions',()=>{
    const next=upsertSampleCondition([age,job],{...job,labels:['Учусь'],sessionIds:['b']});
    expect(next).toHaveLength(2);expect(next).toContain(age);
    expect(applySampleConditions(people,next).map(p=>p.id)).toEqual(['b']);
  });
  it('keeps an empty matching range as a zero-person sample',()=>{
    expect(applySampleConditions(people,[{...age,sessionIds:[]}])).toEqual([]);
  });
});

describe('Legacy API answer combinations',()=>{
  const question={questionId:'support',code:'q',options:[{value:'1',label:'К родителям'},{value:'2',label:'К другим родственникам'},{value:'3',label:'К друзьям, коллегам'}]};
  const rows:Result['distribution']=[
    {questionId:'support',code:'q',text:'Support',value:['1','3'] as any,label:'К родителям, К друзьям, коллегам',count:2},
    {questionId:'support',code:'q',text:'Support',value:['3','1'] as any,label:'К друзьям, коллегам, К родителям',count:1},
    {questionId:'support',code:'q',text:'Support',value:['2'] as any,label:'К другим родственникам',count:1},
  ];
  it('shows atomic option labels from legacy arrays, including labels with commas',()=>{
    expect(atomicDistribution(rows,[question]).map(row=>[row.label,row.count])).toEqual([['К родителям',3],['К друзьям, коллегам',3],['К другим родственникам',1]]);
  });
  it('translates chosen options into all matching legacy combinations only for the membership request',()=>{
    expect(membershipLabels(rows,question,['К родителям','К другим родственникам'])).toEqual(rows.map(row=>row.label));
    expect(membershipLabels(rows,question,['К другим родственникам'])).toEqual(['К другим родственникам']);
  });
});
