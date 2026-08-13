type Key={direct:readonly number[];reverse:readonly number[];label:string};
export const SHOPP_KEYS={
  driveForThinness:{label:'Стремление к худобе',direct:[8,12,18,25,41],reverse:[1]},
  bulimia:{label:'Булимия',direct:[3,4,21,30,37,48,51],reverse:[]},
  bodyDissatisfaction:{label:'Неудовлетворённость телом',direct:[2,6,36,46],reverse:[9,14,24,43,49]},
  ineffectiveness:{label:'Неэффективность',direct:[7,20,32,44],reverse:[15,29,33]},
  perfectionism:{label:'Перфекционизм',direct:[10,22,28,34,40,50],reverse:[]},
  interpersonalDistrust:{label:'Недоверие в межличностных отношениях',direct:[27,42],reverse:[11,13,17,23,45]},
  interoceptiveAwareness:{label:'Интероцептивная некомпетентность',direct:[5,16,26,31,35,38,39,47],reverse:[19]}
} as const satisfies Record<string,Key>;
type ShoppScale={label:string;score:number;maxScore:number;direct:readonly number[];reverse:readonly number[]};
export type ShoppResult={instrument:'ШОПП';complete:true;answered:51;scales:Record<keyof typeof SHOPP_KEYS,ShoppScale>};
export function scoreShopp(answers:Map<number,number>):ShoppResult|null{
  if(answers.size!==51||[...answers].some(([item,value])=>item<1||item>51||!Number.isInteger(value)||value<1||value>6))return null;
  const scales={} as ShoppResult['scales'];
  Object.entries(SHOPP_KEYS).forEach(([name,key])=>{const direct=key.direct.reduce((s,item)=>s+Math.max(0,answers.get(item)!-3),0);const reverse=key.reverse.reduce((s,item)=>s+Math.max(0,4-answers.get(item)!),0);const score=direct+reverse;scales[name as keyof typeof SHOPP_KEYS]={...key,score,maxScore:(key.direct.length+key.reverse.length)*3}});
  return{instrument:'ШОПП',complete:true,answered:51,scales};
}
