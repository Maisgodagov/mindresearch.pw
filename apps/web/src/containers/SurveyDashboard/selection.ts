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
