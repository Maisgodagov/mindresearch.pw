export const DEBQ_ITEMS={restrained:[1,2,3,4,5,6,7,8,9,10],emotional:[11,12,13,14,15,16,17,18,19,20,21,22,23],external:[24,25,26,27,28,29,30,31,32,33]} as const;
type DebqScale={label:string;average:number;min:number;max:number;items:readonly number[]};
export type DebqResult={instrument:'DEBQ';complete:true;answered:33;scales:Record<keyof typeof DEBQ_ITEMS,DebqScale>};
const round2=(n:number)=>Math.round((n+Number.EPSILON)*100)/100;
export function scoreDebq(answers:Map<number,number>):DebqResult|null{
  if(answers.size!==33||[...answers].some(([item,value])=>item<1||item>33||!Number.isInteger(value)||value<1||value>5))return null;
  const labels={restrained:'Ограничительное пищевое поведение',emotional:'Эмоциогенное пищевое поведение',external:'Экстернальное пищевое поведение'};
  const scale=(key:keyof typeof DEBQ_ITEMS):DebqScale=>{const items=DEBQ_ITEMS[key];const sum=items.reduce((s,item)=>s+(item===31?6-answers.get(item)!:answers.get(item)!),0);return{label:labels[key],average:round2(sum/items.length),min:1,max:5,items}};
  return{instrument:'DEBQ',complete:true,answered:33,scales:{restrained:scale('restrained'),emotional:scale('emotional'),external:scale('external')}};
}
