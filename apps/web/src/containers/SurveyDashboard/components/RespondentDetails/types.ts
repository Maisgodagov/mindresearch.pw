import type { ReactNode } from "react";
import type { Methodology } from "../../../../components/MethodologyModal";
import type { AnswerGroup, Respondent } from "../../types";
import type { Quality } from "../../quality";

export type RespondentDetailsProps = {
  respondent: Respondent;
  quality?: Quality;
  methodologies: Record<string, Methodology>;
  onShowMethodology: (methodology: Methodology) => void;
  renderResult: (group: AnswerGroup) => ReactNode;
};
