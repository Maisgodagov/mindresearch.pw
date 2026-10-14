export type ProfileLinks = {
  instagram?: string;
  telegram?: string;
  youtube?: string;
  vk?: string;
  threads?: string;
  twitter?: string;
  links: { label: string; url: string }[];
};
export const socialNetworks = [
  {
    key: "instagram",
    label: "Instagram",
    placeholder: "https://instagram.com/имя",
  },
  { key: "telegram", label: "Telegram", placeholder: "https://t.me/канал" },
  {
    key: "youtube",
    label: "YouTube",
    placeholder: "https://youtube.com/@канал",
  },
  { key: "vk", label: "ВКонтакте", placeholder: "https://vk.com/группа" },
  { key: "threads", label: "Threads", placeholder: "https://threads.com/@имя" },
  { key: "twitter", label: "X / Twitter", placeholder: "https://x.com/имя" },
] as const;
export const emptyProfileLinks = (): ProfileLinks => ({ links: [] });
export function safeHref(value: string) {
  try {
    const url = new URL(
      /^https?:\/\//i.test(value) ? value : `https://${value}`,
    );
    return ["http:", "https:"].includes(url.protocol) &&
      !url.username &&
      !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}
