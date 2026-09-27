import type { SeedSection } from '../types.js';

const options=[
  {value:'1',label:'Does not correspond at all'},{value:'2',label:'2'},{value:'3',label:'3'},
  {value:'4',label:'Corresponds moderately'},{value:'5',label:'5'},{value:'6',label:'6'},
  {value:'7',label:'Corresponds exactly'},
];
const items=[
  'Because with only a high-school degree I would not find a high-paying job later on.',
  'Because I experience pleasure and satisfaction while learning new things.',
  'Because I think that a college education will help me better prepare for the career I have chosen.',
  'For the intense feelings I experience when I am communicating my own ideas to others.',
  "Honestly, I don't know; I really feel that I am wasting my time in school.",
  'For the pleasure I experience while surpassing myself in my studies.',
  'To prove to myself that I am capable of completing my college degree.',
  'In order to obtain a more prestigious job later on.',
  'For the pleasure I experience when I discover new things never seen before.',
  'Because eventually it will enable me to enter the job market in a field that I like.',
  'For the pleasure that I experience when I read interesting authors.',
  'I once had good reasons for going to college; however, now I wonder whether I should continue.',
  'For the pleasure that I experience while I am surpassing myself in one of my personal accomplishments.',
  'Because of the fact that when I succeed in college I feel important.',
  'Because I want to have “the good life” later on.',
  'For the pleasure that I experience in broadening my knowledge about subjects which appeal to me.',
  'Because this will help me make a better choice regarding my career orientation.',
  'For the pleasure that I experience when I feel completely absorbed by what certain authors have written.',
  "I can't see why I go to college and frankly, I couldn't care less.",
  'For the satisfaction I feel when I am in the process of accomplishing difficult academic activities.',
  'To show myself that I am an intelligent person.',
  'In order to have a better salary later on.',
  'Because my studies allow me to continue to learn about many things that interest me.',
  'Because I believe that a few additional years of education will improve my competence as a worker.',
  'For the “high” feeling that I experience while reading about various interesting subjects.',
  "I don't know; I can't understand what I am doing in school.",
  'Because college allows me to experience a personal satisfaction in my quest for excellence in my studies.',
  'Because I want to show myself that I can succeed in my studies.',
];
export const amsInstrument:SeedSection={
  code:'test_8',title:'Academic Motivation Scale, AMS-C 28',
  description:'Official English College Version. Why do you go to college? For research purposes only.',
  questions:items.map((text,index)=>({code:`test_8_${index+1}`,text,type:'single',required:true,options})),
};
