export type PublicSurvey = {
  id: string;
  slug: string;
  title: string;
  description?: string;
};

export type PublicProfileData = {
  name: string;
  bio?: string;
  avatarSeed?: string;
  surveys: PublicSurvey[];
};
