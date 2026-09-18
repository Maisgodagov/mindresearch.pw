import type { Worksheet } from 'exceljs';

type Answer={code:string;question:string;displayValue:string};
type Group={code:string;title:string;result:{values:Record<string,unknown>}|null;answers:Answer[]};
export type ExportRespondent={id:string;alias:string;status:string;startedAt:string;lastActivityAt:string;completedAt:string|null;answered:number;groups:Group[]};

const date=(input:string|null)=>input?new Date(input).toLocaleString('ru-RU'):'';
const cellValue=(input:unknown)=>typeof input==='number'?input:typeof input==='string'?input:'';

function styleSheet(sheet:Worksheet,widths:number[]){
  sheet.views=[{state:'frozen',ySplit:1}];
  sheet.autoFilter={from:{row:1,column:1},to:{row:1,column:sheet.columnCount}};
  sheet.getRow(1).eachCell(cell=>{cell.font={bold:true,color:{argb:'FFFFFFFF'}};cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF587462'}};cell.alignment={vertical:'middle',wrapText:true}});
  sheet.getRow(1).height=30;
  widths.forEach((width,index)=>{sheet.getColumn(index+1).width=width});
  sheet.eachRow((row,rowNumber)=>{if(rowNumber>1)row.eachCell(cell=>{cell.alignment={vertical:'top',wrapText:true}})});
}

export async function exportRespondents(respondents:ExportRespondent[]){
  const {default:ExcelJS}=await import('exceljs');
  const workbook=new ExcelJS.Workbook();
  workbook.creator='mindresearch';
  workbook.created=new Date();

  const summary=workbook.addWorksheet('Респонденты');
  summary.addRow(['Псевдоним','Статус','Ответов','Начато','Последняя активность','Завершено']);
  respondents.forEach(person=>summary.addRow([person.alias,person.status==='completed'?'Завершена':'В процессе',person.answered,date(person.startedAt),date(person.lastActivityAt),date(person.completedAt)]));
  styleSheet(summary,[24,16,12,21,21,21]);

  const scores=workbook.addWorksheet('Результаты методик');
  scores.addRow(['Псевдоним','Методика','Показатель','Значение','Максимум','Уровень / интерпретация','Ориентир','Отклонение']);
  respondents.forEach(person=>person.groups.filter(group=>group.result).forEach(group=>{
    const values=group.result!.values as any;
    if(values.overall)scores.addRow([person.alias,group.title,values.overall.label??'Общий показатель',cellValue(values.overall.score??values.overall.average),cellValue(values.overall.maxScore??values.overall.max),values.overall.levelLabel??values.overall.interpretation??'',cellValue(values.overall.referenceMean),cellValue(values.overall.difference)]);
    if(values.scales)Object.values(values.scales as Record<string,any>).forEach(scale=>scores.addRow([person.alias,group.title,scale.label,cellValue(scale.score??scale.average),cellValue(scale.maxScore??scale.max),scale.levelLabel??scale.interpretation??'',cellValue(scale.referenceMean),cellValue(scale.difference)]));
    if(group.code==='test_3'){
      scores.addRow([person.alias,group.title,'Средний балл',cellValue(values.average),cellValue(values.max),'','',cellValue(values.reference?.zScore)]);
      scores.addRow([person.alias,group.title,'Суммарный балл',cellValue(values.sum),60,'','','']);
    }
  }));
  styleSheet(scores,[24,30,34,14,14,28,14,14]);

  const answers=workbook.addWorksheet('Все ответы');
  answers.addRow(['Псевдоним','Раздел / методика','Код вопроса','Вопрос','Ответ']);
  respondents.forEach(person=>person.groups.forEach(group=>group.answers.forEach(answer=>answers.addRow([person.alias,group.title,answer.code,answer.question,answer.displayValue]))));
  styleSheet(answers,[24,30,18,70,35]);

  const buffer=await workbook.xlsx.writeBuffer();
  const blob=new Blob([buffer],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a');
  link.href=url;
  link.download=`mindresearch-results-${new Date().toISOString().slice(0,10)}.xlsx`;
  link.click();
  URL.revokeObjectURL(url);
}
