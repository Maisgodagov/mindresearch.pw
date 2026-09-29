import type { SeedSection } from '../types.js';

const options=[
  {value:'1',label:'1 — совсем нет'},
  {value:'2',label:'2 — скорее нет, чем да'},
  {value:'3',label:'3 — ни да ни нет'},
  {value:'4',label:'4 — скорее да, чем нет'},
  {value:'5',label:'5 — да'},
];

type Aspect={key:string;label:string;items:[string,boolean][]};
const aspects:Aspect[]=[
  {key:'enthusiasm',label:'Энтузиазм',items:[
    ['Легко заводите друзей',false],['С трудом знакомитесь',true],['Держите других «на расстоянии»',true],['Мало рассказываете о себе',true],['Быстро проникаетесь к другим людям',false],['Трудно удивить',true],['Не очень восторженный человек',true],['Показываете другим свою радость',false],['Много веселитесь',false],['Много смеетесь',false],
  ]},
  {key:'assertiveness',label:'Ассертивность',items:[
    ['Берете ответственность',false],['Имеете сильный характер',false],['Нет таланта влиять на окружающих',true],['Умеете очаровывать людей',false],['Ждете инициативы от других',true],['Считаете себя хорошим лидером',false],['Можете уговорить других что-то сделать',false],['Держите свое мнение при себе',true],['Действуете первым',false],['Легко вникаете в суть',false],
  ]},
  {key:'compassion',label:'Сострадание',items:[
    ['Безразличны к проблемам окружающих',true],['Чувствуете эмоции других',false],['Интересуетесь благополучием других',false],['Безразличны к потребностям окружающих',true],['Сопереживаете другим',false],['Безразличны чувства других людей',true],['Не тратите время на других людей',true],['Заинтересованы жизнью других людей',false],['Нельзя назвать добродушным',true],['Нравится делать что-то для других',false],
  ]},
  {key:'politeness',label:'Вежливость',items:[
    ['Уважаете власть и авторитет',false],['Оскорбляете людей',true],['Ненавидите казаться назойливым',false],['Считаете себя лучше других',true],['Не навязываете свою волю другим',false],['Редко «давите» на людей',false],['Используете других в своих интересах',true],['Конфликтный человек',true],['Любите поспорить',true],['Личная выгода превыше всего',true],
  ]},
  {key:'industriousness',label:'Трудолюбие',items:[
    ['Выполняете свои планы',false],['Впустую тратите свое свободное время',true],['Тяжело приступаете к работе',true],['Все «валится из рук»',true],['Доводите начатое до конца',false],['Не концентрируетесь на необходимой к выполнению задаче',true],['Делаете дела быстро',false],['Всегда знаете, что делаете',false],['Откладываете принятие решений',true],['Легко отвлекаетесь',true],
  ]},
  {key:'orderliness',label:'Прилежность',items:[
    ['Часто разбрасываете вещи',true],['Любите порядок',false],['Держите вещи опрятными',false],['Следуете распорядку',false],['Спокойно относитесь к неаккуратным людям',true],['Хотите, чтобы все было правильно',false],['Не беспокоитесь из-за беспорядка',true],['Не любите рутину',true],['Следите за соблюдением правил',false],['Хотите, чтобы все было продумано до мелочей',false],
  ]},
  {key:'volatility',label:'Волатильность',items:[
    ['Легко рассердить',false],['Редко раздражаетесь',true],['Легко расстраиваетесь',false],['Держите свои эмоции под контролем',true],['Часто меняете настроение',false],['Редко теряете самообладание',true],['Частые перепады настроения',false],['Тяжело задеть',true],['Легко взбудоражить',false],['Легко спровоцировать',false],
  ]},
  {key:'withdrawal',label:'Раздражительность',items:[
    ['Редко грустите',true],['Полны сомнений',false],['Комфортно с самим собой',true],['Легко напугать',false],['Редко чувствуете себя подавленным',true],['Часто беспокоитесь',false],['Легко обескуражить',false],['Нелегко смутить',true],['Можно ошеломить происходящим',false],['Многого боитесь',false],
  ]},
  {key:'intellect',label:'Интеллект',items:[
    ['Легко вникаете в суть',false],['С трудом понимаете абстрактные идеи',true],['Можете обрабатывать много информации',false],['Любите решать сложные задачи',false],['Избегаете философских рассуждений',true],['Избегаете чтения сложных текстов',true],['Имеете богатый словарный запас',false],['Быстро соображаете',false],['Медленно учитесь новому',true],['Четко формулируете свои мысли',false],
  ]},
  {key:'openness',label:'Открытость',items:[
    ['Видите красоту в природе',false],['Верите в важность искусства',false],['Любите раздумывать о разном',false],['Глубоко погружаетесь в музыку',false],['Не любите поэзию',true],['Видите красоту в вещах, которую другие могут не заметить',false],['Нуждаетесь в творческом проявлении',false],['Редко погружаетесь в свои мысли',true],['Редко мечтаете',true],['Редко обращаете внимание на эмоциональные составляющие рисунков и картин',true],
  ]},
];

