import { useEffect, useState } from 'react';
import { Button } from '../../../../ui';
import { FieldInput } from '../../../../components/FieldInput';
import { numericRangeLabels } from '../../selection';
import { sortNumericAnswers } from "./sortAnswers";
import { BarChart3, X } from "lucide-react";
import {
  Bar,
  Cell,
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
  onQuestionChange, appliedLabels, onApply, numeric=false, busy=false, conditions=[],completedOnly=false,onRemoveCondition,sampleCount,loading=false,error,onRetry,
}: AnswerDistributionProps) {
  const [multiple,setMultiple]=useState(false),[selected,setSelected]=useState<string[]>(appliedLabels),[min,setMin]=useState(''),[max,setMax]=useState('');
  useEffect(()=>{setSelected(appliedLabels);},[selectedQuestion,appliedLabels.join('|')]);
  useEffect(()=>{setMin('');setMax('');},[selectedQuestion]);
  const choose=(label:string)=>{if(busy||loading||error)return;const next=multiple?(selected.includes(label)?selected.filter(x=>x!==label):[...selected,label]):[label];setSelected(next);if(!multiple)onApply(next);};
  const range=numericRangeLabels(data,min,max);
  const validRange=min.trim()!==''&&max.trim()!==''&&Number.isFinite(Number(min))&&Number.isFinite(Number(max))&&Number(min)<=Number(max);
  const unavailable=busy||loading||!!error;
  return (
    <Panel className="distribution-panel">
      <div className="distribution-toolbar">
        <h2>
          <BarChart3 size={20} /> {copy.title}
        </h2>
        <QuestionSelect>
          <Select
            aria-label="Вопрос распределения"
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
      <div className="distribution-selection">
        <p>{(conditions.length||completedOnly)?`Распределение текущей выборки. Участников: ${sampleCount}.`:'Распределение по всем респондентам.'} Нажмите на столбец, чтобы добавить условие выборки. Предыдущие условия сохранятся.{completedOnly&&' Только завершённые прохождения.'}</p>
        {conditions.length>0&&<div className="distribution-conditions" aria-label="Выборка распределения">{conditions.map(condition=><button type="button" key={condition.question} onClick={()=>onRemoveCondition?.(condition.question)} aria-label={`Убрать условие: ${condition.title}`}>{condition.title}: {condition.range?`${condition.range.min||'…'}–${condition.range.max||'…'}`:condition.labels.join(' или ')}<X size={13}/></button>)}</div>}
        <label className="distribution-multiple"><input type="checkbox" disabled={unavailable} checked={multiple} onChange={e=>setMultiple(e.target.checked)}/>Выбрать несколько столбцов</label>
        {numeric && <div className="distribution-range"><span>Диапазон ответов</span><FieldInput type="number" aria-label="От значения" placeholder="От" value={min} onChange={e=>setMin(e.target.value)}/><span>—</span><FieldInput type="number" aria-label="До значения" placeholder="До" value={max} onChange={e=>setMax(e.target.value)}/><Button loading={busy} disabled={unavailable||!validRange} onClick={()=>{setSelected(range);onApply(range,{min,max});}}>Применить диапазон</Button></div>}
        {multiple && <div className="distribution-selection-actions"><span>Выбрано столбцов: {selected.length}</span><Button type="primary" loading={busy} disabled={unavailable||!selected.length} onClick={()=>onApply(selected)}>Применить ответы</Button><Button disabled={unavailable||!selected.length} onClick={()=>{setSelected([]);onApply([]);}}>Убрать условие этого вопроса</Button></div>}
      </div>
      {busy && <p role="status">Обновляем выборку…</p>}
      {loading&&<p role="status">Пересчитываем распределение…</p>}
      {error&&<div role="alert"><p>{error}</p><Button onClick={onRetry}>Повторить</Button></div>}
      {!loading&&!error&&data.length===0&&<p role="status">В текущей выборке нет ответов на этот вопрос. Измените или снимите условия выборки.</p>}
      {!loading&&!error&&data.length>0&&<DistributionChart>
        <ResponsiveContainer>
          <BarChart data={sortNumericAnswers(data)}>
            <CartesianGrid stroke="var(--color-brand-soft)" strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey="answer"
              tick={{ fontSize: 10, fill: "var(--color-palette-6d7b70)" }}
              tickLine={false}
              axisLine={{ stroke: "var(--color-border-strong)" }}
              tickMargin={8}
              minTickGap={16}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 10, fill: "var(--color-palette-77847a)" }}
              tickLine={false}
              axisLine={false}
              width={32}
            />
            <Tooltip
              contentStyle={{ border: "1px solid var(--color-brand-soft)", borderRadius: 9, boxShadow: "0 6px 18px var(--color-brand-alpha-100)" }}
              labelStyle={{ color: "var(--color-text-304536)", fontWeight: 650 }}
              itemStyle={{ color: "var(--color-text-52764b)", fontSize: 12 }}
              cursor={{ fill: "var(--color-brand-soft)" }}
            />
            <Bar
              isAnimationActive={false}
              dataKey="count"
              name={copy.answerCount}
              fill="var(--color-brand)"
              radius={[5, 5, 0, 0]}
              onClick={(entry:any)=>choose(entry.answer ?? entry.payload?.answer)}
              cursor="pointer"
            >{sortNumericAnswers(data).map(row=><Cell key={row.answer} fill={selected.includes(row.answer)?'var(--color-brand)':selected.length?'var(--color-border-strong)':'var(--color-brand)'} />)}</Bar>
          </BarChart>
        </ResponsiveContainer>
      </DistributionChart>}
      {!loading&&!error&&data.length>0&&<details className="distribution-values"><summary>Выбрать ответы списком</summary><div>{sortNumericAnswers(data).map(row=><button type="button" key={row.answer} aria-pressed={selected.includes(row.answer)} onClick={()=>choose(row.answer)}>{row.answer || "Без ответа"} · {row.count}</button>)}</div></details>}
    </Panel>
  );
}
