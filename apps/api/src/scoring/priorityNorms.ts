
// Index is the integer raw score, values are published cumulative frequencies (%).
// Edition and discrepancies are documented in docs/methodologies/reviews/priority-test_3002.md.
export const osoCumulativeFrequencies: Readonly<Record<string,readonly number[]>> = {
 global:[0,0.67,3,5.33,6.33,9,13,16,21.33,26.67,32.33,38.33,49,55.33,62.67,69.33,74.33,80,85,88,90.67,93.33,96,96.67,98,98.33,98.67,99.67,99.67],
 self_respect:[1.67,4,6,9.33,16,25.33,34,44.67,58.67,71.33,80,86.67,91.33,93.67,99.67,100],
 autosympathy:[0.33,3.67,9,16,21.67,28,37.33,47,58.33,69.67,77.33,86,90.67,96.67,98.33,99.67,100],
 expected_attitude:[0,0,0.67,1,3.33,6,9,17.67,27.33,39.67,53,72.33,91.33,100],
 self_interest:[0.67,2,5.33,16,29,49.67,71.33,92.33,100],
 confidence:[3.77,7.33,16.67,29.33,49.67,65.67,81.33,92.33,100],
 others_attitude:[0,0.67,3.67,7.33,15,32,51.33,80,100],
 self_acceptance:[2.67,7.67,16.67,34.33,50.67,70.67,89.67,100],
 self_guidance:[3,9.67,25.67,38.33,60.33,79.67,92,100],
 self_blame:[1.67,4.67,15,27.67,43.33,60.77,81.67,96.67,100],
 self_interest_actions:[0.67,3,11.33,20,34.33,54.67,80,100],
 self_understanding:[4.33,21.33,43.33,68.67,83.67,94,99.33,100],
};
export const priorityNormsVersion = 'oso-cumulative-sokolova-sten-2026-10-19-v1';
export function osoLevel(frequency:number){
 return frequency<50 ? 'Признак не выражен' : frequency<=74 ? 'Признак выражен' : 'Признак ярко выражен';
}
export function sokolovaSten(raw:number):number|null {
 if(!Number.isInteger(raw)||raw<17||raw>119)return null;
 // Saturated endpoints: 17–33 -> 1; 93–119 -> 10, as in the cited Psytests calculation.
 return [33,40,48,55,62,70,77,85,92,119].findIndex(upper=>raw<=upper)+1;
}
export function sokolovaLevel(sten:number){
 return sten===1?'Выраженный эмоциональный комфорт':sten<=3?'Умеренный эмоциональный комфорт':sten<=7?'Умеренное субъективное благополучие':sten<=9?'Эмоциональный дискомфорт':'Выраженный эмоциональный дискомфорт';
}
const sokolovaInterpretations:Record<string,string>={
 'Выраженный эмоциональный комфорт':'Ответы отражают высокое субъективное благополучие и отсутствие выраженных жалоб на эмоциональное состояние.',
 'Умеренный эмоциональный комфорт':'Ответы отражают преимущественно благоприятное эмоциональное состояние и удовлетворённость повседневной жизнью.',
 'Умеренное субъективное благополучие':'Промежуточная область шкалы: эмоциональное состояние сочетает благоприятные переживания с отдельными затруднениями.',
 'Эмоциональный дискомфорт':'Ответы отражают повышенное субъективное напряжение и неудовлетворённость эмоциональным состоянием.',
 'Выраженный эмоциональный дискомфорт':'Ответы отражают существенные субъективные эмоциональные затруднения; результат описывает самоощущение и сам по себе не устанавливает диагноз.',
};
type SavedScale={label:string;score:number;[key:string]:unknown};
/** Adds norm scores while retaining every raw score and the original formula version. Idempotent. */
export function withPriorityNorms<T>(code:string,result:T):T {
 if(!['test_3002','test_3004'].includes(code)||!result||typeof result!=='object')return result;
 const original=result as {complete?:boolean;scales?:Record<string,SavedScale>};
 if(original.complete===false||!original.scales)return result;
 const scales={...original.scales};
 if(code==='test_3002'){
  for(const [key,table] of Object.entries(osoCumulativeFrequencies)){
   const raw=scales[key];if(!raw||!Number.isInteger(raw.score)||raw.score<0||raw.score>=table.length)continue;
   const score=table[raw.score],levelLabel=osoLevel(score);
   scales[`${key}_cumulative_frequency`]={label:`${raw.label} — накопленная частота, %`,score,min:0,max:100,minScore:0,maxScore:100,aggregation:'norm',unit:'%',rawScore:raw.score,normVersion:priorityNormsVersion,levelLabel,
    interpretation:key==='self_blame'?'Большая выраженность означает более сильную склонность обвинять себя. Накопленная частота характеризует положение относительно нормативной выборки.':'Накопленная частота характеризует положение результата относительно нормативной выборки; это не процент согласий с утверждениями.'};
  }
 }else{
  const raw=scales.emotional_discomfort;if(!raw)return result;
  const score=sokolovaSten(raw.score);if(score===null)return result;
  const levelLabel=sokolovaLevel(score);
  scales.subjective_well_being_sten={label:'Субъективное благополучие — стены',score,min:1,max:10,minScore:1,maxScore:10,aggregation:'norm',unit:'стен',rawScore:raw.score,normVersion:priorityNormsVersion,levelLabel,interpretation:sokolovaInterpretations[levelLabel]};
 }
 return {...result,scales,normVersion:priorityNormsVersion};
}
