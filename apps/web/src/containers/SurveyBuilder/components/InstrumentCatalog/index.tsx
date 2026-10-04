import { useEffect, useRef, useState } from "react";
import { Modal } from "antd";
import {
  Calculator,
  BookOpenText,
  Info,
  ListChecks,
  Plus,
  Search,
  ShieldCheck,
} from "lucide-react";
import { Button } from "../../../../ui";
import { FieldInput } from "../../../../components/FieldInput";
import { CATALOG_COPY } from "./const";
import {
  CatalogContent,
  CatalogToolbar,
  CatalogIntro,
  CatalogTools,
  Library,
} from "./styles";
import type { InstrumentCatalogProps } from "./types";

function formatQuestionCount(count: number) {
  const lastTwo = count % 100;
  const last = count % 10;
  const noun =
    lastTwo >= 11 && lastTwo <= 14
      ? "вопросов"
      : last === 1
        ? "вопрос"
        : last >= 2 && last <= 4
          ? "вопроса"
          : "вопросов";
  return `${count} ${noun}`;
}

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
          data-onboarding="custom-test"
          disabled={locked}
          title={locked ? CATALOG_COPY.locked : undefined}
          onClick={onCreateCustom}
        >
          <Plus size={17} /> {CATALOG_COPY.createCustom}
        </Button>
        <Button
          className="choose-method"
          data-onboarding="methodology"
          disabled={locked}
          title={locked ? CATALOG_COPY.locked : undefined}
          onClick={() => setOpen(true)}
        >
          <BookOpenText size={17} />
          <span>{CATALOG_COPY.choose}</span>
          <span className="available-count">
            <ShieldCheck size={14} /> Доступно {totalCount}
          </span>
        </Button>
      </CatalogContent>

      <Modal
        open={open}
        onCancel={closeCatalog}
        footer={null}
        centered
        width="min(920px, calc(100vw - 24px))"
        title={CATALOG_COPY.catalogTitle}
        className="instrument-catalog-modal"
        styles={{
          body: {
            maxHeight: "min(82dvh, 820px)",
            overflowY: "auto",
            padding: "4px 16px 16px",
          },
        }}
      >
        <CatalogToolbar>
        <CatalogIntro>
          <p>{CATALOG_COPY.catalogDescription}</p>
          <span className="catalog-total">
            <ShieldCheck size={14} /> {totalCount} методик
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
            {query.trim() ? `Найдено ${instruments.length}` : ""}
          </span>
        </CatalogTools>
        </CatalogToolbar>
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
                      <span className="verified" title={CATALOG_COPY.verified} aria-label={CATALOG_COPY.verified}>
                        <ShieldCheck size={15} />
                      </span>
                    )}
                  </div>
                  {instrument.author && (
                    <div className="author">
                      <span className="author-label">{CATALOG_COPY.originalAuthors}</span>
                      <span>{instrument.author}</span>
                    </div>
                  )}
                  <div className="description">{instrument.description}</div>
                  <div className="item-meta">
                    <span className="question-count"><ListChecks size={13} /> {formatQuestionCount(instrument.questionCount)}</span>
                    <span className="scoring-type"><Calculator size={13} /> Автоматический расчёт</span>
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
                    data-onboarding="catalog-add"
                    disabled={isAdded}
                    onClick={() => {
                      onAddInstrument(instrument);
                      closeCatalog();
                      window.setTimeout(() => window.dispatchEvent(new Event("mindresearch:onboarding-methodology-added")), 0);
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
