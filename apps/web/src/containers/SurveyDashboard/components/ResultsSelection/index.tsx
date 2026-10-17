import {useState} from 'react';
import {Select as MultiSelect, Switch} from 'antd';
import {Plus, X, Users, ArrowDownWideNarrow, RotateCcw} from 'lucide-react';
import {Button} from '../../../../ui';
import {SelectField} from '../../../../components/SelectField';
import {FieldInput} from '../../../../components/FieldInput';
import type {QualityView} from '../../quality';
import type {Result} from '../../types';
import type {SampleCondition} from '../../selection';
import {distributionQuestionKey} from '../AnswerDistribution/questionKey';
import {SelectionSurface} from './styles';

export type SampleDraft = {question:string;labels:string[];range?:{min:string;max:string}};
type Props = {
  view:QualityView; onSort:(view:QualityView)=>void; sortOptions:{value:string;label:string}[];
  conditions:SampleCondition[]; onApply:(draft:SampleDraft)=>Promise<boolean>; onRemove:(question:string)=>void; onClear:()=>void;
  questions:NonNullable<Result['questions']>; distribution:Result['distribution']; hasAge:boolean;
  visible:number;total:number;busy:boolean;
};
export function ResultsSelection({view,onSort,sortOptions,conditions,onApply,onRemove,onClear,questions,distribution,hasAge,visible,total,busy}:Props){
  const [open,setOpen]=useState(false),[question,setQuestion]=useState(''),[labels,setLabels]=useState<string[]>([]),[min,setMin]=useState(''),[max,setMax]=useState(''),[mode,setMode]=useState('range'),[error,setError]=useState('');
  const numeric=question==='__age'||questions.find(q=>q.questionId===question)?.type==='number';
  const configuredOptions=questions.find(q=>q.questionId===question)?.options;
  const values=[...new Set(configuredOptions?.length?configuredOptions.map(option=>option.label):distribution.filter(row=>distributionQuestionKey(row)===question).map(row=>row.label??String(row.value)))];
  const options=[...(hasAge?[{value:'__age',label:'Возраст респондента'}]:[]),...questions.map(q=>({value:q.questionId,label:q.text}))];
  const selectQuestion=(key:string)=>{setQuestion(key);setLabels([]);setMin('');setMax('');setMode('range');setError('');};
  const edit=(condition:SampleCondition)=>{setQuestion(condition.question);setLabels(condition.labels);setMin(condition.range?.min??'');setMax(condition.range?.max??'');setMode(condition.range?'range':'answers');setOpen(true);setError('');};
  const submit=async()=>{
    if(!question)return;
    const range=numeric&&(mode==='range'||question==='__age');
    if(range&&((!min.trim()&&!max.trim())||(min.trim()&&!Number.isFinite(Number(min)))||(max.trim()&&!Number.isFinite(Number(max)))||(min.trim()&&max.trim()&&Number(min)>Number(max)))){setError('Укажите корректный диапазон: «от» не должно быть больше «до». Можно заполнить только одну границу.');return;}
    setError('');
    if(await onApply({question,labels:range?[]:labels,...(range?{range:{min,max}}:{})})){setOpen(false);selectQuestion('');}
  };
  const description=(c:SampleCondition)=>c.range?c.range.min&&c.range.max?`${c.range.min}–${c.range.max}`:c.range.min?`от ${c.range.min}`:`до ${c.range.max}`:c.labels.join(' или ');
  const alphabetical=['alias','gender','status'].includes(view.sort);
  const basicSortOptions=[{value:'newest',label:'По дате · свежие сверху'},{value:'oldest',label:'По дате · старые сверху'},...sortOptions.filter(option=>['alias','gender','status','answered','duration','age'].includes(option.value))];
  return <SelectionSurface aria-label="Выборка и сортировка">
    <div className="selection-heading"><div className="selection-title"><Users size={18} aria-hidden="true"/><h2>Выборка</h2><span role="status"><strong>{visible}</strong> из {total}</span></div><div className="selection-actions">{conditions.length>0&&<button className="text-action" type="button" onClick={onClear}><RotateCcw size={14} aria-hidden="true"/>Сбросить выборку</button>}<Button onClick={()=>{setOpen(!open);setError('');}} aria-expanded={open} aria-controls="sample-editor"><Plus size={15}/>Добавить условие</Button></div></div>
    {conditions.length===0?<p className="selection-hint">{view.status==='completed'?'Только завершённые прохождения.':'Все респонденты.'} Сузьте выборку по возрасту или ответам на вопросы.</p>:<><div className="sample-chips" aria-label="Условия выборки">{conditions.map((condition,i)=><div className="condition-item" key={condition.question}>{i>0&&<span className="condition-and">и</span>}<div className="sample-chip"><button type="button" onClick={()=>edit(condition)} aria-label={`Изменить условие: ${condition.title}`}><strong>{condition.title}</strong><span>{description(condition)}</span></button><button type="button" className="remove-condition" aria-label={`Убрать условие: ${condition.title}`} onClick={()=>onRemove(condition.question)}><X size={14}/></button></div></div>)}</div><p className="selection-hint">Все условия применяются одновременно. Нажмите на условие, чтобы изменить его.</p></>}
    {open&&<div id="sample-editor" className="sample-editor"><div className="editor-heading"><h3>Условие выборки</h3><button className="text-action" type="button" aria-label="Закрыть условие" onClick={()=>setOpen(false)}><X size={16}/></button></div><div className="editor-fields"><div className="sample-field"><span>По чему отбирать</span><SelectField aria-label="Вопрос для выборки" value={question||undefined} options={options} placeholder="Возраст или вопрос опроса" showSearch onChange={value=>selectQuestion(String(value))}/></div>
    {question&&<div className="sample-field"><span>{numeric?'Значения':'Ответы — любой из выбранных'}</span>{numeric&&question!=='__age'&&<div className="value-mode"><button type="button" aria-pressed={mode==='range'} onClick={()=>setMode('range')}>Диапазон</button><button type="button" aria-pressed={mode==='answers'} onClick={()=>setMode('answers')}>Ответы</button></div>}{numeric&&(mode==='range'||question==='__age')?<div className="range-fields"><FieldInput type="number" aria-label="Возраст или значение от" placeholder="От" value={min} onChange={e=>setMin(e.target.value)}/><span>—</span><FieldInput type="number" aria-label="Возраст или значение до" placeholder="До" value={max} onChange={e=>setMax(e.target.value)}/></div>:<MultiSelect className="sample-answer-select" aria-label="Ответы для выборки" mode="multiple" maxTagCount="responsive" value={labels} options={values.map(value=>({value,label:value||'Пустой ответ'}))} onChange={setLabels} placeholder="Выберите ответы" allowClear optionFilterProp="label" notFoundContent="На этот вопрос ещё нет ответов"/>}</div>}</div>
    {error&&<p className="sample-error" role="alert">{error}</p>}<div className="editor-actions"><span>Новое условие сузит текущую выборку.</span><Button type="primary" loading={busy} disabled={busy||!question||(!numeric&&!labels.length)||(numeric&&mode==='answers'&&question!=='__age'&&!labels.length)} onClick={()=>void submit()}>Применить условие</Button></div></div>}
    {busy&&<p className="selection-hint" role="status">Обновляем выборку…</p>}
    {visible===0&&(conditions.length>0||view.status==='completed')&&<p className="sample-empty" role="status">Никто не соответствует всем условиям. Измените или уберите одно из них.</p>}
    <div className="sample-sort"><ArrowDownWideNarrow size={16} aria-hidden="true"/><span>Сортировка</span><SelectField aria-label="Сортировка результатов" value={basicSortOptions.some(option=>option.value===view.sort)?view.sort:undefined} placeholder="По столбцу таблицы" options={basicSortOptions} onChange={value=>onSort({...view,sort:value as QualityView['sort']})}/>{!['newest','oldest'].includes(view.sort)&&<button type="button" className="text-action" onClick={()=>onSort({...view,direction:view.direction==='asc'?'desc':'asc'})}>{alphabetical?(view.direction==='asc'?'А → Я':'Я → А'):(view.direction==='asc'?'По возрастанию':'По убыванию')}</button>}<label className="completed-toggle"><Switch size="small" checked={view.status==='completed'} aria-label="Только завершённые" onChange={checked=>onSort({...view,status:checked?'completed':'all'})}/><span>Только завершённые</span></label></div>
  </SelectionSurface>;
}
