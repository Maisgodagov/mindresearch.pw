import {SaveSampleModal} from "./components/SaveSampleModal";
import { useReactTable, getCoreRowModel, getSortedRowModel } from '@tanstack/react-table';
import {atomicDistribution, membershipLabels, applySampleConditions, upsertSampleCondition, type SampleCondition} from "./selection";
import {ResultsSelection, type SampleDraft} from "./components/ResultsSelection";
import { methodSortValue } from './selection';
import { distributionOptions, methodSortOptions } from "./selection";
import { distributionQuestionKey } from "./components/AnswerDistribution/questionKey";
import { SurveySharing } from '../../components/SurveySharing';
import { getApiErrorMessage } from '../../utils/apiErrors';
import { usePageTitle } from "../../pageTitle";
import { BrandWordmark } from "../../components/BrandWordmark";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  CircleHelp,
  Calculator,
  CheckCircle2,
  Clock3,
  Copy,
  Eye,
  Leaf,
  LogOut,
  Pencil,
  RefreshCw,
  Save,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { api, getCurrentUser, logout, useDemoFallbacks } from "../../api";
import { Button, Page, SkeletonScreen } from "../../ui";
import { exportRespondents } from "../../admin/exportResults";
import { sectionKey, type ExportSelection } from "../../admin/resultsWorkbook";
import { ResultsAction } from './components/ResultsAction';
import { ResultsExportModal } from "./components/ResultsExportModal";
import { QualityOverview, QualityDetails, QualityAdministration } from "./components/ResponseQuality";
import { DEFAULT_QUALITY_VIEW, metricValue, type MetricKey, type QualityView } from "./quality";
import { demoSurveys } from "../../platform/demo";
import {
  MethodologyModal,
  type Methodology,
} from "../../components/MethodologyModal";
import { AnswerDistribution } from "./components/AnswerDistribution";
import { RespondentResults } from "./components/RespondentResults";
import { RespondentPagination } from "./components/RespondentPagination";
import { RespondentDetails as RespondentAnswerDetails } from "./components/RespondentDetails";
import { MethodScoreSummary } from "./components/MethodScoreSummary";
import { MethodologyInterpretation } from "./components/MethodologyInterpretation";

