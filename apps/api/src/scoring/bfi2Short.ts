type KeyItem=number|`${number}R`;
const domains={
  extraversion:{label:'Экстраверсия',items:['1R',6,11,16,'21R','26R']},
  agreeableness:{label:'Доброжелательность',items:[2,'7R',12,'17R',22,'27R']},
  conscientiousness:{label:'Добросовестность',items:['3R','8R',13,18,23,'28R']},
  negativeEmotionality:{label:'Негативная эмоциональность',items:[4,9,'14R','19R','24R',29]},
  openMindedness:{label:'Открытость опыту',items:[5,'10R',15,'20R',25,'30R']},
}as const satisfies Record<string,{label:string;items:readonly KeyItem[]}>;
const facets={
  sociability:{label:'Общительность',items:['1R',16]},assertiveness:{label:'Настойчивость',items:[6,'21R']},energyLevel:{label:'Энергичность',items:[11,'26R']},
  compassion:{label:'Сочувствие',items:[2,'17R']},respectfulness:{label:'Уважительность',items:['7R',22]},trust:{label:'Доверие',items:[12,'27R']},
  organization:{label:'Организованность',items:['3R',18]},productiveness:{label:'Продуктивность',items:['8R',23]},responsibility:{label:'Ответственность',items:[13,'28R']},
  anxiety:{label:'Тревожность',items:[4,'19R']},depression:{label:'Депрессивность',items:[9,'24R']},emotionalVolatility:{label:'Эмоциональная изменчивость',items:['14R',29]},
  intellectualCuriosity:{label:'Любознательность',items:['10R',25]},aestheticSensitivity:{label:'Эстетичность',items:[5,'20R']},creativeImagination:{label:'Творческое воображение',items:[15,'30R']},
}as const satisfies Record<string,{label:string;items:readonly KeyItem[]}>;
type Scale={label:string;score:number;average:number;min:1;max:5};
export type Bfi2ShortResult={instrument:'BFI-2-S Russian';complete:true;answered:30;domains:Record<keyof typeof domains,Scale>;facets:Record<keyof typeof facets,Scale>};
const round=(value:number)=>Math.round(value*100)/100;
const numberOf=(item:KeyItem)=>Number(String(item).replace('R',''));
const reversed=(item:KeyItem)=>String(item).endsWith('R');

export function scoreBfi2Short(answers:Map<number,number>):Bfi2ShortResult|null{
  const required=Array.from({length:30},(_,index)=>index+1);
  if(answers.size!==30||required.some(item=>!answers.has(item))||[...answers.values()].some(value=>!Number.isInteger(value)||value<1||value>5))return null;
  const score=(label:string,items:readonly KeyItem[]):Scale=>{const sum=items.reduce<number>((total,item)=>{const raw=answers.get(numberOf(item))!;return total+(reversed(item)?6-raw:raw)},0);return{label,score:sum,average:round(sum/items.length),min:1,max:5}};
  return{instrument:'BFI-2-S Russian',complete:true,answered:30,domains:Object.fromEntries(Object.entries(domains).map(([key,value])=>[key,score(value.label,value.items)]))as Bfi2ShortResult['domains'],facets:Object.fromEntries(Object.entries(facets).map(([key,value])=>[key,score(value.label,value.items)]))as Bfi2ShortResult['facets']};
}

export const BFI2_SHORT_REVERSE_ITEMS=[1,3,7,8,10,14,17,19,20,21,24,26,27,28,30]as const;
