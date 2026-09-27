import { useEffect, useState } from "react";
import styled from "styled-components";
import { CheckCircle2, ExternalLink, Leaf, ShieldCheck } from "lucide-react";
import { api } from "../api";
import { debqDescriptions, shoppDescriptions } from "../shoppDescriptions";
import { Card, Page, Shell, SkeletonScreen } from "../ui";

type Scale = {
  label: string;
  score?: number;
  average?: number;
  max?: number;
  maxScore?: number;
  minScore?: number;
  referenceMean?: number;
  difference?: number;
  elevated?: boolean;
  levelLabel?: string;
};
type Result = {
  code: string;
  title: string;
  formulaVersion: string;
  values: any;
};
type Presentation = {
  showResults: boolean;
  showScores: boolean;
  title: string;
  text: string;
};
type MethodSource = { title: string; url: string };
type SourceGroup = { code: string; title: string; sources: MethodSource[] };
const Header = styled.header`
  padding: 24px 0 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #526f5b;
  font-weight: 750;
`;
const Hero = styled(Card)`
  margin: 5vh auto 18px;
  padding: clamp(28px, 7vw, 52px);
  background: linear-gradient(145deg, #fff, #edf4eb);
  h1 {
    font:
      500 clamp(32px, 7vw, 50px)/1.08 var(--font-heading),
      serif;
    color: #2f4938;
    margin: 18px 0 12px;
  }
  p {
    color: #607067;
    line-height: 1.6;
    margin: 0;
    max-width: 680px;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: #50705a;
    background: #e1ece0;
    padding: 7px 11px;
    border-radius: 99px;
    font-size: 13px;
  }
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin: 18px 0;
  align-items: start;
  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;
const ResultCard = styled(Card)`
  padding: 22px;
  h2 {
    font:
      600 19px/1.3 var(--font-heading),
      serif;
    color: #334c3b;
    margin: 0 0 8px;
  }
  .summary {
    font-size: 14px;
    line-height: 1.55;
    color: #657269;
    margin-bottom: 18px;
  }
  .main {
    font-size: 25px;
    font-weight: 800;
    color: #3f624a;
    margin: 8px 0;
  }
  .sub {
    color: #7a867e;
    font-size: 12px;
  }
