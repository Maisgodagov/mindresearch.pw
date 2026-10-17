import type { Respondent, Result } from './types';
import { distributionQuestionKey } from './components/AnswerDistribution/questionKey';

export function distributionOptions(rows: {questionId?:string;code:string;text:string;sectionPosition?:number;questionPosition?:number}[]) {
  const ordered = [...rows].sort((a,b) => (a.sectionPosition ?? 0)-(b.sectionPosition ?? 0) || (a.questionPosition ?? 0)-(b.questionPosition ?? 0));
  return [...new Map(ordered.map(row => [distributionQuestionKey(row), row.text])).entries()].map(([value,label])=>({value,label}));
}

export function numericRangeLabels(data: {answer:string}[], min: string, max: string) {
  if (!min.trim() || !max.trim() || !Number.isFinite(Number(min)) || !Number.isFinite(Number(max)) || Number(min)>Number(max)) return [];
  return data.filter(row=>row.answer.trim()!=='' && Number.isFinite(Number(row.answer)) && Number(row.answer)>=Number(min) && Number(row.answer)<=Number(max)).map(row=>row.answer);
}

export function methodSortOptions(people: Respondent[], sections: Result['sections']) {
  return sections.flatMap(section => {
    const options = new Map<string,string>();
    const add = (path: string, label: string, value: unknown) => { if(typeof value === 'number' && Number.isFinite(value)) options.set(`method:${encodeURIComponent(section.code)}:${path}`,`${section.title} · ${label}`); };
    for(const person of people) {
      const values = person.groups.find(g=>g.code===section.code)?.result?.values as Record<string,any> | undefined;
      if(!values) continue;
      for(const key of ['score','average','sum','overall']) {
        const v=values[key];
        if(typeof v==='number') add(key, {score:'Балл',average:'Средний балл',sum:'Сумма',overall:'Общий балл'}[key]!,v);
        else if(v && typeof v==='object') for(const field of ['score','average','sum']) add(`${key}.${field}`,v.label || 'Общий балл',v[field]);
      }
      for(const [key,scale] of Object.entries(values.scales ?? {}) as [string,any][]) {
        if(typeof scale==='number') add(`scales.${key}`,key,scale);
        else if(scale) for(const field of ['score','average','sum']) add(`scales.${key}.${field}`,scale.label || key,scale[field]);
      }
    }
    return [...options].map(([value,label])=>({value,label}));
  });
}

export function methodSortValue(person: Respondent, sort: string): number | null {
  const [,code,path]=sort.split(':');
  let value: any = person.groups.find(g=>g.code===decodeURIComponent(code))?.result?.values;
  for(const part of path.split('.')) value=value?.[part];
  return typeof value==='number' && Number.isFinite(value) ? value : null;
}

export type SampleCondition = {
  question: string;
  title: string;
  labels: string[];
  sessionIds: string[];
  range?: {min: string; max: string};
};

// Each condition stores its full membership, not the previous intersection:
// removing an earlier condition must correctly widen the sample again.
export function applySampleConditions(people: Respondent[], conditions: SampleCondition[]) {
  const memberships = conditions.map(condition=>new Set(condition.sessionIds));
  return people.filter(person=>memberships.every(ids=>ids.has(person.id)));
}

export function upsertSampleCondition(conditions: SampleCondition[], next: SampleCondition) {
  return [...conditions.filter(condition=>condition.question!==next.question),next];
}

type QuestionChoices = {questionId?:string;code:string;text?:string;options?:{value:string|number;label:string}[]};
export function atomicDistribution(rows:Result['distribution'],questions:QuestionChoices[]) {
  const buckets=new Map<string,Result['distribution'][number]>();
  for(const row of rows){
    const choices=questions.find(q=>distributionQuestionKey({...q,text:q.text??''})===distributionQuestionKey(row))?.options??[];
    const raw:unknown=row.value;
    const values=Array.isArray(raw)?[...new Set(raw)]:[raw];
    for(const value of values){
      const label=choices.find(option=>String(option.value)===String(value))?.label??(Array.isArray(raw)?String(value):(row.label??String(value)));
      const key=JSON.stringify([distributionQuestionKey(row),label]);
      const existing=buckets.get(key);
      if(existing)existing.count+=row.count;
      else buckets.set(key,{...row,value:value as string|number,label});
    }
  }
  return [...buckets.values()];
}

// Older APIs match complete display labels. Translate individual selected choices
// back into the stored combinations for that request only, never for the UI.
export function membershipLabels(rows:Result['distribution'],question:QuestionChoices,selected:string[]) {
  const matching=rows.filter(row=>distributionQuestionKey(row)===distributionQuestionKey({...question,text:question.text??''}));
  if(!matching.some(row=>Array.isArray(row.value)))return selected;
  const choices=question.options??[];
  return [...new Set(matching.filter(row=>{
    const raw:unknown=row.value;
    return (Array.isArray(raw)?raw:[raw]).some(value=>selected.includes(choices.find(option=>String(option.value)===String(value))?.label??String(value)));
  }).map(row=>row.label??String(row.value)))];
}
