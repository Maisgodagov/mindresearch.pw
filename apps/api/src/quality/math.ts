import { createHash } from 'node:crypto';
import type { QualityConfig } from './config.js';
import type { ReferenceStats } from './types.js';
export const hash = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
export const mean = (x: number[]) => x.length ? x.reduce((a,b)=>a+b,0)/x.length : null;
export function quantile(x: number[], p: number) { if (!x.length) return null; const a=[...x].sort((a,b)=>a-b), r=(a.length-1)*p, i=Math.floor(r); return a[i]+(a[Math.min(i+1,a.length-1)]-a[i])*(r-i); }
export const median = (x: number[]) => quantile(x,.5);
export const variance = (x: number[]) => x.length<2 ? null : x.reduce((sum,v)=>sum+(v-mean(x)!)**2,0)/(x.length-1);
export const sd = (x: number[]) => variance(x) === null ? null : Math.sqrt(variance(x)!);
export const mad = (x: number[]) => x.length ? median(x.map(v=>Math.abs(v-median(x)!)))! : 0;
export const clamp = (v: number, lo=0, hi=1) => Math.max(lo,Math.min(hi,v));
export function severity(v: number, warning: number, critical: number) { if (warning===critical) return v===warning?0:1; const t=clamp((v-warning)/(critical-warning)); return t*t*(3-2*t); }
export function geometric(values: { score: number|null; weight: number }[], epsilon=1) { const present=values.filter(v=>v.score!==null&&v.weight>0); const total=present.reduce((sum,v)=>sum+v.weight,0); if (!total) return null; if(present.length===1)return clamp(present[0].score!,0,100); return clamp(Math.exp(present.reduce((sum,v)=>sum+v.weight/total*Math.log(Math.max(epsilon,v.score!)),0)),0,100); }
export function stats(x: number[]): ReferenceStats|null { if(!x.length)return null; return {n:x.length,median:median(x)!,p01:quantile(x,.01)!,p05:quantile(x,.05)!,p10:quantile(x,.1)!,p25:quantile(x,.25)!,p75:quantile(x,.75)!,p90:quantile(x,.9)!,p95:quantile(x,.95)!,p99:quantile(x,.99)!,mad:mad(x)}; }
export function ranks(x: number[]) { const sorted=x.map((v,i)=>({v,i})).sort((a,b)=>a.v-b.v),out=new Array<number>(x.length); for(let i=0;i<sorted.length;){let j=i+1;while(j<sorted.length&&sorted[j].v===sorted[i].v)j++;for(let k=i;k<j;k++)out[sorted[k].i]=(i+j-1)/2+1;i=j}return out; }
export function pearson(a: number[],b:number[]) { if(a.length!==b.length||a.length<3)return null;const ma=mean(a)!,mb=mean(b)!;let numerator=0,va=0,vb=0;for(let i=0;i<a.length;i++){const x=a[i]-ma,y=b[i]-mb;numerator+=x*y;va+=x*x;vb+=y*y}return va>1e-12&&vb>1e-12?clamp(numerator/Math.sqrt(va*vb),-1,1):null; }
export const spearman=(a:number[],b:number[])=>pearson(ranks(a),ranks(b));
export function random(seed:string){let state=parseInt(hash(seed).slice(0,8),16);return()=>{state=(state+0x6D2B79F5)|0;let t=Math.imul(state^state>>>15,1|state);t^=t+Math.imul(t^t>>>7,61|t);return((t^t>>>14)>>>0)/4294967296};}
export function shuffled<T>(input:T[],seed:string){const a=[...input],rng=random(seed);for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a;}
export const percentile=(value:number,reference:number[])=>reference.length?reference.filter(x=>x<=value).length/reference.length:null;
export function calibratedScore(value:number|null,reference:ReferenceStats|null,thresholds:QualityConfig['reference']){const {minCalibrationN:minN,stableTailN:stableN,conservativeMadMultiplier,madFloor,tailTransitionFloor}=thresholds;if(value===null||!reference||reference.n<minN)return null;if(value>=reference.p10)return 100;const lower=Math.min(reference.p05-1e-6,reference.n>=stableN?reference.p01:reference.median-conservativeMadMultiplier*Math.max(reference.mad,madFloor));if(value>=reference.p05){return 70+30*(1-severity(value,reference.p10,reference.p05))}if(value<lower)return 30*(1-severity(value,lower,lower-Math.max(reference.mad, tailTransitionFloor)));return 30+40*(1-severity(value,reference.p05,lower));}
