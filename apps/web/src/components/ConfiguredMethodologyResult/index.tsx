import { compactScaleLimit, defaultScaleMax, defaultScaleMin } from "./const";
import { Profile } from "./styles";
import type { Props } from "./types";

export type { ConfiguredResultValues } from "./types";

export function ConfiguredMethodologyResult({ title, values, compact = false }: Props) {
  const scales = Object.values(values?.scales ?? {});
  if (compact) {
    return (
      <span className="score">
        {scales.length} шкал<br />
        <small>{scales.slice(0, compactScaleLimit)
          .map((scale) => `${scale.label}: ${Number(scale.score).toFixed(2)}`).join(" · ")}</small>
      </span>
    );
  }

  return (
    <section>
      <b>{title}</b>
      <Profile>
        {scales.map((scale) => {
          const score = Number(scale.score);
          const min = Number(scale.min ?? defaultScaleMin);
          const max = Number(scale.max ?? defaultScaleMax);
          const width = max > min ? Math.max(0, Math.min(100, ((score - min) / (max - min)) * 100)) : 0;
          return (
            <div className="scale" key={scale.label}>
              <span className="label">{scale.label}</span>
              <div className="track"><div className="fill" style={{ width: `${width}%` }} /></div>
              <span className="value">{score.toFixed(2)}</span>
              <span className="caption">
                Диапазон {min}–{max} · {scale.aggregation === "mean" ? "среднее значение" : "сумма баллов"}
              </span>
            </div>
          );
        })}
      </Profile>
    </section>
  );
}

export type { Props as ConfiguredMethodologyResultProps } from "./types";
