import { useReactTable, getCoreRowModel, getSortedRowModel } from '@tanstack/react-table';
import { methodSortValue } from './selection';
import { distributionOptions, methodSortOptions } from "./selection";
import { distributionQuestionKey } from "./components/AnswerDistribution/questionKey";
import { SurveySharing } from '../../components/SurveySharing';
import { getApiErrorMessage } from '../../utils/apiErrors';
import { usePageTitle } from "../../pageTitle";
import { BrandWordmark } from "../../components/BrandWordmark";
import { useEffect, useMemo, useRef, useState } from "react";
import { message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  CircleHelp,
  CheckCircle2,
  Clock3,
  Copy,
  Leaf,
  LogOut,
  Pencil,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { api, logout, useDemoFallbacks } from "../../api";
import { Button, Page, SkeletonScreen } from "../../ui";
import { exportRespondents } from "../../admin/exportResults";
import { QualityOverview, QualityControls, QualityDetails, QualityAdministration } from "./components/ResponseQuality";
import { applyQualityView, DEFAULT_QUALITY_VIEW, metricValue, type MetricKey, type QualityView } from "./quality";
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
export function Dashboard({ embedded = false, inspectionOwnerId }: { embedded?: boolean; inspectionOwnerId?: string }) {
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
  const [chartFilter, setChartFilter] = useState<{question:string;labels:string[];sessionIds:string[]} | null>(null);
  const [chartBusy,setChartBusy]=useState(false);
  const chartRequest=useRef(0);
  const chartIds = useMemo(()=>chartFilter ? new Set(chartFilter.sessionIds) : null,[result.distribution,chartFilter]);
  const filteredRespondents = useMemo(() => applyQualityView(result.respondents.filter(p=>!chartIds || chartIds.has(p.id)), qualities, qualityView), [result.respondents, qualities, qualityView,chartIds]);
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
  const sortColumns = useMemo(()=>[{id:'value',accessorFn:sortValue,sortUndefined:'last' as const,sortingFn:'auto' as const}], [qualityView.sort,qualities]);
  const sortedTable = useReactTable({data:filteredRespondents,columns:sortColumns,getCoreRowModel:getCoreRowModel(),getSortedRowModel:getSortedRowModel(),autoResetPageIndex:false,state:{sorting:[{id:'value',desc:qualityView.sort==='newest'||(!['oldest','insufficient'].includes(qualityView.sort)&&qualityView.direction==='desc')}]}});
  const visibleRespondents = sortedTable.getRowModel().rows.map(row=>row.original);
  const currentPage = Math.min(page, Math.max(1, Math.ceil(visibleRespondents.length / pageSize)));
  const pageRespondents = useMemo(() => visibleRespondents.slice((currentPage - 1) * pageSize, currentPage * pageSize), [visibleRespondents, currentPage, pageSize]);
  useEffect(() => { setPage(currentPage); }, [currentPage]);
  useEffect(() => { setQualityView({ ...DEFAULT_QUALITY_VIEW, filters: [] }); setSelected({}); chartRequest.current++; setChartBusy(false); setChartFilter(null); setSelectedQuestion(''); setPage(1); setExpanded({}); }, [surveyId]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [deletedSelected, setDeletedSelected] = useState<
    Record<string, boolean>
  >({});
  const [exporting, setExporting] = useState(false);
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
  const questionOptions = useMemo(()=>distributionOptions(result.questions ?? result.distribution),[result.questions,result.distribution]);
  useEffect(() => {
    if (!questionOptions.some(q=>q.value===selectedQuestion)) setSelectedQuestion(questionOptions[0]?.value ?? '');
  }, [questionOptions, selectedQuestion]);
  const chart = useMemo(() => result.distribution
    .filter(item=>distributionQuestionKey(item)===selectedQuestion)
    .map(item=>({answer:item.label ?? String(item.value),count:item.count})), [result.distribution,selectedQuestion]);
  const applyChartFilter = async (labels: string[]) => {
    if(!survey)return;
    const request=++chartRequest.current, generation=resultGeneration.current;
    setChartBusy(true);
    try {
      const sessionIds=labels.length ? (await api.post(`/admin/surveys/${survey.id}/results/distribution-members`,{questionId:selectedQuestion,labels})).data.sessionIds : [];
      if(request!==chartRequest.current || generation!==resultGeneration.current)return;
      setChartFilter(labels.length ? {question:selectedQuestion,labels,sessionIds} : null);
      setPage(1);setSelected({});
      requestAnimationFrame(()=>document.querySelector('[data-quality-respondents]')?.scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
    } catch { message.error('Не удалось загрузить выборку. Повторите выбор столбцов.'); }
    finally {if(request===chartRequest.current)setChartBusy(false);}
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
  const download = async () => {
    setExporting(true);
    try {
      const fullById = new Map<string,Respondent>();
      const missing = selectedRespondents.filter(person=>person.detailsLoaded===false && !details[person.id]);
      for(let start=0;start<missing.length;start+=100) {
        const response = await api.post(`/admin/surveys/${survey!.id}/results/details`, {sessionIds:missing.slice(start,start+100).map(person=>person.id)});
        for(const person of response.data as Respondent[]) fullById.set(person.id,person);
      }
      await exportRespondents(selectedRespondents.map(person => {
        const full = fullById.get(person.id) ?? details[person.id] ?? person;
        if(full.detailsLoaded===false) throw new Error('Часть результатов недоступна');
        return {...full,qualityMetrics:full.qualityV2??qualities[person.id]};
      }));
    } catch { message.error('Не удалось подготовить экспорт. Попробуйте ещё раз.');
    } finally {
      setExporting(false);
    }
  };
  const refreshResults = async () => {
    if (!survey) return;
    const response = await api.get(`/admin/surveys/${survey.id}/results`, {params:{summary:1}});
    resultGeneration.current++; setDetails({}); setDetailErrors({}); pendingDetails.current.clear();
    chartRequest.current++;setChartBusy(false);setChartFilter(null);setSelected({});setResult(response.data);
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
            {survey&&!inspectionOwnerId&&<Button onClick={()=>nav(`/app/surveys/${survey.id}/preview`)}>Посмотреть опрос</Button>}
            {survey&&<Button onClick={()=>void refreshResults().catch(()=>message.error('Не удалось обновить результаты'))}>Обновить результаты</Button>}
            {survey && <div className="participant-share" role="group" aria-label="Ссылка для участников">
              <div className="participant-address"><span className="share-label">Ссылка для участников</span><span className="participant-url" title={`${location.origin}/s/${survey.slug}`}>{location.origin}/s/{survey.slug}</span></div>
              <Button className="copy-participant-link" aria-label="Скопировать ссылку для участников" title="Скопировать ссылку для участников" onClick={async () => {
                try { await navigator.clipboard.writeText(`${location.origin}/s/${survey.slug}`); message.success("Ссылка скопирована"); }
                catch { message.error("Не удалось скопировать ссылку. Её можно выделить вручную."); }
              }}><Copy size={16} /></Button>
            </div>}
          {survey && access?.canManage&&<Button onClick={()=>setSharing(true)}><Users size={14}/>Совместный доступ</Button>}
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
        <Grid>
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
        </Grid>
        <Panel className="respondents-panel" data-quality-respondents>
          <QualityControls onReset={()=>{chartRequest.current++;setChartBusy(false);setChartFilter(null);}} sortOptions={sortOptions} view={qualityView} onChange={view => { setQualityView(view); setSelected({}); setPage(1); }} visible={visibleRespondents.length} total={result.respondents.length} />
          {chartFilter && <div className="chart-filter-notice" role="status"><span>Выборка из графика: <strong>{result.distribution.find(q=>distributionQuestionKey(q)===chartFilter.question)?.text}</strong> · {chartFilter.labels.join(', ')}</span><Button onClick={()=>{setChartFilter(null);setPage(1);setSelected({});}}>Сбросить выборку</Button></div>}
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
            onExport={download}
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
        {sharing&&survey&&<SurveySharing surveyId={survey.id} onClose={()=>setSharing(false)}/>}
        <AnswerDistribution
          data={chart}
          options={questionOptions}
          selectedQuestion={selectedQuestion}
          onQuestionChange={setSelectedQuestion}
          appliedLabels={chartFilter?.question===selectedQuestion?chartFilter.labels:[]}
          onApply={labels=>void applyChartFilter(labels)}
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
      </Wrap>
    </Page>
  );
}
