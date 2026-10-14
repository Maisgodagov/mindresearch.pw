import { expect, it } from "vitest";
import { profileLinksSchema, readProfileLinks } from "./profile-links.js";
it("normalizes social URLs and preserves named external links", () => {
  const p = profileLinksSchema.parse({
    telegram: "t.me/example",
    vk: "https://vk.ru/example",
    links: [{ label: "Профиль на b17", url: "www.b17.ru/example/" }],
  });
  expect(p.telegram).toBe("https://t.me/example");
  expect(p.links[0].url).toBe("https://www.b17.ru/example/");
  expect(p.instagram).toBe("");
});
it.each([
  "javascript:alert(1)",
  "data:text/html,<script>",
  "https://user:secret@example.org",
  "https://instagram.com.evil.org/user",
  "https://example.org/user",
])("rejects invalid Instagram URL %s", (instagram) => {
  expect(profileLinksSchema.safeParse({ instagram }).success).toBe(false);
});
it.each([
  { key: "instagram", url: "https://www.instagram.com/person/" },
  { key: "telegram", url: "https://t.me/person" },
  { key: "youtube", url: "https://www.youtube.com/@person" },
  { key: "vk", url: "https://vk.com/person" },
  { key: "threads", url: "https://www.threads.com/@person" },
  { key: "twitter", url: "https://x.com/person" },
])("supports $key", ({ key, url }) => {
  expect(profileLinksSchema.safeParse({ [key]: url }).success).toBe(true);
});
it("limits external links and requires link titles", () => {
  expect(
    profileLinksSchema.safeParse({
      links: [{ label: "", url: "https://example.org" }],
    }).success,
  ).toBe(false);
  expect(
    profileLinksSchema.safeParse({
      links: Array.from({ length: 6 }, () => ({
        label: "Site",
        url: "https://example.org",
      })),
    }).success,
  ).toBe(false);
});
it("supports profiles stored before link settings existed", () => {
  expect(readProfileLinks(null).links).toEqual([]);
  expect(readProfileLinks("{bad json").links).toEqual([]);
  expect(readProfileLinks('{"vk":"https://vk.ru/person"}').vk).toBe(
    "https://vk.ru/person",
  );
});
