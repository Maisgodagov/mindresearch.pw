import { BookOpenText, CheckCircle2, ChevronDown, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../../../components/Button";
import { FieldInput } from "../../../../components/FieldInput";
import { TextAreaField } from "../../../../components/TextAreaField";
import { InstrumentCatalog } from "../InstrumentCatalog";
import { ControlPanel, CatalogSlot } from "./styles";
import type { Instrument, Section } from "../../types";
import type { Methodology } from "../../../../components/MethodologyModal";

type Props = {
  title: string;
  description: string;
  titleInvalid: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  instruments: Instrument[];
  methodologies: Record<string, Methodology>;
  sections: Section[];
  query: string;
  locked: boolean;
  previewLoading: boolean;
  previewError: string;
  saving: boolean;
  publishImmediately: boolean;
  onQueryChange: (value: string) => void;
  onCreateCustom: () => void;
  onShowMethodology: (methodology: Methodology) => void;
  onAddInstrument: (instrument: Instrument) => void;
  onPreview: () => void;
  onPublishChange: (value: boolean) => void;
  onSave: () => void;
};

export function SurveyBuilderToolbar({
  title,
  description,
  titleInvalid,
  onTitleChange,
  onDescriptionChange,
  instruments,
  methodologies,
  sections,
  query,
  locked,
  previewLoading,
  previewError,
  saving,
  publishImmediately,
  onQueryChange,
  onCreateCustom,
  onShowMethodology,
  onAddInstrument,
  onPreview,
  onPublishChange,
  onSave,
}: Props) {
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  useEffect(() => {
    const expandDescriptionForOnboarding = () => setDescriptionExpanded(true);
    window.addEventListener("mindresearch:onboarding-fill-settings-example", expandDescriptionForOnboarding);
    return () => window.removeEventListener("mindresearch:onboarding-fill-settings-example", expandDescriptionForOnboarding);
  }, []);
  const saveLabel = saving ? "Сохраняем…" : "Сохранить опрос";

  return (
    <ControlPanel className="survey-control-panel" aria-label="Управление опросом">
      <header className="control-heading">
        <span className="control-icon"><BookOpenText size={18} /></span>
        <h2>Управление опросом</h2>
      </header>

      <section className="survey-details" data-onboarding="survey-settings" aria-label="Основные сведения об опросе">
        <div className="field-group">
          <label htmlFor="survey-title">Название опроса</label>
          <FieldInput
            id="survey-title"
            className={titleInvalid ? "invalid" : undefined}
            data-validation-error={titleInvalid || undefined}
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="Например, исследование самочувствия"
          />
        </div>
        <div className="field-group description-field">
          <label className="description-label" htmlFor="survey-description">Внутреннее описание</label>
          <button className="description-toggle" type="button" aria-expanded={descriptionExpanded} aria-controls="survey-description-content" onClick={() => setDescriptionExpanded((expanded) => !expanded)}>
            <span>Внутреннее описание</span><span className="description-state">{description.trim() ? "Заполнено" : "Необязательно"}</span><ChevronDown size={15} aria-hidden="true" />
          </button>
          <div className={`description-content${descriptionExpanded ? " is-expanded" : ""}`} id="survey-description-content">
            <TextAreaField id="survey-description" rows={2} value={description} onChange={(event) => onDescriptionChange(event.target.value)} placeholder="Краткая заметка о цели или аудитории опроса" />
            <span className="field-note">Видно только вам</span>
          </div>
        </div>
      </section>

      <section className="control-add" aria-labelledby="add-to-survey-heading">
        <h3 id="add-to-survey-heading">Добавить в опрос</h3>
        <p>Создайте свой блок вопросов или добавьте готовую методику из каталога.</p>
        <CatalogSlot>
          <InstrumentCatalog
            instruments={instruments}
            totalCount={instruments.length}
            methodologies={methodologies}
            sections={sections}
            query={query}
            locked={locked}
            onQueryChange={onQueryChange}
            onCreateCustom={onCreateCustom}
            onShowMethodology={onShowMethodology}
            onAddInstrument={onAddInstrument}
          />
        </CatalogSlot>
      </section>

      <section className="control-actions" data-onboarding="publish-setting" aria-label="Сохранение и просмотр">
        <label className="publish-toggle" data-onboarding="publish-toggle">
          <input
            type="checkbox"
            checked={publishImmediately}
            onChange={(event) => onPublishChange(event.currentTarget.checked)}
          />
          <span>Опубликовать сразу</span>
        </label>
        <div className="action-buttons">
          <Button
            type="default"
            className="preview-button"
            title="Посмотреть, как опрос увидит респондент"
            disabled={previewLoading}
            onClick={onPreview}
          >
            <Eye size={15} />
            {previewLoading ? "Загружаем…" : "Предпросмотр"}
          </Button>
          <Button
            className="save-button"
            data-onboarding="save-survey"
            type="primary"
            disabled={saving}
            onClick={onSave}
            aria-label={saveLabel}
          >
            {saveLabel}
            {!saving && <CheckCircle2 size={17} />}
          </Button>
        </div>
        {previewError && <p className="preview-error" role="alert">{previewError}</p>}
      </section>
    </ControlPanel>
  );
}
