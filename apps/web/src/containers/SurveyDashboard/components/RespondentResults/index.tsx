import { Fragment } from "react";
import {
  ArchiveRestore,
  ChevronDown,
  ChevronRight,
  Download,
  Trash2,
} from "lucide-react";
import { Button } from "../../../../ui";
import { FieldInput } from "../../../../components/FieldInput";
import { shortNames } from "../../const";
import { RESPONDENT_RESULTS_COPY as copy } from "./const";
import { Table, TableWrap, TrashBox, TrashToggle } from "./styles";
import type { RespondentResultsProps } from "./types";
import { percent, fasterText } from "../ResponseQuality";
import { formatQuestionTime } from "../QuestionTiming";
import type { Quality } from "../../quality";

const qualityColumns: { label: string; render: (value: Quality) => string; title: string }[] = [
  { label: "Индекс качества", render: value => percent(value.quality), title: "Эвристическая оценка, не вероятность валидности. Подробности — в раскрытых ответах." },
  { label: "Среднее / медиана", render: value => `${value.averageMs !== null ? formatQuestionTime(value.averageMs) : "—"} / ${value.medianMs !== null ? formatQuestionTime(value.medianMs) : "—"}`, title: "Время на вопрос, исключая служебный вопрос с псевдонимом" },
  { label: "Ответы < 1 сек", render: value => value.fastShare === null ? "—" : `${percent(value.fastShare)} (${value.fastCount}/${value.timed})`, title: "Доля и количество измеренных ответов быстрее секунды" },
  { label: "Быстрая серия", render: value => String(value.fastRun ?? "—"), title: "Самая длинная серия ответов быстрее секунды внутри блока" },
  { label: "Медианы вопросов", render: value => fasterText(value.questionFaster), title: "Сравнение с медианой времени каждого вопроса у других респондентов" },
  { label: "Опрос: среднее", render: value => fasterText(value.surveyFaster), title: "Активное время ответов относительно среднего у остальных" },
  { label: "Опрос: медиана", render: value => fasterText(value.surveyMedianFaster), title: "Активное время ответов относительно медианы у остальных" },
  { label: "С перерывами", render: value => fasterText(value.durationFaster), title: "Общее время прохождения относительно среднего у остальных" },
  { label: "Ускорение к концу", render: value => percent(value.acceleration), title: "Положительное значение — сокращение времени последней трети с учётом типичной скорости вопросов; отрицательное — замедление" },
  { label: "Одинаковая серия", render: value => String(value.sameRun ?? "—"), title: "Самая длинная серия одинаковых ответов в блоке с одинаковой шкалой" },
  { label: "Измерено", render: value => `${value.timed}/${value.total} (${Math.round(value.coverage)}%)`, title: "Покрытие отвеченных вопросов измерениями времени" },
];

function formatDuration(startedAt: string, completedAt: string | null) {
  if (!completedAt) return null;
  const milliseconds = Date.parse(completedAt) - Date.parse(startedAt);
  if (!Number.isFinite(milliseconds) || milliseconds < 0) return null;
  const seconds = Math.floor(milliseconds / 1000);
  return `${Math.floor(seconds / 60)} мин ${seconds % 60} сек`;
}

