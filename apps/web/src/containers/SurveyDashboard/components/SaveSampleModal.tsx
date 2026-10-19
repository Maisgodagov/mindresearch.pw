import { useState } from "react";
import { Modal } from "antd";
import { Save } from "lucide-react";
import { api } from "../../../api";
import { SelectField } from "../../../components/SelectField";
import { getApiErrorMessage } from "../../../utils/apiErrors";
import type { Respondent } from "../types";
import type { SampleCondition } from "../selection";
import { Workspace } from "./StatisticsWorkspace/styles";
import { ResultsAction as Button } from "./ResultsAction";

type Props = {
  surveyId: string;
  people: Respondent[];
  filtered: Respondent[];
  selected: Respondent[];
  conditions: SampleCondition[];
  completedOnly: boolean;
  onClose: () => void;
};
export function SaveSampleModal({
  surveyId,
  people,
  filtered,
  selected,
  conditions,
  completedOnly,
  onClose,
}: Props) {
  const [scope, setScope] = useState(selected.length ? "selected" : "filtered");
  const [name, setName] = useState("");
  const [completed, setCompleted] = useState(!selected.length && completedOnly);
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const invalidAge =
    (min !== "" && (!Number.isFinite(Number(min)) || Number(min) < 0)) ||
    (max !== "" && (!Number.isFinite(Number(max)) || Number(max) < 0)) ||
    (min !== "" && max !== "" && Number(min) > Number(max));
  const base =
    scope === "selected" ? selected : scope === "all" ? people : filtered;
  const members = base.filter(
    (p) =>
      (!completed || p.status === "completed") &&
      ((!min && !max) ||
        (p.age != null &&
          (!min || p.age >= Number(min)) &&
          (!max || p.age <= Number(max)))),
  );
  async function save() {
    if (busy || !members.length || invalidAge) return;
    setBusy(true);
    setError("");
    try {
      const rules =
        scope === "all"
          ? []
          : conditions.map(({ question, title, labels, range }) => ({
              question,
              title,
              labels,
              range,
            }));
      if (min || max) {
        const index = rules.findIndex((c) => c.question === "__age");
        if (index >= 0) rules.splice(index, 1);
        rules.push({
          question: "__age",
          title: "Возраст",
          labels: [],
          range: { min, max },
        });
      }
      await api.post(`/admin/surveys/${surveyId}/statistics/samples`, {
        name,
        source: "selected",
        memberIds: members.map((p) => p.id),
        conditions: rules,
        completedOnly: completed,
      });
      onClose();
    } catch (e) {
      setError(getApiErrorMessage(e, "Не удалось сохранить выборку."));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      open
      title="Сохранить выборку"
      width={740}
      footer={null}
      getContainer={() => document.getElementById("root")!}
      closable={!busy}
      maskClosable={!busy}
      keyboard={!busy}
      onCancel={() => {
        if (!busy) onClose();
      }}
    >
      <Workspace className="sample-modal">
        <p className="muted">
          Состав фиксируется при сохранении. Выборка появится в статистическом
          анализе; там можно изменить название и участников.
        </p>
        <div className="fields">
          <label className="field">
            Название · необязательно
            <input
              autoFocus
              value={name}
              maxLength={160}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например, основная группа"
            />
          </label>
          <label className="field">
            Кого сохранить
            <SelectField
              value={scope}
              onChange={(v) => setScope(String(v))}
              options={[
                {
                  value: "selected",
                  label: `Отмеченные респонденты · ${selected.length}`,
                  disabled: !selected.length,
                },
                {
                  value: "filtered",
                  label: `Текущая выборка · ${filtered.length}`,
                },
                { value: "all", label: `Все респонденты · ${people.length}` },
              ]}
            />
          </label>
        </div>
        <div className="fields">
          <label className="field">
            Возраст от
            <input
              type="number"
              min="0"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              placeholder="Без ограничения"
            />
          </label>
          <label className="field">
            Возраст до
            <input
              type="number"
              min="0"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              placeholder="Без ограничения"
            />
          </label>
        </div>
        <label className="check">
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
          Только завершённые прохождения
        </label>
        {scope === "filtered" && conditions.length > 0 && (
          <p className="muted">
            Условия из таблицы: {conditions.map((c) => c.title).join(" · ")}.
            Учитываются все страницы.
          </p>
        )}
        <h3 style={{ marginTop: 24 }}>Будет сохранено: {members.length}</h3>
        <label className="field">
          Поиск в составе
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Имя или возраст"
          />
        </label>
        <div className="member-list">
          {members
            .filter((p) =>
              `${p.alias} ${p.age ?? ""}`
                .toLowerCase()
                .includes(search.toLowerCase()),
            )
            .map((p) => (
              <div className="member" key={p.id}>
                <span>
                  {p.alias}
                  <small>
                    {p.age ?? "Возраст не указан"} ·{" "}
                    {p.status === "completed" ? "завершено" : "не завершено"}
                  </small>
                </span>
              </div>
            ))}
          {!members.length && (
            <p className="muted">Нет участников с такими условиями.</p>
          )}
        </div>
        {invalidAge && (
          <p className="error" role="alert">
            Проверьте диапазон возраста.
          </p>
        )}
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <div className="modal-actions">
          <Button disabled={busy} onClick={onClose}>
            Отмена
          </Button>
          <Button
            $emphasized
            loading={busy}
            disabled={!members.length || invalidAge}
            onClick={() => void save()}
          >
            <Save size={15} />
            Сохранить выборку · {members.length}
          </Button>
        </div>
      </Workspace>
    </Modal>
  );
}
