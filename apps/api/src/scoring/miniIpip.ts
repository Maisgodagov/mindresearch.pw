type Direction='+'|'-';
type ScaleKey='extraversion'|'agreeableness'|'conscientiousness'|'neuroticism'|'intellectImagination';
type ScaleDefinition={label:string;items:readonly [number,Direction][]};
type Scale={label:string;score:number;average:number;min:1;max:5};

export const miniIpipScales={
  extraversion:{label:'Extraversion',items:[[1,'+'],[6,'-'],[11,'+'],[16,'-']]},
  agreeableness:{label:'Agreeableness',items:[[2,'+'],[7,'-'],[12,'+'],[17,'-']]},
  conscientiousness:{label:'Conscientiousness',items:[[3,'+'],[8,'-'],[13,'+'],[18,'-']]},
  neuroticism:{label:'Neuroticism',items:[[4,'+'],[9,'-'],[14,'+'],[19,'-']]},
  intellectImagination:{label:'Intellect / Imagination',items:[[5,'+'],[10,'-'],[15,'-'],[20,'-']]},
}as const satisfies Record<ScaleKey,ScaleDefinition>;

export type MiniIpipResult={instrument:'Mini-IPIP';complete:true;answered:20;scales:Record<ScaleKey,Scale>};

const value=(raw:number,direction:Direction)=>direction==='+'?raw:6-raw;
const score=(label:string,values:number[]):Scale=>{const sum=values.reduce((total,item)=>total+item,0);return{label,score:sum,average:sum/values.length,min:1,max:5}};

export function scoreMiniIpip(answers:Map<number,number>):MiniIpipResult|null{
  const required=Array.from({length:20},(_,index)=>index+1);
  if(answers.size!==20||required.some(item=>!answers.has(item))||[...answers.values()].some(item=>!Number.isInteger(item)||item<1||item>5))return null;
  const scales=Object.fromEntries(Object.entries(miniIpipScales).map(([key,scaleDef])=>[key,score(scaleDef.label,scaleDef.items.map(([item,direction])=>value(answers.get(item)!,direction)))]))as MiniIpipResult['scales'];
  return{instrument:'Mini-IPIP',complete:true,answered:20,scales};
}
