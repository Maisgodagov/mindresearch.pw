export type Methodology = {
  code: string;
  title: string;
  version: string;
  summary: string;
  steps: string[];
  keys?: { label: string; value: string }[];
  norms?: { label: string; value: string }[];
  notes: string[];
  sources: { title: string; url: string }[];
};

export type Props = { methodology: Methodology; onClose: () => void };
