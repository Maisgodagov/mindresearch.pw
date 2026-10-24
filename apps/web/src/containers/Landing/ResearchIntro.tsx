import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
export function ResearchIntro({ create }: { create: string }) {
  return (
    <div className="landing-hero-copy research-intro">
      <h1>
        Платформа для <em>психологических исследований</em>
      </h1>
      <p className="research-intro-lead">
        mindresearch помогает студентам, психологам и исследователям проводить
        опросы и анализировать данные в одном месте.
      </p>
      <div className="research-intro-details">
        <p>
          <strong>Соберите исследование под свою задачу.</strong> Добавьте
          готовые методики и свои вопросы. Отправьте участникам ссылку —
          регистрация для прохождения не нужна.
        </p>
        <p>
          <strong>Работайте с результатами.</strong> Получайте рассчитанные
          показатели методик, сохраняйте выборки и считайте статистику:
          сравнивайте группы, изучайте связи и распределения. Проверяйте
          формулы и исходные данные.
        </p>
        <p>
          Выгружайте результаты в Excel, сохраняйте отчёты и работайте
          над исследованием вместе с коллегами.
        </p>
      </div>
      <div className="research-intro-actions">
        <Link className="landing-button" to={create}>
          Создать своё исследование
          <ArrowRight size={18} />
        </Link>
        <a href="#builder">
          Посмотреть возможности
          <ArrowRight size={16} />
        </a>
      </div>
    </div>
  );
}
