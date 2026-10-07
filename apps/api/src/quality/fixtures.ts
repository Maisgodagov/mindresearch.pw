import type {Item,Participant} from './types.js';
import { random } from './math.js';
export const fixtureItems:Item[]=Array.from({length:12},(_,scale)=>Array.from({length:6},(_,q)=>({id:'s'+scale+'q'+q,code:'q'+(scale*6+q+1),block:'battery',instrument:'fixture',title:'Synthetic battery',text:'Fixture item '+q,order:scale*6+q,position:scale*6+q,type:'single',required:true,options:Array.from({length:7},(_,i)=>({value:i+1,label:String(i+1)})),min:1,max:7,scales:[{id:'scale'+scale,label:'Scale '+scale,reverse:q%2===1}],psychological:true,exclude:false}))).flat();
export function fixturePerson(id:string,kind:'consistent'|'random'|'extreme'='consistent',time=8):Participant{
 const rng=random(id),latents=Array.from({length:12},()=>Math.floor(rng()*7)+1);
 return {id,alias:id,status:'completed',cohort:'trusted',trusted:true,eligibility:'unknown',eligibilityReason:null,duplicate:false,telemetryVersion:'visible-time-v2-sequence',startedAt:'2026-01-01T00:00:00Z',completedAt:'2026-01-01T00:10:00Z',answers:Object.fromEntries(fixtureItems.map((item,index)=>{
  const scale=Math.floor(index/6),base=kind==='random'?Math.floor(rng()*7)+1:kind==='extreme'?scale%2?7:1:Math.max(1,Math.min(7,latents[scale]+(rng()<.12?(rng()<.5?-1:1):0)));
  return [item.id,{value:item.scales[0].reverse?8-base:base,activeSeconds:time,visits:1,visitSequence:index}];
 }))};
}
export const fixturePeople=()=>Array.from({length:100},(_,n)=>fixturePerson('reference-'+String(n).padStart(3,'0'),'consistent',7+n%3));
