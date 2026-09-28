import type { SeedSection } from '../types.js';

const options=[
  {value:'1',label:'1 — полное несогласие'},
  {value:'2',label:'2'},
  {value:'3',label:'3'},
  {value:'4',label:'4 — нечто среднее'},
  {value:'5',label:'5'},
  {value:'6',label:'6'},
  {value:'7',label:'7 — полное согласие'},
];

const items=[
  'Открытого, полного энтузиазма.',
  'Критичного, склонного спорить.',
  'Надежного и дисциплинированного.',
  'Тревожного, меня легко расстроить.',
  'Открытого для нового опыта, сложного.',
  'Замкнутого, тихого.',
  'Сочувствующего, сердечного.',
  'Неорганизованного, беспечного.',
  'Спокойного, эмоционально устойчивого.',
  'Обыкновенного, не творческого.',
];

export const tipiRuInstrument:SeedSection={
  code:'test_14',title:'Краткий пятифакторный опросник личности, TIPI-RU',
  description:'Русская адаптация Ten-Item Personality Inventory: пять областей личности по двум пунктам.',
  questions:items.map((text,index)=>({code:`test_14_${index+1}`,text:`Я воспринимаю себя как ${text.toLocaleLowerCase('ru-RU')}`,type:'single',required:true,options})),
};
