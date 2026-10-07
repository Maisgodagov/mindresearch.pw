import { useEffect, useRef, useState, type ReactNode } from 'react';
import { CheckCircle2, ChevronDown, Clock3, Download, Info, ListFilter, Plus, RotateCcw, Settings2, ShieldCheck, Users, X } from 'lucide-react';
import { Button } from '../../../../ui';
import { SelectField } from '../../../../components/SelectField';
import { FieldInput } from '../../../../components/FieldInput';
import { api } from '../../../../api';
import { DEFAULT_QUALITY_VIEW, METRICS, metricValue, COHORTS, STATUS, type Quality, type QualityView, type MetricKey } from '../../quality';
import type { Respondent } from '../../types';
import { Surface } from './styles';

export const percent = (v: number | null | undefined) => v == null ? '—' : Math.round(v) + '%';
export const fasterText = (v: number | null) => v === null ? 'Нет данных для сравнения' : Math.abs(v)<.5 ? 'Сопоставимый темп' : v>0 ? 'На '+Math.round(v)+'% быстрее' : 'На '+Math.round(-v)+'% медленнее';
const display = (v: unknown) => typeof v==='number' ? Number(v.toFixed(3)).toString() : v==null ? '—' : String(v);
const choices = (values: Record<string,string>) => Object.entries(values).map(([value,label])=>({value,label}));
const resetView = (): QualityView => ({...DEFAULT_QUALITY_VIEW,filters:[]});
const dateLabel = (value?: string) => value ? new Date(value).toLocaleString('ru-RU',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}) : '';

function QualitySelect({label,value,options,onChange,hint,disabled=false,search=false}:{label:string;value:string;options:{value:string;label:string}[];onChange:(value:string)=>void;hint?:string;disabled?:boolean;search?:boolean}) {
  return <div className="field"><span className="field-label">{label}</span><SelectField aria-label={label} size="middle" value={value} options={options} disabled={disabled} showSearch={search} onChange={v=>onChange(String(v))}/>{hint&&<small className="hint">{hint}</small>}</div>;
}
function Notice({children}:{children:ReactNode}) { return <div className="notice"><Info size={16} aria-hidden="true"/><p>{children}</p></div>; }

export function QualityOverview({people,qualities}:{people:Respondent[];qualities:Record<string,Quality>}) {
  const values=people.filter(p=>p.status==='completed').flatMap(p=>qualities[p.id]?[qualities[p.id]]:[]);
  return <Surface>
    <div className="heading"><div className="heading-title"><ShieldCheck size={20} aria-hidden="true"/><h2>Качество прохождения</h2><span className="version-tag">V2</span></div></div>
    <p>Три индекса помогают заметить невнимательное прохождение и выбрать ответы для ручной проверки.</p>
    <div className="overview">
      <div><b>{values.length}</b><span>прохождений рассчитано</span></div>
      <div><b>{values.filter(q=>q.overall.partial).length}</b><span>с частичным расчётом</span></div>
      <div><b>{values.filter(q=>q.independent_concerning_domains>=2).length}</b><span>с сильными признаками в поведении и ответах</span></div>
    </div>
    <details className="disclosure help"><summary><Info size={16} aria-hidden="true"/>Как понимать эти показатели<ChevronDown className="chevron" size={16}/></summary>
      <div className="help-copy"><div><h3>Общий индекс</h3><p>Объединяет поведение и качество ответов. Чем выше значение, тем меньше обнаруженных признаков проблем.</p></div><div><h3>Поведенческий индекс</h3><p>Учитывает скорость, серии быстрых ответов и изменение темпа. Выбранные варианты на него не влияют.</p></div><div><h3>Качество ответов</h3><p>Учитывает согласованность ответов и необычные серии. Подробности доступны в раскрытом результате респондента.</p></div></div>
      <p className="hint">Частичный расчёт означает, что доступно только одно направление оценки. Недостающие данные не считаются нулём. Уверенность показывает полноту основания расчёта. Индексы не являются вероятностью честности, а результаты не удаляются автоматически.</p>
    </details>
  </Surface>;
}

