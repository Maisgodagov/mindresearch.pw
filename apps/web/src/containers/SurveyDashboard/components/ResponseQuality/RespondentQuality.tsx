import { useEffect, useState, type ReactNode } from 'react';
﻿import { Popover } from 'antd';
import { CheckCircle2, CircleHelp, AlertTriangle, ChevronDown } from 'lucide-react';
import styled from 'styled-components';
import { METRICS, STATUS, metricValue, type Quality } from '../../quality';
import { COMPONENT_EXPLANATIONS, COMPONENT_METRIC_LABELS, ExplanationText, MetricExplanation } from './explanations';

const pct = (value: number | null | undefined) => value == null ? '—' : `${Math.round(value)}%`;
const number = (value: unknown) => typeof value === 'number' ? value.toLocaleString('ru-RU', {maximumFractionDigits:3}) : value == null ? '—' : String(value);
const domains = {speeding:'Скорость',fatigue:'Ускорение к концу',response_consistency:'Согласованность ответов',patterning:'Серии ответов',attention:'Проверки внимания',data:'Достаточность данных'};

function Help({label,children}:{label:string;children:ReactNode}) {
  const [open,setOpen]=useState(false);
  useEffect(()=>{if(!open)return;const close=(event:KeyboardEvent)=>{if(event.key==='Escape')setOpen(false);};document.addEventListener('keydown',close);return()=>document.removeEventListener('keydown',close);},[open]);
  return <Popover trigger="click" open={open} onOpenChange={setOpen} title={label} content={<div style={{maxWidth:'min(340px, calc(100vw - 48px))',fontSize:13,lineHeight:1.6}}>{children}</div>}><button type="button" className="quality-help" aria-expanded={open} aria-label={`Подробнее: ${label}`}><CircleHelp size={15}/></button></Popover>;
}

