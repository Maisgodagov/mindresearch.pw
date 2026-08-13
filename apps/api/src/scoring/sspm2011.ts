export type SspmLevel='low'|'medium'|'high';
export type SspmScaleResult={label:string;score:number;maxScore:number;level:SspmLevel;levelLabel:string};
export type SspmResult={instrument:'SSPM-2011';complete:true;answered:number;overall:SspmScaleResult;scales:Record<string,SspmScaleResult>};

type ScaleDefinition={label:string;yes:number[];no:number[];lowMax:number;highMin:number};

export const SSPM_2011_SCALES:Record<string,ScaleDefinition>={
  planning:{label:'Планирование',yes:[1,10,21,24,27,34,42],no:[19,48],lowMax:3,highMin:7},
  modeling:{label:'Моделирование',yes:[14,43],no:[4,5,8,23,28,31,39],lowMax:3,highMin:7},
  programming:{label:'Программирование',yes:[17,26,44,47,49],no:[3,7,11,36],lowMax:4,highMin:8},
  evaluation:{label:'Оценивание результатов',yes:[16],no:[9,12,13,29,32,40,45,50],lowMax:3,highMin:7},
  flexibility:{label:'Гибкость',yes:[2,14,30,41,42,47,51],no:[22,28],lowMax:4,highMin:8},
  independence:{label:'Самостоятельность',yes:[6,15,18,25,33,37,46,52],no:[40],lowMax:3,highMin:7},
  reliability:{label:'Надёжность',yes:[38],no:[3,5,8,12,20,29,35,36],lowMax:3,highMin:7},
};

export const SSPM_2011_OVERALL:ScaleDefinition={
  label:'Общий уровень саморегуляции',
  yes:[1,2,6,10,14,15,16,17,18,21,24,25,26,27,30,33,34,37,38,41,42,43,44,46,47,49,51,52],
  no:[3,4,5,7,8,9,11,12,13,19,20,22,23,28,29,31,32,35,36,39,40,45,48,50],
  lowMax:25,highMin:37,
};

const levelLabels:Record<SspmLevel,string>={low:'Низкий уровень',medium:'Средний уровень',high:'Высокий уровень'};
function classify(score:number,{lowMax,highMin}:ScaleDefinition):SspmLevel{return score<=lowMax?'low':score>=highMin?'high':'medium'}
function scoreScale(answers:Map<number,number>,definition:ScaleDefinition):SspmScaleResult{
  const score=definition.yes.filter(n=>answers.get(n)!<=2).length+definition.no.filter(n=>answers.get(n)!>=3).length;
  const level=classify(score,definition);
  return{label:definition.label,score,maxScore:definition.yes.length+definition.no.length,level,levelLabel:levelLabels[level]};
}

export function scoreSspm2011(rawAnswers:Map<number,number>):SspmResult|null{
  if(rawAnswers.size!==52||[...rawAnswers.entries()].some(([number,value])=>number<1||number>52||!Number.isInteger(value)||value<1||value>4))return null;
  return{instrument:'SSPM-2011',complete:true,answered:52,overall:scoreScale(rawAnswers,SSPM_2011_OVERALL),scales:Object.fromEntries(Object.entries(SSPM_2011_SCALES).map(([code,definition])=>[code,scoreScale(rawAnswers,definition)]))};
}
