import { PlatformLayout } from "../PlatformLayout";
import { titleForPage } from "../../pageTitle";
import { BrandWordmark } from "../../components/BrandWordmark";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Leaf, Plus } from "lucide-react";
import { getCachedCurrentUser, initializeAuth } from "../../api";
import "./landing.css";

import { DemoMedia, DemoProvider } from "./DemoMedia";
const Picture = DemoMedia;

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
      <DemoProvider>
        <div className="landing landing-in-app">
          <div className="landing-content">
            <section className="landing-hero landing-wrap">
              <div className="landing-hero-copy">
                <h1>
                  От хороших вопросов
                  <br />к понятным <em>результатам.</em>
                </h1>
                <p>
                  Готовые методики, ваши вопросы и статистический анализ — в
                  одном рабочем пространстве для психологического исследования.
                </p>
                <ol
                  className="landing-workflow landing-hero-workflow"
                  aria-label="Как проходит исследование"
                >
                  <li>
                    <h3>Соберите опрос</h3>
                    <p>Методики и ваши вопросы</p>
                  </li>
                  <li>
                    <h3>Поделитесь ссылкой</h3>
                    <p>Удобное прохождение на любом экране</p>
                  </li>
                  <li>
                    <h3>Изучите результаты</h3>
                    <p>Ответы, шкалы и статистический анализ</p>
                  </li>
                </ol>
                <div className="landing-actions">
                  <Link className="landing-button" to={create}>
                    <Plus size={18} />
                    {signedIn ? "Создать опрос" : "Начать исследование"}
                  </Link>
                  <a className="landing-text-link" href="#builder">
                    Посмотреть возможности
                    <ArrowRight size={17} />
                  </a>
                </div>
              </div>
              <div className="landing-hero-image">
                <div className="landing-browser">
                  <span />
                  <span />
                  <span />
                  <b>Ваше исследование</b>
                </div>
                <Picture
                  name="builder"
                  alt="Конструктор опроса с готовой методикой и собственным блоком вопросов"
                />
              </div>
            </section>

            <section
              id="builder"
              className="landing-section landing-wrap landing-split"
            >
              <div>
                <h2>
                  Ваш опрос.
                  <br />
                  Ваши правила.
                </h2>
                <p className="landing-lead">
                  Соберите исследование так, как задумали: от приветствия до
                  последнего вопроса.
                </p>
                <ul className="landing-benefits">
                  <li>
                    <Check />
                    Настройте начальный и финальный экраны, название и примерное
                    время прохождения.
                  </li>
                  <li>
                    <Check />
                    Создавайте свои тесты: один или несколько вариантов ответа,
                    текстовые и числовые поля.
                  </li>
                  <li>
                    <Check />
                    Меняйте порядок методик и собственных блоков. Отмечайте
                    обязательные вопросы.
                  </li>
                  <li>
                    <Check />
                    Проверяйте опрос в предпросмотре. Черновик сохраняется
                    автоматически.
                  </li>
                </ul>
                <Link className="landing-text-link" to={create}>
                  Собрать первый опрос
                  <ArrowRight size={17} />
                </Link>
              </div>
              <Picture
                name="custom"
                alt="Собственный блок с вопросом, вариантами ответа и настройкой обязательности"
              />
            </section>
            <section id="catalog" className="landing-catalog">
              <div className="landing-wrap">
                <div className="landing-section-heading">
                  <h2>
                    Готовые методики.
                    <br />
                    <em>Меньше ручной работы.</em>
                  </h2>
                  <p>
                    Найдите подходящий инструмент в каталоге. Изучите описание,
                    добавьте его в опрос и используйте автоматический расчёт
                    там, где он предусмотрен.
                  </p>
                </div>
                <div className="landing-catalog-layout">
                  <Picture
                    name="catalog"
                    alt="Каталог методик с поиском и фильтром категорий"
                  />
                  <div className="landing-feature-notes">
                    <article>
                      <h3>Поиск и категории</h3>
                      <p>
                        Ищите по названию, автору, категории или подкатегории.
                        Сужайте выбор до интересующей области.
                      </p>
                    </article>
                    <article>
                      <h3>Информация до добавления</h3>
                      <p>
                        Откройте описание методики, чтобы понять, что она
                        измеряет и подходит ли вашему исследованию.
                      </p>
                    </article>
                    <article>
                      <h3>Автоматический подсчёт</h3>
                      <p>
                        Для методик с расчётом платформа сама вычислит
                        показатели. Итоговые баллы появятся в результатах — без
                        переноса ключей вручную.
                      </p>
                    </article>
                  </div>
                </div>
              </div>
            </section>
            <section className="landing-section landing-wrap landing-split">
              <div>
                <h2>
                  Опубликуйте.
                  <br />
                  Отправьте.
                  <br />
                  <em>Собирайте ответы.</em>
                </h2>
                <p className="landing-lead">
                  Когда опрос готов, опубликуйте его и скопируйте ссылку.
                  Отправляйте её в мессенджерах, по почте или размещайте там,
                  где ваша аудитория.
                </p>
                <ul className="landing-benefits">
                  <li>
                    <Check />
                    Храните незавершённые исследования в черновиках.
                  </li>
                  <li>
                    <Check />
                    Следите за количеством начатых и завершённых прохождений.
                  </li>
                  <li>
                    <Check />
                    Завершайте сбор ответов, когда исследование закончено.
                  </li>
                </ul>
              </div>
              <Picture
                name="share"
                alt="Карточка опубликованного опроса с кнопками копирования ссылки и статистики"
              />
            </section>
            <section
              id="respondent"
              className="landing-respondent landing-wrap"
            >
              <div className="landing-section-heading">
                <h2>
                  Удобно вам.
                  <br />
                  Понятно респонденту.
                </h2>
                <p>
                  Участнику достаточно открыть ссылку — регистрация не нужна.
                  Опрос адаптируется к экрану, показывает прогресс и позволяет
                  прерваться и продолжить позже.
                </p>
              </div>
              <div className="landing-devices">
                <Picture
                  name="desktop"
                  alt="Экран прохождения опроса на компьютере"
                  className="landing-desktop"
                />
                <Picture
                  name="phone"
                  alt="Экран прохождения того же опроса на телефоне"
                  className="landing-phone"
                />
              </div>
            </section>
            <section id="results" className="landing-section landing-wrap">
              <div className="landing-section-heading">
                <h2>
                  Ответы собраны.
                  <br />
                  <em>Что за ними стоит?</em>
                </h2>
                <p>
                  От общего обзора исследования до конкретного респондента:
                  смотрите ответы, рассчитанные шкалы и показатели процесса
                  прохождения.
                </p>
              </div>
              <Picture
                name="statistics"
                alt="Статистика опроса: участники, завершённые прохождения и список результатов"
              />
              <Picture
                name="respondents"
                alt="Список респондентов с сортировкой, фильтрами и раскрытием ответов"
                className="landing-respondents-picture"
              />
              <div className="landing-results-grid">
                <Picture
                  name="scales"
                  alt="Автоматически рассчитанные показатели методики в результатах респондента"
                />
                <div className="landing-feature-notes">
                  <article>
                    <h3>Результаты по методикам</h3>
                    <p>
                      Раскрывайте ответы участника и смотрите рассчитанные
                      значения шкал для методик с автоподсчётом.
                    </p>
                  </article>
                  <article>
                    <h3>Время и качество прохождения</h3>
                    <p>
                      Оценивайте скорость ответов, быстрые серии и другие
                      доступные признаки. Они помогают изучать необычные
                      прохождения; решение об исключении остаётся за вами.
                    </p>
                  </article>
                  <article>
                    <h3>Фильтры и выгрузка</h3>
                    <p>
                      Выбирайте участников, сохраняйте группы для анализа и
                      выгружайте в Excel нужные методики и собственные блоки
                      вопросов.
                    </p>
                  </article>
                </div>
              </div>
            </section>
            <section id="analysis" className="landing-section landing-wrap">
              <div className="landing-section-heading">
                <h2>
                  От результатов
                  <br />
                  <em>к проверке гипотез.</em>
                </h2>
                <p>
                  Считайте статистику там же, где собрали ответы. Выберите
                  сохранённую выборку, показатели и подходящий метод — исходные
                  значения и формулы останутся перед глазами.
                </p>
              </div>
              <Picture
                name="analysis"
                alt="Статистический анализ на демонстрационных данных"
              />
              <div className="landing-analysis-notes">
                <article>
                  <h3>Метод под вашу задачу</h3>
                  <p>
                    Описательные показатели, сравнение групп, корреляции и более
                    сложные модели. Настройки и проверка данных помогают
                    подготовить расчёт.
                  </p>
                </article>
                <article>
                  <h3>Прозрачный результат</h3>
                  <p>
                    Просматривайте исходные значения, формулы и настройки.
                    Сохраняйте отчёты и сопоставляйте результаты анализов.
                  </p>
                </article>
              </div>
            </section>
            <section className="landing-extras landing-wrap">
              <article>
                <h3>Представьте себя участникам</h3>
                <p>
                  Настройте публичный профиль исследователя и добавьте ссылку на
                  него в начале опроса. Вы сами выбираете, будет ли профиль
                  доступен другим.
                </p>
                <Link
                  className="landing-text-link"
                  to={signedIn ? "/app/profile" : "/register"}
                >
                  Настроить профиль
                  <ArrowRight size={16} />
                </Link>
              </article>
              <article>
                <h3>Не нашли нужную методику?</h3>
                <p>
                  Отправьте запрос на добавление. А пока можно собрать
                  собственный блок вопросов и включить его в исследование.
                </p>
                <Link
                  className="landing-text-link"
                  to={signedIn ? "/app/methodologies/suggest" : "/register"}
                >
                  Запросить методику
                  <ArrowRight size={16} />
                </Link>
              </article>
            </section>
            <section className="landing-faq landing-wrap">
              <h2>Несколько полезных деталей</h2>
              {[
                [
                  "Можно объединить свои вопросы и готовые методики?",
                  "Да. В одном опросе можно использовать несколько методик и собственные блоки, а затем менять их порядок.",
                ],
                [
                  "Участник увидит свои результаты?",
                  "Это зависит от настроек финального экрана. При создании опроса вы выбираете, показывать ли респонденту результаты методик.",
                ],
                [
                  "Можно изменить опрос после получения ответов?",
                  "После появления ответов изменение структуры ограничено, чтобы уже собранные данные оставались сопоставимыми. На странице редактирования будет объяснение этих ограничений.",
                ],
                [
                  "Что означают показатели качества?",
                  "Это признаки особенностей прохождения, а не доказательство недостоверности ответов. Смотрите доступность данных и отдельные метрики, прежде чем принимать решение.",
                ],
              ].map(([q, a]) => (
                <details key={q}>
                  <summary>
                    {q}
                    <Plus size={18} />
                  </summary>
                  <p>{a}</p>
                </details>
              ))}
            </section>
            <section className="landing-final landing-wrap">
              <Leaf size={35} />
              <h2>
                Следующее исследование
                <br />
                начинается с вашего вопроса.
              </h2>
              <p>Соберите опрос — платформа поможет с остальным.</p>
              <Link className="landing-button" to={create}>
                {signedIn ? "Создать опрос" : "Создать аккаунт"}
                <ArrowRight size={18} />
              </Link>
            </section>
          </div>
          <footer className="landing-footer landing-wrap">
            <Link className="landing-brand" to="/">
              <Leaf size={22} />
              <BrandWordmark />
            </Link>
            <span>Психологические исследования — в одном месте.</span>
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Наверх ↑
            </a>
          </footer>
        </div>
      </DemoProvider>
    </PlatformLayout>
  );
}
