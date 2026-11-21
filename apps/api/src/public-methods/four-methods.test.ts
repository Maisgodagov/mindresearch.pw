import { describe, it, expect } from "vitest";
import { calculate, definition, initialCatalog, validateAnswers } from "./model.js";
import { withdrawnMethodologyCodes } from "../data/withdrawnMethodologies.js";
import { publicDocument } from "./render.js";
import { discoverMethods } from "./discovery.js";

const codes=["test_21","test_22","test_265","test_2205"];
const result=(code:string,values:number|number[])=>{
 const method=initialCatalog.find(m=>m.code===code)!;const def=definition(method);
 return calculate(def,Object.fromEntries(def.questions.map((q,i)=>[q.code,typeof values==="number"?values:values[i]])));
};
const scores=(code:string,values:number|number[])=>result(code,values).scales.map(s=>s.value);
describe("four public methods, November 12",()=>{
 it("registers exact active versions with sources, rights and bootstrapped articles",()=>{
  for(const code of codes){
   expect(withdrawnMethodologyCodes).not.toContain(code);
   const method=initialCatalog.find(m=>m.code===code)!;const def=definition(method);
   expect(method.sources.some(s=>s.url==='https://creativecommons.org/licenses/by/4.0/')).toBe(true);
   expect(method.sections.some(s=>s.title==='Авторы и используемая версия')).toBe(true);
   expect(method.seoTitle).toBeTruthy();expect(method.seoDescription).toBeTruthy();
   expect(publicDocument(initialCatalog,method).head).toContain('id="public-methods-data"');
   expect(()=>validateAnswers(def,{},true)).toThrow();
   expect(()=>validateAnswers(def,{[def.questions[0].code]:99})).toThrow();
   expect(()=>definition({...method,version:'other'})).toThrow();
  }
 });
 it("PAQ-S is one six-item sum, with no invented subscales",()=>{
  expect(scores('test_22',1)).toEqual([6]);expect(scores('test_22',7)).toEqual([42]);
  expect(scores('test_22',[1,2,3,4,5,6])).toEqual([21]);
  expect(result('test_22',4).scales).toHaveLength(1);
 });
 it("MUN counts both directions of the published yes/no key and handles zero",()=>{
  const yes=[1,2,3,6,8,10,11,12,14,16,18,19,20];
  const high=Array.from({length:20},(_,i)=>yes.includes(i+1)?1:0);
  expect(scores('test_21',1)).toEqual([13]);expect(scores('test_21',0)).toEqual([7]);
  expect(scores('test_21',high)).toEqual([20]);expect(scores('test_21',high.map(v=>1-v))).toEqual([0]);
  expect(result('test_21',high.map(v=>1-v)).explanation).toContain('категория не задана');
  for(const target of [1,7,8,9,10,11,12,13,14,20]){
   const answers=high.map((v,i)=>i<target?v:1-v);const r=result('test_21',answers);
   expect(r.scales[0].value).toBe(target);
   expect(r.explanation).toContain(target<=7?'боязни неудачи':target<=13?'ярко не выражен':'на успех');
  }
 });
 it("self-development keeps overall first and the three unequal sums",()=>{
  expect(scores('test_265',1)).toEqual([14,4,4,6]);
  expect(scores('test_265',6)).toEqual([84,24,24,36]);
  expect(scores('test_265',[1,2,3,4,5,6,1,2,3,4,5,6,1,2])).toEqual([45,10,14,21]);
  expect(result('test_265',3).presentation).toBe('scales');
 });
 it("metacognition reverses the seven negative items and has no total",()=>{
  expect(scores('test_2205',1)).toEqual([1,5,5,1]);
  expect(scores('test_2205',5)).toEqual([5,1,1,5]);
  const reversed=[2,6,10,13,14,15,17];
  const high=Array.from({length:17},(_,i)=>reversed.includes(i+1)?1:5);
  expect(scores('test_2205',high)).toEqual([5,5,5,5]);
  expect(scores('test_2205',high.map(v=>6-v))).toEqual([1,1,1,1]);
  const r=result('test_2205',Array.from({length:17},(_,i)=>i%5+1));
  // Control: 1+4+5+2+3+1; anxiety after reverse: 4+1+2+4;
  // memory after reverse: 5+3+1; understanding people: 3+4+2+1.
  expect(r.scales.map(s=>s.value)).toEqual([16/6,11/4,9/3,10/4]);
  expect(r.presentation).toBe('profile');expect(r.scales).toHaveLength(4);
 });
 it("all 29 articles remain reachable through the two server catalogue pages",()=>{
  expect(initialCatalog).toHaveLength(29);
  const a=discoverMethods(initialCatalog,{page:1}),b=discoverMethods(initialCatalog,{page:2});
  expect(a.items).toHaveLength(20);expect(b.items).toHaveLength(9);
  expect(new Set([...a.items,...b.items].map(m=>m.slug)).size).toBe(29);
 });
});
