import {describe,it,expect} from 'vitest';
import {osoCumulativeFrequencies,osoLevel,sokolovaSten,sokolovaLevel,withPriorityNorms} from './priorityNorms.js';
import {methodology as oso} from '../data/methodologies/priority-test_3002.js';
import {methodology as sokolova} from '../data/methodologies/priority-test_3004.js';
import {calculateConfigurableScores} from './configurable.js';

describe('OSO cumulative frequencies and Sokolova stens',()=>{
 it('covers every possible raw score of all twelve OSO scales with monotone bounded tables',()=>{
  expect(Object.keys(osoCumulativeFrequencies)).toHaveLength(12);
  for(const scale of oso.scoringConfig!.scales){
   const table=osoCumulativeFrequencies[scale.key];expect(table.length).toBe(scale.items.length+1);
   for(let raw=0;raw<table.length;raw++){
    expect(table[raw]).toBeGreaterThanOrEqual(raw?table[raw-1]:0);expect(table[raw]).toBeLessThanOrEqual(100);
    const result=withPriorityNorms('test_3002',{complete:true,scales:{[scale.key]:{label:scale.label,score:raw}}});
    const norm=(result.scales as any)[scale.key+'_cumulative_frequency'];
    expect(norm.score).toBe(table[raw]);expect(norm.rawScore).toBe(raw);
   }
  }
  expect(osoCumulativeFrequencies.global[12]).toBe(49);
  expect(osoCumulativeFrequencies.global[13]).toBe(55.33);
  expect(osoCumulativeFrequencies.global[16]).toBe(74.33);
  expect(osoCumulativeFrequencies.confidence[4]).toBe(49.67);
  expect(osoCumulativeFrequencies.self_blame[5]).toBe(60.77);
  expect(osoLevel(49.99)).toBe('Признак не выражен');
  expect(osoLevel(50)).toBe('Признак выражен');expect(osoLevel(74)).toBe('Признак выражен');
  expect(osoLevel(74.33)).toBe('Признак ярко выражен');
 });
 it('covers both sides of all sten boundaries and the full 17–119 raw range',()=>{
  const bins=[[17,33],[34,40],[41,48],[49,55],[56,62],[63,70],[71,77],[78,85],[86,92],[93,119]];
  bins.forEach(([min,max],i)=>{for(let raw=min;raw<=max;raw++)expect(sokolovaSten(raw)).toBe(i+1)});
  for(const raw of [16,120,NaN,44.5,Infinity])expect(sokolovaSten(raw)).toBeNull();
  expect(sokolovaSten(44)).toBe(3); // Published Psytests reference example.
  expect(sokolovaLevel(1)).toBe('Выраженный эмоциональный комфорт');
  expect(sokolovaLevel(3)).toBe('Умеренный эмоциональный комфорт');
  expect(sokolovaLevel(4)).toBe('Умеренное субъективное благополучие');
  expect(sokolovaLevel(8)).toBe('Эмоциональный дискомфорт');
  expect(sokolovaLevel(10)).toBe('Выраженный эмоциональный дискомфорт');
 });
 it('computes answers through raw sums to standard scores and preserves raw outputs',()=>{
  for(const [method,value,expectedKey,expected] of [[oso,1,'global_cumulative_frequency',38.33],[oso,0,'global_cumulative_frequency',80],[sokolova,1,'subjective_well_being_sten',6],[sokolova,7,'subjective_well_being_sten',7]] as const){
   const answers=Object.fromEntries(method.instrument.questions.map((_,i)=>[i+1,value]));
   const values=calculateConfigurableScores(method.scoringConfig!,answers)!;
   const raw={complete:true,scales:Object.fromEntries(method.scoringConfig!.scales.map(s=>[s.key,{label:s.label,score:values[s.key]}]))};
   const before=JSON.stringify(raw),result=withPriorityNorms(method.instrument.code,raw);
   expect(result.scales[expectedKey].score).toBe(expected);expect(JSON.stringify(raw)).toBe(before);
   expect(withPriorityNorms(method.instrument.code,result)).toEqual(result);
  }
 });
 it('leaves unrelated, invalid and incomplete results unchanged',()=>{
  const result={complete:false,scales:{emotional_discomfort:{label:'raw',score:65}}};
  expect(withPriorityNorms('test_3004',result)).toBe(result);
  expect(withPriorityNorms('test_3001',result)).toBe(result);
  expect(withPriorityNorms('test_3002',null)).toBeNull();
 });
});
