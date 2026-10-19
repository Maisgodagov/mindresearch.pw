type Question={text:string;options?:unknown;validation?:unknown};
/** Resolve the saved form snapshot, without changing answer values or question identifiers. */
export function respondentForm<T extends Question>(question:T,gender:unknown):T {
 const validation=question.validation as {formGender?:string;formFallback?:string;formVariants?:Record<string,{text:string;options?:unknown}>}|null|undefined;
 if(validation?.formGender!=='auto')return question;
 const selected=gender==='male'||gender==='female'?gender:validation.formFallback??'male';
 const form=validation.formVariants?.[selected];
 return form?{...question,text:form.text,options:form.options??question.options}:question;
}
