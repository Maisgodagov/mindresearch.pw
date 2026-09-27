import type { SeedSection } from '../types.js';

const options=[
  {value:'1',label:'Extremely Uncharacteristic'},
  {value:'2',label:'Moderately Uncharacteristic'},
  {value:'3',label:'Neutral'},
  {value:'4',label:'Moderately Characteristic'},
  {value:'5',label:'Extremely Characteristic'},
];

const items=[
  'I often find myself performing tasks that I had intended to do days before.',
  'I do not do assignments until just before they are to be handed in.',
  "When I am finished with a library book, I return it right away regardless of the date it is due.",
  'When it is time to get up in the morning, I most often get right out of bed.',
  'A letter may sit for days after I write it before mailing it.',
  'I generally return phone calls promptly.',
  'Even with jobs that require little else except sitting down and doing them, I find they seldom get done for days.',
  'I usually make decisions as soon as possible.',
  'I generally delay before starting on work I have to do.',
  'I usually have to rush to complete a task on time.',
  'When preparing to go out, I am seldom caught having to do something at the last minute.',
  'In preparing for some deadline, I often waste time by doing other things.',
  'I prefer to leave early for an appointment.',
  'I usually start an assignment shortly after it is assigned.',
  'I often have a task finished sooner than necessary.',
  'I always seem to end up shopping for birthday or Christmas gifts at the last minute.',
  'I usually buy even an essential item at the last minute.',
  'I usually accomplish all the things I plan to do in a day.',
  'I am continually saying: “I’ll do it tomorrow.”',
  'I usually take care of all the tasks I have to do before I settle down and relax for the evening.',
];

export const gpsInstrument:SeedSection={
  code:'test_10',
  title:'General Procrastination Scale, GPS — Student Form',
  description:'Original English 20-item student form by Clarry H. Lay. Higher scores indicate a stronger general tendency to procrastinate.',
  questions:items.map((text,index)=>({code:`test_10_${index+1}`,text,type:'single',required:true,options})),
};
