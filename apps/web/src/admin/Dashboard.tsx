import { Fragment, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BarChart3, CheckCircle2, ChevronDown, ChevronRight, Clock3, Copy, Info, Leaf, LogOut, Users, X } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api } from '../api';
import { Button, Card, Page } from '../ui';

type SurveyRow={id:string;slug:string;title:string;responses:number;completed:number};
type Answer={code:string;question:string;value:unknown;displayValue:string};
type SectionResult={formulaVersion:string;values:Record<string,unknown>;interpretation:unknown};
type ScoreValue={label:string;score:number;maxScore:number;level:string;levelLabel:string};
type SspmValues={instrument:string;complete:true;answered:number;overall:ScoreValue;scales:Record<string,ScoreValue>};
type SccsValues={instrument:string;complete:true;answered:number;average:number;sum:number;min:number;max:number;reference:{mean:number;standardDeviation:number;zScore:number;sampleSize:number}};
type MspssScore={label:string;score:number;min:1;max:7;level:string;levelLabel:string;items:number[]};
type MspssValues={instrument:string;complete:true;answered:number;overall:MspssScore;scales:Record<string,MspssScore>};
type Methodology={code:string;title:string;version:string;summary:string;steps:string[];keys?:{label:string;value:string}[];norms?:{label:string;value:string}[];notes:string[];sources:{title:string;url:string}[]};
type AnswerGroup={id:string;code:string;title:string;position:number;result:SectionResult|null;answers:Answer[]};
type Respondent={id:string;alias:string;status:'in_progress'|'completed'|'abandoned';startedAt:string;lastActivityAt:string;completedAt:string|null;answered:number;groups:AnswerGroup[]};
type Result={respondents:Respondent[];distribution:{code:string;text:string;value:string|number;count:number}[]};

