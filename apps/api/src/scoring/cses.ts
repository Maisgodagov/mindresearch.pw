export type CsesResult={
  instrument:'CSES';
  complete:true;
  answered:12;
  score:number;
  average:number;
  min:1;
  max:5;
};

export const CSES_REVERSE_ITEMS=[2,4,6,8,10,12];
const round2=(value:number)=>Math.round((value+Number.EPSILON)*100)/100;

export function scoreCses(rawAnswers:Map<number,number>):CsesResult|null{
  if(rawAnswers.size!==12||[...rawAnswers.entries()].some(([number,value])=>number<1||number>12||!Number.isInteger(value)||value<1||value>5))return null;
  const score=Array.from({length:12},(_,i)=>{
    const number=i+1;
    const value=rawAnswers.get(number)!;
    return CSES_REVERSE_ITEMS.includes(number)?6-value:value;
  }).reduce((total,value)=>total+value,0);
  return{instrument:'CSES',complete:true,answered:12,score,average:round2(score/12),min:1,max:5};
}
