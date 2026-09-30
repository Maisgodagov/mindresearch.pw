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

export function RespondentResults({
  respondents,
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
      <div className="toolbar">
        <h2>{copy.title}</h2>
        <div className="toolbar">
          <Button
            disabled={!selectedCount || updatingTrash}
            onClick={onDeleteSelected}
          >
            <Trash2 size={16} /> {copy.delete}
            {selectedCount ? ` (${selectedCount})` : ""}
          </Button>
          <Button disabled={!selectedCount || exporting} onClick={onExport}>
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
              <th>{copy.respondent}</th>
              <th>{copy.status}</th>
              <th>{copy.answers}</th>
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
                <tr>
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
                  <td>
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
                    <span className="pill">
                      {person.status === "completed"
                        ? copy.completed
                        : copy.inProgress}
                    </span>
                  </td>
                  <td>
                    {person.answered}
                    {adminView ? " / 208" : ""}
                  </td>
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
                  <tr>
                    <td colSpan={5 + sections.length}>
                      {renderRespondentDetails(person)}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
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
