import { describe, it, expect } from "vitest";
import catalog from "../../../../api/src/public-methods/catalog.json";
import { collections, findMethods, methodCount, sectionForTopic } from "./catalogModel";
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
  it("combines selected topics with OR and search with AND", () => {
    const selected = ["Самооценка", "Цифровые привычки"];
    expect(findMethods(catalog, selected, "")).toHaveLength(4);
    expect(findMethods(catalog, selected, "FoMO")).toHaveLength(1);
    expect(findMethods(catalog, selected, "MSPSS")).toHaveLength(0);
    expect(sectionForTopic("Новая тема")).toBe("Другие темы");
  });
});
