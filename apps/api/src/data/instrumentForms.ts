import texts from './priorityFormTexts.json' with { type: 'json' };
import catalogTexts from './catalogFormTexts.json' with { type: 'json' };
import catalogCodes from './catalogFormCodes.json' with { type: 'json' };
import type { SeedQuestion } from '../types.js';
export type FormGender = 'male' | 'female' | 'auto';
export const formGenders: FormGender[] = ['auto', 'male', 'female'];
const supportedCodes = new Set<string>(catalogCodes);
export function supportsFormGender(code: string): boolean { return supportedCodes.has(code) || Object.hasOwn(texts, code); }
type TextPairs = Record<string, string[]>;
const textPairs = catalogTexts as {questions: TextPairs; options: TextPairs; preserveQuestionCodes: string[]};
// These questions describe a child, partner, group or situation, rather than the respondent.
const preserveQuestionCodes = new Set(textPairs.preserveQuestionCodes);
const formText = (text: string, gender: 'male' | 'female', kind: 'questions' | 'options') =>
  Object.hasOwn(textPairs[kind], text) ? textPairs[kind][text][gender === 'female' ? 1 : 0] : text;
export function applyInstrumentForm<T extends {text:string; options?: {value:string;label:string}[]; validation?: Record<string,unknown>|null}>(code:string, questions:T[], gender:FormGender, fallback: 'male' | 'female' = 'male'):T[] {
  if (!supportsFormGender(code)) {
    if (gender !== 'male') throw Object.assign(new Error('Для этой методики выбор бланка недоступен'), {status:400});
    return questions;
  }
  if(gender==='auto'){
    const male=applyInstrumentForm(code,questions,'male'),female=applyInstrumentForm(code,questions,'female');
    const base=fallback==='female'?female:male;
    return base.map((q,index)=>({...q,validation:{...q.validation,formGender:'auto',formFallback:fallback,
      formVariants:{male:{text:male[index].text,options:male[index].options},female:{text:female[index].text,options:female[index].options}},
    }}));
  }
  if (!Object.hasOwn(texts, code)) {
    return questions.map(question => ({...question,
      text: preserveQuestionCodes.has(code) ? question.text : formText(question.text, gender, 'questions'),
      options: question.options?.map(option => ({...option, label: formText(option.label, gender, 'options')})),
      validation: {...question.validation, formGender: gender},
    }));
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

export function resolveInstrumentForm<T extends {text:string;options?:unknown;validation?:unknown}>(question:T,gender:unknown):T {
 const validation=question.validation as {formGender?:string;formFallback?:string;formVariants?:Record<string,{text:string;options?:unknown}>}|undefined;
 if(validation?.formGender!=='auto')return question;
 const selected=gender==='male'||gender==='female'?gender:validation.formFallback??'male';
 const form=validation.formVariants?.[selected];
 return form?{...question,text:form.text,options:form.options??question.options}:question;
}