const metricHints: Partial<Record<MetricKey,string>> = {
  overall:'Индекс от 0 до 100. Низкое значение — повод для ручной проверки.',
  behavioral:'Оценка скорости и темпа от 0 до 100; выбранные ответы не учитываются.',
  response:'Оценка согласованности ответов от 0 до 100.',
  fastShare:'Доля вопросов с ответом быстрее эталонного темпа и менее чем за 4 секунды.',
  extremeShare:'Доля вопросов с ответом значительно быстрее эталонного темпа и менее чем за 2 секунды.',
  speedRatio:'1 — эталонный темп; 0,5 — примерно вдвое меньше времени на вопрос.',
  durationRatio:'1 — активное время сопоставимо с эталоном; меньше 1 — прохождение быстрее.',
  acceleration:'Меньше 1 — последняя треть проходится быстрее первой с учётом сложности вопросов.',
  rpr:'Согласованность психологического профиля при повторном разделении вопросов на части.',
  pairs:'Согласованность связанных вопросов: от 0 до 1.',
  confidence:'Полнота основания общего индекса: от 0 до 100%. Это не вероятность честности.',
  coverage:'Доля вопросов, для которых доступно измерение активного времени.',
  sameRun:'Максимальная серия одинаковых ответов внутри одного блока.',
  fastRun:'Максимальная серия быстрых ответов внутри одного блока.',
};