const Wrap=styled.div`width:min(100% - 32px,1400px);margin:auto;padding-bottom:60px`;
const Header=styled.header`display:flex;align-items:center;justify-content:space-between;padding:26px 0;.brand{display:flex;gap:10px;align-items:center;font-weight:800;color:#496452}button{border:0;background:none;color:#68776d}`;
const Grid=styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:16px;@media(max-width:700px){grid-template-columns:1fr}`;
const Stat=styled(Card)`padding:22px;display:flex;gap:15px;align-items:center;b{display:block;font-size:28px;color:#31493a}span{color:#758178;font-size:13px}`;
const Panel=styled(Card)`padding:24px;margin-top:18px;overflow:hidden;h2{font:500 24px Georgia,serif;margin:0 0 20px}.toolbar{display:flex;gap:12px;justify-content:space-between;align-items:center;flex-wrap:wrap}.link{padding:10px 13px;background:#edf2eb;border-radius:12px;color:#496452;font-size:13px}`;
const TableWrap=styled.div`overflow:auto;margin:0 -24px -24px;padding:0 24px 24px`;
const Table=styled.table`width:100%;min-width:1050px;border-collapse:collapse;margin-top:10px;th,td{text-align:left;padding:13px 10px;border-bottom:1px solid #edf0eb;font-size:13px;vertical-align:top}th{color:#78837b;font-weight:650;white-space:nowrap}.person{display:flex;align-items:center;gap:8px;font-weight:700;font-size:14px}.expand{border:0;background:#edf2eb;color:#526f5b;width:28px;height:28px;border-radius:9px;display:grid;place-items:center}.pill{display:inline-block;padding:5px 9px;border-radius:20px;background:#e7efe5;color:#4e6b56;font-size:12px}.pending{display:block;color:#879188;font-size:12px;max-width:120px}.score{font-weight:700;color:#3e6049}`;
const Details=styled.div`padding:18px 8px 8px;display:grid;gap:10px`;
const Group=styled.div`border:1px solid #e0e7df;border-radius:15px;overflow:hidden;background:#fbfcfa`;
const GroupButton=styled.button`width:100%;border:0;background:transparent;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;text-align:left;color:#354b3c;font-weight:700;.count{font-size:12px;font-weight:500;color:#819086;margin-left:auto;margin-right:12px}`;
const Answers=styled.div`padding:0 16px 12px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 24px;@media(max-width:760px){grid-template-columns:1fr}`;
const AnswerRow=styled.div`padding:11px 0;border-top:1px solid #edf1ec;.q{color:#77847b;font-size:12px;line-height:1.35}.a{color:#2f4235;font-size:14px;margin-top:4px}`;
const ResultBox=styled.div`margin:0 16px 12px;padding:12px;border-radius:12px;background:#edf3eb;color:#45604d;font-size:13px`;
const ScoreProfile=styled.div`display:grid;gap:14px;margin-top:16px;.scale{display:grid;grid-template-columns:minmax(140px,210px) 1fr 42px;gap:12px;align-items:center}.name{color:#435a49}.value{text-align:right;font-weight:800;font-size:16px}.track{height:22px;border-radius:7px;position:relative;overflow:hidden;background:repeating-linear-gradient(90deg,#eef1ed 0,#eef1ed calc(11.111% - 1px),#fff calc(11.111% - 1px),#fff 11.111%)}.fill{height:100%;border-radius:7px;background:#64876d;transition:width .35s}.limits{grid-column:2;display:flex;justify-content:space-between;color:#849087;font-size:11px;margin-top:-10px}.level{grid-column:2 / 4;color:#6f7e73;font-size:11px;margin-top:-8px}@media(max-width:700px){.scale{grid-template-columns:1fr 38px}.name{grid-column:1 / 3}.limits{grid-column:1}.level{grid-column:1 / 3}}`;
const Metrics=styled.div`display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:12px;@media(max-width:650px){grid-template-columns:1fr}.metric{background:#f7faf6;border:1px solid #dce7da;border-radius:12px;padding:12px}.metric b{display:block;font-size:20px;margin-bottom:3px}.metric span{color:#77847b;font-size:12px}`;
const SupportProfile=styled.div`display:grid;gap:14px;margin-top:16px;.scale{display:grid;grid-template-columns:minmax(150px,230px) 1fr 50px;gap:12px;align-items:center}.name{color:#435a49}.value{text-align:right;font-weight:800;font-size:16px}.track{height:22px;border-radius:7px;overflow:hidden;background:repeating-linear-gradient(90deg,#eef1ed 0,#eef1ed calc(14.286% - 1px),#fff calc(14.286% - 1px),#fff 14.286%)}.fill{height:100%;border-radius:7px;background:#64876d}.caption{grid-column:2 / 4;color:#6f7e73;font-size:11px;margin-top:-9px}@media(max-width:700px){.scale{grid-template-columns:1fr 45px}.name{grid-column:1 / 3}.caption{grid-column:1 / 3}}`;
const MethodButton=styled.button`margin-top:12px;border:1px solid #cbd9cc;background:#fff;color:#526f5b;border-radius:10px;padding:8px 11px;display:inline-flex;align-items:center;gap:7px;font-weight:650;font-size:12px`;
const Overlay=styled.div`position:fixed;inset:0;background:rgba(25,38,29,.48);z-index:20;display:grid;place-items:center;padding:18px;backdrop-filter:blur(3px)`;
const Modal=styled.div`width:min(760px,100%);max-height:90dvh;overflow:auto;background:#fff;border-radius:22px;padding:clamp(22px,5vw,36px);box-shadow:0 30px 100px rgba(20,35,25,.25);position:relative;color:#304036;.close{position:absolute;right:18px;top:18px;border:0;background:#edf2eb;width:36px;height:36px;border-radius:10px;display:grid;place-items:center}h2{font:500 28px Georgia,serif;margin:0 45px 8px 0}.version{color:#89948c;font-size:12px}h3{font-size:15px;margin:24px 0 10px}p,li{line-height:1.55;font-size:14px}.key{padding:10px 0;border-top:1px solid #edf1ec}.key b{display:block;margin-bottom:3px}.note{background:#f2f5f0;border-radius:12px;padding:11px 13px}.sources{display:grid;gap:8px}.sources a{color:#456d50;text-decoration:underline;text-underline-offset:3px}`;

const methodCodes=['test_1','test_2','test_3','test_4','test_5','test_6'];
const shortNames:Record<string,string>={test_1:'MSPSS',test_2:'ССПМ-2011',test_3:'SCCS',test_4:'NSPS',test_5:'ШОПП',test_6:'DEBQ'};

function MethodResult({group}:{group?:AnswerGroup}){
  if(!group?.result)return <span className="pending">Расчёт не настроен</span>;
  if(group.code==='test_1'){const result=group.result.values as unknown as MspssValues;return <span className="score">{result.overall.score.toFixed(2)} / 7<br/><small>{result.overall.levelLabel}</small></span>}
  if(group.code==='test_2'){const result=group.result.values as unknown as SspmValues;return <span className="score">{result.overall.score} / {result.overall.maxScore}<br/><small>{result.overall.levelLabel}</small></span>}
  if(group.code==='test_3'){const result=group.result.values as unknown as SccsValues;return <span className="score">{result.average.toFixed(2)} / 5<br/><small>сумма {result.sum} / 60</small></span>}
  return <span className="pending">Результат рассчитан</span>;
}

function DetailedResult({group}:{group:AnswerGroup}){
  if(!group.result)return <>Формула и интерпретация будут добавлены позже</>;
  if(group.code==='test_1'){const result=group.result.values as unknown as MspssValues;return <><b>{result.overall.label}: {result.overall.score.toFixed(2)} из 7 — {result.overall.levelLabel.toLowerCase()}</b><SupportProfile>{Object.values(result.scales).map(scale=><div className="scale" key={scale.label}><span className="name">{scale.label}</span><div className="track"><div className="fill" style={{width:`${scale.score/scale.max*100}%`}}/></div><span className="value">{scale.score.toFixed(2)}</span><div className="caption">{scale.levelLabel} · ориентиры: &lt;3 низкая, 3–5 умеренная, &gt;5 высокая</div></div>)}</SupportProfile></>}
  if(group.code==='test_2'){const result=group.result.values as unknown as SspmValues;return <><b>{result.overall.label}: {result.overall.score} из {result.overall.maxScore} — {result.overall.levelLabel.toLowerCase()}</b><ScoreProfile>{Object.values(result.scales).map(scale=>{const middle=scale.label==='Программирование'||scale.label==='Гибкость'?{from:5,to:7}:{from:4,to:6};return <div className="scale" key={scale.label}><span className="name">{scale.label}</span><div className="track"><div className="fill" style={{width:`${scale.score/scale.maxScore*100}%`}}/></div><span className="value">{scale.score}</span><div className="limits"><span>0</span><span>средний: {middle.from}–{middle.to}</span><span>9</span></div><div className="level">{scale.levelLabel}</div></div>})}</ScoreProfile></>}
  if(group.code==='test_3'){const result=group.result.values as unknown as SccsValues;const direction=result.reference.zScore===0?'на уровне среднего':result.reference.zScore>0?`на ${result.reference.zScore.toFixed(2)} SD выше среднего`:`на ${Math.abs(result.reference.zScore).toFixed(2)} SD ниже среднего`;return <><b>Ясность Я-концепции: {result.average.toFixed(2)} из 5</b><Metrics><div className="metric"><b>{result.average.toFixed(2)}</b><span>средний балл, основной показатель</span></div><div className="metric"><b>{result.sum} / 60</b><span>суммарный балл</span></div><div className="metric"><b>{result.reference.zScore.toFixed(2)} SD</b><span>{direction}; M={result.reference.mean}, N={result.reference.sampleSize}</span></div></Metrics></>}
  return <>Результат рассчитан</>;
}

function MethodologyModal({methodology,onClose}:{methodology:Methodology;onClose:()=>void}){return <Overlay onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><Modal role="dialog" aria-modal="true" aria-label={`Расчёт: ${methodology.title}`}><button className="close" aria-label="Закрыть" onClick={onClose}><X size={18}/></button><h2>{methodology.title}</h2><div className="version">Версия расчёта: {methodology.version}</div><p>{methodology.summary}</p><h3>Порядок расчёта</h3><ol>{methodology.steps.map(step=><li key={step}>{step}</li>)}</ol>{methodology.keys?.length&&<><h3>Ключ</h3>{methodology.keys.map(item=><div className="key" key={item.label}><b>{item.label}</b><span>{item.value}</span></div>)}</>}{methodology.norms?.length&&<><h3>Нормативы</h3>{methodology.norms.map(item=><div className="key" key={item.label}><b>{item.label}</b><span>{item.value}</span></div>)}</>}<h3>Важные замечания</h3>{methodology.notes.map(note=><p className="note" key={note}>{note}</p>)}<h3>Источники</h3><div className="sources">{methodology.sources.map(source=><a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title}</a>)}</div></Modal></Overlay>}

