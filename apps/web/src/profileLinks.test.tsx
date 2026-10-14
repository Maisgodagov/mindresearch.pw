import { expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { LinkedBio, ProfileLinks } from "./components/ProfileLinks";
import { safeHref } from "./profileLinks";
import { titleForPage } from "./pageTitle";
it("renders existing biography URLs as safe links without interpreting HTML", () => {
  const html = renderToStaticMarkup(
    <LinkedBio text={"<b>Текст</b> https://www.b17.ru/person/."} />,
  );
  expect(html).toContain("&lt;b&gt;Текст&lt;/b&gt;");
  expect(html).toContain('href="https://www.b17.ru/person/"');
  expect(html).toContain("noopener noreferrer");
});
it("renders social and named links", () => {
  const html = renderToStaticMarkup(
    <ProfileLinks
      value={{
        telegram: "https://t.me/channel",
        links: [{ label: "Профиль на b17", url: "https://b17.ru/person" }],
      }}
    />,
  );
  expect(html).toContain("Telegram");
  expect(html).toContain("Профиль на b17");
  expect(html).toContain("https://t.me/channel");
});
it.each([
  "javascript:alert(1)",
  "data:text/html,evil",
  "https://user:pass@example.org",
])("rejects unsafe link %s", (url) => expect(safeHref(url)).toBeNull());
it("creates concise semantic titles", () => {
  expect(titleForPage("Марина — автор исследований")).toBe(
    "Марина — автор исследований | mindresearch",
  );
});
