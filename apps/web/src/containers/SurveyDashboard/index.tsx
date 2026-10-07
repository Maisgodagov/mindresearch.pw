import { useEffect, useMemo, useRef, useState } from "react";
import { message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
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
import { exportRespondents, exportQualityCsv } from "../../admin/exportResults";
import { QuestionTiming } from "./components/QuestionTiming";
import { QualityOverview, QualityControls, QualityDetails, QualityAdministration } from "./components/ResponseQuality";
import { applyQualityView, DEFAULT_QUALITY_VIEW, type QualityView } from "./quality";
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

import type { SurveyRow, Result, Respondent, QuestionTimingRow } from "./types";
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
export function Dashboard({ embedded = false }: { embedded?: boolean }) {
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
  const [timingSummary, setTimingSummary] = useState<QuestionTimingRow[] | undefined>();
  const [timingLoading, setTimingLoading] = useState(false);
  const [timingError, setTimingError] = useState(false);
  const [timingReload, setTimingReload] = useState(0);
  const [qualityView, setQualityView] = useState<QualityView>({ ...DEFAULT_QUALITY_VIEW, filters: [] });
  const qualities = useMemo(() => Object.fromEntries(result.respondents.flatMap(p => p.qualityV2 ? [[p.id, p.qualityV2]] : [])), [result.respondents]);
  const visibleRespondents = useMemo(() => applyQualityView(result.respondents, qualities, qualityView), [result.respondents, qualities, qualityView]);
  const currentPage = Math.min(page, Math.max(1, Math.ceil(visibleRespondents.length / pageSize)));
  const pageRespondents = useMemo(() => visibleRespondents.slice((currentPage - 1) * pageSize, currentPage * pageSize), [visibleRespondents, currentPage, pageSize]);
  useEffect(() => { setPage(currentPage); }, [currentPage]);
  useEffect(() => { setQualityView({ ...DEFAULT_QUALITY_VIEW, filters: [] }); setSelected({}); setPage(1); setExpanded({}); }, [surveyId]);
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
    setLoading(true); setDetails({}); setDetailErrors({}); pendingDetails.current.clear();
    api
      .get("/admin/surveys", {signal: controller.signal})
      .then(async (r) => {
        if(cancelled) return;
        setSurveys(r.data);
        const target =
          r.data.find((s: SurveyRow) => s.id === surveyId) ?? r.data[0];
        if (target) {
          const x = await api.get(`/admin/surveys/${target.id}/results`, {params:{summary:1}, signal:controller.signal});
          if(!cancelled) setResult(x.data);
        }
      })
      .catch(() => {
        if(cancelled) return;
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
  }, [nav, surveyId]);
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
  useEffect(() => {
    setTimingSummary(undefined); setTimingError(false);
    if(loading || !survey || !result.respondents.some(person=>person.detailsLoaded===false)) { setTimingLoading(false); return; }
    const controller = new AbortController(); let cancelled = false;
    setTimingLoading(true);
    api.get(`/admin/surveys/${survey.id}/results/timing`, {signal:controller.signal})
      .then(response=>{ if(!cancelled) setTimingSummary(response.data); })
      .catch(()=>{ if(!cancelled) setTimingError(true); })
      .finally(()=>{ if(!cancelled) setTimingLoading(false); });
    return ()=>{ cancelled=true; controller.abort(); };
  }, [loading, survey?.id, result.respondents, timingReload]);
  const questions = useMemo(
    () => [
      ...new Map(result.distribution.map((x) => [x.code, x.text])).entries(),
    ],
    [result],
  );
  const questionOptions = useMemo(
    () => questions.map(([value, label]) => ({ value, label })),
    [questions],
  );
  useEffect(() => {
    if (!selectedQuestion && questions[0]) setSelectedQuestion(questions[0][0]);
  }, [questions, selectedQuestion]);
  const chart = useMemo(() => {
    const counts = new Map<string, number>();
    for (const respondent of result.respondents) {
      for (const group of respondent.groups) {
        for (const answer of group.answers) {
          if (answer.code !== selectedQuestion) continue;
          const label = answer.displayValue || String(answer.value ?? "");
          counts.set(label, (counts.get(label) ?? 0) + 1);
        }
      }
    }
    if (counts.size) {
      return Array.from(counts, ([answer, count]) => ({ answer, count }));
    }
    return result.distribution
      .filter((item) => item.code === selectedQuestion)
      .map((item) => ({
        answer: item.label ?? String(item.value).replace(/^"|"$/g, ""),
        count: item.count,
      }));
  }, [result, selectedQuestion]);
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
    setResult(response.data);
  };
  const moveToTrash = async () => {
    if (!survey || !selectedRespondents.length) return;
    setUpdatingTrash(true);
    try {
      await api.post(`/admin/surveys/${survey.id}/results/trash`, {
        sessionIds: selectedRespondents.map((x) => x.id),
      });
      setSelected({});
      setConfirmTrash(false);
      await refreshResults();
    } finally {
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
      });
      setDeletedSelected({});
      await refreshResults();
    } finally {
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
      <Wrap $embedded={embedded} data-onboarding={embedded ? "survey-results" : undefined}>
        {!embedded && (
          <Header>
            <div className="brand">
              <Leaf /> mindresearch · кабинет
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
          {survey && !location.pathname.startsWith("/admin") && (
            <Button
              className="edit-survey"
              onClick={() => nav(`/app/surveys/${survey.id}/edit`)}
            >
              <Pencil size={14} /> Редактировать
            </Button>
          )}
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
        <Panel className="share-panel">
          <div className="share-heading">
            <h2>Ссылка для участников</h2>
          </div>
          <div className="share-content">
            <div className="link">{location.origin}/s/{survey?.slug}</div>
            <Button
              className="copy-link"
              onClick={() =>
                navigator.clipboard.writeText(
                  `${location.origin}/s/${survey?.slug}`,
                )
              }
            >
              <Copy size={14} /> Скопировать
            </Button>
          </div>
        </Panel>
        <Panel><QualityOverview people={result.respondents} qualities={qualities} />{survey && <QualityAdministration surveyId={survey.id} selectedIds={selectedRespondents.map(p => p.id)} onUpdated={refreshResults} />}</Panel>
        <Panel className="respondents-panel" data-quality-respondents>
          <QualityControls view={qualityView} onChange={view => { setQualityView(view); setSelected({}); setPage(1); }} visible={visibleRespondents.length} total={result.respondents.length} selectedCount={selectedRespondents.length} onExport={()=>exportQualityCsv(selectedRespondents.map(p=>({...p,qualityMetrics:qualities[p.id]})))} />
          {pagination}
          {selectedRespondents.length>0&&<p style={{fontSize:12,color:'#526557'}}>Выбрано {selectedRespondents.length}. Выбор сохраняется при переходе между страницами.</p>}
          <RespondentResults
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
            renderMethodResult={(group) => <MethodScoreSummary group={group} />}
            renderRespondentDetails={(summary) => {
              const person=details[summary.id]??summary;
              if(person.detailsLoaded===false) return <div style={{padding:18}}>{detailErrors[person.id]?<><p role="alert">Не удалось загрузить ответы.</p><Button onClick={()=>void loadDetails(person).catch(()=>{})}>Повторить</Button></>:<p role="status">Загружаем подробные ответы…</p>}</div>;
              const quality=person.qualityV2??qualities[person.id];
              return (
              <>
              <QualityDetails value={quality} />
              <RespondentAnswerDetails
                respondent={person}
                quality={quality}
                methodologies={methodologies}
                onShowMethodology={setActiveMethodology}
                renderResult={(group) => (
                  <MethodologyInterpretation group={group} />
                )}
              />
              </>
            );}}
          />
          {pagination}
        </Panel>
        <QuestionTiming respondents={result.respondents} summary={timingSummary} loading={timingLoading} error={timingError} onRetry={()=>setTimingReload(value=>value+1)} />
        <AnswerDistribution
          data={chart}
          options={questionOptions}
          selectedQuestion={selectedQuestion}
          onQuestionChange={setSelectedQuestion}
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
