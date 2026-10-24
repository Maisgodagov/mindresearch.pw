import { PlatformLayout } from "../PlatformLayout";
import content from "../../../../api/src/data/researcherLanding.json";
import { LandingMetadata } from "./LandingMetadata";
import { BrandWordmark } from "../../components/BrandWordmark";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Leaf,
  Plus,
  PanelsTopLeft,
  ListChecks,
  ArrowDownUp,
  Eye,
} from "lucide-react";
import { getCachedCurrentUser, initializeAuth } from "../../api";
import "./landing.css";

import { DemoMedia, DemoProvider } from "./DemoMedia";
import { ResearchIntro } from "./ResearchIntro";
const Picture = DemoMedia;

export function Landing() {
  const [signedIn, setSignedIn] = useState(Boolean(getCachedCurrentUser()));
  useEffect(() => {
    let active = true;

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
      <LandingMetadata />
      <DemoProvider>
        <div className="landing landing-in-app">
          <div className="landing-content">
            <section className="landing-hero landing-wrap">
              <ResearchIntro create={create} />
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
              className="landing-section landing-wrap landing-builder-features"
            >
              <div className="builder-feature-intro">
                <h2>
                  Конструктор опросов <em>под ваше исследование</em>
                </h2>
                <p className="landing-lead">
                  От готовой методики до собственной анкеты — соберите нужные
                  инструменты в одном опросе. Настройте детали один раз, чтобы
                  участникам было легко отвечать, а вам — работать с
                  результатами.
                </p>
                <Link className="landing-text-link" to={create}>
                  Создать опрос для исследования
                  <ArrowRight size={17} />
                </Link>
              </div>
              <div className="builder-feature-list">
                {content.features.map((feature, i) => {
                  const Icon = [
                    ListChecks,
                    PanelsTopLeft,
                    Leaf,
                    ArrowDownUp,
                    Check,
                    Eye,
                  ][i];
                  return (
                    <article key={feature.title}>
                      <Icon size={22} aria-hidden="true" />
                      <div>
                        <h3>{feature.title}</h3>
                        <p>{feature.text}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
            <section id="catalog" className="landing-catalog">
              <div className="landing-wrap">
                <div className="landing-section-heading">
                  <h2>{content.sections[0].title}</h2>
                  <p>{content.sections[0].text}</p>
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
            <section className="landing-section landing-wrap landing-publish">
              <div>
                <h2>{content.sections[1].title}</h2>
              </div>
              <div className="landing-publish-copy">
                <p className="landing-lead">{content.sections[1].text}</p>
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
            </section>
            <section
              id="respondent"
              className="landing-respondent landing-wrap"
            >
              <div className="landing-section-heading">
                <h2>{content.sections[2].title}</h2>
                <p>{content.sections[2].text}</p>
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
                <h2>{content.sections[3].title}</h2>
                <p>{content.sections[3].text}</p>
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
                    <h3>Шкалы рассчитаны, ответы под рукой</h3>
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
                    <h3>Нужные участники и методики в Excel</h3>
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
                <h2>{content.sections[4].title}</h2>
                <p>{content.sections[4].text}</p>
              </div>
              <Picture
                name="analysis"
                alt="Статистический анализ на демонстрационных данных"
              />
              <div className="landing-analysis-notes">
                <article>
                  <h3>От описания выборки до проверки гипотез</h3>
                  <p>
                    Описывайте распределение результатов, проверяйте различия
                    между группами, изучайте связи показателей. Перед запуском
                    проверьте состав выборки и данные, которые войдут в расчёт.
                  </p>
                </article>
                <article>
                  <h3>Каждый расчёт можно проверить</h3>
                  <p>
                    Откройте формулы, исходные значения и параметры анализа.
                    Сохранённый отчёт фиксирует данные на момент запуска: к нему
                    можно вернуться и сопоставить с другими расчётами.
                  </p>
                </article>
              </div>
            </section>
            <section className="landing-collaboration landing-wrap">
              <h2>{content.sections[5].title}</h2>
              <p>{content.sections[5].text}</p>
              <Link className="landing-text-link" to="/methods">
                Познакомиться с публичными методиками
                <ArrowRight size={16} />
              </Link>
            </section>
            <section className="landing-extras landing-wrap">
              <article>
                <h3>Расскажите участникам об исследователе</h3>
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
              <h2>Вопросы о создании опросов и анализе данных</h2>
              {content.faq.map(([q, a]) => (
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
              <p>
                Создайте онлайн-опрос, соберите выборку и переходите к анализу
                данных — в одном рабочем пространстве.
              </p>
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
