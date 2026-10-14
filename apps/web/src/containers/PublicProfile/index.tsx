import { ProfileLinks, LinkedBio } from "../../components/ProfileLinks";
import { PlatformLayout } from "../PlatformLayout";
import { usePageTitle } from "../../pageTitle";
import { BrandWordmark } from "../../components/BrandWordmark";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, ClipboardList, Leaf } from "lucide-react";
import {
  api,
  useDemoFallbacks,
  initializeAuth,
  hasAccessToken,
} from "../../api";
import { StockAvatar } from "../../components/StockAvatar";
import { demoSurveys, demoUser } from "../../platform/demo";
import { Card, Page, SkeletonScreen } from "../../ui";
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
  const [error, setError] = useState(false);

  useEffect(() => {
    setData(undefined);
    setLoading(true);
    setError(false);
    api
      .get<PublicProfileData>(`/public/profiles/${slug}`)
      .then(({ data: profile }) => setData(profile))
      .catch(() => {
        if (useDemoFallbacks) {
          setData({
            ...demoUser,
            avatarSeed: demoAvatarSeed,
            surveys: demoSurveys.filter(
              (survey) => survey.status === "active",
            ) as PublicSurvey[],
          });
        } else {
          setError(true);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  usePageTitle(
    error
      ? "Профиль не найден"
      : data
        ? `${data.name} — автор исследований`
        : undefined,
  );
  const content = (
    <ProfileShell $embedded={authenticated}>
      {!authenticated && (
        <div className="public-brand">
          <Leaf size={20} /> <BrandWordmark />
        </div>
      )}
      {loading ? (
        <div style={{ marginTop: "8vh" }}>
          <SkeletonScreen variant="public" />
        </div>
      ) : error ? (
        <Hero>
          <div className="not-found-copy">
            <h1>Профиль не найден</h1>
            <p>{publicProfileUnavailableText}</p>
          </div>
        </Hero>
      ) : data ? (
        <>
          <Hero>
            <div className="avatar">
              <StockAvatar seed={data.avatarSeed} alt="Аватар автора" />
            </div>
            <div>
              <span>Автор исследований</span>
              <h1>{data.name}</h1>
              <p>
                <LinkedBio text={data.bio ?? ""} />
              </p>
              <ProfileLinks value={data.profileLinks} />
            </div>
          </Hero>
          <SurveyList>
            <h2>Открытые опросы</h2>
            {data.surveys.map((survey) => (
              <Card className="survey" key={survey.id}>
                <ClipboardList />
                <div>
                  <b>{survey.title}</b>
                  <span>{survey.description}</span>
                </div>
                <Link to={`/s/${survey.slug}`}>
                  Пройти <ArrowRight size={14} />
                </Link>
              </Card>
            ))}
            {!data.surveys.length && <p>У автора пока нет открытых опросов.</p>}
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
