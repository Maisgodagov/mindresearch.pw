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
import { DistributionChart, QuestionSelect } from "./styles";
import type { AnswerDistributionProps } from "./types";

export function AnswerDistribution({
  data,
  options,
  selectedQuestion,
  onQuestionChange,
}: AnswerDistributionProps) {
  return (
    <Panel className="distribution-panel">
      <div className="distribution-toolbar">
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
      <DistributionChart>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid stroke="#e5ebe3" strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey="answer"
              tick={{ fontSize: 10, fill: "#6d7b70" }}
              tickLine={false}
              axisLine={{ stroke: "#cbd7c9" }}
              tickMargin={8}
              minTickGap={16}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 10, fill: "#77847a" }}
              tickLine={false}
              axisLine={false}
              width={32}
            />
            <Tooltip
              contentStyle={{ border: "1px solid #dce5da", borderRadius: 9, boxShadow: "0 6px 18px rgba(37, 55, 40, .1)" }}
              labelStyle={{ color: "#304536", fontWeight: 650 }}
              itemStyle={{ color: "#52764b", fontSize: 12 }}
              cursor={{ fill: "#edf4ea" }}
            />
            <Bar
              dataKey="count"
              name={copy.answerCount}
              fill="#66866c"
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </DistributionChart>
    </Panel>
  );
}