export function QualityControls({view,onChange,visible,total,selectedCount=0,onExport}:{view:QualityView;onChange:(v:QualityView)=>void;visible:number;total:number;selectedCount?:number;onExport?:()=>void}) {
  const basicCount=[view.status,view.qualityStatus,view.cohort,view.eligibility,view.available,view.telemetry].filter(v=>v!=='all').length;
  const activeCount=basicCount+view.filters.filter(f=>f.operator==='missing'||f.value.trim()!=='').length;
  const metricSort=!['newest','oldest','insufficient'].includes(view.sort);
  const patch=(next:Partial<QualityView>)=>onChange({...view,...next});
  const changeRule=(i:number,next:Partial<QualityView['filters'][number]>)=>patch({filters:view.filters.map((f,n)=>n===i?{...f,...next}:f)});
  return <Surface aria-label="Фильтры респондентов">
    <div className="filter-top"><div className="heading"><div className="heading-title"><ListFilter size={19} aria-hidden="true"/><h2>Фильтры и сортировка</h2></div>{onExport&&<Button disabled={!selectedCount} onClick={onExport}><Download size={14}/>Качество в CSV{selectedCount?` (${selectedCount})`:''}</Button>}</div><p>Условия применяются сразу. Для экспорта отметьте респондентов в таблице ниже.</p></div>
    <div className="sort-row">
      <div><QualitySelect label="Сортировка" value={view.sort} options={[{value:'newest',label:'По дате · свежие сверху'},{value:'oldest',label:'По дате · старые сверху'},{value:'insufficient',label:'Сначала без оценки'},...METRICS.map(m=>({value:m.key,label:m.label}))]} onChange={sort=>patch({sort:sort as QualityView['sort']})} search/>
        {metricSort&&<div className="sort-direction" aria-label="Порядок сортировки"><button type="button" aria-pressed={view.direction==='asc'} onClick={()=>patch({direction:'asc'})}>Сначала низкие значения</button><button type="button" aria-pressed={view.direction==='desc'} onClick={()=>patch({direction:'desc'})}>Сначала высокие значения</button></div>}
      </div>
      <QualitySelect label="Прохождение" value={view.status} options={choices({all:'Все прохождения',completed:'Завершённые',in_progress:'В процессе'})} onChange={status=>patch({status})}/>
      <QualitySelect label="Качество прохождения" value={view.qualityStatus} options={choices({all:'Любое качество',...STATUS})} onChange={qualityStatus=>patch({qualityStatus})}/>
    </div>
    <div className="presets" aria-label="Быстрый отбор">
      <Button onClick={()=>onChange({...resetView(),status:'completed',filters:[{metric:'overall',operator:'lte',value:'55'}]})}>Индекс ≤ 55</Button>
      <Button onClick={()=>onChange({...resetView(),status:'completed',filters:[{metric:'fastShare',operator:'gte',value:'20'}]})}>Быстрые ответы ≥ 20%</Button>
      <Button onClick={()=>onChange({...resetView(),available:'missing'})}>Без оценки</Button>
      <Button onClick={()=>patch({filters:[...view.filters,{metric:'overall',operator:'lte',value:''}]})}><Plus size={14}/>Своё условие</Button>
    </div>
    <details className="disclosure filter-extra"><summary>Дополнительные фильтры<ChevronDown className="chevron" size={16}/></summary>
      <div className="fields">
        <QualitySelect label="Группа участников" value={view.cohort} options={choices({all:'Все группы',...COHORTS})} onChange={cohort=>patch({cohort})} hint="Группу назначает исследователь в настройках качества."/>
        <QualitySelect label="Критерии участия" value={view.eligibility} options={choices({all:'Любой статус',unknown:'Не проверены',pass:'Соответствует',fail:'Не соответствует'})} onChange={eligibility=>patch({eligibility})} hint="Например, возраст или другие условия включения в исследование."/>
        <QualitySelect label="Наличие оценки" value={view.available} options={choices({all:'Все результаты',present:'Индекс рассчитан',missing:'Нет оценки'})} onChange={available=>patch({available})}/>
        <QualitySelect label="Измерения времени" value={view.telemetry} options={choices({all:'Все результаты',present:'Есть измерения',missing:'Нет измерений'})} onChange={telemetry=>patch({telemetry})} hint="Время активного просмотра вопросов; у старых прохождений может отсутствовать."/>
      </div>
    </details>
    {view.filters.length>0&&<div className="rules"><h3>Условия по показателям</h3><p>Результат должен соответствовать всем условиям. Пока значение не введено, условие не применяется.</p>
      {view.filters.map((f,i)=><div key={i}>
        <div className={`rule ${f.operator==='missing'?'missing':''}`}>
          <QualitySelect label={`Показатель ${i+1}`} value={f.metric} options={METRICS.map(m=>({value:m.key,label:m.label}))} onChange={metric=>changeRule(i,{metric:metric as MetricKey})} search/>
          <QualitySelect label={`Условие ${i+1}`} value={f.operator} options={choices({lte:'Не больше (≤)',gte:'Не меньше (≥)',missing:'Нет данных'})} onChange={operator=>changeRule(i,{operator:operator as typeof f.operator})}/>
          {f.operator!=='missing'&&<label className="field"><span className="field-label">Значение · {METRICS.find(m=>m.key===f.metric)?.unit}</span><FieldInput type="number" step="any" aria-label={`Значение условия ${i+1}`} value={f.value} placeholder="Введите число" onChange={e=>changeRule(i,{value:e.target.value})}/></label>}
          <Button className="remove-rule" aria-label={`Удалить условие ${i+1}`} onClick={()=>patch({filters:view.filters.filter((_,n)=>n!==i)})}><X size={16}/></Button>
        </div>
        {metricHints[f.metric]&&<p className="hint rule-note">{metricHints[f.metric]}</p>}
      </div>)}
    </div>}
    <div className="filter-bottom"><div className="filter-result" aria-live="polite"><strong>Показано {visible} из {total}{activeCount>0?` · условий: ${activeCount}`:''}</strong><span className="hint">{metricSort?'Результаты без значения показателя остаются внизу.':view.sort==='oldest'?'Старые прохождения сверху.':view.sort==='insufficient'?'Сначала результаты без оценки, затем остальные.':'Свежие прохождения сверху. Сброс вернёт весь список.'}</span></div><Button onClick={()=>onChange(resetView())}><RotateCcw size={14}/>Сбросить всё</Button></div>
    {visible===0&&total>0&&<div className="empty-filter"><Notice>Нет прохождений с такими условиями. Удалите одно из условий или нажмите «Сбросить всё», чтобы снова показать весь список.</Notice></div>}
  </Surface>;
}

