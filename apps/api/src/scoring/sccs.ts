export type SccsResult={instrument:'SCCS';complete:true;answered:12;average:number;sum:number;min:number;max:number;reference:{mean:number;standardDeviation:number;zScore:number;sampleSize:number};};

export const SCCS_DIRECT_ITEMS=[6,11];
export const SCCS_REVERSE_ITEMS=[1,2,3,4,5,7,8,9,10,12];
export const SCCS_REFERENCE={mean:3.09,standardDeviation:0.72,sampleSize:349};
const round2=(value:number)=>Math.sign(value)*Math.round((Math.abs(value)+Number.EPSILON)*100)/100;

export function scoreSccs(rawAnswers:Map<number,number>):SccsResult|null{
  if(rawAnswers.size!==12||[...rawAnswers.entries()].some(([number,value])=>number<1||number>12||!Number.isInteger(value)||value<1||value>5))return null;
  const sum=Array.from({length:12},(_,i)=>{const number=i+1,value=rawAnswers.get(number)!;return SCCS_REVERSE_ITEMS.includes(number)?6-value:value}).reduce((total,value)=>total+value,0);
  const average=round2(sum/12);
  return{instrument:'SCCS',complete:true,answered:12,average,sum,min:1,max:5,reference:{...SCCS_REFERENCE,zScore:round2((average-SCCS_REFERENCE.mean)/SCCS_REFERENCE.standardDeviation)}};
}
