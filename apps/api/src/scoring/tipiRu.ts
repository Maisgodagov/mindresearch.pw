type KeyItem=number|`${number}R`;
const scales={
  extraversion:{label:'Экстравертность',items:[1,'6R']},
  agreeableness:{label:'Дружелюбие',items:['2R',7]},
  conscientiousness:{label:'Добросовестность',items:[3,'8R']},
  emotionalStability:{label:'Эмоциональная стабильность',items:['4R',9]},
  openness:{label:'Открытость новому опыту',items:[5,'10R']},
}as const satisfies Record<string,{label:string;items:readonly KeyItem[]}>;
type Scale={label:string;score:number;average:number;min:1;max:7};
export type TipiRuResult={instrument:'TIPI-RU';complete:true;answered:10;scales:Record<keyof typeof scales,Scale>};
const numberOf=(item:KeyItem)=>Number(String(item).replace('R',''));
const reversed=(item:KeyItem)=>String(item).endsWith('R');

export function scoreTipiRu(answers:Map<number,number>):TipiRuResult|null{
  const required=Array.from({length:10},(_,index)=>index+1);
  if(answers.size!==10||required.some(item=>!answers.has(item))||[...answers.values()].some(value=>!Number.isInteger(value)||value<1||value>7))return null;
  const score=(label:string,items:readonly KeyItem[]):Scale=>{const sum=items.reduce<number>((total,item)=>{const raw=answers.get(numberOf(item))!;return total+(reversed(item)?8-raw:raw)},0);return{label,score:sum,average:sum/2,min:1,max:7}};
  return{instrument:'TIPI-RU',complete:true,answered:10,scales:Object.fromEntries(Object.entries(scales).map(([key,value])=>[key,score(value.label,value.items)]))as TipiRuResult['scales']};
}

export const TIPI_RU_REVERSE_ITEMS=[2,4,6,8,10]as const;
