import { useState } from "react";
import { ChevronDown, ChevronRight, Info } from "lucide-react";
import { RESPONDENT_DETAILS_COPY as copy } from "./const";
import {
  Answers,
  Details,
  Group,
  GroupButton,
  MethodButton,
  ResultBox,
} from "./styles";
import type { RespondentDetailsProps } from "./types";
import { formatQuestionTime } from "../QuestionTiming";


export function RespondentDetails({
  respondent,
  groupCode,
  methodologies,
  onShowMethodology,
  renderResult,
}: RespondentDetailsProps) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  return (
    <Details>
      {respondent.groups.filter(group => !groupCode || group.code === groupCode).map((group) => (
        <Group key={group.code}>
          {!groupCode && <GroupButton
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
          </GroupButton>}
          {(groupCode || open[group.code]) && (
            <>
              {group.code !== "respondent" && (group.result || methodologies[group.code]) && (
                <ResultBox>
                  <div className="result-content">
                  {renderResult(group)}
                  {!groupCode && methodologies[group.code] && (
                    <MethodButton
                      onClick={() =>
                        onShowMethodology(methodologies[group.code])
                      }
                    >
                      <Info size={14} /> {copy.scoring}
                    </MethodButton>
                  )}
                  </div>
                </ResultBox>
              )}
              <Answers role="region" aria-label={`Ответы: ${group.title}`}>
                <table aria-label={`Ответы: ${group.title}`}>
                  <colgroup><col className="answer-indent"/><col style={{width:52}}/><col style={{width:'clamp(260px, 36cqw, 500px)'}}/><col style={{width:'clamp(180px, 24cqw, 320px)'}}/>
                    {group.answers.some(answer=>answer.activeMs!=null)&&<col style={{width:140}}/>}
                    {group.answers.some(answer=>answer.visits!=null)&&<col style={{width:120}}/>}
                    <col/>
                  </colgroup>
                  <thead><tr><th className="answer-spacer" aria-hidden="true"/><th scope="col" className="number">№</th><th scope="col">Вопрос</th><th scope="col">Ответ</th>
                    {group.answers.some(answer=>answer.activeMs!=null)&&<th scope="col">Время на вопросе</th>}
                    {group.answers.some(answer=>answer.visits!=null)&&<th scope="col" className="visits-heading">Посещения</th>}
                    <th className="answer-spacer" aria-hidden="true"/>
                  </tr></thead>
                  <tbody>{group.answers.map((answer,index)=>{
                    return <tr key={answer.questionId??answer.code}>
                      <td className="answer-spacer" aria-hidden="true"/>
                      <td className="number">{index+1}</td><td className="question">{answer.question}</td><td className="answer">{answer.displayValue||'—'}</td>
                      {group.answers.some(item=>item.activeMs!=null)&&<td className="timing">{answer.activeMs!=null?formatQuestionTime(answer.activeMs):'—'}</td>}
                      {group.answers.some(item=>item.visits!=null)&&<td className="timing">{answer.visits??'—'}</td>}
                      <td className="answer-spacer" aria-hidden="true"/>
                    </tr>;
                  })}
                  {!group.answers.length&&<tr><td colSpan={5}>Ответов пока нет</td></tr>}
                  </tbody>
                </table>
              </Answers>
            </>
          )}
        </Group>
      ))}
    </Details>
  );
}
