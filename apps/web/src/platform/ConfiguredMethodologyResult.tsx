import styled from "styled-components";

const Profile = styled.div`
  display: grid;
  gap: 11px;
  margin: 14px 0 3px;
  .scale {
    display: grid;
    grid-template-columns: minmax(120px, 220px) minmax(70px, 1fr) auto;
    gap: 10px;
    align-items: center;
  }
  .label {
    color: #435a49;
    font-size: 13px;
  }
  .value {
    color: #365640;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
  }
  .track {
    height: 12px;
    border-radius: 99px;
    background: #edf1eb;
    overflow: hidden;
  }
  .fill {
    height: 100%;
    border-radius: inherit;
    background: #64876d;
  }
  .caption {
    grid-column: 1/-1;
    color: #7b897f;
    font-size: 11px;
    margin-top: -7px;
  }
  @media (max-width: 600px) {
    .scale {
      grid-template-columns: minmax(90px, 1fr) auto;
    }
    .track {
      grid-column: 1/-1;
      grid-row: 2;
    }
  }
`;

export function ConfiguredMethodologyResult({
  title,
  values,
  compact = false,
}: {
  title: string;
  values: any;
  compact?: boolean;
}) {
  const scales = Object.values(values?.scales ?? {}) as {
    label: string;
    score: number;
    average: number;
    min: number;
    max: number;
    aggregation?: "sum" | "mean";
  }[];
  if (compact)
    return (
      <span className="score">
        {scales.length} шкал
        <br />
        <small>
          {scales
            .slice(0, 3)
            .map((scale) => `${scale.label}: ${Number(scale.score).toFixed(2)}`)
            .join(" · ")}
        </small>
      </span>
    );
  return (
    <section>
      <b>{title}</b>
      <Profile>
        {scales.map((scale) => {
          const score = Number(scale.score),
            min = Number(scale.min ?? 0),
            max = Number(scale.max ?? 1);
          const width =
            max > min
              ? Math.max(0, Math.min(100, ((score - min) / (max - min)) * 100))
              : 0;
          return (
            <div className="scale" key={scale.label}>
              <span className="label">{scale.label}</span>
              <div className="track">
                <div className="fill" style={{ width: `${width}%` }} />
              </div>
              <span className="value">{score.toFixed(2)}</span>
              <span className="caption">
                Диапазон {min}–{max} ·{" "}
                {scale.aggregation === "mean"
                  ? "среднее значение"
                  : "сумма баллов"}
              </span>
            </div>
          );
        })}
      </Profile>
    </section>
  );
}
