import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, ClipboardList, Leaf } from "lucide-react";
import { api, useDemoFallbacks } from "../../api";
import { StockAvatar } from "../../components/StockAvatar";
import { demoSurveys, demoUser } from "../../platform/demo";
import { Card, Page, SkeletonScreen } from "../../ui";
import { demoAvatarSeed, publicProfileUnavailableText } from "./const";
import { Hero, ProfileShell, SurveyList } from "./styles";
import type { PublicProfileData, PublicSurvey } from "./types";

export function PublicProfile() {
  const { slug } = useParams();
  const [data, setData] = useState<PublicProfileData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    api.get<PublicProfileData>(`/public/profiles/${slug}`)
      .then(({ data: profile }) => setData(profile))
      .catch(() => {
        if (useDemoFallbacks) {
          setData({
            ...demoUser,
            avatarSeed: demoAvatarSeed,
            surveys: demoSurveys.filter((survey) => survey.status === "active") as PublicSurvey[],
          });
        } else {
          setError(true);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <Page>
      <ProfileShell>
        <div><Leaf size={20} /> mindresearch</div>
        {loading ? (
          <div style={{ marginTop: "8vh" }}><SkeletonScreen variant="public" /></div>
        ) : error ? (
          <Hero><div className="not-found-copy"><h1>Профиль не найден</h1><p>{publicProfileUnavailableText}</p></div></Hero>
        ) : data ? (
          <>
            <Hero>
              <div className="avatar"><StockAvatar seed={data.avatarSeed} alt="Аватар автора" /></div>
              <div><span>Автор исследований</span><h1>{data.name}</h1><p>{data.bio}</p></div>
            </Hero>
            <SurveyList>
              <h2>Открытые опросы</h2>
              {data.surveys.map((survey) => (
                <Card className="survey" key={survey.id}>
                  <ClipboardList />
                  <div><b>{survey.title}</b><span>{survey.description}</span></div>
                  <Link to={`/s/${survey.slug}`}>Пройти <ArrowRight size={14} /></Link>
                </Card>
              ))}
            </SurveyList>
          </>
        ) : null}
      </ProfileShell>
    </Page>
  );
}
