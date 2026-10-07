import { definitions } from '../scoring/mspss.js';
import { SSPM_2011_SCALES } from '../scoring/sspm2011.js';
import { SCCS_REVERSE_ITEMS } from '../scoring/sccs.js';
import { NSPS_ITEMS } from '../scoring/nsps.js';
import { SHOPP_KEYS } from '../scoring/shopp.js';
import { DEBQ_ITEMS } from '../scoring/debq.js';
import type { Item } from './types.js';
export function keyFor(instrument:string,number:number):Pick<Item,'min'|'max'|'scales'> {
  const scales:Item['scales']=[];
  const add=(name:string,label:string,reverse:boolean)=>scales.push({id:`${instrument}:${name}`,label,reverse});
  if(instrument==='test_1'&&number>=1&&number<=12){for(const[name,d]of Object.entries(definitions))if((d.items as readonly number[]).includes(number))add(name,d.label,false);return{min:1,max:7,scales}}
  if(instrument==='test_2'&&number>=1&&number<=52){for(const[name,d]of Object.entries(SSPM_2011_SCALES)){if(d.yes.includes(number))add(name,d.label,true);if(d.no.includes(number))add(name,d.label,false)}return{min:1,max:4,scales}}
  if(instrument==='test_3'&&number>=1&&number<=12){add('overall','Ясность Я-концепции',SCCS_REVERSE_ITEMS.includes(number));return{min:1,max:5,scales}}
  if(instrument==='test_4'&&number>=1&&number<=27){for(const[name,items]of Object.entries(NSPS_ITEMS))if((items as readonly number[]).includes(number))add(name,name,false);return{min:1,max:5,scales}}
  if(instrument==='test_5'&&number>=1&&number<=51){for(const[name,d]of Object.entries(SHOPP_KEYS)){if((d.direct as readonly number[]).includes(number))add(name,d.label,false);if((d.reverse as readonly number[]).includes(number))add(name,d.label,true)}return{min:1,max:6,scales}}
  if(instrument==='test_6'&&number>=1&&number<=33){for(const[name,items]of Object.entries(DEBQ_ITEMS))if((items as readonly number[]).includes(number))add(name,name,number===31);return{min:1,max:5,scales}}
  return{min:null,max:null,scales};
}
export function normalized(item:Item,value:unknown,scale?:string){if(typeof value!=='number'&&typeof value!=='string')return null;if(typeof value==='string'&&!value.trim())return null;const v=Number(value);if(item.min===null||item.max===null||!Number.isFinite(v)||v<item.min||v>item.max||item.min===item.max)return null;const reverse=scale?item.scales.find(s=>s.id===scale)?.reverse:item.scales[0]?.reverse;if(!scale&&item.scales.some(s=>s.reverse!==reverse))return null;return((reverse?item.max+item.min-v:v)-item.min)/(item.max-item.min);}