export function RespondentQuality({value}:{value:Quality|undefined}) {
  if(!value) return <Panel><p className="empty-quality">Качество пока не рассчитано. Оценки появятся после расчёта.</p></Panel>;
  const flags=value.overall.flags.filter(flag=>flag.severity!=='info');
  const infoFlags=value.overall.flags.filter(flag=>flag.severity==='info');
  const completeness=value.hard_checks.completeness;
  const patterns=value.response.metrics.patterns as Record<string,{title:string;run:number;entropy:number}>|undefined;
  const hasConcerns=flags.length>0||value.strong_flag_count>0||value.warning_flag_count>0||value.hard_checks.duplicate;
  const partial=value.overall.partial||value.behavioral.partial||value.response.partial;
  const dated=new Date(value.calculated_at);
  return <Panel aria-label="Оценка качества респондента">
    <div className={`quality-verdict ${hasConcerns?'has-concerns':''}`}>
      {hasConcerns?<AlertTriangle size={18}/>:value.overall.score==null?<CircleHelp size={18}/>:<CheckCircle2 size={18}/>}
      <div><strong>{hasConcerns?'Есть признаки для ручной проверки':value.overall.score==null?'Недостаточно данных для общей оценки':'Выраженные признаки проблем не выявлены'}</strong>
      <p>{hasConcerns?'Ознакомьтесь с причинами ниже перед отбором ответов.':value.overall.score==null?'Доступные показатели и причины пропусков — ниже.':'По доступным данным о поведении и ответах.'}</p></div>
      <Help label="Что означает оценка">Это эвристический индекс качества, а не вероятность честности. Высокий балл не гарантирует достоверность ответов, а низкий — повод проверить прохождение вручную.</Help>
    </div>
    <div className="quality-main">
      {([['behavioral','Поведение','Темп и последовательность прохождения'],['response','Ответы','Согласованность ответов и проверки внимания']] as const).map(([key,label,hint])=><div className="quality-domain" key={key}>
        <div className="domain-title"><strong>{label}</strong><MetricExplanation metric={key}/><small>{hint}</small></div>
        <div className="domain-result"><b>{pct(value[key].score)}</b><span className={`domain-status ${value[key].status}`}>{STATUS[value[key].status]}</span></div>
        <div className="domain-confidence">Уверенность {pct(value[key].confidence*100)}<Help label={`Уверенность: ${label.toLowerCase()}`}>Полнота и надёжность данных для этой оценки. Чем меньше пригодных измерений и доступных компонентов, тем ниже уверенность.{value[key].partial&&<p>Расчёт частичный: некоторые компоненты недоступны. Причины можно посмотреть в подробностях расчёта.</p>}</Help></div>
      </div>)}
    </div>
    <div className="quality-completeness"><span>Обязательные ответы <Help label="Полнота ответов">Учитываются корректные ответы: непустой текст, число или допустимый выбранный вариант. Полнота проверяется отдельно и не является штрафом индекса качества.</Help></span><strong>{completeness.answered} из {completeness.required}</strong>{partial&&<span className="partial-note">Частичный расчёт<Help label="Частичный расчёт">Не все компоненты удалось рассчитать. Доступные оценки сохранены; отсутствующие данные не считаются нулями. Подробности — в разделе «Показатели и расчёт».</Help></span>}</div>
    {hasConcerns&&<div className="quality-concerns">
      {value.hard_checks.duplicate&&<p className="quality-reason"><AlertTriangle size={15}/><span>Исследователем подтверждено повторное прохождение.</span></p>}
      {flags.map((flag,index)=><div className="quality-reason" key={flag.code+index}><span className={`reason-level ${flag.severity}`}>{flag.severity==='strong'?'Сильный признак':'Предупреждение'}</span><span>{flag.explanation}</span><Help label={domains[flag.domain]}>Значение: {number(flag.value)}. Порог: {number(flag.threshold)}. Признак не является автоматическим основанием для удаления ответов.</Help></div>)}
      {!flags.length&&!value.hard_checks.duplicate&&<p>Сильных признаков: {value.strong_flag_count}. Предупреждений: {value.warning_flag_count}. Подробности — в расчёте.</p>}
    </div>}
    <details className="quality-diagnostics"><summary>Показатели и расчёт<ChevronDown size={16}/></summary>
      <dl className="quality-metrics">{METRICS.slice(6).map(metric=><div key={metric.key}><dt>{metric.label}<MetricExplanation metric={metric.key}/></dt><dd>{number(metricValue(value,metric.key))} <small>{metric.unit}</small></dd></div>)}</dl>
      <details className="quality-secondary"><summary>Компоненты и причины отсутствия данных</summary>
        {(['behavioral','response'] as const).map(domain=><div key={domain}><h4>{domain==='behavioral'?'Поведение':'Ответы'}</h4>{Object.entries(value[domain].components).map(([key,component])=><div className="quality-component" key={key}><div><strong>{COMPONENT_EXPLANATIONS[key]?.label??key}</strong><span>{pct(component.score)} · уверенность {pct(component.confidence*100)}</span>{COMPONENT_EXPLANATIONS[key]&&<Help label={COMPONENT_EXPLANATIONS[key].label}><ExplanationText explanation={COMPONENT_EXPLANATIONS[key]}/></Help>}</div>{component.reason&&<p>{component.reason}</p>}<details><summary>Метрики компонента</summary><dl className="component-metrics">{Object.entries(component.metrics).filter(([,v])=>typeof v!=='object'||v===null).map(([name,v])=><div key={name}><dt>{COMPONENT_METRIC_LABELS[name]??name}</dt><dd>{number(v)}</dd></div>)}</dl></details></div>)}</div>)}
      </details>
      {patterns&&<details className="quality-secondary"><summary>Серии и разнообразие по блокам</summary><dl className="component-metrics">{Object.entries(patterns).map(([id,pattern])=><div key={id}><dt>{pattern.title}</dt><dd>Одинаковая серия: {pattern.run} · разнообразие: {number(pattern.entropy)}</dd></div>)}</dl><p>Разнообразие от 0 (один вариант) до 1 (равномерное использование вариантов).</p></details>}
      {infoFlags.length>0&&<details className="quality-secondary"><summary>Примечания к данным</summary>{infoFlags.map((flag,index)=><p key={flag.code+index}>{flag.explanation}</p>)}</details>}
      <details className="quality-secondary"><summary>Сведения о расчёте</summary><dl className="component-metrics"><div><dt>Общий индекс</dt><dd>{pct(value.overall.score)} · {STATUS[value.overall.status]}<MetricExplanation metric="overall"/></dd></div><div><dt>Уверенность общего индекса</dt><dd>{pct(value.overall.confidence*100)}<MetricExplanation metric="confidence"/></dd></div><div><dt>Алгоритм</dt><dd>{value.algorithm_version??'—'}</dd></div><div><dt>Эталон</dt><dd>{value.baseline_version??'Не сформирован'}</dd></div><div><dt>Рассчитано</dt><dd>{Number.isFinite(dated.getTime())?dated.toLocaleString('ru-RU'):'—'}</dd></div></dl></details>
    </details>
  </Panel>;
}

