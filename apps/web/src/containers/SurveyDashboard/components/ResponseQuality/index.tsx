import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button } from '../../../../ui';
import { api } from '../../../../api';
import { DEFAULT_QUALITY_VIEW, METRICS, metricValue, COHORTS, STATUS, type Quality, type QualityView, type MetricKey } from '../../quality';
import type { Respondent } from '../../types';
const Surface = styled.section`
  min-width:0; padding:12px 0; color:#26392d; white-space:normal;
  h2 { margin:0 0 10px; font-size:18px; } h3 { font-size:14px; margin:10px 0; }
  p, summary, li { font-size:12px; line-height:1.6; }
  p { color:#526557; margin:8px 0; max-width:95ch; } summary { cursor:pointer; font-weight:650; }
  .overview, .controls, .rule { display:flex; flex-wrap:wrap; gap:8px 14px; align-items:end; margin:10px 0; }
  .overview span { font-size:12px; } label { display:grid; gap:5px; font-size:12px; font-weight:600; min-width:0; }
  select, input { box-sizing:border-box; max-width:100%; min-height:36px; border:1px solid #cbd9cc; border-radius:8px; background:white; color:#26392d; padding:7px 10px; font:inherit; }
  select:focus-visible, input:focus-visible { outline:2px solid #52764b; outline-offset:2px; }
  .rule input { width:100px; } button { min-height:36px; } .indices { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; margin:12px 0; }
  .index { border:1px solid #d6e1d6; border-radius:10px; padding:12px; } .index b { font-size:24px; display:block; } .index small { display:block; margin-top:5px; line-height:1.5; }
  .metrics { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; } dt { font-size:11px; color:#526557; } dd { margin:4px 0 0; font-size:13px; font-weight:650; }
  .scroll { overflow:auto; max-height:420px; } table { border-collapse:collapse; font-size:12px; width:100%; } th, td { text-align:left; padding:8px; border-bottom:1px solid #e3ebe2; white-space:nowrap; } .error { color:#8b332d; } .flags { padding-left:18px; }
  @media(max-width:700px) { .metrics { grid-template-columns:repeat(2,minmax(0,1fr)); } .indices { grid-template-columns:1fr; } .index b { font-size:20px; } }
  @media(max-width:560px) { .controls > label { flex:1 1 135px; } .rule > label:first-child { flex:1 1 100%; } }
`;
export const percent = (v: number | null | undefined) => v == null ? '—' : Math.round(v) + '%';
export const fasterText = (v: number | null) => v === null ? 'Нет данных для сравнения' : Math.abs(v)<.5 ? 'Сопоставимый темп' : v>0 ? 'На '+Math.round(v)+'% быстрее' : 'На '+Math.round(-v)+'% медленнее';
const display = (v: unknown) => typeof v==='number' ? Number(v.toFixed(3)).toString() : v==null ? '—' : String(v);
export function QualityOverview({people,qualities}:{people:Respondent[];qualities:Record<string,Quality>}) {
  const values=people.filter(p=>p.status==='completed').flatMap(p=>qualities[p.id]?[qualities[p.id]]:[]);
  return <Surface><h2>Качество прохождения · V2</h2>
    <p>Индексы качества являются эвристическими средствами скрининга. Они оценивают признаки невнимательного или необычного прохождения, но не устанавливают достоверность личности, пола или правдивость ответов.</p>
    <div className="overview"><span>Рассчитано: <b>{values.length}</b></span><span>Частичные: <b>{values.filter(q=>q.overall.partial).length}</b></span><span>Два независимых домена сильных признаков: <b>{values.filter(q=>q.independent_concerning_domains>=2).length}</b></span></div>
    <p>Недостающие показатели не считаются нулём. Результаты не исключаются автоматически; eligibility и подтверждённые дубликаты оцениваются отдельно.</p>
  </Surface>;
}
export function QualityControls({view,onChange,visible,total}:{view:QualityView;onChange:(v:QualityView)=>void;visible:number;total:number}) {
  const options=(obj:Record<string,string>)=>Object.entries(obj).map(([key,label])=><option key={key} value={key}>{label}</option>);
  return <Surface><details><summary>Фильтры и сортировка качества</summary><div className="controls">
    <label>Сортировка<select aria-label="Сортировка" value={view.sort} onChange={e=>onChange({...view,sort:e.target.value as QualityView['sort']})}><option value="newest">Свежие сверху</option><option value="oldest">Старые сверху</option><option value="insufficient">Сначала недостаточно данных</option>{METRICS.map(m=><option key={m.key} value={m.key}>{m.label}</option>)}</select></label>
    <label>Порядок<select aria-label="Порядок" value={view.direction} disabled={['newest','oldest','insufficient'].includes(view.sort)} onChange={e=>onChange({...view,direction:e.target.value as 'asc'|'desc'})}><option value="asc">По возрастанию</option><option value="desc">По убыванию</option></select></label>
    <label>Прохождение<select aria-label="Прохождение" value={view.status} onChange={e=>onChange({...view,status:e.target.value})}><option value="all">Все</option><option value="completed">Завершено</option><option value="in_progress">В процессе</option></select></label>
    <label>Статус качества<select aria-label="Статус качества" value={view.qualityStatus} onChange={e=>onChange({...view,qualityStatus:e.target.value})}><option value="all">Все</option>{options(STATUS)}</select></label>
    <label>Когорта<select aria-label="Когорта" value={view.cohort} onChange={e=>onChange({...view,cohort:e.target.value})}><option value="all">Все</option>{options(COHORTS)}</select></label>
    <label>Eligibility<select aria-label="Eligibility" value={view.eligibility} onChange={e=>onChange({...view,eligibility:e.target.value})}>{options({all:'Все',unknown:'Не проверено',pass:'Соответствует',fail:'Не соответствует'})}</select></label>
    <label>Данные V2<select aria-label="Данные V2" value={view.available} onChange={e=>onChange({...view,available:e.target.value})}>{options({all:'Все',present:'Индекс рассчитан',missing:'Нет индекса'})}</select></label>
    <label>Телеметрия<select aria-label="Телеметрия" value={view.telemetry} onChange={e=>onChange({...view,telemetry:e.target.value})}>{options({all:'Все',present:'Есть измерения',missing:'Нет измерений'})}</select></label>
    <Button onClick={()=>onChange({...view,filters:[...view.filters,{metric:'overall',operator:'lte',value:''}]})}>Добавить условие</Button>
    <Button onClick={()=>onChange({...DEFAULT_QUALITY_VIEW,filters:[]})}>Сбросить всё</Button>
  </div>{view.filters.map((f,i)=><div className="rule" key={i}>
    <label>Показатель<select aria-label="Показатель" value={f.metric} onChange={e=>onChange({...view,filters:view.filters.map((v,n)=>n===i?{...v,metric:e.target.value as MetricKey}:v)})}>{METRICS.map(m=><option key={m.key} value={m.key}>{m.label}</option>)}</select></label>
    <label>Условие<select aria-label="Условие" value={f.operator} onChange={e=>onChange({...view,filters:view.filters.map((v,n)=>n===i?{...v,operator:e.target.value as typeof f.operator}:v)})}><option value="lte">Не больше</option><option value="gte">Не меньше</option><option value="missing">Нет данных</option></select></label>
    {f.operator!=='missing'&&<label>Значение ({METRICS.find(m=>m.key===f.metric)?.unit})<input type="number" step="any" value={f.value} onChange={e=>onChange({...view,filters:view.filters.map((v,n)=>n===i?{...v,value:e.target.value}:v)})}/></label>}
    <Button onClick={()=>onChange({...view,filters:view.filters.filter((_,n)=>n!==i)})}>Убрать</Button>
  </div>)}</details><p aria-live="polite">Показано {visible} из {total}. Отсутствующие значения при сортировке находятся внизу.</p></Surface>;
}
export function QualityDetails({value}:{value:Quality|undefined}) {
  if(!value)return <Surface><p>V2 ещё не рассчитана. Запустите пересчёт; старый индекс не используется.</p></Surface>;
  const patterns=value.response.metrics.patterns as Record<string,{title:string;run:number;entropy:number}>|undefined;
  return <Surface><div className="indices">{([['overall','Общий индекс'],['behavioral','Поведенческий индекс'],['response','Качество ответов']] as const).map(([key,label])=><div className="index" key={key}><h3>{label}</h3><b>{percent(value[key].score)}</b><small>{STATUS[value[key].status]} · уверенность {percent(value[key].confidence*100)}{value[key].partial?' · частичный расчёт':''}</small></div>)}</div>
    <p>Это индекс, а не вероятность честности. Baseline: {value.baseline_version??'не сформирована'} · алгоритм {value.algorithm_version} · рассчитано {new Date(value.calculated_at).toLocaleString('ru')}.</p>
    <dl className="metrics">{METRICS.slice(6).map(m=><div key={m.key}><dt>{m.label}</dt><dd>{display(metricValue(value,m.key))} {m.unit}</dd></div>)}</dl>
    <h3>Отдельные проверки</h3><p>Когорта: {COHORTS[value.cohort as keyof typeof COHORTS]??value.cohort}. Eligibility: {value.hard_checks.eligibility}{value.hard_checks.eligibility_reason?' — '+value.hard_checks.eligibility_reason:''}. Подтверждённый дубликат: {value.hard_checks.duplicate?'да':'нет'}. Обязательные ответы: {value.hard_checks.completeness.answered}/{value.hard_checks.completeness.required}.</p>
    <details><summary>Компоненты и причины отсутствия данных</summary>{(['behavioral','response'] as const).map(domain=><div key={domain}><h3>{domain==='behavioral'?'Поведение':'Ответы'}</h3><ul>{Object.entries(value[domain].components).map(([key,c])=><li key={key}>{key}: {percent(c.score)} · уверенность {percent(c.confidence*100)}{c.reason?' — '+c.reason:''}<details><summary>Метрики компонента</summary><dl className="metrics">{Object.entries(c.metrics).filter(([,v])=>typeof v!=='object'||v===null).map(([k,v])=><div key={k}><dt>{k}</dt><dd>{display(v)}</dd></div>)}</dl></details></li>)}</ul></div>)}</details>
    {patterns&&<details><summary>Серии и разнообразие по блокам</summary><ul>{Object.entries(patterns).map(([id,p])=><li key={id}>{p.title}: одинаковая серия {p.run}, entropy {display(p.entropy)}</li>)}</ul></details>}
    <h3>Признаки для ручной проверки</h3>{value.overall.flags.length?<ul className="flags">{value.overall.flags.map((f,i)=><li key={f.code+i}><b>{f.severity==='strong'?'Сильный':f.severity==='warning'?'Предупреждение':'Информация'} · {f.domain}</b>: {f.explanation} (значение {display(f.value)}, порог {display(f.threshold)})</li>)}</ul>:<p>Признаки не выявлены в доступных данных.</p>}
  </Surface>;
}
type Settings = { enabled:boolean; baseline:{version:string;source:string;n:number;created_at:string}|null; versions:{id:string;createdAt:string}[]; jobs:{id:string;status:string;progress:number;total:number;error:string|null}[] };
export function QualityAdministration({surveyId,selectedIds,onUpdated}:{surveyId:string;selectedIds:string[];onUpdated:()=>Promise<void>}) {
  const [settings,setSettings]=useState<Settings|null>(null),[error,setError]=useState(''),[busy,setBusy]=useState(false),[report,setReport]=useState<any>(null),[cohort,setCohort]=useState('public'),[trusted,setTrusted]=useState(false),[eligibility,setEligibility]=useState('unknown'),[reason,setReason]=useState(''),[duplicate,setDuplicate]=useState(false),[reference,setReference]=useState(''),[version,setVersion]=useState('');
  useEffect(()=>{
    let live=true,previous:string|null=null;
    const load=async()=>{try{const r=await api.get('/admin/surveys/'+surveyId+'/quality-v2');if(!live)return;setSettings(r.data);const stamp=r.data.jobs?.filter((j:any)=>j.status==='completed').map((j:any)=>j.id).join(',');if(previous!==null&&stamp!==previous)await onUpdated();previous=stamp;}catch(e){if(live)setError('Не удалось загрузить настройки V2');}};
    void load();const timer=setInterval(()=>void load(),4000);return()=>{live=false;clearInterval(timer);};
  },[surveyId]);
  const action=async(path:string,body:unknown)=>{setBusy(true);setError('');try{await api.post('/admin/surveys/'+surveyId+'/quality-v2/'+path,body);const r=await api.get('/admin/surveys/'+surveyId+'/quality-v2');setSettings(r.data);await onUpdated();}catch(e:any){setError(e.response?.data?.message??e.message??'Ошибка задания');}finally{setBusy(false);}};
  return <Surface><details><summary>Калибровка, пересчёт и разметка когорт</summary>
    <p>{settings?.enabled===false?'V2 отключена на сервере.':settings?.baseline?'Замороженная baseline: '+settings.baseline.version+' · '+settings.baseline.source+' · N='+settings.baseline.n:'Baseline ещё не сформирована.'}</p>
    <div className="controls"><label>Reference группа<select aria-label="Reference группа" value={reference} onChange={e=>setReference(e.target.value)}><option value="">Автоматический выбор</option><option value="trusted">Подтверждённая reference</option><option value="public">Публичный набор</option><option value="unassigned">Не размеченные</option></select></label><Button disabled={busy||settings?.enabled===false} onClick={()=>void action('baseline',reference?{cohort:reference}:{})}>Создать и заморозить baseline</Button>
    <label>Версия для пересчёта<select aria-label="Версия для пересчёта" value={version} onChange={e=>setVersion(e.target.value)}><option value="">Активная версия</option>{settings?.versions.map(v=><option key={v.id} value={v.id}>{v.id}</option>)}</select></label><Button disabled={busy||settings?.enabled===false} onClick={()=>void action('recompute',version?{baselineVersion:version}:{})}>Пересчитать всех</Button>{version&&<Button disabled={busy} onClick={()=>void action("activate",{baselineVersion:version})}>Сделать версию активной</Button>}{selectedIds.length===1&&<Button disabled={busy} onClick={()=>void action('recompute',{sessionId:selectedIds[0],...(version?{baselineVersion:version}:{})})}>Пересчитать выбранного</Button>}
    <Button disabled={busy} onClick={()=>void action('recompute',{cohort, ...(version?{baselineVersion:version}:{})})}>Пересчитать когорту</Button></div>
    <h3>Разметить выбранные прохождения ({selectedIds.length})</h3><p>Когорта не определяется по имени. Доверие к reference и eligibility задаются исследователем отдельно от индекса.</p>
    <div className="controls"><label>Когорта<select aria-label="Когорта" value={cohort} onChange={e=>setCohort(e.target.value)}>{Object.entries(COHORTS).map(([k,l])=><option key={k} value={k}>{l}</option>)}</select></label>
      <label>Reference участник<input type="checkbox" checked={trusted} onChange={e=>setTrusted(e.target.checked)}/></label>
      <label>Eligibility<select aria-label="Eligibility" value={eligibility} onChange={e=>setEligibility(e.target.value)}><option value="unknown">Не проверено</option><option value="pass">Соответствует</option><option value="fail">Не соответствует</option></select></label>
      <label>Причина<input value={reason} onChange={e=>setReason(e.target.value)} placeholder="Например: вне критериев включения"/></label>
      <label>Подтверждённый дубликат<input type="checkbox" checked={duplicate} onChange={e=>setDuplicate(e.target.checked)}/></label>
      <Button disabled={busy||!selectedIds.length} onClick={()=>void action('metadata',{sessionIds:selectedIds,cohort,trusted,eligibility,eligibilityReason:reason||null,duplicate})}>Сохранить разметку</Button>
    </div><p>Разметка не изменяет замороженную baseline. Чтобы учесть новую reference группу, создайте новую версию.</p>
    <div aria-live="polite">{settings?.jobs.map(j=><p key={j.id}>{j.status} · {j.progress}/{j.total}{j.error?' · '+j.error:''}{j.status==='failed'&&<Button disabled={busy} onClick={()=>void action('retry',{jobId:j.id})}>Повторить</Button>}</p>)}</div>
    <Button onClick={async()=>{try{const r=await api.get('/admin/surveys/'+surveyId+'/quality-v2/diagnostics');setReport(r.data);if(!r.data)setError('Отчёт появится после полного пересчёта');}catch{setError('Не удалось загрузить отчёт');}}}>Групповая диагностика</Button>
    {error&&<p className="error" role="alert">{error}</p>}
    {report&&<GroupReport report={report}/>}
  </details></Surface>;
}
function GroupReport({report}:{report:any}) {
  const [cohort,setCohort]=useState('all'),[expanded,setExpanded]=useState(false);
  return <section><h3>Групповая диагностика</h3><p>{report.note}</p><label>Выборка<select aria-label="Выборка" value={cohort} onChange={e=>setCohort(e.target.value)}>{Object.entries({all:'Все',trusted:'Reference',public:'Публичный набор',unassigned:'Не размечена'}).map(([k,l])=><option key={k} value={k}>{l}</option>)}</select></label>
    <div className="scroll"><table><thead><tr><th>Показатель</th><th>N</th><th>Среднее</th><th>Медиана</th><th>SD</th><th>P01 / P05 / P10</th><th>P25 / P50 / P75</th><th>P90 / P95 / P99</th></tr></thead><tbody>{Object.entries(report.distributions[cohort]??{}).map(([key,v]:[string,any])=><tr key={key}><td>{key}</td><td>{v.n}</td><td>{display(v.mean)}</td><td>{display(v.median)}</td><td>{display(v.sd)}</td>{[['P01','P05','P10'],['P25','P50','P75'],['P90','P95','P99']].map(keys=><td key={keys[0]}>{keys.map(k=>display(v.percentiles[k])).join(' / ')}</td>)}</tr>)}</tbody></table></div>
    <details><summary>Надёжность шкал и пунктов</summary><div className="scroll"><table><thead><tr><th>Шкала</th><th>N шкалы / alpha</th><th>Среднее / SD</th><th>Alpha</th><th>Omega</th><th>Пропуски</th><th>Пункты</th></tr></thead><tbody>{report.reliability[cohort]?.map((v:any)=><tr key={v.scale}><td>{v.label}</td><td>{v.n} / {v.complete_cases}</td><td>{display(v.mean)} / {display(v.sd)}</td><td>{display(v.alpha)}</td><td title={v.omega_reason}>{display(v.omega)} · модель не задана</td><td>{percent(v.missing_rate==null?null:v.missing_rate*100)}</td><td><details><summary>Item–total</summary>{v.corrected_item_total.map((i:any)=><p key={i.question_id}>{i.question}: item–total {display(i.correlation)} · пропусков {i.missing} · {Object.entries(i.distribution??{}).map(([label,n])=>label+': '+n).join(', ')}</p>)}</details></td></tr>)}</tbody></table></div></details>
    <details><summary>Связи официальных шкал</summary><div className="scroll"><table><thead><tr><th>Шкалы</th><th>N</th><th>Spearman</th><th>95% CI</th><th>Ожидаемый знак</th></tr></thead><tbody>{report.correlations[cohort]?.map((v:any)=><tr key={v.a+v.b}><td>{v.a} ↔ {v.b}</td><td>{v.n}</td><td>{display(v.rho)}</td><td>{v.ci?.map(display).join(' — ')??'—'}</td><td>{v.expected}</td></tr>)}</tbody></table></div></details>
    <details><summary>Reference и публичный набор: Mann–Whitney</summary><div className="scroll"><table><thead><tr><th>Показатель</th><th>N reference / public</th><th>Медианы</th><th>U</th><th>Rank-biserial</th></tr></thead><tbody>{Object.entries(report.cohort_comparison).map(([k,v]:[string,any])=><tr key={k}><td>{k}</td><td>{v.trusted.n} / {v.public.n}</td><td>{display(v.trusted.median)} / {display(v.public.median)}</td><td>{display(v.u)}</td><td>{display(v.rank_biserial)}</td></tr>)}</tbody></table></div></details>
    <Button onClick={()=>setExpanded(!expanded)}>{expanded?'Скрыть':'Показать'} список для ручной проверки</Button>{expanded&&<ul>{report.lowest_scores.map((v:any)=><li key={v.id}>{v.alias} · {v.id} · индекс {display(v.overall)} · уверенность {percent(v.confidence*100)}</li>)}</ul>}
  </section>;
}
