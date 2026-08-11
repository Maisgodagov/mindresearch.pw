import fs from 'node:fs';

const md = fs.readFileSync('anketi.md', 'utf8').replace(/\r/g, '');
const lines = md.split('\n').map(x => x.trim());
const names = ['Многомерная шкала восприятия социальной поддержки, MSPSS','Стиль саморегуляции поведения, ССПМ-2011','Шкала ясности Я-концепции, SCCS','Шкала негативного образа себя, NSPS','Шкала оценки пищевого поведения, ШОПП','Голландский опросник пищевого поведения, DEBQ'];
const counts = [12,52,12,27,51,33];
const sections = [];
for (let s=1;s<=6;s++) {
  const start=lines.indexOf(`${s} опрос.`), end=s<6?lines.indexOf(`${s+1} опрос.`):lines.length;
  const chunk=lines.slice(start,end);
  const marker=chunk.indexOf('№');
  const scale=[];
  for(const line of chunk.slice(0,marker)) { const m=line.match(/^(\d+)\s*[–-]\s*(.+)$/); if(m) scale.push({value:m[1],label:m[2]}); }
  const body=chunk.slice(marker+1);
  let first=-1;
  for(let i=scale.length;i<body.length-1;i++) if(body[i]==='1'){ first=i; break; }
  const questions=[];
  let current=[], expected=1;
  for(let i=first;i<body.length;i++) {
    if(body[i].startsWith('Представленный бланк')) break;
    if(/^\d+$/.test(body[i]) && Number(body[i])===expected) {
      if(current.length) { questions.push(current.join(' ')); current=[]; }
      expected++;
    } else if(body[i]) current.push(body[i]);
  }
  if(current.length) questions.push(current.join(' '));
  if(questions.length!==counts[s-1]) throw new Error(`Section ${s}: expected ${counts[s-1]}, got ${questions.length}`);
  sections.push({code:`test_${s}`,title:names[s-1],questions:questions.map((text,i)=>({code:`test_${s}_${i+1}`,text,type:'single',options:scale}))});
}
const o=(...labels)=>labels.map((label,i)=>({value:String(i+1),label}));
const respondent={code:'respondent',title:'О вас',description:'Несколько вопросов о вашей жизненной ситуации',questions:[
  {code:'alias',text:'Укажите любое вымышленное имя для обозначения анкеты',type:'text',validation:{maxLength:100}},
  {code:'age',text:'Ваш возраст',type:'number',validation:{min:18,max:100}},
  {code:'relationship',text:'Ваш семейный статус',type:'single',options:o('Не состою в отношениях','В отношениях, не проживаем вместе','В зарегистрированном браке','В гражданском браке (сожительство)','Разведена','В процессе развода','Вдова','Другое')},
  {code:'living',text:'С кем вы в настоящее время проживаете',type:'single',options:o('Одна','С партнёром / супругом','С родителями','С другими родственниками','С детьми (без партнёра)','С партнёром и детьми','С друзьями / соседями','Другое')},
  {code:'education',text:'Уровень образования',type:'single',options:o('Среднее общее','Среднее профессиональное','Неоконченное высшее','Высшее','Магистратура / аспирантура','Другое')},
  {code:'employment',text:'Ваша текущая занятость',type:'single',options:o('Работаю на полной занятости','Работаю на частичной занятости','Учусь','Временно не работаю','В отпуске по уходу за ребёнком','Другое')},
  {code:'children',text:'Есть ли у вас дети',type:'single',options:o('Нет','Да, один ребёнок','Да, двое детей','Да, трое и более детей')},
  {code:'material',text:'Оцените своё материальное положение',type:'single',options:o('Низкое','Скорее ниже среднего','Среднее','Скорее выше среднего','Высокое')},
  {code:'financial_independence',text:'Насколько вы финансово самостоятельны',type:'single',options:o('Полностью самостоятельна','Скорее самостоятельна','Частично зависима от других','В основном зависима от других','Полностью зависима от других')},
  ...[
    ['financial_help','К кому вы можете обратиться за финансовой помощью в трудной ситуации',o('К партнёру / супругу','К родителям','К другим родственникам','К друзьям','К коллегам','К государственным / социальным службам','Не к кому обратиться','Другое')],
    ['emotional_help','К кому вы можете обратиться за эмоциональной (психологической) поддержкой',o('К партнёру / супругу','К родителям','К другим родственникам','К друзьям','К коллегам','К психологу / психотерапевту','К онлайн-сообществам','Не к кому обратиться','Другое')],
    ['household_help','К кому вы можете обратиться за помощью в бытовых вопросах',o('К партнёру / супругу','К родителям','К другим родственникам','К друзьям','К соседям','К платным специалистам','Не к кому обратиться','Другое')],
    ['illness_help','К кому вы можете обратиться за помощью в случае болезни',o('К партнёру / супругу','К родителям','К другим родственникам','К друзьям','К коллегам','К медицинским службам','Не к кому обратиться','Другое')]
  ].map(([code,text,options])=>({code,text,type:'multiple',options})),
  {code:'main_support',text:'Кто является для вас основным источником поддержки в трудных ситуациях',type:'single',options:o('Партнёр / супруг','Родители','Другие родственники','Друзья','Коллеги','Психолог / психотерапевт','Никто','Другое')},
  {code:'leisure_person',text:'Есть ли у вас человек, с которым вы можете проводить свободное время, отдыхать и получать положительные эмоции от общения?',type:'single',options:o('Да, несколько человек','Да, один человек','Скорее нет','Нет')},
  {code:'ask_frequency',text:'Как часто вы обращаетесь за помощью к близким, когда испытываете трудности?',type:'single',options:o('Никогда','Редко','Иногда','Часто','Очень часто')},
  {code:'support_satisfaction',text:'Насколько вы удовлетворены поддержкой, которую получаете от окружающих?',type:'single',options:o('Совершенно не удовлетворена','Скорее не удовлетворена','Затрудняюсь ответить','Скорее удовлетворена','Полностью удовлетворена')},
  {code:'nobody_frequency',text:'Как часто вы чувствуете, что вам не к кому обратиться за помощью?',type:'single',options:o('Никогда','Редко','Иногда','Часто','Очень часто')},
  {code:'cope_alone',text:'Как часто вам приходится справляться с трудными жизненными ситуациями без посторонней помощи?',type:'single',options:o('Никогда','Редко','Иногда','Часто','Очень часто')},
  {code:'discuss_difficulties',text:'Насколько вам свойственно обсуждать трудности с другими людьми?',type:'single',options:o('Совершенно не свойственно','Скорее не свойственно','Затрудняюсь ответить','Скорее свойственно','Полностью свойственно')},
  {code:'sharing_person',text:'Есть ли у вас человек, с которым вы можете делиться личными переживаниями и чувствовать понимание?',type:'single',options:o('Да','Скорее да','Скорее нет','Нет')}
]};
fs.writeFileSync('apps/api/src/data/survey.json', JSON.stringify([respondent,...sections],null,2));
console.log(`Generated ${[respondent,...sections].reduce((n,s)=>n+s.questions.length,0)} questions`);
