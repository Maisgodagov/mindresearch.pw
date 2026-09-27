export const demoUser={id:'demo',name:'Евгения',email:'mgodagov@vk.com',role:'researcher',bio:'Психолог и исследователь. Изучаю пищевое поведение, отношение к себе и саморегуляцию.',avatarUrl:'',publicSlug:'evgeniya',isProfilePublic:false};
export const demoSurveys=[{id:'demo-survey',slug:'anketa',title:'Анкета',status:'active',responses:24,completed:18,description:'Исследование пищевого поведения и саморегуляции'},{id:'demo-draft',slug:'wellbeing',title:'Самочувствие и поддержка',status:'draft',responses:0,completed:0,description:'Черновик нового исследования'}];
export const demoInstruments=[
  {id:'test-1',code:'test_1',title:'MSPSS — многомерная шкала социальной поддержки',description:'Оценка воспринимаемой поддержки семьи, друзей и значимых людей.',questionCount:12,isVerified:true,scoringCode:'test_1',author:'Gregory Zimet, Nancy Dahlem, Sara Zimet, Gordon Farley'},
  {id:'test-2',code:'test_2',title:'ССПМ-2011',description:'Стиль саморегуляции поведения.',questionCount:52,isVerified:true,scoringCode:'test_2',author:'В. И. Моросанова, Н. Г. Кондратюк'},
  {id:'test-3',code:'test_3',title:'Шкала ясности Я-концепции, SCCS',description:'Ясность и устойчивость представления человека о себе.',questionCount:12,isVerified:true,scoringCode:'test_3',author:'Jennifer Campbell и соавторы'},
  {id:'test-4',code:'test_4',title:'NSPS',description:'Негативный образ себя и социальная тревога.',questionCount:27,isVerified:true,scoringCode:'test_4',author:'David Moscovitch, Keith Huyder'},
  {id:'test-5',code:'test_5',title:'ШОПП',description:'Семь аспектов пищевого поведения и отношения к телу.',questionCount:51,isVerified:true,scoringCode:'test_5',author:'David Garner, Marion Olmsted, Janet Polivy'},
  {id:'test-6',code:'test_6',title:'DEBQ',description:'Ограничительное, эмоциогенное и экстернальное пищевое поведение.',questionCount:33,isVerified:true,scoringCode:'test_6',author:'Tatjana van Strien и соавторы'},
  {id:'test-7',code:'test_7',title:'Шкала академической мотивации, ШАМ',description:'Семь типов академической мотивации студентов.',questionCount:28,isVerified:true,scoringCode:'test_7',author:'Т. О. Гордеева, О. А. Сычев, Е. Н. Осин'},
];
export {methodologies as demoMethodologies} from '../../../api/src/scoring/methodologies';
