import { BarChart3 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SelectField as Select } from "../../../../components/SelectField";
import { Panel } from "../../styles";
import { ANSWER_DISTRIBUTION_COPY as copy } from "./const";
import { QuestionSelect } from "./styles";
import type { AnswerDistributionProps } from "./types";

export function AnswerDistribution({
  data,
  options,
  selectedQuestion,
  onQuestionChange,
}: AnswerDistributionProps) {
  return (
    <Panel>
      <div className="toolbar">
        <h2>
          <BarChart3 size={20} /> {copy.title}
        </h2>
        <QuestionSelect>
          <Select
            value={selectedQuestion || undefined}
            options={options}
            onChange={(value) => onQuestionChange(String(value ?? ""))}
            placeholder={copy.chooseQuestion}
            showSearch
            filterOption={(input, option) =>
              String(option?.label ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            notFoundContent={copy.questionsNotFound}
            listHeight={320}
            getPopupContainer={(trigger) =>
              trigger.parentElement ?? document.body
            }
          />
        </QuestionSelect>
      </div>
      <div style={{ height: 300, marginTop: 20 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="answer" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar
              dataKey="count"
              name={copy.answerCount}
              fill="#6e8e76"
              radius={[7, 7, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
