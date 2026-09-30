import { ConfiguredMethodologyResult } from "../../../../components/ConfiguredMethodologyResult";
import {
  debqDescriptions,
  shoppDescriptions,
} from "../../../../shoppDescriptions";
import type {
  AnswerGroup,
  FoodValues,
  MspssValues,
  NspsValues,
  SccsValues,
  SspmValues,
} from "../../types";
import { METHOD_INTERPRETATION_COPY as copy } from "./const";
import { Metrics, ScoreProfile, SupportProfile } from "./styles";
import type { MethodologyInterpretationProps } from "./types";

type ScaleSummary = { label: string; average?: number };
const renderScales = (
  scales: Record<string, ScaleSummary>,
  range: 4 | 6,
  caption: string,
) => (
  <SupportProfile>
    {Object.values(scales).map((scale) => (
      <div className="scale" key={scale.label}>
        <span className="name">{scale.label}</span>
        <div className="track">
          <div
            className="fill"
            style={{ width: `${(((scale.average ?? 1) - 1) / range) * 100}%` }}
          />
        </div>
        <span className="value">{scale.average?.toFixed(2)}</span>
        <div className="caption">{caption}</div>
      </div>
    ))}
  </SupportProfile>
);

export function MethodologyInterpretation({
  group,
}: MethodologyInterpretationProps) {
  if (group.code.startsWith("custom_method_") && group.result) {
    return (
      <ConfiguredMethodologyResult
        title={group.title}
        values={group.result.values}
      />
    );
  }
  if (!group.result) return <>{copy.pending}</>;
  if (group.code === "test_1") {
    const result = group.result.values as unknown as MspssValues;
    return (
      <>
        <b>
          {result.overall.label}: {result.overall.score.toFixed(2)} из 7 —{" "}
          {result.overall.levelLabel.toLowerCase()}
        </b>
        <SupportProfile>
          {Object.values(result.scales).map((scale) => (
            <div className="scale" key={scale.label}>
              <span className="name">{scale.label}</span>
              <div className="track">
                <div
                  className="fill"
                  style={{ width: `${(scale.score / scale.max) * 100}%` }}
                />
              </div>
              <span className="value">{scale.score.toFixed(2)}</span>
              <div className="caption">
                {scale.levelLabel} · ориентиры: &lt;3 низкая, 3–5 умеренная,
                &gt;5 высокая
              </div>
            </div>
          ))}
        </SupportProfile>
      </>
    );
  }
  if (group.code === "test_2") {
    const result = group.result.values as unknown as SspmValues;
    return (
      <>
        <b>
          {result.overall.label}: {result.overall.score} из{" "}
          {result.overall.maxScore} — {result.overall.levelLabel.toLowerCase()}
        </b>
        <ScoreProfile>
          {Object.values(result.scales).map((scale) => {
            const middle =
              scale.label === "Программирование" || scale.label === "Гибкость"
                ? { from: 5, to: 7 }
                : { from: 4, to: 6 };
            return (
              <div className="scale" key={scale.label}>
                <span className="name">{scale.label}</span>
                <div className="track">
                  <div
                    className="fill"
                    style={{
                      width: `${(scale.score / scale.maxScore) * 100}%`,
                    }}
                  />
                </div>
                <span className="value">{scale.score}</span>
                <div className="limits">
                  <span>0</span>
                  <span>
                    средний: {middle.from}–{middle.to}
                  </span>
                  <span>9</span>
                </div>
                <div className="level">{scale.levelLabel}</div>
              </div>
            );
          })}
        </ScoreProfile>
      </>
    );
  }
  if (group.code === "test_3") {
    const result = group.result.values as unknown as SccsValues;
    const direction =
      result.reference.zScore === 0
        ? "на уровне среднего"
        : result.reference.zScore > 0
          ? `на ${result.reference.zScore.toFixed(2)} SD выше среднего`
          : `на ${Math.abs(result.reference.zScore).toFixed(2)} SD ниже среднего`;
    return (
      <>
        <b>Ясность Я-концепции: {result.average.toFixed(2)} из 5</b>
        <Metrics>
          <div className="metric">
            <b>{result.average.toFixed(2)}</b>
            <span>средний балл, основной показатель</span>
          </div>
          <div className="metric">
            <b>{result.sum} / 60</b>
            <span>суммарный балл</span>
          </div>
          <div className="metric">
            <b>{result.reference.zScore.toFixed(2)} SD</b>
            <span>
              {direction}; M={result.reference.mean}, N=
              {result.reference.sampleSize}
            </span>
          </div>
        </Metrics>
      </>
    );
  }
  if (group.code === "test_4") {
    const result = group.result.values as unknown as NspsValues;
    return (
      <>
        <b>
          {result.overall.label}: {result.overall.score} из{" "}
          {result.overall.maxScore}
        </b>
        <SupportProfile>
          {Object.values(result.scales).map((scale) => (
            <div className="scale" key={scale.label}>
              <span className="name">{scale.label}</span>
              <div className="track">
                <div
                  className="fill"
                  style={{
                    width: `${((scale.score - scale.minScore) / (scale.maxScore - scale.minScore)) * 100}%`,
                  }}
                />
              </div>
              <span className="value">{scale.score}</span>
              <div className="caption">
                диапазон {scale.minScore}–{scale.maxScore} · чем выше балл, тем
                сильнее обеспокоенность
              </div>
            </div>
          ))}
        </SupportProfile>
      </>
    );
  }
  if (group.code === "test_5" || group.code === "test_6") {
    const result = group.result.values as unknown as FoodValues;
    return (
      <>
        <b>{group.code === "test_5" ? "Профиль ШОПП" : "Профиль DEBQ"}</b>
        <SupportProfile>
          {Object.values(result.scales).map((scale) => {
            const value = scale.score ?? scale.average ?? 0;
            const max = scale.maxScore ?? scale.max ?? 5;
            return (
              <div className="scale" key={scale.label}>
                <span className="name">{scale.label}</span>
                <div className="track">
                  <div
                    className="fill"
                    style={{ width: `${(value / max) * 100}%` }}
                  />
                </div>
                <span className="value">
                  {group.code === "test_6" ? value.toFixed(2) : value}
                </span>
                <div className="caption">
                  {group.code === "test_6" ? (
                    <>
                      {debqDescriptions[scale.label]}
                      <br />
                      {scale.interpretation}. Ориентир:{" "}
                      {scale.referenceMean?.toFixed(1)}; отклонение:{" "}
                      {(scale.difference ?? 0) > 0 ? "+" : ""}
                      {scale.difference?.toFixed(2)}
                    </>
                  ) : (
                    <>
                      {shoppDescriptions[scale.label]} Сырой балл из {max} · чем
                      выше, тем выраженнее признак.
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </SupportProfile>
      </>
    );
  }
  if (group.code === "test_7") {
    const result = group.result.values as unknown as NspsValues;
    return (
      <>
        <b>Профиль академической мотивации</b>
        <SupportProfile>
          {Object.values(result.scales).map((scale) => (
            <div className="scale" key={scale.label}>
              <span className="name">{scale.label}</span>
              <div className="track">
                <div
                  className="fill"
                  style={{ width: `${((scale.score - 4) / 16) * 100}%` }}
                />
              </div>
              <span className="value">{scale.score}</span>
              <div className="caption">
                диапазон 4–20 · чем выше балл, тем сильнее выражен мотив
              </div>
            </div>
          ))}
        </SupportProfile>
      </>
    );
  }
  if (group.code === "test_8") {
    const result = group.result.values as unknown as FoodValues;
    return (
      <>
        <b>Academic motivation profile</b>
        {renderScales(
          result.scales as Record<string, ScaleSummary>,
          6,
          "range 1–7 · research profile without diagnostic cutoffs",
        )}
      </>
    );
  }
  if (group.code === "test_9") {
    const result = group.result.values as unknown as FoodValues & {
      overall: { average: number };
    };
    return (
      <>
        <b>
          Общее отчуждение от учебы: {result.overall.average.toFixed(2)} из 5
        </b>
        {renderScales(
          result.scales as Record<string, ScaleSummary>,
          4,
          "диапазон 1–5 · без диагностических порогов",
        )}
      </>
    );
  }
  if (group.code === "test_10") {
    const result = group.result.values as {
      overall: { score: number; average: number };
    };
    return (
      <>
        <b>General procrastination: {result.overall.score} / 100</b>
        <SupportProfile>
          <div className="scale">
            <span className="name">Average adjusted response</span>
            <div className="track">
              <div
                className="fill"
                style={{
                  width: `${((result.overall.average - 1) / 4) * 100}%`,
                }}
              />
            </div>
            <span className="value">{result.overall.average.toFixed(2)}</span>
            <div className="caption">
              continuous research score · no diagnostic cutoffs
            </div>
          </div>
        </SupportProfile>
      </>
    );
  }
  if (group.code === "test_11") {
    const result = group.result.values as unknown as FoodValues & {
      overall: { score: number; average: number };
    };
    return (
      <>
        <b>Pure procrastination: {result.overall.average.toFixed(2)} / 5</b>
        {renderScales(
          result.scales as Record<string, ScaleSummary>,
          4,
          "range 1–5 · no diagnostic cutoffs",
        )}
      </>
    );
  }
  if (
    group.code === "test_12" ||
    group.code === "test_13" ||
    group.code === "test_15"
  ) {
    const result = group.result.values as {
      domains: Record<string, ScaleSummary>;
      facets: Record<string, ScaleSummary>;
    };
    const caption =
      group.code === "test_15"
        ? "range 1–5 · continuous score"
        : "диапазон 1–5 · без нормативных категорий";
    return (
      <>
        <b>
          {group.code === "test_15"
            ? "IPIP-NEO-120 domains"
            : group.code === "test_13"
              ? "Пять областей Big Five (BFI-2-S)"
              : "Пять областей Big Five"}
        </b>
        {renderScales(result.domains, 4, caption)}
        <b>
          {group.code === "test_15"
            ? "30 facets"
            : group.code === "test_13"
              ? "15 аспектов — интерпретировать осторожно"
              : "15 аспектов личностных черт"}
        </b>
        {renderScales(result.facets, 4, caption)}
      </>
    );
  }
  if (group.code === "test_14" || group.code === "test_16") {
    const result = group.result.values as {
      scales: Record<string, ScaleSummary>;
    };
    return (
      <>
        <b>
          {group.code === "test_14"
            ? "Краткий профиль TIPI-RU"
            : "Mini-IPIP profile"}
        </b>
        {renderScales(
          result.scales,
          group.code === "test_14" ? 6 : 4,
          group.code === "test_14"
            ? "диапазон 1–7 · без нормативных категорий"
            : "range 1–5 · continuous score",
        )}
      </>
    );
  }
  if (group.code === "test_17") {
    const result = group.result.values as {
      score: number;
      max: number;
      levelLabel: string;
    };
    return (
      <>
        <b>RSES</b>
        <p>
          {result.score} из {result.max} — {result.levelLabel}.{" "}
          {copy.notDiagnostic}
        </p>
      </>
    );
  }
  if (group.code === "test_18") {
    const result = group.result.values as { score: number; average: number };
    return (
      <>
        <b>Core Self-Evaluations Scale</b>
        <p>
          Mean {result.average.toFixed(2)} / 5; total {result.score} / 60.
          Continuous research score; no diagnostic cutoffs.
        </p>
      </>
    );
  }
  return <>{copy.calculated}</>;
}
