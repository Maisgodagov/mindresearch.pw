import { useState } from "react";
import { ChevronDown, ChevronRight, Info } from "lucide-react";
import { RESPONDENT_DETAILS_COPY as copy } from "./const";
import {
  AnswerRow,
  Answers,
  Details,
  Group,
  GroupButton,
  MethodButton,
  ResultBox,
} from "./styles";
import type { RespondentDetailsProps } from "./types";
import { formatQuestionTime } from "../QuestionTiming";

import { fasterText } from "../ResponseQuality";

export function RespondentDetails({
  respondent,
  quality,
  methodologies,
  onShowMethodology,
  renderResult,
}: RespondentDetailsProps) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  return (
    <Details>
      {respondent.groups.map((group) => (
        <Group key={group.code}>
          <GroupButton
            onClick={() =>
              setOpen((current) => ({
                ...current,
                [group.code]: !current[group.code],
              }))
            }
          >
            <span>{group.title}</span>
            <span className="count">
              {group.answers.length} {copy.answers}
            </span>
            {open[group.code] ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </GroupButton>
          {open[group.code] && (
            <>
              {group.code !== "respondent" && (
                <ResultBox>
                  {renderResult(group)}
                  {methodologies[group.code] && (
                    <MethodButton
                      onClick={() =>
                        onShowMethodology(methodologies[group.code])
                      }
                    >
                      <Info size={14} /> {copy.scoring}
                    </MethodButton>
                  )}
                </ResultBox>
              )}
              <Answers>
                {group.answers.map((answer) => (
                  <AnswerRow key={answer.code}>
                    <div className="q">{answer.question}</div>
                    <div className="a">{answer.displayValue}</div>
                    {answer.activeMs != null && <div className="timing">
                      Время на вопросе: {formatQuestionTime(answer.activeMs)}
                      {answer.visits != null && answer.visits > 1 ? ` · посещений: ${answer.visits}` : ""}
                    </div>}
                    {answer.questionId && (()=>{
                      const refs=quality?.behavioral.metrics.question_ratios as Record<string,{ratio:number;median:number;n:number;source:string}>|undefined;
                      const ref=refs?.[answer.questionId];
                      return ref?<div className="timing">{fasterText((1-ref.ratio)*100)} относительно эталона ({formatQuestionTime(ref.median*1000)}; наблюдений: {ref.n}; {({question:"этот вопрос",block:"психологический блок",type:"вопросы того же типа"} as Record<string,string>)[ref.source]??ref.source})</div>:null;
                    })()}
                  </AnswerRow>
                ))}
              </Answers>
            </>
          )}
        </Group>
      ))}
    </Details>
  );
}
