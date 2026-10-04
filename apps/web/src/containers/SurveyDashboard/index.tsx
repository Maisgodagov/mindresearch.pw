import { useEffect, useMemo, useState } from "react";
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
import { exportRespondents } from "../../admin/exportResults";
import { demoSurveys } from "../../platform/demo";
import {
  MethodologyModal,
  type Methodology,
} from "../../components/MethodologyModal";
import { AnswerDistribution } from "./components/AnswerDistribution";
import { RespondentResults } from "./components/RespondentResults";
import { RespondentDetails as RespondentAnswerDetails } from "./components/RespondentDetails";
import { MethodScoreSummary } from "./components/MethodScoreSummary";
import { MethodologyInterpretation } from "./components/MethodologyInterpretation";

import type { SurveyRow, Result } from "./types";
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
    api
      .get("/admin/surveys")
      .then(async (r) => {
        setSurveys(r.data);
        const target =
          r.data.find((s: SurveyRow) => s.id === surveyId) ?? r.data[0];
        if (target) {
          const x = await api.get(`/admin/surveys/${target.id}/results`);
          setResult(x.data);
        }
      })
      .catch(() => {
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
      .finally(() => setLoading(false));
  }, [nav, surveyId]);
  useEffect(() => {
    api
      .get("/admin/methodologies")
      .then((r) => setMethodologies(r.data))
      .catch(() => {});
  }, []);
  const survey = surveys.find((s) => s.id === surveyId) ?? surveys[0];
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
  const selectedRespondents = result.respondents.filter(
    (person) => selected[person.id],
  );
  const allSelected =
    result.respondents.length > 0 &&
    selectedRespondents.length === result.respondents.length;
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
      await exportRespondents(selectedRespondents);
    } finally {
      setExporting(false);
    }
  };
  const refreshResults = async () => {
    if (!survey) return;
    const response = await api.get(`/admin/surveys/${survey.id}/results`);
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
      <Wrap $embedded={embedded}>
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
              <span>всего участников</span>
            </div>
          </Stat>
          <Stat>
            <CheckCircle2 />
            <div>
              <b>{completed}</b>
              <span>завершили</span>
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
              <span>завершаемость</span>
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
        <Panel className="respondents-panel">
          <RespondentResults
            respondents={result.respondents}
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
            onSelectAll={(checked) =>
              setSelected(
                checked
                  ? Object.fromEntries(
                      result.respondents.map((person) => [person.id, true]),
                    )
                  : {},
              )
            }
            onSelectRespondent={(id, checked) =>
              setSelected((current) => ({ ...current, [id]: checked }))
            }
            onSelectDeleted={(id, checked) =>
              setDeletedSelected((current) => ({ ...current, [id]: checked }))
            }
            onToggleExpanded={(id) =>
              setExpanded((current) => ({ ...current, [id]: !current[id] }))
            }
            onToggleTrash={() => setTrashOpen((current) => !current)}
            onDeleteSelected={() => setConfirmTrash(true)}
            onExport={download}
            onRestore={restore}
            renderMethodResult={(group) => <MethodScoreSummary group={group} />}
            renderRespondentDetails={(person) => (
              <RespondentAnswerDetails
                respondent={person}
                methodologies={methodologies}
                onShowMethodology={setActiveMethodology}
                renderResult={(group) => (
                  <MethodologyInterpretation group={group} />
                )}
              />
            )}
          />
        </Panel>
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
