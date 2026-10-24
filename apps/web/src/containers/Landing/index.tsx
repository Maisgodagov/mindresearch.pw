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
  Users,
  Calculator,
  FileText,
  Link2,
  UserRoundCheck,
  ChartNoAxesCombined,
  CirclePause,
  ShieldCheck,
  Download,
} from "lucide-react";
import { getCachedCurrentUser, initializeAuth } from "../../api";
import "./landing.css";

import { DemoMedia } from "./DemoMedia";
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
                участникам было легко отвечать, а вам — работать с результатами.
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
                  Users,
                  Calculator,
                  FileText,
                  Link2,
                  UserRoundCheck,
                  ChartNoAxesCombined,
                  CirclePause,
                  ShieldCheck,
                  Download,
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
                <div className="landing-feature-notes catalogue-benefits">
                  {content.catalogueBenefits.map((item) => (
                    <article key={item.title}>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <section
            id="collect"
            className="landing-section landing-wrap landing-publish"
          >
            <header className="publish-intro">
              <h2>{content.sections[1].title}</h2>
              <p>{content.sections[1].text}</p>
            </header>
            <div className="publish-benefits">
              {content.publishBenefits.map((item, i) => {
                const Icon = [
                  Link2,
                  UserRoundCheck,
                  ChartNoAxesCombined,
                  CirclePause,
                  ShieldCheck,
                  Download,
                ][i];
                return (
                  <article key={item.title}>
                    <Icon size={23} aria-hidden="true" />
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  </article>
                );
              })}
            </div>
            <aside className="publish-quality">
              <ShieldCheck size={26} aria-hidden="true" />
              <div>
                <h3>{content.qualityReview.title}</h3>
                <p>{content.qualityReview.text}</p>
                <p>{content.qualityReview.note}</p>
              </div>
            </aside>
            <div className="publish-footer">
              <span>
                От приглашения до готовой выборки — под вашим контролем.
              </span>
              <Link className="landing-text-link" to={create}>
                Создать опрос
                <ArrowRight size={17} />
              </Link>
            </div>
          </section>
          <section id="respondent" className="landing-respondent landing-wrap">
            <div className="landing-section-heading">
              <h2>{content.sections[2].title}</h2>
              <p>{content.sections[2].text}</p>
            </div>
            <div className="respondent-benefits">
              {content.respondentBenefits.map((item, i) => {
                const Icon = [PanelsTopLeft, CirclePause, Check][i];
                return (
                  <article key={item.title}>
                    <Icon size={22} aria-hidden="true" />
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  </article>
                );
              })}
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
            <div className="results-benefits">
              {content.resultsBenefits.map((item, i) => {
                const Icon = [ListChecks, Eye, ArrowDownUp][i];
                return (
                  <article key={item.title}>
                    <Icon size={22} aria-hidden="true" />
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  </article>
                );
              })}
            </div>
            <Picture
              name="respondents"
              alt="Интерактивная таблица результатов шести вымышленных респондентов с раскрытыми шкалами методики"
            />
          </section>
          <section id="analysis" className="landing-section landing-wrap">
            <div className="landing-section-heading">
              <h2>{content.sections[4].title}</h2>
              <p>{content.sections[4].text}</p>
            </div>
            <div className="analysis-benefits">
              {content.analysisBenefits.map((item, i) => {
                const Icon = [Users, Calculator, Eye, FileText][i];
                return (
                  <article key={item.title}>
                    <Icon size={22} aria-hidden="true" />
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  </article>
                );
              })}
            </div>
            <Picture
              name="analysis"
              alt="Пример готового отчёта по корреляции Пирсона: коэффициент, значимость, доверительный интервал и исходные данные"
            />
          </section>
          <section id="export" className="landing-collaboration landing-wrap">
            <header>
              <h2>{content.sections[5].title}</h2>
              <p>{content.sections[5].text}</p>
            </header>
            <div className="collaboration-benefits">
              {content.collaborationBenefits.map((item, i) => {
                const Icon = [Download, ListChecks, Users, ShieldCheck][i];
                return (
                  <article key={item.title}>
                    <Icon size={23} aria-hidden="true" />
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  </article>
                );
              })}
            </div>
            <Link className="landing-text-link" to={create}>
              Создать исследование <ArrowRight size={17} />
            </Link>
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
    </PlatformLayout>
  );
}
