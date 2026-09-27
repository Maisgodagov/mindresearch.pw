import type { SeedSection } from '../types.js';

const options=[
  {value:'1',label:'Very seldom or not true of me'},
  {value:'2',label:'2'},
  {value:'3',label:'3'},
  {value:'4',label:'4'},
  {value:'5',label:'Very often true, or true with me'},
];

const items=[
  'I delay making decisions until it’s too late.',
  'Even after I make a decision I delay acting upon it.',
  'I waste a lot of time on trivial matters before getting to the final decisions.',
  'In preparation for some deadlines, I often waste time by doing other things.',
  'Even jobs that require little else except sitting down and doing them, I find that they seldom get done for days.',
  'I often find myself performing tasks that I had intended to do days before.',
  'I am continually saying “I’ll do it tomorrow.”',
  'I generally delay before starting on work I have to do.',
  'I find myself running out of time.',
  'I don’t get things done on time.',
  'I am not very good at meeting deadlines.',
  'Putting things off till the last minute has cost me money in the past.',
];

export const ppsInstrument:SeedSection={
  code:'test_11',
  title:'Pure Procrastination Scale, PPS-12',
  description:'Original English 12-item scale by Piers Steel. Higher scores indicate a stronger procrastination tendency.',
  questions:items.map((text,index)=>({code:`test_11_${index+1}`,text,type:'single',required:true,options})),
};
