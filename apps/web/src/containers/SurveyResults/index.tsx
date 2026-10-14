import { useEffect, useState } from "react";
import { CheckCircle2, ExternalLink, Leaf, ShieldCheck } from "lucide-react";
import { api } from "../../api";
import { debqDescriptions, shoppDescriptions } from "../../shoppDescriptions";
import { Page, Shell, SkeletonScreen } from "../../ui";
import { ConfiguredMethodologyResult } from "../../components/ConfiguredMethodologyResult";
import type { ConfiguredResultValues } from "../../components/ConfiguredMethodologyResult/types";
import type { Scale, Result, Presentation, SourceGroup } from './types';
import { pct, short } from './const';
import { Header, Hero, Grid, ResultCard, Bars, Notice, Sources } from './styles';

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
  if (result.code === "test_7") {
    const top = Object.values(v.scales as Record<string, Scale>)
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .slice(0, 2)
      .map((scale) => scale.label.toLowerCase())
      .join(" и ");
    return (
      <ResultCard>
        <h2>Профиль академической мотивации</h2>
        <p className="summary">
          Наиболее выражены: {top}. Шкалы описывают разные причины учебной
          деятельности; универсальных диагностических порогов у методики нет.
        </p>
        <ScaleBars scales={v.scales} />
      </ResultCard>
    );
  }
  if (result.code === "test_8") {
    const top = Object.values(v.scales as Record<string, Scale>)
      .sort((a, b) => (b.average ?? 0) - (a.average ?? 0))
      .slice(0, 2)
      .map((scale) => scale.label)
      .join(" и ");
    return (
      <ResultCard>
        <h2>Academic motivation profile</h2>
        <p className="summary">
          Highest scores: {top}. The seven scales describe distinct reasons for
          studying; the authors do not define universal diagnostic cutoffs.
        </p>
        <ScaleBars scales={v.scales} />
      </ResultCard>
    );
  }
  if (result.code === "test_9") {
    const overall = v.overall as Scale;
    return (
      <ResultCard>
        <h2>Отчуждение от учебы</h2>
        <p className="summary">Общий показатель: {(overall.average ?? overall.score ?? 0).toFixed(2)} из 5. Методика описывает исследовательский профиль и не задаёт диагностических порогов.</p>
        <ScaleBars scales={v.scales} />
      </ResultCard>
    );
  }
  if (result.code === "test_10") {
    const overall = v.overall as Scale & {score:number;average:number};
    return (
      <ResultCard>
        <h2>General procrastination</h2>
        <p className="summary">Total score: {overall.score} of 100; average adjusted response: {overall.average.toFixed(2)} of 5. This is a continuous research score without diagnostic cutoffs.</p>
      </ResultCard>
    );
  }
  if (result.code === "test_11") {
    const overall = v.overall as Scale & {score:number;average:number};
    return (
      <ResultCard>
        <h2>Pure procrastination</h2>
        <p className="summary">Mean score: {overall.average.toFixed(2)} of 5; raw total: {overall.score} of 60. The PPS is a continuous research measure without diagnostic cutoffs.</p>
        <ScaleBars scales={v.scales} />
      </ResultCard>
    );
  }
  if (result.code === "test_12") {
    return (
      <ResultCard>
        <h2>Профиль Big Five</h2>
        <p className="summary">Показаны непрерывные средние значения пяти личностных областей от 1 до 5. Это не типы личности, нормативные категории или диагноз.</p>
        <ScaleBars scales={v.domains} />
        <h3>Аспекты личностных черт</h3>
        <ScaleBars scales={v.facets} />
      </ResultCard>
    );
  }
  if (result.code === "test_13") {
    return (
      <ResultCard>
        <h2>Краткий профиль Big Five</h2>
        <p className="summary">BFI-2-S показывает непрерывные средние пяти областей от 1 до 5. Аспекты основаны лишь на двух пунктах каждый и требуют особенно осторожной интерпретации. Это не типы личности, нормы или диагноз.</p>
        <ScaleBars scales={v.domains} />
        <h3>Аспекты личностных черт</h3>
        <ScaleBars scales={v.facets} />
      </ResultCard>
    );
  }
  if (result.code === "test_14") {
    return (
      <ResultCard>
        <h2>Краткий профиль TIPI-RU</h2>
        <p className="summary">Показаны непрерывные средние пяти областей от 1 до 7. Каждая оценка основана только на двух пунктах, поэтому её следует использовать как краткий исследовательский показатель, а не как диагноз или детальный личностный профиль.</p>
        <ScaleBars scales={v.scales} />
      </ResultCard>
    );
  }
  if (result.code === "test_15") {
    return (
      <ResultCard>
        <h2>IPIP-NEO-120 profile</h2>
        <p className="summary">Original English public-domain inventory. Scores are continuous means from 1 to 5 for the five domains and 30 facets; they are not diagnostic categories or norms.</p>
        <ScaleBars scales={v.domains} />
        <h3>30 facets</h3>
        <ScaleBars scales={v.facets} />
      </ResultCard>
    );
  }
  if (result.code === "test_16") {
    return (
      <ResultCard>
        <h2>Mini-IPIP profile</h2>
        <p className="summary">Original English public-domain short Big Five inventory. Scores are continuous means from 1 to 5 and are not diagnostic categories or norms.</p>
        <ScaleBars scales={v.scales} />
      </ResultCard>
    );
  }
  if (result.code === "test_17") {
    return (
      <ResultCard>
        <h2>Самооценка по шкале Розенберга</h2>
        <p className="summary">Итоговый балл: {v.score} из {v.max}. {v.levelLabel}. Это исследовательский показатель глобальной самооценки, а не медицинский диагноз.</p>
      </ResultCard>
    );
  }
  if (result.code === "test_18") {
    return (
      <ResultCard>
        <h2>Core Self-Evaluations</h2>
        <p className="summary">Mean score: {v.average.toFixed(2)} of 5; total score: {v.score} of 60. This is a continuous research score without diagnostic cutoffs.</p>
      </ResultCard>
    );
  }
  if (result.code === "test_19") {
    return (
      <ResultCard>
        <h2>Общая самоэффективность</h2>
        <p className="summary">Итоговый балл: {v.score} из 40; среднее: {v.average.toFixed(2)} из 4. Это непрерывный исследовательский показатель; универсальные диагностические пороги не установлены.</p>
      </ResultCard>
    );
  }
  if (result.code === "test_20") {
    return (
      <ResultCard>
        <h2>Brief COPE — русская краткая версия</h2>
        <p className="summary">Средние значения шести шкал (1–4). Шкала «Избегание» в исследовании имела низкую надёжность (α = 0,55), поэтому её результат следует трактовать особенно осторожно. Это исследовательские показатели, не диагноз.</p>
        <ScaleBars scales={v.scales} />
      </ResultCard>
    );
  }
  if (result.code === "test_21") {
    return (
      <ResultCard>
        <h2>Мотивация успеха и боязнь неудачи (МУН)</h2>
        <p className="summary">
          Итог: {v.overall.score} из 20 — {v.overall.category ?? "для этого результата авторская категория не задана"}.
          {v.overall.interpretation ? ` ${v.overall.interpretation}` : " Показан только сырой балл без интерпретации."}
          {" Это исследовательский показатель, а не диагноз."}
        </p>
      </ResultCard>
    );
  }
  if (v?.scales && typeof v.scales === "object")
    return (
      <ResultCard>
        <h2>{result.title}</h2>
        <p className="summary">Показаны рассчитанные значения шкал. Числа отображаются в диапазоне, заданном автором методики.</p>
        <ScaleBars scales={v.scales} />
      </ResultCard>
    );
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
              result.code.startsWith("custom_method_")
                ? <ConfiguredMethodologyResult title={result.title} values={result.values as ConfiguredResultValues} key={result.code}/>
                : <ResultContent result={result} key={result.code} />
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
