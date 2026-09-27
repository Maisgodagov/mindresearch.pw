export const AMS_SCALES={
  intrinsicToKnow:{label:'Intrinsic motivation — to know',items:[2,9,16,23]},
  intrinsicAccomplishment:{label:'Intrinsic motivation — toward accomplishment',items:[6,13,20,27]},
  intrinsicStimulation:{label:'Intrinsic motivation — to experience stimulation',items:[4,11,18,25]},
  extrinsicIdentified:{label:'Extrinsic motivation — identified',items:[3,10,17,24]},
  extrinsicIntrojected:{label:'Extrinsic motivation — introjected',items:[7,14,21,28]},
  extrinsicExternal:{label:'Extrinsic motivation — external regulation',items:[1,8,15,22]},
  amotivation:{label:'Amotivation',items:[5,12,19,26]},
}as const;
const round2=(value:number)=>Math.round(value*100)/100;
export type AmsScale={label:string;score:number;average:number;min:1;max:7;items:readonly number[]};
export type AmsResult={instrument:'AMS-C 28';complete:true;answered:28;scales:Record<keyof typeof AMS_SCALES,AmsScale>};
export function scoreAms(answers:Map<number,number>):AmsResult|null{
  const required=Array.from({length:28},(_,index)=>index+1);
  if(answers.size!==28||required.some(item=>!answers.has(item))||[...answers.values()].some(value=>!Number.isInteger(value)||value<1||value>7))return null;
  const scales=Object.fromEntries(Object.entries(AMS_SCALES).map(([code,definition])=>{const average=round2(definition.items.reduce((sum,item)=>sum+answers.get(item)!,0)/4);return[code,{label:definition.label,score:average,average,min:1,max:7,items:definition.items}]}))as unknown as AmsResult['scales'];
  return{instrument:'AMS-C 28',complete:true,answered:28,scales};
}
