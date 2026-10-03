import { useEffect, useRef, useState } from "react";
import { Modal } from "antd";
import {
  BookOpenText,
  Info,
  Plus,
  Search,
  ShieldCheck,
} from "lucide-react";
import { Button } from "../../../../ui";
import { FieldInput } from "../../../../components/FieldInput";
import { CATALOG_COPY } from "./const";
import {
  CatalogContent,
  CatalogIntro,
  CatalogTools,
  Library,
} from "./styles";
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
  const [open, setOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(30);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const pageSize = 30;
  const visibleInstruments = instruments.slice(0, visibleCount);
  const closeCatalog = () => setOpen(false);

  useEffect(() => {
    if (!open || visibleCount >= instruments.length) return;
    const sentinel = loadMoreRef.current;
    if (!sentinel) return;
    if (!("IntersectionObserver" in window)) {
      setVisibleCount((current) => Math.min(instruments.length, current + pageSize));
      return;
    }
    const scrollContainer = sentinel.closest(".ant-modal-body");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((current) =>
            Math.min(instruments.length, current + pageSize),
          );
        }
      },
      { root: scrollContainer, rootMargin: "120px 0px", threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [open, visibleCount, instruments.length]);

  return (
    <>
      <CatalogContent
        $locked={locked}
        role="group"
        aria-label={CATALOG_COPY.title}
      >
        <Button
          className="create-custom"
          disabled={locked}
          title={locked ? CATALOG_COPY.locked : undefined}
          onClick={onCreateCustom}
        >
          <Plus size={17} /> {CATALOG_COPY.createCustom}
        </Button>
        <Button
          className="choose-method"
          disabled={locked}
          title={locked ? CATALOG_COPY.locked : undefined}
          onClick={() => setOpen(true)}
        >
          <BookOpenText size={17} />
          <span>{CATALOG_COPY.choose}</span>
          <span className="available-count">
            <ShieldCheck size={14} /> {totalCount}
          </span>
        </Button>
      </CatalogContent>

      <Modal
        open={open}
        onCancel={closeCatalog}
        footer={null}
        centered
        width="min(880px, calc(100vw - 24px))"
        title={CATALOG_COPY.catalogTitle}
        className="instrument-catalog-modal"
        styles={{
          body: {
            maxHeight: "min(76dvh, 760px)",
            overflowY: "auto",
            padding: "8px 24px 24px",
          },
        }}
      >
        <CatalogIntro>
          <p>{CATALOG_COPY.catalogDescription}</p>
          <span>
            <ShieldCheck size={14} /> {CATALOG_COPY.available}: {totalCount}
          </span>
        </CatalogIntro>
        <CatalogTools>
          <div className="search">
            <Search size={17} />
            <FieldInput
              value={query}
              onChange={(event) => {
                setVisibleCount(pageSize);
                onQueryChange(event.target.value);
              }}
              placeholder={CATALOG_COPY.search}
              aria-label={CATALOG_COPY.searchLabel}
              autoFocus
            />
          </div>
          <span className="results-count">
            {instruments.length === totalCount
              ? `${instruments.length} методик`
              : `${instruments.length} из ${totalCount}`}
          </span>
        </CatalogTools>
        <Library>
          {visibleInstruments.map((instrument) => {
            const code = instrument.code ?? instrument.scoringCode ?? "";
            const methodology = methodologies[code];
            const isAdded = sections.some(
              (section) => section.instrumentId === instrument.id,
            );

            return (
              <article className="item" key={instrument.id}>
                <div className="item-main">
                  <div className="top">
                    <span className="title">{instrument.title}</span>
                    {instrument.isVerified && (
                      <span className="verified">
                        <ShieldCheck size={14} /> {CATALOG_COPY.verified}
                      </span>
                    )}
                  </div>
                  {instrument.author && (
                    <div className="author">
                      {CATALOG_COPY.originalAuthors} {instrument.author}
                    </div>
                  )}
                  <div className="description">{instrument.description}</div>
                  <div className="item-meta">
                    {instrument.questionCount} {CATALOG_COPY.calculated}
                  </div>
                </div>
                <div className="links">
                  {methodology && (
                    <Button
                      className="more"
                      onClick={() => onShowMethodology(methodology)}
                    >
                      <Info size={14} /> {CATALOG_COPY.about}
                    </Button>
                  )}
                  <Button
                    type="primary"
                    className="add"
                    disabled={isAdded}
                    onClick={() => {
                      onAddInstrument(instrument);
                      closeCatalog();
                    }}
                  >
                    {isAdded ? CATALOG_COPY.added : CATALOG_COPY.add}
                  </Button>
                </div>
              </article>
            );
          })}
          {!instruments.length && (
            <p className="empty">{CATALOG_COPY.empty}</p>
          )}
          {visibleCount < instruments.length && (
            <div ref={loadMoreRef} className="load-more-sentinel" aria-hidden="true" />
          )}
        </Library>
      </Modal>
    </>
  );
}
