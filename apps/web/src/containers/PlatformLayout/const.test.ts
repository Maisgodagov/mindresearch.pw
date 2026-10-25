import { describe, expect, it } from "vitest";
import { getSidebarLinks } from "./const";
describe("landing-only release navigation", () => {
 it("shows the public landing to guests and every account role", () => {
  expect(getSidebarLinks("owner", false).map(link => link.to)).toEqual(["/for-researchers"]);
  for (const role of ["researcher", "admin", "owner"]) {
   const paths = getSidebarLinks(role).map(link => link.to);
   expect(paths).toContain("/for-researchers");
   expect(paths).not.toContain("/methods");
   expect(paths).not.toContain("/app/admin/public-methods");
  }
 });
});
