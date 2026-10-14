import type { Instrument } from "../../types";

// Normalize all punctuation, including em dashes, nonbreaking hyphens and quotes.
export const normalizeSearch = (value: string) =>
  value
    .normalize("NFKC")
    .toLocaleLowerCase("ru")
    .replace(/ё/g, "е")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
export function createInstrumentIndex(instruments: Instrument[]) {
  return instruments.map((instrument, order) => ({
    instrument,
    order,
    fields: [
      { text: normalizeSearch(instrument.title), weight: 40 },
      { text: normalizeSearch(instrument.author ?? ""), weight: 25 },
      { text: normalizeSearch(instrument.description ?? ""), weight: 10 },
      {
        text: normalizeSearch(
          instrument.categories
            ?.map((c) => `${c.group} ${c.label}`)
            .join(" ") ?? "",
        ),
        weight: 5,
      },
      { text: normalizeSearch(instrument.code ?? ""), weight: 5 },
    ].map((field) => ({ ...field, compact: field.text.replace(/ /g, "") })),
  }));
}
export function searchInstruments(
  index: ReturnType<typeof createInstrumentIndex>,
  query: string,
): Instrument[] {
  const normalized = normalizeSearch(query),
    terms = [...new Set(normalized.split(" ").filter(Boolean))];
  if (!terms.length) return index.map((entry) => entry.instrument);
  return index
    .flatMap((entry) => {
      let score = 0;
      // Every query word must match; words may occur in different fields or in any order.
      for (const term of terms) {
        const weights = entry.fields.map((field) =>
          field.text.includes(term)
            ? field.weight
            : term.length > 1 && field.compact.includes(term)
              ? field.weight / 2
              : 0,
        );
        const best = Math.max(...weights);
        if (!best) return [];
        score += best;
      }
      if (entry.fields[0].text === normalized) score += 160;
      else if (entry.fields[0].text.includes(normalized)) score += 60;
      return [{ ...entry, score }];
    })
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .map((entry) => entry.instrument);
}
