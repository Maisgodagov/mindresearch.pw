import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
const examples = [
  {
    label: "Найти связь",
    question: "Связана ли поддержка близких с уверенностью в себе?",
    measure: "Социальная поддержка + самоэффективность",
    instruments: "MSPSS и шкала общей самоэффективности",
    analysis: "Корреляционный анализ",
    outcome:
      "Посмотрите, как связаны два показателя у одних и тех же участников.",
  },
  {
    label: "Сравнить группы",
    question: "Отличается ли самооценка у людей разного возраста?",
    measure: "Самооценка + возраст участников",
    instruments: "Шкала Розенберга и вопрос о возрасте",
    analysis: "Сравнение выборок",
    outcome: "Сохраните возрастные группы и проверьте различия между ними.",
  },
  {
    label: "Описать выборку",
    question: "Насколько участники уверены, что справятся с трудностями?",
    measure: "Общая самоэффективность",
    instruments: "Шкала общей самоэффективности",
    analysis: "Описательная статистика",
    outcome: "Изучите среднее, медиану и разброс результатов в своей выборке.",
  },
];
export function ResearchQuestion({ create }: { create: string }) {
  const [selected, setSelected] = useState(0);
  const example = examples[selected];
  return (
    <div className="landing-hero-copy research-question">
      <h1>
        Что вы хотите
        <br />
        <em>исследовать?</em>
      </h1>
      <p className="rq-intro">
        Начните с вопроса. Посмотрите, как он превращается в исследование.
      </p>
      <div
        className="rq-choices"
        role="group"
        aria-label="Примеры исследовательских задач"
      >
        {examples.map((item, i) => (
          <button
            key={item.label}
            aria-pressed={selected === i}
            onClick={() => setSelected(i)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="rq-example" aria-live="polite" aria-atomic="true">
        <blockquote>{example.question}</blockquote>
        <dl>
          <div>
            <dt>Измерить</dt>
            <dd>
              <strong>{example.measure}</strong>
              <span>{example.instruments}</span>
            </dd>
          </div>
          <div>
            <dt>Разобраться</dt>
            <dd>
              <strong>{example.analysis}</strong>
              <span>{example.outcome}</span>
            </dd>
          </div>
        </dl>
      </div>
      <div className="rq-action">
        <Link className="landing-button" to={create}>
          Создать свой опрос
          <ArrowRight size={18} />
        </Link>
        <a href="#analysis">
          Посмотреть пример расчёта
          <ArrowRight size={15} />
        </a>
      </div>
    </div>
  );
}
