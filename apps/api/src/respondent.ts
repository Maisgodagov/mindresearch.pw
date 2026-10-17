export const RESPONDENT_GENDER_OPTIONS = [
  {value:'female',label:'Женский'},
  {value:'male',label:'Мужской'},
  {value:'not_specified',label:'Предпочитаю не указывать'},
];

export function respondentQuestions(meta: {collectAlias?:boolean;collectAge?:boolean;collectGender?:boolean} = {}) {
  return [
    ...(meta.collectAlias !== false ? [{id:'respondent-alias',code:'alias',text:'Представьтесь или укажите псевдоним',type:'text' as const,required:true,options:[],sectionTitle:'О респонденте',validation:{excludeFromQuality:true}}] : []),
    ...(meta.collectAge !== false ? [{id:'respondent-age',code:'age',text:'Ваш возраст',type:'number' as const,required:true,options:[],sectionTitle:'О респонденте',validation:{min:1,max:120,excludeFromQuality:true}}] : []),
    ...(meta.collectGender !== false ? [{id:'respondent-gender',code:'gender',text:'Ваш пол',type:'single' as const,required:true,options:RESPONDENT_GENDER_OPTIONS,sectionTitle:'О респонденте',validation:{excludeFromQuality:true}}] : []),
  ];
}