`;
const Bars = styled.div`
  display: grid;
  gap: 13px;
  .row {
    display: grid;
    grid-template-columns: minmax(120px, 1fr) 54px;
    gap: 6px 10px;
    align-items: center;
  }
  .name {
    font-size: 12px;
    color: #526158;
  }
  .value {
    text-align: right;
    font-weight: 800;
    color: #3f5e48;
  }
  .track {
    grid-column: 1 / 3;
    height: 9px;
    background: #e8ede6;
    border-radius: 10px;
    overflow: hidden;
  }
  .fill {
    height: 100%;
    background: linear-gradient(90deg, #8baa90, #5f8269);
    border-radius: 10px;
  }
  .note {
    grid-column: 1 / 3;
    color: #7c887f;
    font-size: 11px;
    margin-top: -2px;
  }
  .note.high {
    color: #8a654d;
  }
`;
const Notice = styled(Card)`
  padding: 20px;
  margin: 0 0 30px;
  display: flex;
  gap: 12px;
  color: #647168;
  font-size: 13px;
  line-height: 1.55;
  svg {
    flex: none;
    color: #63806a;
  }
`;
const Sources = styled(Card)`
  margin: 22px 0 44px;
  padding: 22px 24px;
  color: #657269;
  font-size: 13px;
  line-height: 1.55;
  h2 {
    font:
      600 19px/1.3 var(--font-heading),
      serif;
    color: #334c3b;
    margin: 0 0 6px;
  }
  .intro {
    margin: 0 0 16px;
    color: #7b877f;
  }
  .group + .group {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #e3e9e1;
  }
  .method {
    font-weight: 750;
    color: #405a48;
    margin-bottom: 7px;
  }
  .links {
    display: flex;
    flex-wrap: wrap;
    gap: 7px 16px;
  }
  a {
    color: #52705a;
    text-decoration: underline;
    text-decoration-color: #b9c8bb;
    text-underline-offset: 3px;
    display: inline-flex;
    align-items: flex-start;
    gap: 5px;
  }
  a:hover {
    color: #2f4938;
    text-decoration-color: currentColor;
  }
  svg {
    flex: none;
    margin-top: 3px;
  }
`;

const pct = (scale: Scale) => {
  const value = scale.score ?? scale.average ?? 0,
    max = scale.maxScore ?? scale.max ?? 5,
    min = scale.minScore ?? 0;
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
};
const short = (label: string) =>
  label
    .replace(" пищевое поведение", "")
    .replace("Физическая внешность", "Внешность");
function ScaleBars({
  scales,
  debq = false,
  descriptions,
}: {
  scales: Record<string, Scale>;
  debq?: boolean;
  descriptions?: Record<string, string>;
}) {
  return (
    <Bars>
      {Object.values(scales).map((scale) => {
        const value = scale.score ?? scale.average ?? 0,
          description = descriptions?.[scale.label];
        return (
          <div className="row" key={scale.label}>
            <span className="name">{short(scale.label)}</span>
            <span className="value">
              {Number.isInteger(value) ? value : value.toFixed(2)}
            </span>
            <div className="track">
              <div className="fill" style={{ width: `${pct(scale)}%` }} />
            </div>
            <span className={`note ${scale.elevated ? "high" : ""}`}>
              {description}
              {description && debq && <br />}
              {debq
                ? scale.elevated
                  ? `Выше ориентира ${scale.referenceMean?.toFixed(1)}`
                  : `Не выше ориентира ${scale.referenceMean?.toFixed(1)}`
                : !description &&
                  (scale.levelLabel ??
                    "Чем длиннее полоса, тем выше показатель")}
            </span>
          </div>
        );
      })}
    </Bars>
  );
}
function ResultContent({ result }: { result: Result }) {
  const v = result.values;
  if (result.code === "test_1")
    return (
      <ResultCard>
        <h2>Воспринимаемая поддержка</h2>
        <div className="main">{v.overall.score.toFixed(2)} из 7</div>
        <p className="summary">
          {v.overall.levelLabel}. Показатель отражает, насколько доступной
          ощущается помощь близких.
        </p>
        <ScaleBars scales={v.scales} />
      </ResultCard>
    );
  if (result.code === "test_2")
    return (
      <ResultCard>
        <h2>Саморегуляция</h2>
        <div className="main">
          {v.overall.score} из {v.overall.maxScore}
        </div>
        <p className="summary">
          Общий уровень: {v.overall.levelLabel.toLowerCase()}. Профиль
          показывает сильные и менее выраженные регуляторные процессы.
        </p>
        <ScaleBars scales={v.scales} />
      </ResultCard>
    );
  if (result.code === "test_3") {
    const z = v.reference.zScore,
      comparison =
        Math.abs(z) < 0.5
          ? "близок к среднему справочной выборки"
          : z > 0
            ? "выше среднего справочной выборки"
            : "ниже среднего справочной выборки";
    return (
      <ResultCard>
        <h2>Ясность Я-концепции</h2>
        <div className="main">{v.average.toFixed(2)} из 5</div>
        <p className="summary">
          Результат {comparison}. Более высокий балл означает более ясное и
          устойчивое представление о себе.
        </p>
        <div className="sub">
          Сумма {v.sum} из 60 · отклонение {z.toFixed(2)} SD
        </div>
      </ResultCard>
    );
  }
  if (result.code === "test_4") {
    const top = Object.values(v.scales as Record<string, Scale>).sort(
      (a, b) => pct(b) - pct(a),
    )[0];
    return (
      <ResultCard>
        <h2>Негативный образ себя</h2>
        <div className="main">
          {v.overall.score} из {v.overall.maxScore}
        </div>
        <p className="summary">
          Наиболее заметная область беспокойства в вашем профиле — «
          {short(top.label).toLowerCase()}». У шкалы нет универсальных
          диагностических порогов.
        </p>
        <ScaleBars scales={v.scales} />
      </ResultCard>
    );
  }
  if (result.code === "test_5") {
    const top = Object.values(v.scales as Record<string, Scale>)
      .sort((a, b) => pct(b) - pct(a))
      .slice(0, 2)
      .map((x) => x.label.toLowerCase())
      .join(" и ");
    return (
      <ResultCard>
        <h2>Особенности пищевого поведения</h2>
        <p className="summary">
          Относительно вашего профиля наиболее выражены: {top}. Это описание
          направлений, а не диагноз.
        </p>
        <ScaleBars scales={v.scales} descriptions={shoppDescriptions} />
      </ResultCard>
    );
  }
  if (result.code === "test_6") {
    const elevated = Object.values(v.scales as Record<string, Scale>)
      .filter((x) => x.elevated)
      .map((x) => short(x.label).toLowerCase());
    return (
      <ResultCard>
        <h2>Типы пищевого поведения</h2>
        <p className="summary">
          {elevated.length
            ? `Выше справочного ориентира: ${elevated.join(", ")}.`
            : "Все три показателя не превышают справочные ориентиры."}
        </p>
        <ScaleBars scales={v.scales} descriptions={debqDescriptions} debq />
      </ResultCard>
    );
  }
  return null;
}

export function ResultsPage({ token }: { token: string }) {
  const [results, setResults] = useState<Result[]>([]);
  const [sourceGroups, setSourceGroups] = useState<SourceGroup[]>([]);
  const [presentation, setPresentation] = useState<Presentation>({
    showResults: true,
    showScores: true,
    title: "Спасибо за ваши ответы",
    text: "",
  });
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    api
      .get(`/public/sessions/${token}/results`)
      .then((r) => {
        setResults(r.data.results);
        setSourceGroups(r.data.sourceGroups ?? []);
        if (r.data.presentation) setPresentation(r.data.presentation);
      })
      .catch(() => setError(true))
      .finally(() => setLoaded(true));
  }, [token]);
  if (!loaded)
    return (
      <Page>
        <Shell>
          <Header><Leaf /> mindresearch</Header>
          <SkeletonScreen variant="public" />
        </Shell>
      </Page>
    );
  const incomplete = results.length > 0 && results.length < 6;
  return (
    <Page>
      <Shell>
        <Header>
          <Leaf /> mindresearch
        </Header>
        <Hero>
          <span className="badge">
            <CheckCircle2 size={15} /> Опрос завершён
          </span>
          <h1>{presentation.title || "Спасибо за ваши ответы"}</h1>
          <p>
            {presentation.text ||
              (results.length
                ? "Ниже — краткий профиль результатов."
                : "Ваши ответы сохранены.")}
          </p>
        </Hero>
        {results.length > 0 && (
          <Notice>
            <ShieldCheck />
            <span>
              <b>Важно:</b> результаты опросников не являются медицинским
              диагнозом и не заменяют консультацию специалиста. Отдельные
              показатели следует рассматривать вместе с жизненной ситуацией и
              другими данными.
            </span>
          </Notice>
        )}
        {incomplete && (
          <Notice>
            <ShieldCheck />
            <span>
              <b>Отчёт содержит результаты включённых методик.</b> Показаны
              только полностью и достоверно рассчитанные показатели.
            </span>
          </Notice>
        )}
        {error ? (
          <Notice>
            Не удалось загрузить результаты. Попробуйте обновить страницу.
          </Notice>
        ) : !loaded ? (
          <Notice>Рассчитываем результаты…</Notice>
        ) : results.length ? (
          <Grid>
            {results.map((result) => (
              <ResultContent result={result} key={result.code} />
            ))}
          </Grid>
        ) : presentation.showResults === false ||
          presentation.showScores === false ? null : (
          <Notice>
            <CheckCircle2 />
            <span>
              Опрос успешно завершён. Для авторских вопросов автоматический
              расчёт не предусмотрен.
            </span>
          </Notice>
        )}
        {sourceGroups.length > 0 && (
          <Sources>
            <h2>Источники методик</h2>
            <p className="intro">
              Материалы, на которых основаны использованные в опросе методики и
              правила их расчёта.
            </p>
            {sourceGroups.map((group) => (
              <div className="group" key={group.code}>
                <div className="method">{group.title}</div>
                <div className="links">
                  {group.sources.map((source) => (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      key={source.url}
                    >
                      {source.title}
                      <ExternalLink size={12} />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </Sources>
        )}
      </Shell>
    </Page>
  );
}
