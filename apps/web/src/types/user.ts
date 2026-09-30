export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  bio: string | null;
  avatarSeed: string;
  publicSlug: string | null;
  isProfilePublic: boolean;
  createdAt: string;
};
