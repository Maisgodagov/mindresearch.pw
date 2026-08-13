export type MspssLevel='low'|'moderate'|'high';
export type MspssScore={label:string;score:number;min:1;max:7;level:MspssLevel;levelLabel:string;items:number[]};
export type MspssResult={instrument:'MSPSS';complete:true;answered:12;overall:MspssScore;scales:Record<'significantOther'|'family'|'friends',MspssScore>};

const definitions={
  significantOther:{label:'Поддержка значимого другого',items:[1,2,5,10]},
  family:{label:'Поддержка семьи',items:[3,4,8,11]},
  friends:{label:'Поддержка друзей',items:[6,7,9,12]},
} as const;
const round2=(value:number)=>Math.sign(value)*Math.round((Math.abs(value)+Number.EPSILON)*100)/100;
const classify=(score:number):MspssLevel=>score<3?'low':score>5?'high':'moderate';
const labels:Record<MspssLevel,string>={low:'Низкая поддержка',moderate:'Умеренная поддержка',high:'Высокая поддержка'};
function makeScore(label:string,items:number[],answers:Map<number,number>):MspssScore{const raw=items.reduce((sum,item)=>sum+answers.get(item)!,0)/items.length,level=classify(raw);return{label,score:round2(raw),min:1,max:7,level,levelLabel:labels[level],items}}

export function scoreMspss(answers:Map<number,number>):MspssResult|null{
  if(answers.size!==12||[...answers.entries()].some(([number,value])=>number<1||number>12||!Number.isInteger(value)||value<1||value>7))return null;
  const all=Array.from({length:12},(_,i)=>i+1);
  return{instrument:'MSPSS',complete:true,answered:12,overall:makeScore('Общая воспринимаемая поддержка',all,answers),scales:Object.fromEntries(Object.entries(definitions).map(([code,d])=>[code,makeScore(d.label,[...d.items],answers)])) as MspssResult['scales']};
}
