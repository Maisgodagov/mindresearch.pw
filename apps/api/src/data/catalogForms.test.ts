import {describe,it,expect} from 'vitest';
import {loadMethodologyRegistry} from './methodologyRegistry.js';
import survey from './survey.json' with {type:'json'};
import {applyInstrumentForm,resolveInstrumentForm,supportsFormGender} from './instrumentForms.js';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import catalogCodes from './catalogFormCodes.json' with {type:'json'};
import pairs from './catalogFormTexts.json' with {type:'json'};
import type {SeedSection} from '../types.js';

describe('catalogue form snapshots',()=>{
 it('stores complete pairs of nonempty strings in the offline catalogue',()=>{
  for(const group of [pairs.questions,pairs.options])for(const value of Object.values(group)){
   expect(value).toHaveLength(2);expect(value.every(text=>typeof text==='string'&&text.trim().length>0)).toBe(true);
  }
 });
 it('changes respondent grammar while preserving nouns, other people and neutral answer labels',()=>{
  const text=(source:string,gender:'male'|'female')=>applyInstrumentForm('test_17',[{text:source}],gender)[0].text;
  expect(text('Я уверен в себе.','female')).toBe('Я уверена в себе.');
  expect(text('Я чувствую себя счастливым(-ой).','female')).toBe('Я чувствую себя счастливой.');
  expect(text('Мой отец был для меня примером, когда я был маленьким.','female')).toBe('Мой отец был для меня примером, когда я была маленькой.');
  expect(text('Я целеустремлённый участник соревнований.','female')).toBe('Я целеустремлённая участница соревнований.');
  for(const source of ['Я уравновешенный человек.','Я трудолюбивый, старательный человек.','Я стараюсь помочь, если кто-то расстроен, обижен или болен.','Я считаю неприличным стучать по столу, даже если человек очень сердит.']){
   expect(text(source,'female')).toBe(source);expect(text(source,'male')).toBe(source);
  }
  const options=[{value:'1',label:'Высокий'},{value:'2',label:'В большей степени не согласен, чем согласен'},{value:'3',label:'Мало похож на меня'}];
  const result=applyInstrumentForm('test_17',[{text:'Neutral',options}], 'female')[0].options;
  expect(result).toEqual([{value:'1',label:'Высокий'},{value:'2',label:'В большей степени не согласна, чем согласна'},{value:'3',label:'Мало похож на меня'}]);
  expect(applyInstrumentForm('test_2279',[{text:'Умный(ая)'}],'female')[0].text).toBe('Умный(ая)');
 });

 it('covers every registered methodology and preserves question and scoring identity in both forms',async()=>{
  const registry=await loadMethodologyRegistry();
  const all=new Map<string,SeedSection>();
  for(const s of survey as SeedSection[])if(s.code!=='respondent')all.set(s.code,s);
  const source=await readFile(new URL('../seed.ts',import.meta.url),'utf8');
  for(const [,module]of source.matchAll(/from '(\.\/data\/[^']+)\.js'/g)){
   const loaded=await import(fileURLToPath(new URL(module.replace('./data/','./')+'.ts',import.meta.url)));
   for(const value of Object.values(loaded)){
    const section=value as SeedSection;
    if(section?.code&&Array.isArray(section.questions))all.set(section.code,section);
   }
  }
  for(const r of registry)all.set(r.instrument.code,r.instrument);
  const instruments=[...all.values()];
  expect([...all.keys()].sort()).toEqual([...catalogCodes].sort());
  expect(instruments.length).toBeGreaterThan(1000);
  for(const instrument of instruments){
   expect(supportsFormGender(instrument.code),instrument.code).toBe(true);
   const original=JSON.stringify(instrument.questions);
   const male=applyInstrumentForm(instrument.code,instrument.questions,'male');
   const female=applyInstrumentForm(instrument.code,instrument.questions,'female');
   const auto=applyInstrumentForm(instrument.code,instrument.questions,'auto','female');
   for(let i=0;i<instrument.questions.length;i++){
    const q=instrument.questions[i];
    for(const form of [male[i],female[i]]){
     expect({...form,text:q.text,options:q.options,validation:q.validation}).toEqual(q);
     expect(form.options?.map(o=>o.value)).toEqual(q.options?.map(o=>o.value));
     expect(form.text.trim().length).toBeGreaterThan(0);
    }
    expect(resolveInstrumentForm(auto[i],'male').text).toBe(male[i].text);
    expect(resolveInstrumentForm(auto[i],'female').text).toBe(female[i].text);
    expect(resolveInstrumentForm(auto[i],'not_specified').text).toBe(female[i].text);
   }
   expect(JSON.stringify(instrument.questions)).toBe(original);
  }
 },120000);
});
