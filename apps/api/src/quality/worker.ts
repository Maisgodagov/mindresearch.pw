import { parentPort } from 'node:worker_threads';
import { createBaseline } from './baseline.js';
import { calculateV2 } from './engine.js';
import { datasetDiagnostics } from './diagnostics.js';
import type { Baseline, Item, Participant } from './types.js';
parentPort?.on('message',(message:{task:string;surveyId:string;items:Item[];people:Participant[];baseline:Baseline|null;highQualityIds?:string[]})=>{
  try{
    if(message.task==='baseline'){parentPort!.postMessage({type:'result',value:createBaseline(message.surveyId,message.items,message.people,undefined,message.highQualityIds)});return;}
    const results:Record<string,ReturnType<typeof calculateV2>>={};const completed=message.people.filter(p=>p.status==='completed');for(const[index,person]of completed.entries()){results[person.id]=calculateV2(person,message.items,message.baseline);parentPort!.postMessage({type:'progress',done:index+1,total:completed.length})}
    parentPort!.postMessage({type:'result',value:{results,diagnostics:message.task==='calculate_subset'?null:datasetDiagnostics(message.items,message.people,results,message.baseline?.config)}});
  }catch(error){parentPort!.postMessage({type:'error',message:error instanceof Error?error.message:String(error)})}
});
