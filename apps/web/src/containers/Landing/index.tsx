import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PlatformLayout } from "../PlatformLayout";
import { titleForPage } from "../../pageTitle";
import { getCachedCurrentUser, initializeAuth } from "../../api";
import "./landing.css";
const ResearchDemo = lazy(() => import("./ResearchDemo"));
export function Landing() {
  const [signedIn, setSignedIn] = useState(Boolean(getCachedCurrentUser()));
  useEffect(() => {
    let active = true;
    document.title = titleForPage("Для исследователей");
    const existing = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    const canonical = existing ?? document.createElement("link");
    const previous = existing?.href;
    canonical.rel = "canonical";
    canonical.href = "https://mindresearch.pro/for-researchers";
    if (!existing) document.head.append(canonical);
    void initializeAuth()
      .then((token) => {
        if (active) setSignedIn(Boolean(token));
      })
      .catch(() => {});
    return () => {
      active = false;
      if (previous) canonical.href = previous;
      else canonical.remove();
    };
  }, []);
  const create = signedIn ? "/app/surveys/new" : "/register";
  return (
    <PlatformLayout publicAccess>
      <div className="research-landing">
        <section className="research-hero">
          <h1>
            Ваше исследование.
            <br />
            От вопросов <span>до статистики.</span>
          </h1>
          <div className="research-hero-bottom">
            <p>
              Соберите методики и свои вопросы в один опрос. Получайте ответы по
              ссылке, изучайте результаты и проверяйте гипотезы — в
              mindresearch.
            </p>
            <div className="research-actions">
              <Link className="research-primary" to={create}>
                Создать своё исследование
                <ArrowRight size={18} />
              </Link>
              <a href="#try-research">Сначала попробовать ↓</a>
            </div>
          </div>
        </section>
        <section id="try-research" className="research-workshop">
          <div className="research-section-head">
            <h2>Попробуйте на небольшом исследовании</h2>
            <p>
              Нажимайте, меняйте, считайте. Здесь можно разобраться без
              регистрации.
            </p>
          </div>
          <Suspense
            fallback={
              <div
                className="research-skeleton"
                aria-label="Загружаем интерактивный пример"
              />
            }
          >
            <ResearchDemo />
          </Suspense>
        </section>
        <section className="research-benefits">
          <div>
            <h2>
              Меньше переносить вручную.
              <br />
              Больше разбираться в данных.
            </h2>
            <p>
              Для курсовой, диссертации и исследовательского проекта: весь путь
              остаётся в одном рабочем пространстве.
            </p>
          </div>
          <div className="research-benefit-list">
            {[
              [
                "Опрос под ваш замысел",
                "Объединяйте готовые методики и собственные блоки. Настраивайте порядок, приветствие и финальный экран. Проверьте всё в предпросмотре перед публикацией.",
              ],
              [
                "Ответы без лишних шагов",
                "Отправьте участникам ссылку. Для прохождения не нужен аккаунт; опрос работает на телефоне и компьютере. Следите за начатыми и завершёнными прохождениями.",
              ],
              [
                "Отдельные группы для ваших гипотез",
                "Фильтруйте результаты, выбирайте нужных участников и сохраняйте выборки. Состав фиксируется; изменения остаются под вашим контролем.",
              ],
              [
                "Статистика с понятным происхождением",
                "Описательные показатели, сравнение групп, корреляции и более сложные модели. Выбирайте метод, проверяйте данные и просматривайте формулы, настройки и исходные значения в отчёте.",
              ],
              [
                "Данные, с которыми можно идти дальше",
                "Выгружайте Excel с выбранными методиками и своими блоками вопросов. Сопоставляйте сохранённые расчёты и открывайте совместный доступ к исследованию.",
              ],
            ].map(([title, text], i) => (
              <article key={title}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="research-faq">
          <h2>Перед первым исследованием</h2>
          {[
            [
              "Нужно ли регистрироваться?",
              "Исследователю нужен аккаунт, чтобы сохранять опросы и работать с результатами. Респонденты проходят опрос по ссылке без обязательной регистрации.",
            ],
            [
              "Можно использовать собственные вопросы?",
              "Да. Добавляйте свои блоки вместе с методиками: один или несколько вариантов ответа, текстовые и числовые поля.",
            ],
            [
              "Платформа сама посчитает баллы?",
              "Для методик с поддерживаемым расчётом — да. Итоговые показатели появляются в результатах. Статистический анализ вы запускаете отдельно, выбирая показатели и выборки.",
            ],
            [
              "Чем публичные методики отличаются от исследования?",
              "В публичном каталоге человек проходит отдельную методику и получает свой результат. Исследователь создаёт собственный опрос, собирает ответы участников и анализирует общую выборку.",
            ],
          ].map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </section>
        <section className="research-final">
          <h2>
            Начните с вопроса,
            <br />
            который хотите исследовать.
          </h2>
          <p>Инструменты для сбора и анализа уже под рукой.</p>
          <Link className="research-primary" to={create}>
            Собрать первый опрос
            <ArrowRight size={18} />
          </Link>
          <Link to="/methods">Или познакомиться с публичными методиками →</Link>
        </section>
      </div>
    </PlatformLayout>
  );
}