import type { SurveyRow, Result, Respondent } from "./types";
import {
  Wrap,
  Header,
  SurveyTitleRow,
  Grid,
  Stat,
  Panel,
  ConfirmOverlay,
  ConfirmModal,
} from "./styles";
import { methodCodes, shortNames } from "./const";
const StatisticsWorkspace = lazy(() => import('./components/StatisticsWorkspace'));
export function Dashboard({ embedded = false, inspectionOwnerId }: { embedded?: boolean; inspectionOwnerId?: string }) {
  const [statisticsAllowed,setStatisticsAllowed]=useState(false),[statisticsOpen,setStatisticsOpen]=useState(false),[saveSampleOpen,setSaveSampleOpen]=useState(false);
  useEffect(()=>{let active=true;void getCurrentUser().then(user=>{if(active)setStatisticsAllowed(['admin','owner'].includes(user.role))}).catch(()=>{});return()=>{active=false}},[]);
  const [access,setAccess]=useState<any>(null),[sharing,setSharing]=useState(false);
  const readOnly=!!inspectionOwnerId||!['owner','edit'].includes(access?.permission);
  const [loadError,setLoadError]=useState("");
  const nav = useNavigate();
  const { surveyId } = useParams();
  const [surveys, setSurveys] = useState<SurveyRow[]>([]);
  const [result, setResult] = useState<Result>({
    sections: [],
    respondents: [],
    deletedRespondents: [],
    distribution: [],
  });
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(() => {
    try { const saved = Number(localStorage.getItem('statistics-page-size')); return [20,50,100].includes(saved) ? saved : 50; } catch { return 50; }
  });
  const [details, setDetails] = useState<Record<string, Respondent>>({});
  const [detailErrors, setDetailErrors] = useState<Record<string, boolean>>({});
  const pendingDetails = useRef(new Map<string, Promise<Respondent>>());
  const resultGeneration = useRef(0);
  const [qualityView, setQualityView] = useState<QualityView>({ ...DEFAULT_QUALITY_VIEW, filters: [] });
  const qualities = useMemo(() => Object.fromEntries(result.respondents.flatMap(p => p.qualityV2 ? [[p.id, p.qualityV2]] : [])), [result.respondents]);
  const [sampleConditions,setSampleConditions]=useState<SampleCondition[]>([]);
  const [chartBusy,setChartBusy]=useState(false);
  const chartRequest=useRef(0);
  const sampleRespondents=useMemo(()=>applySampleConditions(result.respondents,sampleConditions).filter(person=>qualityView.status!=='completed'||person.status==='completed'),[result.respondents,sampleConditions,qualityView.status]);
  const sampleScoped=sampleConditions.length>0||qualityView.status==='completed';
  const filteredRespondents=sampleRespondents;
  const [sampleDistribution,setSampleDistribution]=useState<Result['distribution']>([]);
  const [distributionBusy,setDistributionBusy]=useState(false),[distributionError,setDistributionError]=useState('');
  const [distributionRetry,setDistributionRetry]=useState(0);
  const sortOptions = useMemo(()=>[{value:'alias',label:'Респондент'},...(result.hasGender?[{value:'gender',label:'Пол респондента'}]:[]),{value:'status',label:'Статус'},{value:'answered',label:'Количество ответов'},{value:'duration',label:'Время прохождения'},...((result.hasAge || result.distribution.some(q=>q.code==='age'||(q.type==='number'&&q.text.trim().toLowerCase()==='ваш возраст'))) ? [{value:'age',label:'Возраст респондента'}] : []),...methodSortOptions(result.respondents,result.sections)],[result]);
  const sortValue = (person:Respondent): string | number | undefined => {
    const key=qualityView.sort;
    if(key==='alias') return person.alias;
    if(key==='gender') return person.gender??undefined;
    if(key==='status') return person.status==='completed'?'Завершена':'В процессе';
    if(key==='answered') return person.answered;
    if(key==='duration') {const value=person.completedAt?Date.parse(person.completedAt)-Date.parse(person.startedAt):NaN;return Number.isFinite(value)&&value>=0?value:undefined;}
    if(['started','newest','oldest'].includes(key)) {const value=Date.parse(person.startedAt);return Number.isFinite(value)?value:undefined;}
    if(key==='insufficient') return qualities[person.id]?.overall.score==null?0:1;
    if(key==='age') return person.age??undefined;
    if(key.startsWith('method:')) return methodSortValue(person,key)??undefined;
    return metricValue(qualities[person.id],key as MetricKey)??undefined;
  };
  // TanStack caches accessor values by column ID; each sort field needs its own ID.
  const sortColumns = useMemo(()=>[{id:qualityView.sort,accessorFn:sortValue,sortUndefined:'last' as const,sortingFn:'auto' as const}], [qualityView.sort,qualities]);
  const sortedTable = useReactTable({data:filteredRespondents,columns:sortColumns,getCoreRowModel:getCoreRowModel(),getSortedRowModel:getSortedRowModel(),autoResetPageIndex:false,state:{sorting:[{id:qualityView.sort,desc:qualityView.sort==='newest'||(!['oldest','insufficient'].includes(qualityView.sort)&&qualityView.direction==='desc')}]}});
  const visibleRespondents = sortedTable.getRowModel().rows.map(row=>row.original);
  const currentPage = Math.min(page, Math.max(1, Math.ceil(visibleRespondents.length / pageSize)));
  const pageRespondents = useMemo(() => visibleRespondents.slice((currentPage - 1) * pageSize, currentPage * pageSize), [visibleRespondents, currentPage, pageSize]);
  useEffect(() => { setPage(currentPage); }, [currentPage]);
  useEffect(() => { setQualityView({ ...DEFAULT_QUALITY_VIEW, filters: [] }); setSelected({}); chartRequest.current++; setChartBusy(false); setSampleConditions([]); setSelectedQuestion(''); setPage(1); setExpanded({}); }, [surveyId]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [deletedSelected, setDeletedSelected] = useState<
    Record<string, boolean>
  >({});
  const [exporting, setExporting] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [trashOpen, setTrashOpen] = useState(false);
  const [updatingTrash, setUpdatingTrash] = useState(false);
  const [confirmTrash, setConfirmTrash] = useState(false);
  const [methodologies, setMethodologies] = useState<
    Record<string, Methodology>
  >({});
  const [activeMethodology, setActiveMethodology] =
    useState<Methodology | null>(null);
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    resultGeneration.current++;
    setLoading(true);setLoadError(""); setDetails({}); setDetailErrors({}); pendingDetails.current.clear();
    api
      .get("/admin/surveys", {signal: controller.signal,params:inspectionOwnerId?{ownerId:inspectionOwnerId}:undefined})
      .then(async (r) => {
        if(cancelled) return;
        if(!inspectionOwnerId){const shared=await api.get('/sharing/shared',{signal:controller.signal});r.data=[...r.data,...shared.data];}
        setSurveys(r.data);
        const target =
          r.data.find((s: SurveyRow) => s.id === surveyId) ?? (surveyId || inspectionOwnerId ? undefined : r.data[0]);
        if(inspectionOwnerId&&!target)throw new Error("Опрос не найден у этого пользователя");
        if (target) {
          if(!inspectionOwnerId){const a=await api.get(`/sharing/surveys/${target.id}/access`,{signal:controller.signal});if(!cancelled)setAccess(a.data);}
          const x = await api.get(`/admin/surveys/${target.id}/results`, {params:{summary:1}, signal:controller.signal});
          if(!cancelled) setResult(x.data);
        }else if(surveyId)throw new Error('Опрос недоступен');
      })
      .catch(() => {
        if(cancelled) return;
        if(surveyId&&!useDemoFallbacks){setLoadError('Опрос недоступен. Возможно, автор отозвал доступ.');return;}
        if(inspectionOwnerId){setLoadError("Не удалось открыть статистику. Опрос отсутствует или доступ запрещён.");return;}
        if (useDemoFallbacks) {
          setSurveys(demoSurveys);
          setResult((current) => ({
            ...current,
            sections: [
              { code: "test_1", title: "MSPSS", sectionKind: "verified" },
              { code: "test_2", title: "ССПМ-2011", sectionKind: "verified" },
              {
                code: "custom-demo",
                title: "Авторские вопросы",
                sectionKind: "custom",
              },
            ],
          }));
        } else nav("/login");
      })
      .finally(() => { if(!cancelled) setLoading(false); });
    return () => { cancelled = true; controller.abort(); resultGeneration.current++; };
  }, [nav, surveyId,inspectionOwnerId]);
  useEffect(() => {
    const codes = result.sections.map(section=>section.code).join(',');
    if(!codes) return;
    const controller = new AbortController();
    api
      .get("/admin/methodologies", {params:{codes}, signal:controller.signal})
      .then((r) => setMethodologies(r.data))
      .catch(() => {});
    return () => controller.abort();
  }, [result.sections]);
  const survey = surveys.find((s) => s.id === surveyId) ?? surveys[0];
  usePageTitle(survey?.title?`${survey.title} — статистика`:undefined);
  const [questionChoices,setQuestionChoices]=useState<Record<string,{value:string|number;label:string}[]>>({});
  useEffect(()=>{
    setQuestionChoices({});
    const catalog=result.questions??result.distribution;
    if(!survey?.slug||!catalog.some(q=>['single','multiple'].includes(q.type??'')&&!('options' in q && Array.isArray(q.options)&&q.options.length)))return;
    const controller=new AbortController();let cancelled=false;
    api.get(`/public/surveys/${survey.slug}`,{signal:controller.signal}).then(response=>{
      if(cancelled)return;
      const entries=(response.data.questions??[]).map((q:any)=>{
        let options=q.options;
        if(typeof options==='string'){try{options=JSON.parse(options);}catch{options=[];}}
        return [q.questionId??q.id,Array.isArray(options)?options:[]];
      });
      setQuestionChoices(Object.fromEntries(entries));
    }).catch(()=>{});
    return ()=>{cancelled=true;controller.abort();};
  },[survey?.id,survey?.slug,result.questions,result.distribution]);
  const sampleQuestions=useMemo(()=>[...new Map((result.questions??result.distribution).map(q=>{
    const questionId=distributionQuestionKey(q);
    return [questionId,{...q,questionId,type:q.type??'',sectionPosition:q.sectionPosition??0,questionPosition:q.questionPosition??0,options:questionChoices[questionId]??('options' in q?q.options:undefined)}];
  })).values()],[result.questions,result.distribution,questionChoices]);
  const allAnswerOptions=useMemo(()=>atomicDistribution(result.distribution,sampleQuestions),[result.distribution,sampleQuestions]);
  const questionOptions = useMemo(()=>distributionOptions(sampleQuestions),[sampleQuestions]);
  useEffect(() => {
    if (!questionOptions.some(q=>q.value===selectedQuestion)) setSelectedQuestion(questionOptions[0]?.value ?? '');
  }, [questionOptions, selectedQuestion]);
  useEffect(()=>{
    if(!survey || !sampleScoped){setSampleDistribution(result.distribution);setDistributionBusy(false);setDistributionError('');return;}
    const controller=new AbortController();let cancelled=false;
    setDistributionBusy(true);setDistributionError('');setSampleDistribution([]);
    const loadDistribution=async()=>{
      const sessionIds=sampleRespondents.map(person=>person.id);
      try {return (await api.post(`/admin/surveys/${survey.id}/results/distribution`,{sessionIds},{signal:controller.signal})).data;}
      catch(error:any){
        if(error?.response?.status!==404)throw error;
        // Older APIs have no scoped aggregate endpoint; use their existing
        // authorized details endpoint to count only this sample's answers.
        const rows:Result['distribution']=[];
        for(let start=0;start<sessionIds.length;start+=100){
          const response=await api.post(`/admin/surveys/${survey.id}/results/details`,{sessionIds:sessionIds.slice(start,start+100)},{signal:controller.signal});
          for(const person of response.data as Respondent[])for(const group of person.groups)for(const answer of group.answers){
            const question=sampleQuestions.find(q=>q.questionId===answer.questionId);
            rows.push({questionId:answer.questionId,code:answer.code,text:answer.question,type:answer.type??question?.type,value:answer.value as string|number,label:answer.displayValue,count:1});
          }
        }
        return atomicDistribution(rows,sampleQuestions);
      }
    };
    loadDistribution()
      .then(distribution=>{if(!cancelled)setSampleDistribution(distribution);})
      .catch(()=>{if(!cancelled)setDistributionError('Не удалось обновить распределение текущей выборки.');})
      .finally(()=>{if(!cancelled)setDistributionBusy(false);});
    return ()=>{cancelled=true;controller.abort();};
  },[survey?.id,result.distribution,sampleConditions,sampleRespondents,distributionRetry,sampleQuestions,sampleScoped]);
  const chart = useMemo(() => atomicDistribution(sampleScoped?sampleDistribution:result.distribution,sampleQuestions)
    .filter(item=>distributionQuestionKey(item)===selectedQuestion)
    .map(item=>({answer:item.label ?? String(item.value),count:item.count})), [result.distribution,sampleDistribution,sampleScoped,selectedQuestion,sampleQuestions]);
  const removeSampleCondition=(question:string)=>{
    chartRequest.current++;setChartBusy(false);
    setSampleConditions(current=>current.filter(condition=>condition.question!==question));setPage(1);setSelected({});
  };
  const clearSample=()=>{chartRequest.current++;setChartBusy(false);setSampleConditions([]);setPage(1);setSelected({});};
  const applySample = async (draft:SampleDraft):Promise<boolean> => {
    if(!survey)return false;
    const request=++chartRequest.current,generation=resultGeneration.current;
    setChartBusy(true);
    try {
      const question=sampleQuestions.find(q=>q.questionId===draft.question);
      const allLabels=[...new Set(result.distribution.filter(q=>distributionQuestionKey(q)===draft.question).map(q=>q.label??String(q.value)))];
      const labels=draft.range?allLabels.filter(value=>value.trim()!==''&&Number.isFinite(Number(value))&&(!draft.range!.min.trim()||Number(value)>=Number(draft.range!.min))&&(!draft.range!.max.trim()||Number(value)<=Number(draft.range!.max))):draft.labels;
      const sessionIds=draft.question==='__age'?result.respondents.filter(person=>person.age!=null&&(!draft.range?.min.trim()||person.age>=Number(draft.range.min))&&(!draft.range?.max.trim()||person.age<=Number(draft.range.max))).map(person=>person.id)
        :labels.length?(await api.post(`/admin/surveys/${survey.id}/results/distribution-members`,{questionId:draft.question,labels:question?membershipLabels(result.distribution,question,labels):labels})).data.sessionIds:[];
      if(request!==chartRequest.current||generation!==resultGeneration.current)return false;
      setSampleConditions(current=>upsertSampleCondition(current,{question:draft.question,title:draft.question==='__age'?'Возраст':question?.text??'Вопрос',labels,sessionIds,range:draft.range}));
      setPage(1);setSelected({});return true;
    } catch {message.error('Не удалось применить условие. Попробуйте ещё раз.');return false;}
    finally {if(request===chartRequest.current)setChartBusy(false);}
  };
  const applyChartFilter=async(labels:string[],range?:{min:string;max:string})=>{
    if(!labels.length&&!range){removeSampleCondition(selectedQuestion);return;}
    await applySample({question:selectedQuestion,labels,range});
  };
  const completed = result.respondents.filter(
    (x) => x.status === "completed",
  ).length;
  const resultSections = result.sections.length
    ? result.sections
    : methodCodes.map((code) => ({
        code,
        title: shortNames[code],
        sectionKind: "verified",
      }));
  const selectedRespondents = visibleRespondents.filter(
    (person) => selected[person.id],
  );
  const allSelected = pageRespondents.length > 0 && pageRespondents.every(person=>selected[person.id]);
  const loadDetails = async (person: Respondent): Promise<Respondent> => {
    if(person.detailsLoaded!==false) return person;
    if(details[person.id]) return details[person.id];
    const pending = pendingDetails.current.get(person.id);
    if(pending) return pending;
    const generation = resultGeneration.current;
    setDetailErrors(current=>({...current,[person.id]:false}));
    const request = api.post(`/admin/surveys/${survey!.id}/results/details`, {sessionIds:[person.id]})
      .then(response=>{
        const full = (response.data as Respondent[]).find(item=>item.id===person.id);
        if(!full) throw new Error('Результат больше недоступен');
        if(generation===resultGeneration.current) setDetails(current=>({...current,[person.id]:full}));
        return full;
      }).catch(error=>{ if(generation===resultGeneration.current) setDetailErrors(current=>({...current,[person.id]:true})); throw error; })
      .finally(()=>{ if(pendingDetails.current.get(person.id)===request) pendingDetails.current.delete(person.id); });
    pendingDetails.current.set(person.id,request);
    return request;
  };
  const changePage = (nextPage: number) => {
    setPage(nextPage);
    document.querySelector('[data-quality-respondents]')?.scrollIntoView({block:'start'});
  };
  const changePageSize = (size: number) => {
    setPageSize(size); setPage(1);
    try { localStorage.setItem('statistics-page-size',String(size)); } catch { /* Storage may be unavailable in private mode. */ }
  };
  const pagination = <RespondentPagination total={visibleRespondents.length} page={currentPage} pageSize={pageSize} onChange={changePage} onSizeChange={changePageSize}/>;
  if(loadError)return <p role="alert">{loadError}</p>;
  if (loading)
    return (
      <Page
        as={embedded ? "div" : "main"}
        style={
          embedded
            ? { minHeight: "auto", background: "transparent" }
            : undefined
        }
      >
        <Wrap $embedded={embedded}>
          <SkeletonScreen variant="dashboard" />
        </Wrap>
      </Page>
    );
  const download = async (selection: ExportSelection) => {
    const exportPeople = selection.scope === 'all' ? result.respondents : selection.scope === 'filtered' ? visibleRespondents : selectedRespondents;
    const exportSections = resultSections.filter(section => selection.sectionKeys.includes(sectionKey(section))).map(section => ({
      ...section,
      questions: (result.questions ?? []).filter(question => question.sectionCode === section.code).map(question => ({ questionId: question.questionId, code: question.code, question: question.text })),
    }));
    if (!exportPeople.length || !exportSections.length) return;
    const generation = resultGeneration.current;
    setExporting(true);
    try {
      const fullById = new Map<string,Respondent>();
      const missing = exportPeople.filter(person=>person.detailsLoaded===false && !details[person.id]);
      for(let start=0;start<missing.length;start+=100) {
        const response = await api.post(`/admin/surveys/${survey!.id}/results/details`, {sessionIds:missing.slice(start,start+100).map(person=>person.id)});
        for(const person of response.data as Respondent[]) fullById.set(person.id,person);
      }
      if (generation !== resultGeneration.current) throw new Error("Survey changed during export");
      await exportRespondents(exportPeople.map(person => {
        const full = fullById.get(person.id) ?? details[person.id] ?? person;
        if(full.detailsLoaded===false) throw new Error('Часть результатов недоступна');
        return full;
      }), exportSections, {
        schemaPeople: result.respondents,
        respondentNumbers: Object.fromEntries(result.respondents.map((person, index) => [person.id, index + 1])),
      });
      setExportOpen(false);
    } catch { message.error('Не удалось подготовить экспорт. Попробуйте ещё раз.');
    } finally {
      setExporting(false);
    }
  };
  const refreshResults = async () => {
    if (!survey) return;
    const response = await api.get(`/admin/surveys/${survey.id}/results`, {params:{summary:1}});
    resultGeneration.current++; setDetails({}); setDetailErrors({}); pendingDetails.current.clear();
    chartRequest.current++;setChartBusy(false);setSampleConditions([]);setSelected({});setResult(response.data);
  };
  const moveToTrash = async () => {
    if (!survey || !selectedRespondents.length) return;
    setUpdatingTrash(true);
    try {
      await api.post(`/admin/surveys/${survey.id}/results/trash`, {
        sessionIds: selectedRespondents.map((x) => x.id),
      },{headers:{'X-Survey-Version':result.version}});
      setSelected({});
      setConfirmTrash(false);
      await refreshResults();
    } catch(e) {message.error(getApiErrorMessage(e,'Не удалось изменить результаты'));} finally {
      setUpdatingTrash(false);
    }
  };
  const restore = async () => {
    if (!survey) return;
    const sessionIds = result.deletedRespondents
      .filter((x) => deletedSelected[x.id])
      .map((x) => x.id);
    if (!sessionIds.length) return;
    setUpdatingTrash(true);
    try {
      await api.post(`/admin/surveys/${survey.id}/results/restore`, {
        sessionIds,
      },{headers:{'X-Survey-Version':result.version}});
      setDeletedSelected({});
      await refreshResults();
    } catch(e) {message.error(getApiErrorMessage(e,'Не удалось восстановить ответы'));} finally {
      setUpdatingTrash(false);
    }
  };
  return (
    <Page
      as={embedded ? "div" : "main"}
      style={
        embedded ? { minHeight: "auto", background: "transparent" } : undefined
      }
    >
      {saveSampleOpen && survey && <SaveSampleModal surveyId={survey.id} people={result.respondents} filtered={visibleRespondents} selected={selectedRespondents} conditions={sampleConditions} completedOnly={qualityView.status==='completed'} onClose={()=>setSaveSampleOpen(false)} />}
      {exportOpen && <ResultsExportModal sections={resultSections} selectedCount={selectedRespondents.length} filteredCount={visibleRespondents.length} totalCount={result.respondents.length} busy={exporting} onCancel={() => setExportOpen(false)} onExport={selection => void download(selection)} />}
      <Wrap $embedded={embedded}>
        {!embedded && (
          <Header>
            <div className="brand">
              <Leaf /> <BrandWordmark /> · кабинет
            </div>
            <Button
              aria-label="Выйти"
              onClick={async () => {
                await logout();
                nav(
                  location.pathname.startsWith("/admin")
                    ? "/admin/login"
                    : "/login",
                );
              }}
            >
              <LogOut size={18} />
            </Button>
          </Header>
        )}
        <SurveyTitleRow>
          <h1>{survey?.title ?? "Исследование"}</h1>
          <div className="title-actions">
            {statisticsAllowed&&<ResultsAction $emphasized aria-pressed={statisticsOpen} onClick={()=>{setStatisticsOpen(value=>!value)}}><Calculator size={16}/>Статистический анализ</ResultsAction>}
            {survey&&!inspectionOwnerId&&<ResultsAction onClick={()=>nav(`/app/surveys/${survey.id}/preview`)}><Eye size={16}/>Посмотреть опрос</ResultsAction>}
            {survey&&<ResultsAction onClick={()=>void refreshResults().catch(()=>message.error('Не удалось обновить результаты'))}><RefreshCw size={16}/>Обновить результаты</ResultsAction>}
            {survey && <div className="participant-share" role="group" aria-label="Ссылка для участников">
              <div className="participant-address"><span className="share-label">Ссылка для участников</span><span className="participant-url" title={`${location.origin}/s/${survey.slug}`}>{location.origin}/s/{survey.slug}</span></div>
              <Button className="copy-participant-link" aria-label="Скопировать ссылку для участников" title="Скопировать ссылку для участников" onClick={async () => {
                try { await navigator.clipboard.writeText(`${location.origin}/s/${survey.slug}`); message.success("Ссылка скопирована"); }
                catch { message.error("Не удалось скопировать ссылку. Её можно выделить вручную."); }
              }}><Copy size={16} /></Button>
            </div>}
          {survey && access?.canManage&&<ResultsAction onClick={()=>setSharing(true)}><Users size={16}/>Совместный доступ</ResultsAction>}
          {survey && !readOnly && !location.pathname.startsWith("/admin") && (
            <Button
              className="edit-survey"
              onClick={() => nav(`/app/surveys/${survey.id}/edit`)}
            >
              <Pencil size={14} /> Редактировать
            </Button>
          )}
          </div>
        </SurveyTitleRow>
        {!statisticsOpen&&<Grid>
          <Stat>
            <Users />
            <div>
              <b>{result.respondents.length}</b>
              <span title="Все прохождения этого опроса, кроме удалённых, включая незавершённые.">всего участников</span>
            </div>
          </Stat>
          <Stat>
            <CheckCircle2 />
            <div>
              <b>{completed}</b>
              <span title="Количество прохождений со статусом «Завершено».">завершили</span>
            </div>
          </Stat>
          <Stat>
            <Clock3 />
            <div>
              <b>
                {result.respondents.length
                  ? Math.round((completed / result.respondents.length) * 100)
                  : 0}
                %
              </b>
              <span title="Число завершённых прохождений / число всех участников × 100%, с округлением до целого.">завершаемость</span>
            </div>
          </Stat>
        </Grid>}
        {statisticsOpen&&statisticsAllowed&&survey&&<Suspense fallback={<SkeletonScreen variant="table" heading={false} label="Загрузка статистического анализа" />}><StatisticsWorkspace key={survey.id} surveyId={survey.id} onClose={()=>setStatisticsOpen(false)}/></Suspense>}
        {!statisticsOpen&&<>
        <Panel className="respondents-panel" data-quality-respondents>
          <ResultsSelection view={qualityView} onSort={view=>{setQualityView(view);setPage(1);setSelected({});}} sortOptions={sortOptions} conditions={sampleConditions} onApply={applySample} onRemove={removeSampleCondition} onClear={clearSample} questions={sampleQuestions} distribution={allAnswerOptions} hasAge={sortOptions.some(option=>option.value==='age')} visible={visibleRespondents.length} total={result.respondents.length} busy={chartBusy} saveAction={statisticsAllowed&&!readOnly ? <ResultsAction onClick={()=>{setSaveSampleOpen(true)}}><Save size={16}/>Сохранить выборку · {selectedRespondents.length || visibleRespondents.length}</ResultsAction> : undefined}/>



          <RespondentResults
            key={survey?.id}
            readOnly={readOnly}
            showGender={result.hasGender===true}
            showAge={sortOptions.some(o=>o.value==='age')}
            sortKey={qualityView.sort}
            sortDirection={qualityView.sort==='newest'?'desc':qualityView.sort==='oldest'?'asc':qualityView.direction}
            methodSortOptions={sortOptions}
            onColumnSort={(sort,direction)=>{setQualityView(v=>({...v,sort:sort as QualityView['sort'],direction}));setPage(1);}}
            ageSortDirection={qualityView.sort==='age'?qualityView.direction:undefined}
            onSortAge={()=>{setQualityView(v=>({...v,sort:'age',direction:v.sort==='age'&&v.direction==='asc'?'desc':'asc'}));setPage(1);}}
            respondents={pageRespondents}
            totalCount={visibleRespondents.length}
            qualities={qualities}
            deletedRespondents={result.deletedRespondents}
            sections={resultSections}
            selected={selected}
            deletedSelected={deletedSelected}
            expanded={expanded}
            allSelected={allSelected}
            selectedCount={selectedRespondents.length}
            trashOpen={trashOpen}
            exporting={exporting}
            updatingTrash={updatingTrash}
            adminView={location.pathname.startsWith("/admin")}
            onSelectAll={(checked) => setSelected(current=>({...current,...Object.fromEntries(pageRespondents.map(person=>[person.id,checked]))}))}
            onSelectRespondent={(id, checked) =>
              setSelected((current) => ({ ...current, [id]: checked }))
            }
            onSelectDeleted={(id, checked) =>
              setDeletedSelected((current) => ({ ...current, [id]: checked }))
            }
            onToggleExpanded={(id) => {
              setExpanded((current) => ({ ...current, [id]: !current[id] }));
              const person=result.respondents.find(person=>person.id===id);
              if(person && !expanded[id]) void loadDetails(person).catch(()=>{});
            }}
            onToggleTrash={() => setTrashOpen((current) => !current)}
            onDeleteSelected={() => setConfirmTrash(true)}
            onExport={() => setExportOpen(true)}
            onRestore={restore}
            renderMethodHelp={group => methodologies[group.code] ? <Button className="method-help" onClick={()=>setActiveMethodology(methodologies[group.code])}><CircleHelp size={13}/>Как считается</Button> : null}
            renderMethodResult={(group) => <MethodScoreSummary group={group} />}
            getRespondentGroups={summary => (details[summary.id] ?? summary).groups}
            renderRespondentDetails={(summary, groupCode) => {
              const person=details[summary.id]??summary;
              if(person.detailsLoaded===false) return <div style={{padding:18}}>{detailErrors[person.id]?<><p role="alert">Не удалось загрузить ответы.</p><Button onClick={()=>void loadDetails(person).catch(()=>{})}>Повторить</Button></>:<SkeletonScreen variant="details" heading={false} label="Загрузка подробных ответов" />}</div>;
              const quality=person.qualityV2??qualities[person.id];
              return (
              <>
              {(!groupCode || groupCode === '__quality') && <QualityDetails value={quality} inline={groupCode === '__quality'} />}
              {groupCode && groupCode !== '__quality' && <RespondentAnswerDetails
                groupCode={groupCode}
                respondent={person}
                quality={quality}
                methodologies={methodologies}
                onShowMethodology={setActiveMethodology}
                renderResult={(group) => (
                  <MethodologyInterpretation group={group} />
                )}
              />}
              </>
            );}}
          />
          {pagination}
        </Panel>
        <Panel><QualityOverview people={result.respondents} qualities={qualities} />{survey && !readOnly && <QualityAdministration surveyId={survey.id} surveyVersion={result.version} selectedIds={selectedRespondents.map(p => p.id)} onUpdated={refreshResults} />}</Panel>
        <AnswerDistribution
          data={chart}
          options={questionOptions}
          selectedQuestion={selectedQuestion}
          onQuestionChange={setSelectedQuestion}
          appliedLabels={sampleConditions.find(condition=>condition.question===selectedQuestion)?.labels??[]}
          onApply={(labels,range)=>void applyChartFilter(labels,range)}
          conditions={sampleConditions}
          onRemoveCondition={removeSampleCondition}
          sampleCount={sampleRespondents.length}
          completedOnly={qualityView.status==='completed'}
          loading={distributionBusy}
          error={distributionError}
          onRetry={()=>setDistributionRetry(value=>value+1)}
          busy={chartBusy}
          numeric={(result.questions ?? result.distribution).find(q=>distributionQuestionKey(q)===selectedQuestion)?.type==='number'}
        />
        {activeMethodology && (
          <MethodologyModal
            methodology={activeMethodology}
            onClose={() => setActiveMethodology(null)}
          />
        )}{" "}
        {confirmTrash && (
          <ConfirmOverlay
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !updatingTrash)
                setConfirmTrash(false);
            }}
          >
            <ConfirmModal
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-results-title"
            >
              <Button
                className="close"
                aria-label="Закрыть"
                disabled={updatingTrash}
                onClick={() => setConfirmTrash(false)}
              >
                <X size={17} />
              </Button>
              <h2 id="delete-results-title">
                Переместить результаты в корзину?
              </h2>
              <p>
                Вы выбрали {selectedRespondents.length}{" "}
                {selectedRespondents.length === 1
                  ? "результат респондента"
                  : "результата респондентов"}
                .
              </p>
              <div className="warning">
                Ответы и рассчитанные показатели сохранятся. Их можно
                восстановить из корзины в нижней части таблицы.
              </div>
              <div className="buttons">
                <Button
                  className="cancel"
                  disabled={updatingTrash}
                  onClick={() => setConfirmTrash(false)}
                >
                  Отмена
                </Button>
                <Button
                  className="confirm"
                  disabled={updatingTrash}
                  onClick={moveToTrash}
                >
                  <Trash2 size={14} />
                  {updatingTrash ? "Перемещаем…" : "В корзину"}
                </Button>
              </div>
            </ConfirmModal>
          </ConfirmOverlay>
        )}
        </>}
        {sharing&&survey&&<SurveySharing surveyId={survey.id} onClose={()=>setSharing(false)}/>}
      </Wrap>
    </Page>
  );
}
