export type Profile = {
  profileLinks:import("../../profileLinks").ProfileLinks;
  name: string;
  email: string;
  role: string;
  bio: string;
  avatarSeed: string;
  publicSlug: string;
  isProfilePublic: boolean;
};
