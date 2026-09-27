export const GPS_REVERSE_ITEMS=[3,4,6,8,11,13,14,15,18,20]as const;
const reverseSet=new Set<number>(GPS_REVERSE_ITEMS);
export type GpsResult={instrument:'GPS Student Form';complete:true;answered:20;overall:{label:string;score:number;average:number;minScore:20;maxScore:100;min:1;max:5}};

export function scoreGps(answers:Map<number,number>):GpsResult|null{
  const required=Array.from({length:20},(_,index)=>index+1);
  if(answers.size!==20||required.some(item=>!answers.has(item))||[...answers.values()].some(value=>!Number.isInteger(value)||value<1||value>5))return null;
  const score=required.reduce((sum,item)=>sum+(reverseSet.has(item)?6-answers.get(item)!:answers.get(item)!),0);
  return{instrument:'GPS Student Form',complete:true,answered:20,overall:{label:'General procrastination',score,average:Math.round(score/20*100)/100,minScore:20,maxScore:100,min:1,max:5}};
}
