import { z } from "zod";
const safeUrl = z
  .string()
  .trim()
  .max(2048)
  .transform((value) =>
    value && !/^https?:\/\//i.test(value) ? `https://${value}` : value,
  )
  .refine((value) => {
    if (!value) return true;
    try {
      const url = new URL(value);
      return (
        ["https:", "http:"].includes(url.protocol) &&
        !url.username &&
        !url.password &&
        !!url.hostname &&
        url.hostname.includes(".")
      );
    } catch {
      return false;
    }
  }, "Укажите полную ссылку на сайт (http или https)");
const network = (hosts: string[]) =>
  safeUrl
    .refine((value) => {
      if (!value) return true;
      try {
        const name = new URL(value).hostname.toLowerCase();
        return hosts.some((host) => name === host || name.endsWith("." + host));
      } catch {
        return false;
      }
    }, "Ссылка должна вести на выбранную социальную сеть")
    .default("");
export const profileLinksSchema = z.object({
  instagram: network(["instagram.com"]),
  telegram: network(["t.me", "telegram.me"]),
  youtube: network(["youtube.com", "youtu.be"]),
  vk: network(["vk.com", "vk.ru"]),
  threads: network(["threads.net", "threads.com"]),
  twitter: network(["twitter.com", "x.com"]),
  links: z
    .array(
      z.object({
        label: z.string().trim().min(1).max(80),
        url: safeUrl.refine((value) => !!value, "Укажите ссылку"),
      }),
    )
    .max(5)
    .default([]),
});
export type ProfileLinks = z.infer<typeof profileLinksSchema>;
export function readProfileLinks(value: unknown): ProfileLinks {
  try {
    const result = profileLinksSchema.safeParse(
      typeof value === "string" ? JSON.parse(value) : (value ?? {}),
    );
    if (result.success) return result.data;
  } catch {}
  return profileLinksSchema.parse({});
}
