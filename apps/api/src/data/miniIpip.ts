import type { SeedSection } from '../types.js';
import { ipipNeo120Options } from './ipipNeo120.js';

export const miniIpipItems=[
  'Am the life of the party.',
  'Sympathize with others’ feelings.',
  'Get chores done right away.',
  'Have frequent mood swings.',
  'Have a vivid imagination.',
  'Don’t talk a lot.',
  'Am not interested in other people’s problems.',
  'Often forget to put things back in their proper place.',
  'Am relaxed most of the time.',
  'Am not interested in abstract ideas.',
  'Talk to a lot of different people at parties.',
  'Feel others’ emotions.',
  'Like order.',
  'Get upset easily.',
  'Have difficulty understanding abstract ideas.',
  'Keep in the background.',
  'Am not really interested in others.',
  'Make a mess of things.',
  'Seldom feel blue.',
  'Do not have a good imagination.',
];

export const miniIpipInstrument:SeedSection={
  code:'test_16',
  title:'Краткий опросник Большой пятёрки, Mini-IPIP (англоязычная версия)',
  description:'Краткая общедоступная 20-пунктовая форма маркеров Большой пятёрки IPIP. Исходные пункты приведены на английском языке; русская адаптация не подтверждена.',
  questions:miniIpipItems.map((text,index)=>({code:`test_16_${index+1}`,text,type:'single',required:true,options:ipipNeo120Options})),
};
