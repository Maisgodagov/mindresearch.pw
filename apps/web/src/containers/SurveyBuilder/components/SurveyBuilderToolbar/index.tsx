import { CheckCircle2, Eye } from "lucide-react";
import { Button } from "../../../../components/Button";
import { FieldInput } from "../../../../components/FieldInput";
import { InstrumentCatalog } from "../InstrumentCatalog";
import { Bar, CatalogSlot } from "./styles";
import type { Instrument, Section } from "../../types";
import type { Methodology } from "../../../../components/MethodologyModal";

type Props = {
  draftRestored: boolean;
  lastSaved: Date | null;
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
  draftRestored,
  lastSaved,
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
  return (
    <Bar
      className="survey-toolbar survey-builder-toolbar"
      style={{
        width: "100%",
        minWidth: 0,
        gridColumn: "1 / -1",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) auto",
        gridTemplateAreas: '"main actions" "meta meta"',
        alignItems: "center",
        columnGap: 14,
        rowGap: 5,
        padding: "9px 12px 7px",
        boxSizing: "border-box",
        border: "1px solid #c5d7c0",
        borderLeft: "4px solid #6e9076",
        borderRadius: 14,
        backgroundColor: "#dce9d8",
        boxShadow: "0 6px 18px rgba(43, 65, 48, .11)",
      }}
    >
      <div className="toolbar-main">
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
      </div>

      <div className="toolbar-actions">
        <div className="preview-group">
          <Button
            type="default"
            className="preview-button"
            title="Посмотреть, как опрос увидит респондент"
            disabled={previewLoading}
            onClick={onPreview}
          >
            <Eye size={15} />
            {previewLoading ? "Загрузка" : "Предпросмотр"}
          </Button>
          {previewError && <span className="preview-error" title={previewError}>{previewError}</span>}
        </div>

        <Button
          className="save-button"
          type="primary"
          disabled={saving}
          onClick={onSave}
        >
          {saving ? "Сохранение" : "Сохранить опрос"}
          {!saving && <CheckCircle2 size={16} />}
        </Button>
      </div>

      <div className="toolbar-meta">
        <div className="save-status" role="status" aria-live="polite">
          <span className="status-dot" />
          <span className="status-copy">
            {draftRestored ? "Черновик восстановлен" : "Автосохранение"}
          </span>
          {lastSaved && (
            <span className="saved-time">
              {lastSaved.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>
        <label className="publish-toggle">
          <FieldInput
            type="checkbox"
            checked={publishImmediately}
            onChange={(event) => onPublishChange(event.target.checked)}
          />
          <span>Опубликовать сразу</span>
        </label>
      </div>
    </Bar>
  );
}
