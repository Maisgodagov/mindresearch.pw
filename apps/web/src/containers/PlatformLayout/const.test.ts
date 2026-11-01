import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { PlatformSidebar } from "../../components/PlatformSidebar";
import { describe, expect, it } from "vitest";
import { getSidebarLinks } from "./const";
describe("public and private section navigation", () => {
  it("keeps the researcher landing public", () => {
    expect(getSidebarLinks("owner", false).map(link => link.to)).toEqual(["/for-researchers", "/methods/"]);
  });
  it("hides developing sections from researchers", () => {
    const paths = getSidebarLinks("researcher").map(link => link.to);
    expect(paths).toContain("/app/surveys/new");
    expect(paths).toContain("/methods/");
    expect(paths).not.toContain("/app/community");
  });
  it.each(["admin", "owner"])("gives %s access to developing sections", role => {
    const paths = getSidebarLinks(role).map(link => link.to);
    expect(paths).toContain("/methods/");
    expect(paths).toContain("/app/community");
    expect(paths).toContain("/app/admin/public-methods");
    expect(paths.filter(path => path === "/methods/")).toHaveLength(1);
  });
});


it.each(["researcher", "admin", "owner"])("renders the public test catalogue for signed-in %s", role => {
  const html = renderToStaticMarkup(createElement(MemoryRouter, {},
    createElement(PlatformSidebar, {
      collapsed: false,
      links: getSidebarLinks(role),
      onToggle: () => {},
      onLogout: () => {},
    }),
  ));
  expect(html).toContain('href="/methods/"');
  expect(html).toContain("Тесты и методики");
});
