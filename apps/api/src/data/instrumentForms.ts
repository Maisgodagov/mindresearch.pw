import texts from './priorityFormTexts.json' with { type: 'json' };
import type { SeedQuestion } from '../types.js';
export type FormGender = 'male' | 'female';
export const formGenders: FormGender[] = ['male', 'female'];
export function supportsFormGender(code: string): boolean { return Object.hasOwn(texts, code); }
export function applyInstrumentForm<T extends {text:string; options?: {value:string;label:string}[]; validation?: Record<string,unknown>|null}>(code:string, questions:T[], gender:FormGender):T[] {
  if (!supportsFormGender(code)) {
    if (gender === 'female') throw Object.assign(new Error('Для этой методики выбор бланка недоступен'), {status:400});
    return questions;
  }
  const form = texts[code as keyof typeof texts][gender];
  if (form.items.length !== questions.length) throw new Error(`Question count does not match form: ${code}`);
  return questions.map((question,index)=>({...question,
    text: gender === 'female' && form.items[index] !== texts[code as keyof typeof texts].male.items[index] ? form.items[index] : question.text,
    options: question.options?.map((option,oi)=>({...option,label:form.labels[oi] ?? option.label})),
    validation:{...question.validation,formGender:gender},
  }));
}
export function priorityQuestions(code:keyof typeof texts):SeedQuestion[] {
  const form=texts[code].male;
  return form.items.map((text,index)=>({code:`${code}_${index+1}`,text,type:'single',required:true,
    options:form.labels.map((label,i)=>({value:code==='test_3002' ? String(1-i) : String(i+1),label})),
  }));
}
