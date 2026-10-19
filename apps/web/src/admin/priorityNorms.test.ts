import {describe,it,expect} from 'vitest';
import {resultMetrics,createResultsWorkbook} from './resultsWorkbook';
import {withPriorityNorms} from '../../../api/src/scoring/priorityNorms';
describe('priority normative results export',()=>{
 it('exports raw values and standard values as separate numeric columns',async()=>{
  const values=withPriorityNorms('test_3004',{complete:true,scales:{emotional_discomfort:{label:'Эмоциональный дискомфорт',score:44}}});
  expect(resultMetrics(values).map(x=>x.value)).toEqual([44,3]);
  const workbook=await createResultsWorkbook([{id:'synthetic',alias:'Test',age:30,gender:'Женский',groups:[{id:'s',code:'test_3004',title:'Шкала субъективного благополучия',answers:[],result:{values}}]}],[{id:'s',code:'test_3004',title:'Шкала субъективного благополучия',sectionKind:'verified'}]);
  const numbers:number[]=[];workbook.worksheets[0].getRow(3).eachCell(c=>{if(typeof c.value==='number')numbers.push(c.value)});
  expect(numbers).toContain(44);expect(numbers).toContain(3);
 });
 it('exports OSO frequency without replacing the raw score',()=>{
  const values=withPriorityNorms('test_3002',{complete:true,scales:{global:{label:'Глобальное самоотношение',score:16}}});
  expect(resultMetrics(values).map(x=>x.value)).toEqual([16,74.33]);
 });
});