function RespondentDetails({respondent,methodologies,onShowMethodology}:{respondent:Respondent;methodologies:Record<string,Methodology>;onShowMethodology:(methodology:Methodology)=>void}){
  const[open,setOpen]=useState<Record<string,boolean>>({});
  return <Details>{respondent.groups.map(group=><Group key={group.code}><GroupButton onClick={()=>setOpen(x=>({...x,[group.code]:!x[group.code]}))}><span>{group.title}</span><span className="count">{group.answers.length} ответов</span>{open[group.code]?<ChevronDown size={18}/>:<ChevronRight size={18}/>}</GroupButton>{open[group.code]&&<>{group.code!=='respondent'&&<ResultBox><DetailedResult group={group}/>{methodologies[group.code]&&<MethodButton onClick={()=>onShowMethodology(methodologies[group.code])}><Info size={14}/> Как считается</MethodButton>}</ResultBox>}<Answers>{group.answers.map(answer=><AnswerRow key={answer.code}><div className="q">{answer.question}</div><div className="a">{answer.displayValue}</div></AnswerRow>)}</Answers></>}</Group>)}</Details>;
}

export function Dashboard(){
  const nav=useNavigate();
  const[surveys,setSurveys]=useState<SurveyRow[]>([]);
  const[result,setResult]=useState<Result>({respondents:[],distribution:[]});
  const[selectedQuestion,setSelectedQuestion]=useState('');
  const[expanded,setExpanded]=useState<Record<string,boolean>>({});
  const[methodologies,setMethodologies]=useState<Record<string,Methodology>>({});
  const[activeMethodology,setActiveMethodology]=useState<Methodology|null>(null);
  useEffect(()=>{api.get('/admin/surveys').then(async r=>{setSurveys(r.data);if(r.data[0]){const x=await api.get(`/admin/surveys/${r.data[0].id}/results`);setResult(x.data)}}).catch(()=>nav('/admin/login'))},[nav]);
  useEffect(()=>{api.get('/admin/methodologies').then(r=>setMethodologies(r.data)).catch(()=>{})},[]);
  const survey=surveys[0];
  const questions=useMemo(()=>[...new Map(result.distribution.map(x=>[x.code,x.text])).entries()],[result]);
  useEffect(()=>{if(!selectedQuestion&&questions[0])setSelectedQuestion(questions[0][0])},[questions,selectedQuestion]);
  const chart=result.distribution.filter(x=>x.code===selectedQuestion).map(x=>({answer:String(x.value).replace(/^"|"$/g,''),count:x.count}));
  const completed=result.respondents.filter(x=>x.status==='completed').length;
  return <Page><Wrap><Header><div className="brand"><Leaf/> mindresearch · кабинет</div><button aria-label="Выйти" onClick={()=>{localStorage.removeItem('admin_token');nav('/admin/login')}}><LogOut size={18}/></button></Header><h1>{survey?.title??'Исследование'}</h1><Grid><Stat><Users/><div><b>{result.respondents.length}</b><span>всего участников</span></div></Stat><Stat><CheckCircle2/><div><b>{completed}</b><span>завершили</span></div></Stat><Stat><Clock3/><div><b>{result.respondents.length?Math.round(completed/result.respondents.length*100):0}%</b><span>завершаемость</span></div></Stat></Grid>
  <Panel><div className="toolbar"><h2>Ссылка для участников</h2><Button onClick={()=>navigator.clipboard.writeText(`${location.origin}/s/${survey?.slug}`)}><Copy size={16}/> Скопировать</Button></div><div className="link">{location.origin}/s/{survey?.slug}</div></Panel>
  <Panel><h2>Результаты респондентов</h2><TableWrap><Table><thead><tr><th>Респондент</th><th>Статус</th><th>Ответы</th>{methodCodes.map(code=><th key={code}>{shortNames[code]}</th>)}<th>Начато</th></tr></thead><tbody>{result.respondents.map(person=><Fragment key={person.id}><tr><td><div className="person"><button className="expand" aria-label="Показать ответы" onClick={()=>setExpanded(x=>({...x,[person.id]:!x[person.id]}))}>{expanded[person.id]?<ChevronDown size={17}/>:<ChevronRight size={17}/>}</button>{person.alias}</div></td><td><span className="pill">{person.status==='completed'?'Завершена':'В процессе'}</span></td><td>{person.answered} / 208</td>{methodCodes.map(code=><td key={code}><MethodResult group={person.groups.find(g=>g.code===code)}/></td>)}<td>{new Date(person.startedAt).toLocaleDateString('ru')}</td></tr>{expanded[person.id]&&<tr><td colSpan={10}><RespondentDetails respondent={person} methodologies={methodologies} onShowMethodology={setActiveMethodology}/></td></tr>}</Fragment>)}</tbody></Table></TableWrap></Panel>
  <Panel><div className="toolbar"><h2><BarChart3 size={20}/> Распределение ответов</h2><select value={selectedQuestion} onChange={e=>setSelectedQuestion(e.target.value)}>{questions.map(([code,text])=><option key={code} value={code}>{text}</option>)}</select></div><div style={{height:300,marginTop:20}}><ResponsiveContainer><BarChart data={chart}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="answer" tick={{fontSize:11}}/><YAxis allowDecimals={false}/><Tooltip/><Bar dataKey="count" fill="#6e8e76" radius={[7,7,0,0]}/></BarChart></ResponsiveContainer></div></Panel>
  {activeMethodology&&<MethodologyModal methodology={activeMethodology} onClose={()=>setActiveMethodology(null)}/>}</Wrap></Page>;
}
