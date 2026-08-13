export const NSPS_ITEMS={socialCompetence:[3,10,12,14,17,18,19,20,21,23,24],physicalAppearance:[2,5,9,11,13,22,26,27],signsOfAnxiety:[1,4,6,7,8,15,16,25]} as const;
type NspsScale={label:string;score:number;minScore:number;maxScore:number;items:readonly number[]};
export type NspsResult={instrument:'NSPS';complete:true;answered:27;overall:NspsScale;scales:Record<keyof typeof NSPS_ITEMS,NspsScale>};
const labels={socialCompetence:'Социальная компетентность',physicalAppearance:'Физическая внешность',signsOfAnxiety:'Признаки тревоги'};
export function scoreNsps(answers:Map<number,number>):NspsResult|null{
  if(answers.size!==27||[...answers].some(([item,value])=>item<1||item>27||!Number.isInteger(value)||value<1||value>5))return null;
  const scale=(key:keyof typeof NSPS_ITEMS):NspsScale=>{const items=NSPS_ITEMS[key];return{label:labels[key],score:items.reduce((sum,item)=>sum+answers.get(item)!,0),minScore:items.length,maxScore:items.length*5,items}};
  const all=Array.from({length:27},(_,index)=>index+1);
  return{instrument:'NSPS',complete:true,answered:27,overall:{label:'Общий показатель NSPS',score:all.reduce((sum,item)=>sum+answers.get(item)!,0),minScore:27,maxScore:135,items:all},scales:{socialCompetence:scale('socialCompetence'),physicalAppearance:scale('physicalAppearance'),signsOfAnxiety:scale('signsOfAnxiety')}};
}
