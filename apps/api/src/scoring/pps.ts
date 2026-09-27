const groups={
  decisional:{label:'Decisional delay',items:[1,2,3]},
  implemental:{label:'Implemental delay',items:[4,5,6,7,8]},
  lateness:{label:'Lateness / timeliness',items:[9,10,11,12]},
}as const;

type Scale={label:string;score:number;average:number;minScore:number;maxScore:number;min:1;max:5};
export type PpsResult={instrument:'PPS-12';complete:true;answered:12;overall:Scale;scales:Record<keyof typeof groups,Scale>};
const round=(value:number)=>Math.round(value*100)/100;

export function scorePps(answers:Map<number,number>):PpsResult|null{
  const required=Array.from({length:12},(_,index)=>index+1);
  if(answers.size!==12||required.some(item=>!answers.has(item))||[...answers.values()].some(value=>!Number.isInteger(value)||value<1||value>5))return null;
  const makeScale=(label:string,items:readonly number[]):Scale=>{
    const score=items.reduce((sum,item)=>sum+answers.get(item)!,0);
    return{label,score,average:round(score/items.length),minScore:items.length,maxScore:items.length*5,min:1,max:5};
  };
  const scales=Object.fromEntries(Object.entries(groups).map(([key,group])=>[key,makeScale(group.label,group.items)]))as PpsResult['scales'];
  return{instrument:'PPS-12',complete:true,answered:12,overall:makeScale('Pure procrastination',required),scales};
}