const Panel=styled.section`
  width:min(1000px, calc(100cqw - 96px));
  margin:0 0 0 64px;
  padding:18px 14px 16px;
  box-sizing:border-box;
  color:#304737; font-size:12px; line-height:1.5;
  p { margin:3px 0 0; color:#526557; }
  strong { font-weight:650; }
  .quality-help { display:inline-flex; justify-content:center; align-items:center; width:24px; height:24px; min-height:24px; padding:0; border:0; border-radius:4px; color:#52764b; background:transparent; cursor:pointer; flex:none; vertical-align:middle; }
  .quality-help:hover { background:#e8f0e3; }
  .quality-help:focus-visible, summary:focus-visible { outline:2px solid #52764b; outline-offset:2px; }
  .quality-verdict { display:flex; align-items:flex-start; gap:9px; margin-bottom:12px; }
  .quality-verdict > svg { color:#52764b; margin-top:2px; flex:none; }
  .quality-verdict > div { min-width:0; }
  .quality-verdict strong { font-size:13px; }
  .quality-verdict .quality-help { margin-left:0; }
  .has-concerns > svg { color:#8a6528; }
  .quality-main { border-top:1px solid #dfe7da; }
  .quality-domain { display:grid; grid-template-columns:minmax(200px,1fr) minmax(170px,.7fr) auto; align-items:center; gap:16px; padding:12px 0; border-bottom:1px solid #dfe7da; }
  .domain-title small { display:block; color:#526557; font-size:11px; }
  .domain-title > strong { font-size:13px; }
  .domain-result { display:flex; align-items:center; gap:10px; }
  .domain-result b { font-size:16px; font-weight:700; font-variant-numeric:tabular-nums; min-width:46px; }
  .domain-status { font-size:11px; color:#466841; }
  .domain-status.review { color:#82612b; }
  .domain-status.high_concern { color:#974d37; }
  .domain-status.insufficient_data { color:#586653; }
  .domain-confidence { color:#526557; font-size:11px; white-space:nowrap; }
  .quality-completeness { display:flex; align-items:center; flex-wrap:wrap; gap:4px 12px; padding:10px 0; }
  .quality-completeness > span:first-child { color:#526557; }
  .partial-note { display:inline-flex; align-items:center; margin-left:auto; color:#76602b; font-size:11px; }
  .quality-concerns { padding:2px 0 12px; }
  .quality-reason { display:flex; gap:8px; align-items:flex-start; padding:7px 0; }
  .reason-level { flex:none; font-size:10px; padding:2px 6px; border-radius:4px; background:#f4eddf; color:#7b5e28; }
  .reason-level.strong { color:#8b4736; background:#f5e7e2; }
  summary { cursor:pointer; color:#415e44; font-weight:600; padding:8px 0; }
  .quality-diagnostics { border-top:1px solid #dfe7da; }
  .quality-diagnostics > summary { display:flex; align-items:center; gap:8px; list-style:none; font-size:12px; }
  .quality-diagnostics > summary::-webkit-details-marker { display:none; }
  .quality-diagnostics > summary svg { transition:transform .15s ease; }
  .quality-diagnostics[open] > summary svg { transform:rotate(180deg); }
  .quality-metrics { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:0 24px; margin:4px 0 14px; }
  .quality-metrics > div { display:flex; justify-content:space-between; gap:10px; align-items:center; border-bottom:1px solid #e6ebe2; padding:8px 0; }
  dt { color:#526557; }
  dd { margin:0; font-weight:600; font-variant-numeric:tabular-nums; }
  dd small { font-weight:400; color:#526557; }
  .quality-secondary { border-top:1px solid #e3e9de; }
  .quality-secondary > summary { font-size:11px; }
  h4 { font-size:12px; margin:12px 0 4px; }
  .quality-component { padding:8px 0; }
  .quality-component > div { display:flex; align-items:center; flex-wrap:wrap; gap:8px; }
  .quality-component summary { font-size:11px; font-weight:400; }
  .component-metrics { margin:8px 0 12px; }
  .component-metrics > div { display:flex; justify-content:space-between; gap:20px; padding:6px 0; border-bottom:1px solid #e6ebe2; }
  .component-metrics dd { text-align:right; overflow-wrap:anywhere; max-width:65%; }
  @media(max-width:700px) { .quality-domain { grid-template-columns:1fr auto; gap:4px 12px; } .domain-confidence { grid-column:1 / -1; } .quality-metrics { grid-template-columns:1fr; } }
  @media(max-width:560px) { width:calc(100cqw - 48px); margin-left:36px; padding:14px 8px; .domain-title small { max-width:22ch; } .domain-result { align-items:flex-end; flex-direction:column; gap:0; } .domain-status { max-width:100px; text-align:right; white-space:normal; } .partial-note { margin-left:0; flex-basis:100%; } }
`;