const items=aspects.flatMap(aspect=>aspect.items);
export const bfasRuInstrument:SeedSection={
  code:'test_31',title:'10 аспектов «Большой пятёрки», BFAS — русская адаптация',
  description:'Русскоязычная адаптация Big Five Aspects Scale: 100 утверждений, 10 аспектов и пять доменов. Адаптация проверена на российской выборке (N=495); пункты и реверсивность воспроизведены по приложению публикации.',
  questions:items.map(([text],index)=>({code:`test_31_${index+1}`,text:`Вы бы сказали про себя, что ${text.toLocaleLowerCase('ru-RU')}.`,type:'single',required:true,options})),
};

export const bfasRuScoring={
  min:1,max:5,
  scales:[
    ...aspects.map((aspect,index)=>({key:aspect.key,label:aspect.label,items:Array.from({length:10},(_,i)=>index*10+i+1),reverseItems:aspect.items.flatMap(([_,reverse],i)=>reverse?[index*10+i+1]:[]),aggregation:'mean' as const})),
    {key:'extraversion',label:'Экстраверсия',items:[...Array.from({length:20},(_,i)=>i+1)],reverseItems:aspects.slice(0,2).flatMap((a,ai)=>a.items.flatMap(([_,reverse],i)=>reverse?[ai*10+i+1]:[])),aggregation:'mean' as const},
    {key:'agreeableness',label:'Доброжелательность',items:Array.from({length:20},(_,i)=>i+21),reverseItems:aspects.slice(2,4).flatMap((a,ai)=>a.items.flatMap(([_,reverse],i)=>reverse?[(ai+2)*10+i+1]:[])),aggregation:'mean' as const},
    {key:'conscientiousness',label:'Добросовестность',items:Array.from({length:20},(_,i)=>i+41),reverseItems:aspects.slice(4,6).flatMap((a,ai)=>a.items.flatMap(([_,reverse],i)=>reverse?[(ai+4)*10+i+1]:[])),aggregation:'mean' as const},
    {key:'neuroticism',label:'Нейротизм',items:Array.from({length:20},(_,i)=>i+61),reverseItems:aspects.slice(6,8).flatMap((a,ai)=>a.items.flatMap(([_,reverse],i)=>reverse?[(ai+6)*10+i+1]:[])),aggregation:'mean' as const},
    {key:'openness_domain',label:'Открытость опыту',items:Array.from({length:20},(_,i)=>i+81),reverseItems:aspects.slice(8,10).flatMap((a,ai)=>a.items.flatMap(([_,reverse],i)=>reverse?[(ai+8)*10+i+1]:[])),aggregation:'mean' as const},
  ],
};

export const bfasRuValidationCases=[
  {title:'Нейтральные ответы',answers:Object.fromEntries(Array.from({length:100},(_,i)=>[String(i+1),3])),expected:Object.fromEntries(bfasRuScoring.scales.map(scale=>[scale.key,3]))},
  {title:'Минимальные ответы с обратным кодированием',answers:Object.fromEntries(Array.from({length:100},(_,i)=>[String(i+1),1])),expected:Object.fromEntries(bfasRuScoring.scales.map(scale=>[scale.key,(scale.items.length+4*scale.reverseItems.length)/scale.items.length]))},
];
