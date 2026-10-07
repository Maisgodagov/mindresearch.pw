import { ConfiguredMethodologyResult } from "../../../../components/ConfiguredMethodologyResult";
import type { ReactNode } from "react";
import type { AnswerGroup } from "../../types";
import type { MethodScoreSummaryProps } from "./types";
import { Summary } from "./styles";
import { SavedMethodResult } from "./SavedMethodResult";
import { METHOD_SCORE_COPY as copy } from "./const";

type ScoreScale = {
  score?: number;
  average?: number;
  elevated?: boolean;
  maxScore?: number;
  label?: string;
};
type ScoreValues = {
  overall?: {
    score?: number;
    maxScore?: number;
    levelLabel?: string;
    average?: number;
    category?: string | null;
  };
  average?: number;
  sum?: number;
  score?: number;
  max?: number;
  levelLabel?: string;
  scales?: Record<string, ScoreScale>;
  domains?: Record<string, { average: number }>;
};

function IpipNeo120Summary({ group }: { group: AnswerGroup }) {
  const result = group.result!.values as unknown as {
    domains: Record<string, { average: number }>;
  };
  return (
    <Summary className="score">
      5 областей
      <br />
      <small>
        {Object.values(result.domains)
          .map((value) => value.average.toFixed(2))
          .join(" · ")}
      </small>
    </Summary>
  );
}

export function MethodScoreSummary({ group }: MethodScoreSummaryProps) {
  if (group?.code.startsWith("custom_method_") && group.result) {
    return (
      <ConfiguredMethodologyResult
        title={group.title}
        values={group.result.values}
        compact
      />
    );
  }
  if (!group?.result)
    return <Summary className="pending">{copy.notConfigured}</Summary>;
  const values = group.result.values as unknown as ScoreValues;
  const score = (content: ReactNode) => (
    <Summary className="score">{content}</Summary>
  );

  if (group.code === "test_1")
    return score(
      <>
        {values.overall?.score?.toFixed(2)} / 7<br />
        <small>{values.overall?.levelLabel}</small>
      </>,
    );
  if (group.code === "test_2" || group.code === "test_4")
    return score(
      <>
        {values.overall?.score} / {values.overall?.maxScore}
        <br />
        <small>
          {group.code === "test_2" ? values.overall?.levelLabel : copy.overall}
        </small>
      </>,
    );
  if (group.code === "test_3")
    return score(
      <>
        {values.average?.toFixed(2)} / 5<br />
        <small>сумма {values.sum} / 60</small>
      </>,
    );
  if (group.code === "test_5")
    return score(
      <>
        7 шкал
        <br />
        <small>
          {Object.values(values.scales ?? {})[0]?.score} ·{" "}
          {Object.values(values.scales ?? {})[1]?.score} · …
        </small>
      </>,
    );
  if (group.code === "test_6") {
    const scales = Object.values(values.scales ?? {});
    const elevated = scales.filter((value) => value.elevated).length;
    return score(
      <>
        {scales.map((value) => value.average?.toFixed(2)).join(" · ")}
        <br />
        <small>
          {elevated ? `${copy.elevated}: ${elevated} из 3` : copy.noElevation}
        </small>
      </>,
    );
  }
  if (group.code === "test_7") {
    const top = Object.values(values.scales ?? {}).sort(
      (a, b) => (b.score ?? 0) - (a.score ?? 0),
    )[0];
    if (!top) return <Summary className="pending">{copy.calculated}</Summary>;
    return score(
      <>
        {top.score} / {top.maxScore}
        <br />
        <small>{top.label}</small>
      </>,
    );
  }
  if (group.code === "test_8") {
    const top = Object.values(values.scales ?? {}).sort(
      (a, b) => (b.average ?? 0) - (a.average ?? 0),
    )[0];
    if (!top) return <Summary className="pending">{copy.calculated}</Summary>;
    return score(
      <>
        {top.average?.toFixed(2)} / 7<br />
        <small>{top.label}</small>
      </>,
    );
  }
  if (group.code === "test_9")
    return score(
      <>
        {values.overall?.average?.toFixed(2)} / 5<br />
        <small>{copy.alienation}</small>
      </>,
    );
  if (group.code === "test_10")
    return score(
      <>
        {values.overall?.score} / 100
        <br />
        <small>среднее {values.overall?.average?.toFixed(2)} / 5</small>
      </>,
    );
  if (group.code === "test_11")
    return score(
      <>
        {values.overall?.average?.toFixed(2)} / 5<br />
        <small>сумма {values.overall?.score} / 60</small>
      </>,
    );
  if (["test_12", "test_13", "test_14", "test_16"].includes(group.code)) {
    const data =
      group.code === "test_14" || group.code === "test_16"
        ? Object.values(values.scales ?? {})
        : Object.values(values.domains ?? {});
    return score(
      <>
        5 областей
        <br />
        <small>
          {data.map((value) => value.average?.toFixed(2)).join(" · ")}
        </small>
      </>,
    );
  }
  if (group.code === "test_15") return <IpipNeo120Summary group={group} />;
  if (group.code === "test_17")
    return score(
      <>
        {values.score} / {values.max}
        <br />
        <small>{values.levelLabel}</small>
      </>,
    );
  if (group.code === "test_18")
    return score(
      <>
        {values.average?.toFixed(2)} / 5<br />
        <small>сумма {values.score} / 60</small>
      </>,
    );
  if (group.code === "test_21")
    return score(
      <>
        {values.overall?.score} / 20
        <br />
        <small>{values.overall?.category ?? copy.categoryMissing}</small>
      </>,
    );
  return <SavedMethodResult group={group} compact />;
}
