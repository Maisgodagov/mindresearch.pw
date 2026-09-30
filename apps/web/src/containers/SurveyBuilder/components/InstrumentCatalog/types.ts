import type { Methodology } from "../../../../components/MethodologyModal";
import type { Instrument, Section } from "../../types";

export type InstrumentCatalogProps = {
  instruments: Instrument[];
  totalCount: number;
  methodologies: Record<string, Methodology>;
  sections: Section[];
  query: string;
  locked: boolean;
  onQueryChange: (query: string) => void;
  onCreateCustom: () => void;
  onShowMethodology: (methodology: Methodology) => void;
  onAddInstrument: (instrument: Instrument) => void;
};
