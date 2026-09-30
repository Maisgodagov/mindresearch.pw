import { Info, Plus, Search, ShieldCheck } from "lucide-react";
import { Button } from "../../../../ui";
import { FieldInput } from "../../../../components/FieldInput";
import { CATALOG_COPY } from "./const";
import { CatalogContent, CatalogTools, Library } from "./styles";
import type { InstrumentCatalogProps } from "./types";

export function InstrumentCatalog({
  instruments,
  totalCount,
  methodologies,
  sections,
  query,
  locked,
  onQueryChange,
  onCreateCustom,
  onShowMethodology,
  onAddInstrument,
}: InstrumentCatalogProps) {
  return (
    <>
      <h2>{CATALOG_COPY.title}</h2>
      <p className="hint">{CATALOG_COPY.description}</p>
      {locked && (
        <p
          className="hint"
          style={{ padding: 12, background: "#f4efe3", borderRadius: 10, color: "#766847" }}
        >
          {CATALOG_COPY.locked}
        </p>
      )}
      <CatalogContent $locked={locked}>
        <CatalogTools>
          <Button className="create-custom" onClick={onCreateCustom}>
            <Plus size={17} /> {CATALOG_COPY.createCustom}
          </Button>
          <div className="divider">{CATALOG_COPY.divider}</div>
          <div className="catalog-count">
            <span>{CATALOG_COPY.catalog}</span>
            <strong>
              <ShieldCheck size={13} /> {CATALOG_COPY.available}: {totalCount}
            </strong>
          </div>
          <div className="search">
            <Search size={16} />
            <FieldInput
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder={CATALOG_COPY.search}
              aria-label={CATALOG_COPY.searchLabel}
              style={{ paddingLeft: 44 }}
            />
          </div>
        </CatalogTools>
        <Library>
          {instruments.map((instrument) => {
            const code = instrument.code ?? instrument.scoringCode ?? "";
            const methodology = methodologies[code];
            const isAdded = sections.some(
              (section) => section.instrumentId === instrument.id,
            );

            return (
              <div className="item" key={instrument.id}>
                <div className="top">
                  <span className="title">{instrument.title}</span>
                  {instrument.isVerified && (
                    <span className="verified">
                      <ShieldCheck size={13} /> {CATALOG_COPY.verified}
                    </span>
                  )}
                </div>
                {instrument.author && (
                  <div className="author">
                    {CATALOG_COPY.originalAuthors} {instrument.author}
                  </div>
                )}
                <div className="description">{instrument.description}</div>
                <div className="bottom">
                  <span>
                    {instrument.questionCount} {CATALOG_COPY.calculated}
                  </span>
                  <div className="links">
                    {methodology && (
                      <Button
                        className="more"
                        onClick={() => onShowMethodology(methodology)}
                      >
                        <Info size={13} /> {CATALOG_COPY.about}
                      </Button>
                    )}
                    <Button
                      className="add"
                      disabled={isAdded}
                      onClick={() => onAddInstrument(instrument)}
                    >
                      {isAdded ? CATALOG_COPY.added : CATALOG_COPY.add}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
          {!instruments.length && (
            <p className="hint catalog-empty">{CATALOG_COPY.empty}</p>
          )}
        </Library>
      </CatalogContent>
    </>
  );
}
