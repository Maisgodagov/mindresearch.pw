export type RsesLevel='low'|'average'|'high';
export type RsesResult={
  instrument:'RSES';
  complete:true;
  answered:10;
  score:number;
  min:0;
  max:30;
  level:RsesLevel;
  levelLabel:string;
};

export const RSES_REVERSE_ITEMS=[2,5,6,8,9];

function level(score:number):{level:RsesLevel;levelLabel:string}{
  if(score<15)return{level:'low',levelLabel:'Низкая самооценка'};
  if(score<=25)return{level:'average',levelLabel:'Средняя самооценка'};
  return{level:'high',levelLabel:'Высокая самооценка'};
}

export function scoreRses(rawAnswers:Map<number,number>):RsesResult|null{
  if(rawAnswers.size!==10||[...rawAnswers.entries()].some(([number,value])=>number<1||number>10||!Number.isInteger(value)||value<0||value>3))return null;
  const score=Array.from({length:10},(_,i)=>{
    const number=i+1;
    const value=rawAnswers.get(number)!;
    return RSES_REVERSE_ITEMS.includes(number)?3-value:value;
  }).reduce((total,value)=>total+value,0);
  return{instrument:'RSES',complete:true,answered:10,score,min:0,max:30,...level(score)};
}
