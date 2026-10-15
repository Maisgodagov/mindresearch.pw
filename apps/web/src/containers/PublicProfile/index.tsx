import { ProfileLinks, LinkedBio } from "../../components/ProfileLinks";
import { PlatformLayout } from "../PlatformLayout";
import { usePageTitle } from "../../pageTitle";
import { BrandWordmark } from "../../components/BrandWordmark";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ClipboardList, Leaf } from "lucide-react";
import {
  api,
  useDemoFallbacks,
  initializeAuth,
  hasAccessToken,
} from "../../api";
import { StockAvatar } from "../../components/StockAvatar";
import { demoSurveys, demoUser } from "../../platform/demo";
import { Page, SkeletonScreen } from "../../ui";
import { demoAvatarSeed, publicProfileUnavailableText } from "./const";
import { Hero, ProfileShell, SurveyList } from "./styles";
import type { PublicProfileData, PublicSurvey } from "./types";

export function PublicProfile() {
  const { slug } = useParams();
  const [data, setData] = useState<PublicProfileData>();
  const [authenticated, setAuthenticated] = useState(hasAccessToken);
  useEffect(() => {
    let live = true;
    const check = () => {
      void initializeAuth()
        .then((token) => {
          if (live) setAuthenticated(!!token);
        })
        .catch(() => {});
    };
    const ended = () => setAuthenticated(false);
    check();
    window.addEventListener("mindresearch:authenticated", check);
    window.addEventListener("mindresearch:session-ended", ended);
    return () => {
      live = false;
      window.removeEventListener("mindresearch:authenticated", check);
      window.removeEventListener("mindresearch:session-ended", ended);
    };
  }, []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<"unavailable" | "network" | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let live = true;
    setData(undefined);
    setLoading(true);
    setError(null);
    api
      .get<PublicProfileData>(`/public/profiles/${slug}`)
      .then(({ data: profile }) => {
        if (live) setData(profile);
      })
      .catch((failure: unknown) => {
        if (!live) return;
        if (useDemoFallbacks) {
          setData({
            ...demoUser,
            avatarSeed: demoAvatarSeed,
            surveys: demoSurveys.filter(
              (survey) => survey.status === "active",
            ) as PublicSurvey[],
          });
        } else {
          const status = (failure as { response?: { status?: number } })
            .response?.status;
          setError(status === 404 ? "unavailable" : "network");
        }
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, [slug, retry]);

  usePageTitle(
    error
      ? error === "unavailable"
        ? "Профиль не найден"
        : "Профиль автора"
      : data
        ? `${data.name} — автор исследований`
        : undefined,
  );
  const content = (
    <ProfileShell $embedded={authenticated}>
      {!authenticated && (
        <Link
          className="public-brand"
          to="/"
          aria-label="Главная страница mindresearch"
        >
          <Leaf size={23} />
          <BrandWordmark inline />
        </Link>
      )}
      {loading ? (
        <div className="profile-loading">
          <SkeletonScreen variant="public" />
        </div>
      ) : error ? (
        <div className="profile-state">
          <h1>
            {error === "unavailable"
              ? "Профиль не найден"
              : "Не удалось загрузить профиль"}
          </h1>
          <p>
            {error === "unavailable"
              ? publicProfileUnavailableText
              : "Проверьте подключение к интернету и попробуйте ещё раз."}
          </p>
          {error === "network" ? (
            <button
              type="button"
              className="state-action"
              onClick={() => setRetry((value) => value + 1)}
            >
              Попробовать снова
            </button>
          ) : (
            <Link className="back-link" to="/">
              <ArrowLeft size={16} />
              На главную
            </Link>
          )}
        </div>
      ) : data ? (
        <>
          <Hero aria-label="Об авторе">
            <div className="avatar">
              <StockAvatar seed={data.avatarSeed} alt="Аватар автора" />
            </div>
            <div className="author-name">
              <h1>{data.name}</h1>
              <p className="author-role">
                Автор исследований{slug && <span>@{slug}</span>}
              </p>
            </div>
            {data.bio?.trim() && (
              <p className="author-bio">
                <LinkedBio text={data.bio} />
              </p>
            )}
            <div className="author-links">
              <ProfileLinks value={data.profileLinks} />
            </div>
          </Hero>
          <SurveyList aria-labelledby="open-surveys-heading">
            <header className="surveys-heading">
              <div>
                <h2 id="open-surveys-heading">
                  Открытые опросы
                  <span
                    className="survey-count"
                    aria-label={`Всего опросов: ${data.surveys.length}`}
                  >
                    {data.surveys.length}
                  </span>
                </h2>
                {data.surveys.length > 0 && (
                  <p>Выберите исследование, чтобы принять участие.</p>
                )}
              </div>
            </header>
            {data.surveys.length ? (
              <ul className="surveys">
                {data.surveys.map((survey) => (
                  <li className="survey" key={survey.id}>
                    <ClipboardList
                      className="survey-icon"
                      size={22}
                      aria-hidden="true"
                    />
                    <div className="survey-copy">
                      <h3>{survey.title}</h3>
                      {survey.description?.trim() && (
                        <p>{survey.description}</p>
                      )}
                    </div>
                    <Link
                      className="survey-start"
                      to={`/s/${survey.slug}`}
                      aria-label={`Пройти опрос «${survey.title}»`}
                    >
                      Пройти опрос
                      <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-surveys">
                <h3>Открытых опросов пока нет</h3>
                <p>Когда автор опубликует исследование, оно появится здесь.</p>
              </div>
            )}
          </SurveyList>
        </>
      ) : null}
    </ProfileShell>
  );
  return authenticated ? (
    <PlatformLayout>{content}</PlatformLayout>
  ) : (
    <Page>{content}</Page>
  );
}
