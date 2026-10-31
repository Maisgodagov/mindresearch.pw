import { describe, expect, it } from "vitest";
import { getSidebarLinks } from "./const";
describe("unreleased section navigation", () => {
  it("keeps the researcher landing public", () => {
    expect(getSidebarLinks("owner", false).map(link => link.to)).toEqual(["/for-researchers"]);
  });
  it("hides developing sections from researchers", () => {
    const paths = getSidebarLinks("researcher").map(link => link.to);
    expect(paths).toContain("/app/surveys/new");
    expect(paths).not.toContain("/methods");
    expect(paths).not.toContain("/app/community");
  });
  it.each(["admin", "owner"])("gives %s access to developing sections", role => {
    const paths = getSidebarLinks(role).map(link => link.to);
    expect(paths).toContain("/methods");
    expect(paths).toContain("/app/community");
    expect(paths).toContain("/app/admin/public-methods");
    expect(paths.filter(path => path === "/methods")).toHaveLength(1);
  });
});
