import { describe, it, expect } from "vitest";
import catalog from "../../../../api/src/public-methods/catalog.json";
import { collections, findMethods, methodCount } from "./catalogModel";
describe("public catalogue discovery", () => {
  it("keeps all themes when the catalogue grows", () => {
    const methods = Array.from({ length: 40 }, (_, i) => ({
      ...catalog[0],
      slug: `method-${i}`,
      topic: `Тема ${i}`,
    }));
    expect(collections(methods)).toHaveLength(40);
    expect(findMethods(methods, "Тема 39", "")).toHaveLength(1);
  });
  it("combines theme and case-insensitive search", () => {
    expect(findMethods(catalog, "", "  MSPSS  ")).toHaveLength(1);
    expect(findMethods(catalog, catalog[0].topic, "MSPSS")).toHaveLength(0);
  });
  it("formats Russian counts", () => {
    expect([1, 2, 5, 11, 21].map(methodCount)).toEqual([
      "1 методика",
      "2 методики",
      "5 методик",
      "11 методик",
      "21 методика",
    ]);
  });
});
