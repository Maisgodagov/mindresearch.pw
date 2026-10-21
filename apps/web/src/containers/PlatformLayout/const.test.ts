import { describe, expect, it } from "vitest";
import { getSidebarLinks } from "./const";
describe("public and authenticated navigation", () => {
  it("exposes only public sections to guests, regardless of a stale role", () => {
    expect(getSidebarLinks("owner", false).map((link) => link.to)).toEqual([
      "/for-researchers",
      "/methods",
    ]);
  });
  it("keeps researcher actions and methods without administrative navigation", () => {
    const paths = getSidebarLinks("researcher").map((link) => link.to);
    expect(paths.indexOf("/for-researchers")).toBe(
      paths.indexOf("/methods") - 1,
    );
    expect(paths).toContain("/methods");
    expect(paths).toContain("/app/surveys/new");
    expect(paths).toContain("/app/profile");
    expect(paths.some((path) => path.startsWith("/app/admin"))).toBe(false);
  });
  it("keeps role-specific navigation and adds methods once", () => {
    const paths = getSidebarLinks("admin").map((link) => link.to);
    expect(paths).toContain("/app/admin/public-methods");
    expect(paths.filter((path) => path === "/methods")).toHaveLength(1);
    expect(paths.at(-1)).toBe("/app/profile");
  });
});
