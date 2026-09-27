export const STUDY_ALIENATION_SCALES={
  vegetativeness:{label:'Вегетативность',items:[4,8,11]},
  powerlessness:{label:'Бессилие',items:[1,5,9]},
  nihilism:{label:'Нигилизм',items:[2,6,12]},
  adventurousness:{label:'Авантюризм',items:[3,7,10]},
}as const;

const round2=(value:number)=>Math.round(value*100)/100;
export type StudyAlienationScale={label:string;score:number;average:number;min:1;max:5;items:readonly number[]};
export type StudyAlienationResult={instrument:'Шкала отчуждения от учебы';complete:true;answered:12;overall:{label:string;score:number;average:number;min:1;max:5};scales:Record<keyof typeof STUDY_ALIENATION_SCALES,StudyAlienationScale>};

export function scoreStudyAlienation(answers:Map<number,number>):StudyAlienationResult|null{
  const required=Array.from({length:12},(_,index)=>index+1);
  if(answers.size!==12||required.some(item=>!answers.has(item))||[...answers.values()].some(value=>!Number.isInteger(value)||value<1||value>5))return null;
  const scales=Object.fromEntries(Object.entries(STUDY_ALIENATION_SCALES).map(([code,definition])=>{
    const average=round2(definition.items.reduce((sum,item)=>sum+answers.get(item)!,0)/3);
    return[code,{label:definition.label,score:average,average,min:1,max:5,items:definition.items}];
  }))as unknown as StudyAlienationResult['scales'];
  const average=round2(required.reduce((sum,item)=>sum+answers.get(item)!,0)/12);
  return{instrument:'Шкала отчуждения от учебы',complete:true,answered:12,overall:{label:'Общее отчуждение от учебы',score:average,average,min:1,max:5},scales};
}