export function RespondentResults({
  respondents,
  qualities,
  deletedRespondents,
  sections,
  selected,
  deletedSelected,
  expanded,
  allSelected,
  selectedCount,
  trashOpen,
  exporting,
  updatingTrash,
  adminView,
  onSelectAll,
  onSelectRespondent,
  onSelectDeleted,
  onToggleExpanded,
  onToggleTrash,
  onDeleteSelected,
  onExport,
  onRestore,
  renderMethodResult,
  renderRespondentDetails,
}: RespondentResultsProps) {
  const selectedDeletedCount = Object.values(deletedSelected).some(Boolean);

  return (
    <>
      <div className="respondent-toolbar">
        <div className="respondent-title">
          <h2>{copy.title}</h2>
          <span className="respondent-count">Всего: {respondents.length}</span>
        </div>
        <div className="toolbar-actions">
          <Button
            className="bulk-action"
            disabled={!selectedCount || updatingTrash}
            onClick={onDeleteSelected}
          >
            <Trash2 size={16} /> {copy.delete}
            {selectedCount ? ` (${selectedCount})` : ""}
          </Button>
          <Button className="bulk-action" disabled={!selectedCount || exporting} onClick={onExport}>
            <Download size={16} />{" "}
            {exporting
              ? copy.preparing
              : `${copy.export}${selectedCount ? ` (${selectedCount})` : ""}`}
          </Button>
        </div>
      </div>
      <TableWrap>
        <Table>
          <thead>
            <tr>
              <th className="select">
                <FieldInput
                  type="checkbox"
                  aria-label={copy.selectAll}
                  checked={allSelected}
                  onChange={(event) => onSelectAll(event.target.checked)}
                />
              </th>
              <th className="respondent-col">{copy.respondent}</th>
              <th>{copy.status}</th>
              <th>{copy.answers}</th>
              <th className="duration-col" title="От начала до завершения опроса, включая перерывы">Время прохождения</th>
              {qualityColumns.map(column => <th key={column.label} title={column.title}>{column.label}</th>)}
              {sections.map((section) => (
                <th key={section.code}>
                  {shortNames[section.code] ?? section.title}
                </th>
              ))}
              <th>{copy.started}</th>
            </tr>
          </thead>
          <tbody>
          {respondents.map((person) => (
            <Fragment key={person.id}>
                <tr className={selected[person.id] ? "is-selected" : undefined}>
                  <td className="select">
                    <FieldInput
                      type="checkbox"
                      aria-label={`Выбрать ${person.alias}`}
                      checked={Boolean(selected[person.id])}
                      onChange={(event) =>
                        onSelectRespondent(person.id, event.target.checked)
                      }
                    />
                  </td>
                  <td className="respondent-col">
                    <div className="person">
                      <Button
                        className="expand"
                        aria-label={copy.showAnswers}
                        onClick={() => onToggleExpanded(person.id)}
                      >
                        {expanded[person.id] ? (
                          <ChevronDown size={17} />
                        ) : (
                          <ChevronRight size={17} />
                        )}
                      </Button>
                      {person.alias}
                    </div>
                  </td>
                  <td>
                    <span className={`pill ${person.status === "completed" ? "completed" : "in-progress"}`}>
                      {person.status === "completed"
                        ? copy.completed
                        : copy.inProgress}
                    </span>
                  </td>
                  <td>
                    {person.answered}
                    {adminView ? " / 208" : ""}
                  </td>
                  <td className="duration-col">
                    {person.status === "completed" ? (
                      <span title={person.completedAt && formatDuration(person.startedAt, person.completedAt) !== null ? "От начала до завершения опроса, включая перерывы" : "Нет данных о времени прохождения"}>
                        {formatDuration(person.startedAt, person.completedAt) ?? "—"}
                      </span>
                    ) : <span title="Опрос ещё не завершён">—</span>}
                  </td>
                  {qualityColumns.map(column => <td key={column.label} className="quality-col" title={column.label === "Индекс качества" ? qualities[person.id]?.unavailable || column.title : column.title}>{qualities[person.id] ? column.render(qualities[person.id]) : "—"}</td>)}
                  {sections.map((section) => (
                    <td key={section.code}>
                      {renderMethodResult(
                        person.groups.find(
                          (group) => group.code === section.code,
                        ),
                      )}
                    </td>
                  ))}
                  <td>{new Date(person.startedAt).toLocaleDateString("ru")}</td>
                </tr>
                {expanded[person.id] && (
                  <tr className="details-row">
                    <td className="details-cell" colSpan={6 + qualityColumns.length + sections.length}>
                      {renderRespondentDetails(person)}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
            {!respondents.length && (
              <tr>
                <td className="empty-state" colSpan={6 + qualityColumns.length + sections.length}>
                  Нет респондентов для отображения. Если применены фильтры, нажмите «Сбросить всё».
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </TableWrap>
      <TrashToggle onClick={onToggleTrash}>
        <Trash2 size={13} /> {copy.trash}
        {deletedRespondents.length
          ? ` (${deletedRespondents.length})`
          : ""}{" "}
        {trashOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
      </TrashToggle>
      {trashOpen && (
        <TrashBox>
          <div className="head">
            <span className="title">{copy.deletedTitle}</span>
            <Button
              disabled={!selectedDeletedCount || updatingTrash}
              onClick={onRestore}
            >
              <ArchiveRestore size={15} /> {copy.restore}
            </Button>
          </div>
          {deletedRespondents.length ? (
            <div className="items">
              {deletedRespondents.map((person) => (
                <label className="item" key={person.id}>
                  <FieldInput
                    type="checkbox"
                    checked={Boolean(deletedSelected[person.id])}
                    onChange={(event) =>
                      onSelectDeleted(person.id, event.target.checked)
                    }
                  />
                  <b>{person.alias}</b>
                  <span className="meta">{person.answered} ответов</span>
                  <span className="meta">
                    {copy.deletedAt}{" "}
                    {person.deletedAt
                      ? new Date(person.deletedAt).toLocaleDateString("ru")
                      : ""}
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <span className="pending">{copy.emptyTrash}</span>
          )}
        </TrashBox>
      )}
    </>
  );
}
