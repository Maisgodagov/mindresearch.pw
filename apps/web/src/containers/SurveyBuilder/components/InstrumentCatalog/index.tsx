import { useEffect, useMemo, useState } from "react";
import { Modal } from "antd";
import {
  Calculator,
  BookOpenText,
  Info,
  ListChecks,
  ListFilter,
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
  CatalogPagination,
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
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("");
  const pageSize = 20;
  const categoriesByGroup = useMemo(() => {
    const categories = new Map<string, { id: string; label: string; group: string; url: string; count: number }>();
    const groupCounts = new Map<string, number>();
    instruments.forEach((instrument) => {
      const groups = new Set<string>();
      instrument.categories?.forEach((category) => {
        const current = categories.get(category.id) ?? { ...category, count: 0 };
        current.count += 1;
        categories.set(category.id, current);
        groups.add(category.group);
      });
      groups.forEach((group) => groupCounts.set(group, (groupCounts.get(group) ?? 0) + 1));
    });
    const grouped = new Map<string, { count: number; categories: Array<{ id: string; label: string; group: string; url: string; count: number }> }>();
    categories.forEach((category) => {
      const group = grouped.get(category.group) ?? { count: groupCounts.get(category.group) ?? 0, categories: [] };
      group.categories.push(category);
      grouped.set(category.group, group);
    });
    grouped.forEach((group) => group.categories.sort((a, b) => a.label.localeCompare(b.label, "ru")));
    return grouped;
  }, [instruments]);
  const categoryFilteredInstruments = categoryFilter
    ? instruments.filter((instrument) => instrument.categories?.some((category) =>
        categoryFilter.startsWith("group:")
          ? category.group === categoryFilter.slice(6)
          : category.id === categoryFilter,
      ))
    : instruments;
  const pageCount = Math.max(1, Math.ceil(categoryFilteredInstruments.length / pageSize));
  const visibleInstruments = categoryFilteredInstruments.slice((page - 1) * pageSize, page * pageSize);
  const closeCatalog = () => setOpen(false);

  useEffect(() => {
    setPage(1);
  }, [query, instruments.length, categoryFilter]);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const changePage = (nextPage: number) => {
    setPage(nextPage);
    document.querySelector(".instrument-catalog-modal .ant-modal-body")?.scrollTo({ top: 0, behavior: "smooth" });
  };

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
          onClick={() => { setPage(1); setOpen(true); }}
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
                onQueryChange(event.target.value);
              }}
              placeholder={CATALOG_COPY.search}
              aria-label={CATALOG_COPY.searchLabel}
              autoFocus
            />
          </div>
          <span className="results-count">
            {query.trim() || categoryFilter
              ? `Найдено ${categoryFilteredInstruments.length}${categoryFilteredInstruments.length !== instruments.length ? ` из ${instruments.length}` : ""}`
              : ""}
          </span>
          <label className="category-filter">
            <ListFilter size={16} aria-hidden="true" />
            <select
              value={categoryFilter}
              aria-label="Фильтр по категории методики"
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              <option value="">Все категории ({instruments.length})</option>
              {Array.from(categoriesByGroup.entries()).map(([group, value]) => (
                <optgroup key={group} label={`${group} (${value.count})`}>
                  <option value={`group:${group}`}>Вся категория «{group}» ({value.count})</option>
                  {value.categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label} ({category.count})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
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
                    {instrument.categories?.map((category) => (
                      <span className="category-tag" key={category.id} title={category.group}>
                        {category.label}
                      </span>
                    ))}
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
          {!categoryFilteredInstruments.length && (
            <p className="empty">{categoryFilter ? "В этой категории методики не найдены." : CATALOG_COPY.empty}</p>
          )}
        </Library>
        {categoryFilteredInstruments.length > pageSize && (
          <CatalogPagination aria-label="\u0421\u0442\u0440\u0430\u043d\u0438\u0446\u044b \u043a\u0430\u0442\u0430\u043b\u043e\u0433\u0430">
            <span>{(page - 1) * pageSize + 1}&#8211;{Math.min(page * pageSize, categoryFilteredInstruments.length)} {"\u0438\u0437"} {categoryFilteredInstruments.length}</span>
            <div className="pages">
              <Button className="page-arrow" disabled={page === 1} aria-label="\u041f\u0440\u0435\u0434\u044b\u0434\u0443\u0449\u0430\u044f \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0430" onClick={() => changePage(page - 1)}>&#x2039;</Button>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                <Button key={pageNumber} className={pageNumber === page ? "page-number active" : "page-number"} aria-current={pageNumber === page ? "page" : undefined} onClick={() => changePage(pageNumber)}>{pageNumber}</Button>
              ))}
              <Button className="page-arrow" disabled={page === pageCount} aria-label="\u0421\u043b\u0435\u0434\u0443\u044e\u0449\u0430\u044f \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0430" onClick={() => changePage(page + 1)}>&#x203a;</Button>
            </div>
          </CatalogPagination>
        )}
      </Modal>
    </>
  );
}
