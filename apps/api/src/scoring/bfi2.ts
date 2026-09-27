type KeyItem=number|`${number}R`;
const domains={
  extraversion:{label:'Экстраверсия',items:[1,6,'11R','16R',21,'26R','31R','36R',41,46,'51R',56]},
  agreeableness:{label:'Доброжелательность',items:[2,7,'12R','17R','22R',27,32,'37R','42R','47R',52,57]},
  conscientiousness:{label:'Добросовестность',items:['3R','8R',13,18,'23R','28R',33,38,43,'48R',53,'58R']},
  negativeEmotionality:{label:'Негативная эмоциональность',items:['4R','9R',14,19,'24R','29R',34,39,'44R','49R',54,59]},
  openMindedness:{label:'Открытость опыту',items:['5R',10,15,20,'25R','30R',35,40,'45R','50R','55R',60]},
}as const satisfies Record<string,{label:string;items:readonly KeyItem[]}>;
const facets={
  sociability:{label:'Общительность',items:[1,'16R','31R',46]},assertiveness:{label:'Настойчивость',items:[6,21,'36R','51R']},energyLevel:{label:'Энергичность',items:['11R','26R',41,56]},
  compassion:{label:'Сочувствие',items:[2,'17R',32,'47R']},respectfulness:{label:'Уважительность',items:[7,'22R','37R',52]},trust:{label:'Доверие',items:['12R',27,'42R',57]},
  organization:{label:'Организованность',items:['3R',18,33,'48R']},productiveness:{label:'Продуктивность',items:['8R','23R',38,53]},responsibility:{label:'Ответственность',items:[13,'28R',43,'58R']},
  anxiety:{label:'Тревожность',items:['4R',19,34,'49R']},depression:{label:'Депрессивность',items:['9R','24R',39,54]},emotionalVolatility:{label:'Эмоциональная изменчивость',items:[14,'29R','44R',59]},
  intellectualCuriosity:{label:'Любознательность',items:[10,'25R',40,'55R']},aestheticSensitivity:{label:'Эстетичность',items:['5R',20,35,'50R']},creativeImagination:{label:'Творческое воображение',items:[15,'30R','45R',60]},
}as const satisfies Record<string,{label:string;items:readonly KeyItem[]}>;
type Scale={label:string;score:number;average:number;min:1;max:5};
export type Bfi2Result={instrument:'BFI-2 Russian';complete:true;answered:60;domains:Record<keyof typeof domains,Scale>;facets:Record<keyof typeof facets,Scale>};
const round=(value:number)=>Math.round(value*100)/100;
const numberOf=(item:KeyItem)=>Number(String(item).replace('R',''));
const reversed=(item:KeyItem)=>String(item).endsWith('R');

export function scoreBfi2(answers:Map<number,number>):Bfi2Result|null{
  const required=Array.from({length:60},(_,index)=>index+1);
  if(answers.size!==60||required.some(item=>!answers.has(item))||[...answers.values()].some(value=>!Number.isInteger(value)||value<1||value>5))return null;
  const score=(label:string,items:readonly KeyItem[]):Scale=>{const sum=items.reduce<number>((total,item)=>{const raw=answers.get(numberOf(item))!;return total+(reversed(item)?6-raw:raw)},0);return{label,score:sum,average:round(sum/items.length),min:1,max:5}};
  return{instrument:'BFI-2 Russian',complete:true,answered:60,domains:Object.fromEntries(Object.entries(domains).map(([key,value])=>[key,score(value.label,value.items)]))as Bfi2Result['domains'],facets:Object.fromEntries(Object.entries(facets).map(([key,value])=>[key,score(value.label,value.items)]))as Bfi2Result['facets']};
}

export const BFI2_REVERSE_ITEMS=[3,4,5,8,9,11,12,16,17,22,23,24,25,26,28,29,30,31,36,37,42,44,45,47,48,49,50,51,55,58]as const;