type Job = {id:string;kind?:string;status:string;progress:number;total:number;error:string|null;createdAt?:string};
type Settings = { enabled:boolean; baseline:{version:string;source:string;n:number;created_at:string}|null; versions:{id:string;createdAt:string}[]; jobs:Job[] };
const jobStatuses: Record<string,string> = {queued:'В очереди',running:'Выполняется',completed:'Завершён',failed:'Нужен повтор'};
const sourceNames: Record<string,string> = {trusted:'Подтверждённые участники',high_quality_v2:'Прохождения с высоким качеством',completed:'Завершённые прохождения'};

export function QualityAdministration({surveyId,selectedIds,onUpdated}:{surveyId:string;selectedIds:string[];onUpdated:()=>Promise<void>}) {
  const [settings,setSettings]=useState<Settings|null>(null),[error,setError]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false),[report,setReport]=useState<any>(null);
  const [tab,setTab]=useState('recompute'),[cohort,setCohort]=useState('public'),[trusted,setTrusted]=useState(false),[eligibility,setEligibility]=useState('unknown'),[reason,setReason]=useState(''),[duplicate,setDuplicate]=useState(false),[reference,setReference]=useState(''),[version,setVersion]=useState('');
  const updateRef=useRef(onUpdated); updateRef.current=onUpdated;
  useEffect(()=>{
    let live=true,previous:string|null=null,inFlight=false;
    const load=async()=>{if(inFlight)return;inFlight=true;try{const r=await api.get('/admin/surveys/'+surveyId+'/quality-v2');if(!live)return;setSettings(r.data);const stamp=r.data.jobs?.filter((j:Job)=>j.status==='completed').map((j:Job)=>j.id).join(',');if(previous!==null&&stamp!==previous)await updateRef.current();previous=stamp;}catch{if(live)setError('Не удалось загрузить настройки. Обновите страницу или повторите действие.');}finally{inFlight=false;}};
    void load();const timer=setInterval(()=>void load(),4000);return()=>{live=false;clearInterval(timer);};
  },[surveyId]);
  const action=async(path:string,body:unknown,success:string)=>{setBusy(true);setError('');setMessage('');try{await api.post('/admin/surveys/'+surveyId+'/quality-v2/'+path,body);const r=await api.get('/admin/surveys/'+surveyId+'/quality-v2');setSettings(r.data);await updateRef.current();setMessage(success);}catch(e:any){setError(e.response?.data?.message??'Не удалось выполнить действие. Попробуйте ещё раз.');}finally{setBusy(false);}};
  const loadReport=async()=>{setBusy(true);setError('');try{const r=await api.get('/admin/surveys/'+surveyId+'/quality-v2/diagnostics');setReport(r.data);if(!r.data)setError('Отчёт ещё не готов. Запустите «Пересчитать всех» и дождитесь завершения в истории расчётов.');}catch{setError('Не удалось загрузить отчёт. Нажмите «Обновить отчёт», чтобы повторить.');}finally{setBusy(false);}};
  const disabled=busy||!settings||settings.enabled===false;
  const current= settings?.baseline;
  const pending=settings?.jobs.filter(j=>j.status==='queued'||j.status==='running').length??0;
  return <Surface>
    <details className="disclosure admin"><summary><Settings2 size={17} aria-hidden="true"/><div>Настройки качества<span className="hint">Пересчёт, группы участников и история{pending>0?` · задач в работе: ${pending}`:''}</span></div><ChevronDown className="chevron" size={16}/></summary>
      <nav className="tabs" aria-label="Разделы настроек качества">{[['recompute','Пересчёт'],['groups','Группы участников'],['history','История расчётов'],['report','Групповой отчёт']].map(([key,label])=><button type="button" key={key} aria-pressed={tab===key} onClick={()=>{setTab(key);setError('');setMessage('');}}>{label}{key==='groups'&&selectedIds.length>0?` (${selectedIds.length})`:''}</button>)}</nav>
      {settings?.enabled===false&&<Notice>Оценка качества отключена в настройках сервера.</Notice>}
      {tab==='recompute'&&<div className="section-body">
        <div><h3>Обновить оценки прохождений</h3><p>Новые результаты рассчитываются автоматически. Пересчёт нужен после изменения разметки или при выборе другой версии эталона.</p></div>
        <div className="version-picker"><QualitySelect label="Версия для пересчёта" value={version} options={[{value:'',label:'Текущая активная версия'},...(settings?.versions??[]).map(v=>({value:v.id,label:`Версия от ${dateLabel(v.createdAt)} · ${v.id.slice(-6)}`}))]} onChange={setVersion} disabled={disabled} hint="Все выбранные результаты будут сравниваться с одним и тем же сохранённым эталоном."/></div>
        <div className="actions"><Button type="primary" disabled={disabled} loading={busy} onClick={()=>void action('recompute',version?{baselineVersion:version}:{},'Пересчёт поставлен в очередь. Ход работы доступен в истории расчётов.')}><RotateCcw size={14}/>Пересчитать всех</Button>{selectedIds.length===1&&<Button disabled={disabled} onClick={()=>void action('recompute',{sessionId:selectedIds[0],...(version?{baselineVersion:version}:{})},'Пересчёт выбранного прохождения поставлен в очередь.')}>Пересчитать выбранного</Button>}{version&&<Button disabled={disabled} onClick={()=>void action('activate',{baselineVersion:version},'Выбранная версия активирована. Пересчёт поставлен в очередь.')}>Использовать эту версию по умолчанию</Button>}</div>
        <details className="disclosure subsection"><summary>Настроить эталон сравнения<ChevronDown className="chevron" size={16}/></summary><div className="section-body">
          <Notice>Эталон — сохранённые показатели группы участников, с которыми сравниваются скорость и согласованность ответов. Создавайте новую версию, когда хотите изменить группу сравнения; обычный пересчёт сохраняет текущий эталон.</Notice>
          <div className="baseline-info">{current?<><CheckCircle2 size={15}/><strong>Эталон сохранён</strong><span>{current.n} участников · {sourceNames[current.source]??current.source}</span><span>{dateLabel(current.created_at)}</span></>:<span>Эталон пока не создан. При первом пересчёте он сформируется автоматически.</span>}</div>
          {current&&<details><summary>Идентификатор версии</summary><p className="baseline-code">{current.version}</p></details>}
          <QualitySelect label="Группа для эталона" value={reference} options={choices({'':'Автоматический выбор',trusted:'Подтверждённые участники',public:'Публичный набор',unassigned:'Без разметки'})} onChange={setReference} disabled={disabled} hint="Автоматический выбор использует подтверждённую группу, если данных достаточно; иначе — доступные завершённые прохождения."/>
          <div className="actions"><Button disabled={disabled} onClick={()=>void action('baseline',reference?{cohort:reference}:{},'Создание эталона поставлено в очередь. Затем оценки пересчитаются автоматически.')}>Создать новую версию эталона</Button><span className="hint">Новая версия станет активной и запустит пересчёт всех результатов. Старые версии сохранятся.</span></div>
        </div></details>
      </div>}
      {tab==='groups'&&<div className="section-body">
        <div><h3>Разметить участников</h3><p>Назначьте группу и отметьте соответствие критериям исследования. Эти признаки учитываются отдельно от индексов качества.</p></div>
        <div className="selection-info"><Users size={16}/><b>Выбрано прохождений: {selectedIds.length}</b><Button type="text" className="text-action" onClick={()=>document.querySelector('[data-quality-respondents]')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})}>Выбрать в таблице ниже</Button></div>
        {!selectedIds.length&&<Notice>Отметьте участников чекбоксами в таблице ниже. Затем вернитесь в этот раздел: настройки применятся ко всем выбранным прохождениям.</Notice>}
        <fieldset disabled={disabled||!selectedIds.length} aria-label="Разметка выбранных прохождений">
          <div className="fields">
            <QualitySelect label="Группа участников" value={cohort} options={choices(COHORTS)} onChange={setCohort} disabled={disabled||!selectedIds.length}/>
            <QualitySelect label="Критерии участия" value={eligibility} options={choices({unknown:'Не проверены',pass:'Соответствует',fail:'Не соответствует'})} onChange={setEligibility} disabled={disabled||!selectedIds.length} hint="Например, возраст или условия включения в исследование."/>
            <label className="field"><span className="field-label">Комментарий к критериям</span><FieldInput aria-label="Комментарий к критериям" value={reason} onChange={e=>setReason(e.target.value)} placeholder="Например, возраст вне диапазона"/><small className="hint">Необязательно. Поможет объяснить решение при разборе результатов.</small></label>
          </div>
          <div className="checks"><div className="check"><FieldInput id={`quality-trusted-${surveyId}`} type="checkbox" disabled={disabled||!selectedIds.length} checked={trusted} onChange={e=>setTrusted(e.target.checked)}/><label htmlFor={`quality-trusted-${surveyId}`}><strong>Включить в подтверждённую группу сравнения</strong><span className="hint">Отмечайте только участников, на чьи результаты можно опираться при калибровке. Это отдельный признак, а не название группы.</span></label></div><div className="check"><FieldInput id={`quality-duplicate-${surveyId}`} type="checkbox" disabled={disabled||!selectedIds.length} checked={duplicate} onChange={e=>setDuplicate(e.target.checked)}/><label htmlFor={`quality-duplicate-${surveyId}`}><strong>Подтверждённое повторное прохождение</strong><span className="hint">Используйте, если точно установили дубликат. Сам индекс качества не подтверждает повторное участие.</span></label></div></div>
          <div className="actions"><Button type="primary" disabled={disabled||!selectedIds.length} loading={busy} onClick={()=>void action('metadata',{sessionIds:selectedIds,cohort,trusted,eligibility,eligibilityReason:reason||null,duplicate},'Разметка сохранена для выбранных прохождений. Оценки обновятся в фоне.')}>Сохранить разметку{selectedIds.length?` (${selectedIds.length})`:''}</Button><span className="hint">Все указанные значения применятся к выбранным прохождениям. Сохранённый эталон не изменится; чтобы учесть новую группу сравнения, создайте новую версию.</span></div>
        </fieldset>
        <details className="disclosure subsection"><summary>Пересчитать отдельную группу<ChevronDown className="chevron" size={16}/></summary><div className="section-body"><QualitySelect label="Группа для пересчёта" value={cohort} options={choices({...COHORTS,trusted:"Подтверждённая группа сравнения"})} onChange={setCohort} disabled={disabled}/><div className="actions"><Button disabled={disabled} onClick={()=>void action('recompute',{cohort,...(version?{baselineVersion:version}:{})},'Пересчёт группы поставлен в очередь.')}>Пересчитать группу</Button></div><span className="hint">Для подтверждённой группы используется соответствующая отметка у участника. Для остальных групп — назначенная разметка.</span></div></details>
      </div>}
      {tab==='history'&&<div className="section-body"><div><h3>Последние расчёты</h3><p>Задания выполняются в фоне. Можно продолжать работу со статистикой; список обновляется автоматически.</p></div><ul className="job-list" aria-live="polite">{settings?.jobs.map(j=><li className="job" key={j.id}><div><div className="job-title">{j.kind==='baseline'?'Создание эталона':'Пересчёт оценок'}<span className="hint">{dateLabel(j.createdAt)}</span></div><span className="hint">{j.total>0?`${j.progress} из ${j.total} прохождений`:j.status==='queued'?'Ожидает своей очереди':j.status==='running'?'Подготовка данных':''}</span>{j.status==='running'&&j.total>0&&<progress value={j.progress} max={j.total} aria-label="Ход пересчёта"/>}{j.error&&<details><summary>Причина ошибки</summary><p className="error">{j.error}</p></details>}</div><div className={`job-status ${j.status}`}>{j.status==='completed'?<CheckCircle2 size={15}/>:<Clock3 size={15}/>}<span>{jobStatuses[j.status]??j.status}</span>{j.status==='failed'&&<Button disabled={disabled} onClick={()=>void action('retry',{jobId:j.id},'Задание повторно поставлено в очередь.')}>Повторить</Button>}</div></li>)}</ul>{settings?.jobs.length===0&&<Notice>Расчётов ещё не было. Начните с «Пересчитать всех» в разделе «Пересчёт».</Notice>}</div>}
      {tab==='report'&&<div className="section-body"><div><h3>Групповой отчёт</h3><p>Распределение индексов, надёжность шкал и сравнение групп. Отчёт формируется после полного пересчёта.</p></div><div className="actions"><Button disabled={disabled} loading={busy} onClick={()=>void loadReport()}>{report?'Обновить отчёт':'Показать отчёт'}</Button></div>{report&&<GroupReport report={report}/>}</div>}
      {error&&<p className="error" role="alert">{error}</p>}{message&&<p className="success" role="status">{message}</p>}
    </details>
  </Surface>;
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
function GroupReport({report}:{report:any}) {
  const [cohort,setCohort]=useState('all'),[expanded,setExpanded]=useState(false);
  return <section className="report"><h3>Показатели по группам</h3><p>{report.note}</p><QualitySelect label="Выборка отчёта" value={cohort} onChange={setCohort} options={choices({all:"Все участники",trusted:"Подтверждённая группа сравнения",public:"Публичный набор",unassigned:"Без разметки"})}/>
    <div className="scroll"><table><thead><tr><th>Показатель</th><th>N</th><th>Среднее</th><th>Медиана</th><th>SD</th><th>P01 / P05 / P10</th><th>P25 / P50 / P75</th><th>P90 / P95 / P99</th></tr></thead><tbody>{Object.entries(report.distributions[cohort]??{}).map(([key,v]:[string,any])=><tr key={key}><td>{key}</td><td>{v.n}</td><td>{display(v.mean)}</td><td>{display(v.median)}</td><td>{display(v.sd)}</td>{[['P01','P05','P10'],['P25','P50','P75'],['P90','P95','P99']].map(keys=><td key={keys[0]}>{keys.map(k=>display(v.percentiles[k])).join(' / ')}</td>)}</tr>)}</tbody></table></div>
    <details><summary>Надёжность шкал и пунктов</summary><div className="scroll"><table><thead><tr><th>Шкала</th><th>N шкалы / alpha</th><th>Среднее / SD</th><th>Alpha</th><th>Omega</th><th>Пропуски</th><th>Пункты</th></tr></thead><tbody>{report.reliability[cohort]?.map((v:any)=><tr key={v.scale}><td>{v.label}</td><td>{v.n} / {v.complete_cases}</td><td>{display(v.mean)} / {display(v.sd)}</td><td>{display(v.alpha)}</td><td title={v.omega_reason}>{display(v.omega)} · модель не задана</td><td>{percent(v.missing_rate==null?null:v.missing_rate*100)}</td><td><details><summary>Item–total</summary>{v.corrected_item_total.map((i:any)=><p key={i.question_id}>{i.question}: item–total {display(i.correlation)} · пропусков {i.missing} · {Object.entries(i.distribution??{}).map(([label,n])=>label+': '+n).join(', ')}</p>)}</details></td></tr>)}</tbody></table></div></details>
    <details><summary>Связи официальных шкал</summary><div className="scroll"><table><thead><tr><th>Шкалы</th><th>N</th><th>Spearman</th><th>95% CI</th><th>Ожидаемый знак</th></tr></thead><tbody>{report.correlations[cohort]?.map((v:any)=><tr key={v.a+v.b}><td>{v.a} ↔ {v.b}</td><td>{v.n}</td><td>{display(v.rho)}</td><td>{v.ci?.map(display).join(' — ')??'—'}</td><td>{v.expected}</td></tr>)}</tbody></table></div></details>
    <details><summary>Reference и публичный набор: Mann–Whitney</summary><div className="scroll"><table><thead><tr><th>Показатель</th><th>N reference / public</th><th>Медианы</th><th>U</th><th>Rank-biserial</th></tr></thead><tbody>{Object.entries(report.cohort_comparison).map(([k,v]:[string,any])=><tr key={k}><td>{k}</td><td>{v.trusted.n} / {v.public.n}</td><td>{display(v.trusted.median)} / {display(v.public.median)}</td><td>{display(v.u)}</td><td>{display(v.rank_biserial)}</td></tr>)}</tbody></table></div></details>
    <Button onClick={()=>setExpanded(!expanded)}>{expanded?'Скрыть':'Показать'} список для ручной проверки</Button>{expanded&&<ul>{report.lowest_scores.map((v:any)=><li key={v.id}>{v.alias} · {v.id} · индекс {display(v.overall)} · уверенность {percent(v.confidence*100)}</li>)}</ul>}
  </section>;
}
