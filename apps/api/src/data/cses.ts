import type { SeedSection } from '../types.js';

export const csesOptions=[
  {value:'1',label:'Strongly disagree'},
  {value:'2',label:'Disagree'},
  {value:'3',label:'Neutral'},
  {value:'4',label:'Agree'},
  {value:'5',label:'Strongly agree'},
];

export const csesItems=[
  'I am confident I get the success I deserve in life.',
  'Sometimes I feel depressed.',
  'When I try, I generally succeed.',
  'Sometimes when I fail I feel worthless.',
  'I complete tasks successfully.',
  'Sometimes, I do not feel in control of my work.',
  'Overall, I am satisfied with myself.',
  'I am filled with doubts about my competence.',
  'I determine what will happen in my life.',
  'I do not feel in control of my success in my career.',
  'I am capable of coping with most of my problems.',
  'There are times when things look pretty bleak and hopeless to me.',
];

export const csesInstrument:SeedSection={
  code:'test_18',
  title:'Шкала базовых самооценок, CSES (англоязычный оригинал)',
  description:'Оригинальная непатентованная англоязычная 12-пунктовая шкала базовых самооценок. Пункты приведены на английском языке; русская адаптация не подтверждена.',
  questions:csesItems.map((text,index)=>({code:`test_18_${index+1}`,text,type:'single',required:true,options:csesOptions})),
};
