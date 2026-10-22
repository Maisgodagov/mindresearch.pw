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
          <strong>Соберите исследование под свою задачу.</strong> Объединяйте
          готовые методики и собственные вопросы, настройте порядок блоков и
          отправьте участникам одну ссылку. Для прохождения регистрация не
          нужна.
        </p>
        <p>
          <strong>Работайте с собранными данными.</strong> Получайте
          рассчитанные показатели методик с автоподсчётом, сохраняйте выборки и
          запускайте статистический анализ: сравнивайте группы, изучайте связи и
          распределение результатов. Формулы и исходные значения доступны для
          проверки.
        </p>
        <p>
          Выгружайте выбранные методики и свои блоки в Excel, сохраняйте отчёты
          и открывайте совместный доступ к исследованию.
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
