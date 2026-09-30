import type { ReactNode } from "react";
import type { Methodology } from "../../../../components/MethodologyModal";
import type { AnswerGroup, Respondent } from "../../types";

export type RespondentDetailsProps = {
  respondent: Respondent;
  methodologies: Record<string, Methodology>;
  onShowMethodology: (methodology: Methodology) => void;
  renderResult: (group: AnswerGroup) => ReactNode;
};
